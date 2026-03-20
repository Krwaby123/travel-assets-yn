<template>
  <button class="nav-arrow prev" :style="{ opacity: canPrev ? 1 : 0.3 }" @click="$emit('prev')" aria-label="上一页">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  </button>
  <button class="nav-arrow next" :style="{ opacity: canNext ? 1 : 0.3 }" @click="$emit('next')" aria-label="下一页">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  </button>
</template>

<script setup>
defineProps({
  canPrev: Boolean,
  canNext: Boolean
})

defineEmits(['prev', 'next'])
</script>

<style scoped>
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
</style>
