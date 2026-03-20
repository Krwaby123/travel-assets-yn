export const destinations = [
  {
    id: 'dounan',
    goto: 1,
    number: '壹',
    name: '斗南花市',
    location: '昆明 · 亚洲最大花市',
    desc: '5元实现鲜花自由，直接寄回家',
    image: 'https://sns-webpic-qc.xhscdn.com/202603192213/51b07f5976cf484db3edda0f17e37b7c/notes_pre_post/1040g3k031s3bq972lk6g5nmvi0n08p1tcac9irg!nd_dft_wlteh_webp_3'
  },
  {
    id: 'dali',
    goto: 2,
    number: '贰',
    name: '大理',
    location: '苍山洱海 · 古城樱花',
    desc: '喜洲油菜花、洱海骑行、古城樱花',
    image: 'https://sns-webpic-qc.xhscdn.com/202603192215/27aac7be66a0996ae9d8d6fee5db1752/notes_pre_post/1040g3k031qgvgrfpn0604a4q4ojcqamuthcis9g!nd_dft_wlteh_webp_3'
  },
  {
    id: 'lijiang',
    goto: 3,
    number: '叁',
    name: '丽江',
    location: '古城 · 玉龙雪山',
    desc: '雪山积雪完整，蓝月谷澄澈',
    image: 'http://sns-webpic-qc.xhscdn.com/202603192216/75e04b2ca529b69419906f0a490d788c/notes_pre_post/1040g3k031gk9epiqjs004bmlj7oeivqtcc7ppt8!nd_dft_wlteh_webp_3'
  },
  {
    id: 'shangri',
    goto: 4,
    number: '肆',
    name: '香格里拉',
    location: '藏地 · 古城转经筒',
    desc: '高原藏地人文，雪山湖泊草甸',
    image: 'https://sns-webpic-qc.xhscdn.com/202603192217/6fcc638e481bba34431235444a64c65b/1040g2sg31tce883j68jg48v8jg1f3jcr0fufck0!nd_dft_wlteh_webp_3'
  }
]

export const transportInfo = [
  { from: '昆明', to: '大理', price: '145元起', time: '1.5-2h' },
  { from: '大理', to: '丽江', price: '74-80元', time: '1.2-1.5h' },
  { from: '丽江', to: '香格里拉', price: '70元', time: '1.3h' }
]

export const checklistItems = ['身份证', '充电宝', '防晒霜', '墨镜', '保暖衣', '舒适鞋']

export const travelTips = [
  { icon: '🧥', title: '保暖', desc: '丽江香格里拉带羽绒服，昼夜温差大' },
  { icon: '☀️', title: '防晒', desc: 'SPF50+防晒霜、墨镜、遮阳帽必备' },
  { icon: '🏔️', title: '高原', desc: '放慢动作不跑跳，氧气瓶市区药店买' },
  { icon: '🚗', title: '交通', desc: '选正规平台，不坐黑车不参低价团' }
]

export const itineraryOptions = {
  core4: {
    label: '4天3晚',
    badge: '推荐',
    days: [
      { num: 'D1', place: '昆明', activity: '斗南花市' },
      { num: 'D2', place: '大理', activity: '古城逛吃' },
      { num: 'D3', place: '大理', activity: '喜洲+洱海' },
      { num: 'D4', place: '大理', activity: '深度游→返程' }
    ],
    budget: '约980元',
    note: '（常规版，含高铁往返290元）'
  },
  core3: {
    label: '3天2晚',
    days: [
      { num: 'D1', place: '昆明', activity: '斗南→大理' },
      { num: 'D2', place: '大理', activity: '洱海环湖' },
      { num: 'D3', place: '大理', activity: '古城→返程' }
    ],
    budget: '约780元',
    note: '（常规版，含高铁往返290元）'
  },
  full: {
    label: '全路线',
    days: [
      { num: 'D1', place: '昆明', activity: '斗南花市' },
      { num: 'D2', place: '大理', activity: '古城+洱海' },
      { num: 'D3', place: '大理', activity: '喜洲+廊道' },
      { num: 'D4', place: '丽江', activity: '古城+雪山' },
      { num: 'D5', place: '香格里拉', activity: '古城+寺庙' },
      { num: 'D6', place: '返程', activity: '纳帕海→回家' }
    ],
    budget: '约1800元',
    note: '（含省内高铁约500元）'
  }
}

export const navTabs = [
  { id: 'home', label: '首页' },
  { id: 'dounan', label: '斗南' },
  { id: 'dali', label: '大理' },
  { id: 'lijiang', label: '丽江' },
  { id: 'shangri', label: '香格里拉' }
]

