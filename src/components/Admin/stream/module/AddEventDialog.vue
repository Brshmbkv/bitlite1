<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      @keydown.esc="closeDialog"
      max-width="700px"
    >
      <v-form @submit.prevent="addEvent">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">{{ event ? 'Редактировать урок' : 'Добавить урок' }}</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Начало урока</p>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="starts_at"
                  transition="scale-y-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="starts_at"
                      required
                      outlined
                      readonly
                      dense
                      placeholder="Укажите дату"
                      class="add-dialog__v-text-field purchase-date--v-text-field"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <template v-slot:append>
                        <v-icon
                          :color="'#171729'"
                          size="20"
                        >
                          {{ mdiCalendarBlankOutline }}
                        </v-icon>
                      </template>
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="starts_at"
                    no-title
                    :first-day-of-week="1"
                    scrollable
                    locale="ru-RU"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="menu = false"
                    >
                      Отмена
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menu.save(starts_at)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">URL</p>
                <v-text-field
                  v-model="url"
                  required
                  outlined
                  dense
                  :error-messages="
                      addEventErrors.hasOwnProperty('live_url')
                        ? addEventErrors.live_url
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
                <p class="add-dialog__label-for-input">Глава</p>
                <v-select
                  :items="chapters"
                  v-model="chapter_id"
                  item-text="title"
                  item-value="id"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                  :error-messages="
                      addEventErrors.hasOwnProperty('chapter_id')
                        ? addEventErrors.chapter_id
                          : ''
                    "
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Практикант</p>
                <v-select
                  :items="lectors"
                  v-model="lector_id"
                  item-value="id"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                  :error-messages="
                      addEventErrors.hasOwnProperty('lector_id')
                        ? addEventErrors.lector_id
                          : ''
                    "
                >
                  <template v-slot:item="{ item }">
                    <span>{{ `${item.first_name || ''} ${item.last_name || ''}` }}</span>
                  </template>
                  <template v-slot:selection="{ item }">
                    <span>{{ `${item.first_name || ''} ${item.last_name || ''}` }}</span>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions
            class="justify-end mr-4 pb-5"
          >
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="!starts_at || !chapter_id || !lector_id || loading"
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
import { mdiUnfoldMoreHorizontal, mdiCalendarBlankOutline } from '@mdi/js'

export default {
  name: "AddEventDialog",
  props: {
    chapters: Array,
    lectors: Array,
    group_id: Number,
    dialog: {
      type: Boolean,
      default: false,
    },
    event: Object,
  },
  data() {
    return {
      loading: false,
      menu: false,
      addEventErrors: [],
      mdiUnfoldMoreHorizontal,
      mdiCalendarBlankOutline,
      lector_id: undefined,
      chapter_id: undefined,
      starts_at: undefined,
      url: undefined,
    }
  },

  watch: {
    dialog: {
      immediate: true,
      handler(newValue) {
        if (newValue)
          if(this.event) {
            this.starts_at = this.event.starts_at.split(' ')[0]
            this.chapter_id = this.event.chapter && this.event.chapter.id
            this.lector_id = this.event.lector && this.event.lector.id
            this.url = this.event.live_url
          }
      }
    }
  },

  methods: {
    async addEvent() {
      this.loading = true
      this.addEventErrors = []
      await this.$axios.post('admin/events', {
        ...(this.event && { id: this.event.id }),
        lector_id: this.lector_id,
        starts_at: this.starts_at,
        chapter_id: this.chapter_id,
        group_id: this.group_id,
        live_url: this.url
      })
        .then(res => {
          if (res){
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Добавлено!',
              color: 'success'
            })
            this.$emit('refresh')
            this.closeDialog()
          }
        })
        .catch(err => {
          this.addEventErrors = err
            && err.response
            && err.response.data
            && err.response.data.errors
            || undefined
        })
        .finally(() => {
          this.loading = false
        })
    },

    closeDialog() {
      this.addEventErrors = []
      this.lector_id = undefined
      this.chapter_id = undefined
      this.url = undefined
      this.starts_at = undefined
      this.$emit('update:event', undefined)
      this.$emit('update:dialog', false)
    }
  }
}
</script>
