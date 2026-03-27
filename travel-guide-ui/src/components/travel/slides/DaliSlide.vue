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
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
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

    <!-- 区域1：大理总览区（无边框，直接展示） -->
    <div id="dali-guide-area-overview" class="guide-module guide-module-expanded" ref="module-overview">
      <div class="guide-module-header guide-module-header-static">
        <div class="section-number">{{ data.number }}</div>
        <h2 class="guide-module-title guide-module-title-large">{{ data.title }}</h2>
      </div>
      <div class="guide-module-content-wrapper">
        <p class="section-desc">{{ data.desc }}</p>

        <!-- 2天路线总览 -->
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
                <span class="route-overview-point">洱海廊道</span>
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

        <!-- 详细行程时间线（紧凑版，嵌入总览） -->
        <div class="timeline-compact">
          <div class="timeline-compact-header">
            <span class="timeline-compact-icon">📅</span>
            <span class="timeline-compact-title">详细行程</span>
          </div>

          <div class="timeline-compact-day">
            <div class="timeline-compact-day-header">
              <span class="day-badge day1">Day1</span>
              <span class="day-title">{{ data.routeDetail?.day1?.title || '海西精华线' }}</span>
            </div>
            <div class="timeline-compact-items">
              <div
                class="timeline-compact-item"
                v-for="(item, idx) in data.routeDetail?.day1?.items"
                :key="idx"
                :class="{ optional: item.optional }"
              >
                <span class="item-time">{{ item.time }}</span>
                <span class="item-event" v-html="item.event"></span>
              </div>
            </div>
          </div>

          <div class="timeline-compact-day">
            <div class="timeline-compact-day-header">
              <span class="day-badge day2">Day2</span>
              <span class="day-title">{{ data.routeDetail?.day2?.title || '海东慢游线' }}</span>
            </div>
            <div class="timeline-compact-items">
              <div
                class="timeline-compact-item"
                v-for="(item, idx) in data.routeDetail?.day2?.items"
                :key="idx"
              >
                <span class="item-time">{{ item.time }}</span>
                <span class="item-event" v-html="item.event"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域2：核心景点详解区 -->
    <div id="dali-guide-area-scenic" class="guide-module" :class="{ expanded: expandedModules.scenic }" ref="module-scenic">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.scenic" @click="toggleModule('scenic')" @keydown.enter="toggleModule('scenic')" @keydown.space.prevent="toggleModule('scenic')">
        <div class="module-header-left">
          <h3 class="guide-module-title">核心景点详解</h3>
        </div>
        <div class="module-header-actions">
          <button class="module-jump-btn" @click.stop="showJumpPanel = true" aria-label="快速跳转">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </button>
          <span class="guide-module-toggle" :class="{ expanded: expandedModules.scenic }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <div class="spot-group">
            <div
              class="spot-card"
              v-for="(spot, idx) in data.spots"
              :key="spot.name"
              :style="{ '--spot-index': idx }"
            >
              <div class="spot-header">
                <div class="spot-title-row">
                  <h4 class="spot-name">{{ spot.name }}</h4>
                  <span class="spot-tag">{{ spot.tag || '免费' }}</span>
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
                </div>
                <p class="spot-highlight">{{ spot.highlight }}</p>
                <div class="spot-meta">
                  <span class="spot-meta-item">{{ spot.transport }}</span>
                  <span class="spot-meta-item" v-if="spot.openTime">{{ spot.openTime }}</span>
                </div>
              </div>

              <div class="spot-photo-grid">
                <div
                  class="photo-item"
                  :class="{ 'img-loaded': loadedImages[photo.src], 'img-error': imgErrors[photo.src] }"
                  v-for="(photo, pIdx) in spot.photos"
                  :key="photo.label"
                  :style="{ '--photo-index': pIdx }"
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

              <!-- 骑行分段 -->
              <div class="spot-extra" v-if="spot.cycling">
                <button class="expandable-toggle" @click="toggleSpotDetail('cycling-' + idx)" :aria-expanded="isSpotDetailExpanded('cycling-' + idx)">
                  <span class="expandable-icon">🚴</span>
                  <span>骑行分段</span>
                  <svg class="expandable-arrow" :class="{ expanded: isSpotDetailExpanded('cycling-' + idx) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div class="expandable-content" :class="{ expanded: isSpotDetailExpanded('cycling-' + idx) }">
                  <div class="expandable-content-inner">
                    <div class="cycling-routes">
                      <div class="cycling-route" v-for="route in spot.cycling.routes" :key="route.name">
                        <div class="cycling-route-name">{{ route.name }}</div>
                        <div class="cycling-route-meta">
                          <span>{{ route.distance }}</span>
                          <span>{{ route.time }}</span>
                        </div>
                        <div class="cycling-route-tip">{{ route.tip }}</div>
                      </div>
                    </div>
                    <div class="cycling-note">{{ spot.cycling.tips }}</div>
                  </div>
                </div>
              </div>

              <!-- 打卡机位 -->
              <div class="spot-extra" v-if="spot.photoSpots">
                <button class="expandable-toggle" @click="toggleSpotDetail('photo-' + idx)" :aria-expanded="isSpotDetailExpanded('photo-' + idx)">
                  <span class="expandable-icon">📷</span>
                  <span>打卡机位</span>
                  <svg class="expandable-arrow" :class="{ expanded: isSpotDetailExpanded('photo-' + idx) }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div class="expandable-content" :class="{ expanded: isSpotDetailExpanded('photo-' + idx) }">
                  <div class="expandable-content-inner">
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

    <!-- 区域3：住宿美食推荐（合并） -->
    <div id="dali-guide-area-stay" class="guide-module" :class="{ expanded: expandedModules.stay }" ref="module-stay">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.stay" @click="toggleModule('stay')" @keydown.enter="toggleModule('stay')" @keydown.space.prevent="toggleModule('stay')">
        <div class="module-header-left">
          <h3 class="guide-module-title">住宿美食推荐</h3>
        </div>
        <div class="module-header-actions">
          <button class="module-jump-btn" @click.stop="showJumpPanel = true" aria-label="快速跳转">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </button>
          <span class="guide-module-toggle" :class="{ expanded: expandedModules.stay }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <!-- 住宿推荐 -->
          <div class="stay-section">
            <div class="section-label">
              <span class="section-label-icon">🛏️</span>
              <span>住宿推荐</span>
              <span class="section-label-badge">美团官方可订</span>
            </div>
            <div class="stay-list">
              <div class="stay-card" v-for="(item, idx) in data.accommodations" :key="item.name" :style="{ '--card-index': idx }">
                <div class="stay-card-row">
                  <div class="stay-card-info">
                    <div class="stay-card-name">{{ item.name }}</div>
                    <div class="stay-card-price">{{ item.price }}</div>
                  </div>
                  <a :href="item.bookingUrl" target="_blank" rel="noopener" class="stay-booking-btn" @click.stop>
                    预订
                  </a>
                </div>
                <div class="stay-card-meta">
                  <span class="stay-card-location">{{ item.location }}</span>
                  <span class="stay-card-divider">·</span>
                  <span class="stay-card-phone">{{ item.phone }}</span>
                </div>
                <div class="stay-card-tags">
                  <span class="stay-tag" v-for="tag in item.tags" :key="tag">{{ tag }}</span>
                </div>
                <p class="stay-card-highlight">{{ item.highlights }}</p>
              </div>
            </div>
          </div>

          <!-- 美食推荐 -->
          <div class="food-section">
            <div class="section-label">
              <span class="section-label-icon">🍜</span>
              <span>必吃美食</span>
            </div>
            <div class="food-list">
              <div class="food-card" v-for="(food, idx) in data.foods" :key="food.name" :style="{ '--food-index': idx }">
                <div class="food-card-icon">{{ foodIcons[idx] || '🍽️' }}</div>
                <div class="food-card-content">
                  <div class="food-card-header">
                    <h4 class="food-card-name">{{ food.name }}</h4>
                    <span class="food-card-price">{{ food.price }}</span>
                  </div>
                  <div class="food-card-shops">
                    <span class="food-shops-label">推荐店铺</span>
                    <span class="food-shops-value">{{ food.shops }}</span>
                  </div>
                  <div class="food-card-tip" v-if="food.tip">
                    <svg class="tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <span>{{ food.tip }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域4：门票预算 & 实用信息（合并） -->
    <div id="dali-guide-area-info" class="guide-module" :class="{ expanded: expandedModules.info }" ref="module-info">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.info" @click="toggleModule('info')" @keydown.enter="toggleModule('info')" @keydown.space.prevent="toggleModule('info')">
        <div class="module-header-left">
          <h3 class="guide-module-title">门票优惠 & 实用信息</h3>
        </div>
        <div class="module-header-actions">
          <button class="module-jump-btn" @click.stop="showJumpPanel = true" aria-label="快速跳转">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </button>
          <span class="guide-module-toggle" :class="{ expanded: expandedModules.info }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <!-- 学生票优惠 -->
          <div class="ticket-section">
            <div class="section-label">
              <span class="section-label-icon">🎓</span>
              <span>学生票优惠</span>
            </div>
            <div class="ticket-grid">
              <div class="ticket-item" v-for="item in data.studentDiscounts" :key="item.spot">
                <div class="ticket-item-main">
                  <span class="ticket-spot">{{ item.spot }}</span>
                  <div class="ticket-price-change">
                    <span class="ticket-full">{{ item.fullPrice }}</span>
                    <svg class="ticket-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    <span class="ticket-student">{{ item.studentPrice }}</span>
                  </div>
                </div>
                <div class="ticket-note" v-if="item.note">{{ item.note }}</div>
              </div>
            </div>
            <div class="ticket-free-note">大理古城、洱海廊道、喜洲古镇免费开放</div>
          </div>

          <!-- 预约信息 -->
          <div class="booking-section">
            <div class="section-label">
              <span class="section-label-icon">📅</span>
              <span>预约信息</span>
            </div>
            <div class="booking-list">
              <div class="booking-item" v-for="item in data.bookingInfo" :key="item.spot" :class="{ important: item.important }">
                <span class="booking-spot">{{ item.spot }}</span>
                <span class="booking-note">{{ item.note }}</span>
              </div>
            </div>
          </div>

          <!-- 预算参考 -->
          <div class="budget-section">
            <div class="section-label">
              <span class="section-label-icon">💰</span>
              <span>预算参考（2天）</span>
            </div>
            <div class="budget-compare">
              <div class="budget-option">
                <div class="budget-option-header">
                  <span class="budget-option-name">常规版</span>
                  <span class="budget-option-price">约600元</span>
                </div>
                <div class="budget-option-breakdown">
                  住宿150 + 餐饮150 + 环湖交通100 + 体验项目100
                </div>
              </div>
              <div class="budget-option budget-option-economy">
                <div class="budget-option-header">
                  <span class="budget-option-name">经济版</span>
                  <span class="budget-option-price">约250元</span>
                </div>
                <div class="budget-option-breakdown">
                  青旅住宿 + 公交出行 + 只逛免费景点
                </div>
              </div>
            </div>
          </div>

          <!-- 避坑指南 -->
          <div class="pitfall-section">
            <div class="pitfall-header">
              <svg class="pitfall-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span>避坑指南</span>
            </div>
            <div class="pitfall-items">
              <div class="pitfall-item">
                <span class="pitfall-x">✕</span>
                <span>别信"50元环洱海一日游"</span>
              </div>
              <div class="pitfall-item">
                <span class="pitfall-x">✕</span>
                <span>别买古城银饰玉石，水深</span>
              </div>
              <div class="pitfall-item">
                <span class="pitfall-x">✕</span>
                <span>租车问清续航和隐藏费用</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

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
  { id: 'scenic', title: '核心景点详解', shortTitle: '景点详解' },
  { id: 'stay', title: '住宿美食推荐', shortTitle: '住宿美食' },
  { id: 'info', title: '门票优惠 & 实用信息', shortTitle: '门票优惠' }
]

