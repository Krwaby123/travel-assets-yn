<template>
  <Teleport to="body">
    <div
      class="hidden-modal-overlay"
      :class="{ active: visible }"
      @click.self="$emit('close')"
      @keydown.escape="$emit('close')"
    >
      <div
        class="hidden-modal"
        :class="{ active: visible }"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hidden-modal-title"
        ref="modalRef"
      >
        <div class="hidden-modal-header">
          <span class="hidden-modal-title" id="hidden-modal-title">已隐藏的内容</span>
          <button class="hidden-modal-close" @click="$emit('close')" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="hidden-modal-content">
          <div class="hidden-modal-empty" v-if="hiddenCards.length === 0">
            <div class="hidden-modal-empty-icon">📋</div>
            <p>没有隐藏的内容</p>
            <p class="hidden-modal-empty-hint">点击卡片右上角的 × 可以隐藏不需要的内容</p>
          </div>
          <div v-else class="hidden-modal-list">
            <div
              v-for="(cardId, index) in hiddenCards"
              :key="cardId"
              class="hidden-modal-item"
              :data-card-id="cardId"
              :style="{ '--item-index': index }"
            >
              <span class="hidden-modal-item-name">{{ getCardName(cardId) }}</span>
              <button class="hidden-modal-item-restore" @click="$emit('restore', cardId)">恢复</button>
            </div>
          </div>
        </div>
        <div class="hidden-modal-footer" v-if="hiddenCards.length > 0">
          <button class="hidden-modal-reset-btn" @click="$emit('restore-all')">恢复全部</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  hiddenCards: {
    type: Array,
    default: () => []
  }
})

defineEmits(['close', 'restore', 'restore-all'])

const modalRef = ref(null)
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
  if (!modalRef.value) return []
  return modalRef.value.querySelectorAll(focusableSelectors)
}

const trapFocus = (e) => {
  if (e.key !== 'Tab' || !modalRef.value) return

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

const cardNameMap = {
  'dounan-venue': '斗南场馆详解',
  'dounan-time': '斗南时间攻略',
  'dounan-tips': '斗南避坑指南',
  'dali-erhai': '大理洱海环湖',
  'dali-food': '大理美食推荐',
  'dali-stay': '大理住宿攻略',
  'lijiang-old-town': '丽江古城攻略',
  'lijiang-jade': '玉龙雪山攻略',
  'lijiang-food': '丽江美食推荐',
  'shangri-duke': '独克宗古城',
  'shangri-meadow': '纳帕海依拉草原',
  'shangri-lake': '普达措国家公园'
}

const getCardName = (cardId) => {
  return cardNameMap[cardId] || cardId
}
</script>

<style scoped>
@import '@/styles/travel.css';

.hidden-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 200;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  transition: background var(--duration-slow) var(--ease-out-quart);
}

.hidden-modal-overlay.active {
  background: var(--overlay);
  pointer-events: auto;
}

.hidden-modal {
  width: 100%;
  max-width: 360px;
  max-height: 80vh;
  background: var(--card);
  border-radius: var(--space-lg);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0);
  transform: scale(0.95) translateY(20px);
  opacity: 0;
  transition: all var(--duration-slow) var(--ease-out-quart);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hidden-modal.active {
  transform: scale(1) translateY(0);
  opacity: 1;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
}

.hidden-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border);
}

.hidden-modal-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text);
}

.hidden-modal-close {
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

.hidden-modal-close:hover {
  background: var(--border);
}

.hidden-modal-close svg {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.hidden-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
}

.hidden-modal-empty {
  text-align: center;
  padding: var(--space-xl);
}

.hidden-modal-empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
  opacity: 0.5;
}

.hidden-modal-empty p {
  color: var(--text-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
}

.hidden-modal-empty-hint {
  font-size: var(--text-xs);
  opacity: 0.7;
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
  animation: itemFadeIn 0.3s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--item-index, 0) * 50ms);
  opacity: 0;
}

@keyframes itemFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hidden-modal-item-name {
  font-size: var(--text-sm);
  color: var(--text);
}

.hidden-modal-item-restore {
  padding: 4px 10px;
  background: var(--forest);
  color: white;
  border: none;
  border-radius: var(--space-xs);
  font-size: 0.75rem;
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.hidden-modal-item-restore:hover {
  background: var(--sky);
}

.hidden-modal-footer {
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border);
}

.hidden-modal-reset-btn {
  width: 100%;
  padding: var(--space-sm);
  background: var(--earth-light);
  border: none;
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--text);
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.hidden-modal-reset-btn:hover {
  background: var(--border);
}

@media (max-width: 480px) {
  .hidden-modal-overlay {
    padding: var(--space-sm);
    align-items: flex-end;
  }

  .hidden-modal {
    max-height: 70vh;
    border-radius: var(--space-lg) var(--space-lg) 0 0;
    max-width: 100%;
  }

  .hidden-modal.active {
    transform: scale(1) translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hidden-modal-overlay,
  .hidden-modal,
  .hidden-modal-item {
    transition: none;
    animation: none;
    opacity: 1;
  }
}
</style>
