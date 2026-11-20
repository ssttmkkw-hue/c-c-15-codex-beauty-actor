# Round log

## Round 1 · 2026-11-20

- Built the first playable cut of 《等风的人》, a 22.8-second Mandarin scene with six cues, two voices, bilingual subtitles, and automatic cuts. The browser studio has two original illustrated leads, three outfits and six expressions each, three framings, two animated sets, and three short gestures. Added the research, design, and credits documents.
- Saved and visually checked 31 `r1-*.png` files in `/workspace/codex-beauty-shots/`. The set includes the full panel, both close-ups, the two-shot, all six wardrobes, ten expression close-ups, a blink, the rain set, a mobile view, and eight frames covering both clauses of the first line. The sequence has eight distinct mouth shapes.
- Replaced the draft eyelid overlays with registered closed-eye art, improved the mouth blend, widened costume views, and switched automatic framing changes to cuts. Recaptured the screenshots after those fixes.
- The final Vite 8.3.8 production build passed. Playwright verified the build at a nested base path, dialogue, mute, subtitles, script jumps, pause, replay, the end of the scene, and responsive control layout. A separate test at 320 px blocked the audio file and verified that the scene continued with subtitles. The final dependency audit reported zero known vulnerabilities.
- Measured **60.0 FPS** during playback at 1440 × 960 using headless Playwright Chromium with SwiftShader flags. The page counted 301 `requestAnimationFrame` callbacks in 5.016 seconds. The 95th-percentile frame interval was 16.7 ms. This is a software-rendering baseline, with particles painted separately at up to 45 Hz.
- Known limits for Round 2. Mouth timing is based on audio energy and approximate within-clause syllable timing. Gestures are upper-body portrait motions. The three-quarter view uses the perspective painted into the sprites, with camera framing and roll.
