<template>
  <div class="travel-app" ref="appContainer">
    <a href="#main-content" class="skip-link">跳转到主要内容</a>

    <header class="hero">
      <div class="hero-content">
        <h1>云南旅行攻略</h1>
        <p class="hero-subtitle">斗南花市 · 大理洱海</p>
      </div>
      <div class="hero-actions">
        <button class="hero-search-btn" @click="showSearchPanel = true" aria-label="搜索">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
        <button class="hero-menu-btn" @click="showJumpPanel = true" aria-label="导航菜单">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 全局导航面板 -->
    <Teleport to="body">
      <Transition name="jump-panel">
        <div v-if="showJumpPanel" class="jump-panel-overlay" @click.self="showJumpPanel = false">
          <div class="jump-panel">
            <div class="jump-panel-header">
              <span class="jump-panel-title">全部地点</span>
              <button class="jump-panel-close" @click="showJumpPanel = false" aria-label="关闭">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="jump-panel-body">
              <button class="jump-section-btn" :class="{ active: currentIndex === 0 }" @click="handleGlobalJump(0)">
                <span class="jump-section-icon">🏠</span>
                <span class="jump-section-name">首页</span>
                <svg class="jump-section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <button class="jump-section-btn" :class="{ active: currentIndex === 1 }" @click="handleGlobalJump(1)">
                <span class="jump-section-icon">🌸</span>
                <span class="jump-section-name">斗南花市</span>
                <span class="jump-section-tag">半天</span>
                <svg class="jump-section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <button class="jump-section-btn" :class="{ active: currentIndex === 2 }" @click="handleGlobalJump(2)">
                <span class="jump-section-icon">🌊</span>
                <span class="jump-section-name">大理洱海</span>
                <span class="jump-section-tag">2天</span>
                <svg class="jump-section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <button class="jump-section-btn" :class="{ active: currentIndex === 3 }" @click="handleGlobalJump(3)">
                <span class="jump-section-icon">🏔️</span>
                <span class="jump-section-name">丽江古城</span>
                <span class="jump-section-tag">2天</span>
                <svg class="jump-section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <button class="jump-section-btn" :class="{ active: currentIndex === 4 }" @click="handleGlobalJump(4)">
                <span class="jump-section-icon">❄️</span>
                <span class="jump-section-name">香格里拉</span>
                <span class="jump-section-tag">2天</span>
                <svg class="jump-section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <button class="jump-section-btn" :class="{ active: currentIndex === 5 }" @click="handleGlobalJump(5)">
                <span class="jump-section-icon">🗺️</span>
                <span class="jump-section-name">地图导航</span>
                <svg class="jump-section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
          @module-toggle="onModuleToggle"
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

      <div class="settings-section" data-onboarding="theme">
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
          <button :class="['theme-option', { active: themeMode === 'eye-care' }]" @click="setTheme('eye-care')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            护眼
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

      <div class="settings-section" data-onboarding="font">
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

      <div class="settings-section" data-onboarding="hidden-content">
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

      <div class="settings-section" data-onboarding="hidden-tabs" v-if="hiddenTabList.length > 0">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10H3M21 6H3M21 14H3M21 18H3"/>
          </svg>
          隐藏地点管理
          <span class="hidden-count">{{ hiddenTabList.length }}</span>
        </div>
        <div class="hidden-tabs-list">
          <div v-for="tab in hiddenTabList" :key="tab.id" class="hidden-tab-item">
            <span>{{ tab.label }}</span>
            <button class="restore-tab-btn" @click="handleRestoreTab(tab.id)">恢复</button>
          </div>
        </div>
      </div>

      <div class="settings-section" data-onboarding="add-hide-location">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          添加地点隐藏
        </div>
        <button class="add-hide-location-btn" @click="showAddHideLocation = !showAddHideLocation">
          <span>{{ showAddHideLocation ? '收起' : '展开' }}</span>
          <svg :class="{ rotated: showAddHideLocation }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        <Transition name="slide-down">
          <div v-if="showAddHideLocation" class="add-hide-location-panel">
            <div class="add-hide-location-tip">点击可隐藏对应地点的Tab</div>
            <div class="add-hide-location-list">
              <div
                v-for="tab in visibleDestinationTabs"
                :key="tab.id"
                class="add-hide-location-item"
                @click="handleHideTab(tab.id)"
              >
                <span class="add-hide-location-name">{{ tab.label }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="add-hide-location-icon">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </div>
              <div v-if="visibleDestinationTabs.length === 0" class="add-hide-location-empty">
                所有地点已隐藏
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="settings-section music-section" data-onboarding="music">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
          背景音乐
        </div>

        <div class="music-toggle-wrapper">
          <button
            class="music-toggle-in-settings"
            :class="{ playing: isMusicPlaying, expanded: showMusicPlaylist }"
            @click="showMusicPlaylist = !showMusicPlaylist"
          >
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
          <span class="music-toggle-label">{{ isMusicPlaying ? '播放中' : '已暂停' }}</span>
        </div>

        <Transition name="music-drawer">
          <div v-if="showMusicPlaylist" class="music-drawer-panel">
            <div class="music-drawer-content">
              <div class="music-current-song" v-if="currentSong">
                <div class="music-disc-small" :class="{ 'is-playing': isMusicPlaying }" @click="currentSong?.cover && openLightbox(`/images/music-covers/${currentSong.cover}`, currentSong.name)">
                  <img
                    v-if="currentSong?.cover"
                    :src="`/images/music-covers/${currentSong.cover}`"
                    :alt="currentSong.name"
                    class="music-cover-small"
                  >
                  <img
                    v-else
                    src="/images/music-covers/spring-flowers-cover.jpg"
                    alt="春花"
                    class="music-cover-small"
                  >
                </div>
                <div class="music-current-info">
                  <div class="music-current-name">{{ currentSong.name }}</div>
                  <div class="music-current-artist">{{ currentSong.artist }}</div>
                </div>
              </div>

              <div class="music-drawer-progress" @click="seekProgress">
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" :style="{ width: musicProgress + '%' }"></div>
                </div>
                <div class="progress-time">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span>{{ formatTime(duration) }}</span>
                </div>
              </div>

              <div class="music-drawer-controls">
                <button class="drawer-btn prev" @click="prevSong" :disabled="playlist.length <= 1">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                <button class="drawer-btn play" @click="togglePlay">
                  <svg v-if="!isMusicPlaying" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                </button>
                <button class="drawer-btn next" @click="nextSong" :disabled="playlist.length <= 1">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
                <button class="drawer-btn mode" @click="cyclePlayMode">
                  <svg v-if="playMode === 'list'" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
                  <svg v-else-if="playMode === 'single'" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/><circle cx="12" cy="12" r="2.5" fill="var(--sunset)"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
                </button>
              </div>

              <div class="music-drawer-volume">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                </svg>
                <input type="range" min="0" max="100" :value="volume" @input="setVolume" class="volume-slider">
              </div>

              <div class="music-drawer-playlist">
                <div class="drawer-playlist-title">播放列表</div>
                <div class="drawer-playlist-items">
                  <div
                    v-for="(song, index) in playlist"
                    :key="song.id"
                    :class="['drawer-playlist-item', { active: index === currentSongIndex }]"
                    @click="playSong(index)"
                  >
                    <span class="drawer-item-index">{{ index + 1 }}</span>
                    <div class="drawer-item-info">
                      <span class="drawer-item-name">{{ song.name }}</span>
                      <span class="drawer-item-artist">{{ song.artist }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <div class="settings-section">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
          </svg>
          新手引导
        </div>
        <button class="restart-onboarding-btn" @click="handleRestartOnboarding">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
          </svg>
          重新体验新手引导
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

    <button class="nav-arrow prev" :style="{ opacity: isFirstVisibleSlide ? 0.3 : 1 }" @click="goToSlide(getPrevVisibleSlideIndex(), 'left')" aria-label="上一页">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <button class="nav-arrow next" :style="{ opacity: isLastVisibleSlide ? 0.3 : 1 }" @click="goToSlide(getNextVisibleSlideIndex(), 'right')" aria-label="下一页">
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

    <audio ref="bgMusic" preload="auto" @timeupdate="updateProgress" @loadedmetadata="onAudioLoaded" @ended="onSongEnded">
      <source v-if="currentSong" :src="`./music/${currentSong.file}`" type="audio/mpeg">
    </audio>

    <div id="a11yAnnouncer" class="sr-only" aria-live="polite" aria-atomic="true"></div>

    <OnboardingOverlay
      :is-active="onboardingActive"
      :current-step="currentStep"
      :total-steps="totalSteps"
      :selected-tabs="selectedTabs"
      :all-tabs="allTabs"
      :settings-visible="settingsVisible"
      @next="onboardingNext"
      @prev="onboardingPrev"
      @skip="skipOnboarding"
      @complete="handleOnboardingComplete"
      @toggle-tab="toggleTab"
      @select-all="selectAllTabs"
      @clear-all="clearAllTabs"
      @open-settings="handleOpenSettings"
      @close-settings="handleCloseSettings"
      @go-to-map="handleGoToMap"
      @go-to-home="handleGoToHome"
      @set-theme="handleOnboardingSetTheme"
      @set-font-size="handleOnboardingSetFontSize"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed, provide } from 'vue'
import { useResizeObserver, useWindowSize } from '@vueuse/core'
import HomeSlide from '@/components/travel/slides/HomeSlide.vue'
import DounanSlide from '@/components/travel/slides/DounanSlide.vue'
import DaliSlide from '@/components/travel/slides/DaliSlide.vue'
import LijiangSlide from '@/components/travel/slides/LijiangSlide.vue'
import ShangriSlide from '@/components/travel/slides/ShangriSlide.vue'
import MapSlide from '@/components/travel/slides/MapSlide.vue'
import OnboardingOverlay from '@/components/onboarding/OnboardingOverlay.vue'
import { navTabs, dounanData, daliData, lijiangData, shangriData } from '@/data/travelData'
import { useOnboarding } from '@/composables/useOnboarding'

const {
  completed: onboardingCompleted,
  mapCompleted,
  currentStep,
  mapCurrentStep,
  isActive: onboardingActive,
  isMapActive,
  selectedTabs,
  hiddenTabs,
  totalSteps,
  mapTotalSteps,
  allTabs,
  hiddenTabList,
  initOnboarding,
  startOnboarding,
  startMapOnboarding,
  skipOnboarding,
  skipMapOnboarding,
  completeOnboarding,
  completeMapOnboarding,
  resetOnboarding,
  nextStep: onboardingNext,
  nextMapStep,
  prevStep: onboardingPrev,
  prevMapStep,
  toggleTab,
  selectAllTabs,
  clearAllTabs,
  restoreTab,
  hideTab
} = useOnboarding()

provide('onboarding', {
  isActive: onboardingActive,
  isMapActive,
  currentStep,
  mapCurrentStep,
  selectedTabs,
  hiddenTabs
})

provide('mapOnboarding', {
  isMapActive,
  mapCurrentStep,
  mapTotalSteps,
  startMapOnboarding,
  skipMapOnboarding,
  completeMapOnboarding,
  nextMapStep,
  prevMapStep
})

provide('tabManagement', {
  selectedTabs,
  hiddenTabs,
  toggleTab,
  restoreTab,
  hideTab
})

const mapSearchPlace = ref('')

const slides = [
  { component: HomeSlide, data: {} },
  { component: DounanSlide, data: dounanData },
  { component: DaliSlide, data: daliData },
  { component: LijiangSlide, data: lijiangData },
  { component: ShangriSlide, data: shangriData },
  { component: MapSlide, data: computed(() => ({ searchPlace: mapSearchPlace.value })) }
]

const visibleNavTabs = computed(() => {
  const fixedTabs = ['home', 'map']
  return navTabs.filter(tab => {
    if (fixedTabs.includes(tab.id)) return true
    if (tab.id === 'dounan') return selectedTabs.value.has('dounan')
    if (tab.id === 'dali') return selectedTabs.value.has('dali')
    if (tab.id === 'lijiang') return selectedTabs.value.has('lijiang')
    if (tab.id === 'shangri') return selectedTabs.value.has('shangri')
    return true
  })
})

const tabToSlideIndex = (tabId) => {
  const indexMap = {
    home: 0,
    dounan: 1,
    dali: 2,
    lijiang: 3,
    shangri: 4,
    map: 5
  }
  return indexMap[tabId] ?? 0
}

const getVisibleSlideIndexes = () => {
  return visibleNavTabs.value.map(tab => tabToSlideIndex(tab.id))
}

const getNextVisibleSlideIndex = () => {
  const visibleIndexes = getVisibleSlideIndexes()
  const currentPos = visibleIndexes.indexOf(currentIndex.value)
  if (currentPos < visibleIndexes.length - 1) {
    return visibleIndexes[currentPos + 1]
  }
  return currentIndex.value
}

const getPrevVisibleSlideIndex = () => {
  const visibleIndexes = getVisibleSlideIndexes()
  const currentPos = visibleIndexes.indexOf(currentIndex.value)
  if (currentPos > 0) {
    return visibleIndexes[currentPos - 1]
  }
  return currentIndex.value
}

const isFirstVisibleSlide = computed(() => {
  const visibleIndexes = getVisibleSlideIndexes()
  return currentIndex.value === visibleIndexes[0]
})

const isLastVisibleSlide = computed(() => {
  const visibleIndexes = getVisibleSlideIndexes()
  return currentIndex.value === visibleIndexes[visibleIndexes.length - 1]
})

const handleGlobalJump = (slideIndex) => {
  showJumpPanel.value = false
  const direction = slideIndex > currentIndex.value ? 'right' : 'left'
  goToSlide(slideIndex, direction)
}

const appContainer = ref(null)
const slidesContainer = ref(null)
const bgMusic = ref(null)
const slideRefs = ref([])

const currentIndex = ref(0)
const isDark = ref(false)
const showJumpPanel = ref(false)
const showSearchPanel = ref(false)
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
let sectionObserverCleanup = null

const setSlideRef = (el, index) => {
  if (el) {
    slideRefs.value[index] = el
  }
}

const containerStyle = computed(() => {
  const height = currentSlideHeight.value
  return {
    height: height > 0 ? `${height}px` : 'auto',
    overflowY: 'hidden',
    overflowX: 'auto'
  }
})

let heightUpdateTimer = null

const calculateSlideFullHeight = (slide, slideIndex = -1) => {
  if (!slide) return 0

  const section = slide.querySelector('.section')
  if (!section) return slide.scrollHeight

  return section.offsetHeight
}

const updateSlideHeight = (immediate = false) => {
  if (heightUpdateTimer) {
    clearTimeout(heightUpdateTimer)
    heightUpdateTimer = null
  }

  const doUpdate = () => {
    const currentSlide = slideRefs.value[currentIndex.value]
    if (!currentSlide) return

    currentSlide.classList.add('measuring')
    const newHeight = calculateSlideFullHeight(currentSlide, currentIndex.value)
    currentSlide.classList.remove('measuring')

    if (newHeight > 0) {
      slideHeights.value[currentIndex.value] = newHeight
      currentSlideHeight.value = newHeight
    }
  }

  if (immediate) {
    doUpdate()
  } else {
    heightUpdateTimer = setTimeout(doUpdate, 150)
  }
}

const onModuleToggle = () => {
  if (heightUpdateTimer) {
    clearTimeout(heightUpdateTimer)
    heightUpdateTimer = null
  }

  const updateWithRetry = (retriesLeft = 5, delay = 100) => {
    if (retriesLeft <= 0) return

    heightUpdateTimer = setTimeout(() => {
      const currentSlide = slideRefs.value[currentIndex.value]
      if (!currentSlide) return

      const prevHeight = currentSlideHeight.value
      updateSlideHeight(true)

      const modules = currentSlide.querySelectorAll('.guide-module.expanded')
      let stillAnimating = false

      modules.forEach(module => {
        const content = module.querySelector('.guide-module-content')
        if (content) {
          const style = getComputedStyle(content)
          const rows = style.gridTemplateRows
          if (rows && rows !== '0fr' && rows !== 'none') {
            const inner = content.querySelector('.guide-module-content-inner')
            if (inner && content.scrollHeight > inner.scrollHeight * 0.1) {
              stillAnimating = true
            }
          }
        }
      })

      if (stillAnimating || currentSlideHeight.value !== prevHeight) {
        updateWithRetry(retriesLeft - 1, 150)
      }
    }, delay)
  }

  updateWithRetry()
}

const preloadAllSlideHeights = () => {
  const calculateAndSet = () => {
    slideRefs.value.forEach((slide, index) => {
      if (slide) {
        slide.classList.add('measuring')

        requestAnimationFrame(() => {
          const height = calculateSlideFullHeight(slide, index)
          slide.classList.remove('measuring')

          if (height > 0) {
            const cachedHeight = slideHeights.value[index]
            if (!cachedHeight || height > cachedHeight) {
              slideHeights.value[index] = height
            }
          }
        })
      }
    })

    setTimeout(() => {
      const currentHeight = slideHeights.value[currentIndex.value] || 0
      if (currentHeight > 0) {
        currentSlideHeight.value = currentHeight
      }
    }, 100)
  }

  calculateAndSet()
}

const startResizeObserver = (index) => {
  if (resizeObserverCleanup) {
    resizeObserverCleanup()
    resizeObserverCleanup = null
  }

  if (sectionObserverCleanup) {
    sectionObserverCleanup()
    sectionObserverCleanup = null
  }

  const slide = slideRefs.value[index]
  if (!slide) return

  let resizeDebounceTimer = null

  const { stop } = useResizeObserver(
    slide,
    () => {
      if (index !== currentIndex.value) return

      if (resizeDebounceTimer) {
        clearTimeout(resizeDebounceTimer)
      }

      resizeDebounceTimer = setTimeout(() => {
        if (index === currentIndex.value) {
          updateSlideHeight(true)
        }
      }, 100)
    },
    { box: 'border-box' }
  )

  resizeObserverCleanup = () => {
    if (resizeDebounceTimer) {
      clearTimeout(resizeDebounceTimer)
    }
    stop()
  }
}

const lightboxVisible = ref(false)
const lightboxImage = ref('')
const lightboxLabel = ref('')

const toastVisible = ref(false)
const toastMessage = ref('')
const lastHiddenCard = ref(null)

const showAddHideLocation = ref(false)

const visibleDestinationTabs = computed(() => {
  return allTabs.filter(tab => selectedTabs.value.has(tab.id))
})

const isMusicPlaying = ref(false)
const showMusicPlaylist = ref(false)
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

const formatTime = (time) => {
  if (!time || isNaN(time)) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const seekProgress = (e) => {
  if (!bgMusic.value || duration.value === 0) return
  const bar = e.currentTarget
  const rect = bar.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  bgMusic.value.currentTime = percent * duration.value
}

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

let touchStartX = 0
let mouseStartX = 0
let isDragging = false
let scrollStartLeft = 0

const cardNames = {
  'home-itinerary': '推荐行程',
  'home-travel-tips': '出行防护',
  'home-transport': '省内高铁交通',
  'home-checklist': '出行必备',
  'home-departure-checklist': '出发前检查',
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

  isScrolling = true

  const targetSlide = slideRefs.value[index]
  const cachedHeight = slideHeights.value[index]

  if (cachedHeight > 0) {
    currentSlideHeight.value = cachedHeight
  }

  currentIndex.value = index

  if (slidesContainer.value) {
    slidesContainer.value.scrollTo({
      left: index * window.innerWidth,
      behavior: 'instant'
    })
  }

  startResizeObserver(index)

  if (targetSlide) {
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          targetSlide.classList.add('measuring')

          requestAnimationFrame(() => {
            const targetHeight = calculateSlideFullHeight(targetSlide, index)
            targetSlide.classList.remove('measuring')

            if (targetHeight > 0) {
              if (cachedHeight > 0 && targetHeight < cachedHeight) {
                currentSlideHeight.value = cachedHeight
              } else {
                slideHeights.value[index] = targetHeight
                currentSlideHeight.value = targetHeight
              }
            }
          })
        })
      })
    })
  }

  setTimeout(() => {
    updateSlideHeight(true)
    isScrolling = false
  }, 200)
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

  document.documentElement.removeAttribute('data-theme')
  document.documentElement.classList.remove('eye-care-theme')

  if (mode === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else if (mode === 'eye-care') {
    isDark.value = false
    document.documentElement.classList.add('eye-care-theme')
  } else if (mode === 'light') {
    isDark.value = false
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }
}

