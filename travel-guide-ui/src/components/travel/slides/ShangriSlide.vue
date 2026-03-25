<template>
  <section class="section shangri-section">
    <!-- 快速导航栏 -->
    <nav class="quick-nav-bar" ref="quickNavBar">
      <div class="quick-nav-inner">
        <button
          v-for="module in modules"
          :key="module.id"
          :class="['quick-nav-btn', { active: activeModule === module.id }]"
          @click="scrollToModule(module.id)"
        >
          {{ module.shortTitle || module.title }}
        </button>
      </div>
    </nav>

    <!-- 区域1：香格里拉总览区（默认展开，不折叠） -->
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

        <figure class="section-cover">
          <img :src="data.coverImage.src" :alt="data.coverImage.caption" loading="lazy" referrerpolicy="no-referrer" @click="$emit('open-lightbox', data.coverImage.src, data.coverImage.caption)">
          <figcaption class="section-cover-caption">{{ data.coverImage.caption }}</figcaption>
        </figure>
      </div>
    </div>

    <!-- 区域2：核心景点详解区 -->
    <div id="shangri-la-guide-area-scenic" class="guide-module" :class="{ expanded: expandedModules.scenic }" ref="module-scenic">
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
          <InfoCard
            card-id="shangri-venue"
            card-name="香格里拉景点"
            :hidden-cards="hiddenCards"
            :closable="false"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="venue-section">
              <div
                class="venue-item"
                v-for="venue in data.venues"
                :key="venue.name"
                :class="['venue-item-' + venue.name.replace(/\s+/g, '-').replace(/[·]/g, '-')]"
              >
                <div class="venue-header">
                  <div class="venue-name">
                    {{ venue.name }}
                    <span class="venue-tag" :class="{ optional: venue.optional }">{{ venue.tag }}</span>
                  </div>
                  <div class="venue-actions">
                    <button class="venue-map-btn" @click="$emit('open-map', venue.name)" :aria-label="'在地图上查看' + venue.name">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </button>
                    <span class="venue-time" v-if="venue.openTime">{{ venue.openTime }}</span>
                    <span class="venue-booking" v-if="venue.booking">{{ venue.booking }}</span>
                  </div>
                </div>
                <div class="venue-desc">{{ venue.desc }}</div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域3：门票预约指南区 -->
    <div id="shangri-la-guide-area-ticket" class="guide-module" :class="{ expanded: expandedModules.ticket }" ref="module-ticket">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.ticket" @click="toggleModule('ticket')" @keydown.enter="toggleModule('ticket')" @keydown.space.prevent="toggleModule('ticket')">
        <h3 class="guide-module-title">门票预约指南</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.ticket }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="shangri-booking"
            card-name="香格里拉预约信息"
            :hidden-cards="hiddenCards"
            :closable="false"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="booking-section">
              <div class="booking-title"><span class="emoji" aria-hidden="true">📅</span> 预约信息</div>
              <div class="booking-list">
                <div class="booking-item" v-for="item in data.bookingInfo" :key="item.spot">
                  <div class="booking-spot">{{ item.spot }}</div>
                  <div class="booking-note">{{ item.note }}</div>
                  <div class="booking-channel" v-if="item.channel">预约渠道：{{ item.channel }}</div>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域4：交通指南区 -->
    <div id="shangri-la-guide-area-traffic" class="guide-module" :class="{ expanded: expandedModules.traffic }" ref="module-traffic">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.traffic" @click="toggleModule('traffic')" @keydown.enter="toggleModule('traffic')" @keydown.space.prevent="toggleModule('traffic')">
        <h3 class="guide-module-title">交通指南</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.traffic }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="shangri-transport"
            card-name="香格里拉交通指南"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="simple-info">
              <div class="simple-info-title"><span class="emoji" aria-hidden="true">🚗</span> 交通指南</div>
              <div class="simple-info-content">
                <strong>丽江→香格里拉：</strong>高铁70元，1小时20分钟<br>
                <strong>高铁站→古城：</strong>打车10元，公交1路2元<br>
                <strong>古城→松赞林寺：</strong>公交3路2元，打车15元<br>
                <strong>古城→纳帕海：</strong>租电动车50元/天，拼车环湖人均30-40元<br>
                <strong>古城→普达措：</strong>景区直通车30元往返，拼车人均50元
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域5：预算参考区 -->
    <div id="shangri-la-guide-area-budget" class="guide-module" :class="{ expanded: expandedModules.budget }" ref="module-budget">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.budget" @click="toggleModule('budget')" @keydown.enter="toggleModule('budget')" @keydown.space.prevent="toggleModule('budget')">
        <h3 class="guide-module-title">预算参考</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.budget }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="shangri-budget"
            card-name="香格里拉预算参考"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="simple-info">
              <div class="simple-info-title"><span class="emoji" aria-hidden="true">💰</span> 预算参考（1-2天）</div>
              <div class="simple-info-content">
                <strong>常规版约350元：</strong>松赞林寺70元+住宿100元+餐饮80元+交通50元<br>
                <strong>经济版约150元：</strong>只逛免费景点+青旅住宿+公交出行
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域6：住宿美食推荐区 -->
    <div id="shangri-la-guide-area-stay-food" class="guide-module" :class="{ expanded: expandedModules['stay-food'] }" ref="module-stay-food">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules['stay-food']" @click="toggleModule('stay-food')" @keydown.enter="toggleModule('stay-food')" @keydown.space.prevent="toggleModule('stay-food')">
        <h3 class="guide-module-title">住宿 & 美食推荐</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules['stay-food'] }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="shangri-info"
            card-name="香格里拉住宿美食"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">🏨 住宿首选</div>
                <div class="info-content">独克宗古城周边，双床房140-200元/晚。3月底夜间最低-5℃，优先选有地暖/供氧的民宿</div>
              </div>
              <div class="info-item">
                <div class="info-label">🍜 必吃美食</div>
                <div class="info-content">牦牛肉火锅、酥油茶（甜口10元/壶，能缓解高反）、青稞饼、藏式酸奶</div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域7：高原出行提醒与避坑区 -->
    <div id="shangri-la-guide-area-tips" class="guide-module" :class="{ expanded: expandedModules.tips }" ref="module-tips">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.tips" @click="toggleModule('tips')" @keydown.enter="toggleModule('tips')" @keydown.space.prevent="toggleModule('tips')">
        <h3 class="guide-module-title">高原出行提醒 & 避坑指南</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.tips }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <div class="altitude-warning">
            <div class="altitude-warning-title">🏔️ 高原出行提醒</div>
            <div class="altitude-warning-list">
              <div class="altitude-warning-item">
                <span class="altitude-warning-icon">⚠️</span>
                <span><strong>刚到别剧烈运动</strong>，放慢走路节奏，不跑不跳</span>
              </div>
              <div class="altitude-warning-item">
                <span class="altitude-warning-icon">⚠️</span>
                <span><strong>当天别洗澡</strong>，避免着凉加重高反</span>
              </div>
              <div class="altitude-warning-item">
                <span class="altitude-warning-icon">⚠️</span>
                <span><strong>别喝酒</strong>，酒精会加重高原反应</span>
              </div>
              <div class="altitude-warning-item">
                <span class="altitude-warning-icon">💊</span>
                <span><strong>氧气瓶提前买</strong>，古城药店15-20元，景区60元</span>
              </div>
            </div>
          </div>

          <div class="warning-box">
            <strong>避坑：</strong>别信路边"100元骑马环湖"，容易被宰。纳帕海环湖免费，导航"环湖西路"即可。
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

