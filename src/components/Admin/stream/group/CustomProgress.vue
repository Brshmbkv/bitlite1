<template>
  <div class="d-flex align-center">
    <div class="custom-progress">
      <div
        v-if="!inProgress"
        class="custom-progress__inner"
        :class="score === 100 && 'custom-progress__inner--rounded'"
        :style="{
        width: `${score}%`,
        background: getProgressColor()[0],
        borderRight: ![0, 100].includes(score) && `2px solid ${getProgressColor()[1]}`,
        overflow: !inProgress && 'hidden'
      }"
      ></div>
      <div v-else>
        <div class="custom-progress__gradient"></div>
        <span class="custom-progress__gradient__text">в процессе...</span>
      </div>
    </div>
    <span>{{ score }}%</span>
  </div>
</template>

<script>
export default {
  name: "CustomProgress",
  props: {
    score: {
      type: Number,
      default: 0
    },
    inProgress: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getProgressColor() {
      let { score } = this
      if(score < 50) {
        return ['#EB5757', '#A24141']
      } else if(score >= 50 && score < 80) {
        return ['#EF8C44', '#CC603B']
      } else if(score >= 80 && score <= 100) {
        return ['#5CC689', '#478A63']
      } else {
        return ['#0ACCDA', '']
      }
    },
  }
}
</script>

<style lang="scss">
.custom-progress {
  position: relative;
  height: 10px;
  background: #D5D5D6;
  border-radius: 1000px;
  max-width: 110px;
  min-width: 100px;
  margin-right: 12px;

  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    border-radius: 1000px 0 0 1000px;

    &--rounded {
      border-radius: 100px;
    }
  }

  &__gradient {
    background: linear-gradient(90deg, rgba(10, 204, 218, 0.4) 0, #3E77FF 50%, rgba(10, 204, 218, 0.4) 100%);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 100px;
    animation: in-progress 4.2s linear infinite;
    background-size: 200px;

    &__text {
      position: absolute;
      font-size: 10px;
      left: 20px;
      top: 15px;
      line-height: 105%;
      color: #5A6275;
      letter-spacing: 0.01em;
    }
  }

  @keyframes in-progress {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: 200px 0;
    }
  }
}
</style>
