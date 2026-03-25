<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="isActive" class="onboarding-overlay" @click.self="handleOverlayClick">
        <div
          v-if="!currentStepData || currentStepData.type !== 'highlight'"
          class="overlay-backdrop"
        ></div>

        <div
          v-if="currentStepData && currentStepData.type === 'highlight'"
          class="highlight-spotlight"
          :style="spotlightStyle"
        ></div>

        <Transition name="tooltip">
          <div
            v-if="currentStepData && currentStepData.type === 'highlight' && tooltipPosition"
            class="onboarding-tooltip"
            :class="[tooltipPosition.placement]"
            :style="tooltipStyle"
          >
            <div class="tooltip-header">
              <span class="tooltip-step">{{ currentStep + 1 }}/{{ totalSteps }}</span>
              <h3 class="tooltip-title">{{ currentStepData.title }}</h3>
            </div>
            <p class="tooltip-content">{{ currentStepData.content }}</p>
            <div class="tooltip-actions">
              <button class="tooltip-btn skip" @click="skipOnboarding">跳过</button>
              <div class="tooltip-nav">
                <button
                  v-if="currentStep > 0"
                  class="tooltip-btn prev"
                  @click="prevStep"
                >
                  上一步
                </button>
                <button class="tooltip-btn next" @click="handleNext">
                  {{ isLastStep ? '完成' : '下一步' }}
                </button>
              </div>
            </div>
            <div class="tooltip-progress">
              <div
                v-for="i in totalSteps"
                :key="i"
                :class="['progress-dot', { active: i - 1 === currentStep, completed: i - 1 < currentStep }]"
              ></div>
            </div>
          </div>
        </Transition>

        <Transition name="modal">
          <div v-if="currentStepData && currentStepData.type === 'modal'" class="onboarding-modal">
            <div class="modal-content">
              <div class="modal-header">
                <span class="modal-step">{{ currentStep + 1 }}/{{ totalSteps }}</span>
                <h3 class="modal-title">{{ currentStepData.title }}</h3>
              </div>
              <p class="modal-text">{{ currentStepData.content }}</p>

              <div v-if="currentStepData.options" class="modal-options">
                <button
                  v-for="(option, index) in currentStepData.options"
                  :key="index"
                  :class="['modal-option', option.action]"
                  @click="handleOptionClick(option)"
                >
                  {{ option.label }}
                </button>
              </div>

              <div v-else class="modal-actions">
                <button class="modal-btn skip" @click="skipOnboarding">跳过</button>
                <div class="modal-nav">
                  <button
                    v-if="currentStep > 0"
                    class="modal-btn prev"
                    @click="prevStep"
                  >
                    上一步
                  </button>
                  <button class="modal-btn next" @click="handleNext">
                    {{ isLastStep ? '完成' : '下一步' }}
                  </button>
                </div>
              </div>

              <div class="modal-progress">
                <div
                  v-for="i in totalSteps"
                  :key="i"
                  :class="['progress-dot', { active: i - 1 === currentStep, completed: i - 1 < currentStep }]"
                ></div>
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="modal">
          <div v-if="currentStepData && currentStepData.type === 'tab-selection'" class="tab-selection-modal">
            <div class="tab-selection-content">
              <div class="tab-selection-header">
                <span class="tab-selection-step">{{ currentStep + 1 }}/{{ totalSteps }}</span>
                <h3 class="tab-selection-title">{{ currentStepData.title }}</h3>
              </div>
              <p class="tab-selection-desc">{{ currentStepData.content }}</p>

              <div class="tab-selection-grid">
                <button
                  v-for="tab in allTabs"
                  :key="tab.id"
                  :class="['tab-option', { selected: selectedTabs.has(tab.id) }]"
                  @click="toggleTab(tab.id)"
                >
                  <span class="tab-option-label">{{ tab.label }}</span>
                  <span class="tab-option-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  </span>
                </button>
              </div>

              <div class="tab-selection-actions">
                <button class="tab-action-btn select-all" @click="selectAllTabs">全选</button>
                <button class="tab-action-btn clear-all" @click="clearAllTabs">清空</button>
              </div>

              <div class="tab-selection-footer">
                <button class="tab-selection-btn skip" @click="skipOnboarding">跳过</button>
                <button
                  class="tab-selection-btn next"
                  :disabled="selectedTabs.size === 0"
                  @click="handleNext"
                >
                  下一步
                </button>
              </div>

              <div class="tab-selection-progress">
                <div
                  v-for="i in totalSteps"
                  :key="i"
                  :class="['progress-dot', { active: i - 1 === currentStep, completed: i - 1 < currentStep }]"
                ></div>
              </div>
            </div>
          </div>
        </Transition>

        <ConfettiEffect v-if="showConfetti" @complete="showConfetti = false" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { onboardingSteps } from './onboarding-steps'
