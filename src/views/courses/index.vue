<template>
  <v-container>
    <template v-if="loading">
      <template v-for="n in 2">
        <v-row :key="'h' + n">
          <v-col cols="12">
            <v-skeleton-loader type="heading" />
          </v-col>
        </v-row>
        <v-row :key="'i' + n">
          <v-col cols="12" :lg="6" :md="9">
            <v-skeleton-loader type="image" elevation="2" />
          </v-col>
          <v-col cols="12" :lg="3" :md="3">
            <v-skeleton-loader type="image" elevation="2" />
          </v-col>
        </v-row>
      </template>
    </template>
    <template v-else>
      <v-tabs
        v-model="currentTab"
        style="box-shadow: rgba(23, 23, 41, 0.08) 0px 1px 0px"
        background-color="white"
        class="mb-8"
      >
        <v-tabs-slider />
        <v-tab class="courses__tab text-capitalize">
          Все
        </v-tab>
        <v-tab class="courses__tab text-capitalize">
          Активные
        </v-tab>
        <v-tab class="courses__tab text-capitalize">
          Предстоящие
        </v-tab>
        <v-tab class="courses__tab text-capitalize">
          Завершенные
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="currentTab" class="pt-4" style="z-index: 0">
        <AllCoursesTab
          :courses="{
            active: activeCourses,
            passed: finishedCourses,
            incoming: incomingCourses,
          }"
        />
        <ActiveCoursesTab :active-courses="activeCourses" />
        <IncomingCoursesTab :incoming-courses="incomingCourses" />
        <PassedCoursesTab :passed-courses="finishedCourses" />
        <v-tab-item>
          adasd4
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-container>
</template>

<script>
import AllCoursesTab from '@/components/Courses/index/AllCoursesTab.vue'
import ActiveCoursesTab from '@/components/Courses/index/ActiveCoursesTab.vue'
import IncomingCoursesTab from '@/components/Courses/index/IncomingCoursesTab.vue'
import PassedCoursesTab from '@/components/Courses/index/PassedCoursesTab.vue'

export default {
  name: 'CoursesIndexView',
  components: {
    AllCoursesTab,
    ActiveCoursesTab,
    IncomingCoursesTab,
    PassedCoursesTab,
  },
  data() {
    return {
      currentTab: 0,
      loading: false,
      activeCourses: [],
      incomingCourses: [],
      finishedCourses: [],
      courses: [
        {
          title: 'Активные',
          component: 'ActiveCourseCard',
          cards: [],
        },
        {
          title: 'Предстоящие',
          component: 'ComingCourseCard',
          cards: [],
        },
        {
          title: 'Завершенные',
          component: 'FinishedCourseCard',
          cards: [],
        },
      ],
    }
  },
  mounted() {
    this.fetchCourses().finally(() => {
      this.loading = false
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Все курсы',
          disabled: true,
        },
      ])
    })
  },
  methods: {
    async fetchCourses() {
      try {
        this.loading = true
        const { data } = await this.$axios.get('my-courses')
        this.activeCourses = data.filter((course) => course.status === 'active')
        this.finishedCourses = data.filter(
          (course) => course.status === 'passed'
        )
        this.incomingCourses = data.filter(
          (course) => course.status === 'incoming'
        )
      } catch (e) {
        console.log(e)
      }
    },
    toCourseShowPage(course_id) {
      this.$router.push({
        name: 'CourseShow',
        params: {
          course_id,
        },
      })
    },
    // hasSomeCourse() {
    //   let value = this.courses.map(course => course.cards.length)
    //   return value.reduce((acc, val) => acc + val) > 0
    // }
  },
}
</script>

<style lang="scss">
.course-type__text {
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #5e6a82;
}
.courses__tab:not(.v-tab--active) {
  color: #171729 !important;
  font-weight: 500 !important;
}

.courses__tab {
  &::before {
    background-color: transparent;
  }
}
</style>
