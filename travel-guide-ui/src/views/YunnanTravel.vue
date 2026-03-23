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
          @open-map="openMapSearch"
        />
      </div>
    </main>

    <footer class="footer">
      <p class="footer-text">愿你的云南之旅，一路花开</p>
    </footer>

    <button class="settings-toggle" :class="{ open: settingsVisible }" @click="settingsVisible = !settingsVisible" aria-label="设置">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    </button>

    <div class="settings-overlay" :class="{ active: settingsVisible }" @click="settingsVisible = false"></div>
    <div class="settings-panel" :class="{ active: settingsVisible }">
      <div class="settings-header">
        <span class="settings-title">设置</span>
        <button class="settings-close" @click="settingsVisible = false" aria-label="关闭">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="settings-section">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          显示主题
        </div>
        <div class="theme-options">
          <button :class="['theme-option', { active: themeMode === 'light' }]" @click="setTheme('light')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            亮色
          </button>
          <button :class="['theme-option', { active: themeMode === 'dark' }]" @click="setTheme('dark')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            暗色
          </button>
          <button :class="['theme-option', { active: themeMode === 'auto' }]" @click="setTheme('auto')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            自动
          </button>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
          </svg>
          字体设置
        </div>
        <div class="font-setting-group">
          <div class="font-setting-label">文字大小</div>
          <div class="font-options">
            <button :class="['font-option', { active: fontSize === 'small' }]" @click="setFontSize('small')">小</button>
            <button :class="['font-option', { active: fontSize === 'medium' }]" @click="setFontSize('medium')">中</button>
            <button :class="['font-option', { active: fontSize === 'large' }]" @click="setFontSize('large')">大</button>
          </div>
        </div>
        <div class="font-setting-group">
          <div class="font-setting-label">文字粗细</div>
          <div class="font-options">
            <button :class="['font-option', { active: fontWeight === 'normal' }]" @click="setFontWeight('normal')">正常</button>
            <button :class="['font-option', { active: fontWeight === 'bold' }]" @click="setFontWeight('bold')">加粗</button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
          隐藏内容管理
          <span v-if="hiddenCards.size > 0" class="hidden-count">{{ hiddenCards.size }}</span>
        </div>
        <button class="manage-hidden-btn" @click="hiddenModalVisible = true">
          <span>管理已隐藏的卡片</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div class="hidden-modal-overlay" :class="{ active: hiddenModalVisible }" @click.self="hiddenModalVisible = false">
        <div class="hidden-modal" :class="{ active: hiddenModalVisible }">
          <div class="hidden-modal-header">
            <span class="hidden-modal-title">已隐藏的内容</span>
            <button class="hidden-modal-close" @click="hiddenModalVisible = false" aria-label="关闭">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="hidden-modal-content">
            <div class="hidden-modal-empty" v-if="hiddenCards.size === 0">
              <div class="hidden-modal-empty-icon">📋</div>
              <p>没有隐藏的内容</p>
              <p class="hidden-modal-empty-hint">点击卡片右上角的 × 可以隐藏不需要的内容</p>
            </div>
            <div v-else class="hidden-modal-list">
              <div v-for="(cardId, index) in [...hiddenCards]" :key="cardId" class="hidden-modal-item" :style="{ '--item-index': index }">
                <span class="hidden-modal-item-name">{{ getCardName(cardId) }}</span>
                <button class="hidden-modal-item-restore" @click="showCard(cardId)">恢复</button>
              </div>
            </div>
          </div>
          <div class="hidden-modal-footer" v-if="hiddenCards.size > 0">
            <button class="hidden-modal-reset-btn" @click="showAllCards">恢复全部</button>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="music-player">
      <button class="music-toggle" :class="{ playing: isMusicPlaying }" @click="toggleMusicPanel" aria-label="音乐播放器">
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

      <div class="music-panel" :class="{ show: showMusicPanel }">
        <div class="music-panel-header">
          <span class="music-panel-title">背景音乐</span>
          <button class="music-panel-close" @click="showMusicPanel = false" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="music-now-playing">
          <div class="music-disc" :class="{ 'is-playing': isMusicPlaying }">
            <div class="music-disc-grooves"></div>
            <img
              v-if="currentSong?.cover"
              :src="`/images/music-covers/${currentSong.cover}`"
              :alt="currentSong.name"
              class="music-disc-cover"
              @click="openLightbox(`/images/music-covers/${currentSong.cover}`, currentSong.name)"
            >
            <img
              v-else
              src="/images/music-covers/spring-flowers-cover.jpg"
              alt="春花"
              class="music-disc-cover"
              @click="openLightbox('/images/music-covers/spring-flowers-cover.jpg', '春花')"
            >
          </div>
          <div class="music-info">
            <div class="music-song-name">{{ currentSong?.name || '未选择歌曲' }}</div>
            <div class="music-artist">{{ currentSong?.artist || '' }}</div>
          </div>
        </div>

        <div class="music-progress" v-if="duration > 0">
          <div
            class="music-progress-bar"
            ref="progressBar"
            tabindex="0"
            role="slider"
            :aria-label="'播放进度'"
            :aria-valuemin="0"
            :aria-valuemax="Math.round(duration)"
            :aria-valuenow="Math.round(currentTime)"
            :aria-valuetext="`${formatTime(currentTime)} / ${formatTime(duration)}`"
            @click="seekProgress"
            @keydown="handleProgressKeydown"
            @touchstart.passive="handleProgressTouchStart"
            @touchmove.prevent="handleProgressTouchMove"
            @touchend="handleProgressTouchEnd"
          >
            <div class="music-progress-fill" :style="{ width: musicProgress + '%' }"></div>
            <div class="music-progress-thumb" :style="{ left: musicProgress + '%' }"></div>
          </div>
          <div class="music-time">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <div class="music-controls">
          <button class="music-btn mode" @click="cyclePlayMode" :aria-label="'播放模式: ' + (playMode === 'list' ? '列表循环' : playMode === 'single' ? '单曲循环' : '随机播放')">
            <svg v-if="playMode === 'list'" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            </svg>
            <svg v-else-if="playMode === 'single'" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" fill="currentColor"/>
              <circle cx="12" cy="12" r="2.5" fill="var(--sunset)"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
          </button>
          <button class="music-btn prev" @click="prevSong" :disabled="playlist.length <= 1" aria-label="上一首">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>
          <button class="music-btn play" @click="togglePlay" aria-label="播放/暂停">
            <svg v-if="!isMusicPlaying" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
          <button class="music-btn next" @click="nextSong" :disabled="playlist.length <= 1" aria-label="下一首">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>
        </div>

        <div class="music-volume">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
          </svg>
          <input
            type="range"
            min="0"
            max="100"
            :value="volume"
            @input="setVolume"
            class="volume-slider"
            aria-label="音量控制"
          >
        </div>

        <div class="music-playlist">
          <div class="music-playlist-title">播放列表</div>
          <div class="music-playlist-items">
            <div
              v-for="(song, index) in playlist"
              :key="song.id"
              :class="['music-playlist-item', { active: index === currentSongIndex }]"
              :style="{ '--playlist-index': index }"
              @click="playSong(index)"
            >
              <span class="music-playlist-index">{{ index + 1 }}</span>
              <div class="music-playlist-info">
                <span class="music-playlist-name">{{ song.name }}</span>
                <span class="music-playlist-artist">{{ song.artist }}</span>
              </div>
              <svg v-if="index === currentSongIndex && isMusicPlaying" class="music-playing-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="nav-arrow prev" :style="{ opacity: currentIndex === 0 ? 0.3 : 1 }" @click="goToSlide(currentIndex - 1, 'left')" aria-label="上一页">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <button class="nav-arrow next" :style="{ opacity: currentIndex === 5 ? 0.3 : 1 }" @click="goToSlide(currentIndex + 1, 'right')" aria-label="下一页">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>

    <div class="slide-indicator" role="tablist" aria-label="页面导航">
      <span
        v-for="i in 6"
        :key="i"
        :class="['slide-dot', { active: i - 1 === currentIndex }]"
        role="tab"
        tabindex="0"
        :aria-label="['首页', '斗南', '大理', '丽江', '香格里拉', '地图'][i-1]"
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

    <div class="toast" :class="{ show: toastVisible }" role="status" aria-live="polite">
      <span>{{ toastMessage }}</span>
      <span class="toast-action restore" @click="restoreLastHidden">点击恢复</span>
    </div>

    <div class="first-visit-tip" :class="{ show: firstVisitTipVisible }">
      点击卡片右上角 × 可隐藏内容
      <button class="first-visit-close" @click="dismissFirstVisitTip">知道了</button>
    </div>

    <audio ref="bgMusic" preload="auto" @timeupdate="updateProgress" @loadedmetadata="onAudioLoaded" @ended="onSongEnded">
      <source v-if="currentSong" :src="`./music/${currentSong.file}`" type="audio/mpeg">
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
import MapSlide from '@/components/travel/slides/MapSlide.vue'
import { navTabs, dounanData, daliData, lijiangData, shangriData } from '@/data/travelData'

