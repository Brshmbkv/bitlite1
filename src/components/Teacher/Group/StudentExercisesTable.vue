<template>
  <div>
    <v-simple-table
      v-if="studentResults && studentResults.length > 0"
      class="my-table"
    >
      <thead>
        <tr>
          <th class="text-left font-weight-regular grayLight--text pl-0">#</th>
          <th class="text-left font-weight-regular grayLight--text">
            Имя студента
          </th>
          <th
            class="text-left font-weight-regular grayLight--text pb-2"
            @click="$emit('order-by-column', 'created_at')"
          >
            <SortIcon class="smaller-svg" />
            <span style="cursor:pointer !important;">Дата сдачи</span>
          </th>
          <th
            class="text-right font-weight-regular grayLight--text pb-2 pr-0"
            @click="$emit('order-by-column', 'score')"
          >
            <SortIcon class="smaller-svg" />
            <span style="cursor:pointer !important;">Оценка</span>
          </th>
          <th
            class="text-right font-weight-regular grayLight--text pr-0"
            width="10%"
          ></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, s_key) in studentResults" :key="'e+' + s_key">
          <td class="pl-0">
            <span>
              {{ '#' + (s_key + 1) }}
              <v-icon
                v-if="!!student.result && !student.result.is_checked"
                size="20"
                :color="'#F16635'"
              >
                {{ mdiAlertOutline }}
              </v-icon>
            </span>
          </td>
          <td class="text-capitalize text-no-wrap">
            <router-link
              tag="span"
              :to="
                group_id
                  ? {
                      name: 'TeacherGroupStudentShow',
                      params: {
                        group_id: group_id,
                        student_id: student.id,
                      },
                    }
                  : stream_id
                  ? {
                      name: 'TeacherStreamStudentShow',
                      params: {
                        stream_id: stream_id,
                        student_id: student.id,
                      },
                    }
                  : undefined
              "
              :style="{
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'underline',
                textUnderlinePosition: 'under',
                textDecorationColor: '#d6d6e6',
              }"
            >
              {{ (student.first_name || '') + ' ' + (student.last_name || '') }}
            </router-link>
          </td>
          <td class="font-weight-medium">
            <template v-if="'result' in student">
              <span
                class="text-capitalize"
                v-if="student.result && student.result.created_at"
              >
                {{ (student.result && student.result.created_at) | longFormat }}
              </span>
              <span v-else>
                {{ '-' }}
              </span>
              <!-- {{ student.result.date | tableDateFilter }} -->
            </template>
          </td>
          <td
            class="text-right pr-0"
            :class="
              student.result && student.result.changed
                ? 'success--text'
                : undefined
            "
          >
            <span
              :style="{
                color:
                  student.result &&
                  student.result.is_checked &&
                  student.result.score >= 0
                    ? '#0BC4B8'
                    : '',
              }"
            >
              {{
                student.result &&
                student.result.is_checked &&
                student.result.score >= 0
                  ? student.result.score + '%'
                  : '-'
              }}
            </span>
          </td>
          <td class="text-right pr-0">
            <v-btn
              v-if="student.result"
              elevation="0"
              out
              :ripple="false"
              color="success"
              class="ml-4 text-capitalize"
              @click="currentStudentId = s_key"
              >Оценить</v-btn
            >
          </td>
        </tr>
      </tbody>
      <RateStudentDialog
        :value.sync="showDialog"
        :current-score.sync="currentScore"
        :underestimate.sync="currentScoreLowered"
        :loading="currentScore_loading"
        :errors="errors"
        :score.sync="currentScore"
        :comment.sync="currentComment"
        :content="content"
        :student="studentResults && studentResults[currentStudentId]"
        @change-score="(value) => changeScore(value)"
      />
    </v-simple-table>
    <CoursesEmptyPlaceholder v-else :text="'Пусто...'" />
  </div>
</template>
<script>
import { mdiAlertOutline } from '@mdi/js'
import SortIcon from '@/assets/svg/sort-icon.svg'
import CoursesEmptyPlaceholder from '@/components/EmptyPlaceholder'
import { decodeHTML } from '@/helpers'
import RateStudentDialog from '@/components/Teacher/Group/RateStudentDialog'

