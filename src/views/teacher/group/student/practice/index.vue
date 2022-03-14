<template>
  <v-container>
    <v-row v-if="loading">
      <v-col>
        <v-skeleton-loader type="table" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-simple-table class="my-table">
          <thead>
            <tr>
              <th
                class="text-center"
                style="font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.02em; color: #A7ADC3;"
              ></th>
              <th
                class="text-left"
                style="font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.02em; color: #A7ADC3;"
              >
                Дата сдачи
              </th>
              <th
                class="text-left"
                style="font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.02em; color: #A7ADC3;"
              >
                Название
              </th>
              <th
                class=""
                style="font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.02em; color: #A7ADC3;"
              >
                Оценка
              </th>
              <th
                class="text-right"
                style="font-size: 14px; line-height: 20px; font-weight: 500; letter-spacing: 0.02em; color: #A7ADC3;"
              >
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="exercises">
              <tr
                v-for="(exercise, ekey) in exercises"
                :key="'e+' + ekey"
                style="cursor: pointer; transition: all 0.25s ease;"
              >
                <td class="">
                  <span>
                    {{ ekey + 1 }}
                    <v-icon
                      v-if="
                        !!exercise.user_result &&
                          !exercise.user_result.is_checked
                      "
                      size="20"
                      :color="'#F16635'"
                    >
                      {{ mdiAlertOutline }}
                    </v-icon>
                  </span>
                </td>
                <td class="text-no-wrap">
                  <template v-if="exercise.user_result">
                    {{ exercise.user_result.created_at | longFormat }}
                  </template>
                  <template v-else>
                    Задание еще не решено
                  </template>
                </td>
                <td style="font-size: 15px;font-weight: 600">
                  {{ exercise.title || '' }}
                </td>
                <td class="pr-0">
                  <span>
                    {{
                      exercise.user_result
                        ? exercise.user_result.is_checked
                          ? exercise.user_result.score + '%'
                          : '-'
                        : '-'
                    }}
                  </span>
                </td>
                <td class="text-right pr-0">
                  <v-btn
                    v-if="exercise.user_result"
                    outlined
                    elevation="0"
                    :ripple="false"
                    color="#4376FB"
                    class="ml-4 text-capitalize"
                    @click="currentAnswerId = ekey"
                    >Оценить
                  </v-btn>
                </td>
              </tr>
            </template>
            <p v-else>Нет данных</p>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" :transition="false" max-width="720">
      <v-card v-if="currentAnswerId >= 0" elevation="0">
        <v-form v-if="exercises && exercises[currentAnswerId]" class="pa-8">
          <p
            class="my-practicants-modal__title font-weight-bold mb-6"
            style="font-size: 22px; color: #000000"
          >
            Оценка задачи
          </p>
          <p class="my-practicants-modal__title mb-1">Задание</p>
          <div
            class="my-practicants-modal__content"
            v-html="decodeHTML(exercises[currentAnswerId].content)"
          ></div>
          <template
            v-if="
              exercises[currentAnswerId].answer_type === 'text' ||
                exercises[currentAnswerId].answer_type === 'compiler' ||
                exercises[currentAnswerId].answer_type === 'compiler_noj'
            "
          >
            <p class="my-practicants-modal__title mt-6 mb-1">Ответ</p>
            <highlight
              autodetect
              :code="exercises[currentAnswerId].user_result.value"
            />
          </template>
          <template
            v-else-if="
              exercises[currentAnswerId].answer_type === 'file' &&
                exercises[currentAnswerId].user_result
            "
          >
            <p class="my-practicants-modal__title mt-6 mb-1">
              Прикрепленные файлы
            </p>
            <div
              class="row ma-1"
              v-for="file in exercises[currentAnswerId].user_result.attachments"
              :key="file.id"
            >
              <v-chip
                color="primary"
                label
                :ripple="false"
                @click="downloadFile(file.id, file.name)"
              >
                <v-icon left small>
                  {{ mdiPaperclip }}
                </v-icon>
                {{ file.name }}
              </v-chip>
            </div>
          </template>
          <p class="my-practicants-modal__title mt-6 mb-1">Комментарий</p>
          <v-textarea
            outlined
            placeholder="Напишите комментарий"
            :value="currentComment"
            @change="currentComment = $event"
            autocomplete="off"
          ></v-textarea>
          <div class="mb-4">
            <span class="my-practicants-modal__title mr-3">Оценка</span>
            <span
              class="my-practicants-modal__score-details"
              :style="{
                backgroundColor:
                  exercises[currentAnswerId].user_result &&
                  exercises[currentAnswerId].user_result.overdue
                    ? '#ef4444'
                    : '#00665E',
              }"
            >
              {{
                exercises[currentAnswerId].user_result &&
                exercises[currentAnswerId].user_result.overdue
                  ? 'Сдан не в срок'
                  : 'Сдан в срок'
              }}
            </span>
          </div>
          <div class="d-flex">
            <v-text-field
              outlined
              height="48"
              v-model="currentScore"
              type="number"
              placeholder=" "
              autocomplete="off"
              @wheel="$event.target.blur()"
              :rules="scoreRules"
              :error-messages="
                errors ? 'Введенное число не должно превышать 100' : ''
              "
            ></v-text-field>
            <div
              v-if="
                exercises[currentAnswerId].user_result &&
                  exercises[currentAnswerId].user_result.overdue
              "
              style="border: 1px solid #9FA4B1; height: 56px;border-radius: 4px"
              class="d-flex justify-space-between align-items-center ml-2 pl-4 pr-2"
            >
              <p
                class="mb-0 align-self-center"
                style="font-weight: 600; color: #5A6275"
              >
                Занизить оценку
              </p>
              <v-switch
                v-model="currentScoreLowered"
                inset
                class="beautiful__switch align-self-center ml-10"
                :ripple="false"
              ></v-switch>
            </div>
          </div>
          <div class="d-flex">
            <v-btn
              :ripple="false"
              :disabled="currentScore_loading"
              color="#ef4444"
              outlined
              style="font-weight: 600"
              elevation="0"
              class="text-capitalize px-sm-8 py-sm-6 mr-auto"
              @click="changeScore(true)"
              >Отправить на доработку
            </v-btn>
            <v-btn
              :ripple="false"
              :disabled="currentScore_loading"
              color="#9ca3af"
              elevation="0"
              class="text-capitalize white--text px-sm-8 py-sm-6"
              @click="
                () => {
                  this.showDialog = false
                  this.errors = false
                }
              "
              >Отмена
            </v-btn>
            <v-btn
              :ripple="false"
              :disabled="currentScore_loading"
              color="#4376FB"
              elevation="0"
              class="text-capitalize white--text px-sm-8 py-sm-6  ml-5"
              @click="changeScore()"
              >Оценить
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import highlight from '@/components/highlight.vue'
import {
  mdiPaperclip,
  mdiAlertOutline,
  mdiCheck,
  mdiAlertCircleOutline,
} from '@mdi/js'
import { decodeHTML } from '@/helpers'