const initTheme = () => {
  const savedMode = safeStorage.getItem('themeMode') || 'light'
  themeMode.value = savedMode

  document.documentElement.removeAttribute('data-theme')
  document.documentElement.classList.remove('eye-care-theme')

  if (savedMode === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else if (savedMode === 'eye-care') {
    isDark.value = false
    document.documentElement.classList.add('eye-care-theme')
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

const scheduleHeightUpdate = () => {
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onModuleToggle()
      })
    })
  })
}

const hideCard = (cardId, cardName) => {
  const newSet = new Set(hiddenCards.value)
  newSet.add(cardId)
  hiddenCards.value = newSet
  safeStorage.setItem('hiddenCards', JSON.stringify([...hiddenCards.value]))
  lastHiddenCard.value = cardId
  toastMessage.value = `已隐藏「${cardName}」`
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
  scheduleHeightUpdate()
}

const restoreLastHidden = () => {
  if (lastHiddenCard.value && hiddenCards.value.has(lastHiddenCard.value)) {
    const newSet = new Set(hiddenCards.value)
    newSet.delete(lastHiddenCard.value)
    hiddenCards.value = newSet
    safeStorage.setItem('hiddenCards', JSON.stringify([...hiddenCards.value]))
    toastVisible.value = false
    lastHiddenCard.value = null
    scheduleHeightUpdate()
  }
}

