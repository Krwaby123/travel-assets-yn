<template>
  <section class="section dounan-section">
    <!-- 快速导航栏 -->
    <nav class="quick-nav-bar" ref="quickNavBar">
      <div class="quick-nav-track">
        <div class="quick-nav-indicator" :style="indicatorStyle"></div>
        <button
          v-for="module in modules"
          :key="module.id"
          :class="['quick-nav-btn', { active: activeModule === module.id }]"
          @click.stop="scrollToModule(module.id)"
        >
          <span class="nav-btn-text">{{ module.shortTitle || module.title }}</span>
        </button>
      </div>
      <!-- 快捷跳转按钮 -->
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
                <div v-if="section.cards && section.cards.length > 0" class="jump-cards">
                  <button
                    v-for="card in section.cards"
                    :key="card.id"
                    class="jump-card-btn"
                    @click="handleJump(section.id, card.id)"
                  >
                    <span class="jump-card-dot"></span>
                    <span class="jump-card-name">{{ card.name }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
            <div class="quick-tip-value" v-html="sanitizeHtml(tip.value)"></div>
          </div>
        </div>

        <div class="dounan-photos">
          <div
            class="photo-item"
            :class="{ 'img-loaded': loadedImages[photo.src], 'img-error': imgErrors[photo.src] }"
            v-for="(photo, index) in data.photos"
            :key="photo.label"
            :style="{ '--photo-index': index }"
            role="button"
            tabindex="0"
            :aria-label="'查看图片: ' + photo.label"
            @click="$emit('open-lightbox', photo.src, photo.label)"
            @keydown.enter="$emit('open-lightbox', photo.src, photo.label)"
            @keydown.space.prevent="$emit('open-lightbox', photo.src, photo.label)"
          >
            <img :src="photo.src" :alt="photo.label" loading="lazy" referrerpolicy="no-referrer" @load="handleImageLoad(photo.src)" @error="handleImageError(photo.src)">
            <span class="photo-label">{{ photo.label }}</span>
            <div class="img-fallback" v-if="imgErrors[photo.src]" role="img" :aria-label="photo.label + ' - 图片加载失败'">
              <span aria-hidden="true">🖼️</span>
              <span>{{ photo.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域2：营业时间与路线区 -->
    <div id="kunming-guide-area-time" class="guide-module" :class="{ expanded: expandedModules.time }" ref="module-time">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.time" :aria-controls="'module-content-time'" @click="toggleModule('time')" @keydown.enter="toggleModule('time')" @keydown.space.prevent="toggleModule('time')">
        <div class="module-header-left">
          <h3 class="guide-module-title">营业时间 & 逛买路线</h3>
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
          <span class="guide-module-toggle" :class="{ expanded: expandedModules.time }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </div>
</div>
      <div class="guide-module-content" id="module-content-time">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dounan-time-table"
            card-name="斗南营业时间表"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="unified-timeline">
              <div class="unified-timeline-header">
                <svg class="unified-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span class="unified-title">斗南一日游时间线</span>
                <span class="unified-subtitle">按时间规划，不跑空</span>
              </div>

              <div class="timeline-journey">
                <!-- 简略时段：不推荐 + 闭馆 -->
                <div class="timeline-brief">
                  <div class="brief-item skip">
                    <svg class="brief-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span class="brief-time">09:00-14:00</span>
                    <span class="brief-label">不推荐</span>
                    <span class="brief-note">花商未齐，拍卖未开</span>
                  </div>
                  <div class="brief-item warning">
                    <svg class="brief-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span class="brief-time">18:00-20:30</span>
                    <span class="brief-label">闭馆转场</span>
                    <span class="brief-note">主场馆闭馆，逛外围</span>
                  </div>
                </div>

                <!-- 详细路线：白天 -->
                <div class="timeline-detail phase-day">
                  <div class="detail-header">
                    <div class="detail-left">
                      <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                      </svg>
                      <div class="detail-title-group">
                        <span class="detail-title">白天逛买路线</span>
                        <span class="detail-time">14:00-18:00</span>
                      </div>
                    </div>
                    <span class="detail-tag good">游客友好</span>
                  </div>
                  <div class="detail-steps">
                    <div class="detail-step">
                      <span class="detail-step-num">1</span>
                      <div class="detail-step-content">
                        <span class="detail-step-name">主场馆1楼鲜花</span>
                        <span class="detail-step-note">慢慢挑，玫瑰10-15元/20支</span>
                      </div>
                    </div>
                    <div class="detail-step">
                      <span class="detail-step-num">2</span>
                      <div class="detail-step-content">
                        <span class="detail-step-name">2楼拍卖参观</span>
                        <span class="detail-step-note">15:00开始，免费围观</span>
                      </div>
                    </div>
                    <div class="detail-step">
                      <span class="detail-step-num">3</span>
                      <div class="detail-step-content">
                        <span class="detail-step-name">3楼多肉</span>
                        <span class="detail-step-note">5-10元/盆</span>
                      </div>
                    </div>
                    <div class="detail-step">
                      <span class="detail-step-num">4</span>
                      <div class="detail-step-content">
                        <span class="detail-step-name">1/2号馆伴手礼</span>
                        <span class="detail-step-note">鲜花饼、干花</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 详细路线：夜间 -->
                <div class="timeline-detail phase-night">
                  <div class="detail-header">
                    <div class="detail-left">
                      <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                      <div class="detail-title-group">
                        <span class="detail-title">夜间捡漏路线</span>
                        <span class="detail-time">20:30-凌晨</span>
                      </div>
                    </div>
                    <span class="detail-tag best">价格最低</span>
                  </div>
                  <div class="detail-steps">
                    <div class="detail-step highlight">
                      <span class="detail-step-num">1</span>
                      <div class="detail-step-content">
                        <span class="detail-step-name">场外夜市</span>
                        <span class="detail-step-note">先逛夜市热热身</span>
                      </div>
                    </div>
                    <div class="detail-step highlight">
                      <span class="detail-step-num">2</span>
                      <div class="detail-step-content">
                        <span class="detail-step-name">主场馆捡漏</span>
                        <span class="detail-step-note hot">价格腰斩！大胆砍价</span>
                      </div>
                    </div>
                    <div class="detail-step">
                      <span class="detail-step-num">3</span>
                      <div class="detail-step-content">
                        <span class="detail-step-name">快递点寄花</span>
                        <span class="detail-step-note">顺丰冷链直邮回家</span>
                      </div>
                    </div>
                  </div>
                  <div class="detail-tip">
                    <svg class="detail-tip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <span>夜间花价更低，嘴甜喊"嬢嬢"能砍更多</span>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域3：场馆分区详解区 - 流程步骤式 -->
    <div id="kunming-guide-area-venue" class="guide-module" :class="{ expanded: expandedModules.venue }" ref="module-venue">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.venue" :aria-controls="'module-content-venue'" @click="toggleModule('venue')" @keydown.enter="toggleModule('venue')" @keydown.space.prevent="toggleModule('venue')">
        <div class="module-header-left">
          <h3 class="guide-module-title">场馆分区详解</h3>
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
          <span class="guide-module-toggle" :class="{ expanded: expandedModules.venue }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="guide-module-content" id="module-content-venue">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dounan-venue"
            card-name="斗南场馆详解"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="venue-flow">
              <div class="flow-intro">推荐游览顺序</div>

              <div class="flow-steps">
                <!-- 步骤1 -->
                <div class="flow-step">
                  <div class="step-marker">
                    <div class="step-num-wrap">
                      <span class="step-num">1</span>
                    </div>
                    <div class="step-line"></div>
                  </div>
                  <div class="step-body">
                    <div class="step-header">
                      <span class="step-emoji">🌺</span>
                      <span class="step-name">主场馆1楼</span>
                      <span class="step-tag core">核心</span>
                    </div>
                    <p class="step-desc">鲜切花核心区，玫瑰/向日葵/洋桔梗/满天星全品类。单头玫瑰10-15元/20支，满天星按斤卖。</p>
                    <div class="step-note">💡 早上去最新鲜，晚上价格更低</div>
                  </div>
                </div>

                <!-- 步骤2 -->
                <div class="flow-step">
                  <div class="step-marker">
                    <div class="step-num-wrap">
                      <span class="step-num">2</span>
                    </div>
                    <div class="step-line"></div>
                  </div>
                  <div class="step-body">
                    <div class="step-header">
                      <span class="step-emoji">🎬</span>
                      <span class="step-name">主场馆2楼</span>
                      <span class="step-tag must">必看</span>
                    </div>
                    <p class="step-desc">亚洲最大花卉拍卖大厅，15:00开始拍卖，免费围观，堪比竞技场。</p>
                    <div class="step-note">💡 拍卖过程很震撼，值得一看</div>
                  </div>
                </div>

                <!-- 步骤3 -->
                <div class="flow-step">
                  <div class="step-marker">
                    <div class="step-num-wrap">
                      <span class="step-num">3</span>
                    </div>
                  </div>
                  <div class="step-body">
                    <div class="step-header">
                      <span class="step-emoji">🌵</span>
                      <span class="step-name">主场馆3楼 + 1/2号馆</span>
                      <span class="step-tag recommend">推荐</span>
                    </div>
                    <p class="step-desc">3楼多肉5-10元/盆；1号馆干花永生花；2号馆伴手礼鲜花饼。</p>
                    <div class="step-note warning">⚠️ 避坑：银器红木别碰</div>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>

    <!-- 区域4：鲜花物流指南区 -->
    <div id="kunming-guide-area-logistics" class="guide-module" :class="{ expanded: expandedModules.logistics }" ref="module-logistics">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.logistics" :aria-controls="'module-content-logistics'" @click="toggleModule('logistics')" @keydown.enter="toggleModule('logistics')" @keydown.space.prevent="toggleModule('logistics')">
        <div class="module-header-left">
          <h3 class="guide-module-title">寄花回家物流指南</h3>
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
          <span class="guide-module-toggle" :class="{ expanded: expandedModules.logistics }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="guide-module-content" id="module-content-logistics">
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

    <!-- 区域5：选花技巧与避坑区 - 清单式 -->
    <div id="kunming-guide-area-skills" class="guide-module" :class="{ expanded: expandedModules.skills }" ref="module-skills">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.skills" :aria-controls="'module-content-skills'" @click="toggleModule('skills')" @keydown.enter="toggleModule('skills')" @keydown.space.prevent="toggleModule('skills')">
        <div class="module-header-left">
          <h3 class="guide-module-title">选花技巧 & 避坑指南</h3>
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
          <span class="guide-module-toggle" :class="{ expanded: expandedModules.skills }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="guide-module-content" id="module-content-skills">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dounan-tips"
            card-name="斗南选花技巧"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="tips-garden">
              <div class="tips-garden-header">
                <span class="tips-garden-icon">🌿</span>
                <span class="tips-garden-title">选花技巧</span>
              </div>

              <div class="tips-flowers">
                <div class="tip-flower" v-for="(tip, idx) in flowerTips" :key="idx">
                  <div class="tip-petal"></div>
                  <div class="tip-content">
                    <span class="tip-number">{{ idx + 1 }}</span>
                    <p class="tip-text">{{ tip }}</p>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          <div class="pitfall-zone">
            <div class="pitfall-header">
              <div class="pitfall-header-inner">
                <svg class="pitfall-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span class="pitfall-title">避坑指南</span>
              </div>
            </div>

            <div class="pitfall-items">
              <div class="pitfall-item" v-for="(item, idx) in pitfallTips" :key="idx">
                <div class="pitfall-x">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </div>
                <span class="pitfall-text">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域6：预算与配套区 - 进度条式 -->
    <div id="kunming-guide-area-budget" class="guide-module" :class="{ expanded: expandedModules.budget }" ref="module-budget">
      <div class="guide-module-header guide-module-collapsible" tabindex="0" role="button" :aria-expanded="expandedModules.budget" :aria-controls="'module-content-budget'" @click="toggleModule('budget')" @keydown.enter="toggleModule('budget')" @keydown.space.prevent="toggleModule('budget')">
        <div class="module-header-left">
          <h3 class="guide-module-title">预算参考 & 配套服务</h3>
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
          <span class="guide-module-toggle" :class="{ expanded: expandedModules.budget }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="guide-module-content" id="module-content-budget">
        <div class="guide-module-content-inner">
          <InfoCard
            card-id="dounan-budget"
            card-name="斗南预算参考"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="budget-compare">
              <div class="budget-header-row">
                <span class="budget-label-text">预算对比（半天）</span>
              </div>

              <div class="budget-bars">
                <div class="budget-bar-item">
                  <div class="bar-info">
                    <span class="bar-name">💰 常规版</span>
                    <span class="bar-amount">约100元</span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill bar-fill-normal" style="width: 100%"></div>
                  </div>
                  <div class="bar-breakdown">
                    <span class="breakdown-item">买花50</span>
                    <span class="breakdown-item">运费20</span>
                    <span class="breakdown-item">小吃20</span>
                    <span class="breakdown-item">地铁10</span>
                  </div>
                </div>

                <div class="budget-bar-item">
                  <div class="bar-info">
                    <span class="bar-name">🚶 经济版</span>
                    <span class="bar-amount">约30元</span>
                  </div>
                  <div class="bar-track">
                    <div class="bar-fill bar-fill-economy" style="width: 30%"></div>
                  </div>
                  <div class="bar-breakdown">
                    <span class="breakdown-item">只逛不买</span>
                    <span class="breakdown-item">地铁往返</span>
                  </div>
                </div>
              </div>

              <div class="budget-savings">
                <span class="savings-icon">💡</span>
                <span class="savings-text">经济版可省 <strong>70元</strong>，适合想体验氛围不想买太多的朋友</span>
              </div>
            </div>
          </InfoCard>

          <InfoCard
            card-id="dounan-info"
            card-name="斗南交通美食"
            :hidden-cards="hiddenCards"
            @hide="(id, name) => $emit('hide-card', id, name)"
          >
            <div class="info-flow">
              <div class="info-flow-item">
                <div class="info-flow-icon">🚇</div>
                <div class="info-flow-content">
                  <div class="info-flow-label">交通</div>
                  <div class="info-flow-text">
                    地铁4号线<strong>金桂街站B口</strong>出站就是，票价按里程2-7元。
                    <span class="info-flow-tip">别坐到斗南站（多走1公里）</span>
                  </div>
                </div>
              </div>
              <div class="info-flow-item">
                <div class="info-flow-icon">🍜</div>
                <div class="info-flow-content">
                  <div class="info-flow-label">美食</div>
                  <div class="info-flow-text">
                    场内炸洋芋、木瓜水5-15元；无名豆花米线8元；嘉华/潘祥记鲜花饼市场里有门店
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
import InfoCard from '../InfoCard.vue'
import { sanitizeHtml } from '@/utils/sanitize'

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

const jumpSections = [
  {
    id: 'overview',
    title: '总览',
    icon: '🌺',
    cards: []
  },
  {
    id: 'time',
    title: '营业时间 & 逛买路线',
    icon: '⏰',
    cards: [
      { id: 'dounan-time-table', name: '斗南营业时间表' }
    ]
  },
  {
    id: 'venue',
    title: '场馆分区详解',
    icon: '🏛️',
    cards: [
      { id: 'dounan-venue', name: '斗南场馆详解' }
    ]
  },
  {
    id: 'logistics',
    title: '寄花回家物流指南',
    icon: '📦',
    cards: [
      { id: 'dounan-shipping', name: '斗南寄花指南' }
    ]
  },
  {
    id: 'skills',
    title: '选花技巧 & 避坑指南',
    icon: '🌿',
    cards: [
      { id: 'dounan-tips', name: '斗南选花技巧' }
    ]
  },
  {
    id: 'budget',
    title: '预算参考 & 配套服务',
    icon: '💰',
    cards: [
      { id: 'dounan-budget', name: '斗南预算参考' },
      { id: 'dounan-info', name: '斗南交通美食' }
    ]
  }
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
const showJumpPanel = ref(false)

const indicatorStyle = computed(() => {
  const index = modules.findIndex(m => m.id === activeModule.value)
  if (index === -1) return {}
  return {
    '--indicator-index': index
  }
})

const flowerTips = [
  '选花苞半开的，别买完全盛开的',
  '看花瓣无烂瓣霉点，花茎粗壮不发软',
  '配花（勿忘我/满天星/尤加利叶）让老板送'
]

const pitfallTips = [
  '别买流动摊贩的隔夜花',
  '染色喷漆花（蓝色妖姬）不要买',
  '晚上大胆砍价，嘴甜喊"嬢嬢"',
  '按斤卖的花让老板去包装再称'
]

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

const handleJump = (moduleId, cardId = null) => {
  showJumpPanel.value = false
  expandModule(moduleId)

  nextTick(() => {
    if (cardId) {
      const cardElement = document.querySelector(`[data-card-id="${cardId}"]`)
      if (cardElement) {
        const navHeight = quickNavBar.value ? quickNavBar.value.offsetHeight : 0
        const elementPosition = cardElement.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: elementPosition - navHeight - 16,
          behavior: 'smooth'
        })
        return
      }
    }
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
  flex: 1;
  min-width: 0;
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
    var(--forest) 0%,
    var(--sunset) 50%,
    var(--forest) 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: petalReveal 1.5s var(--ease-out-quart) forwards,
             gradientFlow 3s ease-in-out infinite;
  opacity: 0;
  margin-left: 1.8rem;
  position: relative;
}

.guide-module-title-large::before {
  content: '✿';
  position: absolute;
  left: -1.8rem;
  top: 50%;
  transform: translateY(-50%) rotate(0deg);
  font-size: 0.75em;
  opacity: 0;
  animation: petalFloat 2s var(--ease-out-quart) 0.3s forwards;
  color: var(--sunset);
}

@keyframes petalReveal {
  0% {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes gradientFlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes petalFloat {
  0% {
    opacity: 0;
    transform: translateY(-50%) translateX(-20px) rotate(-30deg);
  }
  100% {
    opacity: 0.7;
    transform: translateY(-50%) translateX(0) rotate(0deg);
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
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-bottom: 2px;
}

.quick-tip-value {
  font-size: 0.75rem;
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
  background: linear-gradient(to top, var(--overlay), transparent);
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

/* ===== 统一时间线 ===== */
.unified-timeline {
  padding: var(--space-md);
}

.unified-timeline-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--forest-light);
}

.unified-icon {
  width: 24px;
  height: 24px;
  color: var(--forest);
}

.unified-title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--forest);
}

.unified-subtitle {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-left: auto;
}

.timeline-journey {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* 简略时段 */
.timeline-brief {
  display: flex;
  gap: var(--space-sm);
}

.brief-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: var(--earth-light);
  border-radius: var(--space-sm);
  font-size: var(--text-xs);
}

.brief-item.skip {
  background: var(--earth-light);
}

.brief-item.warning {
  background: var(--sunset-soft);
}

.brief-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--text-muted);
}

.brief-item.warning .brief-icon {
  color: var(--sunset);
}

.brief-time {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

.brief-item.warning .brief-time {
  color: var(--sunset);
}

.brief-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text);
}

.brief-note {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-left: auto;
}

/* 详细路线 */
.timeline-detail {
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: var(--space-md);
  overflow: hidden;
}

.timeline-detail.phase-day {
  border-color: var(--forest);
}

.timeline-detail.phase-night {
  border-color: var(--info);
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
}

.timeline-detail.phase-day .detail-header {
  background: linear-gradient(135deg, var(--forest-light) 0%, var(--sky-light) 100%);
}

.timeline-detail.phase-night .detail-header {
  background: var(--info-light);
}

.detail-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.detail-icon {
  width: 22px;
  height: 22px;
  color: var(--forest);
}

.timeline-detail.phase-night .detail-icon {
  color: var(--info);
}

.detail-title-group {
  display: flex;
  flex-direction: column;
}

.detail-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--forest);
}

