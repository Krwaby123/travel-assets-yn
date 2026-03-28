import { ref, computed } from 'vue'
import { onboardingSteps, mapOnboardingSteps } from '@/components/onboarding/onboarding-steps'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEY = 'yunnan_travel_guide_completed'
const MAP_STORAGE_KEY = 'yunnan_travel_map_guide_completed'
const SELECTED_TABS_KEY = 'yunnan_travel_selected_tabs'
const HIDDEN_TABS_KEY = 'yunnan_travel_hidden_tabs'

const allTabs = [
  { id: 'dounan', label: '昆明', index: 1 },
  { id: 'dali', label: '大理', index: 2 },
  { id: 'lijiang', label: '丽江', index: 3 },
  { id: 'shangri', label: '香格里拉', index: 4 }
]

const completed = ref(false)
const mapCompleted = ref(false)
const currentStep = ref(0)
const mapCurrentStep = ref(0)
const isActive = ref(false)
const isMapActive = ref(false)
const selectedTabs = ref(new Set(['dounan', 'dali', 'lijiang', 'shangri']))
const hiddenTabs = ref(new Set())
const isTransitioning = ref(false)
const skipStep1Mode = ref(false)

let transitionTimer = null
let mapTransitionTimer = null

const clearTransitionTimers = () => {
  if (transitionTimer) {
    clearTimeout(transitionTimer)
    transitionTimer = null
  }
  if (mapTransitionTimer) {
    clearTimeout(mapTransitionTimer)
    mapTransitionTimer = null
  }
}

