# 云南旅行攻略 - 沉浸式新手引导 + 页面交互优化

> 文档创建时间：2026-03-24
> 文档状态：规划完成，待实施

---

## 一、原始需求（用户提供的完整需求）

### 1.1 核心目标

从目前的信息展示，转换为决策决定，通过沉浸式新手引导，帮助用户快速建立使用习惯，同时简化页面结构，让内容更聚焦。

### 1.2 新手引导完整流程

#### 1. 引导触发与状态保存

- 不能让同一个用户每次访问页面都触发新手引导，需要有一个办法能保存状态
- 如果检测到此用户经历过新手引导，就不触发
- 为了保险，给新手引导第一句话是问用户是否体验过本系统：
  - 如果选择体验过，就触发一句 "祝旅途愉快！"，然后页面两边爆发礼花（做点小特效），然后关闭引导
- 每一步都有跳过按钮
- 在设置里，也有重新体验新手引导的按钮

#### 2. 新手引导具体步骤

**步骤 1：Tab 选择引导**
- 用户进入页面，会出现新手引导
- 新手引导要求展示特定内容时，其他内容增加遮罩（背景会灰，展示的内容变白，突出重点）
- 首先展示四个 tab：斗南花市，大理，丽江，香格里拉
- 先让用户点击 tab，选择展示哪些 tab 的内容
- 比如用户只点击了斗南和大理，那丽江和香格里拉会有一个动效，它们会被加入管理删除卡片的界面

**步骤 2：设置面板引导**
- 然后顺手推舟的让用户点击右下角设置按钮
- 展开设置列表后用户会看到如下功能：
  - 切换主题色（亮色，暗色，护眼（新增，护眼这个到时候既可以让用户手动开启，也可以加一个到晚上 6 点开启，早上 6 点结束，反正是前端设置个定时任务的事情），跟随系统，然后默认是亮色，引导会让用户切换一次暗色试试，然后系统会帮用户切换回亮色）
  - 设置字号，设置字体是否加粗
  - 管理已删除卡片，这里会展开用户所选择的 tab 下的内容，跳转到一张可以删除的卡片那里，自动删卡片，然后让用户去到管理列表里把它恢复
  - 用户此时去到管理列表，管理列表下方会多出一个区间，存放未启用的 Tab
  - 看到刚才没有选择的 tab，引导会提醒用户点击也可以恢复他们
  - 点击之后，会聚焦于 Tab 栏比如启用了丽江，会展示一下丽江出现在 Tab 栏上，然后系统自动点击丽江 Tab，顺着往下快速展示一下内容，然后视角重新回到设置里的管理列表中
  - 播放音乐按钮也放到设置里，引导的时候提一嘴，比如聚焦于音乐按钮，然后系统自动模拟点了一下按钮，展开音乐列表界面，然后说 "如果需要的话，可以边听歌边继续（虽然感觉不太需要但还是做进来了）"

**步骤 3：各 Tab 板块内容折叠与快速跳转引导**
- 针对目前每个 tab 板块页面过多复杂的问题，我决定每个 tab 板块的内容分类，贴个标签，然后每个标签下的内容或卡片，初始都是折叠状态
- 页面顶部或侧面新增一个管理列表，用户点击哪个标签名称，或做成按钮的形式，就可以快速跳转去对应的位置，并展开列表
- 同时，每个列表标题右侧，有个浏览其他（或者叫其他更贴切的名字）的按钮，点击之后，也是打开刚才那个管理列表，此时可以点击其他按钮快速跳转到其他内容，方便用户快速跳转

**步骤 4：地图页面引导**
- 地图页面，也会有一个详细的新手引导

#### 3. 动效要求

- 以上我所说的动效，一定要包含在提示词里面
- 当用户点击下一步时，进行下一步，要求过渡合理，衔接合理
- 遮罩层、高亮展示、Tab 删除 / 恢复动效、礼花特效等，都要实现

### 1.3 技术实现要求

#### 1. 新手引导状态管理
- 使用 localStorage 持久化存储新手引导状态，key 为 `yunnan_travel_guide_completed`，值为 boolean 类型
- 页面加载时判断 localStorage 中是否有该状态，若为 true 则不触发引导
- 设置页「重新体验新手引导」按钮，点击后重置 localStorage 状态，刷新页面后重新触发引导

