<template>
  <v-container>
    <template v-if="loading">
      <div style="margin-top: 36px;">
        <v-skeleton-loader type="heading"></v-skeleton-loader>
        <hr class="my-exercises__line" />
        <v-skeleton-loader type="heading"></v-skeleton-loader>
        <v-skeleton-loader type="card" class="mt-6"></v-skeleton-loader>
        <v-row class="mt-2">
          <v-col>
            <v-skeleton-loader
              type="card"
              style="margin-top: 30px"
            ></v-skeleton-loader>
          </v-col>
          <v-col>
            <v-skeleton-loader
              type="card"
              style="margin-top: 30px"
            ></v-skeleton-loader>
          </v-col>
          <v-col>
            <v-skeleton-loader
              type="card"
              style="margin-top: 30px"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
        <hr class="my-exercises__line" />
        <v-skeleton-loader type="card" class="mt-6"></v-skeleton-loader>
        <v-row class="mt-2">
          <v-col>
            <v-skeleton-loader
              type="card"
              style="margin-top: 30px"
            ></v-skeleton-loader>
          </v-col>
          <v-col>
            <v-skeleton-loader
              type="card"
              style="margin-top: 30px"
            ></v-skeleton-loader>
          </v-col>
          <v-col>
            <v-skeleton-loader
              type="card"
              style="margin-top: 30px"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </div>
    </template>
    <template v-else>
      <h1 class="my-exercises__heading">Текущие</h1>
      <hr class="my-exercises__line" />
      <template v-if="courses.active">
        <div
          class="my-exercise-course__block"
          v-for="course in courses.active"
          :key="course.id"
        >
          <h2 class="my-exercises__title">Курс: {{ course.title }}</h2>
          <CurrentExercise :event="course.current_event" />
          <ExerciseCardSlider class="my-exercises__slider">
            <ExerciseCard
              v-for="event in course.events"
              :key="event.id"
              :event="event"
            />
          </ExerciseCardSlider>
        </div>
      </template>
      <template v-else>
        <div class="my-exercise__course-not-found">
          <FolderInspiration />
          <h1 class="my-exercise__title-not-found">Похоже, у вас нет задач</h1>
          <p class="my-exercise__text-not-found">
            Добавьте подходящий для Вас курс, чтобы приступить к решению заданий
          </p>
          <button
            class="my-exercise__btn-not-found"
            @click="
              $router.push({
                name: 'CoursesCatalogIndex',
              })
            "
          >
            <v-icon size="24" color="#ffffff">{{ mdiPlus }}</v-icon>
            <span class="my-exercise__btn-text-not-found">Добавить курс</span>
          </button>
        </div>
      </template>
      <template v-if="courses.passed">
        <h1 class="my-exercises__heading">Завершеные</h1>
        <hr class="my-exercises__line" />
        <PassedExercises :passed-courses="courses.passed" />
      </template>
    </template>
  </v-container>
</template>

<script>
import CurrentExercise from '@/components/Exercises/CurrentExercise.vue'
import PassedExercises from '@/components/Exercises/PassedExercises.vue'
import ExerciseCard from '@/components/Exercises/ExerciseCard.vue'
import ExerciseCardSlider from '@/components/Exercises/ExerciseCardSlider.vue'

import FolderInspiration from '@/assets/svg/folderInspiration.svg'
import { mdiPlus } from '@mdi/js'

export default {
  components: {
    CurrentExercise,
    ExerciseCard,
    ExerciseCardSlider,
    PassedExercises,
    FolderInspiration,
  },
  data() {
    return {
      mdiPlus,
      loading: false,
      courses: [],
    }
  },
  mounted() {
    this.$store.dispatch('breadcrumbs/setLinks', [
      {
        text: 'Мои задания',
      },
    ])
    this.fetchExercises()
  },
  methods: {
    async fetchExercises() {
      try {
        this.loading = true
        const { data } = await this.$axios.get('my-exercises/courses')
        this.courses = data
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
.my-exercises {
  &__heading {
    font-size: 22px;
    font-weight: 700;
    line-height: 24px;
    margin-top: 32px;
  }
  &__line {
    display: block;
    border: none;
    border-top: 1px solid #dbdfea;
    margin: 24px 0;
  }
  &__title {
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
  }
  &__slider {
    margin-top: 24px;
  }
}
.my-exercise-course__block + .my-exercise-course__block {
  margin-top: 40px;
}
.my-exercise__course-not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 10px;
  padding: 56px 0;
  row-gap: 22px;
  & > * {
    flex-shrink: 0;
    max-width: 312px;
  }
}
.my-exercise__title-not-found {
  margin-top: 2px;
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #383d57;
}
.my-exercise__text-not-found {
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.01em;
  margin-bottom: 0 !important;
}
.my-exercise__btn-not-found {
  padding: 8px 12px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #0bc3b8;
}
.my-exercise__btn-text-not-found {
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  color: #ffffff;
}
</style>
