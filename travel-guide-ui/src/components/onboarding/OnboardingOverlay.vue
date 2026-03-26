<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="isActive"
        class="onboarding-overlay"
        @click.self="handleOverlayClick"
      >
        <div
          v-if="!currentStepData || currentStepData.type !== 'highlight'"
          class="overlay-backdrop"
        ></div>

        <div
          v-if="currentStepData && currentStepData.type === 'highlight' && !hideSpotlight"
          class="highlight-spotlight"
          :style="spotlightStyle"
        >
          <Transition name="hint">
            <div v-if="simpleHint" class="spotlight-simple-hint">
              {{ simpleHint }}
            </div>
          </Transition>
        </div>

        <Transition name="tooltip">
          <div
            v-if="currentStepData && currentStepData.type === 'highlight' && tooltipPosition && !hideSpotlight && !simpleHint"
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
                  :disabled="isAnimatingAction"
                >
                  上一步
                </button>
                <button
                  class="tooltip-btn next"
                  :class="{ 'is-demoing': isAnimatingAction }"
                  @click="handleNext"
                  :disabled="isAnimatingAction"
                >
                  <template v-if="isAnimatingAction">
                    <svg class="demo-gear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                    </svg>
                    <span>演示中</span>
                  </template>
                  <template v-else>
                    {{ isLastStep ? '完成' : '下一步' }}
                  </template>
                </button>
              </div>
            </div>
            <div class="tooltip-hint">
              <svg class="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span>跟随引导，轻松上手</span>
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
                  :disabled="isAnimatingAction"
                >
                  {{ option.label }}
                </button>
              </div>

              <div v-else class="modal-actions">
                <button class="modal-btn skip" @click="skipOnboarding" :disabled="isAnimatingAction">跳过</button>
                <div class="modal-nav">
                  <button
                    v-if="currentStep > 0"
                    class="modal-btn prev"
                    @click="prevStep"
                    :disabled="isAnimatingAction"
                  >
                    上一步
                  </button>
                  <button
                    class="modal-btn next"
                    :class="{ 'is-demoing': isAnimatingAction }"
                    @click="handleNext"
                    :disabled="isAnimatingAction"
                  >
                    <template v-if="isAnimatingAction">
                      <svg class="demo-gear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                      </svg>
                      <span>演示中</span>
                    </template>
                    <template v-else>
                      {{ isLastStep ? '完成' : '下一步' }}
                    </template>
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
  'go-to-home',
  'set-theme',
  'set-font-size',
  'trigger-global-nav',
  'expand-section',
  'auto-search'
])

const spotlightStyle = ref({})
const tooltipPosition = ref(null)
const tooltipStyle = ref({})
const showConfetti = ref(false)
const isAnimatingAction = ref(false)
const hideSpotlight = ref(false)
const simpleHint = ref(null)

const currentStepData = computed(() => {
  return onboardingSteps[props.currentStep]
})

const hideSpotlightAndTooltip = () => {
  hideSpotlight.value = true
  spotlightStyle.value = {}
}

const showSpotlightWithSimpleHint = (rect, hint) => {
  hideSpotlight.value = false
  spotlightStyle.value = {
    left: `${rect.left - 8}px`,
    top: `${rect.top - 8}px`,
    width: `${rect.width + 16}px`,
    height: `${rect.height + 16}px`
  }
  simpleHint.value = hint
}

const clearSimpleHint = () => {
  simpleHint.value = null
}

const isLastStep = computed(() => {
  return props.currentStep === props.totalSteps - 1
})

let scrollAnimationId = null

