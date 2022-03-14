<template>
  <div>
    <PurchaseDialog
      :dialog="showDialog"
      :module_id="module_id"
      :group_id="group_id"
      :price="price"
      @close-dialog="showDialog = false"
    />
    <template v-if="loading">
      <v-card
        v-for="n in 5"
        :key="n"
        class="my-4 ml-md-8 mr-md-16 mr-3 ml-3"
        style="display: flex"
      >
        <v-col cols="4">
          <v-skeleton-loader type="article" height="150" />
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader type="article" height="150" />
        </v-col>
        <v-col cols="4">
          <v-skeleton-loader type="avatar" height="150" />
        </v-col>
      </v-card>
    </template>
    <template v-else-if="streams && streams.length > 0">
      <div
        v-for="stream in streams"
        :key="stream.id"
        CLASS="mb-10 course-purchase__card"
        :style="{ height: $vuetify.breakpoint.width > 850 ? '220px' : '620px' }"
      >
        <purchase-request-dialog
          :dialog.sync="request_dialog"
          :course_id="stream.module && stream.module.course_id"
          :stream_id="stream.id"
        />
        <div class="course-purchase--left-circle__card"></div>
        <div class="course-purchase-circle--mobile__card"></div>
        <div class="course-purchase--main__card">
          <v-row class="ma-0">
            <v-col
              :cols="$vuetify.breakpoint.width > 850 ? 4 : 12"
              class="course-purchase--col__card d-flex justify-center flex-column pl-sm-8 pl-3 mb-6 mb-md-0 py-6 py-md-0"
            >
              <p class="d-flex align-center mb-6 ml-0 ml-sm-4">
                <RocketIcon class="mr-3" />
                <!--                <span>{{idx + 1}}</span>-->
                <span style="font-weight: 600; font-size: 18px; color: white">{{
                  stream.starts_at | shortFormat
                }}</span>
              </p>
              <p class="d-flex align-center mb-6">
                <ClockIcon class="mr-2 course-purchase__clock-svg" />
                <span style="color: white">
                  {{
                    getSchedule(stream.schedule) ||
                      'Расписание ещё не составлено'
                  }}
                  {{ stream.events_starts_at | onlyTime }}-{{
                    stream.events_ends_at | onlyTime
                  }}
                </span>
              </p>
              <v-chip
                :color="'rgba(255, 255, 255, 0.12)'"
                class="ml-0 ml-sm-3"
                :text-color="'white'"
                style="font-weight: 400;height: 28px"
              >
                <v-icon size="20" class="mr-2">{{ mdiTimerOutline }}</v-icon>
                осталось мест: {{ stream.max_limit - stream.students_count }}
              </v-chip>
            </v-col>
            <v-col
              :cols="$vuetify.breakpoint.width > 850 ? 4 : 12"
              class="pa-6 d-flex flex-column align-start"
            >
              <p class="font-weight-bold mb-0" style="font-size: 20px">
                {{
                  stream.module &&
                    stream.module.course &&
                    stream.module.course.title
                }}
              </p>
              <v-list-item two-line class="px-0">
                <v-list-item-avatar>
                  <v-img
                    :src="
                      (stream.lector && stream.lector.avatar) ||
                        UserPlaceholderSm
                    "
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    style="font-size: 14px; font-weight: 600;letter-spacing: 0.02em"
                  >
                    {{
                      stream.lector &&
                        (stream.lector.first_name || '') +
                          ' ' +
                          (stream.lector.last_name || '')
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle style="font-size: 12px; color: #9FA4B1"
                    >Тренер</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <p class="d-flex align-center mb-3">
                <SandClockIcon class="mr-2" />
                <span
                  >{{
                    stream.module &&
                      stream.module.course &&
                      stream.module.course.duration
                  }}
                  месяца</span
                >
              </p>
              <p class="d-flex align-center mb-3">
                <UsersIcon class="mr-2" />
                <span>группа на {{ stream.max_limit }} человек</span>
              </p>
            </v-col>
            <v-col
              :cols="$vuetify.breakpoint.width > 850 ? 4 : 12"
              align-self="center"
              class="d-flex justify-center flex-column course-purchase--col__card pr-sm-8 pr-3"
            >
              <p
                style="font-size: 24px; font-weight: 800; color: #171729;letter-spacing: 0.02em"
                class="mb-2"
              >
                {{ stream.module && stream.module.price.toLocaleString() }} ₸ в
                месяц
              </p>
              <v-btn
                :elevation="0"
                :ripple="false"
                :color="'#F16635'"
                style="color: white"
                large
                block
                class="text-uppercase mb-3"
                @click="request_dialog = true"
              >
                Записаться
              </v-btn>
              <v-btn
                :elevation="0"
                :ripple="false"
                :color="'#F16635'"
                large
                outlined
                block
                class="text-none"
                @click="request_dialog = true"
              >
                Получить консультацию
              </v-btn>
            </v-col>
            <PurchaseImportantInfo
              :dialog="showDialogInfo"
              @close-dialog="showDialogInfo = false"
              @open-dialog="
                openDialog(stream.id, stream.module && stream.module.id)
              "
              :price="price"
            />
          </v-row>
        </div>
      </div>
    </template>
    <template v-else>
      <EmptyPlaceholder :text="'Soon...'" />
    </template>
  </div>
</template>

<script>
import RocketIcon from '@/assets/svg/rocket.svg'
import ClockIcon from '@/assets/svg/clock.svg'
import UsersIcon from '@/assets/svg/people.svg'
import SandClockIcon from '@/assets/svg/sand_clock.svg'
import { mdiTimerOutline } from '@mdi/js'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import PurchaseDialog from '@/components/Purchase/PurchaseDialog'
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import PurchaseImportantInfo from '@/components/Purchase/PurchaseImportantInfo'
import PurchaseRequestDialog from '@/components/Purchase/PurchaseRequestDialog'

export default {
  name: 'PurchaseStreamCard',
  components: {
    PurchaseRequestDialog,
    PurchaseImportantInfo,
    PurchaseDialog,
    EmptyPlaceholder,
    RocketIcon,
    ClockIcon,
    UsersIcon,
    SandClockIcon,
  },
  filters: {
    onlyTime(d) {
      if (!d) return ''
      let date = new Date(Date.parse(d.replace(/ /g, 'T')))
      if (!date) return ''
      let dateTime = date.toLocaleTimeString('ru-RU', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
      return dateTime
    },
  },
  props: {
    streams: Array,
    loading: Boolean,
  },

  data() {
    return {
      mdiTimerOutline,
      UserPlaceholderSm,
      showDialog: false,
      request_dialog: false,
      showDialogInfo: false,
      group_id: undefined,
      module_id: undefined,
      price: undefined,
    }
  },
  methods: {
    openDialog(group_id, module_id) {
      this.group_id = group_id
      this.module_id = module_id
      this.showDialog = true
      this.showDialogInfo = false
    },

    openDialogInfo(price) {
      this.price = price
      this.showDialogInfo = true
    },

    getSchedule(sch) {
      if (sch && sch.length === 0) return ''
      let weekdays = {
        Понедельник: 'Пн',
        Вторник: 'Вт',
        Среда: 'Ср',
        Четверг: 'Чт',
        Пятница: 'Пт',
        Суббота: 'Сб',
        Воскресенье: 'Вс',
      }
      return sch
        .map((s) => {
          return weekdays[s]
        })
        .join('-')
    },
  },
}
</script>

<style lang="scss">
.course-purchase__btn--back {
  &:before {
    background: transparent;
  }
}

.course-purchase__card {
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: 30px;
  border: 1px solid rgba(23, 23, 41, 0.08);

  .course-purchase--main__card {
    position: absolute;
    z-index: 3;
    width: 100%;
    height: 100%;
  }

  .course-purchase--col__card {
    align-items: start;
  }

  .course-purchase--left-circle__card {
    background: linear-gradient(
      180deg,
      #2e39bd 4.8%,
      #4644c8 48.81%,
      #7155db 100%
    );
    width: 35%;
    height: 150%;
    top: -25%;
    left: -5%;
    position: absolute;
    border-radius: 100%;
    z-index: 2;
  }

  .course-purchase-circle--mobile__card {
    background: linear-gradient(
      180deg,
      #2e39bd 4.8%,
      #4644c8 48.81%,
      #7155db 100%
    );
    width: 140%;
    height: 40%;
    left: -20%;
    display: none;
    top: -5%;
    position: absolute;
    border-radius: 100%;
    z-index: 2;
  }
}

@media only screen and (max-width: 850px) {
  .course-purchase--left-circle__card {
    display: none;
  }
  .course-purchase-circle--mobile__card {
    display: block !important;
  }
  .course-purchase__card {
    margin: 0 20px;
  }
  .course-purchase--col__card {
    align-items: center !important;
  }
}

.course-purchase__clock-svg {
  circle {
    stroke: white;
  }

  path {
    stroke: white;
  }
}
</style>
