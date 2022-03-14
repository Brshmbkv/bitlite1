<template>
  <v-container fluid>
    <v-row
      align-content="center"
      class="ma-0 pa-0"
    >
      <v-btn
        class="show-user-courses__v-btn align-self-center ml-0"
        outlined
        :ripple="false"
        @click="$router.push({name: 'AdminStreamIndex'})"
      >
        <v-icon
          :color="'#5A6275'"
        >
          {{ mdiChevronLeft }}
        </v-icon>
        <span class="text-capitalize">Вернуться назад</span>
      </v-btn>
    </v-row>
    <p
      style="font-size: 24px"
      class="font-weight-bold mt-6 mb-3"
    >Создание потока</p>
    <v-row
      align-content="center"
    >
      <v-col cols="12" md="4" sm="6">
        <p class="add-dialog__label-for-input">Название потока</p>
        <v-text-field
          v-model="streamTitle"
          required
          outlined
          dense
          class="add-dialog__v-text-field"
          :error-messages="
            addStreamErrors.hasOwnProperty('stream_name')
              ? addStreamErrors.stream_name
                : ''
          "
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <p class="add-dialog__label-for-input">Дата старта</p>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="streamDate"
          transition="scale-y-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="streamDate"
              required
              outlined
              readonly
              dense
              placeholder="Укажите дату"
              class="add-dialog__v-text-field purchase-date--v-text-field"
              v-bind="attrs"
              v-on="on"
              :error-messages="
                addStreamErrors.hasOwnProperty('starts_at')
                  ? addStreamErrors.starts_at
                    : ''
              "
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
            v-model="streamDate"
            no-title
            scrollable
            :first-day-of-week="1"
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
              @click="$refs.menu.save(streamDate)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <p class="add-dialog__label-for-input">Курс</p>
        <v-select
          :items="courses"
          v-model="streamCourse"
          item-text="title"
          item-value="id"
          :menu-props="{ bottom: true, offsetY: true }"
          dense
          class="add-dialog__v-text-field"
          outlined
          :append-icon="mdiUnfoldMoreHorizontal"
          :error-messages="
            addStreamErrors.hasOwnProperty('course_id')
              ? addStreamErrors.course_id
                : ''
          "
        ></v-select>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <p class="add-dialog__label-for-input">Лектор</p>
        <v-select
          :items="lectors"
          v-model="streamLector"
          :item-text="item => item.first_name +' '+ item.last_name"
          item-value="id"
          :menu-props="{ bottom: true, offsetY: true }"
          dense
          class="add-dialog__v-text-field"
          outlined
          :append-icon="mdiUnfoldMoreHorizontal"

        ></v-select>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <p class="add-dialog__label-for-input">Тип</p>
        <v-select
          :items="types"
          v-model="streamType"
          item-text="value"
          item-value="value"
          :menu-props="{ bottom: true, offsetY: true }"
          dense
          class="add-dialog__v-text-field"
          outlined
          :append-icon="mdiUnfoldMoreHorizontal"
          :error-messages="
            addStreamErrors.hasOwnProperty('type')
              ? addStreamErrors.type
                : ''
          "
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p class="add-dialog__label-for-input">Расписание</p>
        <div class="d-flex align-center" style="gap: 25px">
          <v-select
            :items="weekdays"
            v-model="selected_weekday"
            item-value="value"
            item-text="title"
            placeholder="выберите день"
            :menu-props="{ bottom: true, offsetY: true }"
            dense
            style="max-width: 250px"
            class="add-dialog__v-text-field"
            hide-details
            outlined
            :append-icon="mdiUnfoldMoreHorizontal"
          >
          </v-select>
          <div class="stream--create__time-picker">
            <label for="generate-event__time" class="mr-3" style="color: rgba(0,0,0,0.36)">выберите время</label>
            <input
              v-model="selected_time"
              id="generate-event__time"
              type="time"
            />
          </div>
          <v-btn
            elevation="0"
            :ripple="false"
            :disabled="!selected_time || !selected_weekday"
            color="#0ACCDA"
            fab
            tile
            style="border-radius: 5px;"
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
      <v-col cols="12">
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
            style="cursor: default; background-color: white !important;"
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

            >{{ mdiClose }}
            </v-icon>
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
    <template v-if="streamType !== 'lite'">
      <v-divider class="my-6"></v-divider>
      <p
        class=""
        style="font-weight: 600; font-size: 20px"
      >Добавление группы</p>
      <v-data-table
        v-if="groups && groups.length > 0"
        calculate-widths
        hide-default-footer
        hide-default-header
        :items="groups"
        :headers="headers"
        :mobile-breakpoint="0"
        class="elevation-0 mt-3 admin-users-table__v-table"
      >
        <template v-slot:item.options="{ item }">
          <template>
            <v-btn
              outlined
              icon
              height="34"
              width="34"
              :color="'#EE5252'"
              :ripple="false"
              class="admin-stream-modules-table__v-btn"
              @click.stop.prevent="deleteGroup(item.id)"
            >
              <TrashIcon></TrashIcon>
            </v-btn>
          </template>
        </template>
      </v-data-table>
    </template>
    <v-row
      align-content="center"
      justify="start"
    >
      <template v-if="streamType !== 'lite'">
        <v-col cols="12" md="3" sm="5">
          <p class="add-dialog__label-for-input">Название группы</p>
          <v-text-field
            v-model="groupName"
            required
            outlined
            dense
            class="add-dialog__v-text-field"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="5">
          <p class="add-dialog__label-for-input">Тренер-практикант</p>
          <div class="d-flex">
            <v-select
              :items="lectors"
              v-model="groupTeacher"
              :item-text="item => item.first_name +' '+ item.last_name"
              item-value="id"
              :menu-props="{ bottom: true, offsetY: true }"
              dense
              class="add-dialog__v-text-field"
              outlined
              :append-icon="mdiUnfoldMoreHorizontal"

            ></v-select>
            <v-btn
              tile
              :ripple="false"
              icon
              text
              :disabled="!groupName || !groupTeacher"
              height="40"
              width="40"
              elevation="0"
              class="add-stream-group__btn ml-3"
              @click="addGroup"
            >
              <v-icon
                :color="'#FFF'"
                size="30"
              >
                {{ mdiPlus }}
              </v-icon>
            </v-btn>
          </div>
        </v-col>
      </template>
      <v-col cols="12">
        <v-btn
          :ripple="false"
          :elevation="0"
          color="#0BC4B8"
          type="submit"
          class="text-capitalize white--text px-sm-8 py-sm-6"
          @click="storeStream"
        >Сохранить
        </v-btn>
        <v-btn
          :ripple="false"
          :elevation="0"
          color="#9FA4B1"
          class="text-capitalize white--text px-sm-8 py-sm-6 ml-5"
          :to="{
            name: 'AdminStreamIndex'
          }"
        >Отмена
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mdiChevronLeft,
  mdiUnfoldMoreHorizontal,
  mdiCalendarBlankOutline,
  mdiClockTimeFourOutline,
  mdiPlus,
  mdiClose,
} from '@mdi/js'
import TrashIcon from '@/assets/svg/trash.svg'
import uuid from 'uuid'

