import { ref, onMounted } from 'vue'
import { safeStorage } from '@/utils/storage'

const hiddenCards = ref(new Set())
const toastMessage = ref('')

export function useCardManager () {
  const init = () => {
    const saved = safeStorage.getItem('hiddenCards')
    if (saved) {
      try {
        hiddenCards.value = new Set(JSON.parse(saved))
      } catch (e) {}
    }
  }

  const hideCard = (cardId, cardName) => {
    hiddenCards.value.add(cardId)
    saveState()
    toastMessage.value = `已隐藏「${cardName}」`
  }

  const showCard = (cardId) => {
    hiddenCards.value.delete(cardId)
    saveState()
  }

  const showAllCards = () => {
    hiddenCards.value.clear()
    saveState()
  }

  const isHidden = (cardId) => {
    return hiddenCards.value.has(cardId)
  }

  const saveState = () => {
    safeStorage.setItem('hiddenCards', JSON.stringify([...hiddenCards.value]))
  }

  const getHiddenCardsList = () => {
    return [...hiddenCards.value]
  }

  onMounted(() => {
    init()
  })

  return {
    hiddenCards,
    toastMessage,
    hideCard,
    showCard,
    showAllCards,
    isHidden,
    getHiddenCardsList,
    init
  }
}
