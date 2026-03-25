<template>
  <section class="section dounan-section">
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

    <!-- 区域1：斗南总览区（默认展开，不折叠） -->
    <div id="kunming-guide-area-overview" class="guide-module guide-module-expanded" ref="module-overview">
      <div class="guide-module-header guide-module-header-static">
        <div class="section-number">{{ data.number }}</div>
        <h2 class="guide-module-title guide-module-title-large">{{ data.title }}</h2>
      </div>
      <div class="guide-module-content-wrapper">
        <p class="section-desc">{{ data.desc }}</p>
        <button class="section-map-btn" @click="$emit('open-map', '斗南花市')" aria-label="在地图上查看斗南花市">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>查看地图</span>
        </button>

        <div class="quick-tips">
          <div class="quick-tip" v-for="tip in data.quickTips" :key="tip.label">
            <div class="quick-tip-icon">{{ tip.icon }}</div>
            <div class="quick-tip-label">{{ tip.label }}</div>
            <div class="quick-tip-value" v-html="tip.value"></div>
          </div>
        </div>

        <div class="dounan-photos">
          <div
            class="photo-item"
            :class="{ 'img-loaded': loadedImages[photo.src], 'img-error': imgErrors[photo.src] }"
            v-for="(photo, index) in data.photos"
            :key="photo.label"
            :style="{ '--photo-index': index }"
            @click="$emit('open-lightbox', photo.src, photo.label)"
          >
            <img :src="photo.src" :alt="photo.label" loading="lazy" referrerpolicy="no-referrer" @load="handleImageLoad(photo.src)" @error="handleImageError(photo.src)">
            <span class="photo-label">{{ photo.label }}</span>
            <div class="img-fallback" v-if="imgErrors[photo.src]">
              <span>🖼️</span>
              <span>图片加载失败</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域2：营业时间与路线区 -->
    <div id="kunming-guide-area-time" class="guide-module" :class="{ expanded: expandedModules.time }" ref="module-time">
      <div class="guide-module-header guide-module-collapsible" @click="toggleModule('time')">
        <h3 class="guide-module-title">营业时间 & 逛买路线</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.time }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dounan-time-table"
            card-name="斗南营业时间表"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="time-table">
              <div class="time-table-title"><span class="emoji" aria-hidden="true">⏰</span> 营业时间（别跑空）</div>
              <div class="time-table-row time-table-header">
                <div class="time-table-cell">区域</div>
                <div class="time-table-cell">时间</div>
                <div class="time-table-cell">特点</div>
              </div>
              <div class="time-table-row" v-for="(row, index) in data.timeTable.rows" :key="row.area" :style="{ '--row-index': index }">
                <div class="time-table-cell area">{{ row.area }}</div>
                <div class="time-table-cell" :class="{ highlight: row.highlight }">{{ row.time }}</div>
                <div class="time-table-cell tip">{{ row.tip }}</div>
              </div>
            </div>
          </InfoCard>

          <div class="alert-box">
            <span class="alert-box-icon">⚠️</span>
            <span class="alert-box-text"><strong>别跑空：</strong>18:00-20:30主场馆闭馆转场，这个时间段只能逛场馆外。</span>
          </div>

          <InfoCard
            card-id="dounan-routes"
            card-name="斗南逛买路线"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="simple-info">
              <div class="simple-info-title">
                <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                两条逛买路线
              </div>
              <div class="simple-info-content">
                <strong>白天版（14:00-18:00）：</strong>主场馆1楼鲜花→2楼拍卖参观→3楼多肉→1/2号馆伴手礼<br>
                <strong>夜间版（20:30后）：</strong>场外夜市→主场馆捡漏→快递点寄花回家
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域3：场馆分区详解区 -->
    <div id="kunming-guide-area-venue" class="guide-module" :class="{ expanded: expandedModules.venue }" ref="module-venue">
      <div class="guide-module-header guide-module-collapsible" @click="toggleModule('venue')">
        <h3 class="guide-module-title">场馆分区详解</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.venue }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dounan-venue"
            card-name="斗南场馆详解"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="venue-section">
              <div class="venue-item venue-item-floor1">
                <div class="venue-name">主场馆1楼 <span class="venue-tag">核心</span></div>
                <div class="venue-desc">鲜切花核心区，玫瑰/向日葵/洋桔梗/满天星全品类。单头玫瑰10-15元/20支，满天星按斤卖。</div>
              </div>
              <div class="venue-item venue-item-floor2">
                <div class="venue-name">主场馆2楼 <span class="venue-tag">必看</span></div>
                <div class="venue-desc">亚洲最大花卉拍卖大厅，15:00开始拍卖，免费围观，堪比竞技场。</div>
              </div>
              <div class="venue-item venue-item-floor3">
                <div class="venue-name">主场馆3楼 + 1/2号馆 <span class="venue-tag">推荐</span></div>
                <div class="venue-desc">3楼多肉5-10元/盆；1号馆干花永生花；2号馆伴手礼鲜花饼。避坑：银器红木别碰。</div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域4：鲜花物流指南区 -->
    <div id="kunming-guide-area-logistics" class="guide-module" :class="{ expanded: expandedModules.logistics }" ref="module-logistics">
      <div class="guide-module-header guide-module-collapsible" @click="toggleModule('logistics')">
        <h3 class="guide-module-title">寄花回家物流指南</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.logistics }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dounan-shipping"
            card-name="斗南寄花指南"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="shipping-section">
              <div class="shipping-title"><span class="emoji" aria-hidden="true">📦</span> 寄花回家</div>
              <div class="shipping-warning">{{ data.shipping?.warning }}</div>
              <div class="shipping-methods">
                <div class="shipping-method" v-for="method in data.shipping?.methods" :key="method.name">
                  <div class="shipping-method-name">{{ method.name }}</div>
                  <div class="shipping-method-channels">{{ method.channels }}</div>
                  <div class="shipping-method-feature">{{ method.feature }}</div>
                </div>
              </div>
              <div class="shipping-tips">{{ data.shipping?.tips }}</div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域5：选花技巧与避坑区 -->
    <div id="kunming-guide-area-skills" class="guide-module" :class="{ expanded: expandedModules.skills }" ref="module-skills">
      <div class="guide-module-header guide-module-collapsible" @click="toggleModule('skills')">
        <h3 class="guide-module-title">选花技巧 & 避坑指南</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.skills }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dounan-tips"
            card-name="斗南选花技巧"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="simple-info">
              <div class="simple-info-title"><span class="emoji" aria-hidden="true">🌿</span> 选花技巧</div>
              <div class="simple-info-content">
                <strong>1.</strong> 选花苞半开的，别买完全盛开的<br>
                <strong>2.</strong> 看花瓣无烂瓣霉点，花茎粗壮不发软<br>
                <strong>3.</strong> 配花（勿忘我/满天星/尤加利叶）让老板送
              </div>
            </div>
          </InfoCard>

          <div class="warning-box">
            <strong>避坑：</strong>别买流动摊贩的隔夜花、染色喷漆花（蓝色妖姬）；晚上大胆砍价，嘴甜喊"嬢嬢"；按斤卖的花让老板去包装再称。
          </div>
        </div>
      </div>
    </div>

    <!-- 区域6：预算与配套区 -->
    <div id="kunming-guide-area-budget" class="guide-module" :class="{ expanded: expandedModules.budget }" ref="module-budget">
      <div class="guide-module-header guide-module-collapsible" @click="toggleModule('budget')">
        <h3 class="guide-module-title">预算参考 & 配套服务</h3>
        <span class="guide-module-toggle" :class="{ expanded: expandedModules.budget }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </div>
      <div class="guide-module-content">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dounan-budget"
            card-name="斗南预算参考"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="simple-info">
              <div class="simple-info-title"><span class="emoji" aria-hidden="true">💰</span> 预算参考（半天）</div>
              <div class="simple-info-content">
                <strong>常规版约100元：</strong>买花50元+寄花运费20元+小吃20元+地铁往返4-14元<br>
                <strong>经济版约30元：</strong>只逛不买+地铁往返
              </div>
            </div>
          </InfoCard>

          <InfoCard
            card-id="dounan-info"
            card-name="斗南交通美食"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">交通</div>
                <div class="info-content">地铁4号线<strong class="text-forest">金桂街站B口</strong>出站就是，票价按里程2-7元。别坐到斗南站（多走1公里）</div>
              </div>
              <div class="info-item">
                <div class="info-label">美食</div>
                <div class="info-content">场内炸洋芋、木瓜水5-15元；无名豆花米线8元；嘉华/潘祥记鲜花饼市场里有门店</div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import InfoCard from '../InfoCard.vue'

