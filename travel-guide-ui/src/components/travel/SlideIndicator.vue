<template>
  <div class="slide-indicator" role="tablist" aria-label="页面导航">
    <span
      v-for="i in total"
      :key="i"
      :class="['slide-dot', { active: i - 1 === current }]"
      role="tab"
      tabindex="0"
      :aria-label="getLabel(i - 1)"
      :aria-selected="i - 1 === current"
      @click="$emit('navigate', i - 1)"
      @keydown.enter="$emit('navigate', i - 1)"
    ></span>
  </div>
</template>

<script setup>
const labels = ['首页', '斗南', '大理', '丽江', '香格里拉']

const getLabel = (index) => labels[index] || `第${index + 1}页`

defineProps({
  total: {
    type: Number,
    default: 5
  },
  current: {
    type: Number,
    default: 0
  }
})

defineEmits(['navigate'])
</script>

<style scoped>
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
  transition: all 0.3s ease;
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
}

.slide-dot.active {
  background: var(--forest);
  width: 24px;
  border-radius: 4px;
}

@media (min-width: 768px) {
  .slide-indicator {
    display: none;
  }
}
</style>
