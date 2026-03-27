export const destinations = [
  {
    id: 'dounan',
    goto: 1,
    number: '壹',
    name: '斗南花市',
    location: '昆明 · 亚洲最大花市',
    desc: '5元实现鲜花自由，直接寄回家',
    image: '/images/spots/dounan.jpg'
  },
  {
    id: 'dali',
    goto: 2,
    number: '贰',
    name: '大理',
    location: '苍山洱海 · 古城樱花',
    desc: '喜洲油菜花、洱海骑行、古城樱花',
    image: '/images/spots/dali.jpg'
  },
  {
    id: 'lijiang',
    goto: 3,
    number: '叁',
    name: '丽江',
    location: '古城 · 玉龙雪山',
    desc: '雪山积雪完整，蓝月谷澄澈',
    image: '/images/spots/lijiang.jpg'
  },
  {
    id: 'shangri',
    goto: 4,
    number: '肆',
    name: '香格里拉',
    location: '藏地 · 古城转经筒',
    desc: '高原藏地人文，雪山湖泊草甸',
    image: '/images/spots/shangri.jpg'
  }
]

export const transportInfo = [
  { from: '昆明', to: '大理', price: '145元起', time: '1.5-2h' },
  { from: '大理', to: '丽江', price: '74-80元', time: '1.2-1.5h' },
  { from: '丽江', to: '香格里拉', price: '70元', time: '1.3h' }
]

export const checklistItems = ['身份证', '充电宝', '防晒霜', '墨镜', '保暖衣', '舒适鞋']

export const travelTips = [
  { icon: '🧥', title: '穿衣', desc: '洋葱式叠穿，昼夜温差10-20℃' },
  { icon: '☀️', title: '防晒', desc: 'SPF50+防晒霜、墨镜、遮阳帽必备' },
  { icon: '🏔️', title: '高原', desc: '放慢动作不跑跳，氧气瓶市区药店买' },
  { icon: '🚗', title: '交通', desc: '选正规平台，不坐黑车不参低价团' }
]