export default {
  name: 'StudentExercisesTable',
  components: {
    RateStudentDialog,
    CoursesEmptyPlaceholder,
    SortIcon,
  },
  props: [
    'studentResults',
    'event_id',
    'exercise_id',
    'content',
    'group_id',
    'stream_id',
  ],
  data() {
    return {
      mdiAlertOutline,
      currentStudentId: undefined,
      currentComment: undefined,
      currentScore: undefined,
      currentScore_loading: false,
      currentScoreLowered: undefined,
      loading: false,
      errors: false,
    }
  },
  computed: {
    showDialog: {
      get() {
        return typeof this.currentStudentId === 'number'
      },
      set(val) {
        if (!val && !this.currentScore_loading) {
          this.currentStudentId = undefined
          this.currentComment = undefined
          this.currentScore = undefined
          this.currentScoreLowered = false
        }
      },
    },
  },
  watch: {
    currentStudentId(newVal) {
      if (typeof newVal === 'number') {
        this.currentComment =
          (this.studentResults[this.currentStudentId] &&
            this.studentResults[this.currentStudentId].result &&
            this.studentResults[this.currentStudentId].result.comment) ||
          ''

        this.currentScore =
          this.studentResults[this.currentStudentId] &&
          this.studentResults[this.currentStudentId].result &&
          this.studentResults[this.currentStudentId].result.is_checked
            ? this.studentResults[this.currentStudentId].result.score
            : ''

        // this.currentScoreLowered = (this.studentResults[this.currentStudentId]
        //   && this.studentResults[this.currentStudentId].result
        //   && this.studentResults[this.currentStudentId].result.overdue
        // )
      } else {
        this.currentComment = undefined
        this.currentScore = undefined
        this.currentScoreLowered = undefined
      }
    },
  },
  methods: {
    decodeHTML,
    async changeScore(forRevision) {
      this.currentScore_loading = true
      let comment = this.currentComment
      let event_id = this.event_id
      let exercise_id = this.exercise_id
      let id = this.studentResults[this.currentStudentId].result.id
      let score = this.currentScore
      let user_id = this.studentResults[this.currentStudentId].id

      await this.$axios
        .post('teacher/save-score', {
          comment,
          event_id,
          exercise_id,
          id,
          user_id,
          score: forRevision ? 0 : score,
          ...(this.currentScoreLowered && { make_overdue: true }),
          ...(forRevision && { retake: 1 }),
        })
        .then((res) => {
          if (res && res.data) {
            if (res.data.errors) {
              this.errors = true
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: 'Ошибка!',
                color: 'red',
              })
            } else {
              let resUserId = res.data.user_id
              let resComment = res.data.comment
              let resScore = res.data.score
              this.$emit('onScoreChange', {
                user_id: resUserId,
                comment: resComment,
                score: resScore,
              })
              // let ansKey = this.answers.findIndex((ans) => ( ans.id === resAnswerId ))
              // if( ansKey >= 0){
              //   this.answers[ansKey].score = resScore;
              //   this.answers[ansKey].comment = resComment;
              //   this.answers[ansKey].changed = true;
              // }
              // console.log(ansKey, resAnswerId, resComment, resScore)
              this.currentStudentId = false
              this.showDialog = false
              this.errors = false
            }
          }
        })
        .catch((err) => {
          let errorText
          if (err && err.response) {
            errorText = `${err.status}: Ошибка`
          } else {
            errorText = 'Возникла неизвестная ошибка... '
            throw err
          }
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: errorText,
            color: 'red',
          })
        })
        .finally(() => {
          this.currentScore_loading = false
        })
    },

    async downloadFile(id, name) {
      await this.$axios
        .get('/attachments/' + id + '/download', {
          responseType: 'blob',
        })
        .then((res) => {
          if (res && res.data) {
            const downloadUrl = window.URL.createObjectURL(
              new Blob([res.data], { type: res.data.type })
            )
            // console.log('download-file-url', downloadUrl)
            // console.log('download-file', res.headers["content-disposition"])
            const link = document.createElement('a')
            link.href = downloadUrl
            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
            link.remove()
          }
        })
    },
  },
}
</script>