const showCard = (cardId) => {
  const newSet = new Set(hiddenCards.value)
  newSet.delete(cardId)
  hiddenCards.value = newSet
  safeStorage.setItem('hiddenCards', JSON.stringify([...hiddenCards.value]))
  if (lastHiddenCard.value === cardId) {
    lastHiddenCard.value = null
  }
  scheduleHeightUpdate()
}

const showAllCards = () => {
  hiddenCards.value = new Set()
  safeStorage.setItem('hiddenCards', JSON.stringify([]))
  hiddenModalVisible.value = false
  scheduleHeightUpdate()
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

const handleScroll = () => {
  if (!slidesContainer.value || isScrolling) return
  const scrollLeft = slidesContainer.value.scrollLeft
  const newIndex = Math.round(scrollLeft / window.innerWidth)
  if (newIndex !== currentIndex.value && newIndex >= 0 && newIndex < 6) {
    currentIndex.value = newIndex

    nextTick(() => {
      const targetSlide = slideRefs.value[newIndex]
      if (targetSlide) {
        const cachedHeight = slideHeights.value[newIndex]

        targetSlide.classList.add('measuring')
        const targetHeight = calculateSlideFullHeight(targetSlide, newIndex)
        targetSlide.classList.remove('measuring')

        if (targetHeight > 0) {
          if (cachedHeight > 0 && targetHeight < cachedHeight) {
            currentSlideHeight.value = cachedHeight
          } else {
            slideHeights.value[newIndex] = targetHeight
            currentSlideHeight.value = targetHeight
          }
        }
      }
      startResizeObserver(newIndex)
    })
  }
}

const handleRestoreTab = (tabId) => {
  restoreTab(tabId)
  showToast(`已恢复「${allTabs.find(t => t.id === tabId)?.label || tabId}」`)
}

const handleHideTab = (tabId) => {
  hideTab(tabId)
  showToast(`已隐藏「${allTabs.find(t => t.id === tabId)?.label || tabId}」`)
}

const handleRestartOnboarding = () => {
  resetOnboarding()
  currentStep.value = 1
  onboardingActive.value = true
  settingsVisible.value = false
}

const handleOpenSettings = () => {
  settingsVisible.value = true
}

const handleCloseSettings = () => {
  settingsVisible.value = false
}

const handleGoToMap = () => {
  goToSlide(5, 'right')
}

const handleGoToHome = () => {
  goToSlide(0, 'left')
}

const handleOnboardingComplete = () => {
  completeOnboarding()
  setTimeout(() => {
    preloadAllSlideHeights()
  }, 200)
}

const handleOnboardingSetTheme = (mode) => {
  setTheme(mode)
}

const handleOnboardingSetFontSize = (size) => {
  setFontSize(size)
}

const showToast = (message) => {
  toastMessage.value = message
  toastVisible.value = true
  setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

const initHiddenCards = () => {
  const saved = safeStorage.getItem('hiddenCards')
  if (saved) {
    try {
      hiddenCards.value = new Set(JSON.parse(saved))
    } catch (e) {}
  }
}

onMounted(() => {
  initTheme()
  initFontSettings()
  initHiddenCards()
  initOnboarding()
  loadPlaylist()

  nextTick(() => {
    if (!onboardingCompleted.value) {
      setTimeout(() => {
        startOnboarding()
      }, 500)
    }
  })

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

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      preloadAllSlideHeights()
      startResizeObserver(currentIndex.value)
    })
  })
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
  if (sectionObserverCleanup) {
    sectionObserverCleanup()
    sectionObserverCleanup = null
  }
  if (heightUpdateTimer) {
    clearTimeout(heightUpdateTimer)
    heightUpdateTimer = null
  }
})

