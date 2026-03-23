# 动态高度适配Bug修复文档

## 问题背景

这是一个Vue 3项目，页面结构为：顶部tab导航栏 + 横向滚动的`.slides-container`容器（每个tab对应一个`.slide`）+ 页面底部的全局footer。

---

## 第一阶段：初始空白问题

### 页面情况
- **首页、斗南tab**：内容量适中，容器高度正常，内容与footer无缝衔接
- **大理tab**：内容充足，容器高度正常扩展，滑动到底部内容刚好衔接footer
- **丽江、香格里拉tab**：内容量少，容器高度未收缩，内容结束后与footer之间存在大面积空白

### 问题根因
`.slides-container`的整体高度被内容最高的大理slide撑开，全局footer固定在页面底部，导致内容少的tab出现空白。

### 修复思路
1. 引入`@vueuse/core`的`useResizeObserver`和`useWindowSize`
2. 给每个slide绑定ref，获取实际高度
3. 动态设置容器高度为当前激活tab的内容高度
4. 监听tab切换、窗口resize、内容变化

### 核心代码
```javascript
import { useResizeObserver, useWindowSize } from '@vueuse/core'

const slideRefs = ref([])
const currentSlideHeight = ref(0)

const containerStyle = computed(() => ({
  height: `${currentSlideHeight.value}px`,
  overflow: 'hidden'
}))

const updateSlideHeight = () => {
  const currentSlide = slideRefs.value[currentIndex.value]
  if (currentSlide) {
    currentSlideHeight.value = currentSlide.scrollHeight
  }
}

watch(currentIndex, () => {
  updateSlideHeight()
})
```

### 解决情况
首页、斗南空白问题解决，但切换tab后状态被污染。

---

## 第二阶段：状态污染问题

### 页面情况
- **初始状态**：首页、斗南正常，丽江、香格里拉仍有空白
- **切换后**：从丽江/香格里拉切回首页/斗南，原本正常的页面也出现空白
- **大理tab**：始终保持正常

### 问题根因
高度计算逻辑在处理内容极少的tab时失效，`currentSlideHeight`被错误保留，导致状态污染。

### 修复思路
1. 每次tab切换时强制重置`currentSlideHeight`为0
2. 使用`nextTick`确保DOM更新后再计算高度
3. 读取`.section`元素的`scrollHeight`而非整个slide

### 核心代码
```javascript
const updateSlideHeight = () => {
  currentSlideHeight.value = 0  // 强制重置
  
  nextTick(() => {
    setTimeout(() => {
      const currentSlide = slideRefs.value[currentIndex.value]
      const section = currentSlide.querySelector('.section')
      const contentHeight = section ? section.scrollHeight : currentSlide.scrollHeight
      if (contentHeight > 0) {
        currentSlideHeight.value = contentHeight
      }
    }, 50)
  })
}
```

### 解决情况
所有tab高度独立适配，但footer开始抖动。

---

## 第三阶段：Footer抖动问题

### 页面情况
- **刷新后**：全局footer持续抽搐/抖动
- **页面加载**：速度极慢，渲染阻塞
- **tab切换**：高度计算正常，但有明显延迟

### 问题根因
动态高度计算逻辑（`updateSlideHeight` + `useResizeObserver`）触发无限循环/高频执行，导致DOM样式高频更新。

### 修复思路
1. 添加防抖处理（`useDebounceFn`，延迟200ms）
2. 添加高度变化阈值判断（超过10px才更新）
3. 仅监听当前激活的slide，切换时停止上一个监听
4. 减少DOM读取频率

### 核心代码
```javascript
import { useDebounceFn } from '@vueuse/core'

let resizeObserverCleanup = null

const debouncedUpdateSlideHeight = useDebounceFn(() => {
  updateSlideHeight()
}, 200, { leading: true, trailing: false })

const updateSlideHeight = () => {
  nextTick(() => {
    const currentSlide = slideRefs.value[currentIndex.value]
    const newHeight = currentSlide.scrollHeight
    
    // 阈值判断：仅当高度变化超过10px时才更新
    if (newHeight > 0 && Math.abs(newHeight - currentSlideHeight.value) > 10) {
      currentSlideHeight.value = newHeight
    }
  })
}

const startResizeObserver = (index) => {
  if (resizeObserverCleanup) {
    resizeObserverCleanup()
    resizeObserverCleanup = null
  }
  
  const { stop } = useResizeObserver(slideRefs.value[index], () => {
    if (index === currentIndex.value) {
      debouncedUpdateSlideHeight()
    }
  })
  resizeObserverCleanup = stop
}
```

