<template>
  <div class="travel-app" ref="appContainer">
    <a href="#main-content" class="skip-link">跳转到主要内容</a>

    <header class="hero">
      <div class="hero-content">
        <h1>云南旅行攻略</h1>
        <p class="hero-subtitle">斗南花市 · 大理洱海</p>
      </div>
    </header>

    <nav class="nav-tabs" role="navigation" aria-label="目的地导航">
      <div class="nav-tabs-inner" ref="navInner">
        <button
          v-for="(tab, index) in navTabs"
          :key="tab.id"
          ref="tabButtons"
          :class="['nav-tab', { active: index === currentIndex }]"
          @click="goToSlide(index, index > currentIndex ? 'right' : 'left')"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>

    <main class="slides-container" id="main-content" ref="slidesContainer" :style="containerStyle" @mousedown="handleMouseDown" @touchstart="handleTouchStart">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        :ref="el => setSlideRef(el, index)"
        :class="['slide', { active: index === currentIndex }, slideDirection === 'right' ? 'slide-in-right' : 'slide-in-left']"
        :data-index="index"
      >
        <component
          :is="slide.component"
          :data="slide.data"
          :hidden-cards="hiddenCards"
          @hide-card="hideCard"
          @navigate="handleNavigate"
          @open-lightbox="openLightbox"
        />
      </div>
    </main>

    <footer class="footer">
      <p class="footer-text">愿你的云南之旅，一路花开</p>
    </footer>

    <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'">
      <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      </svg>
      <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
      </svg>
    </button>

    <div class="music-player" :class="{ 'show-info': showMusicInfo }">
      <div class="music-info">正在播放：春花</div>
      <button class="music-toggle" :class="{ playing: isMusicPlaying }" @click="toggleMusic" aria-label="播放/暂停音乐">
        <svg v-if="!isMusicPlaying" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16"/>
          <rect x="14" y="4" width="4" height="16"/>
        </svg>
      </button>
    </div>

    <div class="music-prompt" :class="{ show: showMusicPrompt }">
      <div class="music-prompt-icon">🌸</div>
      <p class="music-prompt-text">春花 - やまだ豊<br><span class="music-prompt-hint">点击播放背景音乐</span></p>
      <button class="music-prompt-btn" @click="playMusicFromPrompt">播放音乐</button>
      <button class="music-prompt-close" @click="showMusicPrompt = false">稍后再说</button>
    </div>

    <button class="sidebar-toggle" :class="{ 'has-hidden': hiddenCards.size > 0, pulse: badgePulse }" @click="sidebarVisible = true">
      <span class="sidebar-toggle-label">管理内容</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
      <span class="badge" v-if="hiddenCards.size > 0">{{ hiddenCards.size }}</span>
    </button>

    <div class="sidebar-overlay" :class="{ active: sidebarVisible }" @click="sidebarVisible = false"></div>
    <div class="sidebar-panel" :class="{ active: sidebarVisible }">
      <div class="sidebar-header">
        <span class="sidebar-title">已隐藏的内容</span>
        <button class="sidebar-close" @click="sidebarVisible = false" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="sidebar-content">
        <div class="sidebar-empty" v-if="hiddenCards.size === 0">
          <div class="sidebar-empty-icon">📋</div>
          <p>没有隐藏的内容</p>
          <p class="sidebar-empty-hint">点击卡片右上角的 × 可以隐藏不需要的内容</p>
        </div>
        <div v-for="cardId in [...hiddenCards]" :key="cardId" class="sidebar-item">
          <span class="sidebar-item-name">{{ getCardName(cardId) }}</span>
          <button class="sidebar-item-restore" @click="showCard(cardId)">恢复</button>
        </div>
      </div>
      <div class="sidebar-footer" v-if="hiddenCards.size > 0">
        <button class="sidebar-reset-btn" @click="showAllCards">恢复所有隐藏内容</button>
      </div>
    </div>

    <button class="nav-arrow prev" :style="{ opacity: currentIndex === 0 ? 0.3 : 1 }" @click="goToSlide(currentIndex - 1, 'left')" aria-label="上一页">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <button class="nav-arrow next" :style="{ opacity: currentIndex === 4 ? 0.3 : 1 }" @click="goToSlide(currentIndex + 1, 'right')" aria-label="下一页">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>

    <button class="back-top" :class="{ visible: currentIndex > 0 }" @click="goToSlide(0, 'left')" aria-label="返回首页">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    </button>

    <div class="slide-indicator" role="tablist" aria-label="页面导航">
      <span
        v-for="i in 5"
        :key="i"
        :class="['slide-dot', { active: i - 1 === currentIndex }]"
        role="tab"
        tabindex="0"
        :aria-label="['首页', '斗南', '大理', '丽江', '香格里拉'][i-1]"
        :aria-selected="i - 1 === currentIndex"
        @click="goToSlide(i - 1, i - 1 > currentIndex ? 'right' : 'left')"
        @keydown.enter="goToSlide(i - 1, i - 1 > currentIndex ? 'right' : 'left')"
      ></span>
    </div>

    <Teleport to="body">
      <div class="lightbox" :class="{ active: lightboxVisible }" @click.self="lightboxVisible = false">
        <div class="lightbox-content">
          <button class="lightbox-close" @click="lightboxVisible = false" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <img class="lightbox-img" :src="lightboxImage" :alt="lightboxLabel">
          <div class="lightbox-label" v-if="lightboxLabel">{{ lightboxLabel }}</div>
        </div>
      </div>
    </Teleport>

    <div class="toast" :class="{ show: toastVisible }">
      <span>{{ toastMessage }}</span>
      <span class="toast-action" @click="sidebarVisible = true">管理内容</span>
    </div>

    <div class="first-visit-tip" :class="{ show: firstVisitTipVisible }">
      点击卡片右上角 × 可隐藏内容
      <button class="first-visit-close" @click="dismissFirstVisitTip">知道了</button>
    </div>

    <audio ref="bgMusic" loop preload="auto">
      <source src="/spring-flowers.mp3" type="audio/mpeg">
    </audio>

    <div id="a11yAnnouncer" class="sr-only" aria-live="polite" aria-atomic="true"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useResizeObserver, useWindowSize, useDebounceFn } from '@vueuse/core'
