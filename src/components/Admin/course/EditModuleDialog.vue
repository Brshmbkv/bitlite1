<template>
  <div class="add-dialog">
    <v-dialog
      v-if="module"
      v-model="dialog"
      @click:outside="closeDialog"
      max-width="700px"
    >
      <v-form @submit.prevent="editModule">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Редактирование модуля</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Название модуля</p>
                <v-text-field
                  v-model="module.title"
                  required
                  outlined
                  dense
                  :error-messages="
                      editModuleErrors.hasOwnProperty('title')
                        ? editModuleErrors.title
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Описание модуля</p>
                <v-textarea
                  v-model="module.description"
                  required
                  outlined
                  height="100"
                  no-resize
                  class="add-dialog__v-text-field"
                >
                </v-textarea>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Стоимость</p>
                <v-text-field
                  v-model="module.price"
                  required
                  outlined
                  dense
                  type="number"
                  :error-messages="
                      editModuleErrors.hasOwnProperty('price')
                        ? editModuleErrors.price.length > 1
                          ? editModuleErrors.price[1] : editModuleErrors.price
                            : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Макс. очки</p>
                <v-text-field
                  v-model="module.max_points"
                  required
                  outlined
                  type="number"
                  dense
                  :error-messages="
                      editModuleErrors.hasOwnProperty('max_points')
                        ? editModuleErrors.max_points.length > 1
                          ? editModuleErrors.max_points[0] : editModuleErrors.max_points
                            : ''
                    "
                  class="add-dialog__v-text-field"
                >
                </v-text-field>
              </v-col>
              <v-col
                cols="6"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Порядок</p>
                <v-text-field
                  v-model="module.order"
                  required
                  outlined
                  type="number"
                  dense
                  class="add-dialog__v-text-field"
                >
                </v-text-field>
              </v-col>
              <v-col
                cols="6"
                class="py-0 align-self-center"
              >
                <p class="add-dialog__label-for-input">Тип</p>
                <v-select
                  :items="module_types"
                  v-model="module.type"
                  item-text="value"
                  item-value="key"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
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
              :disabled="!module.title || !(module.price > -1) || !module.max_points || loading"
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
  name: "EditModuleDialog",
  props: {
    dialog: Boolean,
    module_id: Number,
    course_id: Number,
    module_types: Array,
  },
  data() {
    return {
      loading: false,
      editModuleErrors: [],
      module: undefined,
      mdiUnfoldMoreHorizontal,
    }
  },

  watch: {
    dialog: {
      handler(newValue) {
        if (newValue)
          this.fetchModuleEdit()
      },
      immediate: true
    }
  },

  methods: {
    async fetchModuleEdit() {
      await this.$axios('admin/modules/' + this.module_id + '/edit')
        .then(res => {
          if (res && res.data) {
            this.module = res.data
          }
        })
    },

    async editModule() {
      this.loading = true
      this.editModuleErrors = []
      await this.$axios.post('admin/modules', {
        title: this.module.title,
        description: this.module.description,
        price: this.module.price,
        max_points: this.module.max_points,
        course_id: this.course_id,
        order: this.module.order,
        id: this.module.id,
        type: this.module.type
      })
        .then(() => {
          this.$emit('update-modules')
          this.closeDialog()
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Успешно!',
            color: 'success'
          })
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.editModuleErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    closeDialog() {
      this.module = undefined
      this.editModuleErrors = []
      this.$emit('update:dialog', false)
    }
  }
}
</script>