.timeline-detail.phase-night .detail-title {
  color: var(--info);
}

.detail-time {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.detail-tag {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
}

.detail-tag.good {
  background: var(--forest);
  color: white;
}

.detail-tag.best {
  background: var(--info);
  color: white;
}

.detail-steps {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.detail-step {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--forest-light);
  border-radius: var(--space-sm);
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.detail-step:hover {
  transform: translateX(4px);
}

.detail-step.highlight {
  background: var(--info-light);
  border: 1px solid var(--info);
}

.detail-step-num {
  width: 22px;
  height: 22px;
  background: var(--forest);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.detail-step.highlight .detail-step-num {
  background: var(--info);
}

.detail-step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-step-name {
  font-size: calc(0.85rem * var(--text-scale, 1));
  font-weight: 600;
  color: var(--text);
}

.detail-step-note {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text-muted);
}

.detail-step-note.hot {
  color: var(--sunset);
  font-weight: 600;
}

.detail-tip {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0 var(--space-md) var(--space-md);
  padding: var(--space-sm);
  background: var(--warning-light);
  border-radius: var(--space-sm);
  font-size: calc(0.8rem * var(--text-scale, 1));
  color: var(--warning-muted);
}

.detail-tip-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* ===== 场馆流程步骤 ===== */
.venue-flow {
  padding: var(--space-md);
}

.flow-intro {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 1px dashed var(--border);
}

.flow-steps {
  display: flex;
  flex-direction: column;
}

.flow-step {
  display: flex;
  gap: var(--space-md);
}

.flow-step + .flow-step {
  margin-top: var(--space-md);
}

.step-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-num-wrap {
  width: 28px;
  height: 28px;
  background: var(--forest);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-num {
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
}

.step-line {
  flex: 1;
  width: 2px;
  background: linear-gradient(to bottom, var(--forest), var(--forest-light));
  margin-top: var(--space-xs);
  min-height: 80px;
}

.flow-step:last-child .step-line {
  display: none;
}

.step-body {
  flex: 1;
  padding-bottom: var(--space-md);
}

.flow-step:last-child .step-body {
  padding-bottom: 0;
}

.step-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-xs);
}

.step-emoji {
  font-size: 1.1rem;
}

.step-name {
  font-size: calc(0.95rem * var(--text-scale, 1));
  font-weight: 700;
  color: var(--forest);
}

.step-tag {
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: var(--space-xs);
  font-weight: 600;
}

.step-tag.core {
  background: var(--sunset-soft);
  color: var(--sunset);
}

.step-tag.must {
  background: var(--forest-light);
  color: var(--forest);
}

.step-tag.recommend {
  background: var(--sky-light);
  color: var(--sky);
}

.step-desc {
  font-size: calc(0.85rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.7;
  margin-bottom: var(--space-xs);
}

.step-note {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text-muted);
  padding: var(--space-xs) var(--space-sm);
  background: var(--forest-light);
  border-radius: var(--space-xs);
  display: inline-block;
}

.step-note.warning {
  background: var(--sunset-soft);
  color: var(--sunset);
}

/* ===== 物流样式 ===== */
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

/* ===== 选花技巧花园式布局 ===== */
.tips-garden {
  position: relative;
  padding: var(--space-md);
}

.tips-garden-header {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 2px dashed var(--forest-light);
}

.tips-garden-icon {
  font-size: 1.5rem;
  animation: gentleSway 3s ease-in-out infinite;
}

@keyframes gentleSway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.tips-garden-title {
  font-family: 'LXGW WenKai', serif;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--forest);
  letter-spacing: 0.1em;
}