import ConfettiEffect from './ConfettiEffect.vue'

const props = defineProps({
  isActive: Boolean,
  currentStep: Number,
  totalSteps: Number,
  selectedTabs: Set,
  allTabs: Array,
  settingsVisible: Boolean
})

const emit = defineEmits([
  'next',
  'prev',
  'skip',
  'complete',
  'toggle-tab',
  'select-all',
  'clear-all',
  'open-settings',
  'close-settings',
  'go-to-map',
  'go-to-home'
])

const spotlightStyle = ref({})
const tooltipPosition = ref(null)
const tooltipStyle = ref({})
const showConfetti = ref(false)
const isAnimatingAction = ref(false)

const currentStepData = computed(() => {
  return onboardingSteps[props.currentStep]
})

const isLastStep = computed(() => {
  return props.currentStep === props.totalSteps - 1
})

let scrollAnimationId = null
let scrollTargetElement = null

const scrollToElement = (element) => {
  const settingsPanel = element.closest('.settings-panel')

  if (scrollAnimationId) {
    cancelAnimationFrame(scrollAnimationId)
    scrollAnimationId = null
  }

  scrollTargetElement = element

  if (settingsPanel) {
    const panelRect = settingsPanel.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    const offsetY = 120

    if (elementRect.top < panelRect.top + offsetY) {
      settingsPanel.scrollBy({
        top: elementRect.top - panelRect.top - offsetY,
        behavior: 'smooth'
      })
      return true
    } else if (elementRect.bottom > panelRect.bottom - offsetY) {
      settingsPanel.scrollBy({
        top: elementRect.bottom - panelRect.bottom + offsetY,
        behavior: 'smooth'
      })
      return true
    }
    return false
  }

  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const offsetY = 150

  if (rect.top < offsetY || rect.bottom > viewportHeight - offsetY) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return true
  }

  return false
}

const trackElementDuringScroll = (element, container = null) => {
  const updatePosition = () => {
    if (!element || !document.body.contains(element)) {
      scrollAnimationId = null
      return
    }

    const rect = element.getBoundingClientRect()
    const padding = 12

    spotlightStyle.value = {
      left: `${rect.left - padding}px`,
      top: `${rect.top - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`
    }

    updateTooltipPosition(rect)

    scrollAnimationId = requestAnimationFrame(updatePosition)
  }

  scrollAnimationId = requestAnimationFrame(updatePosition)
}

const stopTrackingScroll = () => {
  if (scrollAnimationId) {
    cancelAnimationFrame(scrollAnimationId)
    scrollAnimationId = null
  }
}

const updateSpotlight = async () => {
  if (!currentStepData.value || currentStepData.value.type !== 'highlight') {
    spotlightStyle.value = {}
    tooltipPosition.value = null
    stopTrackingScroll()
    return
  }

  await nextTick()

  const target = currentStepData.value.target
  if (!target) return

  const element = document.querySelector(target)
  if (!element) {
    if (currentStepData.value.skipIfMissing) {
      emit('next')
      return
    }
    return
  }

  const needsScroll = scrollToElement(element)

  if (needsScroll) {
    trackElementDuringScroll(element)

    setTimeout(() => {
      stopTrackingScroll()
    }, 600)
  } else {
    stopTrackingScroll()
    const rect = element.getBoundingClientRect()
    const padding = 12

    spotlightStyle.value = {
      left: `${rect.left - padding}px`,
      top: `${rect.top - padding}px`,
      width: `${rect.width + padding * 2}px`,
      height: `${rect.height + padding * 2}px`
    }

    updateTooltipPosition(rect)
  }
}

