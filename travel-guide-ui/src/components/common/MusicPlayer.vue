<template>
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
            <div
              class="music-disc-small"
              :class="{ 'is-playing': isMusicPlaying, 'is-pausing': isMusicPausing }"
              @click="handleDiscClick"
            >
              <img
                v-if="currentSong?.cover"
                :src="`/images/music-covers/${currentSong.cover}`"
                :alt="currentSong.name"
                class="music-cover-small"
                loading="lazy"
              >
              <img
                v-else
                src="/images/music-covers/spring-flowers-cover.jpg"
                alt="春花"
                class="music-cover-small"
                loading="lazy"
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

  <audio ref="bgMusic" preload="auto" @timeupdate="updateProgress" @loadedmetadata="onAudioLoaded" @ended="onSongEnded">
    <source v-if="currentSong" :src="`./music/${currentSong.file}`" type="audio/mpeg">
  </audio>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMusicPlayer } from '@/composables/useMusicPlayer'

const emit = defineEmits(['open-lightbox'])

const {
  bgMusic,
  isMusicPlaying,
  isMusicPausing,
  showMusicPlaylist,
  currentTime,
  duration,
  volume,
  currentSongIndex,
  playlist,
  playMode,
  currentSong,
  musicProgress,
  formatTime,
  seekProgress,
  loadPlaylist,
  togglePlay,
  playSong,
  prevSong,
  nextSong,
  updateProgress,
  onAudioLoaded,
  onSongEnded,
  cyclePlayMode,
  setVolume
} = useMusicPlayer()

const handleDiscClick = () => {
  if (currentSong.value?.cover) {
    emit('open-lightbox', `/images/music-covers/${currentSong.value.cover}`, currentSong.value.name)
  }
}

onMounted(() => {
  loadPlaylist()
})

defineExpose({
  bgMusic
})
</script>

<style scoped>
@import '@/styles/travel.css';

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
  width: 18px;
  height: 18px;
  color: var(--forest);
}

.music-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.music-toggle-in-settings {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--forest);
  background: var(--forest-light);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out-quart);
}

.music-toggle-in-settings svg {
  width: 20px;
  height: 20px;
  color: var(--forest);
}

.music-toggle-in-settings:hover {
  background: var(--forest);
}

.music-toggle-in-settings:hover svg {
  color: white;
}

.music-toggle-in-settings.playing {
  background: var(--forest);
  border-color: var(--forest);
}

.music-toggle-in-settings.playing svg {
  color: white;
}

.music-toggle-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.music-drawer-panel {
  margin-top: var(--space-md);
  background: var(--earth-light);
  border-radius: var(--space-md);
  overflow: hidden;
}

.music-drawer-content {
  padding: var(--space-md);
}

.music-current-song {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.music-disc-small {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.music-disc-small.is-playing {
  animation: discSpin 3s linear infinite;
}

.music-disc-small.is-pausing {
  animation: discSpin 3s linear infinite;
  animation-play-state: paused;
}

@keyframes discSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.music-cover-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.music-current-info {
  flex: 1;
  min-width: 0;
}

.music-current-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-current-artist {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.music-drawer-progress {
  margin-bottom: var(--space-md);
  cursor: pointer;
}

.progress-bar-bg {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--forest);
  border-radius: 2px;
  transition: width 0.1s linear;
}

.progress-time {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.music-drawer-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.drawer-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: var(--card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.drawer-btn svg {
  width: 18px;
  height: 18px;
  color: var(--text);
}

.drawer-btn:hover:not(:disabled) {
  background: var(--forest-light);
}

.drawer-btn:hover:not(:disabled) svg {
  color: var(--forest);
}

.drawer-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.drawer-btn.play {
  width: 48px;
  height: 48px;
  background: var(--forest);
}

.drawer-btn.play svg {
  width: 22px;
  height: 22px;
  color: white;
}

.drawer-btn.play:hover {
  background: var(--sky);
}

.music-drawer-volume {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.music-drawer-volume svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.volume-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border);
  border-radius: 2px;
  outline: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: var(--forest);
  border-radius: 50%;
  cursor: pointer;
}

.music-drawer-playlist {
  border-top: 1px solid var(--border);
  padding-top: var(--space-md);
}

.drawer-playlist-title {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.drawer-playlist-items {
  max-height: 200px;
  overflow-y: auto;
}

.drawer-playlist-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--space-xs);
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.drawer-playlist-item:hover {
  background: var(--card);
}

.drawer-playlist-item.active {
  background: var(--forest-light);
}

.drawer-item-index {
  font-size: 0.7rem;
  color: var(--text-muted);
  width: 20px;
  text-align: center;
}

.drawer-item-info {
  flex: 1;
  min-width: 0;
}

.drawer-item-name {
  font-size: var(--text-xs);
  color: var(--text);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer-item-artist {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.drawer-playlist-item.active .drawer-item-name {
  color: var(--forest);
  font-weight: 600;
}

.music-drawer-enter-active,
.music-drawer-leave-active {
  transition: all var(--duration-slow) var(--ease-out-quart);
}

.music-drawer-enter-from,
.music-drawer-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
}

.music-drawer-enter-to,
.music-drawer-leave-from {
  opacity: 1;
  max-height: 500px;
}

@media (max-width: 480px) {
  .music-drawer-panel {
    margin: var(--space-sm) calc(-1 * var(--space-md));
    border-radius: 0;
  }

  .drawer-playlist-items {
    max-height: 150px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .music-disc-small.is-playing,
  .music-drawer-enter-active,
  .music-drawer-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
