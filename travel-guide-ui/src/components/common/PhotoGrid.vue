<template>
  <div class="photo-grid">
    <div
      v-for="(photo, index) in photos"
      :key="photo.label || index"
      class="photo-item"
      @click="$emit('photo-click', photo.src, photo.label)"
    >
      <img
        :src="photo.src"
        :alt="photo.label"
        loading="lazy"
        referrerpolicy="no-referrer"
        @load="onLoad(photo.src)"
        @error="onError(photo.src)"
      />
      <span v-if="photo.label" class="photo-label">{{ photo.label }}</span>
      <div v-if="errors[photo.src]" class="photo-fallback">
        <span>🖼️</span>
        <span>图片加载失败</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  photos: {
    type: Array,
    default: () => []
  }
})

defineEmits(['photo-click'])

const errors = reactive({})

const onLoad = (src) => {
  errors[src] = false
}

const onError = (src) => {
  errors[src] = true
}
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs, 8px);
}

.photo-item {
  aspect-ratio: 1;
  border-radius: var(--space-sm, 12px);
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-out;
}

.photo-item:hover img {
  transform: scale(1.05);
}

.photo-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 4px 4px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: white;
  font-size: 0.7rem;
  text-align: center;
}

.photo-fallback {
  position: absolute;
  inset: 0;
  background: var(--earth-light, #f5f0eb);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs, 8px);
  font-size: 0.75rem;
  color: var(--text-muted, #888);
}
</style>
