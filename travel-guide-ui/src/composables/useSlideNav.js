import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentIndex = ref(0)
const slideDirection = ref('right')

export function useSlideNav (totalSlides) {
  const goToSlide = (index, direction = null) => {
    if (index < 0 || index >= totalSlides.value) return

    const prevIndex = currentIndex.value
    slideDirection.value = direction || (index > prevIndex ? 'right' : 'left')
    currentIndex.value = index
  }

  const nextSlide = () => {
    if (currentIndex.value < totalSlides.value - 1) {
      goToSlide(currentIndex.value + 1, 'right')
    }
  }

  const prevSlide = () => {
    if (currentIndex.value > 0) {
      goToSlide(currentIndex.value - 1, 'left')
    }
  }

  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === totalSlides.value - 1)

  const handleKeydown = (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide()
    } else if (e.key === 'ArrowRight') {
      nextSlide()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    currentIndex,
    slideDirection,
    goToSlide,
    nextSlide,
    prevSlide,
    isFirst,
    isLast
  }
}