.tips-flowers {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.tip-flower {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 0;
}

.tip-petal {
  width: 4px;
  background: linear-gradient(to bottom, var(--forest), var(--forest-light));
  border-radius: 2px;
  flex-shrink: 0;
  position: relative;
}

.tip-petal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: var(--forest);
  border-radius: 50%;
}

.tip-flower:nth-child(2) .tip-petal {
  background: linear-gradient(to bottom, var(--sunset), var(--sunset-soft));
}
.tip-flower:nth-child(2) .tip-petal::before {
  background: var(--sunset);
}

.tip-flower:nth-child(3) .tip-petal {
  background: linear-gradient(to bottom, var(--sky), var(--sky-light));
}
.tip-flower:nth-child(3) .tip-petal::before {
  background: var(--sky);
}

.tip-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--earth-light);
  border-radius: 0 var(--space-sm) var(--space-sm) var(--space-sm);
  margin-left: -1px;
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.tip-flower:hover .tip-content {
  background: var(--forest-light);
}

.tip-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--forest);
  color: white;
  border-radius: 8px;
  font-size: calc(0.85rem * var(--text-scale, 1));
  font-weight: 700;
  flex-shrink: 0;
  font-family: 'LXGW WenKai', serif;
}

.tip-flower:nth-child(2) .tip-number {
  background: var(--sunset);
}

