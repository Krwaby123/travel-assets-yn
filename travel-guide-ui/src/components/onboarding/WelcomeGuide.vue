<template>
  <Teleport to="body" v-if="shouldRender">
    <Transition name="welcome-card">
      <div
        v-if="showCard"
        class="welcome-guide-overlay"
        @click.self="handleLater"
      >
        <div class="welcome-guide-card">
          <div class="welcome-card-decoration">
            <div class="decoration-mountain"></div>
            <div class="decoration-clouds">
              <span class="cloud cloud-1">☁️</span>
              <span class="cloud cloud-2">☁️</span>
            </div>
            <div class="decoration-flower">🌸</div>
          </div>
          
          <div class="welcome-card-content">
            <h3 class="welcome-card-title">开启云南之旅</h3>
            <p class="welcome-card-desc">
              从斗南花海的芬芳，到大理洱海的浪漫<br>
              一份贴心的旅行攻略，等你探索
            </p>
            
            <div class="welcome-card-actions">
              <button class="welcome-btn later" @click="handleLater">
                <span>稍后体验</span>
              </button>
              <button class="welcome-btn start" @click="handleStart">
                <span>立即体验</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="float-button">
      <button
        v-if="showFloatingButton && !onboardingActive"
        class="floating-guide-btn"
        :class="{ 'breathing': isBreathing }"
        @click="handleFloatingClick"
        aria-label="开始新手引导"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span class="floating-btn-text">新手引导</span>
      </button>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { safeStorage } from '@/utils/storage'

const props = defineProps({
  onboardingActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['start-guide'])

const WELCOME_CARD_DISMISSED_KEY = 'yunnan_travel_welcome_card_dismissed'

const showCard = ref(false)
const showFloatingButton = ref(false)
const isBreathing = ref(false)
const shouldRender = ref(true)

let showTimer = null
let breathingTimer = null
let laterTimer1 = null
let laterTimer2 = null
let startTimer = null
let floatClickTimer = null
let mountedBreathingTimer = null

onMounted(() => {
  const cardDismissed = safeStorage.getItem(WELCOME_CARD_DISMISSED_KEY)
  
  if (cardDismissed === 'true') {
    showFloatingButton.value = true
    mountedBreathingTimer = setTimeout(() => {
      isBreathing.value = true
    }, 100)
  } else {
    showTimer = setTimeout(() => {
      showCard.value = true
    }, 5000)
  }
})

onUnmounted(() => {
  if (showTimer) clearTimeout(showTimer)
  if (breathingTimer) clearTimeout(breathingTimer)
  if (laterTimer1) clearTimeout(laterTimer1)
  if (laterTimer2) clearTimeout(laterTimer2)
  if (startTimer) clearTimeout(startTimer)
  if (floatClickTimer) clearTimeout(floatClickTimer)
  if (mountedBreathingTimer) clearTimeout(mountedBreathingTimer)
})

const markCardDismissed = () => {
  safeStorage.setItem(WELCOME_CARD_DISMISSED_KEY, 'true')
}

const handleLater = () => {
  markCardDismissed()
  showCard.value = false
  laterTimer1 = setTimeout(() => {
    showFloatingButton.value = true
    laterTimer2 = setTimeout(() => {
      isBreathing.value = true
    }, 100)
  }, 300)
}

const handleStart = () => {
  markCardDismissed()
  showCard.value = false
  shouldRender.value = false
  startTimer = setTimeout(() => {
    emit('start-guide')
  }, 300)
}

const handleFloatingClick = () => {
  isBreathing.value = false
  showFloatingButton.value = false
  shouldRender.value = false
  floatClickTimer = setTimeout(() => {
    emit('start-guide')
  }, 300)
}
</script>

<style scoped>
.welcome-guide-overlay {
  position: fixed;
  inset: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.welcome-guide-card {
  width: 100%;
  max-width: 340px;
  background: var(--card);
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  overflow: hidden;
  position: relative;
}

.welcome-card-decoration {
  height: 100px;
  background: linear-gradient(
    135deg,
    var(--sky-light) 0%,
    var(--forest-light) 50%,
    var(--sunset-soft) 100%
  );
  position: relative;
  overflow: hidden;
}

.decoration-mountain {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 80px solid transparent;
  border-right: 80px solid transparent;
  border-bottom: 50px solid var(--forest);
  opacity: 0.3;
}

.decoration-mountain::before {
  content: '';
  position: absolute;
  left: -40px;
  bottom: -50px;
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 35px solid var(--forest);
  opacity: 0.5;
}

.decoration-clouds {
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  font-size: 1.2rem;
  opacity: 0.6;
}

.cloud {
  position: absolute;
  animation: cloudFloat 8s ease-in-out infinite;
}

.cloud-1 {
  left: 15%;
  animation-delay: 0s;
}

.cloud-2 {
  right: 20%;
  animation-delay: -3s;
  font-size: 0.9rem;
}

@keyframes cloudFloat {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-5px) translateX(10px); }
}

