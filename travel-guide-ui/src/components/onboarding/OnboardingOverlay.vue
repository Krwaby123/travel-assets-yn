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
            <div v-if="simpleHint" class="spotlight-simple-hint" :class="simpleHintPosition">
              {{ simpleHint }}
            </div>
          </Transition>
        </div>

        <Transition name="demo-hint">
          <div v-if="demoHint" class="demo-hint-toast">
            <svg class="demo-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <span>{{ demoHint }}</span>
          </div>
        </Transition>

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
                  v-if="currentStep > 0 && !(skipStep1Mode && currentStep === 1)"
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
                    v-if="currentStep > 0 && !(skipStep1Mode && currentStep === 1)"
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
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { onboardingSteps } from './onboarding-steps'

const props = defineProps({
  isActive: Boolean,
  currentStep: Number,
  totalSteps: Number,
  selectedTabs: Set,
  allTabs: Array,
  settingsVisible: Boolean,
  hiddenCards: Set,
  skipStep1Mode: Boolean
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
  'close-nav-panel',
  'go-to-map',
  'go-to-home',
  'go-to-itinerary',
  'set-theme',
  'set-font-size',
  'trigger-global-nav',
  'expand-section',
  'restore-checklist'
])

const spotlightStyle = ref({})
const tooltipPosition = ref(null)
const tooltipStyle = ref({})
const isAnimatingAction = ref(false)
const hideSpotlight = ref(false)
const simpleHint = ref(null)
const simpleHintPosition = ref('top')
const demoHint = ref(null)

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

  const hintHeight = 48
  const safeMargin = 16
  const spaceAbove = rect.top - 8
  const spaceBelow = window.innerHeight - (rect.bottom + 8)

  if (spaceAbove < hintHeight + safeMargin && spaceBelow >= hintHeight + safeMargin) {
    simpleHintPosition.value = 'bottom'
  } else {
    simpleHintPosition.value = 'top'
  }
}

const clearSimpleHint = () => {
  simpleHint.value = null
  simpleHintPosition.value = 'top'
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

  const isSmallScreen = window.innerHeight < 700
  const tooltipSpace = isSmallScreen ? 200 : 220
  const offsetY = 20

  if (settingsPanel) {
    const panelRect = settingsPanel.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    if (elementRect.top < panelRect.top + tooltipSpace) {
      settingsPanel.scrollBy({
        top: elementRect.top - panelRect.top - offsetY,
        behavior: 'smooth'
      })
      return true
    } else if (elementRect.bottom > panelRect.bottom - offsetY) {
      settingsPanel.scrollBy({
        top: elementRect.bottom - panelRect.bottom + tooltipSpace,
        behavior: 'smooth'
      })
      return true
    }
    return false
  }

  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  if (rect.top < tooltipSpace) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return true
  }

  if (rect.bottom > viewportHeight - tooltipSpace) {
    element.scrollIntoView({ behavior: 'smooth', block: 'end' })
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
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const safeMargin = 16
  const gap = 12

  const isSmallScreen = viewportHeight < 700
  const tooltipWidth = Math.min(320, viewportWidth - safeMargin * 2)
  const tooltipHeight = isSmallScreen ? 180 : 200

  let placement = 'bottom'
  let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
  let top = targetRect.bottom + gap

  if (left < safeMargin) {
    left = safeMargin
  }
  if (left + tooltipWidth > viewportWidth - safeMargin) {
    left = viewportWidth - tooltipWidth - safeMargin
  }

  const spaceBelow = viewportHeight - targetRect.bottom - gap
  const spaceAbove = targetRect.top - gap

  if (spaceBelow < tooltipHeight + safeMargin && spaceAbove >= tooltipHeight + safeMargin) {
    placement = 'top'
    top = targetRect.top - tooltipHeight - gap
  } else if (top + tooltipHeight > viewportHeight - safeMargin) {
    placement = 'top'
    top = targetRect.top - tooltipHeight - gap

    if (top < safeMargin) {
      placement = 'center'
      top = Math.max(safeMargin, (viewportHeight - tooltipHeight) / 2)
    }
  }

  if (placement === 'center') {
    left = (viewportWidth - tooltipWidth) / 2
  }

  tooltipPosition.value = { placement }
  tooltipStyle.value = {
    left: `${Math.max(safeMargin, left)}px`,
    top: `${Math.max(safeMargin, top)}px`,
    maxWidth: `${tooltipWidth}px`
  }
}

