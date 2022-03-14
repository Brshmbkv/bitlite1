<template>
  <v-container>
    <v-tabs v-model="tab" class="group-event-show__tabs">
      <v-tab>Лекция</v-tab>
      <v-tab>Посещаемость</v-tab>
      <v-tab>Практика</v-tab>
      <v-tab>Домашние работы</v-tab>
      <v-tab>Бонусы</v-tab>
      <HoverableButton
        small
        style="--color: #4376FB; padding: 12px 16px;"
        class="group-event-show__v-btn"
        text="Добавить Запись"
        @click="addVideoAndReviewModal = true"
      >
      </HoverableButton>
    </v-tabs>
    <v-divider class="mb-8" />

    <v-alert v-if="error_message" dense outlined type="error">
      {{ error_message }}
    </v-alert>
    <v-tabs-items v-else v-model="tab" touchless>
      <!--      LECTURE-->
      <v-tab-item>
        <v-skeleton-loader
          v-if="loading"
          type="text, paragraph, table-tbody"
          :types="{
            paragraph: 'text@5',
          }"
        />
        <template v-else-if="lectures && lectures.length > 0">
          <div v-for="lecture in lectures" :key="lecture.id">
            <h2 class="font-weight-bold mb-4">{{ lecture.title }}</h2>
            <div v-html="decodeHTML(lecture.content)" />
          </div>
        </template>
        <courses-empty-placeholder v-else :text="'пусто...'" />
      </v-tab-item>
      <!--      ATTENDANCE-->
      <v-tab-item>
        <v-skeleton-loader v-if="loading" type="table-thead, table-tbody" />
        <event-attendance-table
          v-else-if="attendances && attendances.length > 0"
          :attendance="attendances"
        />
        <courses-empty-placeholder v-else :text="'пусто...'" />
      </v-tab-item>
      <!--      PRACTICE | HOMEWORK | BONUS-->
      <v-tab-item v-for="i in 3" :key="`tab-item-${i}`">
        <event-practice-table
          :total_students="total_students"
          :current_page="current_page"
          :group_id="Number(group_id)"
          :page-y="Number(pageY) || 0"
          :exercises="exercises"
          :loading="exercises_loading"
        />
      </v-tab-item>

      <!--      <v-tab-item>-->
      <!--        <v-skeleton-loader-->
      <!--          v-if="reviews_loading"-->
      <!--          type="table-thead, table-tbody"-->
      <!--        />-->
      <!--        <div-->
      <!--          v-else-if="reviews && reviews.length"-->
      <!--        >-->
      <!--          <StudentReviews-->
      <!--            :reviews="reviews"-->
      <!--          />-->
      <!--        </div>-->
      <!--        <courses-empty-placeholder-->
      <!--          v-else-->
      <!--          :text="'пусто...'"-->
      <!--        />-->
      <!--      </v-tab-item>-->
    </v-tabs-items>
    <div
      v-if="![0, 1].includes(tab) && exercises && exercises.length > 0"
      class="add-user__dialog__pagination mt-3"
    >
      <v-pagination
        v-model="current_page"
        :length="total_pages"
        :total-visible="7"
      ></v-pagination>
    </div>
    <AddVideoAndReviewModal
      :value.sync="addVideoAndReviewModal"
      :event-id="Number(event_id)"
    />
  </v-container>
</template>

<script>
import EventPracticeTable from '@/components/Teacher/Event/PracticeTable'
import EventAttendanceTable from '@/components/Teacher/Event/AttendanceTable'
import CoursesEmptyPlaceholder from '@/components/EmptyPlaceholder'
import { decodeHTML } from '@/helpers'
import AddVideoAndReviewModal from '@/components/Teacher/Event/AddVideoAndReviewModal'
import HoverableButton from '@/components/HoverableButton.vue'
// import StudentReviews from "@/components/Teacher/Event/StudentReviews";

