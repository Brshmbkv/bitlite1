<template>
  <div class="current-event__card">
    <div class="current-event-card__header">
      <div class="current-event-card-header__img">
        <CurrentExerciseIcon />
      </div>
      <div class="current-event-card-header__content">
        <span class="current-event-card-header__subtitle">ТЕКУЩИЙ УРОК</span>
        <h3 class="current-event-card-header__title">
          {{ event.title }}
        </h3>
        <v-progress-linear
          style="border-radius: 9999px;"
          background-color="#DBDFE4"
          color="#35C773"
          :value="event.passed_count"
          height="12"
        ></v-progress-linear>
        <span class="current-event-card-header__text"
          >{{ event.passed_count }} задач из {{ event.exercise_count }}</span
        >
      </div>
      <button
        class="current-event-card-header__btn"
        type="button"
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
    <div class="current-event-card__footer">
      <div class="current-event-card-footer__date-wrapper">
        <FilledClockIcon />
        <span class="current-event-card-footer__date"
          >до {{ event.deadline_at | shortFormat }}</span
        >
      </div>
      <div class="current-event-card__exp">
        <span>{{ event.total_points }} XP</span>
      </div>
    </div>
  </div>
</template>

<script>
import CurrentExerciseIcon from '@/assets/svg/currentExercise.svg'
import FilledClockIcon from '@/assets/svg/filledClock.svg'

export default {
  components: {
    CurrentExerciseIcon,
    FilledClockIcon,
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss">
.current-event__card {
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
  margin-top: 24px;
}
.current-event-card__header,
.current-event-card__footer {
  display: flex;
  align-content: center;
}
.current-event-card__header {
  padding: 23px 24px 25px;
}
.current-event-card__footer {
  padding: 11px 24px;
  background-color: #f5f6f8;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.current-event-card-header {
  &__img {
    display: grid;
    place-content: center;
  }
  &__content {
    flex: 1;
    margin-left: 30px;
  }
  &__subtitle {
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
    text-transform: uppercase;
    color: #77818f;
  }
  &__title {
    font-size: 20px;
    font-weight: 700;
    line-height: 20px;
    color: #171729;
    margin: 16px 0 28px;
  }
  &__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: #505768;
    display: inline-block;
    margin-top: 8px;
  }
  &__btn {
    padding: 12px 10px;
    margin-left: 122px;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
    color: #fff;
    background-color: #0bc3b8;
    border-radius: 5px;
    align-self: center;
  }
}
.current-event-card-footer {
  &__date-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  &__date {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.01em;
  }
}
.current-event-card__exp {
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.02em;
  padding: 5px 11px;
  border-radius: 9999px;
  background-color: #ffc739;
}
</style>
