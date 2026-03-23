<template>
  <section class="section">
      <div class="section-header">
        <div class="section-number">{{ data.number }}</div>
        <h2 class="section-title title-style-petal">{{ data.title }}</h2>
        <p class="section-desc">{{ data.desc }}</p>
      </div>

      <InfoCard
        card-id="dali-route-overview"
        card-name="大理路线总览"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="route-overview fade-in">
          <div class="route-overview-title">
            <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            2天路线总览
          </div>
          <div class="route-overview-days">
            <div class="route-overview-day">
              <span class="route-overview-badge day1">Day1</span>
              <div class="route-overview-flow">
                <span class="route-overview-point">大理古城</span>
                <span class="route-overview-arrow">→</span>
                <span class="route-overview-point">喜洲古镇</span>
                <span class="route-overview-arrow">→</span>
                <span class="route-overview-point">洱海生态廊道</span>
                <span class="route-overview-arrow">→</span>
                <span class="route-overview-point end">古城夜景</span>
              </div>
            </div>
            <div class="route-overview-day">
              <span class="route-overview-badge day2">Day2</span>
              <div class="route-overview-flow">
                <span class="route-overview-point">大理古城</span>
                <span class="route-overview-arrow">→</span>
                <span class="route-overview-point">双廊古镇</span>
                <span class="route-overview-arrow">→</span>
                <span class="route-overview-point">海东日落</span>
                <span class="route-overview-arrow">→</span>
                <span class="route-overview-point end">返回古城</span>
              </div>
            </div>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="dali-route-detail"
        card-name="大理详细路线"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="route-detail" :class="{ collapsed: routeDetailCollapsed }">
          <button class="route-detail-toggle" @click="toggleRouteDetail" :aria-expanded="!routeDetailCollapsed">
            <span class="route-detail-toggle-icon">📅</span>
            <span class="route-detail-toggle-text">{{ routeDetailCollapsed ? '展开详细时间线' : '收起详细时间线' }}</span>
            <svg class="route-detail-toggle-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <div class="route-detail-content">
            <div class="route-detail-inner">
              <div class="route-day-section">
                <div class="route-day-header">
                  <span class="route-day-badge day1">Day1</span>
                  <h4 class="route-day-title">{{ data.routeDetail?.day1?.title || '海西精华线' }}</h4>
                </div>
                <div class="route-timeline">
                  <div
                    class="route-timeline-item"
                    v-for="(item, idx) in data.routeDetail?.day1?.items"
                    :key="idx"
                    :class="{ optional: item.optional }"
                  >
                    <span class="timeline-time">{{ item.time }}</span>
                    <span class="timeline-dot"></span>
                    <span class="timeline-event" v-html="item.event"></span>
                  </div>
                </div>
              </div>

              <div class="route-day-section">
                <div class="route-day-header">
                  <span class="route-day-badge day2">Day2</span>
                  <h4 class="route-day-title">{{ data.routeDetail?.day2?.title || '海东慢游线' }}</h4>
                </div>
                <div class="route-timeline">
                  <div
                    class="route-timeline-item"
                    v-for="(item, idx) in data.routeDetail?.day2?.items"
                    :key="idx"
                  >
                    <span class="timeline-time">{{ item.time }}</span>
                    <span class="timeline-dot"></span>
                    <span class="timeline-event" v-html="item.event"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </InfoCard>

      <div class="spot-group">
        <div
          class="spot-with-route fade-in"
          v-for="(spot, idx) in data.spots"
          :key="spot.name"
          :style="{ '--delay': idx * 50 }"
        >
          <div class="spot" @mousedown="createRipple">
            <h3 class="spot-name">
              <span class="spot-dot"></span>
              {{ spot.name }}
              <span class="spot-highlight-tag">{{ spot.tag || '免费' }}</span>
              <button
                class="spot-map-btn"
                @click.stop="$emit('open-map', spot.name)"
                :aria-label="'在地图上查看' + spot.name"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </button>
            </h3>
            <p class="spot-highlight">{{ spot.highlight }}</p>
            <div class="spot-meta">
              <span class="spot-transport">{{ spot.transport }}</span>
              <span class="spot-time" v-if="spot.openTime">{{ spot.openTime }}</span>
            </div>
          </div>

          <div class="spot-photo-grid">
            <div
              class="photo-item"
              :class="{ 'img-loaded': loadedImages[photo.src], 'img-error': imgErrors[photo.src] }"
              v-for="photo in spot.photos"
              :key="photo.label"
              @click="$emit('open-lightbox', photo.src, photo.label)"
              @mousedown="createRipple"
            >
              <img
                :src="photo.src"
                :alt="photo.label"
                loading="lazy"
                referrerpolicy="no-referrer"
                @load="handleImageLoad(photo.src)"
                @error="handleImageError(photo.src)"
              >
              <span class="photo-label">{{ photo.label }}</span>
              <div class="img-fallback" v-if="imgErrors[photo.src]">
                <span>🖼️</span>
                <span>图片加载失败</span>
              </div>
            </div>
          </div>

          <div class="spot-cycling" v-if="spot.cycling">
            <button class="expandable-toggle" @click="toggleSpotDetail('cycling-' + idx)" :aria-expanded="isSpotDetailExpanded('cycling-' + idx)">
              <span class="expandable-icon">🚴</span>
              <span>骑行分段</span>
              <svg class="expandable-arrow" :class="{ collapsed: !isSpotDetailExpanded('cycling-' + idx) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div class="expandable-content" :class="{ collapsed: !isSpotDetailExpanded('cycling-' + idx) }">
              <div>
                <div class="cycling-routes">
                  <div class="cycling-route" v-for="route in spot.cycling.routes" :key="route.name">
                    <div class="cycling-route-name">{{ route.name }}</div>
                    <div class="cycling-route-info">
                      <span>{{ route.distance }}</span>
                      <span>{{ route.time }}</span>
                    </div>
                    <div class="cycling-route-tip">{{ route.tip }}</div>
                  </div>
                </div>
                <div class="cycling-tips">{{ spot.cycling.tips }}</div>
              </div>
            </div>
          </div>

          <div class="spot-photo-spots" v-if="spot.photoSpots">
            <button class="expandable-toggle" @click="toggleSpotDetail('photo-' + idx)" :aria-expanded="isSpotDetailExpanded('photo-' + idx)">
              <span class="expandable-icon">📷</span>
              <span>打卡机位</span>
              <svg class="expandable-arrow" :class="{ collapsed: !isSpotDetailExpanded('photo-' + idx) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div class="expandable-content" :class="{ collapsed: !isSpotDetailExpanded('photo-' + idx) }">
              <div>
                <div class="photo-spots-list">
                  <div class="photo-spot-item" v-for="ps in spot.photoSpots" :key="ps.name">
                    <span class="photo-spot-name">{{ ps.name }}</span>
                    <span class="photo-spot-tip" v-if="ps.tip">{{ ps.tip }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InfoCard
        card-id="dali-practical"
        card-name="大理住宿美食"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="practical-section fade-in">
          <div class="practical-Stay">
            <div class="practical-section-title">🏨 住宿推荐</div>
            <div class="stay-groups">
              <div class="stay-group" v-for="group in data.accommodations" :key="group.category">
                <div class="stay-group-label">{{ group.category }}</div>
                <div class="stay-items">
                  <div class="stay-item" v-for="item in group.items" :key="item.name">
                    <div class="stay-item-header">
                      <span class="stay-item-name">{{ item.name }}</span>
                      <span class="stay-item-price">{{ item.price }}</span>
                    </div>
                    <div class="stay-item-location">{{ item.location }}</div>
                    <div class="stay-item-highlights">{{ item.highlights }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="practical-food">
            <div class="practical-section-title">🍜 必吃美食</div>
            <div class="food-items">
              <div class="food-item-compact" v-for="food in data.foods" :key="food.name">
                <div class="food-item-header">
                  <span class="food-item-name">{{ food.name }}</span>
                  <span class="food-item-price">{{ food.price }}</span>
                </div>
                <div class="food-item-shops">推荐：{{ food.shops }}</div>
                <div class="food-item-tip" v-if="food.tip">{{ food.tip }}</div>
              </div>
            </div>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="dali-ticket"
        card-name="大理门票&预约"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="ticket-section fade-in">
          <div class="ticket-header">
            <span class="ticket-label">🎫 学生票（持学生证）</span>
          </div>
          <div class="ticket-list">
            <div class="ticket-item-detail" v-for="item in data.studentDiscounts" :key="item.spot">
              <div class="ticket-item-row">
                <span class="ticket-spot-name">{{ item.spot }}</span>
                <span class="ticket-price-row">
                  <span class="ticket-full">{{ item.fullPrice }}</span>
                  <span class="ticket-arrow">→</span>
                  <span class="ticket-student">{{ item.studentPrice }}</span>
                </span>
              </div>
              <div class="ticket-item-note" v-if="item.note">{{ item.note }}</div>
            </div>
          </div>
          <div class="ticket-booking">
            <div class="ticket-booking-title">📅 预约信息</div>
            <div class="ticket-booking-item" v-for="item in data.bookingInfo" :key="item.spot" :class="{ important: item.important }">
              <strong>{{ item.spot }}</strong>：{{ item.note }}
            </div>
          </div>
          <div class="ticket-note">大理古城、洱海廊道、喜洲古镇免费开放</div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="dali-budget"
        card-name="大理预算参考"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="simple-info fade-in">
          <div class="simple-info-title"><span class="emoji" aria-hidden="true">💰</span> 预算参考（2天）</div>
          <div class="simple-info-content">
            <strong>常规版约600元：</strong>住宿150元+餐饮150元+环湖交通100元+体验项目100元<br>
            <strong>经济版约250元：</strong>青旅住宿+公交出行+只逛免费景点
          </div>
        </div>
      </InfoCard>

      <div class="warning-box fade-in">
        <strong>避坑：</strong>别信"50元环洱海一日游"；别买古城银饰玉石；租车问清续航和隐藏费用。
      </div>
    </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import InfoCard from '../InfoCard.vue'

defineProps({
  data: Object,
  hiddenCards: Set
})

defineEmits(['hide-card', 'open-lightbox', 'open-map'])

const routeDetailCollapsed = ref(true)
const spotDetailCollapsed = reactive({})
const imgErrors = reactive({})
const loadedImages = reactive({})

const safeStorage = {
  getItem (key) {
    try { return localStorage.getItem(key) } catch (e) { return null }
  },
  setItem (key, value) {
    try { localStorage.setItem(key, value) } catch (e) {}
  }
}

const toggleRouteDetail = () => {
  routeDetailCollapsed.value = !routeDetailCollapsed.value
  safeStorage.setItem('routeDetailCollapsed', routeDetailCollapsed.value)
}

const toggleSpotDetail = (key) => {
  spotDetailCollapsed[key] = !spotDetailCollapsed[key]
}

const isSpotDetailExpanded = (key) => {
  return spotDetailCollapsed[key] === true
}

const initRouteDetailState = () => {
  const saved = safeStorage.getItem('routeDetailCollapsed')
  if (saved === 'true') {
    routeDetailCollapsed.value = true
  }
}

const createRipple = (event) => {
  const element = event.currentTarget
  const ripple = document.createElement('span')
  ripple.classList.add('ripple')
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2 + 'px'
  ripple.style.top = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2 + 'px'
  element.appendChild(ripple)
  setTimeout(() => ripple.remove(), 500)
}

const handleImageLoad = (src) => {
  loadedImages[src] = true
}

const handleImageError = (src) => {
  imgErrors[src] = true
}

onMounted(() => {
  initRouteDetailState()

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

.route-overview {
  background: var(--card);
  border: 2px solid var(--forest);
  border-radius: var(--space-md);
  padding: var(--space-md);
  margin-bottom: var(--space-lg);
}

.route-overview-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--forest);
  margin-bottom: var(--space-md);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
}

.route-overview-title .title-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--forest);
}