export const itineraryOptions = {
  weekend: {
    label: '2天1晚',
    badge: '周末精华',
    highlight: true,
    days: [
      { num: 'D1', place: '昆明→大理', activity: '斗南逛购 + 洱海骑行 + 古城夜景' },
      { num: 'D2', place: '大理→昆明', activity: '喜洲古镇 + 返程' }
    ],
    budget: '约650元',
    note: '（含高铁往返290元，适合周末短途）',
    detail: {
      title: '斗南+大理 周末精华行程',
      desc: '兼顾鲜花体验与大理核心风光，节奏松弛不赶路',
      d1: [
        { time: '08:00-10:00', place: '斗南花市', event: '深度逛购：1/2/3号馆选干花伴手礼，主场馆挑鲜切花（5元/把玫瑰）', tip: '地铁4号线金桂街B口直达，建议带空行李箱' },
        { time: '10:30-12:00', place: '昆明→大理', event: '高铁出行（145元起，1.5小时）', tip: '提前1天购票，选10:30-11:00时段' },
        { time: '12:30-14:00', place: '大理古城', event: '午餐吃凉鸡米线、扒肉饵丝', tip: '北门菜市场旁小吃店，性价比高' },
        { time: '14:30-18:00', place: '洱海廊道', event: '骑行：龙龛码头→磻溪S弯→才村码头', tip: '电动车30元/天，防晒必备' },
        { time: '18:30-21:00', place: '大理古城', event: '夜游人民路、五华楼夜景、樱花大道', tip: '3月樱花盛放，夜市小吃先问价' }
      ],
      d2: [
        { time: '08:00-11:30', place: '喜洲古镇', event: '拍转角楼、喜林苑黄墙+油菜花田，体验白族扎染', tip: '中巴5元/人，扎染30元/件起' },
        { time: '12:00-13:30', place: '喜洲', event: '午餐：白族酸辣鱼/豌豆粉，返程古城', tip: '吃现烤喜洲粑粑（甜口5元/个）' },
        { time: '14:00-16:00', place: '大理→昆明', event: '高铁返程（145元起）', tip: '可选大理站买鲜花饼' }
      ],
      tips: [
        { icon: '💰', text: '预算参考：高铁290元 + 住宿120元 + 餐饮100元 + 交通/体验140元' },
        { icon: '🏨', text: '住宿建议：古城南门/北门双床房120-180元/晚，选「可免费取消」' },
        { icon: '⚠️', text: '避坑：不参50元环洱海一日游、不买古城银饰玉石、租车确认无隐藏费用' },
        { icon: '🎒', text: '行李精简：防晒霜SPF50+、墨镜、薄外套，斗南买花可快递（同城8元/束）' }
      ],
      extend: {
        title: '可选延申（3天）',
        desc: 'D2上午增加双廊古镇：拼车30元/人，逛玉几岛、海景咖啡馆发呆，预算增加约50元'
      }
    }
  },
  core3: {
    label: '3天2晚',
    days: [
      { num: 'D1', place: '昆明→大理', activity: '斗南+洱海骑行' },
      { num: 'D2', place: '大理', activity: '喜洲+双廊环海' },
      { num: 'D3', place: '大理→昆明', activity: '古城逛吃+返程' }
    ],
    budget: '约780元',
    detail: {
      desc: '小长假首选，斗南鲜花体验 + 洱海全景，节奏松弛不赶路',
      d1: [
        { time: '08:00-11:00', place: '斗南花市', event: '逛购伴手礼、鲜切花，可现场快递到家' },
        { time: '11:30-13:00', place: '昆明→大理', event: '高铁出行（145元，1.5小时）' },
        { time: '13:30-15:00', place: '大理古城', event: '入住+午餐，吃凉鸡米线、烤乳扇' },
        { time: '15:30-18:30', place: '洱海廊道', event: '骑行精华段：龙龛码头→磻溪S弯→才村' },
        { time: '19:00-21:30', place: '大理古城', event: '夜游人民路、五华楼夜景' }
      ],
      d2: [
        { time: '08:00-12:30', place: '喜洲古镇', event: '转角楼拍照+白族扎染体验，吃喜洲粑粑' },
        { time: '13:00-18:30', place: '洱海东岸', event: '双廊古镇→挖色小普陀→环海东路日落' },
        { time: '19:30-21:00', place: '大理古城', event: '晚餐白族酸辣鱼，人均40元' }
      ],
      d3: [
        { time: '09:00-11:30', place: '大理古城', event: '早市逛吃、崇圣寺三塔外围打卡、买鲜花饼' },
        { time: '12:00-14:00', place: '大理→昆明', event: '高铁返程' }
      ],
      tips: [
        { icon: '💰', text: '预算：高铁290元 + 住宿240元 + 餐饮150元 + 交通/体验100元' },
        { icon: '🚴', text: '环海推荐租电动车，80元/天，续航120km+可环全程' },
        { icon: '⚠️', text: '避坑：不进古城银饰玉石店，海景咖啡馆选20-30元基础款即可' }
      ]
    }
  },
  core4: {
    label: '4天3晚',
    days: [
      { num: 'D1', place: '昆明→大理', activity: '斗南深度+古城' },
      { num: 'D2', place: '大理', activity: '洱海日出+喜洲' },
      { num: 'D3', place: '大理', activity: '双廊+海东环线' },
      { num: 'D4', place: '大理→昆明', activity: '苍山徒步+返程' }
    ],
    budget: '约980元',
    detail: {
      desc: '慢玩深度游，斗南+洱海海西/海东/苍山全覆盖',
      d1: [
        { time: '08:00-11:00', place: '斗南花市', event: '深度逛1/2/3号馆，对比价格再下单' },
        { time: '11:30-13:00', place: '昆明→大理', event: '高铁出行（145元，1.5小时）' },
        { time: '13:30-18:00', place: '大理古城', event: '入住+逛拍北门樱花巷、文庙武庙' },
        { time: '18:30-21:00', place: '大理古城', event: '北门夜市逛吃，小吃均价5-10元' }
      ],
      d2: [
        { time: '07:00-12:00', place: '洱海海西', event: '龙龛码头看日出→廊道骑行→才村早餐' },
        { time: '12:30-18:30', place: '喜洲古镇', event: '四方街、严家大院、油菜花田、海舌公园' },
        { time: '19:00-21:00', place: '大理古城', event: '晚餐石板烧，人均50元' }
      ],
      d3: [
        { time: '09:00-18:00', place: '洱海海东', event: '双廊古镇→南诏风情岛→理想邦→环海东路日落' },
        { time: '18:30-20:00', place: '返程古城', event: '文笔村观景台看日落最佳' }
      ],
      d4: [
        { time: '08:00-14:00', place: '苍山', event: '感通索道上山（学生半价55元）→玉带云游路轻徒步→看苍洱全景' },
        { time: '14:30-16:30', place: '大理→昆明', event: '高铁返程' }
      ],
      tips: [
        { icon: '💰', text: '预算：高铁290元 + 住宿360元 + 餐饮200元 + 门票/交通130元' },
        { icon: '🏔️', text: '苍山选感通索道，海拔低、徒步难度小，不易高反' },
        { icon: '🧥', text: '山上比古城低5-8℃，必带薄外套、防晒、矿泉水' }
      ]
    }
  },
  full: {
    label: '全路线',
    days: [
      { num: 'D1', place: '昆明→大理', activity: '斗南+洱海骑行' },
      { num: 'D2', place: '大理', activity: '喜洲+环海' },
      { num: 'D3', place: '大理→丽江', activity: '古城逛拍' },
      { num: 'D4', place: '丽江', activity: '玉龙雪山+蓝月谷' },
      { num: 'D5', place: '丽江→香格里拉', activity: '松赞林寺+纳帕海' },
      { num: 'D6', place: '香格里拉→返程', activity: '独克宗古城' }
    ],
    budget: '约1800元',
    detail: {
      desc: '毕业旅行/长假首选，昆明-大理-丽江-香格里拉全覆盖，高原循序渐进适应',
      d1: [
        { time: '08:00-11:00', place: '斗南花市', event: '鲜花自由，可快递到酒店' },
        { time: '11:30-13:00', place: '昆明→大理', event: '高铁（145元，1.5小时）' },
        { time: '13:30-18:00', place: '大理', event: '入住+洱海廊道骑行精华段' },
        { time: '18:30-21:00', place: '大理古城', event: '夜游+夜市，吃凉鸡米线、玫瑰烤奶' }
      ],
      d2: [
        { time: '08:00-18:00', place: '大理', event: '喜洲古镇+扎染→双廊看海→环海东路日落' },
        { time: '19:00-21:00', place: '大理古城', event: '晚餐，收拾行李准备转场' }
      ],
      d3: [
        { time: '09:00-10:30', place: '大理→丽江', event: '高铁（74元，1.2小时）' },
        { time: '11:00-18:00', place: '丽江古城', event: '入住+大水车、四方街、万古楼全景' },
        { time: '18:30-21:00', place: '丽江古城', event: '夜景逛吃，腊排骨火锅人均60元' }
      ],
      d4: [
        { time: '06:30-16:00', place: '玉龙雪山', event: '大索道登4680米→蓝月谷逛拍' },
        { time: '16:30-18:00', place: '丽江古城', event: '休息调整，不洗澡避免高反' }
      ],
      d5: [
        { time: '08:00-09:30', place: '丽江→香格里拉', event: '高铁（70元，1.3小时），海拔3300m循序渐进' },
        { time: '10:00-14:00', place: '松赞林寺', event: '"小布达拉宫"打卡，学生半价70元' },
        { time: '14:30-18:00', place: '纳帕海', event: '租电动车环湖，高原湖泊+草原+雪山同框' },
        { time: '18:30-21:00', place: '独克宗古城', event: '转世界最大转经筒，牦牛肉火锅人均70元' }
      ],
      d6: [
        { time: '09:00-12:00', place: '香格里拉', event: '独克宗古城慢逛，或普达措国家公园（可选）' },
        { time: '12:00起', place: '返程', event: '香格里拉→丽江→昆明联程，约4小时' }
      ],
      tips: [
        { icon: '💰', text: '预算：高铁约500元 + 住宿约600元 + 餐饮约400元 + 门票约300元' },
        { icon: '🏔️', text: '高原适应：香格里拉海拔3300m+，不剧烈运动，氧气瓶市区药店买20元' },
        { icon: '🎫', text: '雪山大索道提前3天「丽江旅游集团」公众号抢，早上7点放票' }
      ],
      extend: {
        desc: '时间充裕可增加：普达措国家公园（学生半价129元），或从香格里拉直飞回家'
      }
    }
  }
}

