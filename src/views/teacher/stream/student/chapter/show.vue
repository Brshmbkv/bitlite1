<template>
  <v-container>
    <v-row v-if="loading">
      <v-col>
        <v-skeleton-loader type="table" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="exercises && exercises.length > 0">
        <v-simple-table class="my-table" style="table-layout: fixed">
          <thead>
            <tr>
              <th class="text-left font-weight-regular grayLight--text pl-0">
                #
              </th>
              <th
                class="text-left font-weight-regular grayLight--text"
                width="1px"
              >
                Дата сдачи
              </th>
              <th class="text-left font-weight-regular grayLight--text">
                Название
              </th>
              <th class="text-center font-weight-regular grayLight--text">
                В срок
              </th>
              <th class="text-center font-weight-regular grayLight--text">
                Кол-во попыток
              </th>
              <th class="text-center font-weight-regular grayLight--text pr-0">
                Оценка
              </th>
              <th
                class="text-right font-weight-regular grayLight--text pr-0"
                width="1px"
              ></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="exercises">
              <tr v-for="(exercise, ekey) in exercises" :key="'e+' + ekey">
                <td class="pl-0">
                  <span>
                    {{ '#' + (ekey + 1) }}
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
                <td class="text-capitalize text-no-wrap">
                  <template v-if="exercise.user_result">
                    {{ exercise.user_result.created_at | longFormat }}
                  </template>
                  <template v-else>
                    -
                  </template>
                </td>
                <td style="font-size: 15px;font-weight: 600">
                  <template>
                    {{ exercise.title || '' }}
                  </template>
                </td>
                <td class="text-center">
                  <v-icon
                    v-if="
                      exercise.user_result && exercise.user_result.is_checked
                    "
                    :color="
                      exercise.user_result && exercise.user_result.overdue
                        ? '#EE5252'
                        : '#5CC689'
                    "
                  >
                    {{
                      exercise.user_result && exercise.user_result.overdue
                        ? mdiClose
                        : mdiCheck
                    }}
                  </v-icon>
                  <span v-else>-</span>
                </td>
                <td
                  style="font-size: 15px;font-weight: 600;color: #9FA4B1"
                  class="text-center"
                >
                  <template>
                    {{
                      (exercise.user_result && exercise.user_result.attempts) ||
                        '-'
                    }}
                  </template>
                </td>
                <td
                  class="text-center pr-0"
                  :class="
                    exercise.user_result && exercise.user_result.is_checked
                      ? exercise.user_result && exercise.user_result.score > 0
                        ? 'success--text'
                        : 'red--text'
                      : undefined
                  "
                >
                  <span>
                    {{
                      exercise.user_result
                        ? exercise.user_result.is_checked
                          ? exercise.user_result.score > 0
                            ? exercise.user_result.score + '%'
                            : 'На доработке'
                          : '-'
                        : '-'
                    }}
                  </span>
                </td>
                <td class="text-right pr-0">
                  <v-btn
                    v-if="exercise.user_result"
                    elevation="0"
                    out
                    :ripple="false"
                    color="success"
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
      <EmptyPlaceholder v-else :text="'Пусто...'" />
    </v-row>
    <v-dialog v-model="showDialog" :transition="false">
      <v-card v-if="currentAnswerId >= 0" elevation="0">
        <v-form v-if="exercises && exercises[currentAnswerId]" class="pa-8">
          <p
            class="my-practicants-modal__title font-weight-bold mb-6"
            style="font-size: 22px"
          >
            Студент:
            {{ (student.first_name || '') + ' ' + (student.last_name || '') }}
          </p>
          <p class="my-practicants-modal__title">Задание</p>
          <div
            class="my-practicants-modal__content"
            v-html="decodeHTML(exercises[currentAnswerId].content)"
          ></div>
          <!-- <v-textarea
              outlined
              disabled
              placeholder="Нет ответа"
              :value="exercises[currentAnswerId].user_result && exercises[currentAnswerId].user_result.value || ''"
          ></v-textarea> -->
          <template
            v-if="
              exercises[currentAnswerId].answer_type === 'text' ||
                exercises[currentAnswerId].answer_type === 'compiler' ||
                exercises[currentAnswerId].answer_type === 'compiler_noj'
            "
          >
            <p class="my-practicants-modal__title mt-6">Ответ</p>
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
            <p class="my-practicants-modal__title mt-6">Прикрепленные файлы</p>
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
          <p class="my-practicants-modal__title mt-6">Комментарий</p>
          <v-textarea
            outlined
            placeholder="Напишите комментарий"
            :value="currentComment"
            @change="currentComment = $event"
            autocomplete="off"
          ></v-textarea>
          <div class="mb-4">
            <span class="my-practicants-modal__title mr-3">Оценка</span>
            <v-chip
              outlined
              :color="
                exercises[currentAnswerId].user_result &&
                exercises[currentAnswerId].user_result.overdue
                  ? '#EE5252'
                  : '#5CC689'
              "
              class="pl-2"
              style="font-size: 12px"
              small
            >
              <v-icon small class="mr-1">
                {{
                  exercises[currentAnswerId].user_result &&
                  exercises[currentAnswerId].user_result.overdue
                    ? mdiAlertCircleOutline
                    : mdiCheck
                }}
              </v-icon>
              {{
                exercises[currentAnswerId].user_result &&
                exercises[currentAnswerId].user_result.overdue
                  ? 'Сдан не в срок'
                  : 'Сдан в срок'
              }}
            </v-chip>
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
              color="#F16635"
              outlined
              elevation="0"
              class="text-capitalize px-sm-8 py-sm-6 mr-auto"
              style="font-weight: 600;"
              @click="changeScore(true)"
            >
              На доработку
            </v-btn>
            <v-btn
              :ripple="false"
              :disabled="currentScore_loading"
              color="#0BC4B8"
              elevation="0"
              class="text-capitalize white--text px-sm-8 py-sm-6"
              @click="changeScore()"
              >Оценить
            </v-btn>
            <v-btn
              :ripple="false"
              :disabled="currentScore_loading"
              color="#9FA4B1"
              elevation="0"
              class="text-capitalize white--text px-sm-8 py-sm-6 ml-5"
              @click="
                () => {
                  this.showDialog = false
                  this.errors = false
                }
              "
              >Отмена
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import highlight from '@/components/highlight.vue'
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import {
  mdiPaperclip,
  mdiAlertOutline,
  mdiCheck,
  mdiAlertCircleOutline,
  mdiClose,
} from '@mdi/js'
import { decodeHTML } from '@/helpers'

