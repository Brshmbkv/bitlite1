<template>
  <v-container>
    <p style="font-size: 22px; font-weight: 700" class="mt-4 mb-6">
      Тесты по курсам
    </p>
    <v-row v-if="loading">
      <v-col v-for="i in 6" :key="i" cols="12" md="6">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>
    <div v-else-if="courses && courses.length === 0">
      <CoursesEmptyPlaceholder :text="'Нету тестов'" />
    </div>
    <div v-else class="d-flex flex-wrap" style="gap: 40px">
      <training-test-course-card
        v-for="course in courses"
        :key="course.id"
        :course_id="Number(course.id)"
        :level="course.level"
        :title="course.title"
        :passed_tests="course.passed_tests"
        :total_tests="course.total_tests"
      />
    </div>
  </v-container>
</template>

<script>
import TrainingTestCourseCard from '@/components/Training/Test/TrainingTestCourseCard'
import CoursesEmptyPlaceholder from '@/components/EmptyPlaceholder'

export default {
  name: 'TrainingCoursesIndex',
  components: { CoursesEmptyPlaceholder, TrainingTestCourseCard },
  data() {
    return {
      courses: undefined,
      loading: false,
    }
  },
  mounted() {
    this.fetchCourses().finally(() => {
      this.loading = false
    })
  },
  methods: {
    async fetchCourses() {
      this.loading = true
      await this.$axios.get('training/courses').then((res) => {
        if (res && res.data) {
          // console.log('training/courses', res.data)
          this.courses = res.data
        }
      })
    },
  },
}
</script>
