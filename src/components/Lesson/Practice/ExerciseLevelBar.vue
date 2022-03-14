<template>
  <div class="level-bars">
    <LevelBarsIcon :class="[`level-bars--${level}`]"/>
  </div>
</template>

<script>
import LevelBarsIcon from '@/assets/svg/level.svg';

export default {
  name: "ExerciseLevelBar",
  components: {
    LevelBarsIcon
  },
  props: {
    level: {
      type: [String, Number],
      default: 1
    }
  }
}
</script>

<style lang="scss">
.level-bars {
  width: 24px;
  height: 24px;

  &--1 {
    #palka-1 {
      fill-opacity: 1;
    }
  }

  &--2 {
    #palka-1, #palka-2 {
      fill-opacity: 1;
    }
  }

  &--3 {
    #palka-1, #palka-2, #palka-3 {
      fill-opacity: 1;
    }
  }
}
</style>
