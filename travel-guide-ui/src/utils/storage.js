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
  }
}
