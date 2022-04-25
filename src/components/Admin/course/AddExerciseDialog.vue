<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="$emit('close-dialog')"
      max-width="700px"
    >
      <v-form @submit.prevent="addExercise">
        <v-card class="px-3">
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4"
              >Добавление задачи</span
            >
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="py-0">
                <p class="add-dialog__label-for-input">Title</p>
                <v-text-field
                  v-model="exerciseTitle"
                  required
                  outlined
                  color="#4376FB"
                  dense
                  :error-messages="
                    addExerciseErrors.hasOwnProperty('title')
                      ? addExerciseErrors.title
                      : ''
                  "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <p class="add-dialog__label-for-input">Условаия задачи</p>
                <v-textarea
                  v-model="exerciseContent"
                  color="#4376FB"
                  required
                  outlined
                  height="100"
                  no-resize
                  class="add-dialog__v-text-field"
                >
                </v-textarea>
              </v-col>
              <v-col cols="6" class="py-0">
                <p class="add-dialog__label-for-input">Порядок</p>
                <v-text-field
                  v-model="exerciseOrder"
                  required
                  color="#4376FB"
                  outlined
                  type="number"
                  dense
                  class="add-dialog__v-text-field"
                  :error-messages="
                    addExerciseErrors.hasOwnProperty('order')
                      ? addExerciseErrors.order
                      : ''
                  "
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Тип</p>
                <v-select
                  :items="types"
                  v-model="exerciseType"
                  item-text="title"
                  item-value="value"
                  item-color="eprimary"
                  color="eprimary"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                  :error-messages="
                    addExerciseErrors.hasOwnProperty('type_id')
                      ? addExerciseErrors.type_id
                      : ''
                  "
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Уровень</p>
                <v-select
                  :items="levels"
                  v-model="exerciseLevel"
                  item-text="title"
                  item-color="eprimary"
                  color="eprimary"
                  item-value="value"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                  :error-messages="
                    addExerciseErrors.hasOwnProperty('level_coef')
                      ? addExerciseErrors.level_coef
                      : ''
                  "
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end mr-4 pb-5">
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="
                !exerciseTitle ||
                  !exerciseContent ||
                  !exerciseType ||
                  !exerciseLevel ||
                  !exerciseOrder ||
                  loading
              "
              :loading="loading"
              color="#4376FB"
              type="submit"
              class="text-capitalize white--text px-sm-8 py-sm-6"
              >Сохранить
            </v-btn>
            <v-btn
              :ripple="false"
              :elevation="0"
              color="#9FA4B1"
              class="text-capitalize white--text px-sm-8 py-sm-6 ml-5"
              @click="
                () => {
                  $emit('close-dialog')
                  addExerciseErrors = []
                }
              "
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
  name: 'AddExerciseDialog',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    nextOrder: {
      type: Number,
    },
    lesson_id: {
      type: [Number, String],
    },
  },
  data() {
    return {
      loading: false,
      addExerciseErrors: [],
      mdiUnfoldMoreHorizontal,
      exerciseTitle: undefined,
      exerciseContent: undefined,
      exerciseOrder: undefined,
      exerciseType: 'text',
      exerciseLevel: 0.3,
      types: [
        {
          title: 'Текстовый',
          value: 'text',
        },
        {
          title: 'Файловый',
          value: 'file',
        },
      ],
      levels: [
        {
          title: 'Легкий',
          value: 0.3,
        },
        {
          title: 'Средний',
          value: 0.5,
        },
        {
          title: 'Сложный',
          value: 1,
        },
      ],
    }
  },

  watch: {
    nextOrder: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.exerciseOrder = this.nextOrder
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.exerciseOrder = this.nextOrder
  },

  methods: {
    async addExercise() {
      this.loading = true
      this.addExerciseErrors = []
      await this.$axios
        .post('admin/exercises', {
          title: this.exerciseTitle,
          content: this.exerciseContent,
          order: this.exerciseOrder,
          level_coef: this.exerciseLevel,
          lesson_id: this.lesson_id,
          answer_type: this.exerciseType,
          type_id: 2,
        })
        .then(() => {
          this.$emit('close-dialog')
          this.$emit('update-exercises')
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.addExerciseErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
