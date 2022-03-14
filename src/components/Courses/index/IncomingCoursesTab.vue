<template>
  <v-tab-item label="Предстоящие">
    <div v-if="incomingCourses && incomingCourses.length !== 0">
      <h1 class="incoming-courses__title">Предстоящие</h1>
      <div class="incoming-courses__passed-courses-grid">
        <PassedCoursesCard
          v-for="course in incomingCourses"
          :key="course.id"
          :course="course"
        />
      </div>
    </div>
    <div v-else>
      <NoCoursesCard />
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
  props: ['incomingCourses'],
}
</script>

<style lang="scss" scoped>
.incoming-courses__title {
  font-size: 1.15rem;
  font-weight: 500;
  margin-bottom: 12px;
}
.incoming-courses__passed-courses-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
</style>
