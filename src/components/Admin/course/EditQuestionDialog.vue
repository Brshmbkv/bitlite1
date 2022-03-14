<template>
  <div class="add-dialog">
    <v-dialog
      v-if="question"
      v-model="dialog"
      @click:outside="$emit('close-dialog')"
      max-width="700px"
    >
      <v-form @submit.prevent="storeQuestion">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Редактирование вопроса</span>
            <div
              class="ml-auto d-flex"
              style="height: 40px !important;"
            >
              <p class="add-dialog__label-for-input mb-0 align-self-center">Порядок</p>
              <v-text-field
                v-model="question.pivot.order"
                required
                outlined
                type="number"
                dense
                class="add-dialog__v-text-field ml-3"
                style="max-width: 150px; height: 40px !important;"
                :error-messages="
                      editQuestionErrors.hasOwnProperty('order')
                        ? editQuestionErrors.order
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
                  v-model="question.text"
                  required
                  outlined
                  height="100"
                  no-resize
                  :error-messages="
                      editQuestionErrors.hasOwnProperty('text')
                        ? editQuestionErrors.text
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
                  v-model="question.hint"
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
                      :value="option.value"
                      @change="option.value = $event"
                      required
                      outlined
                      dense
                      class="add-dialog__v-text-field mr-5 my-3"
                      style="height: 40px !important;"
                      :error-messages="
                      editQuestionErrors.hasOwnProperty('order')
                        ? editQuestionErrors.order
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
                  @click="addOption"
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
              :disabled="!question.text || !question.pivot.order || loading"
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
                  editQuestionErrors = []
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
  name: "EditQuestionDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    test_id: {
      type: [Number, String]
    },
    question_id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      loading: false,
      editQuestionErrors: [],
      mdiUnfoldMoreHorizontal,
      questionRightOptionID: undefined,
      question: undefined,
      options: [],
    }
  },

  watch: {
    question_id: {
      handler(newValue, oldValue) {
        if(newValue > 0 && newValue !== oldValue) {
          this.fetchQuestion()
        }
      },
      immediate: true
    }
  },

  methods: {
    async fetchQuestion() {
      await this.$axios.get('admin/tests/' + this.test_id + '/questions/' + this.question_id + '/edit')
        .then(res => {
          if (res && res.data) {
            this.question = res.data
            this.options = res.data.options
            this.questionRightOptionID = res.data.right_option_id
          }
        })
    },

    async addOption() {
      await this.$axios.post('admin/options/store', {
        question_id: this.question_id,
        value: '-'
      })
        .then(res => {
          if (res && res.data) {
            this.options.push({
              id: res.data.id,
              value: ''
            })
          }
        })
    },

    async saveOption(option_id, value) {
      await this.$axios.post('admin/options/store', {
        question_id: this.question_id,
        value: value,
        id: option_id
      })
        .then((res) => {
          // TODO Сделать здесь что-то
          if (res && res.data) {
            console.log(res.data)
          }
        })
    },

    async storeQuestion() {
      this.loading = true
      this.editQuestionErrors = []
      this.options.forEach(opt => {
        this.saveOption(opt.id, opt.value)
      })
      await this.$axios.post('admin/tests/' + this.test_id + '/questions', {
        order: this.question.pivot.order,
        text: this.question.text,
        hint: this.question.hint,
        weight: 1,
        id: this.question_id,
        right_option_id: this.questionRightOptionID
      })
        .then(res => {
          if (res){
            this.$emit('close-dialog')
            this.$emit('update-questions')
          }
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.editQuestionErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