watch(currentIndex, (newIndex) => {
  startResizeObserver(newIndex)
  if (newIndex === 5 && !mapCompleted.value) {
    setTimeout(() => {
      startMapOnboarding()
    }, 500)
  }
})

watch(windowWidth, () => {
  preloadAllSlideHeights()
})

watch(hiddenCards, () => {
  setTimeout(() => {
    updateSlideHeight(true)
  }, 150)
}, { deep: true })

watch(onboardingActive, (active) => {
  if (!active) {
    setTimeout(() => {
      updateSlideHeight(true)
    }, 250)
  }
})

watch(currentStep, () => {
  setTimeout(() => {
    updateSlideHeight(true)
  }, 150)
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
  min-height: auto;
  max-width: 100vw;
  overflow-x: hidden;
}

.hero {
  min-height: 20vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-md);
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
  text-align: left;
}

.hero h1 {
  font-family: 'LXGW WenKai', serif;
  font-size: clamp(1.1rem, 5vw, 1.5rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 0.2rem;
  letter-spacing: 0.05em;
}

.hero-subtitle {
  font-size: clamp(0.65rem, 2vw, 0.75rem);
  color: var(--text-muted);
}

.hero-actions {
  position: relative;
  z-index: 1;
  display: flex;
  gap: var(--space-xs);
}

.hero-search-btn,
.hero-menu-btn {
  width: 40px;
  height: 40px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.hero-search-btn:hover,
.hero-menu-btn:hover {
  background: var(--forest);
  border-color: var(--forest);
  color: white;
  transform: scale(1.05);
}

.hero-search-btn:active,
.hero-menu-btn:active {
  transform: scale(0.95);
}

.hero-search-btn svg,
.hero-menu-btn svg {
  width: 20px;
  height: 20px;
}

.jump-section-tag {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--earth-light);
  padding: 2px 8px;
  border-radius: 6px;
  margin-left: auto;
  margin-right: var(--space-xs);
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  animation: tabActivate 0.35s var(--ease-out-quart);
}

@keyframes tabActivate {
  0% { transform: scale(0.92); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}

.slides-container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
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
  height: auto;
  min-height: auto;
  overflow: visible;
}

.slide:not(.active) {
  opacity: 0;
  pointer-events: none;
  height: 0;
  min-height: 0;
  overflow: hidden;
}

.slide.measuring {
  height: auto !important;
  min-height: auto !important;
  overflow: visible !important;
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
  font-family: 'LXGW WenKai', serif;
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

.hidden-tabs-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.hidden-tab-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
}

.hidden-tab-item span {
  color: var(--text);
}

.restore-tab-btn {
  background: var(--forest);
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: var(--space-xs);
  font-size: var(--text-xs);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.restore-tab-btn:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
}

.add-hide-location-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm);
  background: var(--earth-light);
  border: none;
  border-radius: var(--space-sm);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.add-hide-location-btn:hover {
  background: var(--border);
  color: var(--text);
}