const scrollToElement = (element) => {
  const settingsPanel = element.closest('.settings-panel')

  if (scrollAnimationId) {
    cancelAnimationFrame(scrollAnimationId)
    scrollAnimationId = null
  }

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
  if (!props.isActive) return

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

const handleNext = async () => {
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
    const menuBtn = document.querySelector('.hero-menu-btn')
    if (menuBtn) {
      menuBtn.classList.add('onboarding-click-effect')
      setTimeout(() => {
        menuBtn.classList.remove('onboarding-click-effect')
        emit('next')
        isAnimatingAction.value = false
      }, 300)
    } else {
      emit('next')
      isAnimatingAction.value = false
    }
    return
  }

  const autoDemoSteps = {
    5: autoClickGlobalNav,
    7: autoToggleTheme,
    8: autoChangeFontSize,
    9: autoExpandHiddenContent,
    12: autoSearchPlace
  }

  const demoFn = autoDemoSteps[props.currentStep]
  if (demoFn) {
    await demoFn()
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
  if (isAnimatingAction.value) return

  isAnimatingAction.value = true

  if (option.action === 'complete') {
    showConfetti.value = true
    setTimeout(() => {
      emit('complete')
      isAnimatingAction.value = false
    }, 1500)
  } else if (option.action === 'next') {
    emit('next')
    isAnimatingAction.value = false
  }
}

const animateTyping = (inputElement, text, callback, speed = 80) => {
  if (!inputElement) {
    callback?.()
    return
  }

  let index = 0
  inputElement.value = ''
  inputElement.focus()

  const typeChar = () => {
    if (index < text.length) {
      inputElement.value += text[index]
      inputElement.dispatchEvent(new Event('input', { bubbles: true }))
      index++
      setTimeout(typeChar, speed)
    } else {
      callback?.()
    }
  }

  typeChar()
}

const autoClickGlobalNav = async () => {
  isAnimatingAction.value = true

  const menuBtn = document.querySelector('.hero-menu-btn')
  if (!menuBtn) {
    emit('next')
    isAnimatingAction.value = false
    return
  }

  menuBtn.classList.add('onboarding-click-effect')
  await new Promise(resolve => setTimeout(resolve, 300))
  menuBtn.classList.remove('onboarding-click-effect')

  menuBtn.click()

  await new Promise(resolve => setTimeout(resolve, 400))

  const jumpPanel = document.querySelector('.jump-panel')
  if (jumpPanel) {
    spotlightStyle.value = {
      left: `${jumpPanel.getBoundingClientRect().left - 12}px`,
      top: `${jumpPanel.getBoundingClientRect().top - 12}px`,
      width: `${jumpPanel.offsetWidth + 24}px`,
      height: `${jumpPanel.offsetHeight + 24}px`
    }

    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  const closeBtn = document.querySelector('.jump-panel-close')
  if (closeBtn) {
    closeBtn.click()
  }

  await new Promise(resolve => setTimeout(resolve, 300))

  emit('next')
  isAnimatingAction.value = false
}

const autoToggleTheme = async () => {
  isAnimatingAction.value = true

  const darkBtn = document.querySelector('.theme-option:nth-child(2)')
  if (darkBtn) {
    darkBtn.classList.add('onboarding-click-effect')
    await new Promise(resolve => setTimeout(resolve, 300))
    darkBtn.classList.remove('onboarding-click-effect')

    emit('set-theme', 'dark')

    emit('close-settings')

    await new Promise(resolve => setTimeout(resolve, 400))

    hideSpotlightAndTooltip()

    await new Promise(resolve => setTimeout(resolve, 2000))

    emit('open-settings')

    await new Promise(resolve => setTimeout(resolve, 400))

    const lightBtn = document.querySelector('.theme-option:nth-child(1)')
    if (lightBtn) {
      lightBtn.classList.add('onboarding-click-effect')
      await new Promise(resolve => setTimeout(resolve, 300))
      lightBtn.classList.remove('onboarding-click-effect')

      emit('set-theme', 'light')
    }

    await new Promise(resolve => setTimeout(resolve, 300))
  }

  hideSpotlight.value = false
  emit('next')
  isAnimatingAction.value = false
}

const autoChangeFontSize = async () => {
  isAnimatingAction.value = true

  emit('close-settings')
  await new Promise(resolve => setTimeout(resolve, 400))

  hideSpotlightAndTooltip()

  const menuBtn = document.querySelector('.hero-menu-btn')
  if (!menuBtn) {
    emit('next')
    isAnimatingAction.value = false
    return
  }

  menuBtn.classList.add('onboarding-click-effect')
  await new Promise(resolve => setTimeout(resolve, 300))
  menuBtn.classList.remove('onboarding-click-effect')
  menuBtn.click()

  await new Promise(resolve => setTimeout(resolve, 600))

  const jumpBtns = document.querySelectorAll('.jump-panel-overlay .jump-section-btn')
  const dounanBtn = [...jumpBtns].find(btn => btn.textContent.includes('斗南花市'))
  if (dounanBtn) {
    dounanBtn.classList.add('onboarding-click-effect')
    await new Promise(resolve => setTimeout(resolve, 300))
    dounanBtn.classList.remove('onboarding-click-effect')
    dounanBtn.click()
  }

  await new Promise(resolve => setTimeout(resolve, 1500))

  const venueNavBtns = document.querySelectorAll('.dounan-section .quick-nav-btn')
  const venueNavBtn = [...venueNavBtns].find(btn => btn.textContent.includes('场馆详解') || btn.textContent.includes('场馆'))
  if (venueNavBtn) {
    venueNavBtn.classList.add('onboarding-click-effect')
    await new Promise(resolve => setTimeout(resolve, 300))
    venueNavBtn.classList.remove('onboarding-click-effect')
    venueNavBtn.click()
  }

  await new Promise(resolve => setTimeout(resolve, 800))

  const venueSection = document.querySelector('#kunming-guide-area-venue')
  if (venueSection) {
    venueSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    await new Promise(resolve => setTimeout(resolve, 600))

    const rect = venueSection.getBoundingClientRect()
    showSpotlightWithSimpleHint(rect, '中号字体')
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  emit('open-settings')
  await new Promise(resolve => setTimeout(resolve, 500))

  const largeBtn = document.querySelector('.font-option:nth-child(3)')
  if (largeBtn) {
    largeBtn.classList.add('onboarding-click-effect')
    await new Promise(resolve => setTimeout(resolve, 300))
    largeBtn.classList.remove('onboarding-click-effect')
    emit('set-font-size', 'large')
  }

  emit('close-settings')
  await new Promise(resolve => setTimeout(resolve, 400))

  if (venueSection) {
    const rect = venueSection.getBoundingClientRect()
    showSpotlightWithSimpleHint(rect, '大号字体')
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  clearSimpleHint()
  hideSpotlightAndTooltip()
  emit('next')
  isAnimatingAction.value = false
}

const autoExpandHiddenContent = async () => {
  isAnimatingAction.value = true

  emit('close-settings')
  await new Promise(resolve => setTimeout(resolve, 500))

  hideSpotlightAndTooltip()

  const menuBtn = document.querySelector('.hero-menu-btn')
  if (menuBtn) {
    menuBtn.classList.add('onboarding-click-effect')
    await new Promise(resolve => setTimeout(resolve, 300))
    menuBtn.classList.remove('onboarding-click-effect')
    menuBtn.click()

    await new Promise(resolve => setTimeout(resolve, 600))

    const jumpBtns = document.querySelectorAll('.jump-panel-overlay .jump-section-btn')
    const dounanBtn = [...jumpBtns].find(btn => btn.textContent.includes('斗南花市'))
    if (dounanBtn) {
      dounanBtn.classList.add('onboarding-click-effect')
      await new Promise(resolve => setTimeout(resolve, 300))
      dounanBtn.classList.remove('onboarding-click-effect')
      dounanBtn.click()
    }

    await new Promise(resolve => setTimeout(resolve, 1200))

    const venueNavBtns = document.querySelectorAll('.dounan-section .quick-nav-btn')
    const venueNavBtn = [...venueNavBtns].find(btn => btn.textContent.includes('场馆详解') || btn.textContent.includes('场馆'))
    if (venueNavBtn) {
      venueNavBtn.classList.add('onboarding-click-effect')
      await new Promise(resolve => setTimeout(resolve, 300))
      venueNavBtn.classList.remove('onboarding-click-effect')
      venueNavBtn.click()
    }

    await new Promise(resolve => setTimeout(resolve, 800))

    const venueSection = document.querySelector('#kunming-guide-area-venue')
    if (venueSection) {
      venueSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
      await new Promise(resolve => setTimeout(resolve, 600))

      const rect = venueSection.getBoundingClientRect()
      spotlightStyle.value = {
        left: `${rect.left - 8}px`,
        top: `${rect.top - 8}px`,
        width: `${rect.width + 16}px`,
        height: `${rect.height + 16}px`
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      const closeBtn = venueSection.querySelector('.card-close-btn')
      if (closeBtn) {
        closeBtn.classList.add('onboarding-click-effect')
        await new Promise(resolve => setTimeout(resolve, 300))
        closeBtn.classList.remove('onboarding-click-effect')
        closeBtn.click()
      }

      await new Promise(resolve => setTimeout(resolve, 800))

      const toast = document.querySelector('.toast-message')
      if (toast) {
        const rect = toast.getBoundingClientRect()
        spotlightStyle.value = {
          left: `${rect.left - 8}px`,
          top: `${rect.top - 8}px`,
          width: `${rect.width + 16}px`,
          height: `${rect.height + 16}px`
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1500))

      emit('open-settings')
      await new Promise(resolve => setTimeout(resolve, 800))

      const manageBtn = document.querySelector('.manage-hidden-btn')
      if (manageBtn) {
        manageBtn.classList.add('onboarding-click-effect')
        await new Promise(resolve => setTimeout(resolve, 400))
        manageBtn.classList.remove('onboarding-click-effect')
        manageBtn.click()
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      const restoreBtn = document.querySelector('.hidden-modal-item:has([data-card-id="dounan-venue"]) .hidden-modal-item-restore') ||
                        document.querySelector('.hidden-modal-item:first-child .hidden-modal-item-restore')
      if (restoreBtn) {
        restoreBtn.classList.add('onboarding-click-effect')
        await new Promise(resolve => setTimeout(resolve, 400))
        restoreBtn.classList.remove('onboarding-click-effect')
        restoreBtn.click()
      }

      await new Promise(resolve => setTimeout(resolve, 1200))

      const closeHiddenModal = document.querySelector('.hidden-modal-close')
      if (closeHiddenModal) {
        closeHiddenModal.classList.add('onboarding-click-effect')
        await new Promise(resolve => setTimeout(resolve, 400))
        closeHiddenModal.classList.remove('onboarding-click-effect')
        closeHiddenModal.click()
      }

      await new Promise(resolve => setTimeout(resolve, 800))

      emit('close-settings')
      await new Promise(resolve => setTimeout(resolve, 600))

      venueSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
      await new Promise(resolve => setTimeout(resolve, 800))

      const newRect = venueSection.getBoundingClientRect()
      spotlightStyle.value = {
        left: `${newRect.left - 8}px`,
        top: `${newRect.top - 8}px`,
        width: `${newRect.width + 16}px`,
        height: `${newRect.height + 16}px`
      }

      hideSpotlight.value = false
    }
  }

  emit('next')
  isAnimatingAction.value = false
}

const autoSearchPlace = async () => {
  isAnimatingAction.value = true

  const searchInput = document.querySelector('.map-search-input')
  const searchBtn = document.querySelector('.map-search-btn')

  if (!searchInput || !searchBtn) {
    emit('next')
    isAnimatingAction.value = false
    return
  }

  await new Promise(resolve => setTimeout(resolve, 500))

  await new Promise(resolve => {
    animateTyping(searchInput, '斗南花市', resolve, 120)
  })

  await new Promise(resolve => setTimeout(resolve, 400))

  searchBtn.classList.add('onboarding-click-effect')
  await new Promise(resolve => setTimeout(resolve, 300))
  searchBtn.classList.remove('onboarding-click-effect')

  searchBtn.click()

  await new Promise(resolve => setTimeout(resolve, 1200))

  const firstResult = document.querySelector('.map-result-item')
  if (firstResult) {
    firstResult.classList.add('onboarding-click-effect')
    await new Promise(resolve => setTimeout(resolve, 300))
    firstResult.classList.remove('onboarding-click-effect')

    firstResult.click()
  }

  await new Promise(resolve => setTimeout(resolve, 500))

  emit('next')
  isAnimatingAction.value = false
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

  hideSpotlight.value = false
  simpleHint.value = null

  const SETTINGS_STEPS = [7, 8, 9]
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

  const SETTINGS_STEPS = [7, 8, 9]
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
  if (!active) {
    stopTrackingScroll()
    spotlightStyle.value = {}
    tooltipPosition.value = null
    isAnimatingAction.value = false
    showConfetti.value = false
    hideSpotlight.value = false
    simpleHint.value = null
    return
  }

  isAnimatingAction.value = false
  showConfetti.value = false
  hideSpotlight.value = false
  simpleHint.value = null
  nextTick(() => {
    setTimeout(() => {
      updateSpotlight()
    }, 100)
  })
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
  if (!props.isActive) return
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

.spotlight-simple-hint {
  position: absolute;
  top: -48px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(34, 139, 34, 0.95);
  color: white;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 3;
}

.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.3s var(--ease-out-quart), transform 0.3s var(--ease-out-quart);
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
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

.tooltip-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  padding: 6px 12px;
  background: var(--earth-light);
  border-radius: 20px;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 500;
}

.hint-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0.7;
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
  display: flex;
  align-items: center;
  gap: 6px;
}

.tooltip-btn.next:hover:not(:disabled) {
  filter: brightness(1.1);
}

.tooltip-btn.next:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.tooltip-btn.next.is-demoing {
  background: var(--earth);
  color: var(--text-muted);
}

.demo-gear-icon {
  width: 16px;
  height: 16px;
  animation: gearSpin 1.5s linear infinite;
}

@keyframes gearSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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

.modal-option:hover:not(:disabled) {
  border-color: var(--forest);
  background: var(--forest-light);
}

.modal-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-option.next {
  background: var(--forest);
  border-color: var(--forest);
  color: white;
}

.modal-option.next:hover:not(:disabled) {
  filter: brightness(1.1);
}

.modal-option.complete {
  background: transparent;
  border-color: var(--border);
  color: var(--text-muted);
}

.modal-option.complete:hover:not(:disabled) {
  border-color: var(--text-muted);
  background: var(--earth-light);
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
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-btn.next:hover:not(:disabled) {
  filter: brightness(1.1);
}

.modal-btn.next:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.modal-btn.next.is-demoing {
  background: var(--earth);
  color: var(--text-muted);
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

:global(.onboarding-typing-cursor) {
  position: relative;
}

:global(.onboarding-typing-cursor::after) {
  content: '|';
  animation: blink 0.8s infinite;
  color: var(--forest);
  font-weight: 300;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

:global(.onboarding-highlight-pulse) {
  animation: highlightPulse 1.5s ease-in-out infinite;
}

@keyframes highlightPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(34, 139, 34, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(34, 139, 34, 0);
  }
}

@media (max-width: 480px) {
  .onboarding-tooltip {
    width: calc(100vw - 32px);
    max-width: calc(100vw - 32px);
    left: 16px !important;
    right: 16px !important;
    padding: 16px;
  }

  .onboarding-modal {
    padding: 12px;
  }

  .modal-content {
    max-width: 100%;
    padding: 20px;
  }

  .tooltip-title {
    font-size: 0.95rem;
  }

  .tooltip-content {
    font-size: 0.8rem;
  }

  .tooltip-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .highlight-spotlight,
  .onboarding-tooltip,
  .onboarding-modal,
  .tab-option,
  .tab-option-check,
  .tab-option-check svg,
  .tooltip-btn,
  .modal-btn,
  .tab-selection-btn {
    transition: none !important;
    animation: none !important;
  }

  .overlay-enter-active,
  .overlay-leave-active,
  .tooltip-enter-active,
  .tooltip-leave-active,
  .modal-enter-active,
  .modal-leave-active {
    transition-duration: 0.01ms !important;
  }

  :global(.onboarding-click-effect) {
    animation: none !important;
  }
}
</style>
