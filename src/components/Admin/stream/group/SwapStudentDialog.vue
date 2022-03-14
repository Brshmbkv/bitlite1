<template>
  <div class="add-dialog">
    <v-dialog
      v-model="value"
      max-width="600px"
      @click:outside="closeDialog"
    >
      <v-form @submit.prevent="swapStudent">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-6">Переместить студента</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Выберите поток:</p>
                <v-select
                  :items="streams"
                  v-model="stream_id"
                  item-text="name"
                  item-value="id"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                />
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Выберите группу:</p>
                <v-select
                  :items="groups"
                  v-model="group_id"
                  item-text="name"
                  item-value="id"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                  :error-messages="swapStudentErrors['new_group_id'] || ''"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions
            class="justify-end mr-4 pb-5"
          >
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="!group_id || loading"
              :loading="loading"
              color="#0BC3B8"
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
  name: "SwapStudentDialog",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    streamId: Number,
    userId: Number
  },
  data() {
    return {
      mdiUnfoldMoreHorizontal,
      loading: false,
      stream_id: undefined,
      streams: [],
      group_id: undefined,
      groups: [],
      swapStudentErrors: []
    }
  },
  // computed: {
  //   groups() {
  //     return this.streams?.find(stream => stream.id === this.stream_id)?.children || []
  //   }
  // },
  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if(newValue && this.streamId) this.fetchStreamsAndGroups()
      }
    },
    stream_id() {
      this.groups = this.streams?.find(stream => stream.id === this.stream_id)?.children || []
      this.group_id = this.groups?.[0]?.id
    }
  },
  methods: {
    closeDialog() {
      this.streams = []
      this.stream_id = undefined
      this.group_id = undefined
      this.$emit('update:value', false)
    },
    async fetchStreamsAndGroups() {
      try {
        const res = await this.$axios.get(`admin/streams/${this.streamId}/get-same`)
        this.streams = res?.data || []
      } catch(e) {
        console.log(e)
      }
    },
    async swapStudent() {
      this.loading = true
      try {
        const res = await this.$axios.post(`admin/groups/swap-student`, {
          user_id: this.userId,
          new_group_id: this.group_id,
          old_group_id: this.$route.params.group_id
        })
        let name = `${res?.data?.data?.first_name} ${res?.data?.data?.last_name}`
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: `${name} успешно перемещен!`,
          color: 'success'
        }).then(() => {
          this.closeDialog()
          this.$emit('refresh')
        })
      } catch(err) {
        if (err.response && err.response.data && err.response.data.errors) {
          this.swapStudentErrors = err.response.data.errors
        }
      }
      this.loading = false
    },
  }
}
</script>
