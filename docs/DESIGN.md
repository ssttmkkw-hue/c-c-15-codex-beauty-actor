# Design · 等风的人

## Art direction

The story is set in the brief window between the last light and departure. A warm peach horizon sits between muted plum shadows and a low, soft glow. Black plum and amber define 沈亦然, with a sharp shoulder line and warm reflected light. 林晚栀 has rose-violet eyes, warmer plum hair and a softer silhouette. Her pearl earring and silver star carry through wardrobe changes. On the street, blue light from the open center meets pink storefront light at the edges of the cast. The signs, wet pavement and foreground rain carry the same palette.

The two-shot leaves room between the faces and brings their shoulders together at the bottom of the frame. His painted sidelong glance meets her existing leftward gaze. Solo close-ups place the leads on opposite sides of the screen, with a softer city plate and concentrated bokeh below the eyeline. The off-axis portrait shows more costume. Chinese serif dialogue leads the captions, with a smaller English line and speaker name. The set and shot indicators sit below the image.

## Why layered 2D

For short, portrait-driven shots, a registered set of hand-directed original illustrations gave us the skin, inked lashes, sharp cel-shadow edges, and individual highlighted hair strands visible at the intended size. Image generation was used during asset authoring. SVG and Canvas animate those assets locally. The rig has a fixed illustrated perspective, so the shot choices control crop, camera offset, and roll. A genuine orbit or a full-body turn would require additional directional art or a 3D rig. This round includes zero imported VRM models.

## Architecture

| Component | Implementation |
| --- | --- |
| Scene and cues | `src/scenes.js` carries the script, clause-matched Pinyin, cut, reaction, eyeline and gesture timing. Holds and gestures key off each cue’s audio time. |
| Portrait rig | `src/rig.js` combines registered wardrobe plates with painted eyelids, smile and sadness patches, a sidelong gaze, translucent tears, soft blush and wind-tossed strands. Breathing and body sway run continuously. Nod, tilt and lean ease in and settle. |
| Camera and lighting | CSS positions the actors and blurs the plate by shot size. A soft stage grade keeps the faces separate from the skyline. A color matrix and silhouette-masked sign light shift the same costume plates into the night palette. |
| Particles | Two Canvas 2D layers carry slow, flipping petals, faster slanted rain and a separate field of defocused city lights. Seeded positions can be sampled at a fixed time for capture. Backing resolution is capped at 1.5×, and particle painting is capped at 45 updates per second. |
| Dialogue | `public/voice/before-sunset.mp3` is the offline-rendered two-speaker track. `tools/prepare-voice.py` writes clause boundaries and the 25 ms loudness envelope. `src/speech.js` estimates syllable joins from local dips in that envelope and blends Pinyin mouth targets, including closures, round vowels and diphthongs. SVG paths render lips, mouth interior and highlights. Playback and seeking use media time, with elapsed time as a fallback. |
| Interface and QA | The native control buttons include costume thumbnails and a return to the paused cue. Reduced motion suppresses ambient movement and keeps dialogue. `tools/shots.mjs` captures and verifies the production preview, including transport, face poses, controls and responsive layout. |

## Round 2 artwork

The new assets in `public/art/` are `male-eyes-partner.webp` and the `male` and `female` pairs of `eyes-smile`, `mouth-smile`, `eyes-sad`, and `mouth-sad` WebPs. The original close-ups provided the character references for the built-in OpenAI ImageGen tool. The working prompts asked for the same portrait scale, dusk rim, overlapping hair and costume, with three targeted changes.

- **Smile, both leads.** Paint a private, close-lipped smile with one corner slightly higher, a gentle lift in the lower eyelid and a small brow release. Preserve the amber and violet irises, original skin tones and painted lip highlights.
- **Sadness, both leads.** Raise the inner brows, lower the gaze and add a thin, naturally wet lower lash line. Keep the eye color, head pose and framing. The rig supplies the moving tear.
- **Partner eyeline, male lead.** Keep both almond eyelids and the original amber iris details, and shift both pupils toward screen right, exposing more white on the screen-left side of each eye.

The exported eye and mouth regions were aligned to a stable nose landmark, color-matched to the existing portraits, and feathered into the reference texture. The browser reads the registered WebPs directly.

To regenerate the dialogue after changing the script, install `sherpa-onnx` and `numpy` into a Python environment, make FFmpeg available, and run `python tools/prepare-voice.py /path/to/vits-icefall-zh-aishell3` with the extracted model directory. The script writes the MP3 and the manifest together. [Model archive](https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-icefall-zh-aishell3.tar.bz2)

## Round 3

Add directional art for true reverse angles, develop a hand or shoulder insert for the ticket reveal, and polish the edit. The current speech alignment estimates boundaries within each recorded clause. Hand-marked phoneme timing and painted key mouth shapes would support closer cuts.
