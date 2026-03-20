<template>
  <section class="section home-section">
      <div class="home-intro fade-in" data-delay="0">
        <p class="home-intro-text">3月云南，晴天为主，气温舒适。<br>昆明斗南→大理洱海，核心两地深度游，慢玩不赶路。</p>
      </div>

      <div class="quick-start fade-in" data-delay="100">
        <div class="quick-start-label">第一次来？推荐路线</div>
        <div class="quick-start-cards">
          <div class="quick-start-card" @click.stop="$emit('navigate', 1)" @mousedown="createRipple">
            <span class="quick-start-emoji">🌸</span>
            <div class="quick-start-info">
              <span class="quick-start-title">斗南花市</span>
              <span class="quick-start-desc">半天 · 人均30-100元</span>
            </div>
            <span class="quick-start-arrow">→</span>
          </div>
          <div class="quick-start-card" @click.stop="$emit('navigate', 2)" @mousedown="createRipple">
            <span class="quick-start-emoji">🌊</span>
            <div class="quick-start-info">
              <span class="quick-start-title">大理洱海</span>
              <span class="quick-start-desc">2天 · 人均250-600元</span>
            </div>
            <span class="quick-start-arrow">→</span>
          </div>
        </div>
      </div>

      <InfoCard
        card-id="home-itinerary"
        card-name="推荐行程"
        :hidden-cards="hiddenCards"
        :closable="false"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="home-itinerary">
          <div class="home-itinerary-header">
            <span class="home-itinerary-title">📍 推荐行程（斗南+大理）</span>
            <div class="itinerary-tabs" role="tablist" aria-label="行程选择">
              <button
                v-for="(option, key) in itineraryOptions"
                :key="key"
                :class="['itinerary-tab', { active: activeItinerary === key }]"
                role="tab"
                :aria-selected="activeItinerary === key"
                :aria-controls="'itinerary-' + key"
                @click="activeItinerary = key"
              >
                {{ option.label }}
                <span v-if="option.badge" class="tab-badge">{{ option.badge }}</span>
              </button>
            </div>
          </div>

          <div
            v-for="(option, key) in itineraryOptions"
            :key="key"
            :id="'itinerary-' + key"
            :class="['itinerary-content', { active: activeItinerary === key }]"
            role="tabpanel"
          >
            <div class="itinerary-flow">
              <template v-for="(day, index) in option.days" :key="day.num">
                <div class="itinerary-day">
                  <span class="itinerary-day-num">{{ day.num }}</span>
                  <span class="itinerary-day-place">{{ day.place }}</span>
                  <span class="itinerary-day-activity">{{ day.activity }}</span>
                </div>
                <span v-if="index < option.days.length - 1" class="itinerary-arrow">→</span>
              </template>
            </div>
            <div class="itinerary-budget">
              <span class="budget-label">人均预算：</span>
              <span class="budget-value">{{ option.budget }}</span>
              <span class="budget-note">{{ option.note }}</span>
            </div>
          </div>
        </div>
      </InfoCard>

      <div class="destinations-grid">
        <DestinationCard
          v-for="(dest, idx) in destinations"
          :key="dest.id"
          v-bind="dest"
          :reveal-delay="(idx * 100) + 'ms'"
          @click="handleDestClick($event, dest.goto)"
          @mousedown="createRipple"
        />
      </div>

      <InfoCard
        card-id="home-travel-tips"
        card-name="出行防护"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="home-travel-tips fade-in" data-delay="500">
          <div class="home-tips-title">出行防护</div>
          <div class="home-tips-grid">
            <div class="home-tips-item" v-for="tip in travelTips" :key="tip.title">
              <span class="home-tips-icon">{{ tip.icon }}</span>
              <div class="home-tips-content">
                <strong>{{ tip.title }}</strong>
                <span>{{ tip.desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="home-transport"
        card-name="省内高铁交通"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="home-transport fade-in" data-delay="600">
          <div class="home-transport-title">🚄 省内高铁交通</div>
          <div class="home-transport-grid">
            <div class="transport-card" v-for="t in transportInfo" :key="t.from + t.to">
              <div class="transport-route">
                <span class="transport-from">{{ t.from }}</span>
                <span class="transport-arrow">→</span>
                <span class="transport-to">{{ t.to }}</span>
              </div>
              <div class="transport-info">
                <span class="transport-price">{{ t.price }}</span>
                <span class="transport-time">{{ t.time }}</span>
              </div>
            </div>
          </div>
          <div class="home-transport-note">数据来源：12306官方 | 早班/晚班车次有更低折扣</div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="home-checklist"
        card-name="出行必备"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="home-checklist fade-in" data-delay="700">
          <div class="home-checklist-title">📋 出行必备</div>
          <div class="home-checklist-items">
            <span class="checklist-tag" v-for="item in checklistItems" :key="item">{{ item }}</span>
          </div>
        </div>
      </InfoCard>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DestinationCard from '../DestinationCard.vue'
import InfoCard from '../InfoCard.vue'
import { destinations, transportInfo, checklistItems, travelTips, itineraryOptions } from '@/data/travelData'

defineProps({
  hiddenCards: Set
})

const emit = defineEmits(['navigate', 'hide-card'])

const activeItinerary = ref('core4')

const createRipple = (event) => {
  const element = event.currentTarget
  const ripple = document.createElement('span')
  ripple.classList.add('ripple')
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = (event.clientX || event.changedTouches?.[0]?.clientX || rect.left + rect.width / 2) - rect.left - size / 2 + 'px'
  ripple.style.top = (event.clientY || event.changedTouches?.[0]?.clientY || rect.top + rect.height / 2) - rect.top - size / 2 + 'px'
  element.appendChild(ripple)
  setTimeout(() => ripple.remove(), 500)
}

const handleDestClick = (event, goto) => {
  if (event?.currentTarget) {
    createRipple(event)
  }
  emit('navigate', goto)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, { threshold: 0.1, rootMargin: '50px' })

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el))
})
</script>