const updateTooltipPosition = (targetRect) => {
  const tooltipWidth = 320
  const tooltipHeight = 180
  const gap = 16
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let placement = 'bottom'
  let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
  let top = targetRect.bottom + gap

  if (top + tooltipHeight > viewportHeight - 20) {
    placement = 'top'
    top = targetRect.top - tooltipHeight - gap
  }

  if (left < 20) {
    left = 20
  }
  if (left + tooltipWidth > viewportWidth - 20) {
    left = viewportWidth - tooltipWidth - 20
  }

  if (placement === 'left' || placement === 'right') {
    left = placement === 'right' ? targetRect.right + gap : targetRect.left - tooltipWidth - gap
    top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
  }

  tooltipPosition.value = { placement }
  tooltipStyle.value = {
    left: `${left}px`,
    top: `${top}px`
  }
}

const handleNext = () => {
  if (isAnimatingAction.value) return

  const step = currentStepData.value

  if (step?.action === 'openSettings') {
    isAnimatingAction.value = true
    const settingsBtn = document.querySelector('.settings-toggle')
    if (settingsBtn) {
      settingsBtn.classList.add('onboarding-click-effect')
      setTimeout(() => {
        settingsBtn.classList.remove('onboarding-click-effect')
        emit('next')
        isAnimatingAction.value = false
      }, 300)
    } else {
      emit('next')
      isAnimatingAction.value = false
    }
    return
  }

  if (step?.action === 'goToMap') {
    isAnimatingAction.value = true
    const mapTab = document.querySelector('.nav-tab:last-child')
    if (mapTab) {
      mapTab.classList.add('onboarding-click-effect')
      setTimeout(() => {
        mapTab.classList.remove('onboarding-click-effect')
        emit('next')
        isAnimatingAction.value = false
      }, 300)
    } else {
      emit('next')
      isAnimatingAction.value = false
    }
    return
  }

  if (isLastStep.value) {
    showConfetti.value = true
    setTimeout(() => {
      emit('complete')
    }, 1500)
  } else {
    emit('next')
  }
}

const handleOptionClick = (option) => {
  if (option.action === 'complete') {
    showConfetti.value = true
    setTimeout(() => {
      emit('complete')
    }, 1500)
  } else if (option.action === 'next') {
    emit('next')
  }
}

const handleOverlayClick = () => {
}

const skipOnboarding = () => {
  emit('skip')
}

const prevStep = () => {
  emit('prev')
}

const toggleTab = (tabId) => {
  emit('toggle-tab', tabId)
}

const selectAllTabs = () => {
  emit('select-all')
}

const clearAllTabs = () => {
  emit('clear-all')
}

const handleStepChange = (newStep, oldStep) => {
  if (oldStep === undefined) return

  const SETTINGS_STEPS = [5, 6, 7, 8, 9]
  const MAP_STEPS = [11, 12, 13, 14]

  const wasInSettings = SETTINGS_STEPS.includes(oldStep)
  const isInSettings = SETTINGS_STEPS.includes(newStep)

  const wasInMap = MAP_STEPS.includes(oldStep)
  const isInMap = MAP_STEPS.includes(newStep)

  if (isInSettings && !props.settingsVisible) {
    emit('open-settings')
  } else if (!isInSettings && wasInSettings && props.settingsVisible) {
    emit('close-settings')
  }

  if (isInMap && !wasInMap) {
    emit('go-to-map')
  } else if (!isInMap && wasInMap) {
    emit('go-to-home')
  }
}

