<template>
  <section class="section home-section">
    <!-- 主推荐：大理 -->
    <div class="featured-destination" @click="$emit('navigate', 2)">
      <div class="featured-image">
        <img src="/images/spots/dali.jpg" alt="大理" referrerpolicy="no-referrer" loading="lazy">
        <div class="featured-overlay"></div>
      </div>
      <div class="featured-content">
        <span class="featured-tag">推荐首选</span>
        <h2 class="featured-title">大理</h2>
        <p class="featured-subtitle">苍山洱海 · 风花雪月</p>
        <p class="featured-desc">喜洲油菜花、洱海骑行、古城樱花</p>
        <div class="featured-meta">
          <span class="featured-duration">2天</span>
          <span class="featured-budget">¥250-600</span>
        </div>
      </div>
      <span class="featured-hint">查看攻略</span>
    </div>

    <!-- 其他目的地 + 地图 -->
    <div class="destinations-row">
      <div class="dest-mini" @click="$emit('navigate', 1)">
        <div class="dest-mini-image">
          <img src="/images/spots/dounan.jpg" alt="斗南花市" referrerpolicy="no-referrer" loading="lazy">
        </div>
        <div class="dest-mini-content">
          <span class="dest-mini-name">斗南花市</span>
          <span class="dest-mini-location">昆明 · 半天</span>
        </div>
      </div>
      <div class="dest-mini" @click="$emit('navigate', 3)">
        <div class="dest-mini-image">
          <img src="/images/spots/lijiang.jpg" alt="丽江" referrerpolicy="no-referrer" loading="lazy">
        </div>
        <div class="dest-mini-content">
          <span class="dest-mini-name">丽江</span>
          <span class="dest-mini-location">古城雪山 · 2天</span>
        </div>
      </div>
      <div class="dest-mini" @click="$emit('navigate', 4)">
        <div class="dest-mini-image">
          <img src="/images/spots/shangri.jpg" alt="香格里拉" referrerpolicy="no-referrer" loading="lazy">
        </div>
        <div class="dest-mini-content">
          <span class="dest-mini-name">香格里拉</span>
          <span class="dest-mini-location">藏地风光 · 2天</span>
        </div>
      </div>
      <div class="dest-mini dest-mini-map" @click="$emit('navigate', 5)">
        <div class="dest-mini-icon dest-mini-icon-image">
          <img src="/images/icons/map-nav-cute.jpg" alt="地图">
        </div>
        <div class="dest-mini-content">
          <span class="dest-mini-name">地图</span>
          <span class="dest-mini-location">全部地点</span>
        </div>
      </div>
    </div>

    <!-- 快捷信息条 -->
    <div class="quick-info-bar">
      <div class="quick-info-item" @click.stop="$emit('navigate', { index: 2, expandModule: 'info' })">
        <span class="quick-info-icon">🎓</span>
        <span class="quick-info-text">大理景点学生证享半价</span>
        <span class="quick-info-action">查看优惠</span>
      </div>
    </div>

    <!-- 出发检查清单 -->
    <Transition name="checklist-fade">
      <div v-if="!checklistHidden" class="home-module checklist-module" :class="{ 'is-complete': isChecklistComplete }" data-onboarding="checklist">
        <div class="home-module-header">
          <h2 class="home-module-title">出发前检查</h2>
          <span class="checklist-count" :class="{ 'count-complete': checkedItems.length === checklistItems.length }">{{ checkedItems.length }}/{{ checklistItems.length }}</span>
        </div>
        <div class="home-module-content">
          <div class="checklist-compact">
            <label v-for="(item, idx) in checklistItems" :key="idx" class="checklist-compact-item" :class="{ checked: checkedItems.includes(idx) }" :style="{ '--item-index': idx }">
              <input
                type="checkbox"
                :checked="checkedItems.includes(idx)"
                @change="toggleCheckItem(idx)"
                class="checklist-checkbox"
              >
              <span class="checklist-checkbox-custom">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </span>
              <span class="checklist-compact-text">{{ item }}</span>
            </label>
          </div>
          <Transition name="complete-reveal">
            <div class="checklist-complete" v-if="isChecklistComplete">
              <div class="complete-celebration">
                <span class="celebration-icon">🎉</span>
                <span class="celebration-text">准备就绪！祝你旅途愉快</span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- 行程参考 -->
    <div class="home-module itinerary-module">
      <div class="home-module-header">
        <h2 class="home-module-title">推荐行程</h2>
      </div>
      <div class="home-module-content">
        <div class="itinerary-tabs-compact">
          <button
            v-for="(option, key) in itineraryOptions"
            :key="key"
            :class="['itinerary-tab-compact', { active: activeItinerary === key, highlight: option.highlight }]"
            @click="activeItinerary = key"
          >
            <span v-if="option.badge" class="tab-badge">{{ option.badge }}</span>
            {{ option.label }}
          </button>
        </div>

        <!-- 详细行程视图 -->
        <div v-if="currentItineraryDetail" class="itinerary-detail">
          <p class="itinerary-detail-desc">{{ currentItineraryDetail.desc }}</p>

          <!-- 每日行程卡片 -->
          <div class="itinerary-days">
            <div
              v-for="(dayKey, index) in currentItineraryDayKeys"
              :key="dayKey"
              class="itinerary-day-card"
              :class="{ expanded: expandedDays[dayKey] }"
            >
              <div class="itinerary-day-header" @click="toggleDay(dayKey)">
                <div class="itinerary-day-left">
                  <span class="itinerary-day-num">{{ index + 1 }}</span>
                  <div class="itinerary-day-info">
                    <span class="itinerary-day-badge">{{ currentItineraryDetail[dayKey][0]?.dayBadge || `D${index + 1}` }}</span>
                    <span class="itinerary-day-title">{{ currentItineraryDetail.days?.[index]?.title || itineraryOptions[activeItinerary].days[index]?.place }}</span>
                  </div>
                </div>
                <div class="itinerary-day-right">
                  <span class="itinerary-day-places">{{ getDayPlacesBrief(currentItineraryDetail[dayKey]) }}</span>
                  <svg class="itinerary-day-toggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
              <div class="itinerary-day-content">
                <div class="itinerary-timeline">
                  <div v-for="(item, idx) in currentItineraryDetail[dayKey]" :key="idx" class="timeline-item" :style="{ '--item-index': idx }">
                    <div class="timeline-dot"></div>
                    <span class="timeline-time">{{ item.time }}</span>
                    <div class="timeline-content">
                      <span class="timeline-place">{{ item.place }}</span>
                      <span class="timeline-event">{{ item.event }}</span>
                      <span v-if="item.tip" class="timeline-tip">{{ item.tip }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 贴士区域 -->
          <div class="itinerary-tips" v-if="currentItineraryDetail.tips">
            <div class="itinerary-tips-header">
              <span class="tips-header-icon">💡</span>
              <span class="tips-header-title">实用贴士</span>
            </div>
            <div class="itinerary-tips-list">
              <div v-for="(tip, idx) in currentItineraryDetail.tips" :key="idx" class="itinerary-tip-item">
                <span class="tip-icon">{{ tip.icon }}</span>
                <span class="tip-text">{{ tip.text }}</span>
              </div>
            </div>
          </div>

          <!-- 可选延申 -->
          <div class="itinerary-extend" v-if="currentItineraryDetail.extend">
            <div class="extend-header">
              <span class="extend-icon">➕</span>
              <span class="extend-title">{{ currentItineraryDetail.extend.title || '可选延申' }}</span>
            </div>
            <p class="extend-text">{{ currentItineraryDetail.extend.desc }}</p>
          </div>
        </div>

        <!-- 无详细内容的简洁视图 -->
        <template v-else>
          <div class="itinerary-flow-compact">
            <template v-for="(day, index) in itineraryOptions[activeItinerary].days" :key="day.num">
              <div class="flow-day">
                <span class="flow-day-num">{{ day.num }}</span>
                <span class="flow-day-place">{{ day.place }}</span>
              </div>
              <span v-if="index < itineraryOptions[activeItinerary].days.length - 1" class="flow-arrow">→</span>
            </template>
          </div>
          <div class="itinerary-budget-compact">
            <span class="budget-label">人均</span>
            <span class="budget-value">{{ itineraryOptions[activeItinerary].budget }}</span>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed, reactive } from 'vue'