#### 2. 遮罩与高亮实现
- 新手引导使用全屏遮罩层，背景色为半透明黑色（rgba (0,0,0,0.7)）
- 需要展示的内容区域，通过动态计算位置，在遮罩层上挖空高亮，或通过 z-index 控制层级，让目标内容浮在遮罩层上方
- 高亮区域要有平滑的过渡动画，从一个区域移动到下一个区域时，过渡自然

#### 3. 各 Tab 板块内容折叠与快速跳转
- 每个 Tab 板块的内容按标签分类，初始全部折叠
- 新增快速跳转管理列表，支持点击标签自动滚动到对应位置并展开内容
- 列表标题右侧的「浏览其他」按钮，点击后打开管理列表，支持快速切换

#### 4. 主题色切换
- 实现亮色、暗色、护眼、跟随系统四种主题
- 护眼模式支持手动开关，同时支持定时：晚上 6 点自动开启，早上 6 点自动结束
- 默认主题为亮色

### 1.4 验证标准

- 新手引导流程完整：从 Tab 选择到设置面板，再到各 Tab 板块折叠跳转，最后到地图引导，每一步都能正常执行
- 动效流畅：遮罩、高亮、Tab 删除 / 恢复、礼花等动效都能正常展示，过渡自然
- 状态保存正常：经历过一次引导后，刷新页面不再触发；点击设置页的重新体验按钮，能再次触发
- 折叠跳转功能正常：各 Tab 板块内容初始折叠，点击快速跳转列表能正常展开并滚动
- 主题切换正常：四种主题都能正常切换，护眼模式定时功能正常

---

## 二、用户补充的详细需求（地图引导 + 护眼模式）

### 2.1 地图页面引导详细步骤

用户提供了完整的地图引导流程：

1. **项目介绍**：先简单介绍一下本项目
2. **Tab 展示与选择**：
   - 先把 Tab 展示出来，让用户选择需要的 Tab
   - 因为用户一开始是想只逛昆明和大理，但是额外设置了丽江和香格里拉
   - 如果用户全选，就接着演示 Tab 切换
   - 如果用户只选了昆明和大理，还是演示 Tab 切换
3. **模块跳转演示**：
   - 在特定 Tab 下，演示点击特定模块名称跳转到特定模块
   - 再点击折叠起来的卡片名称展开卡片的操作
4. **设置按钮介绍**：介绍右下角设置按钮，展示设置面板
5. **主题切换演示**：
   - 演示显示主题板块的功能
   - 介绍到暗色模式时，系统会切换到暗色
   - 然后关闭设置面板让用户看一下页面的效果
   - 随后系统再打开设置面板，切换回亮色
6. **字体设置演示**：
   - 演示字体设置功能，字体默认中号
   - 介绍到大号字体时，用大理 Tab 下的详细行程时间线做演示
   - 系统会自动来到这里并展开卡片
   - 然后先聚焦内容让用户看中号字体的效果
   - 再切换去大号字体，再聚焦于详细行程，让用户看效果
   - 文字粗细默认是正常，加粗也是用详细行程来演示（目前详细行程的内容不受加粗影响，需要修改）
7. **隐藏内容管理演示**：
   - 用首页的省内高铁交通来演示
   - 系统会先聚焦于卡片，然后再聚焦于删除卡片按钮
   - 然后系统会点一下，然后聚焦于已隐藏 xxx，点击恢复那句话
   - 然后系统会提示用户有两个恢复的途径：
     - 一个是点击【点击恢复】字体
     - 另一个是在设置里的隐藏内容管理->管理已隐藏的卡片来恢复
   - 此时在隐藏内容管理下方加一个隐藏地点管理，样式可以和隐藏内容管理一致
   - 假如用户只选了昆明和大理，那么点击进去就会看到丽江和香格里拉，也是可以恢复
   - 恢复之后 Tab 正常显示，正常切换
8. **音乐功能介绍**：
   - 音乐按钮移动到设置中
   - 介绍音乐按钮的时候系统会说"如有需要，可以边听歌边浏览"
   - 然后演示如何播放歌曲，以及歌曲播放界面的各种功能
