<template>
  <section class="section home-section">
    <!-- 区域1：行程总览区 -->
    <div id="home-guide-area-overview" class="guide-module">
      <div class="guide-module-header">
        <h2 class="guide-module-title">行程总览</h2>
      </div>
      <div class="guide-module-content">
        <div class="home-intro">
          <p class="home-intro-text">3月云南，晴天为主，气温舒适。<br>昆明斗南→大理洱海，核心两地深度游，慢玩不赶路。</p>
        </div>
      </div>
    </div>

    <!-- 区域2：出行检查区 -->
    <div id="home-guide-area-checklist" class="guide-module">
      <div class="guide-module-header">
        <h2 class="guide-module-title">出发前检查清单</h2>
      </div>
      <div class="guide-module-content">
        <div class="pre-trip-checklist">
          <div class="checklist-header">
            <svg class="checklist-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            <span class="checklist-progress">{{ checkedItems.length }}/{{ checklistItems.length }}</span>
          </div>
          <div class="checklist-items">
            <label v-for="(item, idx) in checklistItems" :key="idx" class="checklist-item" :class="{ checked: checkedItems.includes(idx) }">
              <input
                type="checkbox"
                :checked="checkedItems.includes(idx)"
                @change="toggleCheckItem(idx)"
                class="checklist-checkbox"
              >
              <span class="checklist-checkbox-custom"></span>
              <span class="checklist-item-text">{{ item }}</span>
            </label>
          </div>
          <div class="checklist-tip" v-if="checkedItems.length === checklistItems.length">
            <span class="checklist-tip-icon">✓</span>
            准备就绪！祝你旅途愉快 🎉
          </div>
        </div>
      </div>
    </div>

    <!-- 区域3：路线推荐区 -->
    <div id="home-guide-area-routes" class="guide-module">
      <div class="guide-module-header">
        <h2 class="guide-module-title">第一次来？推荐路线</h2>
      </div>
      <div class="guide-module-content">
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
    </div>

    <!-- 区域4：地图入口区 -->
    <div id="home-guide-area-map" class="guide-module">
      <div class="guide-module-header">
        <h2 class="guide-module-title">地图导航</h2>
      </div>
      <div class="guide-module-content">
        <div class="quick-nav-card">
          <div class="quick-nav-header">
            <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <div class="quick-nav-info">
              <span class="quick-nav-desc">查看路线 · 规划行程</span>
            </div>
          </div>
          <button class="quick-nav-btn" @click="$emit('navigate', 5)">
            <span>打开地图</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 区域5：优惠汇总区 -->
    <div id="home-guide-area-discounts" class="guide-module">
      <div class="guide-module-header">
        <h2 class="guide-module-title">学生专属优惠</h2>
      </div>
      <div class="guide-module-content">
        <div class="student-discount-card">
          <div class="student-discount-badge">
            <span class="student-discount-badge-icon">🎓</span>
            <span class="student-discount-badge-text">学生专属</span>
          </div>
          <div class="student-discount-content">
            <div class="student-discount-title">持学生证享半价优惠</div>
            <div class="student-discount-list">
              <div class="student-discount-item">
                <span class="student-discount-spot">崇圣寺三塔</span>
                <span class="student-discount-save">省37.5元</span>
              </div>
              <div class="student-discount-item">
                <span class="student-discount-spot">苍山索道</span>
                <span class="student-discount-save">半价优惠</span>
              </div>
              <div class="student-discount-item">
                <span class="student-discount-spot">蝴蝶泉</span>
                <span class="student-discount-save">省20元</span>
              </div>
            </div>
            <button class="student-discount-more" @click="$emit('navigate', { index: 2, scrollTo: 'dali-ticket' })">
              查看全部优惠
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域6：行程规划区 -->
    <div id="home-guide-area-itinerary" class="guide-module">
      <div class="guide-module-header">
        <h2 class="guide-module-title">推荐行程</h2>
      </div>
      <div class="guide-module-content">
        <InfoCard
          card-id="home-itinerary"
          card-name="推荐行程"
          :hidden-cards="hiddenCards"
          :closable="false"
          @hide="(id, name) => $emit('hide-card', id, name)"
        >
          <div class="home-itinerary">
            <div class="home-itinerary-header">
              <div class="itinerary-tabs" role="tablist" aria-label="行程选择" ref="tabsRef">
                <button
                  v-for="(option, key) in itineraryOptions"
                  :key="key"
                  ref="tabButtons"
                  :class="['itinerary-tab', { active: activeItinerary === key }]"
                  role="tab"
                  :aria-selected="activeItinerary === key"
                  :aria-controls="'itinerary-' + key"
                  @click="activeItinerary = key"
                >
                  {{ option.label }}
                  <span v-if="option.badge" class="tab-badge">{{ option.badge }}</span>
                </button>
                <div class="tab-indicator" :style="indicatorStyle"></div>
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
      </div>
    </div>

    <!-- 区域7：攻略入口区 -->
    <div id="home-guide-area-guides" class="guide-module">
      <div class="guide-module-header">
        <h2 class="guide-module-title">目的地攻略</h2>
      </div>
      <div class="guide-module-content">
        <div class="destinations-grid">
          <DestinationCard
            v-for="dest in destinations"
            :key="dest.id"
            v-bind="dest"
            @click="handleDestClick($event, dest.goto)"
            @mousedown="createRipple"
          />
        </div>
        <div class="guide-tips-footer">
          <div class="guide-tips-inline">
            <span class="guide-tips-label">出行贴士：</span>
            <span class="guide-tips-item" v-for="tip in travelTips" :key="tip.title">
              <span class="guide-tips-icon">{{ tip.icon }}</span>
              {{ tip.title }}
            </span>
          </div>
          <div class="guide-checklist-inline">
            <span class="guide-checklist-label">必备物品：</span>
            <span class="guide-checklist-tag" v-for="item in checklistItems" :key="item">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域8：交通指南区 -->
    <div id="home-guide-area-traffic" class="guide-module">
      <div class="guide-module-header">
        <h2 class="guide-module-title">省内高铁交通</h2>
      </div>
      <div class="guide-module-content">
        <InfoCard
          card-id="home-transport"
          card-name="省内高铁交通"
          :hidden-cards="hiddenCards"
          @hide="(id, name) => $emit('hide-card', id, name)"
        >
          <div class="home-transport">
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
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import DestinationCard from '../DestinationCard.vue'
import InfoCard from '../InfoCard.vue'
import { destinations, transportInfo, checklistItems, travelTips, itineraryOptions } from '@/data/travelData'