<style scoped>
@import '../slides-common.css';

.section {
  padding: var(--space-md);
  max-width: 680px;
  margin: 0 auto;
  width: 100%;
}

.home-section {
  display: flex;
  flex-direction: column;
  padding-top: var(--space-xs);
  gap: var(--space-sm);
  min-height: 0;
  padding-bottom: var(--space-xl);
  padding-left: max(var(--space-md), env(safe-area-inset-left));
  padding-right: max(var(--space-md), env(safe-area-inset-right));
}

.home-intro {
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--forest-light) 0%, var(--sky-light) 100%);
  border-radius: var(--space-md);
}

.home-intro-text {
  font-size: var(--text-sm);
  color: var(--text);
  line-height: 1.8;
  text-align: center;
  font-weight: 500;
}

.quick-start {
  margin: var(--space-lg) 0;
}

.quick-start-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.quick-start-cards {
  display: flex;
  gap: var(--space-sm);
  width: 100%;
}

.quick-start-card {
  flex: 1 1 0;
  min-width: 0;
  max-width: 50%;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--card);
  border: 2px solid var(--forest);
  border-radius: var(--space-md);
  padding: var(--space-md);
  cursor: pointer;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
}

.quick-start-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: var(--sunset);
}

.quick-start-card:active {
  transform: scale(0.98);
}

.quick-start-emoji {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.quick-start-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.quick-start-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--forest);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-start-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-start-arrow {
  color: var(--forest);
  font-size: var(--text-lg);
  font-weight: 700;
  flex-shrink: 0;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
  margin-top: var(--space-xs);
  align-content: start;
}

.home-itinerary {
  padding: var(--space-md);
  margin-top: var(--space-sm);
}

.home-itinerary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  flex-wrap: wrap;
  gap: var(--space-xs);
  padding-left: calc(var(--space-md) + 24px);
}

.home-itinerary-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
}

.itinerary-tabs {
  display: flex;
  gap: var(--space-2xs);
  flex-wrap: wrap;
}

.itinerary-tab {
  font-size: 0.75rem;
  padding: var(--space-xs) var(--space-sm);
  white-space: nowrap;
  flex: 0 0 auto;
  text-align: center;
  min-height: 44px;
  border: 1px solid var(--border);
  background: transparent;
  border-radius: var(--space-sm);
  cursor: pointer;
  color: var(--text-muted);
  transition: all 0.2s var(--ease-out-quart);
  font-family: inherit;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.itinerary-tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--forest);
  transition: width 0.25s var(--ease-out-quart), left 0.25s var(--ease-out-quart);
}

.itinerary-tab:hover::after {
  width: 60%;
  left: 20%;
}

.itinerary-tab.active::after {
  width: 0;
}

.itinerary-tab:active {
  transform: scale(0.94);
}

.itinerary-tab.active {
  background: var(--forest);
  color: white;
  border-color: var(--forest);
}

.tab-badge {
  background: var(--sunset);
  color: white;
  font-size: 0.6rem;
  padding: 2px 5px;
  border-radius: var(--space-xs);
  margin-left: 4px;
  flex-shrink: 0;
}

.itinerary-content {
  display: none;
}

.itinerary-content.active {
  display: block;
  animation: fadeIn 0.3s var(--ease-out-quart);
}

.itinerary-flow {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
  overflow-x: auto;
  padding: var(--space-xs) 0;
  scrollbar-width: none;
}

.itinerary-flow::-webkit-scrollbar {
  display: none;
}

.itinerary-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
  text-align: center;
}