import { checklistItems, itineraryOptions } from '@/data/travelData'

const props = defineProps({
  hiddenCards: Set
})

const emit = defineEmits(['navigate', 'hide-card'])

const activeItinerary = ref('weekend')
const checkedItems = ref([])
const hasAnimatedCompletion = ref(false)
const expandedDays = reactive({})

const CHECKLIST_CARD_ID = 'home-departure-checklist'

const toggleDay = (dayKey) => {
  expandedDays[dayKey] = !expandedDays[dayKey]
  setTimeout(() => {
    emit('module-toggle')
  }, 350)
}

const getDayPlacesBrief = (items) => {
  if (!items || items.length === 0) return ''
  const places = items.slice(0, 3).map(item => item.place.replace(/[→→]/g, '').trim())
  return places.join(' → ')
}

const safeStorage = {
  getItem (key) {
    try { return localStorage.getItem(key) } catch (e) { return null }
  },
  setItem (key, value) {
    try { localStorage.setItem(key, value) } catch (e) {}
  }
}

const isChecklistComplete = computed(() => {
  return checkedItems.value.length === checklistItems.length && checklistItems.length > 0
})

const checklistHidden = computed(() => {
  return props.hiddenCards?.has(CHECKLIST_CARD_ID) ?? false
})

const currentItineraryDetail = computed(() => {
  return itineraryOptions[activeItinerary.value]?.detail || null
})

