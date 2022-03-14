<template>
  <v-container>
    <div class="d-flex justify-space-between align-content-center">
      <v-tabs
        v-model="currentTab"
        style="box-shadow: rgba(23, 23, 41, 0.08) 0px 1px 0px;"
        background-color="white"
        class="mb-8"
      >
        <v-tabs-slider></v-tabs-slider>
        <v-tab
          class="text-capitalize"
          :ripple="false"
          href="#lecture"
          @click="handleTabClick('lecture')"
        >
          Контент
          <v-progress-linear
            v-if="lecture_loading"
            style="position: absolute; bottom: 0;"
            indeterminate
            color="#0bc4b8"
          ></v-progress-linear>
        </v-tab>
        <v-tab
          class="text-capitalize"
          :ripple="false"
          href="#attendance"
          @click="handleTabClick('attendance')"
          >Посещаемость
          <v-progress-linear
            v-if="attendance_loading"
            style="position: absolute; bottom: 0;"
            indeterminate
            color="#0bc4b8"
          ></v-progress-linear>
        </v-tab>
        <v-tab
          class="text-capitalize"
          :ripple="false"
          href="#test"
          @click="handleTabClick('test')"
          >Тест
        </v-tab>
      </v-tabs>
      <v-btn
        class="text-capitalize"
        elevation="0"
        :ripple="false"
        color="#F16635"
        @click="closeEvent"
        style="color: white"
      >
        Завершить лекцию
      </v-btn>
    </div>
    <v-tabs-items v-model="currentTab" touchless>
      <v-tab-item value="lecture">
        <v-skeleton-loader v-if="lecture_loading" type="article" />
        <div v-else-if="lectures && lectures.length > 0">
          <div v-for="(lecture, idx) in lectures" :key="'l-' + idx">
            <h2 class="mb-5">{{ lecture.title }}</h2>
            <div v-html="decodeHTML(lecture.content)" class="mb-4"></div>
          </div>
        </div>
        <div v-else>
          Нет лекции
        </div>
      </v-tab-item>
      <v-tab-item value="attendance">
        <v-skeleton-loader v-if="attendance_loading" type="table-tbody" />
        <AttendanceTable v-else :attendance="attendance" />
      </v-tab-item>
      <v-tab-item value="test">
        <student-tests-table
          v-if="tests && tests.length > 0"
          :tests="tests"
        ></student-tests-table>
        <empty-placeholder v-else :text="'Пусто'"></empty-placeholder>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>
<script>
import AttendanceTable from '@/components/Teacher/Event/AttendanceTable'
import StudentTestsTable from '@/components/Teacher/Event/StudentTestsTable'
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import { decodeHTML } from '@/helpers'

export default {
  name: 'StreamLectureShow',
  components: {
    StudentTestsTable,
    AttendanceTable,
    EmptyPlaceholder,
  },
  props: ['event_id'],
  data() {
    return {
      attendance: undefined,
      attendance_loading: false,
      currentTab: undefined,
      lectures: undefined,
      tests: undefined,
      lecture_loading: false,
      stream_id: '',
      lecture_title: '',
      lecture_starts_at: undefined,
      lecture_ends_at: undefined,
    }
  },
  computed: {
    isClosed() {
      if (this.lecture_ends_at) {
        let endDate = new Date(
          this.lecture_ends_at && this.lecture_ends_at.replace(/-/g, '/')
        )
        // console.log('endDate', endDate)
        let currentDate = new Date()
        // console.log('currentDate', currentDate)
        return currentDate > endDate
      } else {
        return false
      }
    },
  },
  watch: {
    currentTab(newValue, oldValue) {
      // console.log(oldValue, ' => ', newValue)
      if (oldValue === undefined) {
        this.fetchEventLecture()
      } else {
        if (newValue === 'lecture' && !this.lecture) {
          this.fetchEventLecture()
        } else if (newValue === 'attendance' && !this.attendance) {
          this.fetchEventAttendance()
        }
      }
    },
  },
  mounted() {
    this.fetchEventLecture().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Лекции потока',
          to: {
            name: 'StreamLecturesIndex',
            params: {
              stream_id: this.stream_id,
            },
          },
          back: true,
        },
        {
          text: this.lecture_title,
          disabled: true,
          // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
        },
      ])
    })
  },
  methods: {
    decodeHTML,
    async closeEvent() {
      await this.$axios
        .post('teacher/finish/event', {
          id: this.event_id,
          starts_at: this.lecture_starts_at,
        })
        .then((res) => {
          if (res && res.data) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Лекция завершена!',
              color: 'success',
            })
            this.lecture_ends_at = new Date()
          }
        })
    },

    async fetchEventLecture() {
      if (this.lecture_loading) return
      this.lecture_loading = true
      this.lectures = undefined
      await this.$axios
        .get('teacher/lectures/' + this.event_id)
        .then((res) => {
          if (res && res.data) {
            this.lectures =
              (res.data.lecture && res.data.lecture.lecture) || undefined
            this.tests =
              (res.data.tests &&
                res.data.tests.sort(function(a, b) {
                  if (a.order > b.order) {
                    return 1
                  }
                  if (a.order < b.order) {
                    return -1
                  }
                  return 0
                })) ||
              undefined
            this.stream_id =
              (res.data.stream && res.data.stream.id) || undefined
            this.lecture_title =
              (res.data.event && res.data.event.title) || undefined
            this.lecture_starts_at =
              (res.data.event && res.data.event.starts_at) || undefined
            this.lecture_ends_at =
              (res.data.event && res.data.event.ends_at) || undefined
          }
        })
        .finally(() => {
          this.lecture_loading = false
        })
    },

    async fetchEventAttendance() {
      if (this.attendance_loading) return
      this.attendance_loading = true
      this.attendance = undefined
      await this.$axios
        .get('teacher/attendances/' + this.event_id)
        .then((res) => {
          if (res && res.data) {
            this.attendance = res.data
          }
        })
        .finally(() => {
          this.attendance_loading = false
        })
    },

    handleTabClick(tab) {
      if (this.currentTab === tab) {
        if (tab === 'lecture') {
          this.fetchEventLecture()
        } else if (tab === 'attendance') {
          this.fetchEventAttendance()
        }
      }
    },
  },
}
</script>

<style></style>