export function useOnboarding () {
  const totalSteps = onboardingSteps.length
  const mapTotalSteps = mapOnboardingSteps.length

  const progress = computed(() => {
    if (totalSteps <= 1) return 0
    return Math.round((currentStep.value / (totalSteps - 1)) * 100)
  })

  const initOnboarding = () => {
    const savedCompleted = safeStorage.getItem(STORAGE_KEY)
    if (savedCompleted === 'true') {
      completed.value = true
    }

    const savedMapCompleted = safeStorage.getItem(MAP_STORAGE_KEY)
    if (savedMapCompleted === 'true') {
      mapCompleted.value = true
    }

    const savedSelectedTabs = safeStorage.getItem(SELECTED_TABS_KEY)
    if (savedSelectedTabs) {
      try {
        selectedTabs.value = new Set(JSON.parse(savedSelectedTabs))
      } catch (e) {
        selectedTabs.value = new Set(['dounan', 'dali', 'lijiang', 'shangri'])
      }
    }

    const savedHiddenTabs = safeStorage.getItem(HIDDEN_TABS_KEY)
    if (savedHiddenTabs) {
      try {
        hiddenTabs.value = new Set(JSON.parse(savedHiddenTabs))
      } catch (e) {
        hiddenTabs.value = new Set()
      }
    }

    updateHiddenTabsFromSelection()
  }

  const updateHiddenTabsFromSelection = () => {
    const newHiddenTabs = new Set()
    allTabs.forEach(tab => {
      if (!selectedTabs.value.has(tab.id)) {
        newHiddenTabs.add(tab.id)
      }
    })
    hiddenTabs.value = newHiddenTabs
    safeStorage.setItem(HIDDEN_TABS_KEY, JSON.stringify([...hiddenTabs.value]))
  }

  const startOnboarding = () => {
    if (completed.value) return
    isActive.value = true
    currentStep.value = 0
    skipStep1Mode.value = false
  }

  const startOnboardingFromWelcome = () => {
    if (completed.value) return
    isActive.value = true
    currentStep.value = 1
    skipStep1Mode.value = true
  }

  const startMapOnboarding = () => {
    if (mapCompleted.value) return
    isMapActive.value = true
    mapCurrentStep.value = 0
  }

  const skipOnboarding = () => {
    completeOnboarding()
  }

  const skipMapOnboarding = () => {
    completeMapOnboarding()
  }

  const completeOnboarding = () => {
    completed.value = true
    isActive.value = false
    skipStep1Mode.value = false
    clearTransitionTimers()
    safeStorage.setItem(STORAGE_KEY, 'true')
  }

  const completeMapOnboarding = () => {
    mapCompleted.value = true
    isMapActive.value = false
    clearTransitionTimers()
    safeStorage.setItem(MAP_STORAGE_KEY, 'true')
  }

  const resetOnboarding = () => {
    completed.value = false
    safeStorage.removeItem(STORAGE_KEY)
    currentStep.value = 0
    clearTransitionTimers()
  }

  const resetMapOnboarding = () => {
    mapCompleted.value = false
    safeStorage.removeItem(MAP_STORAGE_KEY)
    mapCurrentStep.value = 0
    clearTransitionTimers()
  }

  const nextStep = () => {
    if (isTransitioning.value) return
    if (currentStep.value < totalSteps - 1) {
      isTransitioning.value = true
      currentStep.value++
      clearTransitionTimers()
      transitionTimer = setTimeout(() => {
        isTransitioning.value = false
        transitionTimer = null
      }, 400)
    }
  }

  const nextMapStep = () => {
    if (isTransitioning.value) return
    if (mapCurrentStep.value < mapTotalSteps - 1) {
      isTransitioning.value = true
      mapCurrentStep.value++
      clearTransitionTimers()
      mapTransitionTimer = setTimeout(() => {
        isTransitioning.value = false
        mapTransitionTimer = null
      }, 400)
    } else {
      completeMapOnboarding()
    }
  }

  const prevStep = () => {
    if (isTransitioning.value) return
    if (skipStep1Mode.value && currentStep.value === 1) return
    if (currentStep.value > 0) {
      isTransitioning.value = true
      currentStep.value--
      clearTransitionTimers()
      transitionTimer = setTimeout(() => {
        isTransitioning.value = false
        transitionTimer = null
      }, 400)
    }
  }

  const prevMapStep = () => {
    if (isTransitioning.value) return
    if (mapCurrentStep.value > 0) {
      isTransitioning.value = true
      mapCurrentStep.value--
      clearTransitionTimers()
      mapTransitionTimer = setTimeout(() => {
        isTransitioning.value = false
        mapTransitionTimer = null
      }, 400)
    }
  }

  const goToStep = (stepIndex) => {
    if (isTransitioning.value) return
    if (typeof stepIndex !== 'number' || stepIndex < 0 || stepIndex >= totalSteps) return
    isTransitioning.value = true
    currentStep.value = stepIndex
    clearTransitionTimers()
    transitionTimer = setTimeout(() => {
      isTransitioning.value = false
      transitionTimer = null
    }, 400)
  }

  const toggleTab = (tabId) => {
    const newSet = new Set(selectedTabs.value)
    if (newSet.has(tabId)) {
      newSet.delete(tabId)
    } else {
      newSet.add(tabId)
    }
    selectedTabs.value = newSet
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([...selectedTabs.value]))
    updateHiddenTabsFromSelection()
  }

  const selectAllTabs = () => {
    selectedTabs.value = new Set(allTabs.map(tab => tab.id))
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([...selectedTabs.value]))
    updateHiddenTabsFromSelection()
  }

  const clearAllTabs = () => {
    selectedTabs.value = new Set()
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([]))
    updateHiddenTabsFromSelection()
  }

  const restoreTab = (tabId) => {
    const newSelectedSet = new Set(selectedTabs.value)
    const newHiddenSet = new Set(hiddenTabs.value)
    newSelectedSet.add(tabId)
    newHiddenSet.delete(tabId)
    selectedTabs.value = newSelectedSet
    hiddenTabs.value = newHiddenSet
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([...selectedTabs.value]))
    safeStorage.setItem(HIDDEN_TABS_KEY, JSON.stringify([...hiddenTabs.value]))
  }

  const hideTab = (tabId) => {
    const newSelectedSet = new Set(selectedTabs.value)
    const newHiddenSet = new Set(hiddenTabs.value)
    newSelectedSet.delete(tabId)
    newHiddenSet.add(tabId)
    selectedTabs.value = newSelectedSet
    hiddenTabs.value = newHiddenSet
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([...selectedTabs.value]))
    safeStorage.setItem(HIDDEN_TABS_KEY, JSON.stringify([...hiddenTabs.value]))
  }

  const visibleNavTabs = computed(() => {
    return allTabs.filter(tab => selectedTabs.value.has(tab.id))
  })

  const hiddenTabList = computed(() => {
    return allTabs.filter(tab => hiddenTabs.value.has(tab.id))
  })

  return {
    completed,
    mapCompleted,
    currentStep,
    mapCurrentStep,
    isActive,
    isMapActive,
    isTransitioning,
    skipStep1Mode,
    selectedTabs,
    hiddenTabs,
    progress,
    totalSteps,
    mapTotalSteps,
    allTabs,
    visibleNavTabs,
    hiddenTabList,
    initOnboarding,
    startOnboarding,
    startOnboardingFromWelcome,
    startMapOnboarding,
    skipOnboarding,
    skipMapOnboarding,
    completeOnboarding,
    completeMapOnboarding,
    resetOnboarding,
    resetMapOnboarding,
    nextStep,
    nextMapStep,
    prevStep,
    prevMapStep,
    goToStep,
    toggleTab,
    selectAllTabs,
    clearAllTabs,
    restoreTab,
    hideTab
  }
}