import HomeSlide from '@/components/travel/slides/HomeSlide.vue'
import DounanSlide from '@/components/travel/slides/DounanSlide.vue'
import DaliSlide from '@/components/travel/slides/DaliSlide.vue'
import LijiangSlide from '@/components/travel/slides/LijiangSlide.vue'
import ShangriSlide from '@/components/travel/slides/ShangriSlide.vue'
import { navTabs, dounanData, daliData, lijiangData, shangriData } from '@/data/travelData'

const slides = [
  { component: HomeSlide, data: {} },
  { component: DounanSlide, data: dounanData },
  { component: DaliSlide, data: daliData },
  { component: LijiangSlide, data: lijiangData },
  { component: ShangriSlide, data: shangriData }
]

const appContainer = ref(null)
const slidesContainer = ref(null)
const navInner = ref(null)
const bgMusic = ref(null)
const slideRefs = ref([])

const currentIndex = ref(0)
const isDark = ref(false)
const hiddenCards = ref(new Set())
const sidebarVisible = ref(false)
const badgePulse = ref(false)

const currentSlideHeight = ref(0)
const slideHeights = ref([0, 0, 0, 0, 0])
const { width: windowWidth } = useWindowSize()

let resizeObserverCleanup = null
let isScrolling = false

const setSlideRef = (el, index) => {
  if (el) {
    slideRefs.value[index] = el
  }
}

const containerStyle = computed(() => {
  return {
    height: `${currentSlideHeight.value}px`,
    overflow: 'hidden'
  }
})