watch(() => props.currentStep, (newStep, oldStep) => {
  handleStepChange(newStep, oldStep)

  const SETTINGS_STEPS = [5, 6, 7, 8, 9]
  const MAP_STEPS = [11, 12, 13, 14]

  const isInSettings = SETTINGS_STEPS.includes(newStep)
  const isInMap = MAP_STEPS.includes(newStep)

  if (isInSettings) {
    setTimeout(() => {
      nextTick(() => {
        updateSpotlight()
      })
    }, 500)
  } else if (isInMap) {
    setTimeout(() => {
      nextTick(() => {
        updateSpotlight()
      })
    }, 700)
  } else {
    nextTick(() => {
      setTimeout(() => {
        updateSpotlight()
      }, 100)
    })
  }
}, { immediate: true })

watch(() => props.isActive, (active) => {
  if (active) {
    nextTick(() => {
      setTimeout(() => {
        updateSpotlight()
      }, 100)
    })
  }
})

watch(() => props.settingsVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      nextTick(() => {
        updateSpotlight()
      })
    }, 450)
  }
})

const handleResize = () => {
  updateSpotlight()
}

const handleScroll = () => {
  updateSpotlight()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleScroll, true)
  stopTrackingScroll()
})
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: auto;
}

.overlay-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  transition: background 0.4s var(--ease-out-quart);
}

.highlight-spotlight {
  position: absolute;
  background: transparent;
  border-radius: 16px;
  box-shadow:
    0 0 0 9999px rgba(0, 0, 0, 0.8),
    inset 0 0 0 2px rgba(34, 139, 34, 0.6),
    0 0 0 4px rgba(255, 255, 255, 0.95),
    0 0 30px 4px rgba(34, 139, 34, 0.5),
    0 0 60px 8px rgba(34, 139, 34, 0.25);
  transition: left 0.45s var(--ease-out-quart),
              top 0.45s var(--ease-out-quart),
              width 0.45s var(--ease-out-quart),
              height 0.45s var(--ease-out-quart);
  pointer-events: none;
  z-index: 1;
  animation: spotlightPulse 2s ease-in-out infinite;
}

@keyframes spotlightPulse {
  0%, 100% {
    box-shadow:
      0 0 0 9999px rgba(0, 0, 0, 0.8),
      inset 0 0 0 2px rgba(34, 139, 34, 0.6),
      0 0 0 4px rgba(255, 255, 255, 0.95),
      0 0 30px 4px rgba(34, 139, 34, 0.5),
      0 0 60px 8px rgba(34, 139, 34, 0.25);
  }
  50% {
    box-shadow:
      0 0 0 9999px rgba(0, 0, 0, 0.8),
      inset 0 0 0 2px rgba(34, 139, 34, 0.8),
      0 0 0 4px rgba(255, 255, 255, 1),
      0 0 40px 6px rgba(34, 139, 34, 0.6),
      0 0 80px 12px rgba(34, 139, 34, 0.3);
  }
}

.onboarding-tooltip {
  position: absolute;
  width: 320px;
  max-width: calc(100vw - 40px);
  background: var(--card);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 2;
  pointer-events: auto;
  transition: left 0.45s var(--ease-out-quart),
              top 0.45s var(--ease-out-quart),
              opacity 0.3s var(--ease-out-quart);
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.tooltip-step {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--earth-light);
  padding: 2px 8px;
  border-radius: 10px;
}

.tooltip-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--forest);
}

.tooltip-content {
  font-size: 0.875rem;
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 16px;
}

.tooltip-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.tooltip-nav {
  display: flex;
  gap: 8px;
}

.tooltip-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tooltip-btn.skip {
  background: transparent;
  color: var(--text-muted);
}

.tooltip-btn.skip:hover {
  color: var(--text);
}

.tooltip-btn.prev {
  background: var(--earth-light);
  color: var(--text);
}

.tooltip-btn.prev:hover {
  background: var(--border);
}

.tooltip-btn.next {
  background: var(--forest);
  color: white;
}

