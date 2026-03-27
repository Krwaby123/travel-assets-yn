<template>
  <Teleport to="body">
    <div
      class="lightbox"
      :class="{ active: visible }"
      @click.self="$emit('close')"
      @keydown.escape="$emit('close')"
    >
      <div
        class="lightbox-content"
        role="dialog"
        aria-modal="true"
        :aria-label="label || '图片预览'"
        ref="lightboxRef"
      >
        <button class="lightbox-close" @click="$emit('close')" aria-label="关闭" ref="closeBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <img class="lightbox-img" :src="image" :alt="label">
        <div class="lightbox-label" v-if="label">{{ label }}</div>
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
  image: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])

const lightboxRef = ref(null)
const closeBtn = ref(null)
let previousActiveElement = null

watch(() => props.visible, async (visible) => {
  if (visible) {
    previousActiveElement = document.activeElement
    await nextTick()
    if (closeBtn.value) {
      closeBtn.value.focus()
    }
  } else {
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus()
    }
  }
})

onUnmounted(() => {
  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus()
  }
})
</script>

<style scoped>
@import '@/styles/travel.css';

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  pointer-events: none;
  transition: background var(--duration-slow) var(--ease-out-quart);
}

.lightbox.active {
  background: rgba(0, 0, 0, 0.9);
  pointer-events: auto;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  transform: scale(0.95);
  opacity: 0;
  transition: all var(--duration-slow) var(--ease-out-quart);
}

.lightbox.active .lightbox-content {
  transform: scale(1);
  opacity: 1;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-close svg {
  width: 20px;
  height: 20px;
  color: white;
}

.lightbox-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--space-sm);
}

.lightbox-label {
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: var(--text-sm);
  opacity: 0.8;
}

@media (max-width: 480px) {
  .lightbox {
    padding: var(--space-sm);
  }

  .lightbox-close {
    top: -44px;
    right: 50%;
    transform: translateX(50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lightbox,
  .lightbox-content {
    transition: none;
  }
}
</style>
