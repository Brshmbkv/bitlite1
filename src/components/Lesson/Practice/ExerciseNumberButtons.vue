<template>
  <div class="exercise-number__buttons">
    <button
      class="exercise-number__button"
      :class="[
        exercise &&
          exercise.auth_user_result &&
          getClass(exercise.auth_user_result.status),
        i === current && 'exercise-number__button--active',
      ]"
      v-for="(exercise, i) in exercises"
      :key="`exercise-${i}`"
      @click="$emit('update:current', i)"
    >
      <span class="exercise-number-btn__idx">{{ i + 1 }}</span>
      <span class="exercise-number-btn__text">{{ exercise.title }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ExerciseNumberButtons',
  props: {
    exercises: Array,
    current: Number,
    saved: Array,
  },
  methods: {
    // 1 - proverka(trener) | 2 - dorabotka | 3 - success | 4 - sdano s opozdaniem | 5 - proverka(compiler) | 6 - no popitki
    getClass(status) {
      const { code } = { ...status }
      return (
        {
          1: 'exercise-number__button--warning',
          2: 'exercise-number__button--error',
          3: 'exercise-number__button--success',
          4: 'exercise-number__button--success',
          5: 'exercise-number__button--warning',
          6: 'exercise-number__button--error',
          8: 'exercise-number__button--warning',
        }[code] || 'exercise-number__button'
      )
    },
  },
}
</script>

<style lang="scss">
$warning-color: #eab308;
$warning-color--bg: rgba($warning-color, 0.24);
$success-color: #34d399;
$success-color--bg: rgba($success-color, 0.24);
$error-color: #ef4444;
$error-color--bg: rgba($error-color, 0.24);

.exercise-number__buttons {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.exercise-number-btn {
  &__idx,
  &__text {
    font-size: 16px;
    line-height: 24px;
  }
  &__idx {
    font-weight: 600;
    color: #ffffff;
    display: grid;
    place-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: #4376fb;
  }
  &__text {
    color: #000221a3;
    font-weight: 500;
  }
}

.exercise-number__button {
  display: flex;
  align-items: center;
  column-gap: 12px;
  border-radius: 8px;
  border: 1px solid #b0b7d08f;
  padding: 11px;

  &--warning,
  &--success,
  &--error {
    &.exercise-number__button--active {
      padding: 10px;
    }
  }

  &--warning {
    .exercise-number-btn__idx {
      background-color: $warning-color--bg;
      color: $warning-color;
    }
  }

  &--success {
    .exercise-number-btn__idx {
      background-color: $success-color--bg;
      color: $success-color;
    }
  }

  &--error {
    .exercise-number-btn__idx {
      background-color: $error-color--bg;
      color: $error-color;
    }
  }

  &--active {
    border: 2px solid #4376fb;
    padding: 10px;
  }
}
</style>
