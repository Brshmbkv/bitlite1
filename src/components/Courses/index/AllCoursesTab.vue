<template>
  <v-tab-item label="Все курсы">
    <div v-if="courses.active && courses.active.length !== 0">
      <h1 class="all-courses__title">Активные</h1>
      <div class="all-courses__active-courses-grid">
        <ActiveCourseCard
          v-for="course in courses.active"
          :key="course.id"
          :course="course"
        />
      </div>
    </div>
    <!-- <hr v-if="courses.passed && courses.passed.length !== 0" /> -->
    <v-divider style="margin: 24px 0;"></v-divider>
    <div v-if="courses.passed && courses.passed.length !== 0">
      <h1 class="all-courses__title">Завершенные</h1>
      <div class="all-courses__passed-courses-grid">
        <PassedCoursesCard
          v-for="course in courses.passed"
          :key="course.id"
          :course="course"
        />
      </div>
    </div>
  </v-tab-item>
</template>

<script>
import ActiveCourseCard from '@/components/Courses/index/ActiveCourseCard.vue'
import PassedCoursesCard from '@/components/Courses/index/PassedCoursesCard.vue'
export default {
  components: {
    ActiveCourseCard,
    PassedCoursesCard,
  },
  props: ['courses'],
}
</script>

<style lang="scss" scoped>
.all-courses {
  &__title {
    font-size: 1.15rem;
    font-weight: 500;
    margin-bottom: 12px;
  }
  &__active-courses-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  &__passed-courses-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
}
</style>