export const dounanData = {
  title: '斗南花市 · 昆明',
  number: '壹',
  desc: '亚洲最大鲜花交易市场，全国80%鲜切花来自这里。5元一把玫瑰，10块钱实现鲜花自由。',
  quickTips: [
    { icon: '🚇', label: '交通', value: '地铁4号线<br>金桂街B口' },
    { icon: '💰', label: '捡漏最低价', value: '20:30后' },
    { icon: '📷', label: '拍照+慢慢选', value: '14:00-18:00' }
  ],
  photos: [
    { src: 'https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/e134c8cb36044bca80aeef0c3695e132~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1774510352&x-signature=FxT1kzwaKbqDWjs1CVldjnh7QSU%3D', label: '花海' },
    { src: 'https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/9f096c07a3194d409fea78f88097177d~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1774510352&x-signature=s5kwcoHAbGXmFI04H9o9MbTikco%3D', label: '批发盛况' },
    { src: 'https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/4b692832c93a4f16ab20b3e05140f027~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1774510352&x-signature=toFtzEOJ4k8divVxj5eovNPDf%2Fo%3D', label: '多肉天堂' }
  ],
  timeTable: {
    rows: [
      { area: '主场馆零售', time: '09:00-18:00', tip: '游客友好，慢慢挑' },
      { area: '主场馆夜间', time: '20:30-凌晨2点', tip: '价格腰斩，捡漏最佳', highlight: true },
      { area: '1/2/3号馆', time: '09:00-18:00', tip: '干花、伴手礼，18点后闭馆' }
    ]
  }
}

export const daliData = {
  title: '大理 · 苍山洱海',
  number: '贰',
  desc: '3月底日均气温5-24℃，昼夜温差大。白天薄针织+防晒衣，晚上加风衣。紫外线极强，必带SPF50+防晒霜、墨镜、草帽。',
  spots: [
    {
      name: '大理古城',
      tag: '免费',
      highlight: '人民路、红龙井樱花大道盛开，粉樱配青瓦白墙。清晨逛石板路，夜间逛人民路、洋人街。住宿大本营。',
      transport: '🚌 火车站乘4路/8路公交直达，约30分钟',
      photos: [
        { src: 'https://q5.itc.cn/q_70/images03/20251226/33c845ac097646e7a951b67fce25e55d.jpeg', label: '北门樱花巷' },
        { src: 'https://vcg05.cfp.cn/creative/vcg/nowater800/new/VCG211362918532.jpg?x-oss-process=image/format,webp', label: '五华楼夜景' },
        { src: 'https://5b0988e595225.cdn.sohucs.com/images/20180504/09e7328cefda45b69239f032a25b283f.jpeg', label: '洋人街' }
      ],
      routeLabel: '→ 喜洲古镇'
    },
    {
      name: '喜洲古镇',
      tag: '免费',
      highlight: '金黄油菜花田正盛，白族黄墙+苍山雪峰同框，电影感拉满。可体验白族扎染，吃喜洲粑粑。',
      transport: '🚌 古城乘中巴5元/人，约40分钟；滴滴约25元',
      photos: [
        { src: 'https://sns-webpic-qc.xhscdn.com/202603192301/a4c4e13855e4dd13f5f3217a06e7072f/notes_pre_post/1040g3k831sb56rt762d05plafgvncaf0drjdmoo!nd_dft_wlteh_webp_3', label: '转角楼' },
        { src: 'https://pic3.zhimg.com/v2-2051200624b9b6ec7e4164ad753be8f2_1440w.jpg', label: '杨家登油菜花' },
        { src: 'https://pic2.zhimg.com/v2-3c818ca76e6df13ac0eb9660116d6285_1440w.jpg', label: '喜林苑黄墙' }
      ],
      routeLabel: '→ 洱海廊道'
    },
    {
      name: '洱海生态廊道',
      tag: '免费',
      highlight: '洱海精华段，骑行随停随拍。龙龛码头→磻溪S弯→才村段，3月晴天能见度拉满。',
      transport: '🚴 古城骑行或打车至龙龛码头约10分钟',
      photos: [
        { src: 'https://pic2.zhimg.com/v2-bdef4c45c6015141002b101c1038898d_1440w.jpg', label: '龙龛码头' },
        { src: 'https://p2.itc.cn/images01/20220626/bf818c98450b4297b94771f353825132.jpeg', label: '磻溪S湾' },
        { src: 'https://bkimg.cdn.bcebos.com/pic/d009b3de9c82d158808736d3820a19d8bc3e424e?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080', label: '才村码头' }
      ],
      routeLabel: 'Day2→双廊'
    },
    {
      name: '双廊古镇',
      tag: '免费',
      highlight: '洱海东岸，直面苍山日落，"苍洱第一镇"。适合发呆看海，找咖啡馆坐一下午。',
      transport: '🚌 景区直通车25元/拼车30元，约1小时',
      photos: [
        { src: 'https://bkimg.cdn.bcebos.com/pic/574e9258d109b3de9c82a8f9d8e37b81800a19d8e654?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080', label: '玉几岛' },
        { src: 'https://n.sinaimg.cn/sinakd20121/213/w2048h1365/20200531/07cb-iumkapv7475349.jpg', label: '日落观景台' },
        { src: 'https://qcloud.dpfile.com/pc/24_AgxR0uY4r_jOJnXBuQGSr_0ggU3J_GxaRLB_DPQ8_PbZPVe5_9Id3pF9rzKXKY0q73sB2DyQcgmKUxZFQtw.jpg', label: '海景咖啡馆' }
      ]
    }
  ],
  routeDetail: {
    day1: {
      title: '海西精华线 · 田园花海+洱海出片',
      items: [
        { time: '7:00', optional: true, event: '古城出发→龙龛码头看洱海日出（公交C2路2元直达，看完可在龙龛段廊道慢逛）' },
        { time: '9:00', event: '<strong>喜洲古镇</strong>（5元中巴/拼车人均10元），拍转角楼、喜林苑黄墙、油菜花田，吃喜洲粑粑' },
        { time: '12:30', event: '喜洲→桃源码头（廊道精华段起点），吃午饭，避开正午暴晒' },
        { time: '15:00', event: '<strong>桃源码头→磻溪S湾</strong>，沿生态廊道骑行随停随拍' },
        { time: '18:00', event: '磻溪S湾→才村码头，等洱海日落，拍橘子海大片' },
        { time: '19:30', event: '回古城，逛夜景、吃夜市小吃' }
      ]
    },
    day2: {
      title: '海东慢游线 · 一线海景+日落躺平',
      items: [
        { time: '10:00', event: '古城→<strong>双廊古镇</strong>（25元景区直通车/30元拼车，约1小时）' },
        { time: '11:30', event: '双廊慢逛：玉几岛临海栈道、日落观景台，海景咖啡馆发呆看海' },
        { time: '16:00', event: '双廊→<strong>挖色小普陀</strong>→环海东路，打卡小众海边机位' },
        { time: '18:00', event: '<strong>环海东路观景台</strong>，等苍山洱海日落' },
        { time: '19:30', event: '回古城，结束行程' }
      ]
    }
  }
}