.route-overview-days {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.route-overview-day {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
}

.route-overview-badge {
  flex-shrink: 0;
  font-size: var(--text-xs);
  font-weight: 700;
  padding: 0.3rem 0.6rem;
  border-radius: var(--space-sm);
  color: white;
  min-width: 3rem;
  text-align: center;
}

.route-overview-badge.day1 { background: var(--forest); }
.route-overview-badge.day2 { background: var(--sunset); }

.route-overview-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2xs);
  flex: 1;
  line-height: 1.8;
}

.route-overview-point {
  font-size: calc(0.75rem * var(--text-scale, 1));
  padding: 0.2rem 0.5rem;
  background: var(--earth-light);
  border-radius: var(--space-sm);
  color: var(--text);
  white-space: nowrap;
}

.route-overview-point.end {
  background: var(--forest-light);
  color: var(--forest);
  font-weight: 600;
}

.route-overview-arrow {
  font-size: 0.9rem;
  color: var(--forest);
  font-weight: 700;
}

.route-detail {
  background: var(--forest-light);
  border-radius: var(--space-md);
  overflow: hidden;
}

.route-detail-toggle {
  width: 100%;
  padding: var(--space-md);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  transition: background var(--duration-normal) var(--ease-out-quart), color var(--duration-normal) var(--ease-out-quart);
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}

