<template>
  <section class="section dali-section">
    <!-- 快速导航栏 -->
    <nav class="quick-nav-bar" ref="quickNavBar">
      <div class="quick-nav-track">
        <button
          v-for="module in modules"
          :key="module.id"
          :class="['quick-nav-btn', { active: activeModule === module.id }]"
          @click.stop="scrollToModule(module.id)"
        >
          <span class="nav-btn-text">{{ module.shortTitle || module.title }}</span>
        </button>
      </div>
      <button class="nav-jump-btn" @click="showJumpPanel = true" aria-label="快速跳转">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </nav>

    <!-- 跳转面板 -->
    <Teleport to="body">
      <Transition name="jump-panel">
        <div v-if="showJumpPanel" class="jump-panel-overlay" @click.self="showJumpPanel = false">
          <div class="jump-panel">
            <div class="jump-panel-header">
              <span class="jump-panel-title">快速跳转</span>
              <button class="jump-panel-close" @click="showJumpPanel = false" aria-label="关闭">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="jump-panel-body">
              <div class="jump-section" v-for="section in jumpSections" :key="section.id">
                <button
                  class="jump-section-btn"
                  :class="{ active: activeModule === section.id }"
                  @click="handleJump(section.id)"
                >
                  <span class="jump-section-icon">{{ section.icon }}</span>
                  <span class="jump-section-name">{{ section.title }}</span>
                  <svg class="jump-section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 区域1：大理总览区（默认展开，不折叠） -->
    <div id="dali-guide-area-overview" class="guide-module guide-module-expanded" ref="module-overview">
      <div class="guide-module-header guide-module-header-static">
        <div class="section-number">{{ data.number }}</div>
        <h2 class="guide-module-title guide-module-title-large">{{ data.title }}</h2>
      </div>
      <div class="guide-module-content-wrapper">
        <p class="section-desc">{{ data.desc }}</p>

        <div class="route-overview">
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
      </div>
    </div>

    <!-- 区域2：行程详细时间线区 -->
    <div id="dali-guide-area-itinerary" class="guide-module" :class="{ expanded: expandedModules.itinerary }" ref="module-itinerary">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.itinerary" @click="toggleModule('itinerary')" @keydown.enter="toggleModule('itinerary')" @keydown.space.prevent="toggleModule('itinerary')">
        <h3 class="guide-module-title">详细行程时间线</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.itinerary }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dali-route-detail"
            card-name="大理详细路线"
            :hidden-cards="hiddenCards"
            :closable="false"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="route-detail">
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
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域3：核心景点详解区 -->
    <div id="dali-guide-area-scenic" class="guide-module" :class="{ expanded: expandedModules.scenic }" ref="module-scenic">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.scenic" @click="toggleModule('scenic')" @keydown.enter="toggleModule('scenic')" @keydown.space.prevent="toggleModule('scenic')">
        <h3 class="guide-module-title">核心景点详解</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.scenic }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <div class="spot-group">
            <div
              class="spot-with-route"
              v-for="(spot, idx) in data.spots"
              :key="spot.name"
              :style="{ '--delay': idx * 50 }"
            >
              <div class="spot" :class="['spot-item-' + spot.name.replace(/\s/g, '-')]">
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
        </div>
      </div>
    </div>

    <!-- 区域4：住宿推荐区 -->
    <div id="dali-guide-area-hotel" class="guide-module" :class="{ expanded: expandedModules.hotel }" ref="module-hotel">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.hotel" @click="toggleModule('hotel')" @keydown.enter="toggleModule('hotel')" @keydown.space.prevent="toggleModule('hotel')">
        <h3 class="guide-module-title">住宿推荐</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.hotel }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dali-hotel"
            card-name="大理住宿推荐"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="practical-stay">
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
              <div class="stay-tips" v-if="data.accommodationTips">
                <div class="stay-tips-title">住宿小贴士</div>
                <div class="stay-tips-list">
                  <div class="stay-tips-item" v-for="(tip, idx) in data.accommodationTips" :key="idx">{{ tip }}</div>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域5：美食推荐区 -->
    <div id="dali-guide-area-food" class="guide-module" :class="{ expanded: expandedModules.food }" ref="module-food">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.food" @click="toggleModule('food')" @keydown.enter="toggleModule('food')" @keydown.space.prevent="toggleModule('food')">
        <h3 class="guide-module-title">必吃美食</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.food }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dali-food"
            card-name="大理必吃美食"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="food-items">
              <div class="food-item" v-for="food in data.foods" :key="food.name">
                <div class="food-item-header">
                  <span class="food-item-name">{{ food.name }}</span>
                  <span class="food-item-price">{{ food.price }}</span>
                </div>
                <div class="food-item-shops">推荐：{{ food.shops }}</div>
                <div class="food-item-tip" v-if="food.tip">{{ food.tip }}</div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域6：门票优惠与预约区 -->
    <div id="dali-guide-area-ticket" class="guide-module" :class="{ expanded: expandedModules.ticket }" ref="module-ticket">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.ticket" @click="toggleModule('ticket')" @keydown.enter="toggleModule('ticket')" @keydown.space.prevent="toggleModule('ticket')">
        <h3 class="guide-module-title">门票优惠 & 预约指南</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.ticket }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dali-ticket"
            card-name="大理门票&预约"
            :hidden-cards="hiddenCards"
            :closable="false"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="ticket-section">
              <div class="ticket-header">
                <span class="ticket-label">🎫 学生票（持学生证）</span>
              </div>
              <div class="ticket-list">
                <div class="ticket-item" v-for="item in data.studentDiscounts" :key="item.spot">
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
        </div>
      </div>
    </div>

    <!-- 区域7：预算与避坑区 -->
    <div id="dali-guide-area-budget" class="guide-module" :class="{ expanded: expandedModules.budget }" ref="module-budget">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.budget" @click="toggleModule('budget')" @keydown.enter="toggleModule('budget')" @keydown.space.prevent="toggleModule('budget')">
        <h3 class="guide-module-title">预算参考 & 避坑指南</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.budget }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dali-budget"
            card-name="大理预算参考"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="simple-info">
              <div class="simple-info-title"><span class="emoji" aria-hidden="true">💰</span> 预算参考（2天）</div>
              <div class="simple-info-content">
                <strong>常规版约600元：</strong>住宿150元+餐饮150元+环湖交通100元+体验项目100元<br>
                <strong>经济版约250元：</strong>青旅住宿+公交出行+只逛免费景点
              </div>
            </div>
          </InfoCard>

          <div class="warning-box">
            <strong>避坑：</strong>别信"50元环洱海一日游"；别买古城银饰玉石；租车问清续航和隐藏费用。
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import InfoCard from '../InfoCard.vue'

