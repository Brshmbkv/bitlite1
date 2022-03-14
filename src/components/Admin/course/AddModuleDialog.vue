<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      max-width="700px"
    >
      <v-form @submit.prevent="addModule">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Добавление модуля</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Название модуля</p>
                <v-text-field
                  v-model="moduleName"
                  required
                  outlined
                  dense
                  :error-messages="
                      addModuleErrors.hasOwnProperty('title')
                        ? addModuleErrors.title
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
                  v-model="moduleDescription"
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
                  v-model="modulePrice"
                  required
                  outlined
                  dense
                  type="number"
                  :error-messages="
                      addModuleErrors.hasOwnProperty('price')
                        ? addModuleErrors.price.length > 1
                          ? addModuleErrors.price[1] : addModuleErrors.price
                            : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <p class="add-dialog__label-for-input">Макс. очки</p>
                <v-text-field
                  v-model="moduleMaxPoints"
                  required
                  outlined
                  type="number"
                  dense
                  :error-messages="
                      addModuleErrors.hasOwnProperty('max_points')
                        ? addModuleErrors.max_points.length > 1
                          ? addModuleErrors.max_points[0] : addModuleErrors.max_points
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
                  v-model="moduleOrder"
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
                  v-model="moduleType"
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
              :disabled="!moduleName || !modulePrice || !moduleMaxPoints || !moduleType || loading"
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
  name: "AddModuleDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    nextOrder: {
      type: Number,
    },
    course_id: {
      type: Number
    },
    module_types: {
      type: Array
    }
  },
  data() {
    return {
      loading: false,
      addModuleErrors: [],
      mdiUnfoldMoreHorizontal,
      moduleName: '',
      modulePrice: '',
      moduleMaxPoints: '',
      moduleOrder: '',
      moduleDescription: '',
      moduleType: 0,
    }
  },

  watch: {
    nextOrder: {
      handler(newValue, oldValue) {
        if(newValue !== oldValue) {
          this.moduleOrder = this.nextOrder
        }
      },
      immediate: true
    }
  },

  methods: {
    closeDialog() {
      this.moduleName = ''
      this.modulePrice = ''
      this.moduleMaxPoints = ''
      this.moduleOrder = ''
      this.moduleDescription = ''
      this.moduleType = 0
      this.addModuleErrors = []
      this.$emit('update:dialog', false)
    },

    async addModule() {
      this.loading = true
      this.addModuleErrors = []
      await this.$axios.post('admin/modules', {
        title: this.moduleName,
        description: this.moduleDescription,
        price: this.modulePrice,
        max_points: this.moduleMaxPoints,
        course_id: this.course_id,
        order: this.moduleOrder,
        type: this.moduleType,
      })
        .then(() => {
          this.$emit('update-modules')
          this.closeDialog()
        })
        .catch(err => {
          if(err.response && err.response.data && err.response.data.errors) {
            this.addModuleErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
