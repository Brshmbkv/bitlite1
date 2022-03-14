<template>
  <v-container>
    <template v-if="loading">
      <v-skeleton-loader class="mt-4" type="heading" />
      <v-skeleton-loader
        class="mt-8"
        max-width="240"
        max-height="40"
        type="image"
      />
      <v-skeleton-loader class="mt-4" type="heading" />
      <v-row class="ma-0 mt-6">
        <v-skeleton-loader
          :class="{ 'ml-2': i !== 0 }"
          max-width="32"
          max-height="32"
          v-for="i in 12"
          :key="i"
          type="button"
        />
      </v-row>
      <v-skeleton-loader class="mt-12" type="card" />
      <v-skeleton-loader class="mt-6" type="image" />
    </template>
    <template v-else>
      <div class="exercise-lesson__header">
        <h1 class="exercise-lesson__title">{{ event.title }}</h1>
        <div class="exercise-lesson__telegram-block">
          <TelegramLogo />
          <span class="exercise-lesson__telegram-text">Чат в Телеграме</span>
        </div>
      </div>
      <div class="exercise-lesson__deadline">
        <v-icon size="20" color="#0BC3B8">{{ mdiClockOutline }}</v-icon>
        <span class="exercise-lesson__deadline-text">
          ДЕДЛАЙН: {{ event.deadline_at | deadlineFormat }}
        </span>
      </div>
      <LessonPractice
        class="exercise-lesson__lesson-practice"
        v-if="event[$route.query.type] && event[$route.query.type].length"
        :exercises="event[$route.query.type] || []"
        :fetching="loading"
        :event-id="Number(event_id)"
        :current_exercise="Number(exercise_id)"
      />
    </template>
  </v-container>
</template>

<script>
import LessonPractice from '@/components/Lesson/LessonPractice.vue'
import TelegramLogo from '@/assets/svg/telegram_logo.svg'
import { mdiClockOutline } from '@mdi/js'

export default {
  name: 'ExerciseShow',
  components: {
    LessonPractice,
    TelegramLogo,
  },
  props: ['event_id', 'exercise_id'],
  data() {
    return {
      mdiClockOutline,
      event: {},
      loading: false,
    }
  },
  computed: {
    getExerciseTypeText() {
      return {
        bonus: 'Бонусные задания',
        practice: 'Практические задания',
        homework: 'Домашнее задание',
      }[this.$route.query.type]
    },
  },
  mounted() {
    this.fetchExercises().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Мои задания',
          to: {
            name: 'ExercisesIndex',
          },
        },
        {
          text: this.getExerciseTypeText,
          to: {
            name: 'ExercisePracticesIndex',
            params: {
              prev_tab: this.$route.query.type,
            },
          },
        },
        {
          text: this.event.title || 'Ивент',
          disabled: true,
        },
      ])
    })
  },
  methods: {
    async fetchExercises() {
      try {
        this.loading = true
        const { data } = await this.$axios.get(
          `my-exercises/events/${this.event_id}`,
          {
            params: {
              type: this.$route.query.type,
            },
          }
        )
        this.event = data
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss">
.exercise-lesson {
  &__header {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    font-size: 30px;
    font-weight: 700;
    line-height: 40px;
    color: #171729;
  }
  &__telegram-block {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    visibility: hidden;
  }
  &__telegram-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: 0.02em;
  }
  &__deadline {
    margin-top: 40px;
    padding: 10px 15px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    border-radius: 5px;
    text-transform: uppercase;
    color: #0bc3b8;
    background-color: #0bc3b814;
    &-text {
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.06em;
    }
  }
  &__lesson-practice {
    margin-top: -32px;
  }
}
</style>