.tip-flower:nth-child(3) .tip-number {
  background: var(--sky);
}

.tip-text {
  flex: 1;
  font-size: calc(0.9rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.7;
  margin: 0;
  padding-top: 3px;
}

/* ===== 避坑指南警示区 ===== */
.pitfall-zone {
  margin: var(--space-lg) 0;
  background: var(--card);
  border-radius: var(--space-md);
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.pitfall-header {
  background: linear-gradient(135deg, var(--sunset) 0%, color-mix(in oklch, var(--sunset) 70%, var(--forest)) 100%);
  padding: var(--space-sm) var(--space-md);
}

.pitfall-header-inner {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.pitfall-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.pitfall-title {
  font-family: 'LXGW WenKai', serif;
  font-size: var(--text-base);
  font-weight: 600;
  color: white;
  letter-spacing: 0.1em;
}

.pitfall-items {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.pitfall-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--sunset-soft);
  border-radius: var(--space-sm);
  transition: all var(--duration-fast) var(--ease-out-quart);
}

.pitfall-item:hover {
  transform: translateX(4px);
  background: color-mix(in oklch, var(--sunset-soft) 80%, var(--sunset));
}

.pitfall-x {
  width: 20px;
  height: 20px;
  background: var(--sunset);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.pitfall-x svg {
  width: 10px;
  height: 10px;
  color: white;
}

.pitfall-text {
  flex: 1;
  font-size: calc(0.85rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.6;
}

/* ===== 预算进度条 ===== */
.budget-compare {
  padding: var(--space-md);
}

.budget-header-row {
  margin-bottom: var(--space-md);
}

.budget-label-text {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--forest);
}

.budget-bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.budget-bar-item {
  position: relative;
}

.bar-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.bar-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text);
}

.bar-amount {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--forest);
}