const preloadAllSlideHeights = () => {
  slideRefs.value.forEach((slide, index) => {
    if (slide) {
      const section = slide.querySelector('.section')
      slideHeights.value[index] = section ? section.scrollHeight : slide.scrollHeight
    }
  })
  currentSlideHeight.value = slideHeights.value[currentIndex.value] || 0
}

const refreshCurrentSlideHeight = () => {
  nextTick(() => {
    const currentSlide = slideRefs.value[currentIndex.value]
    if (!currentSlide) return

    const section = currentSlide.querySelector('.section')
    const newHeight = section ? section.scrollHeight : currentSlide.scrollHeight

    if (newHeight > 0) {
      slideHeights.value[currentIndex.value] = newHeight
      if (Math.abs(newHeight - currentSlideHeight.value) > 10) {
        currentSlideHeight.value = newHeight
      }
    }
  })
}

const debouncedUpdateSlideHeight = useDebounceFn(() => {
  refreshCurrentSlideHeight()
}, 100, { leading: true, trailing: false })

const startResizeObserver = (index) => {
  if (resizeObserverCleanup) {
    resizeObserverCleanup()
    resizeObserverCleanup = null
  }

  const slide = slideRefs.value[index]
  if (!slide) return

  const { stop } = useResizeObserver(slide, () => {
    if (index === currentIndex.value) {
      refreshCurrentSlideHeight()
    }
  })

  resizeObserverCleanup = stop
}

const lightboxVisible = ref(false)
const lightboxImage = ref('')
const lightboxLabel = ref('')

const toastVisible = ref(false)
const toastMessage = ref('')

const firstVisitTipVisible = ref(false)

const isMusicPlaying = ref(false)
const showMusicPrompt = ref(false)
const showMusicInfo = ref(false)

let touchStartX = 0
let mouseStartX = 0
let isDragging = false
let scrollStartLeft = 0

const cardNames = {
  'home-itinerary': '推荐行程',
  'home-travel-tips': '出行防护',
  'home-transport': '省内高铁交通',
  'home-checklist': '出行必备',
  'dounan-time-table': '斗南营业时间表',
  'dounan-routes': '斗南逛买路线',
  'dounan-venue': '斗南场馆详解',
  'dounan-shipping': '斗南寄花指南',
  'dounan-tips': '斗南选花技巧',
  'dounan-budget': '斗南预算参考',
  'dounan-info': '斗南交通美食',
  'dali-route-overview': '大理路线总览',
  'dali-route-detail': '大理详细路线',
  'dali-stay': '大理住宿推荐',
  'dali-student': '大理学生优惠',
  'dali-food': '大理必吃美食',
  'dali-budget': '大理预算参考',
  'lijiang-tips': '丽江核心要点',
  'lijiang-venue': '丽江景点',
  'lijiang-transport': '丽江交通指南',
  'lijiang-budget': '丽江预算参考',
  'lijiang-info': '丽江住宿美食',
  'shangri-venue': '香格里拉景点',
  'shangri-transport': '香格里拉交通指南',
  'shangri-budget': '香格里拉预算参考',
  'shangri-info': '香格里拉住宿美食'
}

const safeStorage = {
  getItem (key) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return null
    }
  },
  setItem (key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (e) {}
  }
}

const goToSlide = (index, direction = null) => {
  if (index < 0 || index >= 5) return
  if (index === currentIndex.value) return

  currentSlideHeight.value = slideHeights.value[index] || 0
  currentIndex.value = index

  isScrolling = true
  nextTick(() => {
    if (slidesContainer.value) {
      slidesContainer.value.scrollTo({
        left: index * window.innerWidth,
        behavior: 'instant'
      })
    }
    setTimeout(() => {
      isScrolling = false
    }, 100)
  })
}

const handleNavigate = (index) => {
  goToSlide(index, index > currentIndex.value ? 'right' : 'left')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
    safeStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
    safeStorage.setItem('theme', 'light')
  }
}

const initTheme = () => {
  const saved = safeStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else if (saved === 'light') {
    isDark.value = false
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }
}