.decoration-flower {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 1.5rem;
  animation: flowerSway 3s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes flowerSway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.welcome-card-content {
  padding: var(--space-lg);
  text-align: center;
}

.welcome-card-title {
  font-family: 'LXGW WenKai', serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  letter-spacing: 0.05em;
}

.welcome-card-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}

.welcome-card-actions {
  display: flex;
  gap: var(--space-sm);
}

.welcome-btn {
  flex: 1;
  padding: 14px 16px;
  border: none;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.25s var(--ease-out-quart);
}

.welcome-btn.later {
  background: var(--earth-light);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.welcome-btn.later:hover {
  background: var(--border);
  color: var(--text);
  transform: translateY(-2px);
}

.welcome-btn.later:active {
  transform: translateY(0) scale(0.98);
}

.welcome-btn.start {
  background: linear-gradient(135deg, var(--forest) 0%, var(--sky) 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(26, 93, 26, 0.25);
}

.welcome-btn.start:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(26, 93, 26, 0.35);
  filter: brightness(1.05);
}

.welcome-btn.start:active {
  transform: translateY(0) scale(0.98);
}

.welcome-btn.start svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s var(--ease-out-quart);
}

.welcome-btn.start:hover svg {
  transform: translateX(3px);
}

.welcome-card-enter-active {
  animation: cardEnter 0.5s var(--ease-out-quart);
}

.welcome-card-leave-active {
  animation: cardLeave 0.35s var(--ease-out-quart);
}

@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(30px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes cardLeave {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
}

.floating-guide-btn {
  position: fixed;
  bottom: 80px;
  left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px 10px 12px;
  background: linear-gradient(135deg, var(--sunset) 0%, #ff6b6b 100%);
  color: white;
  border: none;
  border-radius: 24px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 99;
  box-shadow: 0 4px 16px rgba(204, 85, 51, 0.4);
  transition: transform 0.2s var(--ease-out-quart),
              box-shadow 0.2s var(--ease-out-quart);
}

.floating-guide-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(204, 85, 51, 0.5);
}

.floating-guide-btn:active {
  transform: scale(0.98);
}

.floating-guide-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.floating-btn-text {
  white-space: nowrap;
}

.floating-guide-btn.breathing {
  animation: breathe 2.5s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    box-shadow: 0 4px 16px rgba(204, 85, 51, 0.4);
    transform: translateY(0) scale(1);
  }
  50% {
    box-shadow: 0 8px 28px rgba(204, 85, 51, 0.55);
    transform: translateY(-3px) scale(1.02);
  }
}

.float-button-enter-active {
  animation: floatButtonIn 0.6s var(--ease-out-quart);
}

.float-button-leave-active {
  animation: floatButtonOut 0.3s var(--ease-out-quart);
}

@keyframes floatButtonIn {
  0% {
    opacity: 0;
    transform: translateX(-30px) translateY(20px) scale(0.7);
  }
  70% {
    opacity: 1;
    transform: translateX(4px) translateY(-4px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
  }
}

@keyframes floatButtonOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8) translateX(-10px);
  }
}

@media (max-width: 480px) {
  .welcome-guide-card {
    max-width: 100%;
    border-radius: 20px;
  }
  
  .welcome-card-decoration {
    height: 80px;
  }
  
  .welcome-card-content {
    padding: var(--space-md);
  }
  
  .welcome-card-title {
    font-size: 1.2rem;
  }
  
  .welcome-card-desc {
    font-size: 0.85rem;
    margin-bottom: var(--space-md);
  }
  
  .welcome-btn {
    padding: 12px 14px;
    font-size: 0.9rem;
  }
  
  .floating-guide-btn {
    bottom: 24px;
    left: 12px;
    padding: 8px 14px 8px 10px;
    font-size: 0.8rem;
  }
  
  .floating-guide-btn svg {
    width: 16px;
    height: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .welcome-card-enter-active,
  .welcome-card-leave-active,
  .float-button-enter-active,
  .float-button-leave-active,
  .floating-guide-btn.breathing,
  .cloud,
  .decoration-flower {
    animation: none !important;
  }
  
  .welcome-btn,
  .floating-guide-btn {
    transition: none !important;
  }
}
</style>