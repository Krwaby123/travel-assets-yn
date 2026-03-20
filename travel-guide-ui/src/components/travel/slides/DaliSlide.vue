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
          <div class="route-overview-title">📍 2天路线总览</div>
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
          :data-delay="idx * 50"
        >
          <div class="spot" @mousedown="createRipple">
            <h3 class="spot-name">
              <span class="spot-dot"></span>
              {{ spot.name }}
              <span class="spot-highlight-tag">{{ spot.tag || '免费' }}</span>
            </h3>
            <p class="spot-highlight">{{ spot.highlight }}</p>
            <span class="spot-transport">{{ spot.transport }}</span>
          </div>
          <div class="spot-photo-grid">
            <div
              class="photo-item"
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
                @error="handleImageError"
              >
              <span class="photo-label">{{ photo.label }}</span>
              <div class="img-fallback" v-if="imgErrors[photo.src]">
                <span>🖼️</span>
                <span>图片加载失败</span>
              </div>
            </div>
          </div>
          <span class="route-label" v-if="spot.routeLabel">{{ spot.routeLabel }}</span>
        </div>
      </div>

      <InfoCard
        card-id="dali-stay"
        card-name="大理住宿推荐"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="info-item fade-in">
          <div class="info-label">🏨 住宿推荐</div>
          <div class="info-content">
            <p><strong class="text-forest">性价比首选：</strong>古城南门/北门周边，步行5分钟到古城，双床房120-200元/晚，拼房人均60-100元</p>
            <p class="mt-2"><strong class="text-forest">体验升级：</strong>才村、龙龛码头，推窗见海看日出，双床房200-300元/晚，拼房人均100-150元</p>
            <p class="info-note">避坑：别信低价"海景房"；订房选「可免费取消」的</p>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="dali-student"
        card-name="大理学生优惠"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="key-info fade-in">
          <div class="key-info-title">🎫 学生优惠（带学生证）</div>
          <div class="key-info-grid">
            <div class="key-info-row">
              <span class="key-info-row-icon">🏛️</span>
              <span class="key-info-row-text"><strong>崇圣寺三塔：</strong>100元→半价50元</span>
            </div>
            <div class="key-info-row">
              <span class="key-info-row-icon">🚡</span>
              <span class="key-info-row-text"><strong>苍山索道：</strong>感通110元→55元 / 洗马潭198元→99元</span>
            </div>
            <div class="key-info-row">
              <span class="key-info-row-icon">🦋</span>
              <span class="key-info-row-text"><strong>蝴蝶泉公园：</strong>55元→半价28元</span>
            </div>
            <div class="key-info-row">
              <span class="key-info-row-icon">🎬</span>
              <span class="key-info-row-text"><strong>天龙八部影视城：</strong>52元→半价26元</span>
            </div>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="dali-food"
        card-name="大理必吃美食"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="info-item fade-in">
          <div class="info-label">🍜 必吃美食</div>
          <div class="info-content">
            <p>大理酸辣鱼、凉鸡米线、扒肉饵丝、烤乳扇（先买5块小份尝尝）、喜洲粑粑、玫瑰烤奶</p>
            <p class="info-note">北门菜市场小吃性价比最高；鲜花饼去嘉华/潘祥记官方门店买</p>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="dali-budget"
        card-name="大理预算参考"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="simple-info fade-in">
          <div class="simple-info-title">💰 预算参考（2天）</div>
          <div class="simple-info-content">
            <strong>常规版约600元：</strong>住宿150元+餐饮150元+环湖交通100元+体验项目100元<br>
            <strong>经济版约250元：</strong>青旅住宿+公交出行+只逛免费景点（古城、喜洲、洱海廊道全免费）
          </div>
        </div>
      </InfoCard>

      <div class="warning-box fade-in" @mousedown="createRipple">
        <strong>避坑提醒：</strong>
        <ul class="ul-indent">
          <li>别信古城门口"50元环洱海一日游"，全是购物团</li>
          <li>别在古城里买银饰、玉石，水很深</li>
          <li>洱海租车提前问清楚续航、有没有隐藏费用</li>
        </ul>
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

defineEmits(['hide-card', 'open-lightbox'])

const routeDetailCollapsed = ref(false)
const imgErrors = reactive({})

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

const handleImageError = (e) => {
  const img = e.target
  img.style.display = 'none'
  imgErrors[img.src] = true
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
  font-size: 0.75rem;
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
  transition: background 0.2s ease;
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
  transition: grid-template-rows 0.35s var(--ease-out-quart), opacity 0.3s ease;
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
  font-size: 0.7rem;
  font-weight: 700;
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
  font-size: 0.6rem;
  margin-left: var(--space-2xs);
  color: var(--text-muted);
}

.timeline-time {
  font-size: 0.75rem;
  font-weight: 600;
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
  font-size: var(--text-xs);
  color: var(--text);
  line-height: 1.6;
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
  transition: transform 0.2s ease;
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

.spot-highlight {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
  line-height: 1.75;
}

.spot-transport {
  font-size: var(--text-xs);
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
}

.photo-item:active {
  transform: scale(0.97);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
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
  font-size: 0.7rem;
  color: var(--text-muted);
}

.route-label {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--forest);
  color: white;
  font-size: 0.7rem;
  padding: 0.3rem 0.6rem;
  border-radius: 0.8rem;
  white-space: nowrap;
}

.spot-with-route:nth-child(2) .route-label {
  background: var(--forest);
}

.spot-with-route:nth-child(3) .route-label {
  background: var(--sunset);
  top: auto;
  bottom: 0;
  transform: translateY(50%);
}

.spot-with-route:last-child .route-label {
  display: none;
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

.info-note {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: var(--space-sm);
}

.mt-2 { margin-top: var(--space-sm); }
.ul-indent { margin-top: var(--space-sm); padding-left: 1rem; }

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  transform: scale(0);
  animation: rippleEffect 0.5s var(--ease-out-quart);
  pointer-events: none;
}

@keyframes rippleEffect {
  to { transform: scale(2.5); opacity: 0; }
}

@media (max-width: 480px) {
  .spot-photo-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2xs);
  }
  .route-label {
    display: none;
  }
}

@media (min-width: 480px) {
  .route-label {
    right: 0.8rem;
    font-size: 0.75rem;
    padding: 0.35rem 0.7rem;
  }
}

@media (min-width: 768px) {
  .spot-photo-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-sm);
  }
  .route-label {
    right: 1rem;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
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
