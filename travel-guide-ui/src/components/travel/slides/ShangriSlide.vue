<template>
  <section class="section shangri-section">
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

    <div id="shangri-la-guide-area-overview" class="guide-module guide-module-expanded" ref="module-overview">
      <div class="guide-module-header guide-module-header-static">
        <div class="section-number">{{ data.number }}</div>
        <h2 class="guide-module-title guide-module-title-large">{{ data.title }}</h2>
      </div>
      <div class="guide-module-content-wrapper">
        <p class="section-desc">{{ data.desc }}</p>

        <div class="quick-tips">
          <div class="quick-tip" v-for="tip in data.quickTips" :key="tip.label">
            <div class="quick-tip-icon">{{ tip.icon }}</div>
            <div class="quick-tip-label">{{ tip.label }}</div>
            <div class="quick-tip-value">{{ tip.value }}</div>
          </div>
        </div>

        <div class="plateau-preview">
          <div class="plateau-preview-header">
            <div class="plateau-icon-wrap">
              <svg class="plateau-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="plateau-title-group">
              <span class="plateau-title">高原藏地</span>
              <span class="plateau-subtitle">海拔3300m+ 循序渐进</span>
            </div>
            <span class="plateau-badge">注意高反</span>
          </div>
          <div class="plateau-highlights">
            <div class="plateau-highlight">
              <span class="highlight-icon">🏛️</span>
              <div class="highlight-content">
                <span class="highlight-name">松赞林寺</span>
                <span class="highlight-tag">小布达拉宫</span>
              </div>
            </div>
            <div class="plateau-highlight">
              <span class="highlight-icon">🎡</span>
              <div class="highlight-content">
                <span class="highlight-name">独克宗古城</span>
                <span class="highlight-tag">世界最大转经筒</span>
              </div>
            </div>
          </div>
          <div class="plateau-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>刚到别剧烈运动，当天别洗澡，氧气瓶市区药店买</span>
          </div>
        </div>

        <figure class="section-cover">
          <img :src="data.coverImage.src" :alt="data.coverImage.caption" loading="lazy" referrerpolicy="no-referrer" @click="$emit('open-lightbox', data.coverImage.src, data.coverImage.caption)">
          <figcaption class="section-cover-caption">{{ data.coverImage.caption }}</figcaption>
        </figure>
      </div>
    </div>

    <div id="shangri-la-guide-area-scenic" class="guide-module" :class="{ expanded: expandedModules.scenic }" ref="module-scenic">
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
          <div class="key-info-box">
            <div class="key-info-header">
              <span class="key-info-icon">📌</span>
              <span class="key-info-title">核心要点</span>
            </div>
            <div class="key-info-list">
              <div class="key-info-item">
                <span class="key-info-arrow">→</span>
                <span><strong>必玩：</strong>独克宗古城（转经筒）、松赞林寺、纳帕海环湖</span>
              </div>
              <div class="key-info-item">
                <span class="key-info-arrow">→</span>
                <span><strong>高原适应：</strong>第一天放慢节奏，不跑不跳，当天别洗澡</span>
              </div>
            </div>
          </div>

          <div class="spot-group">
            <div
              class="spot-card"
              v-for="(venue, idx) in data.venues"
              :key="venue.name"
              :style="{ '--spot-index': idx }"
              :class="{ 'spot-card-optional': venue.optional }"
            >
              <div class="spot-header">
                <div class="spot-title-row">
                  <h4 class="spot-name">{{ venue.name }}</h4>
                  <span class="spot-tag" :class="{ 'spot-tag-optional': venue.optional }">{{ venue.tag }}</span>
                  <button
                    class="spot-map-btn"
                    @click.stop="$emit('open-map', venue.name)"
                    :aria-label="'在地图上查看' + venue.name"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </button>
                </div>
                <p class="spot-desc">{{ venue.desc }}</p>
                <div class="spot-meta" v-if="venue.openTime || venue.booking">
                  <span class="spot-meta-item" v-if="venue.openTime">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12,6 12,12 16,14"/>
                    </svg>
                    {{ venue.openTime }}
                  </span>
                  <span class="spot-meta-item spot-booking" v-if="venue.booking">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    {{ venue.booking }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="shangri-la-guide-area-stay" class="guide-module" :class="{ expanded: expandedModules.stay }" ref="module-stay">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.stay" @click="toggleModule('stay')" @keydown.enter="toggleModule('stay')" @keydown.space.prevent="toggleModule('stay')">
        <div class="module-header-left">
          <h3 class="guide-module-title">住宿美食 & 交通</h3>
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
          <div class="stay-section">
            <div class="section-label">
              <span class="section-label-icon">🛏️</span>
              <span>住宿推荐</span>
            </div>
            <div class="stay-cards">
              <div class="stay-card">
                <div class="stay-card-header">
                  <span class="stay-card-name">独克宗古城周边</span>
                  <span class="stay-card-price">140-200元/晚</span>
                </div>
                <div class="stay-card-desc">3月底夜间最低-5℃，优先选有地暖/供氧的民宿</div>
                <div class="stay-card-tags">
                  <span class="stay-tag stay-tag-gold">地暖</span>
                  <span class="stay-tag stay-tag-gold">供氧</span>
                </div>
              </div>
            </div>
          </div>

          <div class="food-section">
            <div class="section-label">
              <span class="section-label-icon">🍜</span>
              <span>必吃美食</span>
            </div>
            <div class="food-grid">
              <div class="food-item" v-for="food in foods" :key="food.name">
                <div class="food-item-header">
                  <span class="food-item-name">{{ food.name }}</span>
                </div>
                <div class="food-item-tip">{{ food.tip }}</div>
              </div>
            </div>
          </div>

          <div class="transport-section">
            <div class="section-label">
              <span class="section-label-icon">🚗</span>
              <span>交通指南</span>
            </div>
            <div class="transport-list">
              <div class="transport-item" v-for="t in transports" :key="t.route">
                <div class="transport-route">{{ t.route }}</div>
                <div class="transport-detail">{{ t.detail }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="shangri-la-guide-area-info" class="guide-module" :class="{ expanded: expandedModules.info }" ref="module-info">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.info" @click="toggleModule('info')" @keydown.enter="toggleModule('info')" @keydown.space.prevent="toggleModule('info')">
        <div class="module-header-left">
          <h3 class="guide-module-title">门票预算 & 高原提醒</h3>
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
          <div class="altitude-warning-section">
            <div class="altitude-warning-header">
              <div class="prayer-wheel">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span>高原出行提醒</span>
            </div>
            <div class="altitude-warning-list">
              <div class="altitude-item" v-for="item in altitudeTips" :key="item.text">
                <span class="altitude-icon">{{ item.icon }}</span>
                <span class="altitude-text"><strong>{{ item.highlight }}</strong>{{ item.text }}</span>
              </div>
            </div>
          </div>

          <div class="booking-section">
            <div class="section-label">
              <span class="section-label-icon">📅</span>
              <span>预约信息</span>
            </div>
            <div class="booking-list">
              <div class="booking-item" v-for="item in data.bookingInfo" :key="item.spot">
                <div class="booking-spot">{{ item.spot }}</div>
                <div class="booking-note">{{ item.note }}</div>
                <div class="booking-channel" v-if="item.channel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  {{ item.channel }}
                </div>
              </div>
            </div>
          </div>

          <div class="budget-section">
            <div class="section-label">
              <span class="section-label-icon">💰</span>
              <span>预算参考（1-2天）</span>
            </div>
            <div class="budget-compare">
              <div class="budget-option">
                <div class="budget-option-header">
                  <span class="budget-option-name">常规版</span>
                  <span class="budget-option-price">约350元</span>
                </div>
                <div class="budget-option-breakdown">
                  松赞林寺70元 + 住宿100元 + 餐饮80元 + 交通50元
                </div>
              </div>
              <div class="budget-option budget-option-economy">
                <div class="budget-option-header">
                  <span class="budget-option-name">经济版</span>
                  <span class="budget-option-price">约150元</span>
                </div>
                <div class="budget-option-breakdown">
                  只逛免费景点 + 青旅住宿 + 公交出行
                </div>
              </div>
            </div>
          </div>

          <div class="pitfall-section">
            <div class="pitfall-header">
              <svg class="pitfall-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <span>避坑指南</span>
            </div>
            <div class="pitfall-items">
              <div class="pitfall-item" v-for="item in pitfalls" :key="item">
                <span class="pitfall-x">✕</span>
                <span>{{ item }}</span>
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

const modules = [
  { id: 'overview', title: '香格里拉·藏地风光', shortTitle: '总览' },
  { id: 'scenic', title: '核心景点详解', shortTitle: '景点详解' },
  { id: 'stay', title: '住宿美食 & 交通', shortTitle: '住宿美食' },
  { id: 'info', title: '门票预算 & 高原提醒', shortTitle: '门票预算' }
]

const jumpSections = [
  { id: 'overview', title: '总览', icon: '🏔️' },
  { id: 'scenic', title: '核心景点详解', icon: '🏛️' },
  { id: 'stay', title: '住宿美食 & 交通', icon: '🏨' },
  { id: 'info', title: '门票预算 & 高原提醒', icon: '🎫' }
]

const expandedModules = reactive({
  scenic: false,
  stay: false,
  info: false
})

const activeModule = ref('overview')
const quickNavBar = ref(null)
const showJumpPanel = ref(false)

const foods = [
  { name: '牦牛肉火锅', tip: '人均70元，古城内多家可选' },
  { name: '酥油茶', tip: '甜口10元/壶，能缓解高反' },
  { name: '青稞饼', tip: '配酥油茶更香' },
  { name: '藏式酸奶', tip: '口感醇厚，偏酸' }
]

const transports = [
  { route: '丽江→香格里拉', detail: '高铁70元，1小时20分钟' },
  { route: '高铁站→古城', detail: '打车10元，公交1路2元' },
  { route: '古城→松赞林寺', detail: '公交3路2元，打车15元' },
  { route: '古城→纳帕海', detail: '租电动车50元/天' }
]

const altitudeTips = [
  { icon: '⚠️', highlight: '刚到别剧烈运动', text: '，放慢走路节奏，不跑不跳' },
  { icon: '⚠️', highlight: '当天别洗澡', text: '，避免着凉加重高反' },
  { icon: '⚠️', highlight: '别喝酒', text: '，酒精会加重高原反应' },
  { icon: '💊', highlight: '氧气瓶提前买', text: '，古城药店15-20元，景区60元' }
]

const pitfalls = [
  '别信路边"100元骑马环湖"，容易被宰',
  '纳帕海环湖免费，导航"环湖西路"即可'
]

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

const scrollToModule = (moduleId) => {
  const element = document.getElementById(`shangri-la-guide-area-${moduleId}`)
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

defineExpose({
  expandModule,
  scrollToModule
})

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('shangri-la-guide-area-', '')
        activeModule.value = id
      }
    })
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
  })

  nextTick(() => {
    document.querySelectorAll('.guide-module[id^="shangri-la-guide-area"]').forEach(el => {
      observer.observe(el)
    })
  })
})
</script>