const hideCard = (cardId, cardName) => {
  hiddenCards.value.add(cardId)
  safeStorage.setItem('hiddenCards', JSON.stringify([...hiddenCards.value]))
  toastMessage.value = `已隐藏「${cardName}」`
  toastVisible.value = true
  badgePulse.value = true
  setTimeout(() => {
    toastVisible.value = false
    badgePulse.value = false
  }, 3000)
}

const showCard = (cardId) => {
  hiddenCards.value.delete(cardId)
  safeStorage.setItem('hiddenCards', JSON.stringify([...hiddenCards.value]))
}

const showAllCards = () => {
  hiddenCards.value.clear()
  safeStorage.setItem('hiddenCards', JSON.stringify([]))
  sidebarVisible.value = false
}

const getCardName = (cardId) => cardNames[cardId] || cardId

const openLightbox = (image, label) => {
  lightboxImage.value = image
  lightboxLabel.value = label
  lightboxVisible.value = true
}

const toggleMusic = () => {
  if (!bgMusic.value) return

  if (isMusicPlaying.value) {
    bgMusic.value.pause()
    isMusicPlaying.value = false
    showMusicInfo.value = false
  } else {
    bgMusic.value.play().then(() => {
      isMusicPlaying.value = true
      showMusicInfo.value = true
      setTimeout(() => {
        showMusicInfo.value = false
      }, 3000)
    }).catch(() => {})
  }
}

const playMusicFromPrompt = () => {
  showMusicPrompt.value = false
  safeStorage.setItem('seenMusicPrompt', 'true')
  toggleMusic()
}

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e) => {
  const touchEndX = e.changedTouches[0].screenX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex.value < 4) {
      goToSlide(currentIndex.value + 1, 'right')
    } else if (diff < 0 && currentIndex.value > 0) {
      goToSlide(currentIndex.value - 1, 'left')
    }
  }
}

const handleMouseDown = (e) => {
  if (!slidesContainer.value) return
  isDragging = true
  mouseStartX = e.pageX - slidesContainer.value.offsetLeft
  scrollStartLeft = slidesContainer.value.scrollLeft
  slidesContainer.value.style.cursor = 'grabbing'
}

const handleMouseMove = (e) => {
  if (!isDragging || !slidesContainer.value) return
  e.preventDefault()
  const x = e.pageX - slidesContainer.value.offsetLeft
  const walk = (x - mouseStartX) * 1.5
  slidesContainer.value.scrollLeft = scrollStartLeft - walk
}

const handleMouseUp = (e) => {
  if (!slidesContainer.value) return
  isDragging = false
  slidesContainer.value.style.cursor = 'grab'

  if (e.type === 'mouseup') {
    const endX = e.pageX - slidesContainer.value.offsetLeft
    const diff = mouseStartX - endX
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex.value < 4) {
        goToSlide(currentIndex.value + 1, 'right')
      } else if (diff < 0 && currentIndex.value > 0) {
        goToSlide(currentIndex.value - 1, 'left')
      }
    }
  }
}

const handleMouseLeave = () => {
  isDragging = false
  if (slidesContainer.value) {
    slidesContainer.value.style.cursor = 'grab'
  }
}

const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') {
    goToSlide(currentIndex.value - 1, 'left')
  } else if (e.key === 'ArrowRight') {
    goToSlide(currentIndex.value + 1, 'right')
  }
}

const dismissFirstVisitTip = () => {
  firstVisitTipVisible.value = false
  safeStorage.setItem('seenCardTip', 'true')
}

const initHiddenCards = () => {
  const saved = safeStorage.getItem('hiddenCards')
  if (saved) {
    try {
      hiddenCards.value = new Set(JSON.parse(saved))
    } catch (e) {}
  }
}

const initFirstVisitTip = () => {
  if (safeStorage.getItem('seenCardTip') !== 'true') {
    setTimeout(() => {
      firstVisitTipVisible.value = true
    }, 2000)
    setTimeout(() => {
      firstVisitTipVisible.value = false
      safeStorage.setItem('seenCardTip', 'true')
    }, 8000)
  }
}

