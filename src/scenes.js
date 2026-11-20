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
  { actor: 'male', zh: '你说等风，是在等我吗？', en: 'When you said you were waiting for the wind, did you mean me?', mood: 'neutral', reaction: 'shy', shot: 'pair', gesture: 'lean', pinyin: 'ni shuo deng feng / shi zai deng wo ma' },
  { actor: 'female', zh: '我明天就走了。你怎么才来？', en: 'I leave tomorrow. What took you so long?', mood: 'sad', reaction: 'neutral', shot: 'close', gesture: 'tilt', pinyin: 'wo ming tian jiu zou le / ni zen me cai lai' },
  { actor: 'male', zh: '我找了一路借口。最后，只剩一句想见你。', en: 'I looked for excuses the whole way. In the end, I just wanted to see you.', mood: 'neutral', reaction: 'surprised', shot: 'three', gesture: 'nod', pinyin: 'wo zhao le yi lu jie kou / zui hou / zhi sheng yi ju xiang jian ni' },
  { actor: 'female', zh: '那我走了以后，你还会来这里吗？', en: 'After I leave, will you still come here?', mood: 'surprised', reaction: 'neutral', shot: 'close', gesture: 'lean', pinyin: 'na wo zou le yi hou / ni hai hui lai zhe li ma' },
  { actor: 'male', zh: '不会。我买了和你同一班的车票。', en: 'No. I bought a ticket for the same train.', mood: 'smile', reaction: 'surprised', shot: 'three', gesture: 'tilt', pinyin: 'bu hui / wo mai le he ni tong yi ban de che piao' },
  { actor: 'female', zh: '那明天，换你等我。', en: 'Then tomorrow, it’s your turn to wait for me.', mood: 'smile', reaction: 'smile', shot: 'pair', gesture: 'nod', pinyin: 'na ming tian / huan ni deng wo' },
]

// Times are relative to each recorded cue, including the short holds between clauses.
export const acting = [
  { gestureAt: 1.51, reactionAt: .70, look: .76, replyLook: .86 },
  { gestureAt: 1.65, reactionAt: .18, expressionAt: -.25, look: .24, replyLook: .75 },
  { gestureAt: 2.43, reactionAt: 2.73, look: .55, replyLook: .65 },
  { gestureAt: 1.58, reactionAt: .26, expressionAt: -.12, look: .64, replyLook: .73 },
  { gestureAt: 1.04, reactionAt: 1.51, expressionAt: .88, look: .68, replyLook: .68 },
  { gestureAt: 2.25, reactionAt: .14, expressionAt: -.20, look: .78, replyLook: .82 },
]