.route-detail-toggle:hover {
  background: var(--forest);
  color: white;
}

.route-detail-toggle:active {
  transform: scale(0.98);
}

.route-detail-toggle-icon {
  font-size: 1.2rem;
}

.route-detail-toggle-text {
  flex: 1;
  text-align: left;
}

.route-detail-toggle-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s var(--ease-out-quart);
}

.route-detail.collapsed .route-detail-toggle-arrow {
  transform: rotate(-90deg);
}

.route-detail-content {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.35s var(--ease-out-quart), opacity 0.3s var(--ease-out-quart);
  opacity: 1;
}

.route-detail.collapsed .route-detail-content {
  grid-template-rows: 0fr;
  opacity: 0;
}

.route-detail-inner {
  overflow: hidden;
  min-height: 0;
}

.route-day-section {
  padding: 0 var(--space-md) var(--space-md);
}

.route-day-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.route-day-badge {
  font-size: calc(0.7rem * var(--text-scale, 1));
  font-weight: calc(700 + var(--text-weight-boost, 0));
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  color: white;
}

.route-day-badge.day1 { background: var(--forest); }
.route-day-badge.day2 { background: var(--sunset); }

.route-day-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.route-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding-left: var(--space-xs);
}

.route-timeline-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-xs) 0;
  position: relative;
}

