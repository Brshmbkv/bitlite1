<template>
  <div
    class="exercise-chip"
    :style="{
      backgroundColor: bgColor || '#FFC739',
      color: textColor || '#FFFFFF'
    }"
    :class="[isStatus && 'exercise-chip--small']"
  >
    <v-icon v-if="icon" :color="textColor" class="mr-2" size="20">{{ icon }}</v-icon>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: "ExerciseChip",
  props: {
    text: String,
    icon: String,
    bgColor: String,
    textColor: String,
    isStatus: Boolean
  }
}
</script>

<style lang="scss">
.exercise-chip {
  border-radius: 1000px;
  display: flex;
  align-items: center;
  padding: 4px 12px;

  span {
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  &--small {
    span {
      font-size: 15px;
      line-height: 16px;
    }
  }
}
</style>