defineProps({
  data: Object,
  hiddenCards: Set
})

const emit = defineEmits(['hide-card', 'open-lightbox', 'open-map', 'module-toggle'])

const imgErrors = reactive({})
const loadedImages = reactive({})

const modules = [
  { id: 'overview', title: '昆明·斗南花市', shortTitle: '总览' },
  { id: 'time', title: '营业时间 & 逛买路线', shortTitle: '时间路线' },
  { id: 'venue', title: '场馆分区详解', shortTitle: '场馆详解' },
  { id: 'logistics', title: '寄花回家物流指南', shortTitle: '寄花指南' },
  { id: 'skills', title: '选花技巧 & 避坑指南', shortTitle: '技巧避坑' },
  { id: 'budget', title: '预算参考 & 配套服务', shortTitle: '预算配套' }
]

const expandedModules = reactive({
  time: false,
  venue: false,
  logistics: false,
  skills: false,
  budget: false
})

const activeModule = ref('overview')
const quickNavBar = ref(null)

const handleImageLoad = (src) => {
  loadedImages[src] = true
}

const handleImageError = (src) => {
  imgErrors[src] = true
}

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
  const element = document.getElementById(`kunming-guide-area-${moduleId}`)
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
        const id = entry.target.id.replace('kunming-guide-area-', '')
        activeModule.value = id
      }
    })
  }, {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
  })

  nextTick(() => {
    document.querySelectorAll('.guide-module[id^="kunming-guide-area"]').forEach(el => {
      observer.observe(el)
    })
  })
})
</script>

