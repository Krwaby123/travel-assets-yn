export const onboardingSteps = [
  {
    id: 'welcome',
    type: 'modal',
    title: '欢迎使用云南旅行攻略',
    content: '这是您第一次使用本系统吗？',
    options: [
      { label: '第一次使用', action: 'next' },
      { label: '已经体验过', action: 'complete' }
    ]
  },
  {
    id: 'intro',
    type: 'modal',
    title: '开始探索',
    content: '这是一个帮助你规划云南之旅的工具。接下来我会带你了解主要功能，整个过程大约1分钟。',
    actions: ['next', 'skip']
  },
  {
    id: 'home-featured',
    type: 'highlight',
    title: '推荐目的地',
    content: '首页展示推荐的首选目的地，点击卡片可以查看详细攻略。',
    target: '.featured-destination'
  },
  {
    id: 'home-destinations',
    type: 'highlight',
    title: '更多目的地',
    content: '这里可以快速跳转到其他目的地攻略，点击地图可查看全部地点。',
    target: '.destinations-row'
  },
  {
    id: 'home-checklist',
    type: 'highlight',
    title: '出发前检查',
    content: '勾选完成所有准备事项后，卡片会自动隐藏，让你的页面更简洁。',
    target: '[data-onboarding="checklist"]',
    skipIfMissing: true
  },
  {
    id: 'global-nav-button',
    type: 'highlight',
    title: '全局导航按钮',
    content: '点击这里可以打开全局导航面板，快速跳转到任意目的地。',
    target: '.hero-menu-btn',
    action: 'openGlobalNav'
  },
  {
    id: 'global-nav-panel',
    type: 'highlight',
    title: '全部地点',
    content: '这里列出所有可跳转的目的地：首页、斗南、大理、丽江、香格里拉和地图导航。',
    target: '.jump-panel',
    skipIfMissing: true
  },
  {
    id: 'settings-intro',
    type: 'highlight',
    title: '设置面板',
    content: '点击右下角的设置按钮，可以个性化你的浏览体验。',
    target: '.settings-toggle',
    action: 'openSettings'
  },
  {
    id: 'theme-switch',
    type: 'highlight',
    title: '显示主题',
    content: '支持亮色、暗色和护眼模式。护眼模式使用暖黄色调，适合夜间阅读。',
    target: '[data-onboarding="theme"]'
  },
  {
    id: 'font-settings',
    type: 'highlight',
    title: '字体设置',
    content: '点击下一步，系统将演示字体大小调整效果。',
    target: '[data-onboarding="font"]'
  },
  {
    id: 'hidden-content',
    type: 'highlight',
    title: '隐藏内容管理',
    content: '点击下一步，系统将演示如何隐藏和恢复内容。',
    target: '[data-onboarding="hidden-content"]'
  },
  {
    id: 'music-intro',
    type: 'highlight',
    title: '背景音乐',
    content: '点击圆形按钮展开音乐面板，可以边听歌边浏览。',
    target: '[data-onboarding="music"]'
  },
  {
    id: 'map-intro',
    type: 'highlight',
    title: '地图导航',
    content: '点击菜单按钮选择「地图导航」，可以搜索地点、规划路线。',
    target: '.hero-menu-btn',
    action: 'goToMap'
  },
  {
    id: 'map-search',
    type: 'highlight',
    title: '搜索地点',
    content: '在搜索框输入地点名称，按回车或点击搜索按钮即可查找。',
    target: '#map-guide-area-control .map-search-bar'
  },
  {
    id: 'map-results',
    type: 'highlight',
    title: '搜索结果',
    content: '搜索结果会显示在列表中，点击可以定位到对应位置。',
    target: '.map-preview-card'
  },
  {
    id: 'map-actions',
    type: 'highlight',
    title: '功能操作',
    content: '「刷新位置」更新当前位置，「路线」规划导航，「清除路线」取消当前路线。',
    target: '#map-guide-area-toolbar .map-actions'
  },
  {
    id: 'complete',
    type: 'modal',
    title: '引导完成',
    content: '建议接下来查看推荐行程，规划你的云南之旅。祝旅途愉快！',
    options: [
      { label: '推荐行程', action: 'goToItinerary' },
      { label: '稍后再看', action: 'complete' }
    ]
  }
]

export const mapOnboardingSteps = [
  {
    id: 'map-welcome',
    type: 'modal',
    title: '地图导航',
    content: '地图页面可以搜索地点、规划导航路线。使用定位功能需要开启位置权限。'
  },
  {
    id: 'map-search',
    type: 'highlight',
    title: '搜索地点',
    content: '在搜索框输入地点名称，按回车或点击搜索按钮即可查找。',
    target: '#map-guide-area-control .map-search-bar'
  },
  {
    id: 'map-results',
    type: 'highlight',
    title: '搜索结果',
    content: '搜索结果会显示在列表中，点击可以定位到对应位置。',
    target: '.map-preview-card'
  },
  {
    id: 'map-actions',
    type: 'highlight',
    title: '功能操作',
    content: '「刷新位置」更新当前位置，「路线」规划导航，「清除路线」取消当前路线。',
    target: '#map-guide-area-toolbar .map-actions'
  },
  {
    id: 'map-quick-locations',
    type: 'highlight',
    title: '快捷地点',
    content: '这里列出热门景点，点击可以快速定位并查看距离。',
    target: '#map-guide-area-quick .map-quick-locations'
  },
  {
    id: 'map-fullscreen',
    type: 'highlight',
    title: '全屏查看',
    content: '点击「全屏查看」可以展开完整的地图界面，支持更多操作。',
    target: '.map-btn-fullscreen'
  },
  {
    id: 'map-tips',
    type: 'highlight',
    title: '使用提示',
    content: '遇到问题可以查看这里的使用提示。',
    target: '#map-guide-area-tips .map-tips'
  },
  {
    id: 'map-complete',
    type: 'modal',
    title: '地图功能介绍完成',
    content: '现在你可以开始使用地图导航功能了！如需帮助，可随时查看使用提示。'
  }
]

export const ONBOARDING_STORAGE_KEY = 'yunnan_travel_guide_completed'
export const MAP_ONBOARDING_STORAGE_KEY = 'yunnan_travel_map_guide_completed'
export const SELECTED_TABS_KEY = 'yunnan_travel_selected_tabs'
export const HIDDEN_TABS_KEY = 'yunnan_travel_hidden_tabs'