const mapSearchPlace = ref('')

const slides = [
  { component: HomeSlide, data: {} },
  { component: DounanSlide, data: dounanData },
  { component: DaliSlide, data: daliData },
  { component: LijiangSlide, data: lijiangData },
  { component: ShangriSlide, data: shangriData },
  { component: MapSlide, data: computed(() => ({ searchPlace: mapSearchPlace.value })) }
]

const appContainer = ref(null)
const slidesContainer = ref(null)
const navInner = ref(null)
const bgMusic = ref(null)
const slideRefs = ref([])

const currentIndex = ref(0)
const isDark = ref(false)
const themeMode = ref('auto')
const fontSize = ref('medium')
const fontWeight = ref('normal')
const hiddenCards = ref(new Set())
const settingsVisible = ref(false)
const hiddenModalVisible = ref(false)

const currentSlideHeight = ref(0)
const slideHeights = ref([0, 0, 0, 0, 0, 0])
const slideDirection = ref('right')
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
    overflowY: 'hidden',
    overflowX: 'auto'
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
const lastHiddenCard = ref(null)

const firstVisitTipVisible = ref(false)

const isMusicPlaying = ref(false)
const showMusicPanel = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(80)
const currentSongIndex = ref(0)
const playlist = ref([])
const isLoadingPlaylist = ref(true)
const playMode = ref('list')
const shuffleHistory = ref([])

