# Round log

## Round 1 · 2026-11-20

- Built the first playable cut of 《等风的人》, a 22.8-second Mandarin scene with six cues, two voices, bilingual subtitles, and automatic cuts. The browser studio has two original illustrated leads, three outfits and six expressions each, three framings, two animated sets, and three short gestures. Added the research, design, and credits documents.
- Saved and visually checked 31 `r1-*.png` files in `/workspace/codex-beauty-shots/`. The set includes the full panel, both close-ups, the two-shot, all six wardrobes, ten expression close-ups, a blink, the rain set, a mobile view, and eight frames covering both clauses of the first line. The sequence has eight distinct mouth shapes.
- Replaced the draft eyelid overlays with registered closed-eye art, improved the mouth blend, widened costume views, and switched automatic framing changes to cuts. Recaptured the screenshots after those fixes.
- The final Vite 8.3.8 production build passed. Playwright verified the build at a nested base path, dialogue, mute, subtitles, script jumps, pause, replay, the end of the scene, and responsive control layout. A separate test at 320 px blocked the audio file and verified that the scene continued with subtitles. The final dependency audit reported zero known vulnerabilities.
- Measured **60.0 FPS** during playback at 1440 × 960 using headless Playwright Chromium with SwiftShader flags. The page counted 301 `requestAnimationFrame` callbacks in 5.016 seconds. The 95th-percentile frame interval was 16.7 ms. This is a software-rendering baseline, with particles painted separately at up to 45 Hz.
- Known limits for Round 2. Mouth timing is based on audio energy and approximate within-clause syllable timing. Gestures are upper-body portrait motions. The three-quarter view uses the perspective painted into the sprites, with camera framing and roll.

## Round 2 critique

I reran the production capture and opened the Round 1 panel, two-shot, both lead portraits, expression tests, a spoken frame, the navy dress, the rain setup and the mobile layout.

- The two-shot looks like two character cards against a stock sunset. His gaze plays to camera while she looks into the gap. Their shoulders end on ruler-straight vertical cuts, especially obvious in the rain setup and the navy dress. The giant pink sky, scattered confetti and matching scale flatten the space between the two bodies.
- The resting portraits are the prettiest frames. As soon as a character talks, the lips turn into a dark chip pasted over a soft, airbrushed patch. Surprise makes the same chip into a diamond. The close-up exaggerates the difference between the finely illustrated eyes and the generic vector mouths. Sadness has neutral brows and two symmetrical white teardrop stickers. Smile and shyness barely change the eyes, and her blush is almost fluorescent.
- The close-ups are center punches with the same radius of background blur. Eyes and mouth share a glare-heavy pink wash with the backdrop. The rain version just dims the sunlit portraits against blue scenery. The old peach rim still reads as sunset, and none of the signs appears to light the cast.
- The subtitle gradient muddies the wardrobe in the lower third. Two opaque corner labels and a viewfinder overlay make the stage read like a screenshot from an editor. On mobile the control grid squeezes wardrobe and camera names into a narrow column, and the English subtitle competes with the Chinese line for the little space available.

## Round 2 · 2026-11-20

- Reframed the solo portraits and brought the two-shot shoulders together. Painted a new sidelong gaze for 沈亦然 and kept the hair and eye detail sharp by feathering only the edges of the costume plates. Regraded dusk, redrew the petals, and used separate bokeh behind the cast. The rain set now applies blue and pink light within the character silhouettes.
- Added painted smile and sadness poses for both leads, natural lash-line highlights, and a single traveling tear. Reworked the spoken lip paths and added Pinyin vowel transitions and closures timed to the recorded dialogue. Moved gestures and reactions onto specific moments within the cue.
- Moved the framing labels below the image and softened the subtitle shading. Added wardrobe previews, enlarged narrow-screen controls, and added a way to return to the paused cue after posing the cast.
- Captured 34 `r2-*.png` files in `/workspace/codex-beauty-shots/`. The set includes both lead close-ups, the two-shot, six outfits, ten expression close-ups, a blink, two frames from later in the scene, the rain two-shot and close-up, desktop and mobile controls, and eight frames with distinct mouth shapes from the first line.
- The Vite production build passed. Playwright ran the screenshot suite from a nested base path and verified transport, subtitles, wardrobe and expression selection, gesture response, script jumps and return to the paused cue. A separate 320 px check verified keyboard controls, reduced motion and continued playback after blocking the MP3.
- At 1440 × 960, headless Chromium with SwiftShader measured **59.6 FPS on the rooftop** (299 `requestAnimationFrame` callbacks in 5.016 seconds, p95 interval 16.8 ms) and **50.0 FPS on the rain street** (251 in 5.017 seconds, p95 33.4 ms). These are software-rendering baselines during scene playback.
- Remaining limits. Mouth timing estimates syllable boundaries within each clause. Fine mouth movement still uses SVG shapes, and the isolated portrait framing uses the original painted perspective. Gestures move the portrait and foreground strands, with larger head turns and hand acting left for additional art.