const jumpSections = [
  { id: 'overview', title: '总览', icon: '🌊' },
  { id: 'scenic', title: '核心景点详解', icon: '🏔️' },
  { id: 'stay', title: '住宿美食推荐', icon: '🏨' },
  { id: 'info', title: '门票优惠 & 实用信息', icon: '🎫' }
]

const expandedModules = reactive({
  scenic: false,
  stay: false,
  info: false
})

const foodIcons = ['🐟', '🥛', '🫓']

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
  setTimeout(() => {
    emit('module-toggle')
  }, 350)
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

/* ===== 模块通用 ===== */
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

.module-header-left {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
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
  background: linear-gradient(90deg,
    var(--sky) 0%,
    var(--ice) 25%,
    var(--forest) 50%,
    var(--sunset) 75%,
    var(--sky) 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: mountainMist 1.5s var(--ease-out-quart) forwards,
             shimmer 3s ease-in-out infinite;
  opacity: 0;
  margin-left: 2.5rem;
  position: relative;
}

.guide-module-title-large::before {
  content: '';
  position: absolute;
  left: -2.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 20px solid var(--forest);
  opacity: 0;
  animation: peakRise 0.8s var(--ease-out-quart) 0.2s forwards;
  filter: drop-shadow(6px 0 0 var(--sky));
}

.guide-module-title-large::after {
  content: '';
  position: absolute;
  left: -1.9rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 14px solid var(--sky);
  opacity: 0;
  animation: peakRiseBack 0.6s var(--ease-out-quart) 0.4s forwards;
}

@keyframes mountainMist {
  0% {
    opacity: 0;
    transform: translateY(-15px);
    letter-spacing: 0.2em;
    filter: blur(3px);
  }
  60% {
    letter-spacing: 0.06em;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    letter-spacing: 0.05em;
    filter: blur(0);
  }
}

@keyframes shimmer {
  0%, 100% {
    background-position: 0% 50%;
    filter: brightness(1);
  }
  50% {
    background-position: 100% 50%;
    filter: brightness(1.1);
  }
}

@keyframes peakRise {
  0% {
    opacity: 0;
    transform: translateY(-50%) translateY(15px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(-50%) translateY(0) scale(1);
  }
}

@keyframes peakRiseBack {
  0% {
    opacity: 0;
    transform: translateY(-50%) translateY(10px) scale(0.7);
  }
  100% {
    opacity: 0.7;
    transform: translateY(-50%) translateY(0) scale(1);
  }
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
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s var(--ease-out-quart);
}

.guide-module-content-wrapper {
  padding: 0 var(--space-md);
}

.guide-module-content-inner {
  padding-bottom: var(--space-md);
}

.guide-module-expanded .guide-module-content-wrapper {
  display: block;
}

.guide-module.expanded .guide-module-content {
  max-height: 5000px;
}

/* ===== 总览区 ===== */
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

/* 路线总览 */
.route-overview {
  background: linear-gradient(135deg, var(--forest-light) 0%, var(--sky-light) 100%);
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
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: white;
  border-radius: var(--space-sm);
  color: var(--text);
  white-space: nowrap;
}

.route-overview-point.end {
  background: var(--forest);
  color: white;
  font-weight: 600;
}

.route-overview-arrow {
  font-size: 0.9rem;
  color: var(--forest);
  font-weight: 700;
}

/* 紧凑时间线 */
.timeline-compact {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--space-md);
  overflow: hidden;
}

.timeline-compact-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--earth-light);
  border-bottom: 1px solid var(--border);
}