.add-hide-location-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s var(--ease-out-quart);
}

.add-hide-location-btn svg.rotated {
  transform: rotate(180deg);
}

.add-hide-location-panel {
  margin-top: var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-sm);
  overflow: hidden;
}

.add-hide-location-tip {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--text-xs);
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
}

.add-hide-location-list {
  padding: var(--space-xs);
}

.add-hide-location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm);
  border-radius: var(--space-xs);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-hide-location-item:hover {
  background: var(--card);
}

.add-hide-location-name {
  font-size: var(--text-sm);
  color: var(--text);
}

.add-hide-location-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  opacity: 0;
  transition: all 0.2s ease;
}

.add-hide-location-item:hover .add-hide-location-icon {
  opacity: 1;
  color: var(--sunset);
}

.add-hide-location-empty {
  padding: var(--space-sm);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s var(--ease-out-quart);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 300px;
  transform: translateY(0);
}

.restart-onboarding-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: var(--earth-light);
  border: 1px dashed var(--border);
  border-radius: var(--space-sm);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.restart-onboarding-btn:hover {
  background: var(--forest-light);
  border-color: var(--forest);
  color: var(--forest);
}

.restart-onboarding-btn svg {
  width: 16px;
  height: 16px;
}

.music-section {
  padding-bottom: 0;
}