const modules = [
  { id: 'overview', title: '香格里拉·藏地风光', shortTitle: '总览' },
  { id: 'scenic', title: '核心景点详解', shortTitle: '景点详解' },
  { id: 'ticket', title: '门票预约指南', shortTitle: '门票预约' },
  { id: 'traffic', title: '交通指南', shortTitle: '交通' },
  { id: 'budget', title: '预算参考', shortTitle: '预算' },
  { id: 'stay-food', title: '住宿 & 美食推荐', shortTitle: '住宿美食' },
  { id: 'tips', title: '高原出行提醒 & 避坑指南', shortTitle: '高原提醒' }
]

const expandedModules = reactive({
  scenic: false,
  ticket: false,
  traffic: false,
  budget: false,
  'stay-food': false,
  tips: false
})

const activeModule = ref('overview')
const quickNavBar = ref(null)

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

.quick-nav-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  padding: var(--space-xs) 0;
  margin: 0 calc(-1 * var(--space-md));
  padding-left: var(--space-md);
  padding-right: var(--space-md);
}

.quick-nav-inner {
  display: flex;
  gap: var(--space-xs);
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2px;
}

.quick-nav-inner::-webkit-scrollbar {
  display: none;
}

.quick-nav-btn {
  flex-shrink: 0;
  padding: var(--space-xs) var(--space-sm);
  background: var(--earth-light);
  border: 1px solid var(--border);
  border-radius: var(--space-sm);
  font-size: var(--text-xs);
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--duration-fast) var(--ease-out-quart);
  font-family: inherit;
  min-height: 44px;
}