.route-timeline-item.optional {
  opacity: 0.7;
}

.route-timeline-item.optional .timeline-time::after {
  content: '可选';
  font-size: calc(0.6rem * var(--text-scale, 1));
  margin-left: var(--space-2xs);
  color: var(--text-muted);
}

.timeline-time {
  font-size: calc(0.75rem * var(--text-scale, 1));
  font-weight: calc(600 + var(--text-weight-boost, 0));
  color: var(--sunset);
  min-width: 2.5rem;
  flex-shrink: 0;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  background: var(--forest);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.3rem;
}

.timeline-event {
  font-size: calc(var(--text-sm) * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.6;
  font-weight: calc(400 + var(--text-weight-boost, 0));
}

.timeline-event :deep(strong) {
  color: var(--forest);
}

.spot-group {
  margin: var(--space-lg) 0;
}

.spot-with-route {
  position: relative;
  margin-bottom: var(--space-md);
}

.spot {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 1px dashed var(--border);
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.spot:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.spot:active {
  background: var(--forest-light);
  border-radius: 0.5rem;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  padding: 0.5rem;
}

.spot-name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-xs);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  letter-spacing: 0.01em;
}

.spot-dot {
  width: 8px;
  height: 8px;
  background: var(--sunset);
  border-radius: 50%;
  flex-shrink: 0;
  transition: transform var(--duration-normal) var(--ease-out-quart);
}

.spot:hover .spot-dot {
  animation: spotDotPulse 0.4s var(--ease-out-quart);
}

@keyframes spotDotPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.5); }
}

.spot-highlight-tag {
  display: inline-block;
  background: var(--sunset);
  color: white;
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  margin-left: var(--space-xs);
  vertical-align: middle;
  letter-spacing: 0.02em;
}

.spot-map-btn {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border: 1px solid var(--forest);
  background: var(--forest-light);
  border-radius: var(--space-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-out-quart);
  flex-shrink: 0;
}

.spot-map-btn:hover {
  background: var(--forest);
  border-color: var(--forest);
}

.spot-map-btn:active {
  transform: scale(0.92);
}

.spot-map-btn svg {
  width: 16px;
  height: 16px;
  color: var(--forest);
  transition: color var(--duration-fast) var(--ease-out-quart);
}

.spot-map-btn:hover svg {
  color: white;
}

.spot-highlight {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
  line-height: 1.75;
}

.spot-transport {
  font-size: calc(0.75rem * var(--text-scale, 1));
  font-weight: calc(400 + var(--text-weight-boost, 0));
  color: var(--sky);
  background: var(--sky-light);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--space-2xs);
  display: inline-block;
  margin-top: var(--space-2xs);
}

.spot-photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
  margin-top: var(--space-xs);
  padding: 0 var(--space-xs);
}

.photo-item {
  position: relative;
  border-radius: var(--space-sm);
  overflow: hidden;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform var(--duration-fast) var(--ease-out-quart);
}

.photo-item:hover {
  transform: scale(1.02);
}

