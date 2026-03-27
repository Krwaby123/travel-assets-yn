import { ref, onMounted } from 'vue'
import { useTheme } from './useTheme'

export function useSettings () {
  const {
    themeMode,
    setTheme,
    isDark
  } = useTheme()

  const fontSize = ref('medium')
  const fontWeight = ref('normal')
  const hiddenCards = ref(new Set())
  const hiddenModalVisible = ref(false)
  const showAddHideLocation = ref(false)
  const toastVisible = ref(false)
  const toastMessage = ref('')
  const lastHiddenCard = ref(null)

  const cardNameMap = {
    'dounan-venue': '斗南场馆详解',
    'dounan-time': '斗南时间攻略',
    'dounan-tips': '斗南避坑指南',
    'dali-erhai': '大理洱海环湖',
    'dali-food': '大理美食推荐',
    'dali-stay': '大理住宿攻略',
    'lijiang-old-town': '丽江古城攻略',
    'lijiang-jade': '玉龙雪山攻略',
    'lijiang-food': '丽江美食推荐',
    'shangri-duke': '独克宗古城',
    'shangri-meadow': '纳帕海依拉草原',
    'shangri-lake': '普达措国家公园'
  }

  const getCardName = (cardId) => {
    return cardNameMap[cardId] || cardId
  }

  const setFontSize = (size) => {
    fontSize.value = size
    localStorage.setItem('yunnan-travel-font-size', size)
    applyFontSize(size)
  }

  const setFontWeight = (weight) => {
    fontWeight.value = weight
    localStorage.setItem('yunnan-travel-font-weight', weight)
    applyFontWeight(weight)
  }

  const applyFontSize = (size) => {
    const scales = { small: 0.9, medium: 1, large: 1.15 }
    const scale = scales[size] || 1
    document.documentElement.style.setProperty('--text-scale', scale)
  }

  const applyFontWeight = (weight) => {
    const boosts = { normal: 0, bold: 50 }
    const boost = boosts[weight] || 0
    document.documentElement.style.setProperty('--text-weight-boost', boost)
  }

  const hideCard = (cardId, cardName) => {
    hiddenCards.value.add(cardId)
    lastHiddenCard.value = { id: cardId, name: cardName || getCardName(cardId) }
    showToast(`${cardName || getCardName(cardId)} 已隐藏`)
    saveHiddenCards()
  }

  const showCard = (cardId) => {
    hiddenCards.value.delete(cardId)
    saveHiddenCards()
  }

  const showAllCards = () => {
    hiddenCards.value.clear()
    saveHiddenCards()
    hiddenModalVisible.value = false
  }

  const restoreLastHidden = () => {
    if (lastHiddenCard.value) {
      showCard(lastHiddenCard.value.id)
      showToast(`${lastHiddenCard.value.name} 已恢复`)
      lastHiddenCard.value = null
    }
    toastVisible.value = false
  }

  const showToast = (message) => {
    toastMessage.value = message
    toastVisible.value = true
    setTimeout(() => {
      toastVisible.value = false
    }, 3000)
  }

  const saveHiddenCards = () => {
    localStorage.setItem('yunnan-travel-hidden-cards', JSON.stringify([...hiddenCards.value]))
  }

  const loadSettings = () => {
    const savedFontSize = localStorage.getItem('yunnan-travel-font-size')
    if (savedFontSize) {
      fontSize.value = savedFontSize
      applyFontSize(savedFontSize)
    }

    const savedFontWeight = localStorage.getItem('yunnan-travel-font-weight')
    if (savedFontWeight) {
      fontWeight.value = savedFontWeight
      applyFontWeight(savedFontWeight)
    }

    const savedHiddenCards = localStorage.getItem('yunnan-travel-hidden-cards')
    if (savedHiddenCards) {
      try {
        const cards = JSON.parse(savedHiddenCards)
        hiddenCards.value = new Set(cards)
      } catch (e) {
        hiddenCards.value = new Set()
      }
    }
  }

  onMounted(() => {
    loadSettings()
  })

  return {
    themeMode,
    setTheme,
    isDark,
    fontSize,
    fontWeight,
    setFontSize,
    setFontWeight,
    hiddenCards,
    hiddenModalVisible,
    showAddHideLocation,
    toastVisible,
    toastMessage,
    lastHiddenCard,
    getCardName,
    hideCard,
    showCard,
    showAllCards,
    restoreLastHidden,
    showToast
  }
}