<style scoped>
@import '../slides-common.css';

.dounan-section {
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
  min-height: 36px;
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
  margin-bottom: var(--space-md);
}

.section-map-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  background: var(--forest-light);
  border: 2px solid var(--forest);
  border-radius: var(--space-sm);
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--forest);
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.section-map-btn:hover {
  background: var(--forest);
  color: white;
}

.section-map-btn:active {
  transform: scale(0.96);
}

.section-map-btn svg {
  width: 16px;
  height: 16px;
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

.dounan-photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
}

.photo-item {
  aspect-ratio: 1;
  border-radius: var(--space-sm);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.95);
  animation: photoReveal 0.5s var(--ease-out-quart) forwards;
  animation-delay: calc(var(--photo-index, 0) * 100ms);
}

@keyframes photoReveal {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-normal) var(--ease-out-quart);
}

.photo-item:hover img {
  transform: scale(1.05);
}

.photo-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-xl) var(--space-2xs) var(--space-2xs);
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
  color: white;
  font-size: 0.7rem;
  text-align: center;
}

.img-fallback {
  position: absolute;
  inset: 0;
  background: var(--earth-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.time-table {
  background: var(--card);
  border: 2px solid var(--forest);
  border-radius: var(--space-md);
  overflow: hidden;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.time-table-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--forest);
  padding: var(--space-sm) var(--space-md);
  background: var(--forest-light);
  text-align: center;
}

.time-table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 1px;
  background: var(--border);
}

.time-table-row + .time-table-row {
  border-top: 1px solid var(--border);
}

.time-table-cell {
  background: var(--card);
  padding: var(--space-xs);
  font-size: var(--text-xs);
  line-height: 1.5;
  min-width: 60px;
}

.time-table-cell.area {
  min-width: 70px;
}

.time-table-header .time-table-cell {
  font-weight: 600;
  color: var(--text-muted);
  background: var(--earth-light);
}

.time-table-cell.area {
  font-weight: 500;
  color: var(--forest);
}

.time-table-cell.highlight {
  background: var(--sunset-soft);
  color: var(--sunset);
  font-weight: 600;
}

.time-table-cell.tip {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.alert-box {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: var(--sunset-soft);
  border-radius: var(--space-sm);
  margin: var(--space-md) 0;
  font-size: calc(0.8rem * var(--text-scale, 1));
  color: var(--sunset);
}

.alert-box-icon {
  flex-shrink: 0;
}

.simple-info {
  padding: var(--space-md);
}

.simple-info-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.title-icon {
  width: 16px;
  height: 16px;
}

.simple-info-content {
  font-size: calc(0.8rem * var(--text-scale, 1));
  line-height: 1.8;
  color: var(--text);
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

.venue-name {
  font-size: calc(0.85rem * var(--text-scale, 1));
  font-weight: 700;
  color: var(--forest);
  margin-bottom: var(--space-xs);
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

.venue-desc {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.6;
}

.shipping-section {
  padding: var(--space-md);
}

.shipping-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.shipping-warning {
  background: var(--sunset-soft);
  color: var(--sunset);
  font-size: calc(0.75rem * var(--text-scale, 1));
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--space-xs);
  margin-bottom: var(--space-sm);
  text-align: center;
}

.shipping-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.shipping-method {
  background: var(--forest-light);
  border-radius: var(--space-sm);
  padding: var(--space-sm);
}

.shipping-method-name {
  font-size: calc(0.8rem * var(--text-scale, 1));
  font-weight: 700;
  color: var(--forest);
  margin-bottom: 2px;
}

.shipping-method-channels {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text);
  font-weight: 600;
}

.shipping-method-feature {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
  margin-top: 2px;
}

.shipping-tips {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px dashed var(--border);
}

.warning-box {
  padding: var(--space-sm);
  background: var(--earth-light);
  border-left: 3px solid var(--sunset);
  border-radius: var(--space-sm);
  margin: var(--space-md) 0;
  font-size: calc(0.8rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.6;
}

.info-grid {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.info-item {
  padding-bottom: var(--space-sm);
  border-bottom: 1px dashed var(--border);
}

.info-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
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

.text-forest {
  color: var(--forest);
  font-weight: 600;
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
  .dounan-photos {
    gap: 2px;
  }
  .time-table-cell {
    padding: var(--space-xs);
    font-size: 0.7rem;
  }
  .venue-item {
    padding: var(--space-xs);
  }
  .venue-name {
    font-size: 0.8rem;
  }
  .venue-desc {
    font-size: 0.7rem;
  }
}

@media (min-width: 480px) {
  .time-table-cell {
    padding: var(--space-sm);
    font-size: var(--text-sm);
  }
  .shipping-methods {
    flex-direction: row;
  }
  .shipping-method {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .guide-module-content {
    transition: none;
  }
  .guide-module-toggle {
    transition: none;
  }
  .photo-item {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
