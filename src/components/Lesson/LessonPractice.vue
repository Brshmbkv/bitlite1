<template>
  <v-container class="px-0">
    <v-row v-if="error.length">
      <v-col>
        <v-alert type="error">
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-if="fetching">
      <v-col class="d-flex justify-center">
        <v-progress-circular color="primary" indeterminate />
      </v-col>
    </v-row>
    <template v-else>
      <v-row>
        <v-col cols="9">
          <template v-if="currentKey >= 0">
            <div>
              <ExerciseHeader
                v-model="currentKey"
                :length="exercises.length"
                :title="exercises[currentKey].title"
                :score="
                  auth_user_results[currentKey] &&
                    auth_user_results[currentKey].score
                "
                :points="
                  auth_user_results[currentKey] &&
                    auth_user_results[currentKey].points
                "
                :status="userResultStatus"
              />
              <div
                class="my-2"
                v-html="decodeHTML(exercises[currentKey].content)"
              />
            </div>
            <div
              v-if="
                exercises[currentKey].answer_type === 'text' ||
                  exercises[currentKey].answer_type === 'compiler' ||
                  exercises[currentKey].answer_type === 'compiler_noj'
              "
              class="mt-5 mb-10"
            >
              <TeacherAnswer
                v-if="
                  exercises[currentKey] &&
                    exercises[currentKey]['has_answer'] &&
                    [3, 4, 6].includes(userResultStatus.code)
                "
                class="mb-8"
                :dialog="showDialogTeacherAnswer"
                :student-answer="
                  auth_user_results[currentKey] &&
                    auth_user_results[currentKey]['value']
                "
                :teacher-answer="
                  exercises[currentKey] && exercises[currentKey]['answer']
                "
                @close="showDialogTeacherAnswer = false"
                @open="showDialogTeacherAnswer = true"
              />
              <TeacherComment
                v-if="
                  auth_user_results[currentKey] &&
                    auth_user_results[currentKey]['comment']
                "
                :teacher="teacher"
                :comment="auth_user_results[currentKey]['comment']"
              />
              <CompilerVerdict
                v-if="
                  auth_user_results[currentKey] &&
                    auth_user_results[currentKey]['compiler_verdict']
                "
                :text="
                  auth_user_results[currentKey] &&
                    auth_user_results[currentKey]['compiler_verdict']
                "
              />
              <v-expand-transition>
                <ExerciseHint
                  v-if="showHint"
                  :value="
                    exercises[currentKey] && exercises[currentKey]['hint']
                  "
                  @close="showHint = false"
                />
              </v-expand-transition>
              <CodeEditor
                v-if="
                  exercises[currentKey].answer_type === 'compiler' ||
                    exercises[currentKey].answer_type === 'text' ||
                    exercises[currentKey].answer_type === 'compiler_noj'
                "
                v-model="exerciseCurrentValues[currentKey]"
                :answer-type="exercises[currentKey].answer_type"
                :attempts-max="exercises[currentKey]['attempts']"
                :attempts-user="
                  (auth_user_results[currentKey] &&
                    auth_user_results[currentKey].attempts) ||
                    0
                "
                :is-loading="userResultStatus && userResultStatus.code === 5"
                :level="exercises[currentKey].level_coef"
                :mode="this.courseType === 3 ? 'text/x-c++src' : 'text/x-java'"
                :next-is-available="currentKey < exercises.length - 1"
                :send-disabled="
                  loading || refresh_loading || savedCurrentEquals[currentKey]
                "
                :retry="
                  auth_user_results[currentKey] &&
                    auth_user_results[currentKey].retry
                "
                :score="
                  Number(
                    auth_user_results[currentKey] &&
                      auth_user_results[currentKey].score
                  )
                "
                :send-loading="loading"
                :status="userResultStatus"
                :exercise-id="
                  exercises[currentKey] && exercises[currentKey]['id']
                "
                :hasHint="
                  exercises[currentKey] && exercises[currentKey]['hint'] && true
                "
                :hasAnswer="
                  exercises[currentKey] && exercises[currentKey]['has_answer']
                "
                @help_request="handleExerciseHelpRequest"
                @send="sendCurrentExercise"
                @show_hint="showHint = true"
                @nextClick="currentKey < exercises.length - 1 && currentKey++"
                @showTeacherAnswer="openTeacherAnswerDialog"
              />
            </div>
            <div
              v-if="exercises[currentKey].answer_type === 'file'"
              class="d-flex flex-column align-center justify-center"
            >
              <PracticeFileUpload
                :files="
                  auth_user_results[currentKey] &&
                    auth_user_results[currentKey].attachments
                "
                :can_add="addFileToFilePond"
                :model_id="
                  exercises[currentKey] &&
                    auth_user_results[currentKey] &&
                    auth_user_results[currentKey]['id']
                "
                :uuid="uuids[currentKey]"
                @file-remove="fileRemoveHandler"
                @setSavable="$set(savable, currentKey, true)"
                @add-to-upload-files="
                  (file) => {
                    this.uploadedFiles[currentKey] = file
                  }
                "
              />
              <v-btn
                :disabled="loading || refresh_loading || !savable[currentKey]"
                color="primary"
                @click="sendCurrentExercise"
                >Отправить
              </v-btn>
            </div>
          </template>
        </v-col>
        <v-col cols="3">
          <p style="font-weight: 600;font-size: 18px;line-height: 24px;">
            Список задач до:
            <span style="color: #ef4444">{{ deadline | longFormat }}</span>
          </p>
          <ExerciseNumberButtons
            :exercises="exercises || []"
            :saved="savedCurrentEquals || []"
            :current.sync="currentKey"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { uuid } from 'vue-uuid'