.timeline-compact-icon {
  font-size: 1rem;
}

.timeline-compact-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
}

.timeline-compact-day {
  padding: var(--space-md);
  border-bottom: 1px dashed var(--border);
}

.timeline-compact-day:last-child {
  border-bottom: none;
}

.timeline-compact-day-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.day-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  color: white;
}

.day-badge.day1 { background: var(--forest); }
.day-badge.day2 { background: var(--sunset); }

.day-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text);
}

.timeline-compact-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.timeline-compact-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-2xs) 0;
  opacity: 0;
  animation: fadeIn 0.4s var(--ease-out-quart) forwards;
}

.timeline-compact-item.optional {
  opacity: 0.7;
}

.timeline-compact-item.optional .item-time::after {
  content: '可选';
  font-size: 0.6rem;
  margin-left: var(--space-2xs);
  color: var(--text-muted);
}

.item-time {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--sunset);
  min-width: 3.5rem;
  flex-shrink: 0;
}

.item-event {
  font-size: calc(var(--text-sm) * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.5;
}

.item-event :deep(strong) {
  color: var(--forest);
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* ===== 景点区 ===== */
.spot-group {
  padding: var(--space-md);
}

.spot-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--space-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.5s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--spot-index, 0) * 100ms);
}

.spot-card:last-child {
  margin-bottom: 0;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spot-header {
  margin-bottom: var(--space-sm);
}

.spot-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-xs);
}