const handleNext = async () => {
  if (isAnimatingAction.value) return

  const step = currentStepData.value
  const nextStepIndex = props.currentStep + 1
  const nextStep = onboardingSteps[nextStepIndex]

  if (nextStep?.id === 'home-checklist' && props.hiddenCards?.has('home-departure-checklist')) {
    isAnimatingAction.value = true
    await restoreChecklistBeforeNext()
    return
  }

  if (step?.action === 'openGlobalNav') {
    isAnimatingAction.value = true
    const menuBtn = document.querySelector('.hero-menu-btn')
    if (menuBtn) {
      menuBtn.classList.add('onboarding-click-effect')
      setTimeout(() => {
        menuBtn.classList.remove('onboarding-click-effect')
        menuBtn.click()
        setTimeout(() => {
          emit('next')
          isAnimatingAction.value = false
        }, 400)
      }, 300)
    } else {
      emit('next')
      isAnimatingAction.value = false
    }
    return
  }

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
    8: autoToggleTheme,
    9: autoChangeFontSize,
    10: autoExpandHiddenContent,
    13: autoSearchPlace
  }

  const demoFn = autoDemoSteps[props.currentStep]
  if (demoFn) {
    await demoFn()
    return
  }

  if (isLastStep.value) {
    emit('complete')
  } else {
    emit('next')
  }
}