import { decodeHTML } from '@/helpers'
import PracticeFileUpload from '@/components/Lesson/Practice/FileUploader.vue'
import TeacherComment from '@/components/Lesson/Practice/TeacherComment'
import TeacherAnswer from '@/components/Lesson/Practice/TeacherAnswer'
import ExerciseHeader from '@/components/Lesson/Practice/ExerciseHeader'
import ExerciseHint from '@/components/Lesson/Practice/ExerciseHint'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import ExerciseNumberButtons from '@/components/Lesson/Practice/ExerciseNumberButtons'
import CompilerVerdict from '@/components/Lesson/Practice/CompilerVerdict'
import {
  mdiLink,
  mdiFire,
  mdiClockOutline,
  mdiInformationOutline,
  mdiRefresh,
} from '@mdi/js'

export default {
  name: 'LessonPractice',

  components: {
    CompilerVerdict,
    ExerciseNumberButtons,
    CodeEditor: () =>
      import(
        /* webpackPrefetch: true */ '@/components/Lesson/Practice/CodeEditor'
      ),
    PracticeFileUpload,
    ExerciseHeader,
    ExerciseHint,
    TeacherAnswer,
    TeacherComment,
  },

  props: {
    courseType: {
      type: Number,
    },
    eventId: {
      type: Number,
    },
    fetching: {
      type: Boolean,
    },
    exercises: {
      type: Array,
      required: true,
    },
    teacher: Object,
    deadline: [Date, String],
    status: Object,
    current_exercise: Number,
  },

  data() {
    return {
      auth_user_results: [],
      currentKey: 0,
      editorValue: '',
      myFiles: [],
      addFileToFilePond: false,
      uploadedFiles: [],
      savable: [],
      exerciseCurrentValues: [],
      exerciseSavedValues: [],
      loading: false,
      error: '',
      imageUrl: '',
      uuids: [],
      untilDeadline: undefined,
      showDialogTeacherAnswer: false,
      showHint: false,
      refresh_loading: false,

      // ICONS
      UserPlaceholderSm,
      mdiInformationOutline,
      mdiLink,
      mdiClockOutline,
      mdiFire,
      mdiRefresh,
    }
  },

  computed: {
    savedCurrentEquals() {
      return this.exerciseCurrentValues.map(
        (el, id) => el === this.exerciseSavedValues[id]
      )
    },

    userResultStatus() {
      return (
        (this.auth_user_results[this.currentKey] &&
          this.auth_user_results[this.currentKey].status) ||
        {}
      )
    },
  },

  watch: {
    currentKey(newKey) {
      if (
        this.auth_user_results[newKey]?.status?.code === 1 &&
        this.exercises[newKey]?.answer_type !== 'file'
      ) {
        this.getResultByExerciseKey(newKey)
      }
      this.showDialogTeacherAnswer = false
    },

    current_exercise: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          let ex = this.exercises.find((ex) => ex.id === newValue)
          this.currentKey = this.exercises.indexOf(ex)
        }
      },
    },

    exerciseSavedValues: {
      handler(val) {
        let countSaved = val.filter((el) => el).length
        let totalLessons = val.length
        this.$emit('setProgress', countSaved / totalLessons)
      },
      immediate: true,
    },

    deadline: {
      handler(oldVal, newVal) {
        if (oldVal !== newVal) {
          let currentDate = new Date()
          let deadlineDate = this.deadline
            ? new Date(Date.parse(this.deadline.replace(/ /g, 'T')))
            : new Date()
          this.untilDeadline = deadlineDate - currentDate
          let interval = window.setInterval(() => {
            if (this.untilDeadline > 0) {
              this.untilDeadline = this.untilDeadline - 1000
            } else {
              this.untilDeadline = -1
              window.clearInterval(interval)
            }
          }, 1000)
        }
      },
      immediate: true,
    },
  },

  destroyed() {
    let user_id = this.$store.state.user.id
    let channel = this.$pusher.channel(`Exercise.User.${user_id}`)
    this.$pusher.disconnect()
    if (channel) {
      channel.unbind(
        'App\\Events\\ExerciseScored',
        this.handlePusherExerciseResultData
      )
    }
  },

  beforeMount() {
    console.log(this.exercises)
    // write all asignments in one forEach statement instead of 4 map functions
    this.auth_user_results = this.exercises.map((ex) => {
      // ex['auth_user_result'].title = ex.title
      // ex['auth_user_result'] = {
      //   ...ex['auth_user_result'],
      //   title: ex.title,
      // }
      return ex['auth_user_result']
    })

    this.exerciseCurrentValues = this.exercises.map((ex) => {
      if (ex.auth_user_result && ex.auth_user_result.value) {
        return ex.auth_user_result.value
      }
      return ''
    })

    this.exerciseSavedValues = [...this.exerciseCurrentValues]

    this.uuids = this.exercises.map((ex) => {
      if (ex.answer_type === 'file') {
        return uuid.v4()
      }
    })

    if (this.exercises[this.currentKey]?.answer_type === 'file') {
      // this.myFiles = new Array(this.exercises.length).fill([])
      this.uploadedFiles = new Array(this.exercises.length).fill([])
      // this.fillMyFiles()
    }
    // this.dFile()

    if (
      this.exercises.some(
        (exercise) =>
          exercise?.answer_type === 'compiler' ||
          exercise?.answer_type === 'compiler_noj'
      )
    ) {
      console.log('Задачки с компилятором!')
      this.pusherConnect()
    }
  },

  methods: {
    decodeHTML,
    openTeacherAnswerDialog() {
      this.showDialogTeacherAnswer = true
    },

    handlePusherExerciseResultData(data) {
      try {
        let exercise_key = this.auth_user_results.findIndex(
          (result) => result && result.exercise_id == data.exercise_id
        )
        if (this.auth_user_results[exercise_key]) {
          this.$set(this.auth_user_results[exercise_key], 'status', data.status)
          this.$set(this.auth_user_results[exercise_key], 'score', data.score)
          this.$set(this.auth_user_results[exercise_key], 'points', data.points)
          this.$set(this.auth_user_results[exercise_key], 'retry', data.retry)
          this.$set(this.exercises[exercise_key], 'answer', data.answer)
          this.$set(
            this.auth_user_results[exercise_key],
            'compiler_verdict',
            data.compiler_verdict || ''
          )

          // this.$set(this.auth_user_results[exercise_key], 'is_checked', data.is_checked)
        }
      } catch (e) {
        throw Error(e)
      }
    },

    toDay(ms) {
      let seconds = Math.floor((ms / 1000) % 60)
      let minutes = Math.floor((ms / (1000 * 60)) % 60)
      let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
      let days = Math.floor(ms / (1000 * 60 * 60 * 24))

      // hours = (hours < 10) ? "0" + hours : hours;
      // minutes = (minutes < 10) ? "0" + minutes : minutes;
      // seconds = (seconds < 10) ? "0" + seconds : seconds;
      // greater than 2 days
      if (ms > 172800000) {
        return `ОСТАЛОСЬ: ${days}д` // if less than inf. day, but more than 2 day
      } else if (ms > 86400000) {
        return (
          'ОСТАЛОСЬ: ' +
          `${days}д ` +
          (hours ? `${hours}ч ` : '') +
          (minutes ? `${minutes}м` : '')
        ) // if less than 2 day for showing 1 day and hour:minute
      } else if (ms > 3600000) {
        return `ОСТАЛОСЬ: ${hours}ч ${minutes}м` // if less than 1 day for showing only hour and minute
      } else if (ms > 60000) {
        return `ОСТАЛОСЬ: ${minutes}м ${seconds}c` // if less than 1 hour for showing only m:s
      } else {
        return `ОСТАЛОСЬ: ${seconds}с` // if less than 1 minute
      }
    },

    async getResultByExerciseKey(key) {
      try {
        let id = this.exercises[key].id
        let { data } = await this.$axios.get(`/exercises/${id}/`)
        if (data?.auth_user_result) {
          this.$set(this.auth_user_results, key, data.auth_user_result)
        } else {
          throw Error('При обновлении статуса пришли неверные данные')
        }
      } catch (e) {
        console.error(e)
      }
    },

    async sendCurrentExercise(options) {
      this.exerciseCurrentValues[this.currentKey] = this.exerciseCurrentValues[
        this.currentKey
      ].trim()
      this.loading = true
      this.error = ''
      let id = this.exercises[this.currentKey].id
      let value = this.exerciseCurrentValues[this.currentKey]
      let uuid = this.uuids[this.currentKey]
      await this.$axios
        .put('/submit-exercise/' + id, {
          value,
          uuid,
          ...(this.eventId && { event_id: this.eventId }),
          ...(['compiler', 'compiler_noj'].includes(
            this.exercises[this.currentKey].answer_type
          ) &&
            this.auth_user_results[this.currentKey] &&
            this.auth_user_results[this.currentKey].attempts >=
              this.exercises[this.currentKey].attempts && {
              check_by_teacher: 1,
            }),
          ...options,
        })
        .then((res) => {
          if (res && res.data && res.data.result) {
            this.exerciseSavedValues = this.exerciseSavedValues.map(
              (ex, exId) =>
                exId === this.currentKey ? res.data.result.value : ex
            )

            this.$set(this.auth_user_results, this.currentKey, res.data.result)

            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Ваш ответ сохранен!',
              color: 'success',
            })

            if (
              this.exercises[this.currentKey] &&
              this.exercises[this.currentKey].answer_type === 'file'
            ) {
              this.savable[this.currentKey] = false
            }
          }
        })
        .catch((err) => {
          if (err?.response?.data) {
            this.error = err.response.data.message || err
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: err.response.data.message || err,
              color: 'red',
            })
            throw err
          } else {
            this.error = err.message || err
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: err.message || err,
              color: 'red',
            })
            throw err
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleExerciseHelpRequest() {
      let current_id = this.currentKey
      let exercise_id = this.exercises[current_id].id
      console.log('ola!')
      return this.$axios
        .post(`submit-exercise/${exercise_id}/help-teacher`)
        .then((res) => {
          if (res.data) {
            this.$set(this.auth_user_results, current_id, res.data)
            this.$set(this.exerciseCurrentValues, current_id, res.data.value)
          } else {
            throw Error('Пустой ответ после запроса помощи преподавателя')
          }
        })
    },

    fileRemoveHandler() {
      this.getResultByExerciseKey(this.currentKey)
    },

    pusherConnect() {
      let user_id = this.$store.state.user.id
      this.$pusher.connect()
      let channel =
        this.$pusher.channel(`Exercise.User.${user_id}`) ||
        this.$pusher.subscribe(`Exercise.User.${user_id}`)
      channel.bind(
        'App\\Events\\ExerciseScored',
        this.handlePusherExerciseResultData
      )
    },

    getStatusColor(status) {
      if (this.untilDeadline > 0) return 'rgba(11, 196, 184, 0.08)'
      return (
        {
          1:
            this.untilDeadline > 0
              ? 'rgba(231, 174, 30, 0.12)'
              : 'rgba(238, 82, 82, 0.12)',
          4: 'rgba(231, 174, 30, 0.12)',
          5: 'rgba(92, 198, 137, 0.08)',
          6: 'rgba(0, 0, 0, 0.1)',
        }[status] || 'rgba(238, 82, 82, 0.12)'
      )
    },

    getStatusTextColor(status) {
      if (this.untilDeadline > 0) return '#0BC3B8'
      return (
        {
          1: this.untilDeadline > 0 ? '#E7AE1E' : '#EE5252',
          4: '#E7AE1E',
          5: '#5CC689',
          6: '#5A6275',
        }[status] || '#EE5252'
      )
    },
    // getStatusText(status) {
    //   return {
    //     1: '',
    //     4: 'ДЗ НА ПРОВЕРКЕ',
    //     5: 'Все задачи сданы в срок',
    //     7: 'Есть задачи требующие доработку',
    //     8: 'ДЗ НА ПРОВЕРКЕ(ПРОСРОЧЕНО)',
    //     9: 'ИМЕЮТСЯ ЗАДАЧИ С ПРОСРОЧКОЙ',
    //   }[status]
    // },
  },
}
</script>

<style lang="scss">
.transparent-before__btn {
  &:before {
    background-color: transparent;
  }
}
</style>