### 解决情况
Footer不再抖动，但切换tab时仍有跳动感，跨tab切换会经过中间所有tab。

---

## 第四阶段：视觉体验优化

### 页面情况
- **问题1**：切换tab时footer会短暂跳动1-2秒
- **问题2**：跨tab切换（如首页→香格里拉）会依次经过中间所有tab

### 问题根因
1. 高度计算有延迟，切换时先显示旧高度再更新
2. 滚动使用`behavior: 'smooth'`导致经过中间tab

### 修复思路
1. **预加载+缓存高度**：初始化时计算所有tab高度并缓存
2. **切换时直接使用缓存**：无需等待计算
3. **使用instant滚动**：直接跳转到目标tab
4. **缩短防抖延迟**：从200ms缩短至100ms
5. **CSS平滑过渡**：添加height过渡动画

### 核心代码

#### 预加载缓存
```javascript
const slideHeights = ref([0, 0, 0, 0, 0])

const preloadAllSlideHeights = () => {
  slideRefs.value.forEach((slide, index) => {
    if (slide) {
      const section = slide.querySelector('.section')
      slideHeights.value[index] = section ? section.scrollHeight : slide.scrollHeight
    }
  })
  currentSlideHeight.value = slideHeights.value[currentIndex.value] || 0
}

onMounted(() => {
  setTimeout(() => {
    preloadAllSlideHeights()
    startResizeObserver(currentIndex.value)
  }, 200)
})
```

#### 直接切换（不经中间tab）
```javascript
const goToSlide = (index, direction = null) => {
  if (index === currentIndex.value) return

  // 直接使用缓存高度，无延迟
  currentSlideHeight.value = slideHeights.value[index] || 0
  currentIndex.value = index

  isScrolling = true
  nextTick(() => {
    slidesContainer.value.scrollTo({
      left: index * window.innerWidth,
      behavior: 'instant'  // 直接跳转，不经过中间tab
    })
    setTimeout(() => {
      isScrolling = false
    }, 100)
  })
}
```

#### 防止滚动监听干扰
```javascript
let isScrolling = false

const handleScroll = () => {
  if (!slidesContainer.value || isScrolling) return  // 跳过编程式滚动
  const newIndex = Math.round(scrollLeft / window.innerWidth)
  if (newIndex !== currentIndex.value) {
    currentSlideHeight.value = slideHeights.value[newIndex] || 0
    currentIndex.value = newIndex
  }
}
```

#### CSS平滑过渡
```css
.slides-container {
  transition: height 0.25s ease-out;
}
```

### 解决情况
- 切换任意tab：footer平滑沉底，无跳动
- 跨tab切换：直接跳转到目标tab
- 所有tab：高度正确适配，无空白无污染

---

## 最终方案总结

### 核心技术点
1. **Vue 3 Composition API**：ref、computed、watch、nextTick、onMounted
2. **@vueuse/core**：useResizeObserver、useWindowSize、useDebounceFn

### 核心逻辑
```
初始化 → 预加载所有tab高度 → 缓存到数组
    ↓
切换tab → 直接读取缓存高度 → 瞬间设置容器高度
    ↓
instant滚动 → 直接跳转到目标tab
    ↓
内容变化 → ResizeObserver触发 → 更新缓存和高度
```

### 关键注意事项
1. **必须移除slide的min-height**：否则会撑开容器
2. **使用阈值判断**：避免像素级波动触发重复计算
3. **仅监听当前slide**：避免多slide同时监听导致性能问题
4. **防止滚动监听干扰**：编程式滚动时跳过handleScroll

---

## 文件修改清单

| 文件 | 修改内容 |
|------|----------|
| `src/views/YunnanTravel.vue` | 添加高度计算逻辑、预加载缓存、切换优化 |
| `src/styles/travel.css` | 添加CSS变量、动画类 |
| `src/utils/storage.js` | 提取公共存储工具 |
| `src/utils/animation.js` | 新增动画工具函数 |
| `package.json` | 添加@vueuse/core依赖 |