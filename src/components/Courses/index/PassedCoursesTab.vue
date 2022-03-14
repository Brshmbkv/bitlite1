<template>
  <v-tab-item label="Завершенные">
    <div v-if="passedCourses && passedCourses.length !== 0">
      <h1 class="passed-courses__title">Завершенные</h1>
      <div class="passed-courses__passed-courses-grid">
        <PassedCoursesCard v-for="course in passedCourses" :key="course.id" :course="course" />
      </div>
    </div>
    <div v-else>
      <no-courses-card/>
    </div>
  </v-tab-item>
</template>

<script>
import PassedCoursesCard from './PassedCoursesCard.vue'
import NoCoursesCard from './NoCoursesCard.vue'
export default {
  components: {
    PassedCoursesCard,
    NoCoursesCard,
  },
  props: ['passedCourses']
}
</script>

<style lang="scss" scoped>
.passed-courses__title {
  font-size: 1.15rem;
  font-weight: 500;
  margin-bottom: 12px;
}
.passed-courses__passed-courses-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
</style>
