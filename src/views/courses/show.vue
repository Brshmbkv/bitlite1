<template>
  <div class="px-4">
    <v-container class="pa-0">
      <template v-if="tabs_loading">
        <v-col cols="12">
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
        </v-col>
      </template>
      <v-tabs
        v-else-if="tabs && tabs.length > 0"
        class="course-show__tabs"
        v-model="currentTab"
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.id"
          @click="handleTabClick(tab)"
          class="text-capitalize"
          >{{ tab.title }}</v-tab
        >
      </v-tabs>
    </v-container>
    <v-container class="mt-6 pa-0">
      <CourseLockedAlert
        v-if="
          !isLite && !logicTestPassed && !loading && module && module.available
        "
      />
      <empty-placeholder v-if="course_fetch_error" :text="error_text" />
      <template v-else-if="loading">
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="heading" />
            <v-skeleton-loader
              type="table-tbody"
              :types="{
                'table-tbody': 'table-row-divider@10',
              }"
            />
          </v-col>
          <v-col md="6" cols="12">
            <v-skeleton-loader type="article" />
          </v-col>
          <v-col md="6" cols="12">
            <v-skeleton-loader type="article" />
          </v-col>
          <v-col class="mt-4">
            <v-skeleton-loader type="heading" />
            <v-skeleton-loader
              type="table-tbody"
              :types="{
                'table-tbody': 'table-row-divider@3',
              }"
            />
          </v-col>
        </v-row>
      </template>

      <OnBoardingDialog
        v-if="show_modal"
        :name="name"
        :course-title="course_title"
        :course-id="Number(course_id)"
        :dialog.sync="show_modal"
      />
      <!-- DEFAULT MODULE -->
      <CourseTable
        v-else-if="
          module &&
            module.type === 'default' &&
            module.available &&
            events &&
            events.length
        "
        :module_id="module_id"
        :module_title="(module && module.title) || 'Какой-то модуль'"
        :next_event_id="next_event && next_event.id"
        :events="events"
        :trial="module && module.trial"
        :disabled="!logicTestPassed && !isLite"
      />
      <!-- LITE MODULE -->
      <ChaptersTable
        v-else-if="
          !loading && module && (module.trial || isLite) && module.available
        "
        :available="module_available"
        :module_id="module_id"
        :chapters="chapters"
        :start_date="starts_at"
        :module_title="(module && module.title) || 'Какой-то модуль'"
        @open-dialog="showDialog = true"
        @to-full-course="nextModule"
      />
      <!-- GAME MODULE -->
      <GamesTable
        v-else-if="module && module.type === 'game' && module.available"
        :available="module_available"
        :module_id="module_id"
        :chapters="chapters"
      />
      <!-- DEFAULT MODULE w/o EVENTS || MODULE IS UNAVAILABLE -->
      <UnavailableChaptersTable
        v-else-if="!loading && module && !module.available && hasDef"
        :module_id="module_id"
        :chapters="chapters"
        :is_lite="isLite"
        :starts_soon="module_starts_soon"
        @open-dialog="showDialog = true"
      />

      <CoursePurchase
        v-if="!loading && module && !module.available && !hasDef"
        :module_id="module_id"
      />

      <template v-if="!loading">
        <div>
          <v-row class="ma-0 ">
            <v-col cols="6">
              <course-stats
                v-if="!(module_id === -1) && module_available"
                :total_events="total_events || total_chapters"
                :passed_events="passed_events"
                :end_date="end_date"
                :points="Number(score)"
                :level="level"
                :prerequesit="prerequesit"
                :disabled="!logicTestPassed && !isLite"
              />
            </v-col>
            <v-col cols="6">
              <CourseStudentsRating
                v-if="students && students.length && module_available"
                :module_id="Number(module_id)"
                :students="students"
                :current-student="current_student"
                :disabled="!logicTestPassed && !isLite"
                @intersects="(value) => (this.isIntersects = value)"
              />
            </v-col>
          </v-row>
        </div>
      </template>
      <v-row v-if="module_fetch_error">
        <v-col>
          <p class="text-center">
            {{ 'Ошибка при загрузке информации о модуле' }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CourseStats from '@/components/Courses/show/CourseStats'
import CourseTable from '@/components/Courses/show/CourseTable'
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import CourseStudentsRating from '@/components/Courses/show/CourseStudentsRating'
import { mdiGoogleAnalytics } from '@mdi/js'

export default {
  name: 'CoursesShow',
  components: {
    CourseLockedAlert: () =>
      import('@/components/Courses/show/CourseLockedAlert'),
    CoursePurchase: () =>
      import(
        /* webpackPrefetch: true */ '@/components/Courses/show/CoursePurchase'
      ),
    CourseStats,
    CourseStudentsRating,
    CourseTable,
    ChaptersTable: () =>
      import(
        /* webpackPrefetch: true */ '@/components/Courses/show/ChaptersTable'
      ),
    GamesTable: () =>
      import(
        /* webpackPrefetch: true */ '@/components/Courses/show/GamesTable'
      ),
    UnavailableChaptersTable: () =>
      import(
        /* webpackPrefetch: true */ '@/components/Courses/show/UnavailableChaptersTable'
      ),
    EmptyPlaceholder,
    OnBoardingDialog: () =>
      import('@/components/Courses/show/OnBoardingDialog'),
  },
  props: [
    'course_id',
    'active_module_id', // if navigated from ChapterShow
  ],
  data() {
    return {
      currentTab: '',
      mdiGoogleAnalytics,
      showDialog: false,
      isIntersects: false,
      course_title: undefined,
      course_fetch_error: false,
      end_date: undefined,
      error_text: 'Ошибка',
      error: false,
      events: undefined,
      level: undefined,
      loading: true,
      module: undefined,
      module_id: undefined,
      module_name: undefined,
      module_available: undefined,
      module_starts_soon: undefined,
      module_status: undefined,
      module_fetch_error: false,
      next_event: undefined,
      prerequesit: undefined,
      passed_events: undefined,
      score: undefined,
      total_events: undefined,
      total_chapters: undefined,
      chapters: undefined,
      tabs_loading: true,
      starts_at: undefined,
      tabs: [],
      students: undefined,
      current_student: undefined,
      show_modal: undefined,
      hasDef: undefined,
      group_starts_at: undefined,
    }
  },
  computed: {
    logicTestPassed() {
      return !isNaN(parseInt(this.logic_test_score))
    },

    isLite() {
      return this.module?.type === 'lite'
    },

    ...mapState('vacancies', {
      vacancyList: 'list',
    }),

    ...mapState('user', ['name', 'questioned', 'logic_test_score', 'is_test']),
  },
  watch: {
    module_id(newValue, oldValue) {
      if (newValue >= 0 && newValue !== oldValue) {
        this.fetchModuleData()
      }
    },
  },
  mounted() {
    this.$store.dispatch('breadcrumbs/setLinks', [
      {
        text: 'Все курсы',
        underlined: true,
        to: { name: 'CoursesIndex' },
      },
    ])

    this.fetchCourseData()
      .then(() => {
        this.fetchStudents()
        this.$store.dispatch('breadcrumbs/addLink', {
          text: this.course_title || 'Содержание модуля',
          disabled: true,
        })
        this.tabs_loading = false
      })
      .finally(() => {
        this.tabs_loading = false
        if (this.module_id === -1) {
          this.loading = false
        }
      })

    this.$store.dispatch('vacancies/getCourseVacancies', this.course_id)
  },

  methods: {
    handleTabClick(tab) {
      if (!this.loading) {
        this.module_id = tab.id
        this.module = this.tabs.find((t) => t.id === tab.id)
        this.fetchStudents()
      }
    },

    nextModule() {
      if (!this.loading) {
        let tab = this.tabs.find((module) => module.type !== 'lite')
        this.module_id = tab.id
        this.module = this.tabs.find((t) => t.id === tab.id)
      }
    },

    async fetchStudents() {
      await this.$axios
        .get(`scoreboard/list/v2/${this.module_id}`, {
          params: {
            paginate: 5,
            order: 'desc',
          },
        })
        .then((res) => {
          if (res && res.data) {
            this.students = res.data.data
            this.current_student = res?.data?.me
          }
        })
    },

    async fetchCourseData() {
      await this.$axios
        .get('/courses/' + this.course_id + '/modules/')
        .then((res) => {
          if (res && res.data) {
            if (res.data.modules && res.data.modules.length > 0) {
              this.tabs = res.data.modules
              // determine current active module
              this.module_id =
                (this.active_module_id &&
                  res.data.modules.find(
                    (tab) => tab.id === this.active_module_id
                  )?.id) ||
                [...res.data.modules].reverse().find((tab) => tab.active)?.[
                  'id'
                ] ||
                // ^^^ find first 'active' course ^^^
                res.data.modules.find((tab) => tab.available)?.['id'] ||
                // ^^^ else find first available course ^^^
                res.data.modules[0]['id'] ||
                -1
              this.module = this.tabs.find((tab) => tab.id === this.module_id)
              this.hasDef = this.tabs.find(
                (tab) => tab.available === true && tab.type === 'default'
              )
              this.tabs.forEach((el, i) => {
                if (el.id === this.module_id) this.currentTab = i
              })
            } else {
              this.modules = []
            }
            this.course_title = res.data.title
          }
        })
        .catch((err) => {
          if (err.response && err.response.status) {
            this.course_fetch_error = true
            if (err.response.status === 404) {
              this.error_text = 'Курс не найден'
            } else if (err.response.status === 403) {
              this.error_text = 'Курс не доступен'
            } else {
              this.error_text = 'Ошибка: ' + err.response.status
            }
          }
          this.module_id = -1
          this.loading = false

          console.error('CourseData fetch error:', err.response)
        })
    },

    async fetchModuleData() {
      // api/v1/course-modules/{course_module}
      // or
      // /api/get-chapters/:course_module_id
      // /api/get-chapter/:chapter_id
      this.loading = true
      this.clearChaptersAndModules()

      let currentModule = this.tabs.find((mod) => mod.id === this.module_id)
      let is_lite = currentModule.type === 'lite'
      let module_available = currentModule.available
      let request_url =
        currentModule.available === false
          ? `get-chapters/${this.module_id}` // locked course
          : is_lite
          ? `/lite/module/${this.module_id}/chapters` // light course
          : `my-events/${this.module_id}` // simple course

      // console.log('momo', currentModule, request_url)
      await this.$axios
        .get(request_url)
        .then((res) => {
          if (res && res.data) {
            // console.log(request_url + ": ", res.data);
            let {
              chapters,
              completed_chapters,
              events,
              ends_at,
              level,
              module_title,
              next_event,
              passed_events,
              prerequesit,
              score,
              starts_at,
              total_chapters,
              total_events,
              group_starts_at,
            } = res.data
            // if (event && events.length === 0){
            //   this.module_status = "Модуль скоро начнется"
            //   // throw 'Error'
            // }
            this.module_name = module_title
            this.score = score || currentModule.score
            this.events = events
            this.passed_events = passed_events || completed_chapters
            this.total_events = total_events || total_chapters
            this.end_date = ends_at
            this.next_event = next_event
            this.level = level
            this.prerequesit = prerequesit
            this.chapters = chapters
            this.module_available = module_available
            this.module_starts_soon =
              events && events.length === 0 && module_available
            this.starts_at = starts_at
            this.group_starts_at = group_starts_at
            this.show_modal = !this.is_test ? !this.questioned : false
            // typeof (show_modal) === 'boolean' && !show_modal ? localStorage.removeItem('show-course-info') : undefined
          }
        })
        .catch((err) => {
          console.error('Error response:', err)
          this.module_fetch_error = true
          this.module_name = undefined
          this.score = undefined
          this.events = undefined
          this.passed_events = undefined
          this.total_events = undefined
          this.end_date = undefined
          this.next_event = undefined
          this.level = undefined
          this.prerequesit = undefined
          this.total_chapters = undefined
          this.chapters = undefined
          this.module_starts_soon = undefined
        })
        .finally(() => {
          this.loading = false
        })
    },

    clearChaptersAndModules() {
      // clear modules
      this.module_fetch_error = false
      this.module_name = undefined
      this.score = undefined
      this.events = undefined
      this.passed_events = undefined
      this.total_events = undefined
      this.end_date = undefined
      this.next_event = undefined
      this.level = undefined
      this.prerequesit = undefined
      // clear chapters
      this.chapters = undefined
      this.total_chapters = undefined
      this.module_starts_soon = undefined
    },
  },
}
</script>

<style lang="scss">
.show-students-rating--btn {
  padding-left: 8px;
  padding-top: 6px;
  position: fixed;
  bottom: 40px;
  right: 10px;
  border-radius: 50% 50% 50% 0;
  z-index: 5;
  cursor: pointer;
  animation: mover 1.5s infinite alternate;
}

@keyframes mover {
  0% {
    transform: translateY(0) rotate(-45deg);
    box-shadow: rgba(149, 157, 165, 0.2) -25px 25px 20px;
  }
  100% {
    transform: translateY(-10px) rotate(-45deg);
    box-shadow: rgb(38, 57, 77) -25px 25px 30px -10px;
  }
}

.full-course__red-circle {
  width: 10px;
  height: 10px;
  background-color: #ee5252;
  border-radius: 50%;
  animation: course-show__circle-pulse 1s infinite alternate linear;

  @keyframes course-show__circle-pulse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0.7;
      transform: scale(1.5);
    }
  }
}
</style>
