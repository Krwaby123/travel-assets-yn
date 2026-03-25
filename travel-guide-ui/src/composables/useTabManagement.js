import { ref, computed } from 'vue'

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
  }
}

const defaultTabs = [
  { id: 'home', label: '首页', index: 0, fixed: true },
  { id: 'dounan', label: '斗南花市', index: 1 },
  { id: 'dali', label: '大理', index: 2 },
  { id: 'lijiang', label: '丽江', index: 3 },
  { id: 'shangri', label: '香格里拉', index: 4 },
  { id: 'map', label: '地图', index: 5, fixed: true }
]

const allTabs = ref(defaultTabs.filter(t => !t.fixed))
const selectedTabs = ref(new Set(['dounan', 'dali', 'lijiang', 'shangri']))
const hiddenTabs = ref(new Set())

export function useTabManagement () {
  const visibleTabs = computed(() => {
    return defaultTabs.filter(tab =>
      tab.fixed || selectedTabs.value.has(tab.id)
    )
  })

  const hiddenTabList = computed(() => {
    return allTabs.value.filter(tab => hiddenTabs.value.has(tab.id))
  })

  const hasHiddenTabs = computed(() => hiddenTabs.value.size > 0)

  const initTabManagement = () => {
    const savedSelected = safeStorage.getItem(SELECTED_TABS_KEY)
    if (savedSelected) {
      try {
        selectedTabs.value = new Set(JSON.parse(savedSelected))
      } catch (e) {
        selectedTabs.value = new Set(['dounan', 'dali', 'lijiang', 'shangri'])
      }
    }

    const savedHidden = safeStorage.getItem(HIDDEN_TABS_KEY)
    if (savedHidden) {
      try {
        hiddenTabs.value = new Set(JSON.parse(savedHidden))
      } catch (e) {
        hiddenTabs.value = new Set()
      }
    }

    syncHiddenTabs()
  }

  const syncHiddenTabs = () => {
    const newHidden = new Set()
    allTabs.value.forEach(tab => {
      if (!selectedTabs.value.has(tab.id)) {
        newHidden.add(tab.id)
      }
    })
    hiddenTabs.value = newHidden
    saveToStorage()
  }

  const saveToStorage = () => {
    safeStorage.setItem(SELECTED_TABS_KEY, JSON.stringify([...selectedTabs.value]))
    safeStorage.setItem(HIDDEN_TABS_KEY, JSON.stringify([...hiddenTabs.value]))
  }

  const toggleTab = (tabId) => {
    if (selectedTabs.value.has(tabId)) {
      selectedTabs.value.delete(tabId)
      hiddenTabs.value.add(tabId)
    } else {
      selectedTabs.value.add(tabId)
      hiddenTabs.value.delete(tabId)
    }
    saveToStorage()
  }

  const hideTab = (tabId) => {
    selectedTabs.value.delete(tabId)
    hiddenTabs.value.add(tabId)
    saveToStorage()
  }

  const restoreTab = (tabId) => {
    selectedTabs.value.add(tabId)
    hiddenTabs.value.delete(tabId)
    saveToStorage()
  }

  const selectAllTabs = () => {
    allTabs.value.forEach(tab => selectedTabs.value.add(tab.id))
    hiddenTabs.value.clear()
    saveToStorage()
  }

  const clearAllTabs = () => {
    selectedTabs.value.clear()
    allTabs.value.forEach(tab => hiddenTabs.value.add(tab.id))
    saveToStorage()
  }

  const isTabVisible = (tabId) => {
    return selectedTabs.value.has(tabId)
  }

  const isTabHidden = (tabId) => {
    return hiddenTabs.value.has(tabId)
  }

  const getTabById = (tabId) => {
    return defaultTabs.find(tab => tab.id === tabId)
  }

  const getTabByIndex = (index) => {
    return defaultTabs.find(tab => tab.index === index)
  }

  return {
    allTabs,
    selectedTabs,
    hiddenTabs,
    visibleTabs,
    hiddenTabList,
    hasHiddenTabs,
    defaultTabs,
    initTabManagement,
    toggleTab,
    hideTab,
    restoreTab,
    selectAllTabs,
    clearAllTabs,
    isTabVisible,
    isTabHidden,
    getTabById,
    getTabByIndex
  }
}
