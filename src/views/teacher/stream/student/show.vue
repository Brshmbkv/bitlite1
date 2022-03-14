<template>
  <v-container>
    <v-row v-if="user_chapters_loading">
      <v-col cols="12" md="4" lg="3">
        <v-skeleton-loader type="list-item-avatar-two-line, divider" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <div class="d-flex">
          <v-avatar size="70" class="mx-3">
            <v-img :src="u_avatar || UserPlaceholderSm" alt="" />
          </v-avatar>
          <div class="my-auto ml-2">
            <span class="groupStudent_name">{{
              (u_firstname ? u_firstname + ' ' : '') + (u_lastname || '')
            }}</span>
            <span class="groupStudent_phone">{{ u_phone || ' - ' }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="user_chapters_loading">
      <v-col>
        <v-skeleton-loader type="button, divider" />
      </v-col>
    </v-row>
    <!-- MODULE LESSONS TABLE -->
    <v-row v-if="c_loading">
      <v-col>
        <v-skeleton-loader type="table" />
      </v-col>
    </v-row>
    <LiteChaptersTable
      v-else-if="!c_fetch_error"
      :chapters="chapters"
      :stream_id="stream_id"
      :student_id="student_id"
      :are-links="true"
    />
    <!-- :are-links='m_is_practicant' -->
    <!-- MODULE LESSONS TABLE -->
    <!-- USER STATS -->
    <v-row v-if="c_loading">
      <v-col v-for="i in 3" :key="i" md="4">
        <v-skeleton-loader type="list-item-avatar-two-line" />
      </v-col>
    </v-row>
    <course-stats
      v-else-if="!c_fetch_error"
      :total_events="total_chapters"
      :passed_events="total_passed"
      :points="!isNaN(Number(score)) ? Number(score) : undefined"
      hide_cheerups
      :loading="c_loading"
      :total_passed="chart_total_passed"
      :total_exercises="chart_total_passed"
      :chart_scores="chart_scores"
      :categories="c_titles"
    />
    <p v-else>Ошибка загрузки статисткик</p>
    <!-- USER STATS -->
  </v-container>
</template>
<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import CourseStats from '@/components/Courses/show/CourseStats'
import LiteChaptersTable from '@/components/Teacher/Student/LiteChaptersTable'

export default {
  name: 'TeacherStreamStudentShow',
  components: {
    LiteChaptersTable,
    CourseStats,
  },
  props: {
    stream_id: [Number, String],
    student_id: [Number, String],
    column: String,
    order: String,
    page: Number,
  },
  data() {
    return {
      UserPlaceholderSm,
      stream_name: '',
      // Module Info
      module_id: undefined,
      c_loading: false,
      c_fetch_error: false,
      total_chapters: undefined,
      c_titles: undefined,
      total_passed: undefined,
      score: undefined,
      // User info
      u_id: undefined,
      u_avatar: undefined,
      u_firstname: undefined,
      u_lastname: undefined,
      u_phone: undefined,
      // User Modules (Tabs)
      user_chapters: undefined,
      user_chapters_loading: true,
      chapters: undefined,
      // COURSE STATUS CHART
      chart_scores: [],
      chart_total_passed: undefined,
      chart_total_exercises: undefined,
    }
  },
  mounted() {
    this.fetchUserModules()
      .then(() => {
        this.fetchScores().finally(() => {
          this.c_loading = false
        })
      })
      .finally(() => {
        this.$store.dispatch('breadcrumbs/setLinks', [
          {
            text: this.stream_name || 'Назад',
            // expression returns < to: {...} > OR < action: () => {...} >
            to: {
              name: 'StreamShow',
              params: {
                // module_id: this.courseModuleId,
                stream_id: this.stream_id,
              },
              query: {
                type: 'lite',
                column: this.column || 'score',
                order: this.order || 'desc',
                page: this.page || 1,
              },
            },
            back: true,
            underline: true,
          },
          ...(this.u_firstname || this.u_lastname
            ? [
                {
                  text:
                    (this.u_firstname || '') + ' ' + (this.u_lastname || ''),
                  disabled: true,
                },
              ]
            : []),
        ])
      })
  },
  methods: {
    async fetchUserModules() {
      this.user_chapters_loading = true
      this.c_loading = true
      await this.$axios
        .get(
          `teacher/lite/streams/${this.stream_id}/students/${this.student_id}`
        )
        .then(({ data }) => {
          if (data) {
            // console.log(data)
            this.stream_name = data.group.name
            this.module_id = data.module && data.module.id
            this.chapters = data.chapters
            this.c_titles = data.chapters.map((chapter) => {
              return chapter.title
            })
            this.total_chapters = data.total_chapters
            this.total_passed = data.total_passed
            this.score = data.score
            // this.stream_id = data.stream.id
            if (data.user) {
              this.u_id = data.user.id
              this.u_avatar = data.user.avatar
              this.u_firstname = data.user.first_name
              this.u_lastname = data.user.last_name
              this.u_phone = data.user.phone
            }
          }
        })
        .catch((err) => {
          console.error(err)
          this.c_fetch_error = true
          return Promise.reject(err)
        })
        .finally(() => {
          this.user_chapters_loading = false
        })
    },

    async fetchScores() {
      await this.$axios
        .get(
          `teacher/lite/streams/${this.stream_id}/students/${this.student_id}/dashboard`
        ) //to $axios
        .then((res) => {
          if (res && res.data) {
            let scores = res.data.scores.map((num) => {
              if (num) return num
              return 0
            })
            this.chart_scores[0] = {
              name: 'Оценка',
              type: 'area',
              data: scores,
            }
            this.chart_total_exercises = res.data.total_exercises
            this.chart_total_passed = res.data.total_passed
          }
        })
    },
  },
}
</script>
<style lang="scss">
.groupStudent_name {
  display: block;
  color: #171729;
  padding-bottom: 5px;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.02em;
  text-align: left;
}

.groupStudent_phone {
  display: block;
  color: #5a6275;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.02em;
  text-align: left;
}

.student-module__tab {
  font-weight: 600 !important;
  font-size: 16px !important;
  line-height: 19px !important;
  color: #171729 !important;
  letter-spacing: 0 !important;

  &.v-tab--active {
    font-weight: 600 !important;
    font-size: 16px !important;
    line-height: 19px !important;
    color: #0bc3b8 !important;
    letter-spacing: 0 !important;
  }

  &::before {
    background-color: transparent !important;
  }
}
</style>