const initMusicPrompt = () => {
  if (safeStorage.getItem('seenMusicPrompt') !== 'true') {
    setTimeout(() => {
      showMusicPrompt.value = true
    }, 3000)
  }
}

const handleScroll = () => {
  if (!slidesContainer.value || isScrolling) return
  const scrollLeft = slidesContainer.value.scrollLeft
  const newIndex = Math.round(scrollLeft / window.innerWidth)
  if (newIndex !== currentIndex.value && newIndex >= 0 && newIndex < 5) {
    currentSlideHeight.value = slideHeights.value[newIndex] || 0
    currentIndex.value = newIndex
  }
}

onMounted(() => {
  initTheme()
  initHiddenCards()
  initFirstVisitTip()
  initMusicPrompt()

  if (slidesContainer.value) {
    slidesContainer.value.style.cursor = 'grab'
    slidesContainer.value.addEventListener('touchend', handleTouchEnd)
    slidesContainer.value.addEventListener('mousemove', handleMouseMove)
    slidesContainer.value.addEventListener('mouseup', handleMouseUp)
    slidesContainer.value.addEventListener('mouseleave', handleMouseLeave)
    slidesContainer.value.addEventListener('scroll', handleScroll, { passive: true })
  }

  document.addEventListener('keydown', handleKeydown)

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)

  setTimeout(() => {
    preloadAllSlideHeights()
    startResizeObserver(currentIndex.value)
  }, 200)
})

onUnmounted(() => {
  if (slidesContainer.value) {
    slidesContainer.value.removeEventListener('touchend', handleTouchEnd)
    slidesContainer.value.removeEventListener('mousemove', handleMouseMove)
    slidesContainer.value.removeEventListener('mouseup', handleMouseUp)
    slidesContainer.value.removeEventListener('mouseleave', handleMouseLeave)
    slidesContainer.value.removeEventListener('scroll', handleScroll)
  }
  document.removeEventListener('keydown', handleKeydown)

  if (resizeObserverCleanup) {
    resizeObserverCleanup()
    resizeObserverCleanup = null
  }
})

watch(currentIndex, (newIndex) => {
  startResizeObserver(newIndex)
})

watch(windowWidth, () => {
  debouncedUpdateSlideHeight()
})

watch(lightboxVisible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
@import '@/styles/travel.css';

.travel-app {
  min-height: 100vh;
  max-width: 100vw;
  overflow-x: hidden;
}

.hero {
  min-height: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--space-xl) var(--space-md) var(--space-lg);
  position: relative;
  background: linear-gradient(180deg, var(--sky-light) 0%, var(--bg) 100%);
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 20%, var(--sunset-soft) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 30% 60%, var(--forest-light) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  animation: heroFadeIn 1.2s var(--ease-out-expo) forwards;
}