const currentSong = computed(() => playlist.value[currentSongIndex.value] || null)

const musicProgress = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const loadPlaylist = async () => {
  try {
    const response = await fetch('./music/playlist.json')
    const data = await response.json()
    playlist.value = data.songs || []
  } catch (e) {
    console.error('加载播放列表失败:', e)
    playlist.value = []
  } finally {
    isLoadingPlaylist.value = false
  }
}

const toggleMusicPanel = () => {
  if (isMusicPlaying.value) {
    bgMusic.value?.pause()
    isMusicPlaying.value = false
  } else {
    showMusicPanel.value = !showMusicPanel.value
  }
}

const togglePlay = () => {
  if (!bgMusic.value || !currentSong.value) return

  if (isMusicPlaying.value) {
    bgMusic.value.pause()
    isMusicPlaying.value = false
  } else {
    bgMusic.value.play().then(() => {
      isMusicPlaying.value = true
    }).catch(() => {})
  }
}

const playSong = (index) => {
  if (index === currentSongIndex.value && isMusicPlaying.value) return

  currentSongIndex.value = index

  nextTick(() => {
    if (bgMusic.value) {
      bgMusic.value.load()
      bgMusic.value.play().then(() => {
        isMusicPlaying.value = true
      }).catch(() => {})
    }
  })
}

const prevSong = () => {
  if (playlist.value.length <= 1) return

  if (playMode.value === 'shuffle' && shuffleHistory.value.length > 0) {
    const prevIndex = shuffleHistory.value.pop()
    currentSongIndex.value = prevIndex
    playSong(currentSongIndex.value)
  } else {
    if (currentSongIndex.value > 0) {
      currentSongIndex.value--
    } else {
      currentSongIndex.value = playlist.value.length - 1
    }
    playSong(currentSongIndex.value)
  }
}

const nextSong = () => {
  if (playlist.value.length <= 1) return

  if (playMode.value === 'shuffle') {
    const nextIndex = getRandomIndex()
    shuffleHistory.value.push(currentSongIndex.value)
    currentSongIndex.value = nextIndex
    playSong(currentSongIndex.value)
  } else {
    if (currentSongIndex.value < playlist.value.length - 1) {
      currentSongIndex.value++
    } else {
      currentSongIndex.value = 0
    }
    playSong(currentSongIndex.value)
  }
}

const updateProgress = () => {
  if (bgMusic.value) {
    currentTime.value = bgMusic.value.currentTime
  }
}

const onAudioLoaded = () => {
  if (bgMusic.value) {
    duration.value = bgMusic.value.duration
    bgMusic.value.volume = volume.value / 100
  }
}

const onSongEnded = () => {
  if (playlist.value.length === 1) {
    bgMusic.value.currentTime = 0
    bgMusic.value.play().catch(() => {})
    return
  }

  if (playMode.value === 'single') {
    bgMusic.value.currentTime = 0
    bgMusic.value.play().catch(() => {})
  } else if (playMode.value === 'shuffle') {
    const nextIndex = getRandomIndex()
    shuffleHistory.value.push(currentSongIndex.value)
    currentSongIndex.value = nextIndex
    nextTick(() => {
      if (bgMusic.value) {
        bgMusic.value.load()
        bgMusic.value.play().then(() => {
          isMusicPlaying.value = true
        }).catch(() => {})
      }
    })
  } else {
    nextSong()
  }
}