defineProps({
  data: Object,
  hiddenCards: Set
})

const emit = defineEmits(['hide-card', 'open-lightbox', 'open-map', 'module-toggle'])

const imgErrors = reactive({})
const loadedImages = reactive({})
const spotDetailCollapsed = reactive({})

const modules = [
  { id: 'overview', title: '大理·苍山洱海', shortTitle: '总览' },
  { id: 'itinerary', title: '详细行程时间线', shortTitle: '时间线' },
  { id: 'scenic', title: '核心景点详解', shortTitle: '景点详解' },
  { id: 'hotel', title: '住宿推荐', shortTitle: '住宿' },
  { id: 'food', title: '必吃美食', shortTitle: '美食' },
  { id: 'ticket', title: '门票优惠 & 预约指南', shortTitle: '门票预约' },
  { id: 'budget', title: '预算参考 & 避坑指南', shortTitle: '预算避坑' }
]

const jumpSections = [
  { id: 'overview', title: '总览', icon: '🌊' },
  { id: 'itinerary', title: '详细行程时间线', icon: '📅' },
  { id: 'scenic', title: '核心景点详解', icon: '🏔️' },
  { id: 'hotel', title: '住宿推荐', icon: '🏨' },
  { id: 'food', title: '必吃美食', icon: '🍜' },
  { id: 'ticket', title: '门票优惠 & 预约指南', icon: '🎫' },
  { id: 'budget', title: '预算参考 & 避坑指南', icon: '💰' }
]

