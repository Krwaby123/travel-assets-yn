<template>
  <div class="sidebar-toggle" :class="{ 'has-hidden': hiddenCards.size > 0 }" @click="$emit('open')">
    <span class="sidebar-toggle-label">管理内容</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
    <span class="badge" v-if="hiddenCards.size > 0">{{ hiddenCards.size }}</span>
  </div>

  <Teleport to="body">
    <div class="sidebar-overlay" :class="{ active: visible }" @click="$emit('close')"></div>
    <div class="sidebar-panel" :class="{ active: visible }">
      <div class="sidebar-header">
        <span class="sidebar-title">已隐藏的内容</span>
        <button class="sidebar-close" @click="$emit('close')" aria-label="关闭">
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
        <div
          v-for="cardId in [...hiddenCards]"
          :key="cardId"
          class="sidebar-item"
        >
          <span class="sidebar-item-name">{{ getCardName(cardId) }}</span>
          <button class="sidebar-item-restore" @click="$emit('restore', cardId)">恢复</button>
        </div>
      </div>
      <div class="sidebar-footer" v-if="hiddenCards.size > 0">
        <button class="sidebar-reset-btn" @click="$emit('restore-all')">恢复所有隐藏内容</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
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

const getCardName = (cardId) => {
  return cardNames[cardId] || cardId
}

defineProps({
  hiddenCards: {
    type: Set,
    default: () => new Set()
  },
  visible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['open', 'close', 'restore', 'restore-all'])
</script>

<style scoped>
.sidebar-toggle {
  position: fixed;
  bottom: 80px;
  right: var(--space-md);
  width: 48px;
  height: 48px;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.sidebar-toggle:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

.sidebar-toggle svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
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
  box-shadow: -4px 0 20px rgba(0,0,0,0);
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
</style>