.photo-item:active {
  transform: scale(0.97);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s var(--ease-out-quart);
}

.photo-item:hover img {
  transform: scale(1.08);
}

.photo-item:active img {
  transform: scale(1.05);
}

.photo-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-2xl) var(--space-xs) var(--space-2xs);
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: white;
  font-size: var(--text-xs);
  text-align: center;
  pointer-events: none;
}

.img-fallback {
  position: absolute;
  inset: 0;
  background: var(--earth-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
}

@media (max-width: 480px) {
  .route-curve {
    width: 0.8rem;
    height: 1.2rem;
  }
}

.key-info {
  background: var(--card);
  border: 2px solid var(--forest);
  border-radius: var(--space-md);
  padding: var(--space-md);
}

.key-info-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.key-info-grid {
  display: grid;
  gap: var(--space-sm);
}

.key-info-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.key-info-row-icon {
  color: var(--sunset);
  flex-shrink: 0;
}

.key-info-row-text {
  color: var(--text);
}

.key-info-row-text strong {
  color: var(--forest);
  font-weight: 600;
}

.key-info-price {
  color: var(--sunset);
  font-weight: 600;
  margin-left: var(--space-xs);
}

.key-info-note {
  display: block;
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-top: 2px;
}

.key-info-footer {
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--border);
  text-align: center;
}

.key-info-footer-note {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text-muted);
}

.booking-section {
  background: var(--card);
  border: 2px solid var(--forest);
  border-radius: var(--space-md);
  padding: var(--space-md);
}

.booking-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.booking-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.booking-item {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
}

.booking-item.important {
  border: 2px solid var(--sunset);
  background: var(--sunset-soft);
}

.booking-spot {
  font-size: calc(0.8rem * var(--text-scale, 1));
  font-weight: calc(700 + var(--text-weight-boost, 0));
  color: var(--forest);
}

.booking-item.important .booking-spot {
  color: var(--sunset);
}

.booking-note {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-top: 2px;
}

.spot-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-2xs);
}

.spot-time {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
  background: var(--earth-light);
  padding: 2px 6px;
  border-radius: var(--space-2xs);
}

.spot-cycling {
  background: var(--sky-light);
  border-radius: var(--space-sm);
  margin-top: var(--space-sm);
  overflow: hidden;
}

.expandable-toggle {
  width: 100%;
  padding: var(--space-sm);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--sky);
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}

.expandable-toggle:hover {
  background: var(--sky);
  color: white;
}

.expandable-toggle:active {
  transform: scale(0.98);
}

.expandable-icon {
  font-size: 1rem;
}

.expandable-arrow {
  width: 16px;
  height: 16px;
  margin-left: auto;
  transition: transform 0.3s var(--ease-out-quart);
}

.expandable-arrow.collapsed {
  transform: rotate(-90deg);
}

.expandable-content {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.3s var(--ease-out-quart);
  padding: 0 var(--space-sm) var(--space-sm);
}

.expandable-content.collapsed {
  grid-template-rows: 0fr;
  padding-bottom: 0;
}

.expandable-content > * {
  min-height: 0;
  overflow: hidden;
}

.cycling-routes {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.cycling-route {
  background: var(--card);
  border-radius: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
}

.cycling-route-name {
  font-size: calc(0.8rem * var(--text-scale, 1));
  font-weight: calc(600 + var(--text-weight-boost, 0));
  color: var(--text);
}

.cycling-route-info {
  display: flex;
  gap: var(--space-sm);
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-top: 2px;
}

.cycling-route-tip {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--sky);
  margin-top: 2px;
}

.cycling-tips {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--border);
}

.spot-photo-spots {
  background: var(--sunset-soft);
  border-radius: var(--space-sm);
  margin-top: var(--space-sm);
  overflow: hidden;
}

.spot-photo-spots .expandable-toggle {
  color: var(--sunset);
}

.spot-photo-spots .expandable-toggle:hover {
  background: var(--sunset);
  color: white;
}

.photo-spots-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.photo-spot-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.photo-spot-name {
  font-size: calc(0.8rem * var(--text-scale, 1));
  font-weight: calc(600 + var(--text-weight-boost, 0));
  color: var(--text);
}

.photo-spot-tip {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
}

.practical-section {
  padding: var(--space-md);
}

.practical-section-title {
  font-size: calc(0.9rem * var(--text-scale, 1));
  font-weight: calc(700 + var(--text-weight-boost, 0));
  color: var(--forest);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 2px solid var(--forest-light);
}