defineProps({
  hiddenCards: Set
})

const emit = defineEmits(['navigate', 'hide-card'])

const activeItinerary = ref('core4')
const tabsRef = ref(null)
const tabButtons = ref([])
const indicatorStyle = ref({})
const checkedItems = ref([])

const safeStorage = {
  getItem (key) {
    try { return localStorage.getItem(key) } catch (e) { return null }
  },
  setItem (key, value) {
    try { localStorage.setItem(key, value) } catch (e) {}
  }
}

const toggleCheckItem = (idx) => {
  const index = checkedItems.value.indexOf(idx)
  if (index > -1) {
    checkedItems.value.splice(index, 1)
  } else {
    checkedItems.value.push(idx)
  }
  safeStorage.setItem('preTripChecklist', JSON.stringify(checkedItems.value))
}

const initChecklist = () => {
  const saved = safeStorage.getItem('preTripChecklist')
  if (saved) {
    try {
      checkedItems.value = JSON.parse(saved)
    } catch (e) {
      checkedItems.value = []
    }
  }
}

const updateIndicator = () => {
  nextTick(() => {
    const tabs = tabsRef.value
    if (!tabs) return

    const activeTab = tabs.querySelector('.itinerary-tab.active')
    if (!activeTab) return

    const tabsRect = tabs.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()

    indicatorStyle.value = {
      left: `${tabRect.left - tabsRect.left}px`,
      width: `${tabRect.width}px`
    }
  })
}

watch(activeItinerary, updateIndicator)

onMounted(() => {
  initChecklist()
  setTimeout(updateIndicator, 100)
})

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
  gap: 0;
  min-height: 0;
  padding-bottom: var(--space-xl);
  padding-left: max(var(--space-md), env(safe-area-inset-left));
  padding-right: max(var(--space-md), env(safe-area-inset-right));
}

