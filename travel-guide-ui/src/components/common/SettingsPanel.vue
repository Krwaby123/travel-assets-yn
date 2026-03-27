<template>
  <div>
    <div
      class="settings-overlay"
      :class="{ active: visible }"
      @click="$emit('close')"
      @keydown.escape="$emit('close')"
    ></div>
    <div
      class="settings-panel"
      :class="{ active: visible }"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      ref="panelRef"
    >
      <div class="settings-header">
        <span class="settings-title" id="settings-title">设置</span>
        <button class="settings-close" @click="$emit('close')" aria-label="关闭">
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
          <button :class="['theme-option', { active: themeMode === 'light' }]" @click="$emit('set-theme', 'light')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            亮色
          </button>
          <button :class="['theme-option', { active: themeMode === 'dark' }]" @click="$emit('set-theme', 'dark')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
            暗色
          </button>
          <button :class="['theme-option', { active: themeMode === 'eye-care' }]" @click="$emit('set-theme', 'eye-care')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            护眼
          </button>
          <button :class="['theme-option', { active: themeMode === 'auto' }]" @click="$emit('set-theme', 'auto')">
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
            <button :class="['font-option', { active: fontSize === 'small' }]" @click="$emit('set-font-size', 'small')">小</button>
            <button :class="['font-option', { active: fontSize === 'medium' }]" @click="$emit('set-font-size', 'medium')">中</button>
            <button :class="['font-option', { active: fontSize === 'large' }]" @click="$emit('set-font-size', 'large')">大</button>
          </div>
        </div>
        <div class="font-setting-group">
          <div class="font-setting-label">文字粗细</div>
          <div class="font-options">
            <button :class="['font-option', { active: fontWeight === 'normal' }]" @click="$emit('set-font-weight', 'normal')">正常</button>
            <button :class="['font-option', { active: fontWeight === 'bold' }]" @click="$emit('set-font-weight', 'bold')">加粗</button>
          </div>
        </div>
      </div>

      <div class="settings-section" data-onboarding="hidden-content">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
          隐藏内容管理
          <span v-if="hiddenCardsCount > 0" class="hidden-count">{{ hiddenCardsCount }}</span>
        </div>
        <button class="manage-hidden-btn" @click="$emit('open-hidden-modal')">
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
            <button class="restore-tab-btn" @click="$emit('restore-tab', tab.id)">恢复</button>
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
                @click="$emit('hide-tab', tab.id)"
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

      <slot name="music-section"></slot>

      <div class="settings-section">
        <div class="settings-section-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
          </svg>
          新手引导
        </div>
        <button class="restart-onboarding-btn" @click="$emit('restart-onboarding')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
          </svg>
          重新体验新手引导
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  themeMode: {
    type: String,
    default: 'auto'
  },
  fontSize: {
    type: String,
    default: 'medium'
  },
  fontWeight: {
    type: String,
    default: 'normal'
  },
  hiddenCardsCount: {
    type: Number,
    default: 0
  },
  hiddenTabList: {
    type: Array,
    default: () => []
  },
  visibleDestinationTabs: {
    type: Array,
    default: () => []
  }
})

defineEmits([
  'close',
  'set-theme',
  'set-font-size',
  'set-font-weight',
  'open-hidden-modal',
  'restore-tab',
  'hide-tab',
  'restart-onboarding'
])

const showAddHideLocation = ref(false)
const panelRef = ref(null)
let previousActiveElement = null

const focusableSelectors = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ')

const getFocusableElements = () => {
  if (!panelRef.value) return []
  return panelRef.value.querySelectorAll(focusableSelectors)
}

const trapFocus = (e) => {
  if (e.key !== 'Tab' || !panelRef.value) return

  const focusableElements = getFocusableElements()
  if (focusableElements.length === 0) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault()
    lastElement.focus()
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault()
    firstElement.focus()
  }
}

