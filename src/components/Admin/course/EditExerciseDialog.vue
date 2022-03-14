<template>
  <div class="add-dialog">
    <v-dialog
      v-if="exercise"
      v-model="dialog"
      @click:outside="$emit('close-dialog')"
      min-width="600px"
      max-width="1000px"
    >
      <v-form @submit.prevent="editExercise">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Редактирование задачи</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Title</p>
                <v-text-field
                  v-model="exercise.title"
                  required
                  outlined
                  dense
                  :error-messages="
                      editExerciseErrors.hasOwnProperty('title')
                        ? editExerciseErrors.title
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Условия задачи</p>
                <v-textarea
                  v-model="exercise.content"
                  required
                  outlined
                  height="100"
                  no-resize
                  class="add-dialog__v-text-field"
                >
                </v-textarea>
              </v-col>
              <v-col cols="12" class="py-4">
                <div v-html="exercise.content" style="border: 2px solid rgba(23, 23, 41, 0.08); border-radius: 7px" class="pa-3"></div>
              </v-col>
              <v-col
                cols="6"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Порядок</p>
                <v-text-field
                  v-model="exercise.order"
                  required
                  outlined
                  type="number"
                  dense
                  class="add-dialog__v-text-field"
                  :error-messages="
                      editExerciseErrors.hasOwnProperty('order')
                        ? editExerciseErrors.order
                          : ''
                    "
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Тип</p>
                <v-select
                  :items="types"
                  v-model="exercise.answer_type"
                  item-text="title"
                  item-value="value"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                  :error-messages="
                      editExerciseErrors.hasOwnProperty('answer_type')
                        ? editExerciseErrors.answer_type
                          : ''
                    "
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Уровень</p>
                <v-select
                  :items="levels"
                  v-model="exercise.level_coef"
                  item-text="title"
                  item-value="value"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                  :error-messages="
                      editExerciseErrors.hasOwnProperty('level_coef')
                        ? editExerciseErrors.level_coef
                          : ''
                    "
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions
            class="justify-end mr-4 pb-5"
          >
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="!exercise.title || !exercise.content || !exercise.answer_type || !exercise.level_coef|| !exercise.order || loading"
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
                  exercise = undefined
                  editExerciseErrors = []
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
  name: "EditExerciseDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    lesson_id: {
      type: [Number, String],
    },
    exercise_id: [Number, String],
  },
  data() {
    return {
      loading: false,
      editExerciseErrors: [],
      exercise: undefined,
      mdiUnfoldMoreHorizontal,
      types: [
        {
          title: 'Текстовый',
          value: 'text'
        },
        {
          title: 'Файловый',
          value: 'file'
        }
      ],
      levels: [
        {
          title: 'Легкий',
          value: '0.3'
        },
        {
          title: 'Средний',
          value: '0.5'
        },
        {
          title: 'Сложный',
          value: '1'
        }
      ]
    }
  },

  watch: {
    exercise_id: {
      handler(newValue, oldValue) {
        if(newValue > 0 && newValue !== oldValue) {
          this.fetchExerciseEdit()
        }
      },
      immediate: true
    }
  },

  methods: {
    async fetchExerciseEdit() {
      await this.$axios('admin/exercises/' + this.exercise_id + '/edit')
        .then(res => {
          if(res && res.data) {
            this.exercise = res.data
          }
        })
    },

    async editExercise() {
      this.loading = true
      this.editExerciseErrors = []
      await this.$axios.post('admin/exercises', {
        title: this.exercise.title,
        content: this.exercise.content,
        order: this.exercise.order,
        level_coef: this.exercise.level_coef,
        lesson_id: this.lesson_id,
        answer_type: this.exercise.answer_type,
        type_id: 2,
        id: this.exercise_id
      })
        .then(res => {
          if (res){
            this.$emit('close-dialog')
            this.$emit('update-exercises')
          }
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.editExerciseErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