<style scoped>
@import '../slides-common.css';

.shangri-section {
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
  background: linear-gradient(135deg,
    var(--tibet-red) 0%,
    var(--amber) 30%,
    var(--warning) 50%,
    var(--tibet-blue) 80%,
    var(--tibet-red) 100%);
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: tibetReveal 1.2s var(--ease-out-quart) forwards,
             tibetFlow 5s ease-in-out infinite;
  opacity: 0;
  margin-left: 3rem;
  position: relative;
}

.guide-module-title-large::before {
  content: '☸';
  position: absolute;
  left: -3rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--tibet-red);
  opacity: 0;
  animation: prayerWheelSpin 0.8s var(--ease-out-quart) 0.3s forwards;
}

.guide-module-title-large::after {
  content: '';
  position: absolute;
  left: -1.8rem;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: var(--amber);
  border-radius: 50%;
  opacity: 0;
  animation: goldenDotFade 0.5s var(--ease-out-quart) 0.6s forwards;
}

@keyframes tibetReveal {
  0% {
    opacity: 0;
    transform: translateY(-10px);
    letter-spacing: 0.12em;
    filter: blur(2px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    letter-spacing: 0.05em;
    filter: blur(0);
  }
}

@keyframes tibetFlow {
  0%, 100% {
    background-position: 0% 50%;
    filter: brightness(1);
  }
  50% {
    background-position: 100% 50%;
    filter: brightness(1.05);
  }
}

@keyframes prayerWheelSpin {
  0% {
    opacity: 0;
    transform: translateY(-50%) rotate(-180deg) scale(0.5);
  }
  100% {
    opacity: 0.85;
    transform: translateY(-50%) rotate(0deg) scale(1);
  }
}

@keyframes goldenDotFade {
  0% {
    opacity: 0;
    transform: translateY(-50%) scale(0);
  }
  100% {
    opacity: 0.7;
    transform: translateY(-50%) scale(1);
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

.section-number {
  font-family: 'LXGW WenKai', serif;
  font-size: 0.75rem;
  color: var(--danger);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-xs);
}

.section-desc {
  font-size: calc(var(--text-sm) * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.8;
  margin-bottom: var(--space-lg);
}

.quick-tips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.quick-tip {
  background: var(--warning-light);
  border: 1px solid var(--warning);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
  text-align: center;
}

.quick-tip-icon {
  font-size: 1.25rem;
  margin-bottom: var(--space-2xs);
}

.quick-tip-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.quick-tip-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--warning-muted);
}

.plateau-preview {
  background: var(--card);
  border: 2px solid var(--warning);
  border-radius: var(--space-md);
  padding: var(--space-md);
  margin-bottom: var(--space-lg);
}

.plateau-preview-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.plateau-icon-wrap {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--danger) 0%, var(--warning) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plateau-icon {
  width: 22px;
  height: 22px;
  color: white;
}

.plateau-title-group {
  display: flex;
  flex-direction: column;
}

.plateau-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--danger-muted);
}

