<template>
  <v-tab-item label="Активные">
    <div v-if="activeCourses && activeCourses.length !== 0">
      <h1 class="active-courses__title">Активные</h1>
      <ActiveCourseCard
        class="active-courses-card"
        v-for="course in activeCourses"
        :key="course.id"
        :course="course"
      />
    </div>
    <div v-else>
      <no-courses-card />
    </div>
  </v-tab-item>
</template>

<script>
import ActiveCourseCard from './ActiveCourseCard.vue'
import NoCoursesCard from './NoCoursesCard.vue'
export default {
  components: {
    ActiveCourseCard,
    NoCoursesCard,
  },
  props: ['activeCourses'],
}
</script>

<style lang="scss" scoped>
.active-courses__title {
  font-size: 1.15rem;
  font-weight: 500;
  margin-bottom: 12px;
}

.active-courses-card + .active-courses-card {
  margin-top: 24px;
}
</style>
