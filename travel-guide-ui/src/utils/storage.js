export const safeStorage = {
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
  },

  getJSON (key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    } catch (e) {
      return defaultValue
    }
  },

  setJSON (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {}
  }
}

export default safeStorage