const cyclePlayMode = () => {
  const modes = ['list', 'single', 'shuffle']
  const currentIndex = modes.indexOf(playMode.value)
  playMode.value = modes[(currentIndex + 1) % modes.length]
  if (playMode.value === 'shuffle') {
    shuffleHistory.value = []
  }
}

const getRandomIndex = () => {
  if (playlist.value.length <= 1) return 0
  let randomIndex
  const availableIndices = playlist.value
    .map((_, i) => i)
    .filter(i => i !== currentSongIndex.value && !shuffleHistory.value.includes(i))

  if (availableIndices.length === 0) {
    shuffleHistory.value = []
    randomIndex = Math.floor(Math.random() * playlist.value.length)
    if (randomIndex === currentSongIndex.value) {
      randomIndex = (randomIndex + 1) % playlist.value.length
    }
  } else {
    randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
  }
  return randomIndex
}

const setVolume = (e) => {
  volume.value = parseInt(e.target.value, 10)
  if (bgMusic.value) {
    bgMusic.value.volume = volume.value / 100
  }
}

const seekProgress = (e) => {
  if (!bgMusic.value || duration.value === 0) return
  const bar = e.currentTarget
  const rect = bar.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  bgMusic.value.currentTime = percent * duration.value
}

const progressBar = ref(null)
const isProgressDragging = ref(false)

const handleProgressTouchStart = (e) => {
  isProgressDragging.value = true
  seekFromTouch(e)
}

const handleProgressTouchMove = (e) => {
  if (!isProgressDragging.value) return
  seekFromTouch(e)
}

const handleProgressTouchEnd = () => {
  isProgressDragging.value = false
}

const seekFromTouch = (e) => {
  if (!bgMusic.value || duration.value === 0) return
  const bar = progressBar.value || e.currentTarget
  const rect = bar.getBoundingClientRect()
  const touch = e.touches[0] || e.changedTouches[0]
  const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width))
  bgMusic.value.currentTime = percent * duration.value
}

const handleProgressKeydown = (e) => {
  if (!bgMusic.value || duration.value === 0) return
  const step = 5
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    bgMusic.value.currentTime = Math.min(duration.value, bgMusic.value.currentTime + step)
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    bgMusic.value.currentTime = Math.max(0, bgMusic.value.currentTime - step)
  } else if (e.key === 'Home') {
    e.preventDefault()
    bgMusic.value.currentTime = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    bgMusic.value.currentTime = duration.value
  }
}

const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

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
  if (index < 0 || index >= 6) return
  if (index === currentIndex.value) return

  if (direction) {
    slideDirection.value = direction
  } else {
    slideDirection.value = index > currentIndex.value ? 'right' : 'left'
  }

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

