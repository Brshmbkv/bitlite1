<template>
  <div class="add-dialog">
    <v-dialog
      v-if="chapter"
      v-model="dialog"
      @click:outside="$emit('close-dialog')"
      max-width="700px"
    >
      <v-form @submit.prevent="editChapter">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Редактирование главы</span>
            <div
              class="ml-auto d-flex"
              style="height: 40px !important;"
            >
              <p class="add-dialog__label-for-input mb-0 align-self-center">Порядок</p>
              <v-text-field
                v-model="chapter.order"
                required
                outlined
                type="number"
                dense
                class="add-dialog__v-text-field ml-3"
                style="max-width: 150px; height: 40px !important;"
                :error-messages="
                      editChapterErrors.hasOwnProperty('order')
                        ? editChapterErrors.order
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
                <p class="add-dialog__label-for-input">Название главы</p>
                <v-text-field
                  v-model="chapter.title"
                  required
                  outlined
                  dense
                  :error-messages="
                      editChapterErrors.hasOwnProperty('title')
                        ? editChapterErrors.title
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Описание главы</p>
                <v-textarea
                  v-model="chapter.description"
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
          <v-card-actions
            class="justify-end mr-4 pb-5"
          >
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="!chapter.title || !chapter.order || loading"
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
                  chapter = undefined
                  editChapterErrors = []
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
  name: "EditChapterDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    course_module_id: [Number, String],
    chapter_id: {
      type: [Number, String]
    }
  },
  data() {
    return {
      editChapterErrors: [],
      chapter: undefined,
      mdiUnfoldMoreHorizontal,
      loading: false,
    }
  },

  watch: {
    chapter_id: {
      handler(newValue, oldValue) {
        if(newValue > 0 && newValue !== oldValue) {
          this.fetchChapterEdit()
        }
      },
      immediate: true
    }
  },

  methods: {
    async fetchChapterEdit() {
      await this.$axios('admin/chapters/' + this.chapter_id + '/edit')
        .then(res => {
          if (res && res.data) {
            this.chapter = res.data
          }
        })
    },

    async editChapter() {
      this.loading = true
      this.editChapterErrors = []
      await this.$axios.post('admin/chapters', {
        title: this.chapter.title,
        description: this.chapter.description,
        course_module_id: this.course_module_id,
        order: this.chapter.order,
        id: this.chapter.id
      })
        .then(res => {
          if(res) {
            this.$emit('close-dialog')
            this.$emit('update-chapters')
          }
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.editChapterErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
