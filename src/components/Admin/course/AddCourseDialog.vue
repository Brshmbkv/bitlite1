<template>
  <div class="add-dialog">
    <v-dialog v-model="dialog" @click:outside="closeDialog" max-width="700px">
      <v-form @submit.prevent="addCourse">
        <v-card class="px-3">
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4"
              >Добавление курса</span
            >
            <div class="ml-auto d-flex" style="height: 40px !important;">
              <p class="add-dialog__label-for-input mb-0 align-self-center">
                Порядок
              </p>
              <v-text-field
                v-model="courseOrder"
                required
                outlined
                type="number"
                dense
                class="add-dialog__v-text-field ml-3"
                style="max-width: 150px; height: 40px !important;"
                :error-messages="
                  addCourseErrors.hasOwnProperty('order')
                    ? addCourseErrors.order
                    : ''
                "
              >
              </v-text-field>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Название курса</p>
                <v-text-field
                  v-model="courseTitle"
                  required
                  outlined
                  dense
                  :error-messages="
                    addCourseErrors.hasOwnProperty('title')
                      ? addCourseErrors.title
                      : ''
                  "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Язык</p>
                <v-select
                  :items="languages"
                  v-model="courseLanguage"
                  item-text="value"
                  item-value="key"
                  :menu-props="{ bottom: true, offsetY: true }"
                  :loading="fields_loading"
                  dense
                  :color="'#4376FB'"
                  :item-color="'asdasdf'"
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                ></v-select>
              </v-col>
              <v-col cols="12" class="py-0">
                <p class="add-dialog__label-for-input">Описание курса</p>
                <v-textarea
                  v-model="courseDescription"
                  required
                  outlined
                  height="100"
                  no-resize
                  class="add-dialog__v-text-field"
                >
                </v-textarea>
              </v-col>
              <v-col cols="12" class="py-0">
                <p class="add-dialog__label-for-input">Список знании</p>
                <v-textarea
                  v-model="courseBenefits"
                  required
                  outlined
                  height="100"
                  no-resize
                  class="add-dialog__v-text-field"
                >
                </v-textarea>
              </v-col>
              <v-col cols="12" sm="4" class="py-0">
                <p class="add-dialog__label-for-input">Мин. очки</p>
                <v-text-field
                  v-model="minPoints"
                  type="number"
                  required
                  outlined
                  dense
                  :error-messages="
                    addCourseErrors.hasOwnProperty('min_points')
                      ? addCourseErrors.min_points
                      : ''
                  "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" class="py-0">
                <p class="add-dialog__label-for-input">Ссылка трейлера</p>
                <v-text-field
                  v-model="courseTrailer"
                  required
                  outlined
                  dense
                  :error-messages="
                    addCourseErrors.hasOwnProperty('trailer')
                      ? addCourseErrors.trailer
                      : ''
                  "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" class="py-0">
                <p class="add-dialog__label-for-input">Длительность</p>
                <v-text-field
                  v-model="courseDuration"
                  type="number"
                  required
                  outlined
                  dense
                  :error-messages="
                    addCourseErrors.hasOwnProperty('duration')
                      ? addCourseErrors.duration
                      : ''
                  "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Уровень</p>
                <v-select
                  :items="levels"
                  v-model="courseLevel"
                  item-text="value"
                  item-value="key"
                  :color="'#4376FB'"
                  :item-color="'asdasdf'"
                  :loading="fields_loading"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Статус</p>
                <v-select
                  :items="statuses"
                  v-model="courseStatus"
                  item-text="value"
                  item-value="key"
                  :color="'#4376FB'"
                  :item-color="'asdasdf'"
                  :loading="fields_loading"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end mr-4 pb-5">
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="
                !courseTitle ||
                  !courseOrder ||
                  !minPoints ||
                  !courseLevel ||
                  !courseStatus ||
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
              @click="closeDialog"
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
  name: 'AddCourseDialog',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    nextOrder: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      loading: false,
      fields_loading: false,
      addCourseErrors: [],
      mdiUnfoldMoreHorizontal,
      courseTitle: '',
      courseDescription: '',
      courseBenefits: '',
      courseOrder: '',
      courseLanguage: '',
      minPoints: '',
      courseTrailer: '',
      courseLevel: '',
      courseStatus: '',
      courseDuration: '',
      levels: undefined,
      languages: undefined,
      statuses: undefined,
    }
  },

  watch: {
    dialog: {
      immediate: true,
      handler(newValue) {
        if (newValue) this.fetchSelectField()
      },
    },
    nextOrder: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.courseOrder = this.nextOrder
        }
      },
    },
  },

  methods: {
    closeDialog() {
      this.addCourseErrors = []
      this.courseTitle = ''
      this.courseDescription = ''
      this.courseBenefits = ''
      this.courseOrder = ''
      this.courseLanguage = ''
      this.minPoints = ''
      this.courseTrailer = ''
      this.courseLevel = ''
      this.courseStatus = ''
      this.courseDuration = ''
      this.$emit('update:dialog', false)
    },
    async fetchSelectField() {
      this.fields_loading = true
      try {
        const res = await this.$axios.get('admin/courses/create')
        this.levels = res?.data?.level
        this.statuses = res?.data?.status
        this.languages = res?.data?.language
      } catch (e) {
        console.log(e)
      }
      this.fields_loading = false
    },
    async addCourse() {
      this.loading = true
      this.addCourseErrors = []
      await this.$axios
        .post('admin/courses', {
          title: this.courseTitle,
          description: this.courseDescription,
          min_points: this.minPoints,
          order: this.courseOrder,
          duration: this.courseDuration,
          level: this.courseLevel,
          status: this.courseStatus,
          features: this.courseBenefits,
          trailer: this.courseTrailer,
        })
        .then(() => {
          this.$emit('refresh')
          this.closeDialog()
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.addCourseErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
