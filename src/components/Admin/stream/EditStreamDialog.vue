<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      v-if="stream"
      @click:outside="$emit('close-dialog')"
      max-width="700px"
    >
      <v-form @submit.prevent="editStream">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Редактирование потока</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Название</p>
                <v-text-field
                  v-model="stream.name"
                  required
                  outlined
                  dense
                  :error-messages="
                      editStreamErrors.hasOwnProperty('name')
                        ? editStreamErrors.name
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
                  v-model="stream.description"
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
                  v-model="stream.type"
                  item-text="title"
                  item-value="title"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                  :error-messages="
                      editStreamErrors.hasOwnProperty('type_id')
                        ? editStreamErrors.type_id
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
                  v-model="stream.min_limit"
                  type="number"
                  required
                  outlined
                  dense
                  :error-messages="
                      editStreamErrors.hasOwnProperty('min_limit')
                        ? editStreamErrors.min_limit
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
                  v-model="stream.max_limit"
                  type="number"
                  required
                  outlined
                  dense
                  :error-messages="
                      editStreamErrors.hasOwnProperty('max_limit')
                        ? editStreamErrors.max_limit
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
              :disabled="!stream.name || !stream.type || !stream.max_limit || !stream.min_limit || loading"
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
                  this.editStreamErrors = []
                  this.stream = undefined
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
  name: "EditStreamDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    stream_id: [Number, String],
    types: Array
  },
  data() {
    return {
      loading: false,
      editStreamErrors: [],
      mdiUnfoldMoreHorizontal,
      stream: undefined,
    }
  },

  watch: {
    dialog: {
      handler(newValue, oldValue) {
        if(newValue !== oldValue && newValue) {
          this.fetchStream()
        }
      },
      immediate: true
    }
  },

  methods: {
    async fetchStream() {
      // TODO Отловить ошибку
      await this.$axios.get(`admin/groups/${this.stream_id}/edit`)
        .then(res => {
          if(res && res.data) {
            this.stream = res.data
          }
        })
        .catch(err => {
          console.log(err)
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Возникла ошибка!',
            color: 'red'
          })
        })
    },

    async editStream() {
      this.loading = true
      this.editStreamErrors = []
      await this.$axios.post('admin/streams', {
        name: this.stream && this.stream.name,
        description: this.stream && this.stream.description,
        min_limit: this.stream && this.stream.min_limit,
        max_limit: this.stream && this.stream.max_limit,
        type: this.stream && this.stream.type,
        id: this.stream && this.stream.id
      })
        .then(res => {
          if (res){
            this.$emit('close-dialog')
            this.$emit('update-streams')
            this.stream = undefined
          }
        })
        .catch(err => {
          this.editStreamErrors = err
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
