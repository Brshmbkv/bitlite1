<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="$emit('close-dialog')"
      max-width="700px"
    >
      <v-form @submit.prevent="addChapter">
        <v-card class="px-3">
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4"
              >Добавление главы</span
            >
            <div class="ml-auto d-flex" style="height: 40px !important;">
              <p class="add-dialog__label-for-input mb-0 align-self-center">
                Порядок
              </p>
              <v-text-field
                v-model="chapterOrder"
                required
                outlined
                type="number"
                dense
                class="add-dialog__v-text-field ml-3"
                style="max-width: 150px; height: 40px !important;"
                :error-messages="
                  addChapterErrors.hasOwnProperty('order')
                    ? addChapterErrors.order
                    : ''
                "
              >
              </v-text-field>
            </div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="py-0">
                <p class="add-dialog__label-for-input">Название главы</p>
                <v-text-field
                  v-model="chapterTitle"
                  required
                  outlined
                  dense
                  :error-messages="
                    addChapterErrors.hasOwnProperty('title')
                      ? addChapterErrors.title
                      : ''
                  "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="py-0">
                <p class="add-dialog__label-for-input">Описание главы</p>
                <v-textarea
                  v-model="chapterDescription"
                  required
                  outlined
                  height="100"
                  no-resize
                  class="add-dialog__v-text-field"
                >
                </v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end mr-4 pb-5">
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="!chapterTitle || !chapterOrder || loading"
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
                  this.addChapterErrors = []
                  this.chapterTitle = ''
                  this.chapterDescription = ''
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
  name: 'AddChapterDialog',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    nextOrder: {
      type: Number,
      default: -1,
    },
    course_module_id: {
      type: [Number, String],
    },
  },
  data() {
    return {
      loading: false,
      addChapterErrors: [],
      mdiUnfoldMoreHorizontal,
      chapterTitle: '',
      chapterDescription: '',
      chapterOrder: '',
    }
  },

  watch: {
    nextOrder: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.chapterOrder = this.nextOrder
        }
      },
      immediate: true,
    },
  },

  methods: {
    async addChapter() {
      this.loading = true
      this.addChapterErrors = []
      await this.$axios
        .post('admin/chapters', {
          title: this.chapterTitle,
          description: this.chapterDescription,
          course_module_id: this.course_module_id,
          order: this.chapterOrder,
        })
        .then(() => {
          this.$emit('close-dialog')
          this.$emit('update-chapters')
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.addChapterErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