.bar-track {
  height: 12px;
  background: var(--forest-light);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s var(--ease-out-quart);
  position: relative;
}

.bar-fill-normal {
  background: linear-gradient(90deg, var(--forest) 0%, var(--sky) 100%);
}

.bar-fill-economy {
  background: linear-gradient(90deg, var(--sunset) 0%, var(--sunset-soft) 100%);
}

.bar-fill::after {
  content: '';
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  opacity: 0.6;
}

.bar-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
  margin-top: var(--space-sm);
}

.breakdown-item {
  font-size: calc(0.7rem * var(--text-scale, 1));
  color: var(--text-muted);
  background: var(--bg);
  padding: var(--space-2xs) var(--space-xs);
  border-radius: var(--space-xs);
}

.budget-savings {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-top: var(--space-md);
  padding: var(--space-sm);
  background: linear-gradient(135deg, var(--forest-light) 0%, var(--sky-light) 100%);
  border-radius: var(--space-sm);
}

.savings-icon {
  font-size: 1rem;
}

.savings-text {
  font-size: calc(0.8rem * var(--text-scale, 1));
  color: var(--text);
}

.savings-text strong {
  color: var(--sunset);
}

/* ===== 信息流 ===== */
.info-flow {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.info-flow-item {
  display: flex;
  gap: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px dashed var(--border);
}

.info-flow-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.info-flow-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-flow-content {
  flex: 1;
}

.info-flow-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--forest);
  margin-bottom: var(--space-2xs);
}