const handleNavigate = (payload) => {
  const index = typeof payload === 'object' ? payload.index : payload
  const scrollTo = typeof payload === 'object' ? payload.scrollTo : null
  
  goToSlide(index, index > currentIndex.value ? 'right' : 'left')
  
  if (scrollTo) {
    setTimeout(() => {
      const element = document.querySelector(`[data-card-id="${scrollTo}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }
}

const openMapSearch = (placeName) => {
  mapSearchPlace.value = placeName
  goToSlide(5, 'right')
}

const setTheme = (mode) => {
  themeMode.value = mode
  safeStorage.setItem('themeMode', mode)

  if (mode === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else if (mode === 'light') {
    isDark.value = false
    document.documentElement.removeAttribute('data-theme')
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }
}

const initTheme = () => {
  const savedMode = safeStorage.getItem('themeMode') || 'auto'
  themeMode.value = savedMode

  if (savedMode === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else if (savedMode === 'light') {
    isDark.value = false
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (themeMode.value === 'auto') {
      isDark.value = e.matches
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    }
  })
}

const setFontSize = (size) => {
  fontSize.value = size
  safeStorage.setItem('fontSize', size)
  applyFontSize(size)
}

const setFontWeight = (weight) => {
  fontWeight.value = weight
  safeStorage.setItem('fontWeight', weight)
  applyFontWeight(weight)
}

const applyFontSize = (size) => {
  const scale = { small: '0.9', medium: '1', large: '1.15' }
  document.documentElement.style.setProperty('--text-scale', scale[size] || '1')
}

const applyFontWeight = (weight) => {
  const boost = { normal: '0', bold: '100' }
  document.documentElement.style.setProperty('--text-weight-boost', boost[weight] || '0')
}

const initFontSettings = () => {
  const savedSize = safeStorage.getItem('fontSize') || 'medium'
  const savedWeight = safeStorage.getItem('fontWeight') || 'normal'
  fontSize.value = savedSize
  fontWeight.value = savedWeight
  applyFontSize(savedSize)
  applyFontWeight(savedWeight)
}

const hideCard = (cardId, cardName) => {
  hiddenCards.value.add(cardId)
  safeStorage.setItem('hiddenCards', JSON.stringify([...hiddenCards.value]))
  lastHiddenCard.value = cardId
  toastMessage.value = `已隐藏「${cardName}」`
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

const restoreLastHidden = () => {
  if (lastHiddenCard.value && hiddenCards.value.has(lastHiddenCard.value)) {
    hiddenCards.value.delete(lastHiddenCard.value)
    safeStorage.setItem('hiddenCards', JSON.stringify([...hiddenCards.value]))
    toastVisible.value = false
    lastHiddenCard.value = null
  }
}

const showCard = (cardId) => {
  hiddenCards.value.delete(cardId)
  safeStorage.setItem('hiddenCards', JSON.stringify([...hiddenCards.value]))
  if (lastHiddenCard.value === cardId) {
    lastHiddenCard.value = null
  }
}

const showAllCards = () => {
  hiddenCards.value.clear()
  safeStorage.setItem('hiddenCards', JSON.stringify([]))
  hiddenModalVisible.value = false
}

const getCardName = (cardId) => cardNames[cardId] || cardId

const openLightbox = (image, label) => {
  lightboxImage.value = image
  lightboxLabel.value = label
  lightboxVisible.value = true
}

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e) => {
  const target = e.changedTouches[0].target
  const scrollableParent = target?.closest('.itinerary-flow, .music-playlist-items, [style*="overflow"]')
  if (scrollableParent) return

  const touchEndX = e.changedTouches[0].screenX
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex.value < 5) {
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

const handleScroll = () => {
  if (!slidesContainer.value || isScrolling) return
  const scrollLeft = slidesContainer.value.scrollLeft
  const newIndex = Math.round(scrollLeft / window.innerWidth)
  if (newIndex !== currentIndex.value && newIndex >= 0 && newIndex < 6) {
    currentSlideHeight.value = slideHeights.value[newIndex] || 0
    currentIndex.value = newIndex
  }
}

onMounted(() => {
  initTheme()
  initFontSettings()
  initHiddenCards()
  initFirstVisitTip()
  loadPlaylist()

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

  setTimeout(() => {
    refreshCurrentSlideHeight()
  }, 1000)
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
    document.addEventListener('keydown', handleLightboxKeydown)
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleLightboxKeydown)
  }
})

const handleLightboxKeydown = (e) => {
  if (e.key === 'Escape' && lightboxVisible.value) {
    lightboxVisible.value = false
  }
}
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
}

.hero h1 {
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: clamp(1.25rem, 5vw, 2rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 0.3rem;
  letter-spacing: 0.05em;
  animation: heroTitleIn 0.8s var(--ease-out-quart) 0.1s forwards;
  opacity: 0;
  transform: translateY(20px);
}

.hero-subtitle {
  font-size: clamp(0.7rem, 2vw, 0.85rem);
  color: var(--text-muted);
  animation: heroSubtitleIn 0.7s var(--ease-out-quart) 0.3s forwards;
  opacity: 0;
  transform: translateY(16px);
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--forest), var(--sunset));
  border-radius: 2px;
  animation: heroLineIn 0.6s var(--ease-out-quart) 0.5s forwards;
  opacity: 0;
  transform: translateX(-50%) scaleX(0);
}

@keyframes heroTitleIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes heroSubtitleIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes heroLineIn {
  from { opacity: 0; transform: translateX(-50%) scaleX(0); }
  to { opacity: 1; transform: translateX(-50%) scaleX(1); }
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
              background var(--duration-normal) var(--ease-out-quart),
              transform var(--duration-fast) var(--ease-out-quart),
              box-shadow var(--duration-normal) var(--ease-out-quart);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.nav-tab::before {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--forest);
  border-radius: 1px;
  transform: translateX(-50%);
  transition: width var(--duration-normal) var(--ease-out-quart);
}

.nav-tab:hover::before {
  width: 20px;
}

.nav-tab::after {
  content: '';
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out-quart);
  pointer-events: none;
}

.nav-tab:hover {
  background: var(--earth-light);
  color: var(--text);
}

.nav-tab:active {
  transform: scale(0.94);
}

.nav-tab:active::after {
  opacity: 0.15;
}

.nav-tab.active {
  background: var(--forest);
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  animation: tabActivate 0.35s var(--ease-out-quart);
}

.nav-tab.active::before {
  display: none;
}

@keyframes tabActivate {
  0% { transform: scale(0.92); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.slides-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  width: 100%;
  overscroll-behavior-x: contain;
  transition: height 0.35s var(--ease-out-quart);
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

.settings-toggle {
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
  outline: none;
  transition: transform var(--duration-normal) var(--ease-out-quart),
              box-shadow var(--duration-normal) var(--ease-out-quart);
}

.settings-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.settings-toggle:active {
  transform: scale(0.95);
  transition-duration: var(--duration-instant);
}

.settings-toggle svg {
  width: 20px;
  height: 20px;
  transition: transform var(--duration-normal) var(--ease-out-quart);
}

.settings-toggle.open svg {
  transform: rotate(45deg);
}

.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0);
  visibility: hidden;
  transition: background var(--duration-slow) var(--ease-out-quart),
              visibility var(--duration-slow) var(--ease-out-quart),
              backdrop-filter var(--duration-slow) var(--ease-out-quart);
  z-index: 95;
  backdrop-filter: blur(0);
}

.settings-overlay.active {
  background: rgba(0,0,0,0.4);
  visibility: visible;
  backdrop-filter: blur(8px);
}

.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(320px, 85vw);
  background: var(--card);
  transform: translateX(100%);
  transition: transform 0.4s var(--ease-out-quint);
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: -16px 0 48px rgba(0,0,0,0);
  overflow-y: auto;
}

.settings-panel.active {
  transform: translateX(0);
  box-shadow: -16px 0 48px rgba(0,0,0,0.12);
}

.settings-header {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: var(--card);
  z-index: 1;
}

.settings-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--forest);
}

.settings-close {
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

.settings-close:hover {
  background: var(--sunset-soft);
  transform: rotate(90deg);
}

.settings-close svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.settings-section {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-section-title {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-sm);
}

.settings-section-title svg {
  width: 16px;
  height: 16px;
  color: var(--forest);
}

.theme-options {
  display: flex;
  gap: var(--space-xs);
}

.theme-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xs);
  padding: var(--space-sm);
  background: var(--earth-light);
  border: 2px solid transparent;
  border-radius: var(--space-sm);
  cursor: pointer;
  transition: border-color var(--duration-normal) var(--ease-out-quart),
              background var(--duration-normal) var(--ease-out-quart),
              color var(--duration-normal) var(--ease-out-quart),
              transform var(--duration-fast) var(--ease-out-quart),
              box-shadow var(--duration-normal) var(--ease-out-quart);
  font-family: inherit;
  font-size: var(--text-xs);
  color: var(--text-muted);
  position: relative;
  overflow: hidden;
}

.theme-option svg {
  width: 20px;
  height: 20px;
  transition: transform var(--duration-normal) var(--ease-out-quart);
}

.theme-option:hover {
  border-color: var(--forest);
}

.theme-option:hover svg {
  transform: scale(1.1);
}

.theme-option:active {
  transform: scale(0.95);
}

.theme-option.active {
  background: var(--forest-light);
  border-color: var(--forest);
  color: var(--forest);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  animation: optionSelect 0.3s var(--ease-out-quart);
}

@keyframes optionSelect {
  0% { transform: scale(0.95); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.font-setting-group {
  margin-bottom: var(--space-sm);
}

.font-setting-group:last-child {
  margin-bottom: 0;
}

.font-setting-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.font-options {
  display: flex;
  gap: var(--space-xs);
}

.font-option {
  flex: 1;
  padding: var(--space-sm);
  background: var(--earth-light);
  border: 2px solid transparent;
  border-radius: var(--space-sm);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-muted);
  transition: border-color var(--duration-normal) var(--ease-out-quart),
              background var(--duration-normal) var(--ease-out-quart),
              color var(--duration-normal) var(--ease-out-quart),
              transform var(--duration-fast) var(--ease-out-quart),
              box-shadow var(--duration-normal) var(--ease-out-quart);
}

.font-option:hover {
  border-color: var(--forest);
}

.font-option:active {
  transform: scale(0.95);
}

.font-option.active {
  background: var(--forest-light);
  border-color: var(--forest);
  color: var(--forest);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  animation: optionSelect 0.3s var(--ease-out-quart);
}

.hidden-count {
  margin-left: auto;
  background: var(--sunset);
  color: white;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.manage-hidden-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background: var(--earth-light);
  border: none;
  border-radius: var(--space-sm);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text);
  transition: all 0.2s ease;
}

.manage-hidden-btn:hover {
  background: var(--forest-light);
}

.manage-hidden-btn svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

.hidden-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0);
  visibility: hidden;
  transition: background 0.3s ease, visibility 0.3s ease;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

.hidden-modal-overlay.active {
  background: rgba(0,0,0,0.5);
  visibility: visible;
}

.hidden-modal {
  width: 100%;
  max-width: 360px;
  max-height: 70vh;
  background: var(--card);
  border-radius: var(--space-lg);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  transform: scale(0.9) translateY(20px);
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}

.hidden-modal.active {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.hidden-modal-header {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hidden-modal-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--forest);
}

.hidden-modal-close {
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

.hidden-modal-close:hover {
  background: var(--sunset-soft);
  transform: rotate(90deg);
}

.hidden-modal-close svg {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

.hidden-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
}

.hidden-modal-empty {
  text-align: center;
  padding: var(--space-lg);
  color: var(--text-muted);
}

.hidden-modal-empty-icon {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
  opacity: 0.5;
}

.hidden-modal-empty-hint {
  font-size: 0.75rem;
  margin-top: var(--space-xs);
}

.hidden-modal-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.hidden-modal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-sm);
  animation: modalItemIn 0.3s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--item-index, 0) * 50ms);
  opacity: 0;
  transform: translateY(10px);
}

@keyframes modalItemIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hidden-modal-item-name {
  font-size: var(--text-sm);
  color: var(--text);
  flex: 1;
  margin-right: var(--space-sm);
}

.hidden-modal-item-restore {
  background: var(--forest);
  color: white;
  border: none;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--space-xs);
  font-size: var(--text-xs);
  cursor: pointer;
  font-family: inherit;
  transition: transform 0.15s ease;
}

.hidden-modal-item-restore:hover {
  transform: scale(1.05);
}

.hidden-modal-footer {
  padding: var(--space-md);
  border-top: 1px solid var(--border);
}

.hidden-modal-reset-btn {
  width: 100%;
  padding: var(--space-sm);
  background: var(--sunset);
  color: white;
  border: none;
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s ease;
}

.hidden-modal-reset-btn:hover {
  background: oklch(65% 0.18 35);
}

.music-player {
  position: fixed;
  bottom: 72px;
  right: var(--space-md);
  z-index: 85;
  pointer-events: none;
}

.music-player > * {
  pointer-events: auto;
}

.music-toggle {
  width: 44px;
  height: 44px;
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

.music-panel {
  position: absolute;
  bottom: 54px;
  right: 0;
  width: 260px;
  background: var(--card);
  border: 1.5px solid var(--forest);
  border-radius: 20px;
  box-shadow:
    0 4px 24px rgba(0,0,0,0.1),
    0 12px 40px rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255,255,255,0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px) scale(0.92);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.music-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);
  pointer-events: none;
}

.music-panel.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.music-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px 10px;
  background: transparent;
}

.music-panel-title {
  font-weight: 700;
  color: var(--forest);
  font-size: 13px;
  letter-spacing: 0.02em;
}

.music-panel-close {
  width: 26px;
  height: 26px;
  border: none;
  background: var(--earth-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.music-panel-close:hover {
  background: var(--sunset-soft);
  transform: rotate(90deg);
}

.music-panel-close svg {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

.music-now-playing {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 18px 14px;
}

.music-disc {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow:
    0 2px 8px rgba(0,0,0,0.3),
    inset 0 0 0 2px rgba(255,255,255,0.05);
  position: relative;
  transition: transform 0.3s var(--ease-out-quart);
}

.music-disc.is-playing {
  animation: discSpin 8s linear infinite;
}

@keyframes discSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.music-disc-grooves {
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background: repeating-radial-gradient(
    circle at center,
    transparent 0px,
    transparent 1px,
    rgba(255,255,255,0.03) 1px,
    rgba(255,255,255,0.03) 2px
  );
  pointer-events: none;
}

.music-disc-cover {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.2s var(--ease-out-quart);
}

.music-disc-cover:hover {
  transform: scale(1.08);
}

.music-info {
  flex: 1;
  min-width: 0;
}

.music-song-name {
  font-weight: 600;
  color: var(--text);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-artist {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 3px;
}

.music-progress {
  padding: 0 18px;
}

.music-progress-bar {
  height: 5px;
  background: var(--earth-light);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  touch-action: none;
}

.music-progress-bar::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 0;
  right: 0;
  bottom: -12px;
}

.music-progress-bar:focus-visible {
  outline: 2px solid var(--forest);
  outline-offset: 4px;
}

.music-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--forest), var(--sunset));
  border-radius: 3px;
  transition: width 0.1s linear;
}

.music-progress-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: var(--forest);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.music-progress-bar:active .music-progress-thumb {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.2);
}

.music-time {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 6px;
  font-variant-numeric: tabular-nums;
}

.music-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
}

.music-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 12px;
  background: var(--earth-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.music-btn:hover {
  background: var(--forest-light);
  transform: translateY(-2px);
}

.music-btn:active {
  transform: scale(0.92);
}

.music-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.music-btn.play {
  width: 50px;
  height: 50px;
  background: linear-gradient(145deg, var(--forest), oklch(32% 0.12 145));
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.music-btn.play svg {
  color: white;
}

.music-btn.play:hover {
  background: linear-gradient(145deg, var(--sunset), oklch(45% 0.15 25));
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.music-btn svg {
  width: 16px;
  height: 16px;
  color: var(--text);
}

.music-btn.mode.active {
  background: var(--forest-light);
}

.music-btn.mode svg {
  color: var(--forest);
}

.music-volume {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px 12px;
}

.music-volume svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.volume-slider {
  flex: 1;
  height: 5px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--earth-light);
  border-radius: 3px;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 6px;
  background: var(--forest);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: transform 0.15s ease;
}

.volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.volume-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 6px;
  background: var(--forest);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.music-playlist {
  border-top: 1px solid var(--border);
  max-height: 160px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.music-playlist::-webkit-scrollbar {
  width: 4px;
}

.music-playlist::-webkit-scrollbar-thumb {
  background: var(--forest-light);
  border-radius: 2px;
}

.music-playlist-title {
  padding: 8px 18px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--card);
  position: sticky;
  top: 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.music-playlist-items {
  padding: 4px 8px;
}

.music-playlist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 2px 0;
}

.music-playlist-item:hover {
  background: var(--earth-light);
}

.music-playlist-item.active {
  background: var(--forest-light);
}

.music-playlist-index {
  width: 18px;
  font-size: 11px;
  color: var(--text-muted);
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.music-playlist-item.active .music-playlist-index {
  color: var(--forest);
  font-weight: 600;
}

.music-playlist-info {
  flex: 1;
  min-width: 0;
}

.music-playlist-name {
  font-size: 12px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-playlist-item.active .music-playlist-name {
  font-weight: 600;
  color: var(--forest);
}

.music-playlist-artist {
  font-size: 10px;
  color: var(--text-muted);
}

.music-playing-icon {
  width: 12px;
  height: 12px;
  color: var(--forest);
  animation: pulse 1s ease-in-out infinite;
}

.music-playlist-item {
  animation: playlistItemIn 0.3s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--playlist-index, 0) * 40ms);
  opacity: 0;
  transform: translateX(-8px);
}

@keyframes playlistItemIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.music-playlist-item.active {
  position: relative;
}

.music-playlist-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--forest);
  border-radius: 0 2px 2px 0;
  animation: activeIndicator 0.25s var(--ease-out-quart);
}

@keyframes activeIndicator {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
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
  transition: all 0.25s var(--ease-out-quart);
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
  transform: scale(1.25);
}

.slide-dot.active {
  background: var(--forest);
  width: 24px;
  border-radius: 4px;
  animation: dotActivate 0.4s var(--ease-out-quart);
}

@keyframes dotActivate {
  0% { transform: scale(0.8); }
  40% { transform: scale(1.15); }
  100% { transform: scale(1); }
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
  transform: translateY(16px) scale(0.9);
  transition: opacity 0.3s var(--ease-out-quart),
              transform 0.4s cubic-bezier(0.34, 1.26, 0.64, 1);
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.toast.show {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.toast-action {
  color: var(--sky-light);
  margin-left: var(--space-xs);
  font-size: 0.75rem;
  cursor: pointer;
  pointer-events: auto;
}

.toast-action.restore {
  color: var(--sunset);
  text-decoration: underline;
  text-underline-offset: 2px;
  font-weight: 500;
  transition: opacity 0.15s ease;
}

.toast-action.restore:hover {
  opacity: 0.8;
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
  transform: translateY(12px) scale(0.95);
  transition: opacity 0.35s var(--ease-out-quart),
              transform 0.4s cubic-bezier(0.34, 1.26, 0.64, 1);
  pointer-events: none;
  white-space: nowrap;
}

.first-visit-tip.show {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
  animation: tipBounce 0.6s cubic-bezier(0.34, 1.26, 0.64, 1);
}

@keyframes tipBounce {
  0% { transform: translateY(12px) scale(0.95); }
  50% { transform: translateY(-4px) scale(1.02); }
  100% { transform: translateY(0) scale(1); }
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
  .music-player {
    bottom: 72px;
    right: var(--space-sm);
  }
  .music-toggle {
    width: 44px;
    height: 44px;
  }
  .music-toggle svg {
    width: 18px;
    height: 18px;
  }
  .settings-toggle {
    width: 44px;
    height: 44px;
    bottom: 24px;
    right: var(--space-sm);
  }
  .settings-toggle svg {
    width: 20px;
    height: 20px;
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