9. **地图功能介绍**：
   - 先大致介绍一下地图板块的功能，一定要介绍需要开启定位
   - 然后开始演示：
     - 先演示搜索，然后展示下搜索之后的结果集
     - 再点击其中一个结果集
     - 然后演示路线
     - 再介绍下目前的路线功能的优化：
       - 比如路线如果不点击按钮清除就不会消失
       - 移动端（用户肯定是用的移动端）使用，会每隔一段时间更新所在位置
       - 可以选择驾车，骑行，步行过去目的地等等
       - 也可以点击打开高德地图按钮直接唤起手机上的高德地图 app
     - 然后介绍全屏地图展示
   - 地图现有的功能都介绍一下

### 2.2 总体要求

- 把握好每一步介绍的字数
- 核心目的是让用户知道了解后续如何操作
- 不要长篇大论，要让用户能获取有效信息
- 最后不要忘记提醒用户如有需要可以在设置按钮里重新体验新手引导

### 2.3 护眼模式时间控制

- 使用用户本地时间判断（`new Date().getHours()`）
- 晚上 6 点自动开启，早上 6 点自动结束

---

## 三、现有代码库分析

### 3.1 项目技术栈

- **框架**: Vue 3 + Vue Router
- **UI 库**: Element Plus
- **工具库**: @vueuse/core
- **地图**: 高德地图 (@amap/amap-jsapi-loader)
- **样式**: CSS Variables + Scoped CSS

### 3.2 现有文件结构

```
src/
├── main.js
├── App.vue
├── router/
│   └── index.js                    # 路由配置，单页面应用
├── data/
│   └── travelData.js               # 旅游数据（目的地、交通、攻略等）
├── styles/
│   └── travel.css                  # 全局样式变量
├── components/
│   └── travel/
│       ├── InfoCard.vue            # 信息卡片组件（可关闭）
│       ├── DestinationCard.vue     # 目的地卡片
│       └── slides/
│           ├── HomeSlide.vue       # 首页
│           ├── DounanSlide.vue     # 斗南花市
│           ├── DaliSlide.vue       # 大理
│           ├── LijiangSlide.vue    # 丽江
│           ├── ShangriSlide.vue    # 香格里拉
│           ├── MapSlide.vue        # 地图页面
│           └── slides-common.css   # Slide 公共样式
└── views/
    └── YunnanTravel.vue            # 主页面，包含所有核心逻辑
```

### 3.3 现有功能分析

#### YunnanTravel.vue 已实现功能

1. **Tab 导航系统**
   - `navTabs`: 导航 Tab 数据
   - `currentIndex`: 当前 Tab 索引
   - `goToSlide()`: Tab 切换方法
   - 支持触摸滑动、鼠标拖拽、键盘导航

2. **主题系统**
   - `themeMode`: 主题模式（light/dark/auto）
   - `setTheme()`: 主题切换
   - 已支持跟随系统

3. **字体设置**
   - `fontSize`: 字体大小（small/medium/large）
   - `fontWeight`: 字体粗细（normal/bold）
   - CSS Variables: `--text-scale`, `--text-weight-boost`

4. **隐藏内容管理**
   - `hiddenCards`: 已隐藏卡片集合
   - `hideCard()`, `showCard()`, `showAllCards()`
   - 支持恢复功能

5. **音乐播放器**
   - 当前为独立悬浮按钮
   - 支持播放列表、进度条、音量控制

6. **Lightbox 图片预览**
   - 点击图片放大查看

7. **首次访问提示**
   - `firstVisitTipVisible`: 提示"点击卡片右上角 × 可隐藏内容"
   - 存储在 localStorage (`seenCardTip`)

#### 各 Slide 组件已实现功能

1. **DounanSlide.vue**
   - 快速导航栏 (`quick-nav-bar`)
   - 模块折叠/展开 (`expandedModules`)
   - 滚动定位 (`scrollToModule`)
   - IntersectionObserver 监听当前可见模块

2. **其他 Slide 结构类似**

### 3.4 现有样式系统

```css
:root {
  /* 颜色变量 */
  --forest: oklch(45% 0.12 145);
  --sunset: oklch(65% 0.18 35);
  --text: oklch(20% 0.02 60);
  /* ... */
  
  /* 空间变量 */
  --space-xs: 0.5rem;
  --space-md: 1rem;
  /* ... */
  
  /* 动画变量 */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --duration-normal: 250ms;
}
```

---

## 四、实施方案

### 4.1 新增文件结构