watch(() => props.visible, async (visible) => {
  if (visible) {
    previousActiveElement = document.activeElement
    await nextTick()
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
    document.addEventListener('keydown', trapFocus)
  } else {
    document.removeEventListener('keydown', trapFocus)
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus()
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
@import '@/styles/travel.css';

.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 99;
  pointer-events: none;
  transition: background var(--duration-slow) var(--ease-out-quart);
}

.settings-overlay.active {
  background: rgba(0, 0, 0, 0);
  pointer-events: auto;
  backdrop-filter: blur(0);
}

@media (min-width: 768px) {
  .settings-overlay.active {
    backdrop-filter: blur(8px);
  }
}

.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(360px, 85vw);
  background: var(--card);
  box-shadow: -16px 0 48px rgba(0, 0, 0, 0);
  z-index: 100;
  transform: translateX(100%);
  transition: transform var(--duration-slower) var(--ease-out-quart),
              box-shadow var(--duration-slow) var(--ease-out-quart);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.settings-panel.active {
  transform: translateX(0);
  box-shadow: -16px 0 48px rgba(0, 0, 0, 0.15);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--card);
  z-index: 1;
}

.settings-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text);
}

.settings-close {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--earth-light);
  border-radius: var(--space-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.settings-close:hover {
  background: var(--border);
}

.settings-close svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.settings-section {
  padding: var(--space-md) var(--space-lg);
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

.hidden-count {
  margin-left: auto;
  background: var(--danger);
  color: white;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xs);
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xs);
  padding: var(--space-sm);
  border: 2px solid var(--border);
  border-radius: var(--space-sm);
  background: transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.theme-option svg {
  width: 22px;
  height: 22px;
  color: var(--text-muted);
}

.theme-option span {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.theme-option:hover {
  border-color: var(--forest);
}

.theme-option:hover svg,
.theme-option:hover span {
  color: var(--forest);
}

.theme-option.active {
  border-color: var(--forest);
  background: var(--forest-light);
}

.theme-option.active svg,
.theme-option.active span {
  color: var(--forest);
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
  padding: var(--space-xs) var(--space-sm);
  border: 2px solid var(--border);
  border-radius: var(--space-xs);
  background: transparent;
  font-size: var(--text-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.font-option:hover {
  border-color: var(--forest);
  color: var(--forest);
}

.font-option.active {
  border-color: var(--forest);
  background: var(--forest);
  color: white;
}

.manage-hidden-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm);
  background: var(--earth-light);
  border: none;
  border-radius: var(--space-sm);
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.manage-hidden-btn:hover {
  background: var(--border);
}

.manage-hidden-btn span {
  font-size: var(--text-sm);
  color: var(--text);
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
  padding: var(--space-xs) var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-xs);
}

.hidden-tab-item span {
  font-size: var(--text-sm);
  color: var(--text);
}

.restore-tab-btn {
  padding: 4px 10px;
  background: var(--forest);
  color: white;
  border: none;
  border-radius: var(--space-xs);
  font-size: 0.75rem;
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.restore-tab-btn:hover {
  background: var(--sky);
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
  transition: background var(--duration-fast) ease;
}

.add-hide-location-btn:hover {
  background: var(--border);
}

.add-hide-location-btn span {
  font-size: var(--text-sm);
  color: var(--text);
}

.add-hide-location-btn svg {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  transition: transform var(--duration-normal) var(--ease-out-quart);
}

.add-hide-location-btn svg.rotated {
  transform: rotate(180deg);
}

.add-hide-location-panel {
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--space-sm);
}

.add-hide-location-tip {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.add-hide-location-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.add-hide-location-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-xs);
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.add-hide-location-item:hover {
  background: var(--border);
}

.add-hide-location-name {
  font-size: var(--text-sm);
  color: var(--text);
}

.add-hide-location-icon {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
}

.add-hide-location-empty {
  padding: var(--space-sm);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.restart-onboarding-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: var(--earth-light);
  border: none;
  border-radius: var(--space-sm);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
}

.restart-onboarding-btn:hover {
  background: var(--forest-light);
}

.restart-onboarding-btn svg {
  width: 16px;
  height: 16px;
  color: var(--forest);
}

.restart-onboarding-btn span {
  font-size: var(--text-sm);
  color: var(--text);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--duration-normal) var(--ease-out-quart);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 300px;
}

@media (max-width: 480px) {
  .settings-panel {
    width: 100%;
  }

  .settings-header {
    padding: var(--space-sm) var(--space-md);
  }

  .settings-section {
    padding: var(--space-sm) var(--space-md);
  }
}

@media (prefers-reduced-motion: reduce) {
  .settings-panel,
  .settings-overlay,
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: none;
  }
}
</style>
