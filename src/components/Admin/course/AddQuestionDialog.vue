<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="$emit('close-dialog')"
      max-width="700px"
    >
      <v-form @submit.prevent="storeQuestion">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Добавление вопроса</span>
            <div
              class="ml-auto d-flex"
              style="height: 40px !important;"
            >
              <p class="add-dialog__label-for-input mb-0 align-self-center">Порядок</p>
              <v-text-field
                v-model="questionOrder"
                required
                outlined
                type="number"
                dense
                class="add-dialog__v-text-field ml-3"
                style="max-width: 150px; height: 40px !important;"
                :error-messages="
                      addQuestionErrors.hasOwnProperty('order')
                        ? addQuestionErrors.order
                          : ''
                    "
              >
              </v-text-field>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Название вопроса и описание</p>
                <v-textarea
                  v-model="questionText"
                  required
                  outlined
                  height="100"
                  no-resize
                  :error-messages="
                      addQuestionErrors.hasOwnProperty('text')
                        ? addQuestionErrors.text
                          : ''
                    "
                  class="add-dialog__v-text-field"
                >
                </v-textarea>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Подсказка</p>
                <v-textarea
                  v-model="questionHint"
                  required
                  outlined
                  height="100"
                  no-resize
                  class="add-dialog__v-text-field"
                >
                </v-textarea>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Варианты</p>
                <v-radio-group
                  v-model="questionRightOptionID"
                >
                  <div
                    class="d-flex"
                    v-for="option in options"
                    :key="option.id"
                  >
                    <v-text-field
                      :value="option.text"
                      @change="option.text = $event"
                      required
                      outlined
                      dense
                      class="add-dialog__v-text-field mr-5 my-3"
                      style="height: 40px !important;"
                      :error-messages="
                      addQuestionErrors.hasOwnProperty('options')
                        ? addQuestionErrors.options
                          : ''
                    "
                    >
                    </v-text-field>
                    <v-radio
                      class="ml-auto select-option__radio"
                      :label="'Правильный ответ'"
                      :value="option.id"
                      :ripple="false"
                      :key="option.id"
                    ></v-radio>
                  </div>
                </v-radio-group>
                <v-btn
                  class="mt-3 text-capitalize"
                  elevation="0"
                  :ripple="false"
                  style="color: white !important;"
                  :color="'#0ACCDA'"
                  @click="addQuestion"
                >
                  Добавить вариант
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions
            class="justify-end mr-4 pb-5"
          >
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="!questionText || !questionOrder || loading"
              :loading="loading"
              color="#0BC4B8"
              type="submit"
              class="text-capitalize white--text px-sm-8 py-sm-6"
            >Сохранить
            </v-btn>
            <v-btn
              :ripple="false"
              :elevation="0"
              color="#9FA4B1"
              class="text-capitalize white--text px-sm-8 py-sm-6 ml-5"
              @click="() => {
                  $emit('close-dialog')
                  addQuestionErrors = []
                  questionText = ''
                  questionOrder = nextOrder
                }"
            >Отмена
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { mdiUnfoldMoreHorizontal } from '@mdi/js'
  

export default {
  name: "AddQuestionDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    nextOrder: {
      type: Number,
      default: -1,
    },
    test_id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      loading: false,
      addQuestionErrors: [],
      mdiUnfoldMoreHorizontal,
      questionRightOptionID: undefined,
      questionText: '',
      questionOrder: '',
      questionHint: '',
      question_id: undefined,
      options: []
    }
  },

  watch: {
    nextOrder: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.questionOrder = this.nextOrder
        }
      },
      immediate: true
    }
  },

  methods: {
    async addOption() {
      await this.$axios.post('admin/options/store', {
        question_id: this.question_id,
        value: '-'
      })
        .then(res => {
          if (res && res.data) {
            this.options.push({
              id: res.data.id,
              text: ''
            })
          }
        })
    },

    async saveOption(option_id, text) {
      await this.$axios.post('admin/options/store', {
        question_id: this.question_id,
        value: text,
        id: option_id
      })
        .then(res => {
          if (res && res.data) {
            console.log(res.data)
          }
        })
    },

    async addQuestion() {
      await this.$axios.post('admin/tests/' + this.test_id + '/questions', {
        text: this.questionText,
        hint: this.questionHint,
        order: this.questionOrder,
        weight: 1,
        id: this.question_id && this.question_id
      })
        .then(res => {
          if (res && res.data) {
            if(!this.question_id) {
              this.question_id = res.data.id
              this.addOption()
            } else {
              this.addOption()
            }
          }
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.addQuestionErrors = err.response.data.errors
          }
        })
    },

    async storeQuestion() {
      this.loading = true
      this.addQuestionErrors = []
      this.options.forEach(q => {
        this.saveOption(q.id, q.text)
      })
      await this.$axios.post('admin/tests/' + this.test_id + '/questions', {
        order: this.questionOrder,
        text: this.questionText,
        hint: this.questionHint,
        weight: 1,
        id: this.question_id,
        right_option_id: this.questionRightOptionID
      })
        .then(() => {
          this.addQuestionErrors = []
          this.questionText = ''
          this.questionOrder = this.nextOrder
          this.$emit('close-dialog')
          this.$emit('update-questions')
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.addQuestionErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