```
src/
├── composables/
│   ├── useOnboarding.js          # 新手引导核心逻辑
│   ├── useTheme.js               # 主题管理（含护眼模式定时）
│   └── useTabManagement.js       # Tab 管理逻辑
├── components/
│   ├── onboarding/
│   │   ├── OnboardingOverlay.vue      # 引导遮罩层主组件
│   │   ├── OnboardingStep.vue         # 单步引导组件
│   │   ├── OnboardingTooltip.vue      # 引导提示框
│   │   ├── TabSelectionStep.vue       # Tab 选择引导步骤
│   │   ├── ConfettiEffect.vue         # 礼花特效组件
│   │   └── onboarding-steps.js        # 引导步骤配置
│   └── travel/
│       ├── GlobalNavPanel.vue         # 全局导航面板
│       └── slides/
│           └── slides-common.css      # 已有，需扩展折叠样式
├── styles/
│   └── onboarding.css             # 引导相关样式
└── views/
    └── YunnanTravel.vue           # 主页面（需修改）
```

### 4.2 核心模块设计

#### 模块 1：新手引导状态管理 (useOnboarding.js)

```javascript
// 核心功能：
// 1. localStorage 状态持久化 (key: yunnan_travel_guide_completed)
// 2. 引导步骤管理
// 3. 引导状态重置功能
// 4. 首次访问检测 + "是否体验过" 询问

export function useOnboarding() {
  // 状态
  const completed = ref(false)
  const currentStep = ref(0)
  const isActive = ref(false)
  const selectedTabs = ref(new Set(['dounan', 'dali', 'lijiang', 'shangri']))
  
  // 方法
  const startOnboarding = () => { /* ... */ }
  const skipOnboarding = () => { /* ... */ }
  const resetOnboarding = () => { /* ... */ }
  const completeOnboarding = () => { /* ... */ }
  const nextStep = () => { /* ... */ }
  const prevStep = () => { /* ... */ }
  
  return {
    completed,
    currentStep,
    isActive,
    selectedTabs,
    startOnboarding,
    skipOnboarding,
    resetOnboarding,
    completeOnboarding,
    nextStep,
    prevStep
  }
}
```

#### 模块 2：Tab 选择引导步骤 (TabSelectionStep.vue)

交互流程：
1. 展示 4 个地点 Tab：斗南花市、大理、丽江、香格里拉
2. 用户点击选择需要的 Tab
3. 未选择的 Tab 有动画效果移入"隐藏地点管理"区域
4. 点击"下一步"继续

动效设计：
- 未选中 Tab：缩小 + 淡出 + 飞向右下角设置区域
- 恢复 Tab：从设置区域飞回 + 放大 + 淡入

#### 模块 3：遮罩与高亮实现 (OnboardingOverlay.vue)

技术方案：
```html
<div class="overlay-backdrop">
  <!-- 高亮区域通过动态计算位置 -->
  <div class="highlight-spotlight" :style="spotlightStyle"></div>
</div>
```

核心功能：
- 全屏半透明遮罩 (rgba(0,0,0,0.7))
- 动态计算目标元素位置，创建高亮镂空区
- 高亮区域平滑过渡动画
- 提示框定位（目标元素附近）

#### 模块 4：主题系统增强 (useTheme.js)

新增功能：
- 护眼模式 (eye-care)
- 护眼模式定时：晚 6 点自动开启，早 6 点自动关闭
- 使用 setInterval 每分钟检查时间

```javascript
// 护眼模式定时逻辑
const checkEyeCareTime = () => {
  const hour = new Date().getHours()
  // 18:00 - 06:00 为护眼模式时段
  const shouldBeActive = hour >= 18 || hour < 6
  
  if (themeMode.value === 'eye-care-auto' && shouldBeActive !== isDark.value) {
    toggleEyeCare(shouldBeActive)
  }
}
```

主题配置：
```javascript
const themeOptions = [
  { value: 'light', label: '亮色' },
  { value: 'dark', label: '暗色' },
  { value: 'eye-care', label: '护眼' },
  { value: 'eye-care-auto', label: '护眼（定时）' },
  { value: 'auto', label: '跟随系统' }
]
```

#### 模块 5：隐藏地点管理