.spot-name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.spot-tag {
  display: inline-block;
  background: var(--sunset);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
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
  margin: 0 0 var(--space-xs) 0;
  line-height: 1.6;
}

.spot-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.spot-meta-item {
  font-size: 0.75rem;
  color: var(--sky);
  background: var(--sky-light);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--space-2xs);
}

/* 照片网格 */
.spot-photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.photo-item {
  position: relative;
  border-radius: var(--space-sm);
  overflow: hidden;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.95);
  animation: photoReveal 0.5s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--photo-index, 0) * 80ms);
}

@keyframes photoReveal {
  to {
    opacity: 1;
    transform: scale(1);
  }
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
  background: linear-gradient(to top, var(--overlay), transparent);
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

/* 展开内容 */
.spot-extra {
  background: var(--earth-light);
  border-radius: var(--space-sm);
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
  transition: background var(--duration-fast) var(--ease-out-quart);
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

.expandable-arrow.expanded {
  transform: rotate(180deg);
}

.expandable-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s var(--ease-out-quart);
}

.expandable-content.expanded {
  max-height: 500px;
}

.expandable-content-inner {
  padding: var(--space-sm);
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

.cycling-route-meta {
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

.cycling-note {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--border);
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

/* ===== 住宿美食区 ===== */
.stay-section,
.food-section {
  padding: var(--space-md);
}

.section-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.section-label-icon {
  font-size: 1.25rem;
}

.section-label span:nth-child(2) {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--forest);
}

.section-label-badge {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--sunset);
  background: var(--sunset-soft);
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: auto;
}

/* 住宿卡片 */
.stay-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.stay-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--space-md);
  padding: var(--space-md);
  opacity: 0;
  transform: translateY(12px);
  animation: cardSlideUp 0.4s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--card-index, 0) * 60ms);
  transition: border-color var(--duration-fast) var(--ease-out-quart);
}

