<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="$emit('close-dialog')"
      max-width="700px"
    >
      <v-form @submit.prevent="addStream">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Создание потока</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Название</p>
                <v-text-field
                  v-model="streamTitle"
                  required
                  outlined
                  dense
                  :error-messages="
                      addStreamErrors.hasOwnProperty('title')
                        ? addStreamErrors.title
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Описание</p>
                <v-textarea
                  v-model="streamDescription"
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
                md="4"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Тип</p>
                <v-select
                  :items="types"
                  v-model="streamType"
                  item-text="title"
                  item-value="title"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                  :error-messages="
                      addStreamErrors.hasOwnProperty('type_id')
                        ? addStreamErrors.type_id
                          : ''
                    "
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Мин. количество</p>
                <v-text-field
                  v-model="streamMin"
                  type="number"
                  required
                  outlined
                  dense
                  :error-messages="
                      addStreamErrors.hasOwnProperty('title')
                        ? addStreamErrors.title
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="4"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Макс. количество</p>
                <v-text-field
                  v-model="streamMax"
                  type="number"
                  required
                  outlined
                  dense
                  :error-messages="
                      addStreamErrors.hasOwnProperty('title')
                        ? addStreamErrors.title
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions
            class="justify-end mr-4 pb-5"
          >
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="!streamTitle || !streamType || !streamMax || !streamMin || loading"
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
                  this.addStreamErrors = []
                  this.streamTitle = ''
                  this.streamDescription = ''
                  this.streamType = ''
                  this.streamMin = ''
                  this.streamMax = ''
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
  name: "AddStreamDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    types: Array
  },
  data() {
    return {
      loading: false,
      addStreamErrors: [],
      mdiUnfoldMoreHorizontal,
      streamTitle: '',
      streamDescription: '',
      streamType: '',
      streamMin: '',
      streamMax: '',
    }
  },

  methods: {
    async addStream() {
      this.loading = true
      this.addStreamErrors = []
      await this.$axios.post('admin/streams', {
        name: this.streamTitle,
        description: this.chapterDescription,
        order: this.chapterOrder,
        min_limit: this.streamMin,
        max_limit: this.streamMax,
        type: this.streamType,
      })
        .then(res => {
          if (res){
            this.$emit('close-dialog')
            this.$emit('update-streams')
            this.streamTitle = ''
            this.streamDescription = ''
            this.streamType = ''
            this.streamMin = ''
            this.streamMax = ''
          }
        })
        .catch(err => {
          this.addStreamErrors = err 
            && err.response 
            && err.response.data 
            && err.response.data.errors 
            || undefined
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