修改 YunnanTravel.vue 中的设置面板：
- 在"隐藏内容管理"下方新增"隐藏地点管理"
- 展示用户未选择的 Tab（丽江、香格里拉等）
- 支持恢复隐藏的地点
- 恢复后 Tab 正常显示

数据结构：
```javascript
const hiddenTabs = ref(new Set())  // 存储隐藏的 Tab ID
const hiddenCards = ref(new Set()) // 已有，存储隐藏的卡片
```

#### 模块 6：礼花特效 (ConfettiEffect.vue)

触发时机：
1. 用户选择"体验过本系统"时
2. 完成新手引导最后一项时

实现方案：
- 使用 Canvas 绘制粒子效果
- 从页面两侧发射礼花
- 支持 prefers-reduced-motion

### 4.3 引导步骤详细配置

```javascript
export const onboardingSteps = [
  // Step 0: 欢迎询问
  {
    id: 'welcome',
    type: 'modal',
    title: '欢迎使用云南旅行攻略',
    content: '这是您第一次使用本系统吗？',
    options: [
      { label: '第一次使用', action: 'next' },
      { label: '已经体验过', action: 'complete' }  // 触发礼花
    ]
  },
  
  // Step 1: Tab 选择引导
  {
    id: 'tab-selection',
    type: 'tab-selection',
    title: '选择您想查看的目的地',
    content: '点击选择需要的地点，不选择的地点可以在设置中恢复',
    target: '.nav-tabs-inner',
    actions: ['selectAll', 'clearAll']
  },
  
  // Step 2: 设置按钮引导
  {
    id: 'settings-intro',
    type: 'highlight',
    title: '设置面板',
    content: '点击右下角设置按钮，可以个性化您的浏览体验',
    target: '.settings-toggle',
    waitForClick: true
  },
  
  // Step 3: 主题切换引导
  {
    id: 'theme-switch',
    type: 'highlight',
    title: '显示主题',
    content: '支持亮色、暗色、护眼模式，护眼模式会在晚6点到早6点自动开启',
    target: '.settings-section:nth-child(1)',
    autoAction: {
      type: 'theme-demo',
      demo: 'dark',
      thenRevert: true
    }
  },
  
  // Step 4: 字体设置引导
  {
    id: 'font-settings',
    type: 'highlight',
    title: '字体设置',
    content: '可以调整文字大小和粗细，方便阅读',
    target: '.settings-section:nth-child(2)',
    autoAction: {
      type: 'navigate-demo',
      tab: 2,  // 大理
      module: 'route-detail',  // 详细行程
      fontSize: 'large'
    }
  },
  
  // Step 5: 隐藏内容管理引导
  {
    id: 'hidden-content',
    type: 'highlight',
    title: '隐藏内容管理',
    content: '可以隐藏不需要的内容，也可以在这里恢复',
    target: '.settings-section:nth-child(3)',
    autoAction: {
      type: 'hide-card-demo',
      tab: 0,  // 首页
      cardId: 'home-transport'
    }
  },
  
  // Step 6: 隐藏地点管理
  {
    id: 'hidden-tabs',
    type: 'highlight',
    title: '隐藏地点管理',
    content: '之前未选择的地点可以在这里恢复',
    target: '.settings-section:nth-child(4)'  // 新增
  },
  
  // Step 7: 音乐功能引导
  {
    id: 'music-intro',
    type: 'highlight',
    title: '背景音乐',
    content: '如有需要，可以边听歌边浏览',
    target: '.settings-section:nth-child(5)',  // 音乐移入设置
    autoAction: {
      type: 'music-demo',
      play: true
    }
  },
  
  // Step 8: 地图引导
  {
    id: 'map-intro',
    type: 'navigate',
    title: '地图导航',
    content: '地图页面可以搜索地点、规划路线...',
    target: { tab: 5 },  // 地图 Tab
    subSteps: [
      { target: '.map-search-bar', content: '搜索地点...' },
      { target: '.map-actions', content: '功能操作...' },
      { target: '.map-quick-locations', content: '快捷地点...' }
    ]
  },
  
  // Step 9: 完成
  {
    id: 'complete',
    type: 'modal',
    title: '引导完成',
    content: '如需重新体验引导，可在设置中找到"重新体验新手引导"按钮',
    actions: ['complete']
  }
]
```

### 4.4 动效实现细节

