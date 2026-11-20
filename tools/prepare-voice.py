"""Render the bundled Mandarin demo. Requires sherpa-onnx, NumPy, Node and FFmpeg."""
import argparse
import json
from pathlib import Path
import re
import subprocess
import tempfile
import wave

import numpy as np
import sherpa_onnx as sherpa

ROOT = Path(__file__).resolve().parents[1]
VOICES = {"male": (10, .81), "female": (6, .84)}
STEP = .025


def source():
    code = "import { beats } from './src/scenes.js'; console.log(JSON.stringify(beats))"
    return json.loads(subprocess.check_output(["node", "--input-type=module", "-e", code], cwd=ROOT))


def engine(directory):
    vits = sherpa.OfflineTtsVitsModelConfig(
        model=str(directory / "model.onnx"),
        tokens=str(directory / "tokens.txt"),
        lexicon=str(directory / "lexicon.txt"),
        noise_scale=.43,
        noise_scale_w=.45,
    )
    model = sherpa.OfflineTtsModelConfig(vits=vits, num_threads=2)
    return sherpa.OfflineTts(sherpa.OfflineTtsConfig(model=model))


def trim(samples, rate):
    peak = np.max(np.abs(samples))
    starts = np.flatnonzero(np.abs(samples) > max(.003, peak * .018))
    if not len(starts):
        raise ValueError("Empty speech")
    samples = samples[max(0, starts[0] - int(.027 * rate)):starts[-1] + int(.045 * rate)]
    taper = min(int(.012 * rate), len(samples) // 2)
    samples[:taper] *= np.linspace(0, 1, taper)
    samples[-taper:] *= np.linspace(1, 0, taper)
    quiet = min(2.4, .76 / peak)
    return samples * quiet


def render(tts, beats):
    rate = tts.sample_rate
    sound = []
    manifest = []
    elapsed = 0
    for i, beat in enumerate(beats):
        speaker, speed = VOICES[beat["actor"]]
        phrases = re.findall(r"[^，。？]+[，。？]?", beat["zh"])
        phonetics = re.split(r"\s*/\s*", beat["pinyin"])
        lead = .32 if i == 0 else .19
        blocks = [np.zeros(round(lead * rate))]
        clauses = []
        for phrase, romanized in zip(phrases, phonetics, strict=True):
            lead_in = sum(map(len, blocks))
            audio = tts.generate(phrase, sid=speaker, speed=speed)
            pcm = trim(np.array(audio.samples), rate)
            blocks.append(pcm)
            clauses.append([round(lead_in / rate, 4), round((lead_in + len(pcm)) / rate, 4), romanized.split()])
            if phrase != phrases[-1]:
                blocks.append(np.zeros(round(rate * (.27 if phrase.endswith("。") else .17))))
        blocks.append(np.zeros(round(rate * (1.12 if i == len(beats) - 1 else .52))))
        pcm = np.concatenate(blocks)
        samples_per_frame = round(STEP * rate)
        windows = [pcm[a:a + samples_per_frame] for a in range(0, len(pcm), samples_per_frame)]
        loudness = np.array([np.sqrt(np.mean(x ** 2)) for x in windows])
        ceiling = max(.035, np.quantile(loudness[loudness > .003], .83))
        values = np.clip((loudness - .004) / ceiling, 0, 1) ** .66
        envelope = "".join(format(round(value * 15), "x") for value in values)
        manifest.append({"start": round(elapsed, 4), "clauses": clauses, "envelope": envelope})
        elapsed += len(pcm) / rate
        sound.append(pcm)
    return rate, np.concatenate(sound), {"duration": round(elapsed, 4), "step": STEP, "lines": manifest}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("model", type=Path, help="Extracted vits-icefall-zh-aishell3 folder")
    args = parser.parse_args()
    rate, samples, timings = render(engine(args.model), source())
    with tempfile.TemporaryDirectory() as temp:
        path = Path(temp) / "scene.wav"
        with wave.open(str(path), "wb") as wav:
            wav.setparams((1, 2, rate, 0, "NONE", "not compressed"))
            wav.writeframes((np.clip(samples, -1, 1) * 32767).astype("<i2").tobytes())
        subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", path,
                        "-ar", "24000", "-c:a", "libmp3lame", "-b:a", "48k",
                        ROOT / "public/voice/before-sunset.mp3"], check=True)
    (ROOT / "src/voice-timing.json").write_text(json.dumps(timings, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