.info-flow-text {
  font-size: calc(0.85rem * var(--text-scale, 1));
  color: var(--text);
  line-height: 1.6;
}

.info-flow-text strong {
  color: var(--forest);
}

.info-flow-tip {
  display: block;
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--sunset);
  margin-top: var(--space-2xs);
}

@media (max-width: 480px) {
  .quick-nav-btn {
    font-size: 0.7rem;
    padding: var(--space-sm);
    min-height: 44px;
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
    font-size: calc(0.7rem * var(--text-scale, 1));
  }
  .dounan-photos {
    gap: 2px;
  }
  .timeline-brief {
    flex-direction: column;
  }
  .brief-item {
    font-size: calc(0.7rem * var(--text-scale, 1));
  }
  .brief-note {
    display: none;
  }
  .detail-header {
    padding: var(--space-xs) var(--space-sm);
  }
  .detail-title {
    font-size: calc(0.85rem * var(--text-scale, 1));
  }
  .detail-steps {
    padding: var(--space-sm);
  }
  .detail-step {
    padding: var(--space-xs);
  }
  .detail-step-name {
    font-size: calc(0.8rem * var(--text-scale, 1));
  }
  .detail-step-note {
    font-size: calc(0.7rem * var(--text-scale, 1));
  }
  .bar-breakdown {
    gap: var(--space-2xs);
  }
  .breakdown-item {
    font-size: calc(0.65rem * var(--text-scale, 1));
  }
}

@media (min-width: 480px) {
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
  .detail-step {
    transition: none;
  }
  .guide-module-title-large {
    animation: none;
    opacity: 1;
  }
  .guide-module-title-large::before {
    animation: none;
    opacity: 0.7;
  }
}
</style>