const expandedModules = reactive({
  itinerary: false,
  scenic: false,
  hotel: false,
  food: false,
  ticket: false,
  budget: false
})

const activeModule = ref('overview')
const quickNavBar = ref(null)
const showJumpPanel = ref(false)

const toggleModule = (moduleId) => {
  expandedModules[moduleId] = !expandedModules[moduleId]
  emit('module-toggle')
}

const expandModule = (moduleId) => {
  if (moduleId !== 'overview') {
    expandedModules[moduleId] = true
    emit('module-toggle')
  }
}

const toggleSpotDetail = (key) => {
  spotDetailCollapsed[key] = !spotDetailCollapsed[key]
}

const isSpotDetailExpanded = (key) => {
  return spotDetailCollapsed[key] === true
}

const scrollToModule = (moduleId) => {
  const element = document.getElementById(`dali-guide-area-${moduleId}`)
  if (element) {
    expandModule(moduleId)
    nextTick(() => {
      const navHeight = quickNavBar.value ? quickNavBar.value.offsetHeight : 0
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - navHeight - 20

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    })
  }
}

const handleJump = (moduleId) => {
  showJumpPanel.value = false
  expandModule(moduleId)
  nextTick(() => {
    scrollToModule(moduleId)
  })
}

const handleImageLoad = (src) => {
  loadedImages[src] = true
}

const handleImageError = (src) => {
  imgErrors[src] = true
}

defineExpose({
  expandModule,
  scrollToModule
})

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('dali-guide-area-', '')
        activeModule.value = id
      }
    })
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
  })

  nextTick(() => {
    document.querySelectorAll('.guide-module[id^="dali-guide-area"]').forEach(el => {
      observer.observe(el)
    })
  })
})
</script>

<style scoped>
@import '../slides-common.css';

.dali-section {
  padding-top: 0;
}

.guide-module {
  position: relative;
  padding-top: var(--space-lg);
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

.guide-module-header-static {
  cursor: default;
}

.guide-module-collapsible {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out-quart);
  user-select: none;
  min-height: 48px;
}

.guide-module-collapsible:focus-visible {
  outline: 2px solid var(--forest);
  outline-offset: 2px;
}

.guide-module-collapsible:hover {
  background: var(--forest-light);
}

.guide-module-collapsible:active {
  transform: scale(0.99);
}

.guide-module-title {
  font-family: 'LXGW WenKai', serif;
  font-size: var(--text-lg);
  font-weight: 400;
  color: var(--forest);
  letter-spacing: 0.05em;
  margin: 0;
}

.guide-module-title-large {
  font-size: clamp(1.25rem, 5vw, 1.5rem);
}

.guide-module-toggle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--forest);
  transition: transform var(--duration-normal) var(--ease-out-quart);
}

.guide-module-toggle svg {
  width: 18px;
  height: 18px;
}

.guide-module-toggle.expanded {
  transform: rotate(180deg);
}

.guide-module-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s var(--ease-out-quart);
}

.guide-module-content-wrapper {
  min-height: 0;
}

.guide-module-content-inner {
  min-height: 0;
  overflow: hidden;
}

.guide-module-expanded .guide-module-content-wrapper {
  display: block;
}

.guide-module.expanded .guide-module-content {
  grid-template-rows: 1fr;
}

.section-number {
  font-family: 'LXGW WenKai', serif;
  font-size: 0.75rem;
  color: var(--sunset);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-xs);
}