const handleOptionClick = (option) => {
  if (isAnimatingAction.value) return

  if (option.action === 'complete') {
    emit('complete')
  } else if (option.action === 'next') {
    emit('next')
  } else if (option.action === 'goToItinerary') {
    emit('go-to-itinerary')
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
    demoHint.value = '正在展示暗色模式'

    await new Promise(resolve => setTimeout(resolve, 2000))

    demoHint.value = null
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

  emit('set-font-size', 'medium')
  await new Promise(resolve => setTimeout(resolve, 200))

  emit('close-settings')
  await new Promise(resolve => setTimeout(resolve, 400))

  hideSpotlightAndTooltip()
  demoHint.value = '正在展示字体设置'

  const menuBtn = document.querySelector('.hero-menu-btn')
  if (!menuBtn) {
    demoHint.value = null
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
    if (!venueSection.classList.contains('expanded')) {
      const header = venueSection.querySelector('.guide-module-header')
      if (header) {
        header.click()
        await new Promise(resolve => setTimeout(resolve, 400))
      }
    }

    const contentArea = venueSection.querySelector('.guide-module-content') || venueSection
    contentArea.scrollIntoView({ behavior: 'smooth', block: 'center' })
    await new Promise(resolve => setTimeout(resolve, 800))

    demoHint.value = null

    const rect = contentArea.getBoundingClientRect()
    showSpotlightWithSimpleHint(rect, '中号字体')
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  demoHint.value = null
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
    const contentArea = venueSection.querySelector('.guide-module-content') || venueSection
    const rect = contentArea.getBoundingClientRect()
    showSpotlightWithSimpleHint(rect, '大号字体')
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  clearSimpleHint()
  hideSpotlightAndTooltip()
  demoHint.value = null
  emit('next')
  isAnimatingAction.value = false
}

const autoExpandHiddenContent = async () => {
  isAnimatingAction.value = true

  emit('close-settings')
  await new Promise(resolve => setTimeout(resolve, 500))

  hideSpotlightAndTooltip()
  demoHint.value = '正在演示隐藏内容管理'

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
      if (!venueSection.classList.contains('expanded')) {
        const header = venueSection.querySelector('.guide-module-header')
        if (header) {
          header.click()
          await new Promise(resolve => setTimeout(resolve, 400))
        }
      }

      const contentArea = venueSection.querySelector('.guide-module-content') || venueSection
      contentArea.scrollIntoView({ behavior: 'smooth', block: 'center' })
      await new Promise(resolve => setTimeout(resolve, 800))

      const rect = contentArea.getBoundingClientRect()
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
      demoHint.value = null
      await new Promise(resolve => setTimeout(resolve, 800))

      const manageBtn = document.querySelector('.manage-hidden-btn')
      if (manageBtn) {
        manageBtn.classList.add('onboarding-click-effect')
        await new Promise(resolve => setTimeout(resolve, 400))
        manageBtn.classList.remove('onboarding-click-effect')
        manageBtn.click()
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      const restoreBtn = document.querySelector('.hidden-modal-item[data-card-id="dounan-venue"] .hidden-modal-item-restore') ||
                        document.querySelector('.hidden-modal-item:not([data-card-id="home-departure-checklist"]) .hidden-modal-item-restore') ||
                        document.querySelector('.hidden-modal-item .hidden-modal-item-restore')
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
    }
  }

  demoHint.value = null
  emit('next')
  isAnimatingAction.value = false
}

const restoreChecklistBeforeNext = async () => {
  demoHint.value = '正在恢复「出发前检查」...'

  await new Promise(resolve => setTimeout(resolve, 500))

  emit('open-settings')
  await new Promise(resolve => setTimeout(resolve, 1000))

  const manageBtn = document.querySelector('.manage-hidden-btn')
  if (manageBtn) {
    manageBtn.classList.add('onboarding-click-effect')
    await new Promise(resolve => setTimeout(resolve, 400))
    manageBtn.classList.remove('onboarding-click-effect')
    manageBtn.click()
  }

  await new Promise(resolve => setTimeout(resolve, 1500))

  const restoreBtn = document.querySelector('.hidden-modal-item[data-card-id="home-departure-checklist"] .hidden-modal-item-restore')
  if (restoreBtn) {
    restoreBtn.classList.add('onboarding-click-effect')
    await new Promise(resolve => setTimeout(resolve, 400))
    restoreBtn.classList.remove('onboarding-click-effect')
    restoreBtn.click()
  }

  await new Promise(resolve => setTimeout(resolve, 800))

  const closeHiddenModal = document.querySelector('.hidden-modal-close')
  if (closeHiddenModal) {
    closeHiddenModal.classList.add('onboarding-click-effect')
    await new Promise(resolve => setTimeout(resolve, 400))
    closeHiddenModal.classList.remove('onboarding-click-effect')
    closeHiddenModal.click()
  }

  await new Promise(resolve => setTimeout(resolve, 600))

  emit('close-settings')
  await new Promise(resolve => setTimeout(resolve, 400))

  demoHint.value = null
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

  await new Promise(resolve => setTimeout(resolve, 800))

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
  simpleHintPosition.value = 'top'

  const HOME_STEPS = [2, 3, 4]
  const SETTINGS_STEPS = [8, 9, 10, 11]
  const MAP_STEPS = [12, 13, 14, 15]
  const NAV_PANEL_STEP = 6

  const isInHome = HOME_STEPS.includes(newStep)
  const wasInSettings = SETTINGS_STEPS.includes(oldStep)
  const isInSettings = SETTINGS_STEPS.includes(newStep)

  const wasInMap = MAP_STEPS.includes(oldStep)
  const isInMap = MAP_STEPS.includes(newStep)

  if (isInHome && props.settingsVisible) {
    emit('close-settings')
  }

  if (oldStep === NAV_PANEL_STEP) {
    emit('close-nav-panel')
  }

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

  const NAV_PANEL_STEP = 6
  const SETTINGS_STEPS = [8, 9, 10, 11]
  const MAP_STEPS = [12, 13, 14, 15]

  const isNavPanel = newStep === NAV_PANEL_STEP
  const isInSettings = SETTINGS_STEPS.includes(newStep)
  const isInMap = MAP_STEPS.includes(newStep)

  if (isNavPanel) {
    setTimeout(() => {
      nextTick(() => {
        updateSpotlight()
      })
    }, 500)
  } else if (isInSettings) {
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
    hideSpotlight.value = false
    simpleHint.value = null
    simpleHintPosition.value = 'top'
    demoHint.value = null
    return
  }

  isAnimatingAction.value = false
  hideSpotlight.value = false
  simpleHint.value = null
  simpleHintPosition.value = 'top'
  demoHint.value = null
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
  background: color-mix(in srgb, black 80%, transparent);
  transition: background 0.4s var(--ease-out-quart);
}

.highlight-spotlight {
  position: fixed;
  background: transparent;
  border-radius: 16px;
  box-shadow:
    0 0 0 9999px color-mix(in srgb, black 80%, transparent),
    inset 0 0 0 2px color-mix(in srgb, var(--forest) 60%, transparent),
    0 0 0 4px var(--card),
    0 0 30px 4px color-mix(in srgb, var(--forest) 50%, transparent),
    0 0 60px 8px color-mix(in srgb, var(--forest) 25%, transparent);
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
      0 0 0 9999px color-mix(in srgb, black 80%, transparent),
      inset 0 0 0 2px color-mix(in srgb, var(--forest) 60%, transparent),
      0 0 0 4px var(--card),
      0 0 30px 4px color-mix(in srgb, var(--forest) 50%, transparent),
      0 0 60px 8px color-mix(in srgb, var(--forest) 25%, transparent);
  }
  50% {
    box-shadow:
      0 0 0 9999px color-mix(in srgb, black 80%, transparent),
      inset 0 0 0 2px color-mix(in srgb, var(--forest) 80%, transparent),
      0 0 0 4px var(--card),
      0 0 40px 6px color-mix(in srgb, var(--forest) 60%, transparent),
      0 0 80px 12px color-mix(in srgb, var(--forest) 30%, transparent);
  }
}