.practical-stay {
  margin-bottom: var(--space-lg);
}

.stay-groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.stay-group-label {
  font-size: calc(0.7rem * var(--text-scale, 1));
  font-weight: calc(600 + var(--text-weight-boost, 0));
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-xs);
}

.stay-items {
  display: grid;
  gap: var(--space-sm);
}

.stay-item {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--forest);
}

.stay-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.stay-item-name {
  font-size: calc(0.85rem * var(--text-scale, 1));
  font-weight: calc(700 + var(--text-weight-boost, 0));
  color: var(--forest);
}

.stay-item-price {
  font-size: calc(0.8rem * var(--text-scale, 1));
  font-weight: 600;
  color: var(--sunset);
  white-space: nowrap;
}

.stay-item-location {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
  line-height: 1.4;
}

.stay-item-highlights {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text);
  margin-top: 4px;
  line-height: 1.4;
}

.food-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.food-item-compact {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--sunset);
}

.food-item-compact .food-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.food-item-compact .food-item-name {
  font-size: calc(0.85rem * var(--text-scale, 1));
  font-weight: calc(700 + var(--text-weight-boost, 0));
  color: var(--forest);
}

.food-item-compact .food-item-price {
  font-size: calc(0.8rem * var(--text-scale, 1));
  font-weight: 600;
  color: var(--sunset);
  white-space: nowrap;
}

.food-item-compact .food-item-shops {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.4;
}

.food-item-compact .food-item-tip {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-top: 4px;
  line-height: 1.4;
}

.ticket-section {
  padding: var(--space-md);
}

.ticket-header {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 2px solid var(--forest-light);
}

.ticket-label {
  font-size: calc(0.9rem * var(--text-scale, 1));
  font-weight: calc(700 + var(--text-weight-boost, 0));
  color: var(--forest);
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.ticket-item-detail {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--forest);
}

.ticket-item-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.ticket-spot-name {
  font-size: calc(0.85rem * var(--text-scale, 1));
  font-weight: calc(600 + var(--text-weight-boost, 0));
  color: var(--text);
}

.ticket-price-row {
  font-size: calc(0.8rem * var(--text-scale, 1));
  white-space: nowrap;
}

.ticket-full {
  color: var(--text-muted);
  text-decoration: line-through;
}

.ticket-arrow {
  color: var(--text-muted);
  margin: 0 6px;
}

.ticket-student {
  color: var(--sunset);
  font-weight: 600;
}

.ticket-item-note {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-top: 4px;
  line-height: 1.4;
}

.ticket-booking {
  background: var(--earth-light);
  border-radius: var(--space-sm);
  padding: var(--space-md);
}

.ticket-booking-title {
  font-size: calc(0.8rem * var(--text-scale, 1));
  font-weight: calc(600 + var(--text-weight-boost, 0));
  color: var(--text);
  margin-bottom: var(--space-sm);
}

.ticket-booking-item {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text);
  margin-bottom: var(--space-xs);
  line-height: 1.5;
}

.ticket-booking-item:last-child {
  margin-bottom: 0;
}

.ticket-booking-item.important {
  background: var(--sunset-soft);
  margin: 0 calc(var(--space-md) * -1);
  padding: var(--space-xs) var(--space-md);
  color: var(--sunset);
  font-weight: 600;
}

.ticket-booking-item strong {
  color: var(--forest);
}

.ticket-note {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--border);
}

@media (min-width: 480px) {
  .stay-items {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-note {
  font-size: calc(0.85rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-top: var(--space-sm);
}

.warning-box {
  background: var(--sunset-soft);
  border-radius: var(--space-md);
  padding: var(--space-md);
  font-size: var(--text-sm);
  color: var(--text);
  line-height: 1.6;
}

.warning-box strong {
  color: var(--sunset);
}

@media (max-width: 480px) {
  .practical-grid {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
  .ticket-grid {
    grid-template-columns: 1fr;
  }
  .ticket-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  .spot-photo-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2xs);
  }
}

@media (min-width: 768px) {
  .spot-photo-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-sm);
  }
}

@media (hover: hover) and (pointer: fine) {
  .photo-item:hover img {
    transform: scale(1.08);
  }
  .spot:hover {
    background: transparent;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in,
  .route-detail-content,
  .route-detail-toggle-arrow {
    transition-duration: 0.01ms !important;
  }
}
</style>