.hero h1 {
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: clamp(1.25rem, 5vw, 2rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 0.3rem;
  letter-spacing: 0.05em;
  animation: titleReveal 1s var(--ease-out-quart) 0.15s forwards;
  opacity: 0;
  transform: translateY(1.5rem);
}

.hero-subtitle {
  font-size: clamp(0.7rem, 2vw, 0.85rem);
  color: var(--text-muted);
  animation: subtitleReveal 0.8s var(--ease-out-quart) 0.35s forwards;
  opacity: 0;
  transform: translateY(1rem);
}

@keyframes heroFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes titleReveal {
  from { opacity: 0; transform: translateY(1.5rem); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes subtitleReveal {
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}

@media (min-width: 768px) {
  .hero {
    min-height: 28vh;
  }
  .hero h1 {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
  }
  .hero-subtitle {
    font-size: clamp(0.75rem, 2.5vw, 0.95rem);
  }
}

.nav-tabs {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  padding: var(--space-sm) var(--space-xs);
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-tabs::-webkit-scrollbar {
  display: none;
}

.nav-tabs-inner {
  display: flex;
  gap: 0.4rem;
  min-width: max-content;
  padding: 0 0.5rem;
  justify-content: flex-start;
}

@media (min-width: 768px) {
  .nav-tabs-inner {
    justify-content: center;
  }
}

.nav-tab {
  padding: 0.5rem 0.9rem;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 1.5rem;
  white-space: nowrap;
  transition: color var(--duration-normal) var(--ease-out-quart),
              background var(--duration-normal) var(--ease-out-quart);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.nav-tab:hover {
  background: var(--earth-light);
  color: var(--text);
}

.nav-tab:active {
  transform: scale(0.94);
}

.nav-tab.active {
  background: var(--forest);
  color: white;
}

.slides-container {
  display: flex;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  width: 100%;
  overscroll-behavior-x: contain;
  transition: height 0.25s ease-out;
}

.slides-container::-webkit-scrollbar {
  display: none;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  height: auto;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  transition: opacity 0.3s var(--ease-out-quart);
}

.slide.active {
  opacity: 1;
}

.slide:not(.active) .section {
  pointer-events: none;
}

.slide:not(.active) {
  opacity: 0.95;
}

.slide.slide-in-right .section-header {
  animation: slideInRight 0.4s var(--ease-out-quart) forwards;
}

.slide.slide-in-left .section-header {
  animation: slideInLeft 0.4s var(--ease-out-quart) forwards;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

.footer {
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  background: linear-gradient(180deg, var(--bg) 0%, var(--forest-light) 100%);
  font-family: 'ZCOOL XiaoWei', serif;
}

.footer-text {
  font-size: 0.9rem;
  color: var(--forest);
  letter-spacing: 0.1em;
}

.theme-toggle {
  position: fixed;
  top: var(--space-md);
  right: var(--space-md);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--card);
  border: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  transition: transform var(--duration-normal) var(--ease-out-quart),
              box-shadow var(--duration-normal) var(--ease-out-quart),
              background var(--duration-normal) var(--ease-out-quart);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.theme-toggle:hover {
  background: var(--forest-light);
  border-color: var(--forest);
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.theme-toggle:active {
  transform: scale(0.95);
  transition-duration: var(--duration-instant);
}

.theme-toggle svg {
  width: 18px;
  height: 18px;
  color: var(--text);
  transition: transform var(--duration-slow) var(--ease-out-quart),
              opacity var(--duration-normal) var(--ease-out-quart);
}

.theme-toggle .icon-sun {
  display: block;
  transform: rotate(0deg) scale(1);
}

.theme-toggle .icon-moon {
  position: absolute;
  display: block;
  transform: rotate(-90deg) scale(0.5);
  opacity: 0;
}

[data-theme="dark"] .theme-toggle .icon-sun {
  transform: rotate(90deg) scale(0.5);
  opacity: 0;
}

[data-theme="dark"] .theme-toggle .icon-moon {
  transform: rotate(0deg) scale(1);
  opacity: 1;
}

.music-player {
  position: fixed;
  bottom: 72px;
  right: var(--space-md);
  z-index: 85;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.music-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--sunset-soft);
  border: 2px solid var(--sunset);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.music-toggle:hover {
  background: var(--sunset);
}

.music-toggle:hover svg,
.music-toggle.playing svg {
  color: white;
}

.music-toggle.playing {
  background: var(--sunset);
  animation: musicPulse 2s ease-in-out infinite;
}

@keyframes musicPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(204, 85, 51, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(204, 85, 51, 0); }
}

.music-toggle svg {
  width: 20px;
  height: 20px;
  color: var(--sunset);
  transition: color 0.2s ease;
}

.music-info {
  background: var(--text);
  color: var(--card);
  padding: var(--space-2xs) var(--space-sm);
  border-radius: var(--space-sm);
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.music-player.show-info .music-info {
  opacity: 1;
  transform: translateX(0);
}

.music-prompt {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card);
  border: 2px solid var(--forest);
  padding: var(--space-lg);
  border-radius: var(--space-md);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  z-index: 200;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.music-prompt.show {
  opacity: 1;
  visibility: visible;
}

.music-prompt-icon {
  font-size: 2rem;
  margin-bottom: var(--space-xs);
}

.music-prompt-text {
  font-size: var(--text-sm);
  color: var(--text);
  margin-bottom: var(--space-sm);
}

.music-prompt-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.music-prompt-btn {
  background: var(--forest);
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s ease;
  margin-right: var(--space-xs);
}

.music-prompt-btn:hover {
  background: oklch(38% 0.12 145);
}

.music-prompt-close {
  background: transparent;
  color: var(--text-muted);
  border: none;
  padding: var(--space-xs);
  font-size: var(--text-xs);
  cursor: pointer;
  font-family: inherit;
}

.sidebar-toggle {
  position: fixed;
  bottom: 24px;
  right: var(--space-md);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--forest);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 90;
  transition: transform var(--duration-normal) var(--ease-out-quart),
              box-shadow var(--duration-normal) var(--ease-out-quart);
}

.sidebar-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.sidebar-toggle:active {
  transform: scale(0.95);
  transition-duration: var(--duration-instant);
}

.sidebar-toggle svg {
  width: 20px;
  height: 20px;
  transition: transform var(--duration-slow) var(--ease-out-quart);
}

.sidebar-toggle:hover svg {
  transform: rotate(90deg);
}

.sidebar-toggle .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  background: var(--sunset);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  transform: scale(0);
  transition: transform 0.25s var(--ease-out-quart);
}

.sidebar-toggle.has-hidden .badge {
  transform: scale(1);
}

.sidebar-toggle.pulse .badge {
  animation: badgePulse 0.3s var(--ease-out-quart);
}

@keyframes badgePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.sidebar-toggle-label {
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: var(--space-xs);
  background: var(--text);
  color: var(--card);
  font-size: 0.7rem;
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--space-xs);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.sidebar-toggle:hover .sidebar-toggle-label {
  opacity: 1;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0);
  visibility: hidden;
  transition: background 0.3s ease, visibility 0.3s ease;
  z-index: 95;
  backdrop-filter: blur(0);
}

.sidebar-overlay.active {
  background: rgba(0,0,0,0.4);
  visibility: visible;
  backdrop-filter: blur(4px);
}

.sidebar-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(300px, 85vw);
  background: var(--card);
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0,0,0,0);
}

.sidebar-panel.active {
  transform: translateX(0);
  box-shadow: -8px 0 32px rgba(0,0,0,0.15);
}

.sidebar-header {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--forest);
}

.sidebar-close {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--earth-light);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.sidebar-close:hover {
  background: var(--sunset-soft);
  transform: rotate(90deg);
}

.sidebar-close svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
}