const currentItineraryDayKeys = computed(() => {
  if (!currentItineraryDetail.value) return []
  const keys = []
  let dayIndex = 1
  while (currentItineraryDetail.value[`d${dayIndex}`]) {
    keys.push(`d${dayIndex}`)
    dayIndex++
  }
  return keys
})

watch(activeItinerary, () => {
  setTimeout(() => {
    emit('module-toggle')
  }, 50)
})

const toggleCheckItem = (idx) => {
  const index = checkedItems.value.indexOf(idx)
  if (index > -1) {
    checkedItems.value.splice(index, 1)
  } else {
    checkedItems.value.push(idx)
  }
  safeStorage.setItem('preTripChecklist', JSON.stringify(checkedItems.value))
}

watch(isChecklistComplete, (complete) => {
  if (complete && !checklistHidden.value && !hasAnimatedCompletion.value) {
    hasAnimatedCompletion.value = true
    safeStorage.setItem('preTripChecklistCompleted', 'true')
    setTimeout(() => {
      emit('hide-card', CHECKLIST_CARD_ID, '出发前检查')
    }, 2000)
  }
})

watch(() => props.hiddenCards?.has(CHECKLIST_CARD_ID), (isHidden, wasHidden) => {
  if (wasHidden && !isHidden) {
    checkedItems.value = []
    hasAnimatedCompletion.value = false
    safeStorage.setItem('preTripChecklist', '[]')
    safeStorage.setItem('preTripChecklistCompleted', 'false')
  }
})

const initChecklist = () => {
  const saved = safeStorage.getItem('preTripChecklist')
  if (saved) {
    try {
      checkedItems.value = JSON.parse(saved)
    } catch (e) {
      checkedItems.value = []
    }
  }

  if (checklistHidden.value) {
    hasAnimatedCompletion.value = true
  }
}

onMounted(() => {
  initChecklist()
})
</script>

<style scoped>
@import '../slides-common.css';

.home-section {
  padding: var(--space-md);
  padding-top: var(--space-sm);
  padding-bottom: var(--space-3xl);
}

/* ===== 主推荐：大理 ===== */
.featured-destination {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: var(--space-md);
  cursor: pointer;
  aspect-ratio: 16 / 10;
  background: var(--earth-light);
}

.featured-image {
  position: absolute;
  inset: 0;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-out-quart);
}

.featured-destination:hover .featured-image img {
  transform: scale(1.05);
}

.featured-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, transparent 70%);
}

.featured-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-lg);
  color: white;
}

.featured-tag {
  display: inline-block;
  background: var(--sunset);
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: var(--space-xs);
  letter-spacing: 0.05em;
}

.featured-title {
  font-family: 'LXGW WenKai', serif;
  font-size: 1.75rem;
  font-weight: 400;
  margin: 0 0 4px 0;
  letter-spacing: 0.1em;
}

.featured-subtitle {
  font-size: 0.85rem;
  opacity: 0.9;
  margin: 0 0 var(--space-xs) 0;
}

