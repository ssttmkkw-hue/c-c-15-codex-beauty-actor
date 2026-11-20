# Credits and licenses

## Project assets

- The six wardrobe portraits, two scene plates, and registered eye and lip patches in `public/art/` were created for this project with OpenAI ImageGen from original prompts and this project’s own portrait references. The output rights between OpenAI and the user are described in the terms. [OpenAI Terms of Use](https://openai.com/policies/terms-of-use/) · [OpenAI Services Agreement](https://openai.com/policies/services-agreement/)
- The screenplay 《等风的人》, English subtitle adaptation, rig paths, particles, and interface icons are original project work. The CSS uses system font fallbacks. No fonts or VRM assets are bundled.
- The bundled MP3 is newly synthesized dialogue from the original screenplay using an Apache-2.0 checkpoint derived from the Apache-2.0 AISHELL-3 corpus. The checkout contains the rendered dialogue and timing data. [Icefall AISHELL-3 VITS model card](https://huggingface.co/csukuangfj/icefall-tts-aishell3-vits-low-2024-04-06) · [AISHELL-3 release](https://www.openslr.org/93/) · [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Tooling

| Library or tool | License and source |
| --- | --- |
| Vite 8 | MIT, with notices and licenses for bundled dependencies upstream. [Vite 8.3.8](https://github.com/vitejs/vite/releases/tag/v8.3.8) · [Vite license and notices](https://github.com/vitejs/vite/blob/main/packages/vite/LICENSE.md) |
| Vite build dependencies | MIT · [Rolldown](https://github.com/rolldown/rolldown) · [Rolldown plugin utilities](https://github.com/rolldown/plugins) · [Oxc types](https://github.com/oxc-project/oxc) · [PostCSS](https://github.com/postcss/postcss) · [picomatch](https://github.com/micromatch/picomatch) · [tinyglobby](https://github.com/SuperchupuDev/tinyglobby) · [fdir](https://github.com/thecodrr/fdir) · [Nano ID](https://github.com/ai/nanoid). MPL-2.0 · [Lightning CSS](https://github.com/parcel-bundler/lightningcss). Apache-2.0 · [detect-libc](https://github.com/lovell/detect-libc). BSD-3-Clause · [source-map-js](https://github.com/7rulnik/source-map-js). ISC · [picocolors](https://github.com/alexeyraspopov/picocolors). The lockfile includes the native bindings for supported platforms. |
| Optional macOS watcher | MIT · [fsevents](https://github.com/fsevents/fsevents) |
| Playwright | Apache-2.0 · QA only. [Playwright](https://github.com/microsoft/playwright/blob/main/LICENSE) |
| Sherpa-ONNX | Apache-2.0 · offline dialogue preparation. [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx/blob/master/LICENSE) |
| NumPy | BSD-3-Clause · offline dialogue preparation and facial artwork registration. [NumPy](https://github.com/numpy/numpy/blob/main/LICENSE.txt) |
| FFmpeg and LAME | FFmpeg is LGPL-2.1-or-later or GPL-2.0-or-later depending on build configuration. LAME is LGPL-2.0-or-later. Used to encode the dialogue during preparation. [FFmpeg legal](https://ffmpeg.org/legal.html) · [LAME license](https://lame.sourceforge.io/license.txt) |
| Pillow | HPND · image inspection and WebP export during asset preparation. [Pillow license](https://github.com/python-pillow/Pillow/blob/main/LICENSE) |
| Prettier | MIT · source formatting. [Prettier license](https://github.com/prettier/prettier/blob/main/LICENSE) |
