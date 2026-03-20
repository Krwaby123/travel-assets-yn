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
        card-id="shangri-venue"
        card-name="香格里拉景点"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="venue-section">
          <div class="venue-item" v-for="venue in data.venues" :key="venue.name">
            <div class="venue-name">
              {{ venue.name }}
              <span class="venue-tag" :class="{ optional: venue.optional }">{{ venue.tag }}</span>
            </div>
            <div class="venue-desc">{{ venue.desc }}</div>
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="shangri-transport"
        card-name="香格里拉交通指南"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="simple-info">
          <div class="simple-info-title">🚗 交通指南</div>
          <div class="simple-info-content">
            <strong>丽江→香格里拉：</strong>高铁70元，1小时20分钟<br>
            <strong>高铁站→古城：</strong>打车10元，公交1路2元<br>
            <strong>古城→松赞林寺：</strong>公交3路2元，打车15元<br>
            <strong>古城→纳帕海：</strong>租电动车50元/天，拼车环湖人均30-40元<br>
            <strong>古城→普达措：</strong>景区直通车30元往返，拼车人均50元
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="shangri-budget"
        card-name="香格里拉预算参考"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="simple-info">
          <div class="simple-info-title">💰 预算参考（1-2天）</div>
          <div class="simple-info-content">
            <strong>常规版约350元：</strong>松赞林寺70元+住宿100元+餐饮80元+交通50元<br>
            <strong>经济版约150元：</strong>只逛免费景点+青旅住宿+公交出行
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="shangri-info"
        card-name="香格里拉住宿美食"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">住宿首选</div>
            <div class="info-content">独克宗古城周边，双床房140-200元/晚。3月底夜间最低-5℃，优先选有地暖/供氧的民宿</div>
          </div>
          <div class="info-item">
            <div class="info-label">必吃美食</div>
            <div class="info-content">牦牛肉火锅、酥油茶（甜口10元/壶，能缓解高反）、青稞饼、藏式酸奶</div>
          </div>
        </div>
      </InfoCard>

      <div class="warning-box fade-in">
        <strong>高原提醒：</strong>刚到别剧烈运动、别洗澡、别喝酒。氧气瓶提前在古城药店买。别信路边"100元骑马环湖"，容易被宰。
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

.venue-tag.optional {
  background: var(--text-muted);
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