.guide-module {
  position: relative;
  padding-top: var(--space-lg);
  padding-bottom: var(--space-md);
}

.guide-module + .guide-module::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--border) 20%, var(--border) 80%, transparent 100%);
}

.guide-module-header {
  margin-bottom: var(--space-md);
}

.guide-module-title {
  font-family: 'LXGW WenKai', serif;
  font-size: var(--text-lg);
  font-weight: 400;
  color: var(--forest);
  letter-spacing: 0.05em;
  margin: 0;
  padding-bottom: var(--space-xs);
  position: relative;
  display: inline-block;
}

.guide-module-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 2rem;
  height: 2px;
  background: var(--sunset);
  border-radius: 1px;
}

.guide-module-content {
  position: relative;
}

.home-intro {
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--forest-light) 0%, var(--sky-light) 100%);
  border-radius: var(--space-md);
}

.home-intro-text {
  font-size: calc(var(--text-sm) * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.8;
  text-align: center;
  font-weight: calc(500 + var(--text-weight-boost, 0));
}

.pre-trip-checklist {
  background: var(--card);
  border: 2px solid var(--forest);
  border-radius: var(--space-md);
  padding: var(--space-md);
}

.checklist-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border);
}

.checklist-icon {
  width: 20px;
  height: 20px;
  color: var(--forest);
  flex-shrink: 0;
}

.checklist-progress {
  margin-left: auto;
  font-size: var(--text-xs);
  color: white;
  background: var(--sunset);
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-sm);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-quart);
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}

.checklist-item:hover {
  background: var(--forest-light);
}

.checklist-item:active {
  transform: scale(0.98);
}

.checklist-item.checked {
  background: var(--forest-light);
  opacity: 0.7;
}

.checklist-item.checked .checklist-item-text {
  text-decoration: line-through;
  color: var(--text-muted);
}

.checklist-checkbox {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.checklist-checkbox-custom {
  width: 22px;
  height: 22px;
  border: 2px solid var(--forest);
  border-radius: var(--space-xs);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-out-quart);
  background: var(--card);
}

.checklist-item.checked .checklist-checkbox-custom {
  background: var(--forest);
  border-color: var(--forest);
}

.checklist-checkbox-custom::after {
  content: '';
  width: 10px;
  height: 6px;
  border: 2px solid white;
  border-top: none;
  border-right: none;
  transform: rotate(-45deg) translate(1px, -1px);
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-out-quart);
}

.checklist-item.checked .checklist-checkbox-custom::after {
  opacity: 1;
}

.checklist-item-text {
  font-size: calc(var(--text-sm) * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.5;
  flex: 1;
}

.checklist-tip {
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  background: var(--forest);
  color: white;
  border-radius: var(--space-sm);
  text-align: center;
  font-size: var(--text-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  animation: tipBounce 0.5s var(--ease-out-quart);
}

@keyframes tipBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.checklist-tip-icon {
  width: 18px;
  height: 18px;
  background: white;
  color: var(--forest);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.quick-start-cards {
  display: flex;
  gap: var(--space-sm);
  width: 100%;
  align-items: flex-start;
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
  transition: box-shadow var(--duration-normal, 250ms) var(--ease-out-quart),
              border-color var(--duration-normal, 250ms) var(--ease-out-quart),
              background var(--duration-normal, 250ms) var(--ease-out-quart);
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
  flex-shrink: 0;
}

.quick-start-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--forest) 0%, var(--sunset) 100%);
  opacity: 0;
  transition: opacity var(--duration-normal, 250ms) var(--ease-out-quart);
  pointer-events: none;
}

.quick-start-card:hover::before {
  opacity: 0.05;
}

.quick-start-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--forest);
  opacity: 0;
  transition: opacity 0.15s ease;
  pointer-events: none;
}

.quick-start-card:active::after {
  opacity: 0.08;
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
  transition: transform 0.2s var(--ease-out-quart);
}

.quick-start-card:hover .quick-start-arrow {
  transform: translateX(4px);
}

.quick-start-card:active .quick-start-arrow {
  transform: translateX(2px);
}

