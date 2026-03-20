<template>
  <header class="hero">
    <div class="hero-content">
      <h1>云南旅行攻略</h1>
      <p class="hero-subtitle">斗南花市 · 大理洱海（附丽江香格里拉）</p>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.hero {
  min-height: 28vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--space-xl) var(--space-md) var(--space-lg);
  position: relative;
  background: linear-gradient(
    180deg,
    var(--sky-light) 0%,
    var(--bg) 100%
  );
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 20%, var(--sunset-soft) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 30% 60%, var(--forest-light) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600px;
  padding: 0 1rem;
  animation: heroFadeIn 1.2s var(--ease-out-expo) forwards;
}

.hero h1 {
  font-family: 'ZCOOL XiaoWei', serif;
  font-size: clamp(1.5rem, 6vw, 2.5rem);
  font-weight: 400;
  color: var(--forest);
  margin-bottom: 0.3rem;
  letter-spacing: 0.05em;
  text-wrap: balance;
  animation: titleReveal 1s var(--ease-out-quart) 0.15s forwards;
  opacity: 0;
  transform: translateY(1.5rem);
}

.hero-subtitle {
  font-size: clamp(0.75rem, 2.5vw, 0.95rem);
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  animation: subtitleReveal 0.8s var(--ease-out-quart) 0.35s forwards;
  opacity: 0;
  transform: translateY(1rem);
}

@keyframes heroFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes titleReveal {
  from { opacity: 0; transform: translateY(1.5rem); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes subtitleReveal {
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 479px) {
  .hero {
    min-height: 20vh;
    padding: var(--space-md) var(--space-md) var(--space-sm);
  }
  .hero h1 {
    font-size: clamp(1.25rem, 6vw, 1.8rem);
    margin-bottom: var(--space-2xs);
  }
  .hero-subtitle {
    font-size: 0.75rem;
    margin-bottom: var(--space-2xs);
  }
}

@media (min-width: 768px) {
  .hero {
    min-height: 32vh;
    padding: var(--space-2xl) var(--space-2xl) var(--space-xl);
  }
  .hero h1 {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
  }
  .hero-subtitle {
    font-size: clamp(0.85rem, 2vw, 1rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-content,
  .hero h1,
  .hero-subtitle {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