.music-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.music-toggle-in-settings {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--sunset-soft);
  border: 2px solid var(--sunset);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s var(--ease-out-quart);
  flex-shrink: 0;
}

.music-toggle-in-settings:hover {
  background: var(--sunset);
  transform: scale(1.05);
}

.music-toggle-in-settings:hover svg,
.music-toggle-in-settings.playing svg {
  color: white;
}

.music-toggle-in-settings.playing {
  background: var(--sunset);
  animation: musicPulseInSettings 2s ease-in-out infinite;
}

@keyframes musicPulseInSettings {
  0%, 100% { box-shadow: 0 0 0 0 rgba(204, 85, 51, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(204, 85, 51, 0); }
}

.music-toggle-in-settings.expanded {
  background: var(--sunset);
  transform: scale(0.95);
}

.music-toggle-in-settings svg {
  width: 22px;
  height: 22px;
  color: var(--sunset);
  transition: color 0.2s ease, transform 0.2s ease;
}

.music-toggle-in-settings.playing svg {
  color: white;
}

.music-toggle-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
}

.music-drawer-panel {
  background: var(--earth-light);
  border-radius: 16px;
  margin-top: 12px;
  overflow: hidden;
  transform-origin: top center;
}

.music-drawer-content {
  padding: 16px;
}