.quick-nav-btn:hover {
  background: var(--forest-light);
  border-color: var(--forest);
  color: var(--forest);
}

.quick-nav-btn:active {
  transform: scale(0.96);
}

.quick-nav-btn.active {
  background: var(--forest);
  border-color: var(--forest);
  color: white;
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
  font-family: 'ZCOOL XiaoWei', serif;
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
  font-family: 'ZCOOL XiaoWei', serif;
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

.quick-tips {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.quick-tip {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
  text-align: center;
}

.quick-tip-icon {
  font-size: 1.25rem;
  margin-bottom: var(--space-2xs);
}

.quick-tip-label {
  font-size: calc(0.65rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-bottom: 2px;
}

.quick-tip-value {
  font-size: calc(0.75rem * var(--text-scale, 1));
  font-weight: 600;
  color: var(--forest);
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
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  color: white;
  font-size: 0.8rem;
  text-align: right;
}

.venue-section {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.venue-item {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
}

.venue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-xs);
}

.venue-name {
  font-size: calc(0.85rem * var(--text-scale, 1));
  font-weight: 700;
  color: var(--forest);
}

.venue-tag {
  display: inline-block;
  font-size: 0.65rem;
  padding: 2px 6px;
  background: var(--sunset);
  color: white;
  border-radius: var(--space-xs);
  margin-left: var(--space-xs);
  font-weight: 600;
}

.venue-tag.optional {
  background: var(--text-muted);
}

.venue-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xs);
}

.venue-map-btn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--forest);
  background: var(--forest-light);
  border-radius: var(--space-xs);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-out-quart);
  padding: 0;
}

.venue-map-btn:hover {
  background: var(--forest);
}

.venue-map-btn:hover svg {
  color: white;
}

.venue-map-btn:active {
  transform: scale(0.9);
}

.venue-map-btn svg {
  width: 14px;
  height: 14px;
  color: var(--forest);
  transition: color var(--duration-fast) var(--ease-out-quart);
}

.venue-time {
  font-size: 0.7rem;
  color: var(--text-muted);
  background: var(--earth-light);
  padding: 2px 6px;
  border-radius: var(--space-2xs);
}

.venue-booking {
  font-size: 0.7rem;
  color: var(--forest);
  background: var(--forest-light);
  padding: 2px 6px;
  border-radius: var(--space-2xs);
}

.venue-desc {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.6;
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

.booking-spot {
  font-size: calc(0.8rem * var(--text-scale, 1));
  font-weight: 700;
  color: var(--forest);
}

.booking-note {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-top: 2px;
}

.booking-channel {
  font-size: 0.7rem;
  color: var(--text);
  margin-top: 2px;
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
  font-size: calc(0.8rem * var(--text-scale, 1));
  line-height: 1.8;
  color: var(--text);
}

.info-grid {
  padding: var(--space-md);
  display: grid;
  gap: var(--space-md);
}

.info-item {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
}

.info-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-xs);
}

.info-content {
  font-size: calc(0.8rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.6;
}

.altitude-warning {
  margin: var(--space-md);
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--sky-light) 0%, var(--forest-light) 100%);
  border: 2px solid var(--sky);
  border-radius: var(--space-md);
}

.altitude-warning-title {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--sky);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.altitude-warning-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.altitude-warning-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
  font-size: calc(0.8rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.5;
}

.altitude-warning-icon {
  flex-shrink: 0;
}

.altitude-warning-item strong {
  color: var(--sky);
}

.warning-box {
  margin: var(--space-md);
  margin-top: 0;
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
  .section-cover {
    aspect-ratio: 16 / 9;
  }
}

@media (min-width: 480px) {
  .info-grid {
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
  .guide-module-toggle {
    transition: none;
  }
  .section-cover img {
    transition: none;
  }
}
</style>
