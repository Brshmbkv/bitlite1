<template>
  <div class="exercise-practice__card">
    <div style="flex-shrink: 0;">
      <h2 class="exercise-practice-card__title">{{ item.title }}</h2>
      <div class="exercise-practice-card__info">
        <div
          class="exercise-practice-card__difficulty"
          :style="{
            color: getColor(item.level_coef),
            backgroundColor: getBgColor(item.level_coef),
          }"
        >
          <ExerciseLevelBar
            class="exercise-practice-card__level-bars"
            :level="getLevel(item.level_coef)"
          />
          <span
            class="exercise-practice-card__text exercise-practice-card__level-text"
            >{{ getText(item.level_coef) }}</span
          >
        </div>
        <div>
          <span class="exercise-practice-card__text">Попыток: {{getUserAttempts}}</span>
        </div>
        <div
          class="exercise-practice-card__text exercise-practice-card__exp-text"
        >
          <v-icon color="#171729" size="20" v-if="getExerciseStatus(item)">{{
            mdiCheck
          }}</v-icon>
          <v-icon color="#171729" size="20" v-else>{{ mdiPlus }}</v-icon>
          <span>{{ item.achieving_point }} XP</span>
        </div>
      </div>
    </div>
    <div>
      <button
        class="exercise-practice-card__btn"
        :class="[
          getExerciseStatus(item)
            ? 'exercise-practice-card__btn--solved'
            : 'exercise-practice-card__btn--not-solved',
        ]"
        type="button"
        @click="
          $router.push({
            name: 'EventExerciseShow',
            params: { event_id: eventId, exercise_id: item.id },
            query: {
              type,
            },
          })
        "
      >
        <v-icon v-if="getExerciseStatus(item)" size="24" color="#0BC3B8">{{
          mdiCheckboxMarkedCircleOutline
        }}</v-icon>
        <span>{{ getExerciseStatus(item) ? 'Решено' : 'Решить задачу' }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import ExerciseLevelBar from '@/components/Lesson/Practice/ExerciseLevelBar.vue'
import { mdiCheckboxMarkedCircleOutline, mdiPlus, mdiCheck } from '@mdi/js'

export default {
  components: { ExerciseLevelBar },
  props: {
    item: {
      type: Object,
      required: true,
    },
    eventId: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      mdiCheckboxMarkedCircleOutline,
      mdiPlus,
      mdiCheck,
    }
  },
  computed: {
    getUserAttempts() {
      return this.item?.auth_user_result?.attempts || 0
    },
  },
  methods: {
    getText(coef) {
      return {
        0.3: 'легкий',
        0.5: 'средний',
        1: 'сложный',
      }[coef]
    },
    getColor(coef) {
      return {
        0.3: '#208025',
        0.5: '#956C24',
        1: '#921F1F',
      }[coef]
    },
    getBgColor(coef) {
      return {
        0.3: '#D9F7CD',
        0.5: '#FFEBB9',
        1: '#FFCDCB',
      }[coef]
    },
    getLevel(coef) {
      return {
        0.3: 1,
        0.5: 2,
        1: 3,
      }[coef]
    },
    getExerciseStatus(item) {
      return [3, 4, 6, 8].includes(item?.auth_user_result?.status?.code)
    },
  },
}
</script>

<style lang="scss">
.exercise-practice__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 24px 16px;
  box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.08);
  &.exercise-practice-card--active {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.12);
    background: #ffffff;
    border-radius: 10px;
    border: none;
  }
}
.exercise-practice-card {
  &__title {
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0.01em;
  }
  &__info {
    margin-top: 24px;
    display: flex;
    align-items: center;
    gap: 25px;
    & > * {
      flex-shrink: 0;
    }
  }
  &__difficulty {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 17px;
    border-radius: 5px;
    min-width: 110px;
  }
  &__level-bars {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    & > svg > * {
      fill: currentColor;
    }
  }
  &__text {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.01em;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #171729;
  }
  &__level-text,
  &__exp-text {
    font-weight: 600;
  }
  &__btn {
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.01em;
    font-weight: 600;
    min-width: 160px;
    min-height: 40px;
    border-radius: 7px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: background-color 0.3s ease;
  }
  &__btn--solved {
    color: #0bc3b8;
    border: 2px solid #0bc3b8;
    &:hover {
      background-color: #d8f5f3;
    }
  }
  &__btn--not-solved {
    color: #ffffff;
    background-color: #0bc3b8;
    border: 2px solid #0bc3b8;
  }
}
</style>