.music-current-song {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.music-disc-small {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  position: relative;
}

.music-disc-small.is-playing {
  animation: discSpin 8s linear infinite;
  cursor: pointer;
}

@keyframes discSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.music-disc-small:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.music-cover-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.music-current-info {
  flex: 1;
  min-width: 0;
}

.music-current-name {
  font-weight: 600;
  color: var(--text);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-current-artist {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.music-drawer-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.drawer-btn {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: var(--card);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s var(--ease-out-quart);
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.drawer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.drawer-btn:active {
  transform: scale(0.92);
}

.drawer-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.drawer-btn.play {
  width: 54px;
  height: 54px;
  background: linear-gradient(145deg, var(--forest), oklch(32% 0.12 145));
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.drawer-btn.play svg {
  color: white;
}

.drawer-btn.play:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

.drawer-btn svg {
  width: 18px;
  height: 18px;
  color: var(--text);
}

.music-drawer-progress {
  padding: 0 8px;
  margin-bottom: 12px;
  cursor: pointer;
}

.progress-bar-bg {
  width: 100%;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--forest), var(--sunset));
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-time {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 6px;
}

.music-drawer-volume {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  margin-bottom: 16px;
}

.music-drawer-volume svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.music-drawer-volume .volume-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border);
  border-radius: 2px;
  cursor: pointer;
}

.music-drawer-volume .volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--forest);
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: transform 0.15s ease;
}