.tooltip-btn.next:hover {
  filter: brightness(1.1);
}

.tooltip-progress {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
}

.progress-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border);
  transition: all 0.3s ease;
}

.progress-dot.active {
  background: var(--forest);
  transform: scale(1.2);
}

.progress-dot.completed {
  background: var(--forest-light);
}

.onboarding-modal {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 2;
  pointer-events: auto;
}

.modal-content {
  width: 100%;
  max-width: 360px;
  background: var(--card);
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  padding: 24px;
  text-align: center;
}

.modal-header {
  margin-bottom: 12px;
}

.modal-step {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--earth-light);
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 8px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--forest);
}

.modal-text {
  font-size: 0.9rem;
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 24px;
}

.modal-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-option {
  padding: 14px 20px;
  border: 2px solid var(--border);
  border-radius: 12px;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-option:hover {
  border-color: var(--forest);
  background: var(--forest-light);
}

.modal-option.complete {
  border-color: var(--sunset);
  color: var(--sunset);
}

.modal-option.complete:hover {
  background: var(--sunset-soft);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.modal-nav {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.modal-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.skip {
  background: transparent;
  color: var(--text-muted);
}

.modal-btn.skip:hover {
  color: var(--text);
}

.modal-btn.prev {
  background: var(--earth-light);
  color: var(--text);
}

.modal-btn.prev:hover {
  background: var(--border);
}

.modal-btn.next {
  background: var(--forest);
  color: white;
}

.modal-btn.next:hover {
  filter: brightness(1.1);
}

.modal-progress {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
}

.tab-selection-modal {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 2;
  pointer-events: auto;
}

.tab-selection-content {
  width: 100%;
  max-width: 400px;
  background: var(--card);
  border-radius: 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
  padding: 24px;
}

.tab-selection-header {
  text-align: center;
  margin-bottom: 16px;
}

.tab-selection-step {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--earth-light);
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 8px;
}

.tab-selection-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--forest);
}

.tab-selection-desc {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.tab-selection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.tab-option {
  position: relative;
  padding: 16px;
  border: 2px solid var(--border);
  border-radius: 12px;
  background: var(--earth-light);
  cursor: pointer;
  transition: all 0.25s var(--ease-out-quart);
  overflow: hidden;
}

.tab-option:hover {
  border-color: var(--forest);
}

.tab-option.selected {
  border-color: var(--forest);
  background: var(--forest-light);
}

.tab-option-label {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text);
}

.tab-option-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s var(--ease-out-quart);
}

.tab-option-check svg {
  width: 12px;
  height: 12px;
  color: white;
  opacity: 0;
  transform: scale(0);
  transition: all 0.25s var(--ease-out-quart);
}

.tab-option.selected .tab-option-check {
  background: var(--forest);
}

.tab-option.selected .tab-option-check svg {
  opacity: 1;
  transform: scale(1);
}

.tab-selection-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.tab-action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
  background: var(--earth-light);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-action-btn:hover {
  background: var(--border);
  color: var(--text);
}

.tab-selection-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.tab-selection-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-selection-btn.skip {
  background: var(--earth-light);
  color: var(--text-muted);
}

.tab-selection-btn.skip:hover {
  background: var(--border);
  color: var(--text);
}

.tab-selection-btn.next {
  background: var(--forest);
  color: white;
}

.tab-selection-btn.next:hover:not(:disabled) {
  filter: brightness(1.1);
}

.tab-selection-btn.next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-selection-progress {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 16px;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.4s var(--ease-out-quart);
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.35s var(--ease-out-quart);
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.35s var(--ease-out-quart);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

:global(.onboarding-click-effect) {
  animation: onboardingClickPulse 0.4s ease-out !important;
}

@keyframes onboardingClickPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 139, 34, 0.7);
  }
  50% {
    transform: scale(0.95);
    box-shadow: 0 0 0 20px rgba(34, 139, 34, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 139, 34, 0);
  }
}
</style>
