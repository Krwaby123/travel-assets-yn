import { ref, computed } from 'vue'

const STORAGE_KEY = 'yunnan_travel_guide_completed'
const MAP_STORAGE_KEY = 'yunnan_travel_map_guide_completed'
const SELECTED_TABS_KEY = 'yunnan_travel_selected_tabs'
const HIDDEN_TABS_KEY = 'yunnan_travel_hidden_tabs'

const safeStorage = {
  getItem (key) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return null
    }
  },
  setItem (key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (e) {}
  },
  removeItem (key) {
    try {
      localStorage.removeItem(key)
    } catch (e) {}
  }
}

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

export function useOnboarding () {
  const totalSteps = 16
  const mapTotalSteps = 8

  const progress = computed(() => {
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
    safeStorage.setItem(STORAGE_KEY, 'true')
  }

  const completeMapOnboarding = () => {
    mapCompleted.value = true
    isMapActive.value = false
    safeStorage.setItem(MAP_STORAGE_KEY, 'true')
  }

  const resetOnboarding = () => {
    completed.value = false
    safeStorage.removeItem(STORAGE_KEY)
    currentStep.value = 0
  }

  const resetMapOnboarding = () => {
    mapCompleted.value = false
    safeStorage.removeItem(MAP_STORAGE_KEY)
    mapCurrentStep.value = 0
  }

  const nextStep = () => {
    if (isTransitioning.value) return
    if (currentStep.value < totalSteps - 1) {
      isTransitioning.value = true
      currentStep.value++
      setTimeout(() => {
        isTransitioning.value = false
      }, 400)
    }
  }

  const nextMapStep = () => {
    if (isTransitioning.value) return
    if (mapCurrentStep.value < mapTotalSteps - 1) {
      isTransitioning.value = true
      mapCurrentStep.value++
      setTimeout(() => {
        isTransitioning.value = false
      }, 400)
    } else {
      completeMapOnboarding()
    }
  }

  const prevStep = () => {
    if (isTransitioning.value) return
    if (currentStep.value > 0) {
      isTransitioning.value = true
      currentStep.value--
      setTimeout(() => {
        isTransitioning.value = false
      }, 400)
    }
  }

  const prevMapStep = () => {
    if (isTransitioning.value) return
    if (mapCurrentStep.value > 0) {
      isTransitioning.value = true
      mapCurrentStep.value--
      setTimeout(() => {
        isTransitioning.value = false
      }, 400)
    }
  }

  const goToStep = (stepIndex) => {
    if (isTransitioning.value) return
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      isTransitioning.value = true
      currentStep.value = stepIndex
      setTimeout(() => {
        isTransitioning.value = false
      }, 400)
    }
  }

  const toggleTab = (tabId) => {
    if (selectedTabs.value.has(tabId)) {
      selectedTabs.value.delete(tabId)
    } else {
      selectedTabs.value.add(tabId)
    }
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([...selectedTabs.value]))
    updateHiddenTabsFromSelection()
  }

  const selectAllTabs = () => {
    allTabs.forEach(tab => selectedTabs.value.add(tab.id))
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([...selectedTabs.value]))
    updateHiddenTabsFromSelection()
  }

  const clearAllTabs = () => {
    selectedTabs.value.clear()
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([]))
    updateHiddenTabsFromSelection()
  }

  const restoreTab = (tabId) => {
    selectedTabs.value.add(tabId)
    hiddenTabs.value.delete(tabId)
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([...selectedTabs.value]))
    safeStorage.setItem(HIDDEN_TABS_KEY, JSON.stringify([...hiddenTabs.value]))
  }

  const hideTab = (tabId) => {
    selectedTabs.value.delete(tabId)
    hiddenTabs.value.add(tabId)
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
