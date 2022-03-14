<template>
  <v-dialog
    :value="dialog"
    max-width="90%"
    @click:outside="$emit('close-dialog')"
    content-class="course-purchase__dialog pa-md-6 pa-4"
    @keydown.esc="$emit('close-dialog')"
  >
    <div v-if="modules && modules.length > 0" class="text-center">
      <p
        style="font-size: 30px;line-height: 120%;letter-spacing: 0.02em;"
        class="font-weight-bold"
      >
        Привет будущий специалист! &#128075;&#128515;
      </p>
      <p style="font-size: 18px;letter-spacing: 0.02em">
        Выбери свой подходящий поток
      </p>
      <v-chip
        label
        :color="'rgba(11, 195, 184, 0.12)'"
        :text-color="'#0BC3B8'"
        style="font-weight: 500"
      >
        <v-icon size="20" class="mr-2">{{ mdiEyeOutline }}</v-icon>
        {{ randomNumber }} просматривают сейчас
      </v-chip>
    </div>
    <template v-if="loading">
      <v-row class="pa-0 ma-0">
        <v-col
          v-for="i in 3"
          :key="`col-${i}`"
          cols="12"
          md="6"
          lg="4"
          class="pa-sm-5 pa-0 py-md-5 pa-2"
        >
          <div style="border: 1px solid rgba(23, 23, 41, 0.08)" class="pa-6">
            <v-skeleton-loader type="heading" />
            <v-divider class="my-6" />
            <v-skeleton-loader
              type="paragraph, paragraph, list-item-avatar-two-line, actions"
              :types="{
                actions: 'button@1',
              }"
            />
          </div>
        </v-col>
      </v-row>
    </template>
    <template v-else-if="modules && modules.length === 0">
      <CoursesEmptyPlaceholder :text="'Пусто...'" />
    </template>
    <template v-else>
      <v-row class="pa-0 ma-0 mt-sm-0 mt-4">
        <v-col
          cols="12"
          md="6"
          lg="4"
          class="pa-sm-5 pa-0 py-md-5 pa-2"
          v-for="(module, idx) in modules"
          :key="module.id"
        >
          <div class="course-purchase__col">
            <div
              class="d-flex flex-wrap mb-6"
              :class="[
                $vuetify.breakpoint.width < 400
                  ? 'justify-center'
                  : 'justify-space-between',
              ]"
            >
              <p
                style="font-size: 18px; letter-spacing: 0.02em"
                class="font-weight-bold ma-0 align-self-center pb-md-0 pb-4"
              >
                Поток #{{ idx + 1 }}
              </p>
              <v-chip
                v-if="module.max_limit - module.students_count < 10"
                class="float-right"
                :color="'rgba(241, 102, 53, 0.12)'"
                :text-color="'#F16635'"
                style="font-weight: 400;height: 28px"
              >
                <v-icon size="20" class="mr-2">{{ mdiTimerOutline }}</v-icon>
                осталось мест: {{ module.max_limit - module.students_count }}
              </v-chip>
            </div>
            <v-divider
              style="border-width: 3px 0 0 0; border-color: rgba(23, 23, 41, 0.08);"
            />
            <div class="my-4">
              <p style="font-size: 14px;font-weight: 600;">
                <MonitorIcon style="transform: translateY(4px)" class="mr-2" />
                {{ module.module && module.module.title }}
              </p>
              <p style="font-size: 14px">
                <CalendarIcon style="transform: translateY(4px)" class="mr-2" />
                {{ module.starts_at | shortFormat }}
              </p>
              <p style="font-size: 14px">
                <ClockIcon style="transform: translateY(4px)" class="mr-2" />
                {{
                  module.schedule.join(' - ') || 'Расписание ещё не составлено'
                }}
              </p>
              <p style="font-size: 14px">
                <PeopleIcon style="transform: translateY(4px)" class="mr-2" />
                {{ module.max_limit }} мест
              </p>
              <v-list-item two-line class="px-0">
                <v-list-item-avatar>
                  <v-img
                    :src="
                      (module.lector && module.lector.avatar) ||
                        UserPlaceholderSm
                    "
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    style="font-size: 14px; font-weight: 600;letter-spacing: 0.02em"
                    >{{
                      module.lector &&
                        (module.lector.first_name || '') +
                          ' ' +
                          (module.lector.last_name || '')
                    }}</v-list-item-title
                  >
                  <v-list-item-subtitle style="font-size: 12px; color: #9FA4B1"
                    >Тренер</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </div>
            <div
              class="d-flex flex-wrap"
              :class="[
                $vuetify.breakpoint.width < 400
                  ? 'justify-center'
                  : 'justify-space-between',
              ]"
            >
              <span
                style="font-size: 18px;letter-spacing: 0.02em; color: #171729"
                class="font-weight-bold align-self-center"
                :class="[$vuetify.breakpoint.width < 400 ? 'pb-4' : '']"
                >{{
                  module.module && module.module.price.toLocaleString()
                }}
                ₸</span
              >
              <v-btn
                :elevation="0"
                :ripple="false"
                :color="'#F16635'"
                style="color: white"
                @click="makePurchase(module.id)"
                :disabled="buttonLoading"
                :loading="buttonLoading"
              >
                Купить сейчас
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </template>
  </v-dialog>
</template>

<script>
import { mdiTimerOutline, mdiClockOutline, mdiEyeOutline } from '@mdi/js'
import PeopleIcon from '@/assets/svg/people.svg'
import MonitorIcon from '@/assets/svg/monitor.svg'
import CalendarIcon from '@/assets/svg/calendar.svg'
import ClockIcon from '@/assets/svg/clock.svg'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import CoursesEmptyPlaceholder from '@/components/EmptyPlaceholder'

export default {
  name: 'CoursePurchaseDialog',
  components: {
    CoursesEmptyPlaceholder,
    PeopleIcon,
    MonitorIcon,
    CalendarIcon,
    ClockIcon,
  },
  props: {
    dialog: Boolean,
    module_id: Number,
    course_id: Number,
  },
  data() {
    return {
      mdiTimerOutline,
      mdiEyeOutline,
      UserPlaceholderSm,
      mdiClockOutline,
      modules: undefined,
      loading: false,
      buttonLoading: false,
      randomNumber: Math.floor(Math.random() * (6 - 3)) + 3,
      new_module_id: undefined,
    }
  },
  watch: {
    dialog: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal && (this.module_id || this.course_id) && newVal) {
          this.fetchStreams().finally(() => {
            this.loading = false
          })
        }
      },
      immediate: true,
    },
  },
  methods: {
    async fetchStreams() {
      this.loading = true
      await this.$axios
        .get(
          this.module_id
            ? `/modules/${this.module_id}/available-streams`
            : this.course_id
            ? `/catalog/courses/${this.course_id}/available-streams`
            : ''
        )
        .then((res) => {
          if (res && res.data) {
            this.modules = res.data
            this.new_module_id =
              res.data[0] && res.data[0].module && res.data[0].module.id
          }
        })
    },

    async makePurchase(group_id) {
      this.buttonLoading = true
      await this.$axios
        .post('/init-purchase', {
          course_module_id: this.module_id || this.new_module_id,
          group_id: group_id,
        })
        .then((res) => {
          if (res && res.data) {
            // console.log(res.data)
            window.location.href = res.data.url
          }
        })
        .finally(() => {
          this.buttonLoading = false
        })
    },
  },
}
</script>

<style lang="scss">
.course-purchase__dialog {
  background-color: white;
}

.course-purchase__col {
  border: 1px solid rgba(23, 23, 41, 0.08);
  border-radius: 4px;
  padding: 24px;
}
</style>