.section-desc {
  font-size: calc(var(--text-sm) * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.8;
  margin-bottom: var(--space-lg);
}

.route-overview {
  background: var(--card);
  border: 2px solid var(--forest);
  border-radius: var(--space-md);
  padding: var(--space-md);
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
  padding: var(--space-md);
}

.route-day-section {
  padding-bottom: var(--space-md);
}

.route-day-section:last-child {
  padding-bottom: 0;
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
  font-size: calc(var(--text-sm) * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.6;
}

.timeline-event :deep(strong) {
  color: var(--forest);
}

.spot-group {
  padding: var(--space-md);
}

.spot-with-route {
  position: relative;
  margin-bottom: var(--space-lg);
}

.spot-with-route:last-child {
  margin-bottom: 0;
}

.spot {
  padding-bottom: var(--space-md);
  border-bottom: 1px dashed var(--border);
}

.spot:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.spot-name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-xs);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.spot-dot {
  width: 8px;
  height: 8px;
  background: var(--sunset);
  border-radius: 50%;
  flex-shrink: 0;
}

.spot-highlight-tag {
  display: inline-block;
  background: var(--sunset);
  color: white;
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
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
}

.spot-map-btn:hover svg {
  color: white;
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

.spot-highlight {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
  line-height: 1.75;
}

.spot-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.spot-transport {
  font-size: 0.75rem;
  color: var(--sky);
  background: var(--sky-light);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--space-2xs);
}

.spot-time {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--earth-light);
  padding: 2px 6px;
  border-radius: var(--space-2xs);
}

.spot-photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
  margin-top: var(--space-sm);
}

.photo-item {
  position: relative;
  border-radius: var(--space-sm);
  overflow: hidden;
  aspect-ratio: 1 / 1;
  cursor: pointer;
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
}

.expandable-toggle:hover {
  background: var(--sky);
  color: white;
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

.expandable-content > div {
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
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text);
}

.cycling-route-info {
  display: flex;
  gap: var(--space-sm);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.cycling-route-tip {
  font-size: 0.7rem;
  color: var(--sky);
  margin-top: 2px;
}

.cycling-tips {
  font-size: 0.7rem;
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
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text);
}

.photo-spot-tip {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.practical-stay {
  padding: var(--space-md);
}

.stay-groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.stay-group-label {
  font-size: 0.7rem;
  font-weight: 600;
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
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--forest);
}

.stay-item-price {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--sunset);
  white-space: nowrap;
}

.stay-item-location {
  font-size: 0.7rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.stay-item-highlights {
  font-size: 0.7rem;
  color: var(--text);
  margin-top: 4px;
  line-height: 1.4;
}

.stay-tips {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px dashed var(--border);
}

.stay-tips-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-sm);
}

.stay-tips-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.stay-tips-item {
  font-size: 0.75rem;
  color: var(--text-muted);
  padding-left: var(--space-sm);
  position: relative;
}

.stay-tips-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--forest);
}

.food-items {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.food-item {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-left: 3px solid var(--sunset);
}

.food-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.food-item-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--forest);
}

.food-item-price {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--sunset);
  white-space: nowrap;
}

.food-item-shops {
  font-size: 0.75rem;
  color: var(--text);
  line-height: 1.4;
}

.food-item-tip {
  font-size: 0.7rem;
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
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--forest);
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.ticket-item {
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
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.ticket-price-row {
  font-size: 0.8rem;
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
  font-size: 0.7rem;
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
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: var(--space-sm);
}

.ticket-booking-item {
  font-size: 0.75rem;
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
  font-size: 0.7rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--border);
}

.simple-info {
  padding: var(--space-md);
}

.simple-info-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-sm);
}

.simple-info-content {
  font-size: 0.8rem;
  line-height: 1.8;
  color: var(--text);
}

.warning-box {
  margin: var(--space-md);
  padding: var(--space-md);
  background: var(--sunset-soft);
  border-radius: var(--space-md);
  font-size: var(--text-sm);
  color: var(--text);
  line-height: 1.6;
}

.warning-box strong {
  color: var(--sunset);
}

@media (max-width: 480px) {
  .quick-nav-btn {
    font-size: 0.7rem;
    padding: var(--space-xs) var(--space-sm);
    min-height: 40px;
  }
  .spot-photo-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2xs);
  }
}

@media (min-width: 480px) {
  .stay-items {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .spot-photo-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-sm);
  }
}

@media (prefers-reduced-motion: reduce) {
  .guide-module-content,
  .guide-module-toggle,
  .expandable-arrow,
  .expandable-content {
    transition: none;
  }
}
</style>
