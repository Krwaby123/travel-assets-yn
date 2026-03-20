<template>
  <section class="section">
      <div class="section-header">
        <div class="section-number">{{ data.number }}</div>
        <h2 class="section-title title-style-petal">{{ data.title }}</h2>
        <p class="section-desc">{{ data.desc }}</p>
      </div>

      <div class="quick-tips fade-in">
        <div class="quick-tip" v-for="tip in data.quickTips" :key="tip.label">
          <div class="quick-tip-icon">{{ tip.icon }}</div>
          <div class="quick-tip-label">{{ tip.label }}</div>
          <div class="quick-tip-value">{{ tip.value }}</div>
        </div>
      </div>

      <figure class="section-cover fade-in">
        <img :src="data.coverImage.src" :alt="data.coverImage.caption" loading="lazy" referrerpolicy="no-referrer" @click="$emit('open-lightbox', data.coverImage.src, data.coverImage.caption)">
        <figcaption class="section-cover-caption">{{ data.coverImage.caption }}</figcaption>
      </figure>

      <InfoCard
        card-id="lijiang-tips"
        card-name="丽江核心要点"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="key-info">
          <div class="key-info-title">📌 核心要点</div>
          <div class="key-info-grid">
            <div class="key-info-row">
              <span class="key-info-row-icon">→</span>
              <span class="key-info-row-text"><strong>必玩：</strong>玉龙雪山（大索道登顶）、蓝月谷、丽江古城</span>
            </div>
            <div class="key-info-row">
              <span class="key-info-row-icon">→</span>
              <span class="key-info-row-text"><strong>省钱包：</strong>住市区，氧气瓶市区药店买15-20元，景区60元</span>
            </div>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="lijiang-venue"
        card-name="丽江景点"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="venue-section">
          <div class="venue-item" v-for="venue in data.venues" :key="venue.name">
            <div class="venue-name">{{ venue.name }} <span class="venue-tag">{{ venue.tag }}</span></div>
            <div class="venue-desc">{{ venue.desc }}</div>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="lijiang-transport"
        card-name="丽江交通指南"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="simple-info">
          <div class="simple-info-title">🚗 交通指南</div>
          <div class="simple-info-content">
            <strong>大理→丽江：</strong>高铁74-82元，1.5小时<br>
            <strong>古城→玉龙雪山：</strong>景区直通车20元往返，公交101路15元往返<br>
            <strong>古城→白沙古镇：</strong>公交6路2元，拼车人均10元<br>
            <strong>古城→束河古镇：</strong>公交5路2元，滴滴约10元
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="lijiang-budget"
        card-name="丽江预算参考"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="simple-info">
          <div class="simple-info-title">💰 预算参考（2天）</div>
          <div class="simple-info-content">
            <strong>常规版约500元：</strong>雪山门票210元+住宿100元+餐饮100元+市内交通50元<br>
            <strong>经济版约200元：</strong>只逛免费景点+青旅住宿+公交出行
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="lijiang-info"
        card-name="丽江住宿美食"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">住宿首选</div>
            <div class="info-content">古城南门/北门外围，步行5分钟到古城，双床房100-160元/晚</div>
          </div>
          <div class="info-item">
            <div class="info-label">必吃美食</div>
            <div class="info-content">腊排骨火锅、土鸡米线、纳西烤肉、鸡豆凉粉。古城外吃更划算</div>
          </div>
        </div>
      </InfoCard>

      <div class="warning-box fade-in">
        <strong>避坑：</strong>别信古城里"50元玉龙雪山一日游"，全是购物团；别买古城里的银器玉石；大索道票现场买不到，提前抢。
      </div>
    </section>
</template>

<script setup>
import InfoCard from '../InfoCard.vue'

defineProps({
  data: Object,
  hiddenCards: Set
})

defineEmits(['hide-card', 'open-lightbox'])
</script>

<style scoped>
@import '../slides-common.css';

.section-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--space-md);
  overflow: hidden;
  margin: var(--space-lg) 0;
  position: relative;
  background: var(--earth-light);
  cursor: pointer;
}

.section-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
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

.key-info {
  background: var(--card);
  border: 2px solid var(--forest);
  border-radius: var(--space-md);
  padding: var(--space-md);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.key-info-title {
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--forest);
  margin-bottom: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  letter-spacing: 0.02em;
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

.info-grid {
  display: grid;
  gap: var(--space-sm);
}

@media (min-width: 480px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
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
</style>
