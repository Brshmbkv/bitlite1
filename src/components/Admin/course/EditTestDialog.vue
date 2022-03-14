<template>
  <div class="add-dialog">
    <v-dialog
      v-if="test"
      v-model="dialog"
      @click:outside="$emit('close-dialog')"
      max-width="700px"
    >
      <v-form @submit.prevent="editTest">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Редактирование теста</span>
            <div
              class="ml-auto d-flex"
              style="height: 40px !important;"
            >
              <p class="add-dialog__label-for-input mb-0 align-self-center">Порядок</p>
              <v-text-field
                v-model="test.order"
                required
                outlined
                type="number"
                dense
                class="add-dialog__v-text-field ml-3"
                style="max-width: 150px; height: 40px !important;"
                :error-messages="
                      editTestErrors.hasOwnProperty('order')
                        ? editTestErrors.order
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
                <p class="add-dialog__label-for-input">Название теста</p>
                <v-text-field
                  v-model="test.title"
                  required
                  outlined
                  dense
                  :error-messages="
                      editTestErrors.hasOwnProperty('title')
                        ? editTestErrors.title
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <!--              <v-col-->
              <!--                cols="12"-->
              <!--                class="py-0"-->
              <!--              >-->
              <!--                <p class="add-dialog__label-for-input">Описание главы</p>-->
              <!--                <v-textarea-->
              <!--                  v-model="chapterDescription"-->
              <!--                  required-->
              <!--                  outlined-->
              <!--                  height="100"-->
              <!--                  no-resize-->
              <!--                  class="add-dialog__v-text-field"-->
              <!--                >-->
              <!--                </v-textarea>-->
              <!--              </v-col>-->
            </v-row>
          </v-card-text>
          <v-card-actions
            class="justify-end mr-4 pb-5"
          >
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="!test.title || !test.order || loading"
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
                  this.editTestErrors = []

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
  name: "EditTestDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    testable_id: {
      type: [Number, String]
    },
    test: [Object]
  },
  data() {
    return {
      loading: false,
      editTestErrors: [],
      mdiUnfoldMoreHorizontal,
    }
  },

  methods: {
    async editTest() {
      this.loading = true
      this.editTestErrors = []
      await this.$axios.post('admin/tests', {
        order: this.test && this.test.order,
        title: this.test && this.test.title,
        testable_id: this.testable_id,
        id: this.test && this.test.id
      })
        .then(res => {
          if (res){
            this.$emit('close-dialog')
            this.$emit('update-tests')
          }
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.editTestErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
