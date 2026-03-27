<template>
  <div class="confetti-container"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import confetti from 'canvas-confetti'

const emit = defineEmits(['complete'])

let animationTimer = null

const colors = ['#ff0', '#f0f', '#f0f', '#f0f', '#0ff']

const fireConfetti = () => {
  const duration = 3000
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
      shapes: ['circle', 'circle', 'square']
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
      shapes: ['circle', 'circle', 'square']
    })

    if (Date.now() < end) {
      animationTimer = requestAnimationFrame(frame)
    } else {
      emit('complete')
    }
  }

  frame()
}

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    emit('complete')
    return
  }

  setTimeout(fireConfetti, 100)
})

onUnmounted(() => {
  if (animationTimer) {
    cancelAnimationFrame(animationTimer)
  }
})
</script>

<style scoped>
.confetti-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
}
</style>