.spotlight-simple-hint {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: color-mix(in srgb, var(--forest) 95%, transparent);
  color: white;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 16px color-mix(in srgb, black 30%, transparent);
  z-index: 3;
}

.spotlight-simple-hint.top {
  top: -48px;
}

.spotlight-simple-hint.bottom {
  bottom: -48px;
}

.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.3s var(--ease-out-quart), transform 0.3s var(--ease-out-quart);
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
}

.spotlight-simple-hint.top.hint-enter-from,
.spotlight-simple-hint.top.hint-leave-to {
  transform: translateX(-50%) translateY(10px);
}

.spotlight-simple-hint.bottom.hint-enter-from,
.spotlight-simple-hint.bottom.hint-leave-to {
  transform: translateX(-50%) translateY(-10px);
}

.demo-hint-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card);
  color: var(--text);
  padding: 16px 28px;
  border-radius: 40px;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 8px 32px color-mix(in srgb, black 25%, transparent);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(8px);
}

.demo-hint-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--forest);
}

.demo-hint-enter-active {
  transition: opacity 0.35s var(--ease-out-quart), transform 0.35s var(--ease-out-quart);
}

.demo-hint-leave-active {
  transition: opacity 0.25s var(--ease-out-quart), transform 0.25s var(--ease-out-quart);
}

.demo-hint-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

.demo-hint-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}

.onboarding-tooltip {
  position: fixed;
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
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--forest) 70%, transparent);
  }
  50% {
    transform: scale(0.95);
    box-shadow: 0 0 0 20px color-mix(in srgb, var(--forest) 0%, transparent);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--forest) 0%, transparent);
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
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--forest) 40%, transparent);
  }
  50% {
    box-shadow: 0 0 0 10px color-mix(in srgb, var(--forest) 0%, transparent);
  }
}

@media (max-width: 480px) {
  .highlight-spotlight {
    border-radius: 12px;
  }

  .spotlight-simple-hint {
    font-size: 0.85rem;
    padding: 8px 16px;
  }

  .spotlight-simple-hint.top {
    top: -44px;
  }

  .spotlight-simple-hint.bottom {
    bottom: -44px;
  }

  .onboarding-tooltip {
    width: calc(100vw - 32px);
    max-width: calc(100vw - 32px);
    padding: 14px;
  }

  .onboarding-tooltip.center {
    top: 50% !important;
    left: 16px !important;
    transform: translateY(-50%);
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
    margin-bottom: 12px;
  }

  .tooltip-hint {
    margin-top: 10px;
    padding: 4px 10px;
  }

  .tooltip-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

@media (max-width: 375px), (max-height: 667px) {
  .spotlight-simple-hint {
    font-size: 0.8rem;
    padding: 6px 14px;
  }

  .spotlight-simple-hint.top {
    top: -40px;
  }

  .spotlight-simple-hint.bottom {
    bottom: -40px;
  }

  .onboarding-tooltip {
    padding: 12px;
  }

  .tooltip-header {
    margin-bottom: 6px;
  }

  .tooltip-title {
    font-size: 0.9rem;
  }

  .tooltip-content {
    font-size: 0.75rem;
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .tooltip-hint {
    margin-top: 8px;
    padding: 3px 8px;
    font-size: 0.65rem;
  }

  .tooltip-actions {
    gap: 8px;
  }

  .tooltip-btn {
    padding: 5px 10px;
    font-size: 0.75rem;
  }

  .tooltip-progress {
    margin-top: 10px;
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
