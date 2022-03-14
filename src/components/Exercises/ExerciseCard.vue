<template>
  <div class="exercise__card">
    <div class="exercise-card__header">
      <h1 class="exercise-card-header__title">{{ event.module }}</h1>
      <span class="exercise-card-header__exp">{{ event.total_points }} XP</span>
    </div>
    <div class="exercise-card__content">
      <h2 class="exercise-card__subtitle">{{ event.title }}</h2>
      <div>
        <p class="exercise-card__text">Решено:</p>
        <p class="exercise-card__counter-text">
          {{ event.passed_count }} задач из {{ event.exercise_count }}
        </p>
        <div class="exercise-card__deadline-wrapper">
          <FilledClockIcon style="color: #5E6A82;" />
          <p class="exercise-card__deadline-text">
            до {{ event.deadline_at | shortFormat }}
          </p>
        </div>
        <hr class="exercise-card__line" />
        <button
          class="exercise-card__btn"
          @click="
            $router.push({
              name: 'ExercisePracticesIndex',
              params: { event_id: event.id },
            })
          "
        >
          Продолжить Практику
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import FilledClockIcon from '@/assets/svg/filledClock.svg'

export default {
  components: {
    FilledClockIcon,
  },
  props: ['event'],
}
</script>

<style lang="scss">
.exercise__card {
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(23, 23, 41, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 0 0 265px;
  p {
    margin-bottom: 0;
  }
}
.exercise-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px;
  background-color: #f5f6f8;
}
.exercise-card-header {
  &__title {
    font-size: 13px;
    font-weight: 500;
    line-height: 16px;
    color: #5a6275;
  }
  &__exp {
    display: block;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.02em;
    color: #171729;
    padding: 3px 10px;
    background-color: #ffc739;
    border-radius: 9999px;
  }
}
.exercise-card {
  &__content {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__subtitle {
    font-size: 15px;
    font-weight: 700;
    line-height: 20px;
    color: #000000;
    letter-spacing: 0.01em;
  }
  &__text {
    margin-top: 26px;
    font-size: 13px;
    line-height: 16px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: #5a6275;
  }
  &__counter-text {
    margin-top: 10px;
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: #171729;
    padding: 4px 10px;
    background-color: #f0f2f6;
    border-radius: 5px;
  }
  &__deadline-wrapper {
    margin-top: 18px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  &__deadline-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: #171729;
  }
  &__line {
    display: block;
    border: none;
    border-top: 1px solid #dbdfea;
    margin: 16px 0;
  }
  &__btn {
    padding: 10px 36px;
    width: 100%;
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
    color: #0bc3b8;
    border: 2px solid #0bc3b8;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #d8f5f3;
    }
  }
}
</style>