.featured-desc {
  font-size: 0.75rem;
  opacity: 0.8;
  margin: 0 0 var(--space-sm) 0;
  display: none;
}

.featured-meta {
  display: flex;
  gap: var(--space-md);
}

.featured-duration,
.featured-budget {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.9;
}

.featured-hint {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 0.75rem;
  padding: 6px 12px;
  border-radius: 20px;
  opacity: 0;
  transform: translateY(-4px);
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.featured-destination:hover .featured-hint {
  opacity: 1;
  transform: translateY(0);
}

/* ===== 其他目的地行 ===== */
.destinations-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.dest-mini {
  background: var(--card);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-quart);
  border: 1px solid var(--border);
}

.dest-mini:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: var(--forest);
}

.dest-mini:active {
  transform: scale(0.98);
}

.dest-mini-image {
  aspect-ratio: 1;
  overflow: hidden;
}

.dest-mini-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ease-out-quart);
}

.dest-mini:hover .dest-mini-image img {
  transform: scale(1.1);
}

.dest-mini-content {
  padding: var(--space-xs);
  text-align: center;
}

.dest-mini-name {
  display: block;
  font-family: 'LXGW WenKai', serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 2px;
}

.dest-mini-location {
  display: block;
  font-size: 0.65rem;
  color: var(--text-muted);
}

.dest-mini-map {
  background: linear-gradient(135deg, #fef3e2 0%, #fce7d6 100%);
  border-color: #f5c6a5;
}

.dest-mini-map .dest-mini-name {
  color: #d4845f;
}

.dest-mini-icon {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--forest);
  overflow: hidden;
}

.dest-mini-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.dest-mini-icon-image {
  background: transparent;
  padding: 4px;
}

.dest-mini-icon-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* ===== 快捷信息条 ===== */
.quick-info-bar {
  display: flex;
  align-items: center;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: var(--space-sm) var(--space-md);
  margin-bottom: var(--space-lg);
}

.quick-info-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  flex: 1;
  cursor: pointer;
}

.quick-info-icon {
  font-size: 1rem;
}

.quick-info-text {
  font-size: calc(0.85rem * var(--text-scale, 1));
  color: var(--text);
}

.quick-info-action {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--forest);
  font-weight: 600;
  padding: 4px 10px;
  background: var(--forest-light);
  border-radius: 6px;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.quick-info-action:hover {
  background: var(--forest);
  color: white;
}

/* ===== 模块通用 ===== */
.home-module {
  margin-bottom: var(--space-lg);
  background: var(--card);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.home-module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
}

.home-module-title {
  font-family: 'LXGW WenKai', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.home-module-content {
  padding: var(--space-md);
}

.checklist-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--forest);
  background: var(--forest-light);
  padding: 4px 10px;
  border-radius: 10px;
}

/* ===== 检查清单紧凑版 ===== */
.checklist-module {
  transition: border-color 300ms var(--ease-out-quart),
              box-shadow 300ms var(--ease-out-quart);
}

.checklist-module.is-complete {
  border-color: var(--forest);
  box-shadow: 0 0 0 1px var(--forest-light);
}

.checklist-compact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xs);
}

.checklist-compact-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs);
  border-radius: 8px;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out-quart),
              transform var(--duration-fast) var(--ease-out-quart);
}

.checklist-compact-item:hover {
  background: var(--earth-light);
}

.checklist-compact-item:active {
  transform: scale(0.98);
}

.checklist-checkbox {
  display: none;
}

.checklist-checkbox-custom {
  width: 22px;
  height: 22px;
  border: 2px solid var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 200ms var(--ease-out-quart);
  position: relative;
  overflow: hidden;
}

.checklist-checkbox-custom::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--forest);
  transform: scale(0);
  opacity: 0;
  transition: transform 200ms var(--ease-out-quart),
              opacity 200ms var(--ease-out-quart);
}

.checklist-checkbox-custom .check-icon {
  width: 14px;
  height: 14px;
  color: white;
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset 250ms var(--ease-out-quart) 50ms;
}

.checklist-compact-item.checked .checklist-checkbox-custom {
  border-color: var(--forest);
  background: var(--forest);
}

.checklist-compact-item.checked .checklist-checkbox-custom::before {
  transform: scale(2);
  opacity: 0;
}

