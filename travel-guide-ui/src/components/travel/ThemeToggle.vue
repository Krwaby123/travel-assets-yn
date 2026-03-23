<template>
  <button class="theme-toggle" @click="toggleTheme" :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'">
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const initTheme = () => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    isDark.value = true
  } else if (saved === 'light') {
    isDark.value = false
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
}

const applyTheme = () => {
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  applyTheme()
}

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: var(--space-md);
  right: var(--space-md);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--card);
  border: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 110;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.theme-toggle:hover {
  background: var(--forest-light);
  border-color: var(--forest);
  transform: scale(1.05);
}

.theme-toggle svg {
  width: 18px;
  height: 18px;
  color: var(--text);
}

.theme-toggle .icon-sun,
.theme-toggle .icon-moon {
  position: absolute;
  transition: opacity 0.3s var(--ease-out-quart), transform 0.4s var(--ease-out-quart);
}

.theme-toggle .icon-sun,
.theme-toggle .icon-moon {
  position: absolute;
  transition: opacity 0.35s var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1)),
              transform 0.45s var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1));
}

.theme-toggle .icon-sun {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

.theme-toggle .icon-moon {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

[data-theme="dark"] .theme-toggle .icon-sun {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

[data-theme="dark"] .theme-toggle .icon-moon {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

.theme-toggle .icon-moon {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

[data-theme="dark"] .theme-toggle .icon-sun {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

[data-theme="dark"] .theme-toggle .icon-moon {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

@media (max-width: 480px) {
  .theme-toggle {
    width: 36px;
    height: 36px;
    top: var(--space-sm);
    right: var(--space-sm);
  }
  .theme-toggle svg {
    width: 16px;
    height: 16px;
  }
}
</style>
