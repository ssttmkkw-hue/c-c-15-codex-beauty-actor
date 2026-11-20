# 等风的人 · 漫剧放映室

离开的前一天，她在天台等到了想告别的人。

一段约 23 秒的原创中文 AI 漫剧。林晚栀和沈亦然各有三套服装和六种表情，可在樱落天台和雨夜街角演出。短剧配有双人镜头、越肩特写、车票插镜和片尾对望。

## 本地运行

需要 Node.js 20.19+ 或 22.12+ 和 npm。

```sh
npm ci
npm run dev
```

打开 `http://127.0.0.1:5715/`。点 **播放短剧** 听普通话对白，字幕随语句切换。**场景剧本** 中的六条对白可以直接跳转。播放器支持进度拖动、重播、静音、字幕开关和全屏。

```sh
npm run build
npm run preview
```

生产预览地址是 `http://127.0.0.1:5815/`。构建输出位于 `dist/`，资源路径可随同静态站点迁移到子目录。画面与声音随应用一起提供，运行时只需要静态 HTTP。

## 演出控制台

先选角色，再换服装或表情。**双人镜头** 同时显示两位演员，**面部特写** 着重眼神和口型，**偏轴半身** 能看到更多服装。**场景** 选择天台或雨夜，**动作** 可触发轻点头、侧首和靠近。操作控制台会暂停短剧，点画面下方的 **返回短剧** 回到原来的时间。所选服装和场景会带进短剧播放。

## 截图与性能

先启动生产预览，再运行 `npm run shots`。脚本默认使用 `/workspace/pwtool/node_modules/playwright`，把 `r3-*.png` 和精选的 `best-*.png` 写入 `/workspace/codex-beauty-shots/`。用 `PLAYWRIGHT_PATH`、`SHOTS_URL`、`SHOTS_DIR` 或 `SHOTS_PREFIX` 可覆盖对应路径和前缀。脚本验证台词跳转、语音、口型、字幕和控制台，并分别测量天台和雨夜放映时约 5 秒的帧率。Chromium 的 SwiftShader 软件渲染结果可用作性能下限基准。

### 浏览器演出与性能 API

在 URL 加上 `?capture` 会启用 `window.__manhua`。可用它通过同一套控制台按钮设置表演，按音轨秒数跳转，或在页面内采样帧率。

```js
const scene = window.__manhua
scene.choose('actor', 'female')
scene.choose('outfit', 'jade')
scene.choose('mood', 'shy')
scene.choose('shot', 'close')
scene.freeze(0.65)  // 固定风、粒子和待机相位，传 undefined 恢复
scene.seek(4.2)     // 回到短剧时间轴
await scene.measureFps(5000)
```

`choose(group, value)` 支持 `actor`、`outfit`、`mood`、`shot`、`backdrop` 和 `gesture`。成功时返回 `true`，当前没有该选项时返回 `false`。`position`、`duration`、`playing`、`media` 和 `timing` 可读取播放状态和台词时间。`measureFps()` 返回 `frames`、`milliseconds`、`fps` 和 `p95Ms`。要测量放映时的帧率，可先用播放器开始放映。

## 已知限制

- 角色采用分层 2D 插画。互动镜头在绘制好的角度内构图，演员动作以呼吸、肩颈和少量发丝为主。新的对望插画含独立绘制的侧面角度。
- 车票和片尾对望使用画好的天台和默认服装。更换服装或场景后，整段短剧使用可换装的演员层。
- 普通话语音是预渲染的合成录音。口型按句内估算的音节时序播放，快速辅音和部分闭唇会有误差。启用系统的减少动态效果后，保留字幕和口型，停止环境运动和肢体动作。

[设计](docs/DESIGN.md) · [调研](docs/RESEARCH.md) · [素材与许可](docs/CREDITS.md) · [迭代记录](docs/ROUNDS.md)

## English

*Waiting for the Wind* is a voiced Mandarin manhua short with bilingual captions and a director’s panel. Run `npm ci && npm run dev` on port 5715. Run `npm run build && npm run preview` for the static preview on port 5815. Use `?capture` for the browser API shown above. The interactive portraits use fixed 2D perspectives, with dedicated illustrations for the rooftop ticket reveal and closing look. Syllable timing for mouth animation is approximate.
