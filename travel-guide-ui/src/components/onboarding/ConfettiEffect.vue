<template>
  <canvas ref="canvas" class="confetti-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['complete'])

const canvas = ref(null)
let animationId = null
let particles = []
let startTime = 0

const colors = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#95E1D3',
  '#F38181',
  '#AA96DA',
  '#FCBAD3',
  '#A8D8EA'
]

class Particle {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.vx = (Math.random() - 0.5) * 20
    this.vy = Math.random() * -18 - 8
    this.gravity = 0.4
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 15
    this.size = Math.random() * 8 + 4
    this.opacity = 1
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle'
  }

  update () {
    this.x += this.vx
    this.y += this.vy
    this.vy += this.gravity
    this.rotation += this.rotationSpeed
    this.vx *= 0.99
    this.opacity -= 0.008
  }

  draw (ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.globalAlpha = Math.max(0, this.opacity)
    ctx.fillStyle = this.color

    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2)
    } else {
      ctx.beginPath()
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}

const createParticles = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  const leftX = width * 0.2
  const rightX = width * 0.8

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      particles.push(new Particle(leftX + Math.random() * 50, height + 10))
      particles.push(new Particle(rightX + Math.random() * 50, height + 10))
    }, i * 20)
  }
}

const animate = (ctx) => {
  const width = canvas.value.width
  const height = canvas.value.height

  ctx.clearRect(0, 0, width, height)

  particles = particles.filter(p => p.opacity > 0 && p.y < height + 100)

  particles.forEach(particle => {
    particle.update()
    particle.draw(ctx)
  })

  if (particles.length > 0 || Date.now() - startTime < 3000) {
    animationId = requestAnimationFrame(() => animate(ctx))
  } else {
    emit('complete')
  }
}

onMounted(() => {
  if (!canvas.value) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    emit('complete')
    return
  }

  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight

  const ctx = canvas.value.getContext('2d')
  startTime = Date.now()

  createParticles()
  animate(ctx)

  const handleResize = () => {
    if (canvas.value) {
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
    }
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.confetti-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1001;
}
</style>