.plateau-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.plateau-badge {
  margin-left: auto;
  font-size: 0.65rem;
  padding: 4px 10px;
  background: var(--danger);
  color: white;
  border-radius: 999px;
  font-weight: 600;
}

.plateau-highlights {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.plateau-highlight {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: var(--card);
  border-radius: var(--space-sm);
  border-left: 3px solid var(--danger);
}

.plateau-highlight:last-child {
  border-left-color: var(--warning);
}

.highlight-icon {
  font-size: 1.5rem;
}

.highlight-content {
  display: flex;
  flex-direction: column;
}

.highlight-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.highlight-tag {
  font-size: 0.65rem;
  color: var(--danger-muted);
}

.plateau-warning {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: var(--danger-light);
  border-radius: var(--space-sm);
  font-size: 0.8rem;
  color: var(--danger-muted);
}

.plateau-warning svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--danger);
}

.section-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--space-md);
  overflow: hidden;
  position: relative;
  background: var(--earth-light);
  cursor: pointer;
}

.section-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s var(--ease-out-quart);
}

.section-cover:hover img {
  transform: scale(1.03);
}

.section-cover-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-2xl) var(--space-md) var(--space-sm);
  background: linear-gradient(to top, var(--overlay), transparent);
  color: white;
  font-size: 0.8rem;
  text-align: right;
}