export default {
  name: 'GroupEventShow',
  components: {
    AddVideoAndReviewModal,
    // StudentReviews,
    CoursesEmptyPlaceholder,
    EventAttendanceTable,
    EventPracticeTable,
    HoverableButton,
  },
  props: ['group_id', 'event_id', 'pageY'],
  data() {
    return {
      loading: false,
      exercises_loading: false,
      exercises: undefined,
      lectures: undefined,
      attendances: undefined,
      event_name: undefined,
      total_students: undefined,
      practice_loading: undefined,
      error_message: undefined,
      tab: 0,
      // TODO Refactor to seperete file
      addVideoAndReviewModal: false,

      reviews: undefined,
      reviews_loading: undefined,

      current_page: 1,
      total_pages: undefined,
      total_exercises: undefined,
    }
  },
  watch: {
    tab() {
      this.current_page = 1
      this.fetch()
    },
    current_page() {
      this.fetch()
    },
  },
  mounted() {
    this.fetchLecture().then(() => {
      this.$nextTick(() => {
        this.$store.dispatch('breadcrumbs/setLinks', [
          {
            text: 'Занятия',
            to: {
              name: 'GroupEventIndex',
              params: {
                group_id: this.group_id,
              },
            },
            back: true,
          },
          {
            text: this.event_name || 'Ивент',
            disabled: true,
            // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
          },
        ])
      })
    })
  },
  activated() {
    this.$nextTick(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Занятия',
          to: {
            name: 'GroupEventIndex',
            params: {
              group_id: this.group_id,
            },
          },
          back: true,
        },
        {
          text: this.event_name || 'Ивент',
          disabled: true,
          // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
        },
      ])
    })
  },
  methods: {
    decodeHTML,

    fetch() {
      if (this.tab === 0) this.fetchLecture()
      else if (this.tab > 1) this.fetchExercises()
    },

    async fetchExercises() {
      this.exercises_loading = true

      let exercise_type =
        {
          3: 'homeworks',
          4: 'bonuses',
        }[this.tab] || 'practices'

      const params = {
        params: {
          page: this.current_page,
        },
      }

      try {
        const res = await this.$axios.get(
          `teacher/get-group/${this.group_id}/${exercise_type}/${
            this.event_id
          }${exercise_type === 'practices' ? '/v2' : ''}`,
          params
        )
        this.exercises = res?.data?.exercises || []
        this.total_students = res?.data?.students_count || '-'
        this.total_pages =
          Math.ceil(res?.data?.total_exercise_count / res?.data?.per_page) || 0
      } catch (err) {
        if (err && err.response && err.response.data) {
          // console.log(err.response.data)
          this.error_message = err.response.data.message
        }
      }
      this.exercises_loading = false
    },

    async fetchLecture() {
      this.loading = true
      try {
        let res = await this.$axios.get(
          `teacher/get-group/${this.group_id}/attendances/${this.event_id}`
        )
        this.event_name = res?.data?.event?.title || ''
        this.lectures = res?.data?.lectures
        this.attendances = res?.data?.attendances
        this.videoUrlActual = res?.data?.event?.live_url
        this.eventReviewActual = res?.data?.note?.comment
      } catch (err) {
        this.error_message = err?.response?.data?.message || err
      }
      this.loading = false
    },

    // async fetchReviews() {
    //   this.reviews_loading = true
    //   await this.$axios.get(`teacher/get-group/${this.group_id}/notes/${this.event_id}`)
    //     .then(res => {
    //       if(res && res.data) {
    //         this.reviews = res.data.notes
    //       }
    //     })
    //     .finally(() => {
    //       this.reviews_loading = false
    //     })
    // }
  },

  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     console.log(from.name)
  //     if(from.name === 'GroupExerciseShow') {
  //       // vm.tab = 2
  //       console.log(vm)
  //     }
  //   })
  // }
  // beforeRouteLeave(to, from, next) {
  //   if(to.name !== 'GroupExerciseShow') {
  //     this.$destroy()
  //   }
  //   next()
  // }
}
</script>

<style lang="scss">
.group-event-show__tabs {
  .v-tab {
    color: #171729 !important;
    text-transform: none;
    font-weight: 500;

    &:before {
      background-color: transparent !important;
    }

    &.v-tab--active {
      color: #0bc3b8 !important;
    }
  }

  .group-event-show__v-btn {
    align-self: center;
    margin-left: auto;
  }
}
</style>
