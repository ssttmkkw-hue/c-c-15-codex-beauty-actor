# Round 1 research

## kk’s theater references

I inspected the local checkouts and read the READMEs and the actor, scene, and speech entry points. The new short is implemented independently.

| Project | Finding applied here |
| --- | --- |
| [c-c-5-ai-theater](https://github.com/ssttmkkw-hue/c-c-5-ai-theater) | The performance schema puts speaker, text, emotion, gesture, and pause on the same beat. That maps cleanly to a fixed six-line scene. The silent timing fallback is also worth preserving. |
| [c-c-6-live-theater](https://github.com/ssttmkkw-hue/c-c-6-live-theater) | The actor layers idle breathing, emotional posture and directed gestures. The camera holds dialogue shots and cuts in for stronger beats. The new composer uses those principles for portrait motion and uses the panel to try the same cues by hand. |
| [c-c-7-codex-live-theater](https://github.com/ssttmkkw-hue/c-c-7-codex-live-theater) | A debug hook makes visual regressions reproducible. A local media track can replace platform-dependent browser voices for a fixed scene and make the captured dialogue frames repeatable. |

## Rendering options

- **VRM and MToon.** MToon exposes discrete shadow treatment, outlines, rim lighting and material parameters. VRM also offers a standard humanoid rig with expressions and spring bones. Redistribution is an asset-level setting and must be checked for the exact file, including costumes and textures. The renderer’s license does not grant rights to the models. [pixiv MToon API](https://pixiv.github.io/three-vrm/docs/classes/three-vrm-materials-mtoon.MToonMaterial.html) · [VRM metadata license](https://vrm.dev/en/vrm/meta/license/) · [VRM 1.0 license](https://vrm.dev/en/licenses/1.0/)
- **Procedural 3D.** A gradient map can return banded light, with an outline pass and a separately tuned rim. It supports freely moving cameras and full-body blocking. For this round, custom facial meshes, eyelid shapes, lashes, hair clumps and skin weighting would also have to hold up at portrait scale. [Three.js MeshToonMaterial](https://threejs.org/docs/#api/en/materials/MeshToonMaterial)
- **Layered 2D.** Registered illustration plates keep the cel shadows and individual hair strands consistent through all six wardrobes. SVG provides local masks, paths and independent transforms for small facial and hair motions. CSS keeps the set and color grade apart from the foreground art. [SVG clipping](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/clipPath) · [SVG effects](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/Applying_SVG_effects_to_HTML_content)
- **Cinematography and timing.** A softer enlarged set, sharp characters, foreground particles, and a low-contrast edge vignette give depth at low rendering cost. Browser-native animation timestamps support frame-driven effects, while media time can locate the current subtitle and mouth pose after pause or seek. [Animation performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance) · [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) · [HTML media time](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime)
- **Mandarin playback.** The six lines can be synthesized once with two speakers from a licensed model. Using the waveform for mouth opening captures pauses, accents and syllable energy. Pinyin finals provide rounded or spread targets and bilabials provide partial closure. This is approximate within each clause and can be upgraded with alignment. [Sherpa-ONNX model catalog](https://k2-fsa.github.io/sherpa/onnx/tts/pretrained_models/vits.html) · [AISHELL-3 model](https://huggingface.co/csukuangfj/icefall-tts-aishell3-vits-low-2024-04-06)