.music-drawer-volume .volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.music-drawer-playlist {
  border-top: 1px solid var(--border);
  padding-top: 12px;
}

.drawer-playlist-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding: 0 4px;
}

.drawer-playlist-items {
  max-height: 180px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.drawer-playlist-items::-webkit-scrollbar {
  width: 3px;
}

.drawer-playlist-items::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

.drawer-playlist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.drawer-playlist-item:hover {
  background: var(--card);
}

.drawer-playlist-item.active {
  background: var(--forest-light);
}

.drawer-item-index {
  width: 20px;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.drawer-playlist-item.active .drawer-item-index {
  color: var(--forest);
  font-weight: 600;
}

.drawer-item-info {
  flex: 1;
  min-width: 0;
}

.drawer-item-name {
  font-size: 0.85rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer-playlist-item.active .drawer-item-name {
  font-weight: 600;
  color: var(--forest);
}

.drawer-item-artist {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.music-drawer-enter-active {
  animation: drawerOpen 0.4s var(--ease-out-quart);
}

.music-drawer-leave-active {
  animation: drawerClose 0.3s var(--ease-out-quart);
}

@keyframes drawerOpen {
  0% {
    opacity: 0;
    transform: scaleY(0) translateY(-10px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
}

@keyframes drawerClose {
  0% {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    transform: scaleY(0) translateY(-10px);
  }
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
  font-family: 'LXGW WenKai', serif;
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