.sidebar-empty {
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.sidebar-empty-icon {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
  opacity: 0.5;
}

.sidebar-empty-hint {
  font-size: 0.75rem;
  margin-top: var(--space-xs);
}

.sidebar-item {
  background: var(--earth-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  margin-bottom: var(--space-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-sm);
}

.sidebar-item-name {
  font-size: var(--text-sm);
  color: var(--text);
  flex: 1;
}

.sidebar-item-restore {
  background: var(--forest);
  color: white;
  border: none;
  padding: var(--space-xs) var(--space-md);
  min-height: 44px;
  min-width: 60px;
  border-radius: var(--space-xs);
  font-size: var(--text-xs);
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: background 0.2s ease, transform 0.2s ease;
}

.sidebar-item-restore:hover {
  transform: translateX(-2px);
}

.sidebar-footer {
  padding: var(--space-md);
  border-top: 1px solid var(--border);
}

.sidebar-reset-btn {
  width: 100%;
  padding: var(--space-sm);
  background: var(--earth-light);
  border: 1px solid var(--border);
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.sidebar-reset-btn:hover {
  background: var(--sunset-soft);
  color: var(--sunset);
  border-color: var(--sunset);
}

.nav-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 99;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nav-arrow:hover {
  background: var(--forest);
  color: white;
  border-color: var(--forest);
}

.nav-arrow svg {
  width: 1.2rem;
  height: 1.2rem;
}

.nav-arrow.prev {
  left: 1rem;
}

.nav-arrow.next {
  right: 1rem;
}

@media (min-width: 768px) {
  .nav-arrow {
    display: flex;
  }
}

.back-top {
  position: fixed;
  bottom: 1.5rem;
  right: var(--space-md);
  width: 2.75rem;
  height: 2.75rem;
  background: var(--forest);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transform: translateX(0.5rem);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 99;
}

.back-top.visible {
  opacity: 1;
  transform: translateX(0);
}

.back-top svg {
  width: 1.1rem;
  height: 1.1rem;
}

.slide-indicator {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 99;
  padding: 0.5rem;
}

.slide-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.slide-dot::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
}

.slide-dot:hover {
  background: var(--text-muted);
}

.slide-dot.active {
  background: var(--forest);
  width: 24px;
  border-radius: 4px;
}

@media (min-width: 768px) {
  .slide-indicator {
    display: none;
  }
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  visibility: hidden;
  transition: background 0.35s ease, visibility 0.35s ease;
}

.lightbox.active {
  background: rgba(0, 0, 0, 0.92);
  visibility: visible;
}

.lightbox-content {
  position: relative;
  max-width: 95vw;
  max-height: 90vh;
  opacity: 0;
  transform: scale(0.85) translateY(20px);
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1), transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.lightbox.active .lightbox-content {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.lightbox-img {
  max-width: 95vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--space-sm);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
  position: absolute;
  top: -44px;
  right: 0;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.lightbox-close svg {
  width: 18px;
  height: 18px;
  color: white;
}

.lightbox-label {
  position: absolute;
  bottom: -36px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  white-space: nowrap;
  font-family: 'ZCOOL XiaoWei', serif;
  letter-spacing: 0.05em;
}

.toast {
  position: fixed;
  bottom: 120px;
  right: var(--space-md);
  background: var(--text);
  color: var(--card);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  z-index: 200;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-action {
  color: var(--sky-light);
  margin-left: var(--space-xs);
  font-size: 0.75rem;
  cursor: pointer;
}

.first-visit-tip {
  position: fixed;
  bottom: 80px;
  right: var(--space-md);
  background: var(--text);
  color: var(--card);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--space-md);
  font-size: 0.75rem;
  z-index: 95;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
  white-space: nowrap;
}

.first-visit-tip.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.first-visit-tip::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 20px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--text);
}

.first-visit-close {
  background: transparent;
  border: none;
  color: var(--sunset-soft);
  margin-left: var(--space-xs);
  cursor: pointer;
  font-size: 0.7rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 480px) {
  .theme-toggle {
    width: 36px;
    height: 36px;
    top: var(--space-sm);
    right: var(--space-sm);
  }
  .theme-toggle svg {
    width: 16px;
    height: 16px;
  }
  .music-player {
    bottom: 72px;
    right: var(--space-sm);
  }
  .music-toggle {
    width: 36px;
    height: 36px;
  }
  .music-toggle svg {
    width: 16px;
    height: 16px;
  }
  .sidebar-toggle {
    width: 40px;
    height: 40px;
    bottom: 24px;
    right: var(--space-sm);
  }
  .sidebar-toggle svg {
    width: 18px;
    height: 18px;
  }
  .sidebar-toggle-label {
    display: none;
  }
  .first-visit-tip {
    bottom: 80px;
    right: var(--space-sm);
    white-space: normal;
    max-width: 200px;
  }
  .toast {
    right: var(--space-sm);
    left: var(--space-sm);
    text-align: center;
    bottom: 120px;
  }
  .back-top {
    width: 40px;
    height: 40px;
    right: var(--space-sm);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
