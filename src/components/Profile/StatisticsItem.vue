<template>
  <div class="d-flex align-center">
    <div class="statistics-item__icon-container">
      <component
        :is="icon"
      />
    </div>
    <div class="d-flex flex-column align-content-space-between">
      <span class="statistics-item__title">{{ title }}</span>
      <p v-if="!loading" class="statistics-item__value mb-0">{{ value || 0 }}<span class="statistics-item__value-text"> {{ valueText }}</span></p>
      <p v-else class="statistics-item__value mb-0">...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatisticsItem",
  components: {
    InsightIcon: () => import('@/assets/svg/insights.svg'),
    BoardIcon: () => import('@/assets/svg/leaderboard.svg'),
    LampIcon: () => import('@/assets/svg/lamp.svg'),
    TaskIcon: () => import('@/assets/svg/task--white.svg')
  },
  props: {
    title: String,
    value: Number,
    valueText: String,
    icon: String,
    loading: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="scss">
.statistics-item__icon-container {
  background: linear-gradient(180.75deg, #0BC3B8 -7.46%, rgba(11, 195, 184, 0.4) 117.59%), #66F0E3;
  border-radius: 7px;
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  margin-right: 16px;
}

.statistics-item__title {
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: #9FA4B1;
}

.statistics-item__value {
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;

  &-text {
    font-weight: 500;
    font-size: 15px;
    line-height: 24px;
  }
}
</style>
