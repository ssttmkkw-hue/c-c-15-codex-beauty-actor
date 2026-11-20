# 等风的人 · 漫剧放映室

离开的前一天，她在天台等到了想告别的人。

一段约 23 秒的原创中文 AI 漫剧。林晚栀和沈亦然各有三套服装，可在樱落天台和雨夜街角演出。每个角色都有六种表情，镜头可切换为双人镜头、面部特写和偏轴半身构图。

## 本地运行

需要 Node.js 20.19+ 或 22.12+ 和 npm。

```sh
npm ci
npm run dev
```

打开 `http://127.0.0.1:5715/`。点 **播放短剧** 听两位角色的普通话对白并观看自动切镜。**场景剧本** 可跳到指定台词。右侧 **演出控制台** 可换角色、服装、表情、机位、背景或动作。在播放中操作控制台会暂停短剧，点画面下方的 **返回短剧** 可回到暂停处。播放器也支持进度拖动、重播、静音、字幕开关和全屏。

```sh
npm run build
npm run preview
```

生产预览地址是 `http://127.0.0.1:5815/`。构建输出位于 `dist/`，资源路径可随同静态站点迁移到子目录。画面与声音随应用一起提供，运行时只需要静态 HTTP。

## 截图与性能

先启动生产预览，再运行 `npm run shots`。脚本默认使用 `/workspace/pwtool/node_modules/playwright`，把 `r2-*.png` 写入 `/workspace/codex-beauty-shots/`。用 `PLAYWRIGHT_PATH`、`SHOTS_URL`、`SHOTS_DIR` 或 `SHOTS_PREFIX` 可覆盖对应路径和前缀。脚本同时检验音频、暂停、跳转和控制台，并在浏览器内分别测量天台与雨夜短剧播放时约 5 秒的帧率。

[设计](docs/DESIGN.md) · [调研](docs/RESEARCH.md) · [素材与许可](docs/CREDITS.md) · [迭代记录](docs/ROUNDS.md)

## English

*Waiting for the Wind* is a browser-based manhua short with two illustrated leads, six costumes, six expressions per lead, two locations, and a voiced Mandarin scene with bilingual subtitles. Run `npm ci && npm run dev` on port 5715. Use the director’s panel to pose the cast, or play the authored scene with its automatic cuts. `npm run build` produces the relocatable static build.
