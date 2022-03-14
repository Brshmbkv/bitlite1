<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      max-width="750px"
    >
      <v-form @submit.prevent="repeatEvent">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Повторить урок</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Выберите урок</p>
                <v-select
                  :items="events"
                  v-model="event"
                  item-text="title"
                  item-value="id"
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
              :disabled="!event || loading"
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
  name: "RepeatEventDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    events: {
      type: Array,
      default() {
        return []
      }
    },
  },

  data() {
    return {
      mdiUnfoldMoreHorizontal,
      repeat_date: undefined,
      event: undefined,
      loading: false,
    }
  },

  watch: {
    event: {
      handler(value) {
        let event_idx = this.events.findIndex(event => event.id === value)
        let inc = event_idx === (this.events.length-1) ? 0 : 1
        this.repeat_date = this.events[event_idx + inc]?.starts_at
      }
    },
    dialog: {
      immediate: true,
      handler(value) {
        if(value) {
          this.event = this.events?.length && this.events[0]?.id
        }
      }
    },
  },

  methods: {
    async repeatEvent() {
      this.loading = true
      this.error = ''
      await this.$axios.post('admin/events/repeat', {
        id: this.event,
        repeat_date: this.repeat_date
      })
        .then(() => {
          this.$emit('refresh')
          this.closeDialog()
        })
        .catch(err => {
          throw new Error(err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    closeDialog() {
      this.$emit('update:dialog', false)
      this.error = undefined
      this.event = undefined
      this.repeat_date = undefined
    }
  }
}
</script>
