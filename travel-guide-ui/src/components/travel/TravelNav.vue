<template>
  <nav class="nav-tabs" role="navigation" aria-label="目的地导航">
    <div class="nav-tabs-inner">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :class="['nav-tab', { active: index === activeIndex }]"
        @click="$emit('navigate', index)"
      >
        {{ tab.label }}
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeIndex: {
    type: Number,
    default: 0
  }
})

defineEmits(['navigate'])
</script>

<style scoped>
.nav-tabs {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  padding: var(--space-sm) var(--space-xs);
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.nav-tab:hover {
  background: var(--earth-light);
}

.nav-tab.active {
  background: var(--forest);
  color: white;
}

@media (min-width: 480px) {
  .nav-tabs {
    padding: var(--space-sm) var(--space-md);
  }
  .nav-tab {
    padding: var(--space-xs) var(--space-lg);
    font-size: 0.9rem;
  }
}

@media (min-width: 768px) {
  .nav-tabs-inner {
    justify-content: center;
  }
}

@media (max-width: 359px) {
  .nav-tab {
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.78rem;
    min-height: 44px;
  }
}
</style>