export const lijiangData = {
  title: '丽江 · 古城雪山',
  number: '叁',
  desc: '3月旱季晴天率极高，雪山积雪完整，蓝月谷湖水澄澈，是全年最佳观景期。',
  quickTips: [
    { icon: '🕐', label: '建议天数', value: '1-2天' },
    { icon: '🎫', label: '雪山门票', value: '提前3天约' },
    { icon: '🌡️', label: '山顶温度', value: '-6~4°C' }
  ],
  coverImage: {
    src: 'https://img.zcool.cn/community/019a1662c552340002c45e377ee170.jpg?x-oss-process=image/saveexif,1/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100/quality,q_100/format,webp',
    caption: '玉龙雪山 · 蓝月谷'
  },
  venues: [
    { name: '丽江古城', tag: '免费', desc: '世界文化遗产，青瓦木楼配雪山远景。大水车、四方街、酒吧街都超有氛围。古城维护费50元散客自愿缴纳。' },
    { name: '玉龙雪山+蓝月谷', tag: '必去', desc: '进山费100元（学生半价50元）+大索道140元+环保车20元。大索道票提前3天在「丽江旅游集团」公众号抢。' },
    { name: '白沙古镇', tag: '推荐', desc: '最原生态的纳西古镇，抬头就能看见玉龙雪山，小众不商业化，1-2小时可逛完。' },
    { name: '束河古镇', tag: '推荐', desc: '比大研古城安静，水系发达，有"小桥流水人家"感觉。门票40元（学生半价20元），多个侧门可免费进入。' }
  ]
}

export const shangriData = {
  title: '香格里拉 · 藏地风光',
  number: '肆',
  desc: '3月晴天多、温差大，气温-3~14℃，夜间最低-5℃。无蚊虫，重点防寒，适合体验高原藏地风光。',
  quickTips: [
    { icon: '🕐', label: '建议天数', value: '1-2天' },
    { icon: '🏔️', label: '海拔', value: '3300m+' },
    { icon: '🧥', label: '必带', value: '羽绒服' }
  ],
  coverImage: {
    src: 'https://pic4.zhimg.com/v2-f241458cc6d785d779c969d2a1ab4dd1_1440w.jpg',
    caption: '梅里雪山 · 日照金山'
  },
  venues: [
    { name: '独克宗古城', tag: '免费', desc: '中国保存最好的藏式古城，有世界最大转经筒。傍晚夜景超美，适合适应海拔。转经筒要顺时针转，至少3人一起推。' },
    { name: '松赞林寺', tag: '必去', desc: '"小布达拉宫"，门票90元（学生半价45元）+观光车25元。上午8-11点顺光拍照最好看。进寺庙不穿暴露衣服，不踩门槛。' },
    { name: '纳帕海依拉草原', tag: '推荐', desc: '环湖免费，导航"环湖西路"。高原湖泊+草原+雪山同框，有"小瑞士"感觉。租电动车50元/天随停随拍。' },
    { name: '普达措国家公园', tag: '可选', optional: true, desc: '门票138元（学生半价69元）+观光车120元。原始森林、高山湖泊，能看到松鼠牦牛。海拔3500米+，注意防寒。' }
  ]
}