export default {
  name: 'TeacherStreamStudentChapterShow',
  components: {
    EmptyPlaceholder,
    highlight,
  },
  props: {
    group_id: [Number, String],
    student_id: [Number, String],
    chapter_id: [Number, String],
    column: String,
    order: String,
    page: Number,
  },
  data() {
    return {
      mdiAlertOutline,
      mdiCheck,
      mdiClose,
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
      chapter: '',
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
    this.fetchLessons().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: this.group.name,
          to: {
            name: 'StreamShow',
            params: {
              // module_id: this.courseModuleId,
              stream_id: this.group_id,
            },
            query: {
              type: 'lite',
              column: this.column || 'score',
              order: this.order || 'desc',
              page: this.page || 1,
            },
          },
          // action: () => {
          //   this.$router.go(-2);
          // },
          back: true,
        },
        {
          text:
            (this.student.first_name || '') +
            ' ' +
            (this.student.last_name || ''),
          to: {
            name: 'TeacherStreamStudentShow',
            params: {
              stream_id: this.group_id,
              student_id: this.student_id,
              column: this.column || 'score',
              order: this.order || 'desc',
              page: this.page || 1,
            },
          },
        },
        {
          text: this.chapter.title,
          disabled: true,
        },
      ])
    })
  },

  methods: {
    decodeHTML,
    async fetchLessons() {
      this.loading = true
      await this.$axios
        .get(
          `teacher/lite/streams/${this.group_id}/students/${this.student_id}/chapters/${this.chapter_id}`
        )
        .then((res) => {
          if (res && res.data) {
            // console.log(res.data)
            this.exercises = res.data.exercises
            this.student = res.data.user
            this.group = res.data.group
            this.chapter = res.data.chapter
            this.new_stream_id =
              (res.data.group && res.data.group.parent_id) || undefined
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    async changeScore(forRevision) {
      this.currentScore_loading = true
      let comment = this.currentComment
      let chapter_id = this.chapter_id
      let exercise_id = this.exercises[this.currentAnswerId].id
      let id = this.exercises[this.currentAnswerId].user_result.id
      let score = this.currentScore
      let user_id = this.student_id

      await this.$axios
        .post('teacher/save-score', {
          comment,
          chapter_id,
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
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  letter-spacing: 0.02em;

  /* Black */

  color: #171729;
}

.my-practicants-modal__content {
  padding: 12px 16px;
  max-height: 300px;
  border: 1px solid #171729;
  overflow-y: auto;
}
</style>
