<template>
  <v-container class="my-4">
    <CourseScoreInfo :value.sync="score_info_dialog" />
    <v-row align="center" justify="space-between" class="mb-2">
      <v-col cols="auto">
        <h1 class="rating__header">Рейтинг</h1>
      </v-col>
      <v-col cols="auto">
        <button
          class="students-raging__btn--points"
          @click="score_info_dialog = true"
        >
          <v-icon size="20" color="#4376FB">{{ mdiInformation }}</v-icon>
          <span>Как начисляются баллы</span>
        </button>
      </v-col>
    </v-row>
    <template v-if="loadingStudents || loadingCurrentStudent">
      <v-skeleton-loader type="heading" class="mb-7" />
      <v-skeleton-loader
        v-for="i in 10"
        :key="`loader-${i}`"
        type="image"
        height="80"
        class="mb-3"
      />
    </template>
    <template v-else>
      <v-tabs v-model="activeTabIndex">
        <v-tab class="text-capitalize" key="group">Рейтинг моей группы</v-tab>
        <v-tab class="text-capitalize" key="global">Глобальный рейтинг</v-tab>
      </v-tabs>
      <v-tabs-items v-model="activeTabIndex">
        <v-tab-item key="group" class="px-1 mt-4">
          <RatingRow
            v-for="(student, i) in students"
            :idx="perPage * (current_page - 1) + ++i"
            :user="student"
            :key="i"
          />
          <RatingRow
            class="current-user-card"
            v-if="me && Math.trunc(me.place / perPage) !== current_page - 1"
            :idx="me.place"
            :user="me"
          />
          <Pagination
            class="mt-4"
            v-model="current_page"
            :disabled="loadingStudents"
            justify="start"
            :length="totalPages"
          />
        </v-tab-item>
        <v-tab-item key="global" class="px-1 mt-4">
          <RatingRow
            v-for="(student, i) in students"
            :idx="perPage * (current_page - 1) + ++i"
            :user="student"
            :place="me.place"
            :key="i"
          />
          <RatingRow
            class="current-user-card"
            v-if="me && Math.trunc(me.place / perPage) !== current_page - 1"
            :idx="me.place"
            :user="me"
          />
          <Pagination
            class="mt-4"
            v-model="current_page"
            :disabled="loadingStudents"
            justify="start"
            :length="totalPages"
          />
        </v-tab-item>
      </v-tabs-items>
    </template>
  </v-container>
</template>

<script>
import CourseScoreInfo from '@/components/Courses/show/CourseScoreInfo'
import RatingRow from '@/components/Courses/rating/RatingRow.vue'
import Pagination from '@/components/Admin/Pagination.vue'
import { mdiInformation } from '@mdi/js'
export default {
  name: 'StudentsRatingIndex',
  components: { CourseScoreInfo, Pagination, RatingRow },
  props: ['module_id'],
  data() {
    return {
      mdiInformation,
      activeTabIndex: 0,
      me: {},
      students: [],
      current_page: 1,
      perPage: 10,
      totalPages: 1,
      loadingStudents: false,
      loadingCurrentStudent: false,
      user_id: undefined,
      current_student: {},
      current_student_intersects: false,
      last_page: undefined,
      score_info_dialog: false,
      tab_items: [
        { title: 'Рейтинг группы', key: 'group' },
        { title: 'Глобальный рейтинг', key: 'global' },
      ],
    }
  },
  watch: {
    currentTab() {
      this.current_page = 1
      this.fetchCurrentStudent()
      this.fetchStudents()
    },
    current_page() {
      this.fetchStudents()
      this.fetchCurrentStudent()
    },
  },
  computed: {
    currentTab() {
      return {
        0: 'group',
        1: 'global',
      }[this.activeTabIndex]
    },
  },
  mounted() {
    this.fetchStudents()
    this.fetchCurrentStudent()
  },
  methods: {
    async fetchStudents() {
      try {
        this.loadingStudents = true
        const { data } = await this.$axios.get(
          `scoreboard/list-${this.currentTab}`,
          {
            params: {
              page: this.current_page,
              order: 'desc',
              paginate: this.perPage,
            },
          }
        )
        this.students = data.data
        this.totalPages = data.meta.last_page
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingStudents = false
      }
    },

    async fetchCurrentStudent() {
      try {
        this.loadingCurrentStudent = true
        const { data } = await this.$axios.get(
          `scoreboard/me-${this.currentTab}`
        )
        this.me = data
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingCurrentStudent = false
      }
    },
  },
}
</script>

<style lang="scss">
.students-raging__btn--points {
  padding: 10px 14px;
  border: 2px solid #4376fb;
  border-radius: 8px;
  color: #4376fb;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  &:hover {
    background-color: #4376fb;
    color: #ffffff;
    .v-icon {
      color: #ffffff !important;
    }
  }
}
</style>