.stay-card:hover {
  border-color: var(--forest);
}

@keyframes cardSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stay-card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.stay-card-info {
  flex: 1;
  min-width: 0;
}

.stay-card-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
  margin-bottom: 2px;
}

.stay-card-price {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--sunset);
}

.stay-booking-btn {
  flex-shrink: 0;
  padding: 6px 14px;
  background: transparent;
  color: var(--forest);
  font-size: 0.75rem;
  font-weight: 600;
  border: 1.5px solid var(--forest);
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.stay-booking-btn:hover {
  background: var(--forest);
  color: white;
}

.stay-booking-btn:active {
  transform: scale(0.95);
}

.stay-card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.stay-card-divider {
  color: var(--border);
}

.stay-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--space-xs);
}

.stay-tag {
  font-size: 0.6rem;
  font-weight: 500;
  color: var(--forest);
  background: var(--forest-light);
  padding: 2px 8px;
  border-radius: 4px;
}

.stay-card-highlight {
  font-size: 0.72rem;
  color: var(--text);
  margin: 0;
  line-height: 1.6;
}

/* 美食卡片 */
.food-section {
  border-top: 1px dashed var(--border);
}

.food-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.food-card {
  display: flex;
  gap: var(--space-sm);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--space-md);
  padding: var(--space-sm);
  opacity: 0;
  transform: translateX(-8px);
  animation: foodSlideIn 0.35s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--food-index, 0) * 80ms);
  transition: border-color var(--duration-fast) var(--ease-out-quart);
}

