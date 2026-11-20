# Design · 等风的人

## Art direction

The story is set in the brief window between the last light and departure. A saturated peach horizon and lavender shadows frame the first look. Black plum and amber define 沈亦然, with a sharp shoulder line and warm reflected light. 林晚栀 has rose-violet eyes, warmer plum hair and a softer silhouette. Her pearl earring and silver star carry through wardrobe changes. The blue-hour rain set adds an alternate cool grade, glossy street reflections and drifting near-field rain.

The two-shot leaves negative space between the two eyelines. The close-up softens the city and favors eyes and breath. The three-quarter composition shifts the portrait off center and shows the cut of the costume. Subtitle nameplates, Chinese serif type, and a secondary English line mimic an episode master while giving the portrait most of the frame.

## Why layered 2D

For short, portrait-driven shots, a registered set of hand-directed original illustrations gave us the skin, inked lashes, sharp cel-shadow edges, and individual highlighted hair strands visible at the intended size. Image generation was used during asset authoring. SVG and Canvas animate those assets locally. The rig has a fixed illustrated perspective, so the shot choices control crop, camera offset, and roll. A genuine orbit or a full-body turn would require additional directional art or a 3D rig. This round includes zero imported VRM models.

## Architecture

| Component | Implementation |
| --- | --- |
| Scene and cues | `src/scenes.js` carries script, cue-matched Pinyin, speaker, reaction, shot and gesture. The director composes these cues with wardrobe, chosen set and manual controls. |
| Portrait rig | `src/rig.js` renders aligned WebP wardrobe plates, registered artwork for eyelids and expressions, custom SVG mouth paths, blush and tear layers, and gently moving illustrated foreground strands. Breathing and body sway are continuously sampled. Nod, tilt, and lean are short additive motions. |
| Camera and lighting | CSS frames the actors around their eyes and shoulders. Set blur, screen-blended bloom, a foreground grade and a second wash for the rain scene create separation and soft light. The most detailed lines and highlights are baked into the original portraits. |
| Particles | Two Canvas 2D layers straddle the cast. Seeded petal, rain and bokeh positions can be sampled at a fixed time for capture. Backing resolution is capped at 1.5×, and particle painting is capped at 45 updates per second. |
| Dialogue | `public/voice/before-sunset.mp3` is an offline-rendered two-speaker track. `tools/prepare-voice.py` slices each cue into timed clauses and emits the 25 ms loudness envelope used with Pinyin mouth targets. The director samples media time while playing and uses elapsed time if playback fails. Seeking updates subtitles, gestures, and mouth pose together. |
| Interface and QA | The director’s panel uses native controls and supports keyboard focus. Reduced motion suppresses ambient movement without disabling dialogue. `tools/shots.mjs` drives the production preview with the round’s capture hook and checks transport, controls, and responsive layout. |

To regenerate the dialogue after changing the script, install `sherpa-onnx` and `numpy` into a Python environment, make FFmpeg available, and run `python tools/prepare-voice.py /path/to/vits-icefall-zh-aishell3` with the extracted model directory. The script writes the MP3 and the manifest together. [Model archive](https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-icefall-zh-aishell3.tar.bz2)

## Next rounds

- **Round 2 · Acting.** Draw expressive mouth corners and closed-open transitions that share the same rendering as the portraits. Align Mandarin syllables to the rendered audio, annotate holds and eye darts, and add tested hand and shoulder poses for a few marked beats. Compare the same two emotional close-ups side by side.
- **Round 3 · Cinematography.** Add reverse-angle art and closer eyeline continuity, refine the lighting match between actors and both sets, and polish the final edit. Run the full capture set on desktop and mobile. Compare performance on SwiftShader and hardware-accelerated devices if available.
