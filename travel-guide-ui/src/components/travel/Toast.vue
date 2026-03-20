<template>
  <Teleport to="body">
    <div class="toast" :class="{ show: message }">
      <span>{{ message }}</span>
      <span class="toast-action">管理内容</span>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  message: String
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 200px;
  right: var(--space-md);
  background: var(--text);
  color: var(--card);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  z-index: 200;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-action {
  color: var(--sky-light);
  margin-left: var(--space-xs);
  font-size: 0.75rem;
}
</style>