export const navTabs = [
  { id: 'home', label: '首页' },
  { id: 'dounan', label: '昆明' },
  { id: 'dali', label: '大理' },
  { id: 'lijiang', label: '丽江' },
  { id: 'shangri', label: '香格里拉' },
  { id: 'map', label: '地图' }
]

export const dounanData = {
  title: '昆明 · 斗南花市',
  number: '壹',
  desc: '亚洲最大鲜花交易市场，全国80%鲜切花来自这里。5元一把玫瑰，10块钱实现鲜花自由。',
  quickTips: [
    { icon: '🚇', label: '交通', value: '地铁4号线<br>金桂街B口' },
    { icon: '💰', label: '捡漏最低价', value: '20:30后' },
    { icon: '📷', label: '拍照+慢慢选', value: '14:00-18:00' }
  ],
  photos: [
    { src: '/images/spots/dounan-1-huahai.jpeg', label: '花海' },
    { src: '/images/spots/dounan-2-pifa.jpeg', label: '批发盛况' },
    { src: '/images/spots/dounan-3-durou.jpeg', label: '多肉天堂' }
  ],
  timeTable: {
    rows: [
      { area: '主场馆零售', time: '09:00-18:00', tip: '游客友好，慢慢挑' },
      { area: '主场馆夜间', time: '20:30-凌晨2点', tip: '价格腰斩，捡漏最佳', highlight: true },
      { area: '1/2/3号馆', time: '09:00-18:00', tip: '干花、伴手礼，18点后闭馆' }
    ]
  },
  shipping: {
    title: '鲜切花物流发货指南',
    warning: '普通快递运输约3天，易导致鲜花闷损、品质下降',
    methods: [
      { name: '大货批发', channels: '广泽航空、滇闽物流', feature: '机场直达，性价比最高' },
      { name: '小件/一件代发', channels: '顺丰冷链、德邦冷链', feature: '送货上门，时效稳定' }
    ],
    tips: '价格会随旺季/淡季动态调整，发货前建议提前询价'
  },
  booking: {
    note: '3月底淡季无需预约，扫码即可入园',
    peakNote: '春节、国庆需在「斗南花市」公众号分时段预约'
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
      openTime: '全天开放',
      booking: '无需预约',
      photos: [
        { src: '/images/spots/dali-gucheng-1-beimen-yinghua.jpg', label: '北门樱花巷' },
        { src: '/images/spots/dali-gucheng-2-wuhualou.jpg', label: '五华楼夜景' },
        { src: '/images/spots/dali-gucheng-3-yangrenjie.jpeg', label: '洋人街' }
      ]
    },
    {
      name: '喜洲古镇',
      tag: '免费',
      highlight: '金黄油菜花田正盛，白族黄墙+苍山雪峰同框，电影感拉满。可体验白族扎染，吃喜洲粑粑。',
      transport: '🚌 古城乘中巴5元/人，约40分钟；滴滴约25元',
      openTime: '全天开放',
      booking: '无需预约',
      photoSpots: [
        { name: '转角楼', address: '市坪街119号', tip: '45°斜对角拍弧形楼体，上午9-11点光线最佳' }
      ],
      photos: [
        { src: '/images/spots/xizhou-corner.jpg', label: '转角楼' },
        { src: '/images/spots/xizhou-1-yangjiadeng.jpg', label: '杨家登油菜花' },
        { src: '/images/spots/xizhou-2-xilinyuan.jpg', label: '喜林苑黄墙' }
      ]
    },
    {
      name: '洱海生态廊道',
      tag: '免费',
      highlight: '洱海精华段，骑行随停随拍。龙龛码头→磻溪S弯→才村段，3月晴天能见度拉满。',
      transport: '🚴 古城骑行或打车至龙龛码头约10分钟',
      openTime: '全天开放（不建议夜骑）',
      booking: '无需预约',
      cycling: {
        routes: [
          {
            name: '龙龛码头 → 磻溪S弯',
            distance: '骑行段约5km',
            time: '休闲骑行约1.5小时',
            tip: '新手友好，沿途芦苇荡、水杉林出片，清晨最佳'
          },
          {
            name: '磻溪S弯 → 才村码头',
            distance: '骑行段约7km',
            time: '休闲骑行约1小时',
            tip: '白族村落密集，临湖咖啡馆多，傍晚可看日落'
          }
        ],
        tips: '租车优先在民宿租，检查刹车、电量、头盔；禁止在骑行道中间拍照'
      },
      photoSpots: [
        { name: '龙龛码头', tip: '日出打卡，导航「龙龛古渡」，提前40分钟到' },
        { name: '磻溪S弯', tip: '洱朵酒店附近弯道最标准，早7-9点人少' }
      ],
      photos: [
        { src: '/images/spots/erhai-1-longkan.jpg', label: '龙龛码头' },
        { src: '/images/spots/erhai-2-panxi.jpg', label: '磻溪S湾' },
        { src: '/images/spots/erhai-3-caicun.jpg', label: '才村码头' }
      ]
    },
    {
      name: '双廊古镇',
      tag: '免费',
      highlight: '洱海东岸，直面苍山日落，"苍洱第一镇"。适合发呆看海，找咖啡馆坐一下午。',
      transport: '🚌 景区直通车25元/拼车30元，约1小时',
      openTime: '全天开放',
      booking: '无需预约',
      photos: [
        { src: '/images/spots/shuanglang-1-yujiidao.jpg', label: '玉几岛' },
        { src: '/images/spots/shuanglang-2-riluo.jpg', label: '日落观景台' },
        { src: '/images/spots/shuanglang-3-kafeiguan.jpg', label: '海景咖啡馆' }
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
  },
  accommodations: [
    {
      category: '平价青旅',
      items: [
        { name: '欢雀青旅', location: '古城南门文献路', price: '床位35元起', highlights: '24h前台、夜间门禁、带锁储物柜' },
        { name: '桃溪青舍', location: '古城苍山门旁', price: '床位38元起', highlights: '男女分层、临近派出所、安静安全' }
      ]
    },
    {
      category: '平价民宿',
      items: [
        { name: '自在文旅民宿', location: '古城南门旁', price: '大床128元起', highlights: '独栋白族小院、24h门禁、洗衣房' },
        { name: '风禾里民宿', location: '才村码头主街', price: '园景118元起', highlights: '步行2分钟到洱海、可规划骑行路线' }
      ]
    }
  ],
  accommodationTips: [
    '选址优先古城出入口、才村主街等核心区域',
    '青旅优先选带锁储物柜、可反锁房门的房型',
    '平季可到店看房后订房，节假日提前1-2周预订'
  ],
  foods: [
    { name: '白族酸辣鱼', price: '人均40-70元', shops: '丽芳饭店、石井私房菜', tip: '点单前确认按条/按斤计价' },
    { name: '烤乳扇', price: '5-10元/根', shops: '杨记乳扇、阿婆烤乳扇', tip: '趁热吃，凉后发腥' },
    { name: '喜洲粑粑', price: '5-8元/个', shops: '喜洲古镇内', tip: '甜咸两款，现烤最香' }
  ],
  studentDiscounts: [
    { spot: '崇圣寺三塔', fullPrice: '75元', studentPrice: '半价37.5元', note: '学生证+身份证' },
    { spot: '苍山索道', fullPrice: '35-270元', studentPrice: '均半价', note: '门票+索道同步优惠' },
    { spot: '蝴蝶泉', fullPrice: '40元', studentPrice: '半价20元', note: '支持电子学生证' },
    { spot: '天龙八部影视城', fullPrice: '52元', studentPrice: '半价26元', note: '支持学信网凭证' }
  ],
  bookingInfo: [
    { spot: '崇圣寺三塔', note: '建议提前1天线上预约「游云南」小程序' },
    { spot: '苍山洗马潭索道', note: '必须提前1天预约「大理苍山世界地质公园」公众号', important: true },
    { spot: '其他收费景点', note: '淡季可现场购票，节假日建议提前预约' }
  ],
  openTimes: [
    { spot: '崇圣寺三塔', time: '07:30-18:30', note: '17:30停止入园' },
    { spot: '苍山索道', time: '08:30-17:00', note: '洗马潭15:30停止上行' },
    { spot: '蝴蝶泉', time: '08:30-17:30', note: '17:00停止入园' }
  ]
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
    src: '/images/spots/lijiang-lanyuegu.jpg',
    caption: '玉龙雪山 · 蓝月谷'
  },
  venues: [
    { name: '丽江古城', tag: '免费', desc: '世界文化遗产，青瓦木楼配雪山远景。大水车、四方街、酒吧街都超有氛围。古城维护费50元散客自愿缴纳。', openTime: '全天开放', booking: '无需预约' },
    { name: '玉龙雪山+蓝月谷', tag: '必去', desc: '进山费100元（学生半价50元）+大索道140元+环保车20元。大索道票提前3天在「丽江旅游集团」公众号抢。', openTime: '6:30-18:00', booking: '大索道必须提前预约', important: true },
    { name: '白沙古镇', tag: '推荐', desc: '最原生态的纳西古镇，抬头就能看见玉龙雪山，小众不商业化，1-2小时可逛完。', openTime: '全天开放', booking: '无需预约' },
    { name: '束河古镇', tag: '推荐', desc: '比大研古城安静，水系发达，有"小桥流水人家"感觉。门票40元（学生半价20元），多个侧门可免费进入。', openTime: '全天开放', booking: '无需预约' }
  ],
  bookingInfo: [
    { spot: '玉龙雪山冰川公园大索道', note: '必须提前线上实名预约', important: true, channel: '「丽江旅游集团」公众号', tip: '每日20:00放未来第3天票' },
    { spot: '云杉坪/牦牛坪索道', note: '淡季可现场预约，节假日提前预约' }
  ],
  openTimes: [
    { spot: '景区大门+蓝月谷', time: '6:30-18:00', note: '18:00停止入园' },
    { spot: '冰川公园大索道', time: '7:00-18:00', note: '最后一班上行16:00' },
    { spot: '云杉坪小索道', time: '7:00-18:00', note: '最后一班上行17:30' }
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
    src: '/images/spots/shangri-rizhaoshan.jpg',
    caption: '梅里雪山 · 日照金山'
  },
  venues: [
    { name: '独克宗古城', tag: '免费', desc: '中国保存最好的藏式古城，有世界最大转经筒。傍晚夜景超美，适合适应海拔。转经筒要顺时针转，至少3人一起推。', openTime: '全天开放', booking: '无需预约' },
    { name: '松赞林寺', tag: '必去', desc: '"小布达拉宫"，门票90元（学生半价45元）+观光车25元。上午8-11点顺光拍照最好看。进寺庙不穿暴露衣服，不踩门槛。', openTime: '08:00-18:00', booking: '淡季可现场购票' },
    { name: '纳帕海依拉草原', tag: '推荐', desc: '环湖免费，导航"环湖西路"。高原湖泊+草原+雪山同框，有"小瑞士"感觉。租电动车50元/天随停随拍。', openTime: '全天开放', booking: '无需预约' },
    { name: '普达措国家公园', tag: '可选', optional: true, desc: '门票138元（学生半价69元）+观光车120元。原始森林、高山湖泊，能看到松鼠牦牛。海拔3500米+，注意防寒。', openTime: '08:30-16:00', booking: '建议提前1天预约' }
  ],
  bookingInfo: [
    { spot: '松赞林寺', note: '淡季可现场购票', channel: '「游云南」小程序或现场' },
    { spot: '普达措国家公园', note: '建议提前1天预约', channel: '「普达措国家公园」公众号' }
  ],
  openTimes: [
    { spot: '松赞林寺', time: '08:00-18:00', note: '17:00停止售票' },
    { spot: '普达措国家公园', time: '08:30-16:00', note: '15:30停止入园' }
  ]
}