.quick-nav-card {
  background: linear-gradient(135deg, var(--sky-light) 0%, var(--forest-light) 100%);
  border: 2px solid var(--sky);
  border-radius: var(--space-md);
  padding: var(--space-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.quick-nav-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
}

.quick-nav-icon {
  width: 28px;
  height: 28px;
  color: var(--sky);
  flex-shrink: 0;
}

.quick-nav-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quick-nav-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.quick-nav-btn {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--sky);
  color: white;
  border: none;
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) var(--ease-out-quart);
  white-space: nowrap;
  min-height: 44px;
}

.quick-nav-btn:hover {
  background: var(--forest);
  transform: translateX(2px);
}

.quick-nav-btn:active {
  transform: scale(0.98);
}

.quick-nav-btn svg {
  width: 16px;
  height: 16px;
  transition: transform var(--duration-fast) var(--ease-out-quart);
}

.quick-nav-btn:hover svg {
  transform: translateX(4px);
}

.student-discount-card {
  background: linear-gradient(135deg, var(--sunset-soft) 0%, var(--forest-light) 100%);
  border: 2px solid var(--sunset);
  border-radius: var(--space-md);
  padding: var(--space-md);
  position: relative;
  overflow: hidden;
}

.student-discount-card::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: var(--sunset);
  opacity: 0.1;
  border-radius: 50%;
}

.student-discount-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--sunset);
  color: white;
  border-radius: var(--space-lg);
  font-size: var(--text-xs);
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.student-discount-badge-icon {
  font-size: 0.9rem;
}

.student-discount-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text);
  margin-bottom: var(--space-sm);
}

.student-discount-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.student-discount-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-xs) var(--space-sm);
  background: var(--card);
  border-radius: var(--space-sm);
}

.student-discount-spot {
  font-size: 0.8rem;
  color: var(--text);
}

.student-discount-save {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--sunset);
  background: var(--sunset-soft);
  padding: 2px 8px;
  border-radius: var(--space-xs);
}

.student-discount-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  width: 100%;
  padding: var(--space-sm);
  background: var(--sunset);
  color: white;
  border: none;
  border-radius: var(--space-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) var(--ease-out-quart);
  min-height: 44px;
}

.student-discount-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.student-discount-more:active {
  transform: scale(0.98);
}

.student-discount-more svg {
  width: 16px;
  height: 16px;
  transition: transform var(--duration-fast) var(--ease-out-quart);
}

.student-discount-more:hover svg {
  transform: translateX(4px);
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
  align-content: start;
}

.guide-tips-footer {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: var(--earth-light);
  border-radius: var(--space-sm);
}

.guide-tips-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.guide-tips-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.guide-tips-item {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.75rem;
  color: var(--text);
}

.guide-tips-icon {
  font-size: 0.9rem;
}

.guide-checklist-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
}

.guide-checklist-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
}

.guide-checklist-tag {
  background: var(--forest-light);
  color: var(--forest);
  font-size: 0.7rem;
  padding: var(--space-2xs) var(--space-xs);
  border-radius: 1rem;
  font-weight: 500;
}

.home-itinerary {
  padding: var(--space-md);
  margin-top: var(--space-sm);
}

.home-itinerary-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: var(--space-sm);
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.itinerary-tabs {
  display: flex;
  gap: var(--space-2xs);
  flex-wrap: wrap;
  position: relative;
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
  z-index: 1;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: var(--forest);
  border-radius: 1px;
  transition: left 0.3s var(--ease-out-quart), width 0.3s var(--ease-out-quart);
  pointer-events: none;
  z-index: 0;
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
  font-size: 0.75rem;
  font-weight: calc(600 + var(--text-weight-boost, 0));
  color: var(--text);
  white-space: nowrap;
}

.itinerary-day-activity {
  font-size: 0.65rem;
  font-weight: calc(400 + var(--text-weight-boost, 0));
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

.home-transport {
  padding: var(--space-md);
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
  margin-top: var(--space-sm);
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 50%, transparent 70%);
  transform: scale(0);
  animation: rippleEffect 0.6s var(--ease-out-quart);
  pointer-events: none;
}

@keyframes rippleEffect {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
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
  .guide-checklist-tag {
    font-size: 0.7rem;
    padding: var(--space-2xs) var(--space-xs);
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
