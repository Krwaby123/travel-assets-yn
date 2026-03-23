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
          <div class="quick-tip-value" v-html="tip.value"></div>
        </div>
      </div>

      <div class="dounan-photos">
        <div
          class="photo-item photo-reveal"
          v-for="(photo, index) in data.photos"
          :key="photo.label"
          :style="{ '--photo-index': index }"
          @click="$emit('open-lightbox', photo.src, photo.label)"
        >
          <img :src="photo.src" :alt="photo.label" loading="lazy" referrerpolicy="no-referrer">
          <span class="photo-label">{{ photo.label }}</span>
        </div>
      </div>

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

      <div class="alert-box fade-in">
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
          <div class="simple-info-title"><span class="emoji" aria-hidden="true">📍</span> 两条逛买路线</div>
          <div class="simple-info-content">
            <strong>白天版（14:00-18:00）：</strong>主场馆1楼鲜花→2楼拍卖参观→3楼多肉→1/2号馆伴手礼<br>
            <strong>夜间版（20:30后）：</strong>场外夜市→主场馆捡漏→快递点寄花回家
          </div>
        </div>
      </InfoCard>

      <InfoCard
        card-id="dounan-venue"
        card-name="斗南场馆详解"
        :hidden-cards="hiddenCards"
        @hide="(id, name) => $emit('hide-card', id, name)"
      >
        <div class="venue-section">
          <div class="venue-item">
            <div class="venue-name">主场馆1楼 <span class="venue-tag">核心</span></div>
            <div class="venue-desc">鲜切花核心区，玫瑰/向日葵/洋桔梗/满天星全品类。单头玫瑰10-15元/20支，满天星按斤卖。</div>
          </div>
          <div class="venue-item">
            <div class="venue-name">主场馆2楼 <span class="venue-tag">必看</span></div>
            <div class="venue-desc">亚洲最大花卉拍卖大厅，15:00开始拍卖，免费围观，堪比竞技场。</div>
          </div>
          <div class="venue-item">
            <div class="venue-name">主场馆3楼 + 1/2号馆 <span class="venue-tag">推荐</span></div>
            <div class="venue-desc">3楼多肉5-10元/盆；1号馆干花永生花；2号馆伴手礼鲜花饼。避坑：银器红木别碰。</div>
          </div>
        </div>
      </InfoCard>

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

      <div class="warning-box fade-in">
        <strong>避坑：</strong>别买流动摊贩的隔夜花、染色喷漆花（蓝色妖姬）；晚上大胆砍价，嘴甜喊"嬢嬢"；按斤卖的花让老板去包装再称。
      </div>

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

.dounan-photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xs);
  margin: var(--space-md) 0;
}

.photo-item {
  aspect-ratio: 1;
  border-radius: var(--space-sm);
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.time-table {
  background: var(--card);
  border: 2px solid var(--forest);
  border-radius: var(--space-md);
  overflow: hidden;
  margin: var(--space-lg) 0;
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
  padding: var(--space-xs) var(--space-xs);
  font-size: var(--text-xs);
  line-height: 1.5;
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
  font-weight: calc(700 + var(--text-weight-boost, 0));
  color: var(--forest);
  margin-bottom: 2px;
}

.shipping-method-channels {
  font-size: calc(0.75rem * var(--text-scale, 1));
  color: var(--text);
  font-weight: calc(600 + var(--text-weight-boost, 0));
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

@media (min-width: 480px) {
  .time-table-cell {
    padding: var(--space-sm) var(--space-sm);
    font-size: var(--text-sm);
  }
  .shipping-methods {
    flex-direction: row;
  }
  .shipping-method {
    flex: 1;
  }
}
</style>