.checklist-compact-item.checked .checklist-checkbox-custom .check-icon {
  stroke-dashoffset: 0;
}

.checklist-compact-text {
  font-size: calc(0.85rem * var(--text-scale, 1));
  color: var(--text);
  transition: color var(--duration-fast) var(--ease-out-quart);
}

.checklist-compact-item.checked .checklist-compact-text {
  color: var(--text-muted);
  text-decoration: line-through;
}

.checklist-count.count-complete {
  background: var(--forest);
  color: white;
}

.checklist-complete {
  margin-top: var(--space-md);
  overflow: hidden;
}

.complete-celebration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: linear-gradient(135deg, var(--forest-light) 0%, var(--earth-light) 100%);
  border-radius: 12px;
  border: 1px solid var(--forest);
}

.celebration-icon {
  font-size: 1.25rem;
  animation: celebrate-bounce 600ms var(--ease-out-quart);
}

.celebration-text {
  color: var(--forest);
  font-weight: 600;
  font-size: calc(0.9rem * var(--text-scale, 1));
}

/* Checklist fade transition */
.checklist-fade-enter-active,
.checklist-fade-leave-active {
  transition: opacity 400ms var(--ease-out-quart),
              transform 400ms var(--ease-out-quart);
}

.checklist-fade-enter-from,
.checklist-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-16px);
}

/* Complete reveal transition */
.complete-reveal-enter-active {
  transition: opacity 300ms var(--ease-out-quart),
              transform 300ms var(--ease-out-quart);
}

.complete-reveal-leave-active {
  transition: opacity 200ms var(--ease-out-quart),
              transform 200ms var(--ease-out-quart);
}

.complete-reveal-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.complete-reveal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes celebrate-bounce {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.2) rotate(-5deg); }
  50% { transform: scale(1.1) rotate(5deg); }
  75% { transform: scale(1.15) rotate(-3deg); }
}

/* ===== 行程紧凑版 ===== */
.itinerary-tabs-compact {
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
  overflow-x: auto;
  scrollbar-width: none;
}

.itinerary-tabs-compact::-webkit-scrollbar {
  display: none;
}

.itinerary-tab-compact {
  padding: var(--space-xs) var(--space-md);
  background: var(--earth-light);
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.itinerary-tab-compact:hover {
  background: var(--forest-light);
  color: var(--forest);
}

.itinerary-tab-compact.active {
  background: var(--forest);
  color: white;
}

.itinerary-flow-compact {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.flow-day {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--forest-light);
  border-radius: 8px;
}

.flow-day-num {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--forest);
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
}

.flow-day-place {
  font-size: calc(0.85rem * var(--text-scale, 1));
  font-weight: 500;
  color: var(--text);
}

.flow-arrow {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.itinerary-budget-compact {
  display: flex;
  align-items: baseline;
  gap: var(--space-xs);
}

.itinerary-budget-compact .budget-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.itinerary-budget-compact .budget-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--sunset);
}

/* ===== 行程详细版 ===== */
.itinerary-tab-compact.highlight {
  position: relative;
  background: var(--sunset-soft);
  border: 1px solid var(--sunset);
  color: var(--sunset);
}

.itinerary-tab-compact.highlight.active {
  background: var(--sunset);
  border-color: var(--sunset);
  color: white;
}

.tab-badge {
  font-size: 0.65rem;
  background: var(--sunset);
  color: white;
  padding: 1px 5px;
  border-radius: 4px;
  margin-right: var(--space-2xs);
  font-weight: 600;
}

.itinerary-tab-compact.active .tab-badge {
  background: white;
  color: var(--sunset);
}

.itinerary-detail {
  margin-top: var(--space-md);
}

.itinerary-detail-desc {
  font-size: calc(0.8rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
  padding: var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-sm);
  line-height: 1.6;
}

/* 每日行程卡片 */
.itinerary-days {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.itinerary-day-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--space-md);
  overflow: hidden;
  transition: border-color var(--duration-fast) var(--ease-out-quart);
}

.itinerary-day-card:hover {
  border-color: var(--forest);
}

.itinerary-day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  cursor: pointer;
  user-select: none;
  transition: background var(--duration-fast) var(--ease-out-quart);
}

.itinerary-day-header:hover {
  background: var(--forest-light);
}

