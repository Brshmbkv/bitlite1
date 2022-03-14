<template>
  <div class="add-dialog">
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog"
      max-width="700px"
    >
      <v-form @submit.prevent="generateEvent">
        <v-card
          class="px-3"
        >
          <v-card-title>
            <span class="add-dialog__header-text mt-4 mb-4">Сгенерировать уроки</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Практикант</p>
                <v-select
                  :items="lectors"
                  v-model="lector"
                  item-value="id"
                  :menu-props="{ bottom: true, offsetY: true }"
                  dense
                  class="add-dialog__v-text-field"
                  outlined
                  :append-icon="mdiUnfoldMoreHorizontal"
                >
                  <template v-slot:item="{ item }">
                    <span>{{ `${item.first_name || ''} ${item.last_name || ''}` }}</span>
                  </template>
                  <template v-slot:selection="{ item }">
                    <span>{{ `${item.first_name || ''} ${item.last_name || ''}` }}</span>
                  </template>
                </v-select>
              </v-col>
              <v-col
                cols="12"
                class="py-0"
              >
                <p class="add-dialog__label-for-input">Начало урока</p>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <div class="d-flex justify-space-between align-center" style="gap: 10px">
                  <v-select
                    :items="weekdays"
                    v-model="selected_weekday"
                    item-value="value"
                    item-text="title"
                    placeholder="выберите день"
                    :menu-props="{ bottom: true, offsetY: true }"
                    dense
                    class="add-dialog__v-text-field"
                    outlined
                    :append-icon="mdiUnfoldMoreHorizontal"
                  >
                  </v-select>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-0"
              >
                <div class="d-flex justify-space-between align-center" style="gap: 10px">
                  <label for="generate-event__time">выберите время</label>
                  <input
                    v-model="selected_time"
                    id="generate-event__time"
                    type="time"
                  >
<!--                  <v-text-field-->
<!--                    v-model="picked_date"-->
<!--                    type="time"-->
<!--                    required-->
<!--                    outlined-->
<!--                    readonly-->
<!--                    dense-->
<!--                    placeholder="выберите время"-->
<!--                    hide-details-->
<!--                    class="filter-by-date__v-text-field purchase-date&#45;&#45;v-text-field"-->
<!--                  >-->
<!--                    <template v-slot:prepend-inner>-->
<!--                      <v-icon-->
<!--                        :color="'#171729'"-->
<!--                        size="20"-->
<!--                        class="mr-1"-->
<!--                      >-->
<!--                        {{ mdiClockOutline }}-->
<!--                      </v-icon>-->
<!--                    </template>-->
<!--                  </v-text-field>-->
                  <v-btn
                    elevation="0"
                    :ripple="false"
                    :disabled="!selected_time && !selected_weekday"
                    color="#0ACCDA"
                    fab
                    tile
                    style="border-radius: 5px"
                    height="40"
                    width="40"
                    @click="addToDateTimeArray"
                  >
                    <v-icon
                      color="white"
                    >
                      {{ mdiPlus }}
                    </v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
            <div>
              <v-chip-group
                v-if="weekdays_array.length > 0 && times_array.length > 0"
                column
              >
                <v-chip
                  v-for="(date, i) in weekdays_array"
                  :key="date"
                  :ripple="false"
                  label
                  outlined
                  style="cursor: default"
                  class="d-flex align-center justify-space-between pa-6 px-4"
                >
                  <span class="text-capitalize" style="font-weight: 500; font-size: 16px">{{ getWeekDay(date) }}</span>
                  <span class="mx-4" style="color: rgba(23, 23, 41, 0.4)">|</span>
                  <span class="text-lowercase primary--text">{{ times_array[i] }}</span>
                  <v-icon
                    class="ml-4"
                    style="border-radius: 100%; padding: 2px; background-color: #EE5252"
                    size="21"
                    :color="'white'"
                    @click="removeFromDates(i)"

                  >{{ mdiClose }}</v-icon>
                </v-chip>
              </v-chip-group>
            </div>
          </v-card-text>
          <v-card-actions
            class="justify-end mr-4 pb-5 mt-4"
          >
            <v-btn
              :ripple="false"
              :elevation="0"
              :disabled="!lector || weekdays_array.length === 0 || times_array.length ===0 ||  loading"
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
<!--    <DateTimePicker-->
<!--      :dialog.sync="datetime_dialog"-->
<!--      @return="(datetime) => {-->
<!--        this.picked_date = datetime-->
<!--        this.datetime_dialog = false-->
<!--      }"-->
<!--    />-->
  </div>
</template>

<script>
import { mdiUnfoldMoreHorizontal, mdiCalendarBlankOutline, mdiClockOutline, mdiPlus, mdiClose } from '@mdi/js'
// import DateTimePicker from "@/components/DateTimePicker";


export default {
  name: "GenerateEventDialog",
  // components: { DateTimePicker },
  props: {
    dialog: Boolean,
    lectors: Array,
    group_id: Number,
    module_id: Number,
  },
  data() {
    return {
      loading: false,
      error: '',
      // datetime_dialog: false,
      mdiUnfoldMoreHorizontal,
      mdiClockOutline,
      mdiPlus,
      mdiClose,
      mdiCalendarBlankOutline,
      lector: undefined,
      selected_weekday: undefined,
      selected_time: undefined,
      dates: [],
      weekdays_array: [],
      times_array: [],
      weekdays: [
        {
          title: 'Понедельник',
          value: 'Monday'
        },
        {
          title: 'Вторник',
          value: 'Tuesday'
        },
        {
          title: 'Среда',
          value: 'Wednesday'
        },
        {
          title: 'Четверг',
          value: 'Thursday'
        },
        {
          title: 'Пятница',
          value: 'Friday'
        },
        {
          title: 'Суббота',
          value: 'Saturday'
        },
        {
          title: 'Воскресенье',
          value: 'Sunday'
        },
      ]
    }
  },

  methods: {
    async generateEvent() {
      this.loading = true
      this.error = ''
      await this.$axios.post('admin/events/generate/days', {
        group_id: this.group_id,
        course_module_id: this.module_id,
        days: this.weekdays_array,
        times: this.times_array,
        lector_id: this.lector,
      })
        .then(res => {
          console.log(res.data)
          this.$emit('update:dialog', false)
          this.$emit('update-events')
          this.dates = []
          this.picked_date = undefined
          this.lector = undefined
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    closeDialog() {
      this.$emit('update:dialog', false)
      this.error = undefined
      this.lector = undefined
      this.dates = []
    },

    addToDateTimeArray() {
      this.weekdays_array.push(this.selected_weekday)
      this.times_array.push(this.selected_time)
      this.selected_weekday = undefined
      this.selected_time = undefined
    },

    getWeekDay(d) {
      return {
        'Monday': 'Понедельник',
        'Tuesday': 'Вторник',
        'Wednesday': 'Среда',
        'Thursday': 'Четверг',
        'Friday': 'Пятница',
        'Saturday': 'Суббота',
        'Sunday': 'Воскресенье',
      }[d]
    },

    removeFromDates(i) {
      this.times_array.splice(i, 1)
      this.weekdays_array.splice(i, 1)
    }

  }
}
</script>