.food-card:hover {
  border-color: var(--sunset);
}

@keyframes foodSlideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.food-card-icon {
  width: 44px;
  height: 44px;
  background: var(--sunset-soft);
  border-radius: var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}

.food-card-content {
  flex: 1;
  min-width: 0;
}

.food-card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
}

.food-card-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.food-card-price {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--sunset);
  white-space: nowrap;
}

.food-card-shops {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.food-shops-label {
  font-size: 0.6rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.food-shops-value {
  font-size: 0.7rem;
  color: var(--text);
  font-weight: 500;
}

.food-card-tip {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 0.68rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.food-card-tip .tip-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--sky);
}

/* ===== 门票预算区 ===== */
.ticket-section,
.booking-section,
.budget-section,
.pitfall-section {
  padding: var(--space-md);
  border-bottom: 1px dashed var(--border);
}

.ticket-section:last-child,
.booking-section:last-child,
.budget-section:last-child,
.pitfall-section:last-child {
  border-bottom: none;
}

.ticket-grid {
  display: grid;
  gap: var(--space-sm);
}

.ticket-item {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
}

.ticket-item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-spot {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.ticket-price-change {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.ticket-full {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.ticket-arrow {
  width: 14px;
  height: 14px;
  color: var(--forest);
}

.ticket-student {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--forest);
}

.ticket-note {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: var(--space-xs);
}

.ticket-free-note {
  margin-top: var(--space-md);
  padding: var(--space-sm);
  background: var(--forest-light);
  border-radius: var(--space-sm);
  font-size: 0.75rem;
  color: var(--forest);
  text-align: center;
}

.booking-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.booking-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-xs) var(--space-sm);
  background: var(--card);
  border-radius: var(--space-xs);
  font-size: 0.8rem;
}

.booking-item.important {
  background: var(--sunset-soft);
  border-left: 3px solid var(--sunset);
}

.booking-spot {
  font-weight: 600;
  color: var(--text);
}

.booking-note {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.budget-compare {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.budget-option {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
}

.budget-option-economy {
  background: var(--earth-light);
}

.budget-option-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-xs);
}

.budget-option-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.budget-option-price {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--forest);
}

.budget-option-breakdown {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.pitfall-section {
  background: var(--sunset-soft);
}

.pitfall-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.pitfall-icon {
  width: 20px;
  height: 20px;
  color: var(--sunset);
}

.pitfall-header span {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--sunset);
}

.pitfall-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.pitfall-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.85rem;
  color: var(--text);
}

.pitfall-x {
  width: 20px;
  height: 20px;
  background: var(--sunset);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .spot-photo-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2xs);
  }

  .timeline-compact-item {
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .route-overview-flow {
    gap: var(--space-2xs);
  }

  .spot-card {
    padding: var(--space-sm);
  }

  .stay-section,
  .food-section,
  .ticket-section,
  .booking-section,
  .budget-section,
  .pitfall-section {
    padding: var(--space-sm);
  }

  .stay-card-main {
    padding: var(--space-sm);
  }

  .stay-card-footer {
    padding: var(--space-xs) var(--space-sm);
  }

  .food-card {
    padding: var(--space-xs);
    gap: var(--space-xs);
  }

  .food-card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}

@media (min-width: 480px) {
  .ticket-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 640px) {
  .stay-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .food-list {
    display: grid;
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
  .expandable-content,
  .spot-card,
  .photo-item,
  .timeline-compact-item,
  .guide-module-title-large,
  .guide-module-title-large::before,
  .guide-module-title-large::after,
  .stay-card,
  .food-card {
    animation: none;
    transition: none;
    opacity: 1;
    transform: none;
    letter-spacing: 0.05em;
  }
  .guide-module.expanded .guide-module-content {
    max-height: none;
  }
  .expandable-content.expanded {
    max-height: none;
  }
}
</style>