.key-info-box {
  background: var(--warning-light);
  border: 2px solid var(--warning);
  border-radius: var(--space-md);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.key-info-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
}

.key-info-icon {
  font-size: 1rem;
}

.key-info-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--danger-muted);
}

.key-info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.key-info-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--text);
}

.key-info-arrow {
  color: var(--danger);
}

.key-info-item strong {
  color: #991b1b;
  font-weight: 600;
}

.spot-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.spot-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--space-md);
  padding: var(--space-md);
  opacity: 0;
  transform: translateY(16px);
  animation: spotReveal 0.5s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--spot-index, 0) * 80ms);
}

.spot-card-optional {
  border: 1px dashed var(--border);
  background: var(--earth-light);
}

@keyframes spotReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spot-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.spot-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.spot-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.spot-tag {
  display: inline-block;
  background: var(--warning-light);
  color: var(--warning-muted);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
}

.spot-tag-optional {
  background: var(--earth-light);
  color: var(--text-muted);
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

.spot-desc {
  font-size: calc(var(--text-sm) * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.6;
  margin: 0;
}

.spot-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
}

.spot-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--earth-light);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--space-2xs);
}

.spot-meta-item svg {
  width: 12px;
  height: 12px;
}

.spot-booking {
  background: var(--warning-light);
  color: var(--warning-muted);
}