.itinerary-day-num {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--forest);
  background: var(--forest-light);
  padding: 0.1rem 0.4rem;
  border-radius: 0.2rem;
  margin-bottom: 2px;
}

.itinerary-day-place {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text);
}

.itinerary-day-activity {
  font-size: 0.6rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.itinerary-arrow {
  color: var(--text-muted);
  font-size: 0.7rem;
  flex-shrink: 0;
}

.itinerary-budget {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--border);
  flex-wrap: wrap;
}

.budget-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.budget-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--sunset);
}

.budget-note {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.home-travel-tips {
  padding: var(--space-md);
}

.home-tips-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.home-tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.home-tips-item {
  display: flex;
  gap: var(--space-xs);
  align-items: flex-start;
}

.home-tips-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.home-tips-content {
  font-size: var(--text-xs);
  line-height: 1.5;
}

.home-tips-content strong {
  display: block;
  color: var(--text);
  font-weight: 600;
}

.home-tips-content span {
  color: var(--text-muted);
}

.home-transport {
  padding: var(--space-md);
}

.home-transport-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.home-transport-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
}

.transport-card {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
  text-align: center;
}

.transport-route {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  margin-bottom: var(--space-xs);
}

.transport-from, .transport-to {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text);
}

.transport-arrow {
  color: var(--forest);
  font-size: 0.7rem;
}

.transport-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.transport-price {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--sunset);
}

.transport-time {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.home-transport-note {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-xs);
}

.home-checklist {
  background: linear-gradient(135deg, var(--forest-light) 0%, var(--sky-light) 100%);
  border-radius: var(--space-md);
  padding: var(--space-md);
}

.home-checklist-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.home-checklist-items {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  justify-content: center;
}

.checklist-tag {
  background: var(--card);
  color: var(--text);
  font-size: var(--text-xs);
  padding: var(--space-2xs) var(--space-sm);
  border-radius: 1rem;
  font-weight: 500;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  transform: scale(0);
  animation: rippleEffect 0.5s var(--ease-out-quart);
  pointer-events: none;
}

@keyframes rippleEffect {
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .quick-start-cards {
    flex-direction: row;
    gap: var(--space-xs);
  }
  .quick-start-card {
    flex: 1 1 0;
    padding: var(--space-sm);
    max-width: 50%;
    min-height: auto;
  }
  .quick-start-emoji {
    font-size: 1.25rem;
  }
  .quick-start-title {
    font-size: var(--text-sm);
  }
  .quick-start-desc {
    font-size: 0.7rem;
  }
  .quick-start-arrow {
    font-size: var(--text-base);
  }
  .home-transport-grid {
    grid-template-columns: 1fr;
  }
  .transport-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm);
  }
  .transport-route {
    margin-bottom: 0;
    justify-content: flex-start;
  }
  .transport-info {
    flex-direction: row;
    gap: var(--space-xs);
    align-items: flex-end;
  }
  .itinerary-tabs {
    gap: var(--space-2xs);
  }
  .itinerary-tab {
    font-size: 0.68rem;
    padding: var(--space-xs) var(--space-sm);
    min-height: 44px;
  }
  .itinerary-tab .tab-badge {
    font-size: 0.55rem;
    padding: 1px 4px;
    margin-left: 2px;
  }
  .home-checklist-items {
    justify-content: flex-start;
    gap: var(--space-2xs);
  }
  .checklist-tag {
    font-size: 0.7rem;
    padding: var(--space-2xs) var(--space-xs);
  }
  .quick-tips {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2xs);
  }
  .quick-tip {
    padding: var(--space-sm) var(--space-2xs);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .quick-tip-icon {
    font-size: 1rem;
    margin-bottom: 2px;
  }
  .quick-tip-label {
    font-size: 0.6rem;
  }
  .quick-tip-value {
    font-size: 0.65rem;
    margin-top: 2px;
    font-weight: 700;
    color: var(--sunset-soft);
  }
}

@media (min-width: 480px) {
  .home-tips-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 768px) {
  .section {
    padding: var(--space-xl) var(--space-lg);
  }
  .quick-start-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
}

@media (hover: hover) and (pointer: fine) {
  .quick-start-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-color: var(--sunset);
  }
  .dest-card:hover {
    transform: translateY(-4px);
  }
  .dest-card:hover .dest-card-image img {
    transform: scale(1.08);
  }
}

@media (hover: none) and (pointer: coarse) {
  .quick-start-card {
    -webkit-tap-highlight-color: transparent;
  }
  .quick-start-card:active {
    transform: scale(0.97);
    transition: transform 0.1s ease;
  }
  .itinerary-tab {
    -webkit-tap-highlight-color: transparent;
    min-height: 44px;
    min-width: 44px;
  }
  .itinerary-tab:active {
    transform: scale(0.94);
    background: var(--earth-light);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
