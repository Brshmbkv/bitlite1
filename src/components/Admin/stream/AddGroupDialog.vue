<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      max-width="750px"
    >
      <v-form @submit.prevent="addGroup">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-6">{{ group_id ? 'Изменить' : 'Создать' }} группу</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Название</p>
                <v-text-field
                  v-model="group.name"
                  required
                  outlined
                  dense
                  :error-messages="
                      addGroupErrors.hasOwnProperty('name')
                        ? addGroupErrors.name
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Telegram chat (URL)</p>
                <v-text-field
                  v-model="group.telegram_chat"
                  required
                  outlined
                  dense
                  :error-messages="
                      addGroupErrors.hasOwnProperty('telegram_chat')
                        ? addGroupErrors.telegram_chat
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="3"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Мин. количество</p>
                <v-text-field
                  v-model="group.min_limit"
                  type="number"
                  required
                  outlined
                  dense
                  :error-messages="
                      addGroupErrors.hasOwnProperty('min_limit')
                        ? addGroupErrors.min_limit
                          : ''
                    "
                  class="add-dialog__v-text-field"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="3"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Макс. количество</p>
                <v-text-field
                  v-model="group.max_limit"
                  type="number"
                  required
                  outlined
                  dense
                  :error-messages="
                      addGroupErrors.hasOwnProperty('max_limit')
                        ? addGroupErrors.max_limit
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
              :disabled="!group.name || loading"
              :loading="loading"
              color="#3E77FF"
              type="submit"
              class="text-capitalize white--text px-sm-8 py-sm-6"
            >Сохранить
            </v-btn>
            <v-btn
              :ripple="false"
              :elevation="0"
              color="rgba(23, 23, 41, 0.08)"
              style="color: #5A6275; border: 1px solid rgba(23, 23, 41, 0.08);"
              class="text-capitalize px-sm-8 py-sm-6 ml-5"
              @click="closeDialog"
            >Отменить
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
  name: "AddGroupDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    stream_type: [String],
    stream_id: [Number, String],
    group_id: Number
  },
  data() {
    return {
      loading: false,
      addGroupErrors: [],
      mdiUnfoldMoreHorizontal,
      group: {
        name: '',
        telegram_chat: '',
        min_limit: '',
        max_limit: '',
      }
    }
  },

  watch: {
    group_id: {
      handler(newValue) {
        if(newValue) {
          this.fetchGroup()
        }
      },
      immediate: true
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:dialog', false)
      this.$emit('update:group_id', undefined)
      this.group = {  }
      this.addGroupErrors = []
    },

    async fetchGroup() {
      await this.$axios.get(`admin/groups/${this.group_id}`)
        .then(res => {
          this.group = res?.data
        })
        .catch(err => {
          throw new Error(err)
        })
    },

    async addGroup() {
      this.loading = true
      this.addGroupErrors = []
      await this.$axios.post('admin/groups', {
        name: this.group.name,
        telegram_chat: this.group.telegram_chat,
        min_limit: this.group.min_limit,
        max_limit: this.group.max_limit,
        type: this.stream_type,
        parent_id: this.stream_id,
        ...(this.group_id && { id: this.group_id })
      })
        .then(() => {
          this.closeDialog()
          this.$emit('update-groups')
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.addGroupErrors = err.response.data.errors
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