.section-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.section-label-icon {
  font-size: 1.25rem;
}

.section-label span:last-child {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--forest);
}

.stay-section,
.food-section,
.transport-section,
.booking-section,
.budget-section,
.pitfall-section {
  padding: var(--space-md);
  border-bottom: 1px dashed var(--border);
}

.stay-section:last-child,
.food-section:last-child,
.transport-section:last-child,
.booking-section:last-child,
.budget-section:last-child,
.pitfall-section:last-child {
  border-bottom: none;
}

.stay-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.stay-card {
  background: var(--warning-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
  border-left: 3px solid var(--warning);
}

.stay-card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.stay-card-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--warning-muted);
}

.stay-card-price {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--danger);
}

.stay-card-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.stay-card-tags {
  display: flex;
  gap: var(--space-xs);
}

.stay-tag {
  font-size: 0.65rem;
  padding: 2px 6px;
  background: var(--earth-light);
  color: var(--text-muted);
  border-radius: var(--space-xs);
}

.stay-tag-gold {
  background: var(--warning-light);
  color: var(--warning-muted);
}

.food-grid {
  display: grid;
  gap: var(--space-sm);
}

.food-item {
  background: var(--danger-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
  border-left: 3px solid var(--danger);
}

.food-item-header {
  margin-bottom: 2px;
}

.food-item-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--danger-muted);
}

.food-item-tip {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.transport-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.transport-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-xs);
  font-size: 0.8rem;
}

.transport-route {
  font-weight: 600;
  color: var(--forest);
}

.transport-detail {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.altitude-warning-section {
  margin: var(--space-md);
  padding: var(--space-md);
  background: var(--info-light);
  border: 2px solid var(--info);
  border-radius: var(--space-md);
}

.altitude-warning-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--info-muted);
}

.prayer-wheel {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--danger) 0%, var(--warning) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prayer-wheel svg {
  width: 18px;
  height: 18px;
  color: white;
}

.altitude-warning-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.altitude-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  font-size: 0.85rem;
  color: var(--text);
  line-height: 1.5;
}

.altitude-icon {
  flex-shrink: 0;
  font-size: 1rem;
}

.altitude-text strong {
  color: var(--danger-muted);
}

.booking-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.booking-item {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
}

.booking-spot {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text);
}

.booking-note {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.booking-channel {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: var(--info-muted);
  margin-top: 4px;
}

.booking-channel svg {
  width: 12px;
  height: 12px;
}

.budget-compare {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.budget-option {
  background: var(--warning-light);
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
  color: var(--warning-muted);
}

.budget-option-breakdown {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.pitfall-section {
  background: var(--danger-light);
  border-radius: var(--space-md);
  margin: var(--space-md);
  padding: var(--space-md);
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
  color: var(--danger);
}

.pitfall-header span {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--danger-muted);
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
  background: var(--danger);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .quick-tips {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2xs);
  }

  .quick-tip {
    padding: var(--space-xs);
  }

  .quick-tip-icon {
    font-size: 1rem;
  }

  .quick-tip-value {
    font-size: 0.7rem;
  }

  .plateau-highlights {
    flex-direction: column;
  }

  .section-cover {
    aspect-ratio: 16 / 9;
  }

  .food-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 480px) {
  .food-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-cover {
    aspect-ratio: 2 / 1;
    border-radius: var(--space-lg);
  }
}

@media (min-width: 768px) {
  .section-cover {
    aspect-ratio: 21 / 9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .guide-module-content,
  .guide-module-toggle,
  .spot-card,
  .guide-module-title-large,
  .guide-module-title-large::before,
  .guide-module-title-large::after {
    animation: none;
    transition: none;
    opacity: 1;
    transform: none;
    letter-spacing: 0.05em;
  }

  .guide-module.expanded .guide-module-content {
    max-height: none;
  }
}
</style>
