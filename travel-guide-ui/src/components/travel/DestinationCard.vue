<template>
  <div
    class="dest-card"
    ref="cardRef"
    :class="{ 'dest-revealed': isRevealed }"
    @click="(e) => $emit('click', e)"
    @keydown.enter="(e) => $emit('click', e)"
    @keydown.space.prevent="(e) => $emit('click', e)"
    tabindex="0"
    role="button"
    :aria-label="`查看${name}攻略`"
    :style="{ '--reveal-delay': revealDelay }"
  >
    <div class="dest-card-image">
      <img :src="image" :alt="name" referrerpolicy="no-referrer" loading="lazy">
      <div class="dest-card-overlay"></div>
    </div>
    <div class="dest-card-content">
      <span class="dest-number">{{ number }}</span>
      <h3 class="dest-name">{{ name }}</h3>
      <p class="dest-location">{{ location }}</p>
      <p class="dest-desc">{{ desc }}</p>
    </div>
    <span class="dest-card-hint">查看攻略 →</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  number: String,
  name: String,
  location: String,
  desc: String,
  image: String,
  revealDelay: {
    type: String,
    default: '0ms'
  }
})

defineEmits(['click'])

const cardRef = ref(null)
const isRevealed = ref(false)

let observer = null

onMounted(() => {
  if (!cardRef.value) return

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          isRevealed.value = true
        }, parseInt(props.revealDelay, 10) || 0)
        observer?.disconnect()
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' })

  observer.observe(cardRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.dest-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 3 / 4;
  background: var(--earth-light);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  opacity: 0;
  transform: translateY(28px) scale(0.96);
  transition: opacity var(--duration-slow, 400ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1)),
              transform var(--duration-slow, 400ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1)),
              box-shadow var(--duration-normal, 250ms) var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1));
}

.dest-card.dest-revealed {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dest-card:focus-visible {
  outline: 3px solid var(--forest);
  outline-offset: 2px;
}

.dest-card:hover {
  transform: translateY(-6px) scale(1);
  box-shadow: 0 16px 32px -12px rgba(0,0,0,0.2);
}

.dest-card:active {
  transform: translateY(-2px) scale(0.98);
  transition-duration: var(--duration-instant, 100ms);
}

.dest-card-image {
  position: absolute;
  inset: 0;
}

.dest-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-out-quart);
}

.dest-card:hover .dest-card-image img {
  transform: scale(1.08);
}

.dest-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
  transition: background var(--duration-normal) var(--ease-out-quart);
}

.dest-card:hover .dest-card-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
}

.dest-card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  color: white;
}

.dest-card-hint {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  opacity: 0;
  transform: translateX(8px);
  transition: all 0.25s var(--ease-out-quart);
}

.dest-card:hover .dest-card-hint {
  opacity: 1;
  transform: translateX(0);
}

.dest-number {
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 0.7rem;
  opacity: 0.7;
  letter-spacing: 0.1em;
  transition: opacity 0.3s var(--ease-out-quart);
}

.dest-card.dest-revealed .dest-number {
  animation: numberReveal 0.5s var(--ease-out-quart) 0.1s forwards;
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes numberReveal {
  to {
    opacity: 0.7;
    transform: translateY(0);
  }
}

.dest-name {
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0.25rem 0;
  letter-spacing: 0.05em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: transform 0.3s var(--ease-out-quart);
}

.dest-card.dest-revealed .dest-name {
  animation: nameReveal 0.5s var(--ease-out-quart) 0.15s forwards;
  opacity: 0;
  transform: translateY(8px);
}

@keyframes nameReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dest-location {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: opacity 0.3s var(--ease-out-quart);
}

.dest-card.dest-revealed .dest-location {
  animation: locationReveal 0.5s var(--ease-out-quart) 0.2s forwards;
  opacity: 0;
}

@keyframes locationReveal {
  to {
    opacity: 0.8;
  }
}

.dest-desc {
  font-size: 0.75rem;
  opacity: 0.9;
  line-height: 1.4;
  display: none;
}

@media (min-width: 768px) {
  .dest-desc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .dest-card {
    aspect-ratio: 4 / 5;
  }
  .dest-name {
    font-size: 1.5rem;
  }
}

@media (max-width: 479px) {
  .dest-card {
    aspect-ratio: 3 / 4;
  }
  .dest-name {
    font-size: 1.05rem;
  }
  .dest-location {
    font-size: 0.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dest-card {
    opacity: 1;
    transform: none;
  }
  .dest-card:hover {
    transform: none;
  }
}
</style>
