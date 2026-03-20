import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal (options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true
  } = options

  let observer = null

  const initObserver = () => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target
          const delay = parseInt(el.dataset.delay || '0', 10)

          setTimeout(() => {
            el.classList.add('revealed')
          }, delay)

          if (once) {
            observer.unobserve(el)
          }
        } else if (!once) {
          entry.target.classList.remove('revealed')
        }
      })
    }, { threshold, rootMargin })
  }

  const observe = (selector = '.reveal') => {
    if (!observer) initObserver()

    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el)
    })
  }

  const unobserve = (selector = '.reveal') => {
    if (!observer) return
    document.querySelectorAll(selector).forEach(el => {
      observer.unobserve(el)
    })
  }

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    initObserver()
  })

  onUnmounted(() => {
    cleanup()
  })

  return { observe, unobserve, cleanup }
}

export function useStaggerAnimation () {
  const applyStagger = (elements, baseDelay = 50, maxDelay = 500) => {
    const count = elements.length
    const perItemDelay = Math.min(baseDelay, maxDelay / count)

    elements.forEach((el, index) => {
      el.style.setProperty('--stagger-index', index)
      el.style.animationDelay = `calc(var(--stagger-index, 0) * ${perItemDelay}ms)`
    })
  }

  return { applyStagger }
}