export default {
  name: 'StudentExercises',
  components: {
    highlight,
  },
  props: ['student_id', 'event_id', 'stream_id'],
  data() {
    return {
      mdiAlertOutline,
      mdiCheck,
      mdiAlertCircleOutline,
      currentAnswerId: undefined,
      currentComment: undefined,
      currentScore: undefined,
      currentScoreLowered: undefined,
      currentScore_loading: false,
      exercises: undefined,
      loading: false,
      student: '',
      group: '',
      event: '',
      errors: false,
      new_stream_id: undefined,
      mdiPaperclip,
      scoreRules: [
        (v) => v >= 0 || 'Введенное значение не должно быть меньше 0',
        (v) => v <= 100 || 'Введенное значение не должно превышать 100',
      ],
    }
  },
  computed: {
    showDialog: {
      get() {
        if (typeof this.currentAnswerId === 'number') {
          return true
        } else return false
      },
      set(val) {
        if (!val && !this.currentScore_loading) {
          console.log('YO?')
          this.currentAnswerId = undefined
          this.currentComment = undefined
          this.currentScore = undefined
          this.currentScoreLowered = undefined
        }
      },
    },
  },

  watch: {
    currentAnswerId(newVal) {
      if (typeof newVal === 'number') {
        this.currentComment = this.exercises[
          this.currentAnswerId
        ].user_result.comment
        this.currentScore = this.exercises[this.currentAnswerId].user_result
          .is_checked
          ? this.exercises[this.currentAnswerId].user_result.score
          : ''
      } else {
        this.currentComment = undefined
        this.currentScore = undefined
      }
    },
  },
  mounted() {
    this.fetchExerciseAnswers().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: this.group.name,
          to: {
            name: 'StreamGroupIndex',
            params: {
              // module_id: this.courseModuleId,
              stream_id: this.stream_id ? this.stream_id : this.new_stream_id,
              group_id: this.group.id,
            },
          },
          back: true,
        },
        {
          text:
            (this.student.first_name || '') +
            ' ' +
            (this.student.last_name || ''),
          to: {
            name: 'TeacherGroupStudentShow',
            params: {
              group_id: this.group.id,
              student_id: this.student_id,
            },
          },
        },
        {
          text: this.event.title,
          disabled: true,
        },
      ])
    })
  },
  methods: {
    decodeHTML,
    async fetchExerciseAnswers() {
      this.loading = true
      await this.$axios
        .get(
          `teacher/get-student/${this.student_id}/get-answers/${this.event_id}`
        )
        .then((res) => {
          if (res && res.data) {
            this.exercises = res.data.exercises
            this.student = res.data.student
            this.group = res.data.group
            this.event = res.data.event
            this.new_stream_id =
              (res.data.group && res.data.group.parent_id) || undefined
          }
        })
        .catch((err) => {
          // TODO Catch this error properly
          console.error(err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    async changeScore(forRevision) {
      this.currentScore_loading = true
      let comment = this.currentComment
      let event_id = this.event_id
      let exercise_id = this.exercises[this.currentAnswerId].id
      let id = this.exercises[this.currentAnswerId].user_result.id
      let score = this.currentScore
      let user_id = this.student_id

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
          // console.log('scoreChange: ', res.data)
          if (res && res.data) {
            if (res.data.errors) {
              this.errors = true
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: 'Ошибка!',
                color: 'red',
              })
            } else {
              let resAnswerId = res.data.id
              let resComment = res.data.comment
              let resScore = res.data.score
              let ansKey = this.exercises.findIndex(
                (ex) => ex.user_result && ex.user_result.id === resAnswerId
              )
              if (ansKey >= 0) {
                this.exercises[ansKey].user_result.score = resScore
                this.exercises[ansKey].user_result.comment = resComment
                this.exercises[ansKey].user_result.is_checked = true
              }
              // console.log(ansKey, resAnswerId, resComment, resScore)
              this.currentAnswerId = false
              this.showDialog = false
              this.errors = false
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: 'Сохранено!',
                color: 'success',
              })
            }
          }
        })
        .catch((err) => {
          console.error('score change error', err)
          let errorText = 'Ошибка'
          if (err && err.response) {
            errorText = `${err.response.status} Ошибка`
          }
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: errorText,
            color: 'error',
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
            const downloadUrl = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = downloadUrl
            link.setAttribute('download', name) //any other extension
            document.body.appendChild(link)
            link.click()
            link.remove()
          }
        })
    },
  },
}
</script>
<style lang="scss">
.my-practicants-modal__title {
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.02em;
  font-weight: 600;
  color: #0002217a;
}

.my-practicants-modal__content {
  padding: 12px 16px;
  max-height: 300px;
  border: 1px solid #17172914;
  overflow: auto;
  border-radius: 16px;
}

.my-practicants-modal__score-details {
  display: inline-block;
  color: #ffffff;
  font-size: 12px;
  line-height: 16px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