export default {
  name: "AdminStreamNew",
  components: {
    TrashIcon,
  },
  data() {
    return {
      mdiChevronLeft,
      mdiUnfoldMoreHorizontal,
      mdiCalendarBlankOutline,
      mdiClockTimeFourOutline,
      mdiPlus,
      mdiClose,
      menu: false,
      schedule: undefined,
      streamTitle: undefined,
      streamType: undefined,
      streamLector: undefined,
      streamDate: undefined,
      lectors: undefined,
      courses: undefined,
      types: [
        {
          value: 'offline'
        },
        {
          value: 'online'
        },
        {
          value: 'lite'
        }
      ],
      streamCourse: undefined,
      headers: [
        {
          text: '',
          align: 'start',
          value: 'name',
          sortable: false,
          width: 50
        },
        { text: '', value: 'teacher', align: 'start', sortable: false },
        { text: '', value: 'options', align: 'end', sortable: false },
      ],
      groups: [],
      group_names: [],
      practicant_ids: [],
      groupName: undefined,
      groupTeacher: undefined,
      addStreamErrors: [],
      selected_weekday: undefined,
      selected_time: undefined,
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
      ],
      weekdays_array: [],
      times_array: [],
    }
  },

  mounted() {
    this.fetchForStream()
  },

  methods: {
    addGroup() {
      this.group_names.push(this.groupName)
      this.practicant_ids.push(this.groupTeacher)
      let teacher = this.lectors.find(item => {
        return item.id === this.groupTeacher
      })
      console.log('teacher', teacher)
      this.groups.push({
        id: uuid.v4(),
        name: this.groupName,
        teacher: teacher.first_name + ' ' + teacher.last_name
      })
      this.groupTeacher = undefined
      this.groupName = undefined
    },

    async fetchForStream() {
      await this.$axios.get('admin/streams/create')
        .then(res => {
          if(res && res.data) {
            console.log(res.data)
            this.lectors = res.data.lectors
            this.courses = res.data.courses
          }
        })
    },

    async storeStream() {
      await this.$axios.post('admin/streams/storeV2', {
        stream_name: this.streamTitle,
        type: this.streamType,
        course_id: this.streamCourse,
        lector_id: this.streamLector,
        starts_at: this.streamDate,
        group_names: this.group_names,
        practicant_ids: this.practicant_ids,
        times: this.times_array,
        days: this.weekdays_array
      })
        .then(res => {
          if(res && res.data) {
            this.$router.push({
              name: 'AdminStreamIndex'
            })
          }
        })
        .catch(err => {
          if(err.response && err.response.data && err.response.data.errors) {
            this.addStreamErrors = err.response.data.errors
          }
        })
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

    deleteGroup(id) {
      this.groups = this.groups.filter(g => g.id !== id)
    },

    addToDateTimeArray() {
      this.weekdays_array.push(this.selected_weekday)
      this.times_array.push(this.selected_time)
      this.selected_weekday = undefined
      this.selected_time = undefined
    },

    removeFromDates(i) {
      this.times_array.splice(i, 1)
      this.weekdays_array.splice(i, 1)
    }
  }
}
</script>

<style lang="scss">
.stream--create__time-picker {
  background-color: white;
  border-radius: 4px;
  height: 40px;
  border: 1px solid rgba(23, 23, 41, 0.08);
  padding: 10px;
  display: flex;
  align-items: center;
}
</style>