#### 遮罩层过渡
```css
.overlay-backdrop {
  transition: opacity 0.4s var(--ease-out-quart);
}

.highlight-spotlight {
  transition: all 0.35s var(--ease-out-quart);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
}
```

#### Tab 删除/恢复动效
```css
.tab-remove-animation {
  animation: tabRemove 0.5s var(--ease-out-quint) forwards;
}

@keyframes tabRemove {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(0.3) translateX(200px) translateY(100px); opacity: 0; }
}
```

#### 礼花特效
```javascript
// Canvas 粒子系统
class ConfettiParticle {
  constructor(x, y, color) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 15
    this.vy = Math.random() * -20 - 10
    this.gravity = 0.5
    this.color = color
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 10
  }
  
  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += this.gravity
    this.rotation += this.rotationSpeed
  }
}
```

---

## 五、实施计划

### 5.1 分阶段实施表

| 阶段 | 模块 | 预计文件 | 复杂度 | 状态 |
|------|------|----------|--------|------|
| **Phase 1** | 引导状态管理 | useOnboarding.js | ⭐⭐ | 待开始 |
| | 遮罩层基础组件 | OnboardingOverlay.vue | ⭐⭐⭐ | 待开始 |
| | 引导步骤配置 | onboarding-steps.js | ⭐⭐ | 待开始 |
| **Phase 2** | Tab 选择引导 | TabSelectionStep.vue | ⭐⭐⭐ | 待开始 |
| | Tab 管理逻辑 | useTabManagement.js | ⭐⭐ | 待开始 |
| | 隐藏地点管理 | YunnanTravel.vue 修改 | ⭐⭐ | 待开始 |
| **Phase 3** | 主题系统增强 | useTheme.js | ⭐⭐ | 待开始 |
| | 护眼模式定时 | useTheme.js | ⭐⭐ | 待开始 |
| **Phase 4** | 设置面板引导 | OnboardingOverlay.vue | ⭐⭐ | 待开始 |
| | 字体设置演示 | OnboardingOverlay.vue | ⭐⭐⭐ | 待开始 |
| | 隐藏内容演示 | OnboardingOverlay.vue | ⭐⭐ | 待开始 |
| **Phase 5** | 音乐功能迁移 | YunnanTravel.vue | ⭐⭐ | 待开始 |
| | 音乐引导演示 | OnboardingOverlay.vue | ⭐⭐ | 待开始 |
| **Phase 6** | 地图引导 | OnboardingOverlay.vue | ⭐⭐⭐⭐ | 待开始 |
| **Phase 7** | 礼花特效 | ConfettiEffect.vue | ⭐⭐ | 待开始 |
| | 最终集成测试 | - | ⭐⭐⭐ | 待开始 |

### 5.2 关键技术点

1. **元素高亮定位**: 使用 `getBoundingClientRect()` 动态计算，支持滚动时更新
2. **跨组件状态**: 使用 `provide/inject` 或全局状态管理
3. **动画协调**: 使用 `nextTick` + `setTimeout` 确保动画序列正确
4. **性能优化**: 引导步骤懒加载，减少初始包体积
5. **无障碍**: 所有引导步骤支持键盘操作，提供 `aria-label`

---

## 六、验证清单

- [ ] 新手引导流程完整：从 Tab 选择到地图引导
- [ ] 状态保存正常：localStorage 持久化
- [ ] 动效流畅：遮罩、高亮、Tab 动画、礼花
- [ ] 护眼模式定时正常：晚 6 点开启，早 6 点关闭
- [ ] 隐藏地点管理：恢复后 Tab 正常显示
- [ ] 设置页重置按钮：能重新触发引导
- [ ] 跳过按钮：每一步都可跳过
- [ ] 体验过选项：触发礼花后关闭

---

## 七、待讨论/待确认事项

### 7.1 已确认事项

1. ✅ 实施范围：完整实现所有需求
2. ✅ 护眼模式时间控制：使用用户本地时间
3. ✅ 地图引导内容：已提供详细步骤

### 7.2 待后续确认事项

1. 护眼模式的具体配色方案（需要定义护眼模式的 CSS 变量）
2. 详细行程内容是否需要支持字体加粗效果（目前可能不受影响）
3. 引导提示框的具体样式设计

---

## 八、更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-03-24 | 创建文档，完成需求分析和实施方案设计 |