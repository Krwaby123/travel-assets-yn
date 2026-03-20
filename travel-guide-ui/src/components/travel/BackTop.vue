<template>
  <button class="back-top" :class="{ visible: visible }" @click="$emit('click')" aria-label="返回首页">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  </button>
</template>

<script setup>
defineProps({
  visible: Boolean
})

defineEmits(['click'])
</script>

<style scoped>
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

@media (min-width: 768px) {
  .back-top {
    bottom: var(--space-xl);
    right: var(--space-lg);
    width: 3rem;
    height: 3rem;
  }
  .back-top svg {
    width: 1.2rem;
    height: 1.2rem;
  }
}

@media (max-width: 479px) {
  .back-top {
    width: 3rem;
    height: 3rem;
  }
}
</style>
