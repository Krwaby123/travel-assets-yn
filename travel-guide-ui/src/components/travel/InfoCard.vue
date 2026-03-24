<template>
  <div
    ref="cardRef"
    :class="['closable-card', { 'card-hidden': isHidden, hiding: isHiding }]"
    :data-card-id="cardId"
    :data-card-name="cardName"
  >
    <slot></slot>
    <button
      v-if="closable"
      class="card-close-btn"
      @click.stop="handleClose"
      :aria-label="`隐藏${cardName}`"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  cardId: {
    type: String,
    required: true
  },
  cardName: {
    type: String,
    required: true
  },
  hiddenCards: {
    type: Set,
    default: () => new Set()
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['hide'])

const cardRef = ref(null)
const isHiding = ref(false)

const isHidden = computed(() => props.hiddenCards.has(props.cardId))

const handleClose = () => {
  isHiding.value = true
  setTimeout(() => {
    emit('hide', props.cardId, props.cardName)
    isHiding.value = false
  }, 300)
}
</script>

<style scoped>
.closable-card {
  position: relative;
  opacity: 1;
  transform: none;
  transition: opacity var(--duration-slow, 400ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1)),
              transform var(--duration-slow, 400ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1));
}

.closable-card.hiding {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
  pointer-events: none;
  transition-duration: var(--duration-normal, 250ms);
}

.closable-card.card-hidden {
  display: none !important;
}

.card-close-btn {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  width: 32px;
  height: 32px;
  border: none;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8) rotate(-90deg);
  transition: opacity var(--duration-normal, 250ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1)),
              transform var(--duration-normal, 250ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1)),
              background var(--duration-normal, 250ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1)),
              box-shadow var(--duration-normal, 250ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1));
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card-close-btn::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
}

.closable-card:hover .card-close-btn,
.closable-card:focus-within .card-close-btn,
.card-close-btn:focus-visible {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.card-close-btn:focus-visible {
  outline: 2px solid var(--forest);
  outline-offset: 2px;
}

.card-close-btn:hover {
  background: var(--sunset);
  border-color: var(--sunset);
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-close-btn:active {
  transform: scale(0.9) rotate(90deg);
  transition-duration: var(--duration-instant, 100ms);
}

.card-close-btn svg {
  width: 12px;
  height: 12px;
  color: var(--text-muted);
  transition: color var(--duration-normal, 250ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1));
}

.card-close-btn:hover svg {
  color: white;
}

@media (max-width: 480px) {
  .closable-card .card-close-btn {
    opacity: 0.6;
    transform: scale(0.85) rotate(0deg);
    width: 28px;
    height: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .closable-card {
    opacity: 1;
    transform: none;
  }
  .closable-card.hiding {
    transition-duration: 0.01ms;
  }
}
</style>
