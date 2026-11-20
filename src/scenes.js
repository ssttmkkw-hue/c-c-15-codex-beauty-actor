export const cast = {
  male: { name: '沈亦然', role: '男主', wardrobe: [['ink', '暮色风衣'], ['ivory', '月白礼服'], ['wine', '绯红夹克']] },
  female: { name: '林晚栀', role: '女主', wardrobe: [['blush', '春日针织'], ['nocturne', '夜蓝礼裙'], ['jade', '青霭外套']] },
}

export const expressions = [
  ['neutral', '平静'], ['smile', '微笑'], ['shy', '害羞'],
  ['sad', '落泪'], ['angry', '生气'], ['surprised', '惊讶'],
]
export const shots = [['pair', '双人镜头'], ['close', '面部特写'], ['three', '偏轴半身']]
export const backdrops = [['roof', '樱落天台'], ['night', '雨夜街角']]
export const gestures = [['idle', '待机'], ['nod', '轻点头'], ['tilt', '侧首'], ['lean', '靠近']]

export const beats = [
  { actor: 'male', captions: [['你说等风，', 'You said you were waiting for the wind.'], ['是在等我吗？', 'Were you waiting for me?']], mood: 'neutral', reaction: 'shy', shot: 'pair', gesture: 'lean', pinyin: 'ni shuo deng feng / shi zai deng wo ma' },
  { actor: 'female', captions: [['我明天就走了。', 'I leave tomorrow.'], ['你怎么才来？', 'What took you so long?']], mood: 'sad', reaction: 'neutral', shot: 'close', gesture: 'tilt', pinyin: 'wo ming tian jiu zou le / ni zen me cai lai' },
  { actor: 'male', captions: [['我找了一路借口。', 'I looked for excuses the whole way.'], ['最后，', 'In the end,'], ['只剩一句想见你。', 'I just wanted to see you.']], mood: 'neutral', reaction: 'surprised', shot: 'close', gesture: 'nod', pinyin: 'wo zhao le yi lu jie kou / zui hou / zhi sheng yi ju xiang jian ni' },
  { actor: 'female', captions: [['那我走了以后，', 'After I leave,'], ['你还会来这里吗？', 'Will you still come here?']], mood: 'surprised', reaction: 'neutral', shot: 'close', gesture: 'lean', pinyin: 'na wo zou le yi hou / ni hai hui lai zhe li ma' },
  { actor: 'male', captions: [['不会。', 'No.'], ['我买了和你同一班的车票。', 'I bought a ticket for the same train.']], mood: 'smile', reaction: 'surprised', shot: 'three', gesture: 'tilt', pinyin: 'bu hui / wo mai le he ni tong yi ban de che piao' },
  { actor: 'female', captions: [['那明天，', 'Then tomorrow,'], ['换你等我。', 'It’s your turn to wait for me.']], mood: 'smile', reaction: 'smile', shot: 'pair', gesture: 'nod', pinyin: 'na ming tian / huan ni deng wo' },
].map(beat => ({ ...beat, zh: beat.captions.map(([zh]) => zh).join('') }))

export const cutaways = {
  ticket: { label: '车票 · 特写', art: 'train-ticket', alt: '沈亦然伸出手，递出两张车票。' },
  closing: { label: '相望 · 双人镜头', art: 'rooftop-reverse', alt: '暮色里，两人在天台栏杆旁相望。' },
}

// Times are relative to each recorded cue, including the short holds between clauses.
export const acting = [
  { gestureAt: 1.51, reactionAt: .70, look: .76, replyLook: .86 },
  { camera: 'reverse', gestureAt: 1.63, reactionAt: .18, expressionAt: -.25, look: .24, replyLook: .75 },
  { camera: 'reverse', gestureAt: 2.53, reactionAt: 2.73, look: .30, lookAt: 2.42, replyLook: .65 },
  { gestureAt: 1.58, reactionAt: .26, expressionAt: .28, look: .64, replyLook: .73 },
  { cutaway: 'ticket', cutAt: 2.34, gestureAt: 1.04, reactionAt: 1.51, expressionAt: .88, look: .68, replyLook: .68 },
  { cutaway: 'closing', cutAt: 2.45, gestureAt: 1.31, reactionAt: .40, expressionAt: -.20, look: .78, replyLook: .82 },
]
