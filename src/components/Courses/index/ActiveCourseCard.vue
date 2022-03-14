<template>
  <div class="course-card">
    <div class="course-card__header">
      <h1 class="course-card__title">{{ course.title }}</h1>
      <span class="course-card__in-progress">В процессе</span>
    </div>
    <div class="course-card__progress">
      <v-progress-linear
        :value="+course.score"
        color="#00665e"
        height="10"
        rounded
      />
      <span class="course-card__score">{{ course.score }}%</span>
    </div>
    <div class="course-card__info">
      <span class="course-card__info-active-title">{{
        activeModule.title
      }}</span>
      <span class="course-card__info-separator">●</span>
      <span class="course-card__info-total"
        >{{ course.passed_lessons }} из {{ course.total_lessons }} уроков</span
      >
    </div>
    <div class="course-card__footer">
      <span
        class="course-card__footer-days"
        v-if="course.next_event && course.next_event.starts_at"
      >
        <span>Следующий урок: </span>
        <span class="course-card__footer-days-info">{{
          course.next_event.starts_at | daysUntil(now)
        }}</span>
      </span>
      <span class="course-card__footer-days-info" v-if="course.isLive"
        >Сейчас идет урок</span
      >
      <router-link
        :to="{ name: 'CourseShow', params: { course_id: course.id } }"
        style="margin-left: auto"
      >
        <button class="course-card__footer-btn">Перейти к курсу</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import dateFiltersMixin from '@/mixins/date-filters'

export default {
  mixins: [dateFiltersMixin],
  props: ['course'],
  computed: {
    activeModule() {
      return this.course.modules.find((mod) => mod.active && !mod.complete)
    },
    now() {
      return new Date(Date.now())
    },
  },
}
</script>

<style lang="scss" scoped>
.course-card {
  padding: 24px;
  border: 1px solid #b0b7d08f;
  border-radius: 16px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
  }
  &__in-progress {
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    color: #ffffff;
    padding: 4px 8px;
    background-color: #4376fb;
    border-radius: 4px;
  }
  &__progress {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  &__progress-bar {
    margin-bottom: 0 !important;
    width: 100%;
  }
  &__score {
    font-size: 14px;
    line-height: 17px;
    font-weight: 500;
    letter-spacing: 0.01em;
  }
  &__info {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.02em;
    margin-top: 12px;
    &-separator,
    &-active-title {
      color: #828bab;
    }
    &-total {
      color: #00665e;
    }
  }
  &__footer {
    display: flex;
    align-items: center;
    margin-top: 24px;
    gap: 24px;
    &-days {
      font-size: 16px;
      line-height: 20px;
      color: #828bab;
    }
    &-days-info {
      font-weight: 500;
      color: #000221a3;
    }
    &-btn {
      margin-left: auto;
      border: none;
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 8px;
      background-color: #4376fb;
      white-space: nowrap;
      cursor: pointer;
    }
  }
}
</style>
