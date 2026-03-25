import { ref } from 'vue'

const THEME_STORAGE_KEY = 'themeMode'

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

const themeMode = ref('light')
const isDark = ref(false)
const isEyeCare = ref(false)
const eyeCareMode = ref('manual')

let eyeCareInterval = null

const themeOptions = [
  { value: 'light', label: '亮色', icon: 'sun' },
  { value: 'dark', label: '暗色', icon: 'moon' },
  { value: 'eye-care', label: '护眼', icon: 'eye' },
  { value: 'eye-care-auto', label: '护眼（定时）', icon: 'clock' },
  { value: 'auto', label: '跟随系统', icon: 'monitor' }
]

export function useTheme () {
  const checkEyeCareTime = () => {
    const hour = new Date().getHours()
    return hour >= 18 || hour < 6
  }

  const applyTheme = (mode) => {
    const root = document.documentElement

    root.removeAttribute('data-theme')
    root.classList.remove('eye-care-theme')

    switch (mode) {
      case 'dark':
        isDark.value = true
        isEyeCare.value = false
        root.setAttribute('data-theme', 'dark')
        break

      case 'eye-care':
      case 'eye-care-auto':
        isDark.value = false
        isEyeCare.value = true
        root.classList.add('eye-care-theme')
        break

      case 'light':
        isDark.value = false
        isEyeCare.value = false
        break

      case 'auto':
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
        isEyeCare.value = false
        if (isDark.value) {
          root.setAttribute('data-theme', 'dark')
        }
        break
    }
  }

  const setTheme = (mode) => {
    themeMode.value = mode
    safeStorage.setItem(THEME_STORAGE_KEY, mode)
    applyTheme(mode)
  }

  const initTheme = () => {
    const savedMode = safeStorage.getItem(THEME_STORAGE_KEY) || 'light'
    themeMode.value = savedMode
    applyTheme(savedMode)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (themeMode.value === 'auto') {
        isDark.value = e.matches
        if (e.matches) {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
      }
    })

    startEyeCareTimer()
  }

  const startEyeCareTimer = () => {
    if (eyeCareInterval) {
      clearInterval(eyeCareInterval)
    }

    eyeCareInterval = setInterval(() => {
      if (themeMode.value === 'eye-care-auto') {
        const shouldBeActive = checkEyeCareTime()
        if (shouldBeActive !== isEyeCare.value) {
          applyTheme('eye-care-auto')
        }
      }
    }, 60000)

    if (themeMode.value === 'eye-care-auto') {
      const shouldBeActive = checkEyeCareTime()
      if (!shouldBeActive) {
        themeMode.value = 'eye-care'
        safeStorage.setItem(THEME_STORAGE_KEY, 'eye-care')
      }
    }
  }

  const toggleTheme = () => {
    const modes = ['light', 'dark', 'eye-care', 'auto']
    const currentIndex = modes.indexOf(themeMode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setTheme(modes[nextIndex])
  }

  const toggleDarkMode = () => {
    if (themeMode.value === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  const toggleEyeCare = () => {
    if (themeMode.value === 'eye-care' || themeMode.value === 'eye-care-auto') {
      setTheme('light')
    } else {
      setTheme('eye-care')
    }
  }

  return {
    themeMode,
    isDark,
    isEyeCare,
    eyeCareMode,
    themeOptions,
    setTheme,
    initTheme,
    toggleTheme,
    toggleDarkMode,
    toggleEyeCare,
    checkEyeCareTime
  }
}