.itinerary-day-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.itinerary-day-num {
  width: 28px;
  height: 28px;
  background: var(--forest);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.itinerary-day-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.itinerary-day-badge {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--forest);
  background: var(--forest-light);
  padding: 1px 6px;
  border-radius: 4px;
  width: fit-content;
}

.itinerary-day-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.itinerary-day-right {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.itinerary-day-places {
  font-size: 0.7rem;
  color: var(--text-muted);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: none;
}

@media (min-width: 400px) {
  .itinerary-day-places {
    display: inline;
  }
}

.itinerary-day-toggle {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  transition: transform 0.3s var(--ease-out-quart);
  flex-shrink: 0;
}

.itinerary-day-card.expanded .itinerary-day-toggle {
  transform: rotate(180deg);
}

.itinerary-day-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s var(--ease-out-quart);
}

.itinerary-day-card.expanded .itinerary-day-content {
  max-height: 1000px;
}

.itinerary-timeline {
  padding: var(--space-sm) var(--space-md);
  border-top: 1px solid var(--border);
}

.timeline-item {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-xs) 0;
  position: relative;
  opacity: 0;
  transform: translateY(8px);
  animation: timelineReveal 0.3s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--item-index, 0) * 50ms);
}

@keyframes timelineReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-dot {
  width: 8px;
  height: 8px;
  background: var(--forest);
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.timeline-time {
  font-size: 0.7rem;
  color: var(--sunset);
  min-width: 60px;
  flex-shrink: 0;
  font-weight: 600;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.timeline-place {
  font-size: calc(0.8rem * var(--text-scale, 1));
  font-weight: 600;
  color: var(--forest);
}

.timeline-event {
  font-size: calc(0.72rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.5;
}

.timeline-tip {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 2px;
  padding-left: var(--space-xs);
  border-left: 2px solid var(--border);
}

/* 贴士区域 */
.itinerary-tips {
  margin-top: var(--space-lg);
  background: var(--forest-light);
  border-radius: var(--space-md);
  overflow: hidden;
}

.itinerary-tips-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: rgba(76, 175, 80, 0.1);
}

.tips-header-icon {
  font-size: 1rem;
}

.tips-header-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--forest);
}

.itinerary-tips-list {
  padding: var(--space-sm) var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.itinerary-tip-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
}

.itinerary-tip-item .tip-icon {
  flex-shrink: 0;
  font-size: 0.85rem;
}

.itinerary-tip-item .tip-text {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.5;
}

/* 可选延申 */
.itinerary-extend {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: var(--earth-light);
  border-radius: var(--space-md);
  border: 1px dashed var(--border);
}

.extend-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-xs);
}

.extend-icon {
  font-size: 0.85rem;
}

.extend-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--sunset);
}

.extend-text {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .checklist-compact {
    grid-template-columns: 1fr;
  }

  .destinations-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .featured-title {
    font-size: 1.4rem;
  }

  .featured-desc {
    display: none;
  }

  .itinerary-day-header {
    padding: var(--space-xs) var(--space-sm);
  }

  .itinerary-day-title {
    font-size: 0.8rem;
  }

  .itinerary-day-places {
    display: none;
  }

  .itinerary-timeline {
    padding: var(--space-xs) var(--space-sm);
  }

  .timeline-item {
    flex-direction: column;
    gap: 2px;
  }

  .timeline-time {
    font-size: 0.65rem;
  }
}

@media (min-width: 768px) {
  .featured-destination {
    aspect-ratio: 21 / 9;
  }

  .featured-desc {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dest-mini,
  .featured-destination,
  .itinerary-tab-compact,
  .checklist-compact-item,
  .checklist-checkbox-custom,
  .checklist-module,
  .itinerary-day-card,
  .itinerary-day-content,
  .itinerary-day-toggle,
  .timeline-item {
    transition: none;
    animation: none;
  }

  .itinerary-day-card.expanded .itinerary-day-content {
    max-height: none;
  }

  .featured-image img,
  .dest-mini-image img {
    transition: none;
  }

  .celebration-icon {
    animation: none;
  }

  .checklist-checkbox-custom .check-icon {
    stroke-dashoffset: 0;
  }

  .checklist-fade-enter-active,
  .checklist-fade-leave-active,
  .complete-reveal-enter-active,
  .complete-reveal-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
