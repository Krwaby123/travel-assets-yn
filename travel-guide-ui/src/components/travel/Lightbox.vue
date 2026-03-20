<template>
  <Teleport to="body">
    <div class="lightbox" :class="{ active: visible }" @click.self="$emit('close')">
      <div class="lightbox-content">
        <button class="lightbox-close" @click="$emit('close')" aria-label="关闭">
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
defineProps({
  visible: Boolean,
  image: String,
  label: String
})

defineEmits(['close'])
</script>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0);
  visibility: hidden;
  transition: background 0.35s ease, visibility 0.35s ease;
  -webkit-tap-highlight-color: transparent;
}

.lightbox.active {
  background: rgba(0, 0, 0, 0.92);
  visibility: visible;
}

.lightbox-content {
  position: relative;
  max-width: 95vw;
  max-height: 90vh;
  opacity: 0;
  transform: scale(0.85) translateY(20px);
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.lightbox.active .lightbox-content {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.lightbox-img {
  max-width: 95vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--space-sm);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
  position: absolute;
  top: -44px;
  right: 0;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.lightbox-close svg {
  width: 18px;
  height: 18px;
  color: white;
}

.lightbox-label {
  position: absolute;
  bottom: -36px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.85rem;
  white-space: nowrap;
  font-family: 'ZCOOL XiaoWei', serif;
  letter-spacing: 0.05em;
}

@media (prefers-reduced-motion: reduce) {
  .lightbox,
  .lightbox-content {
    transition-duration: 0.01ms !important;
  }
}
</style>
