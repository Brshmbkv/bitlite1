<template>
  <v-container fluid>
    <template v-if="loading">
      <v-row class="mt-2 mb-8">
        <v-col cols="12">
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
        </v-col>
      </v-row>
    </template>
    <v-tabs
      v-else
      v-model="tab"
      background-color="transparent"
      class="mt-2 mb-8 admin-users__v-tabs"
    >
      <v-tabs-slider :color="'#0ACCDA'" />
      <v-tab
        v-for="module in modules"
        :key="module.id"
        class="text-capitalize users__v-tab mr-3"
        :ripple="false"
        active-class="active--tab"
      >
        <span style="letter-spacing: 0 !important;">{{
          module.title || 'Модуль'
        }}</span>
      </v-tab>
    </v-tabs>
    <v-row>
      <v-col cols="12">
        <div class="show-user-course__card">
          <div v-if="events_loading || loading">
            <v-skeleton-loader
              type="table-tbody"
              :types="{
                'table-tbody': 'table-row-divider@10',
              }"
            />
          </div>
          <div
            v-else-if="events && events.length === 0"
            class="d-flex align-center justify-center"
          >
            <CoursesEmptyPlaceholder text="Нету уроков" />
          </div>
          <v-simple-table v-else class="show-user-course__table">
            <thead>
              <tr>
                <th class="text-left font-weight-regular grayLight--text">
                  Урок
                </th>
                <th
                  class="text-left font-weight-regular grayLight--text text-no-wrap"
                >
                  Дата и Время
                </th>
                <th
                  class="text-left font-weight-regular grayLight--text text-truncate"
                >
                  Название
                </th>
                <th class="text-center font-weight-regular grayLight--text">
                  Статус
                </th>
                <th class="text-right font-weight-regular grayLight--text">
                  Балл
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="events">
                <tr
                  v-for="(event, ekey) in events"
                  :key="'e+' + ekey"
                  :style="{
                    color:
                      (event.status && event.status.color) === 'disabled'
                        ? '#9FA4B1'
                        : (event.status && event.status.color) === 'success'
                        ? '#0BC3B8'
                        : '#171729',
                    cursor: 'pointer',
                  }"
                >
                  <td>{{ '#' + (ekey + 1) }}</td>
                  <td>
                    {{ event.starts_at | longFormat }}
                  </td>
                  <td>
                    <template v-if="'chapter' in event">
                      <!-- NOT IMPLEMENTED -->
                      <!-- <v-icon
                      v-if="ekey > nextId"
                    >
                      {{ mdiLock }}
                    </v-icon> -->
                      <!-- NOT IMPLEMENTED -->
                      <span class="show-user-course__table__event-title">
                        {{ event.chapter.title || '' }}
                      </span>
                    </template>
                  </td>
                  <td class="text-center">
                    <v-chip
                      v-if="event.status"
                      style="cursor: inherit; height: 24px;"
                      :color="getChipColor(event.status.color)"
                      :text-color="getChipTextColor(event.status.color)"
                      label
                    >
                      <v-icon
                        x-small
                        v-if="event.is_live"
                        color="red"
                        class="mr-1"
                        >{{ mdiCircle }}
                      </v-icon>
                      <span class="chip__text">{{
                        event.status.text || ''
                      }}</span>
                    </v-chip>
                  </td>
                  <td class="text-right">
                    {{ event.real_score + (event.real_score >= 0 ? '%' : '') }}
                  </td>
                </tr>
              </template>
            </tbody>
          </v-simple-table>
        </div>
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <div v-if="loading || events_loading" class="show-user-course__card">
          <v-skeleton-loader type="list-item-avatar" />
          <v-skeleton-loader type="list-item-avatar" />
        </div>
        <div v-else class="show-user-course__card pa-5">
          <h6 class="show-user-course__card-title">Пройдено</h6>
          <div class="pt-4 pb-8">
            <v-row align="center">
              <v-col cols="auto">
                <v-progress-circular
                  color="#0BC4B8"
                  size="44"
                  width="4"
                  :value="Math.floor((passed_events / total_events) * 100)"
                  rotate="270"
                />
              </v-col>
              <v-col>
                <p class="text__v-progress-linear mb-0">
                  {{ passed_events }} из {{ total_events }} уроков
                </p>
                <!--                <p-->
                <!--                  v-if="end_date"-->
                <!--                  class="text-body-2 mb-0"-->
                <!--                >-->
                <!--                  {{ new Date(end_date) | monthDaysUntil(now)}}-->
                <!--                </p>-->
              </v-col>
            </v-row>
          </div>
          <h6 class="show-user-course__card-title">Успеваемость</h6>
          <div class="py-4">
            <v-row>
              <v-col cols="auto" class="d-flex pr-0 pt-4">
                <div class="CourseStats__progress-container">
                  <v-progress-linear
                    :value="Math.floor((Number(points) / 100) * 100)"
                    height="16"
                    :color="points < 40 ? '#F16635' : '#66F0E3'"
                  />
                </div>
              </v-col>
              <v-col class="align-self-center">
                <p class="mb-0 text__v-progress-linear">
                  {{ Math.floor((points / 100) * 100) || 0 }}%
                </p>
                <!--                <p-->
                <!--                  v-if="points && !hide_cheerups"-->
                <!--                  class="text-body-2 mb-0"-->
                <!--                >-->
                <!--                  {{ Math.floor((points/100) * 100) | cheerUp }}-->
                <!--                  &lt;!&ndash; Продолжайте также &ndash;&gt;-->
                <!--                </p>-->
                <!--                <p-->
                <!--                  v-else-if="!hide_cheerups"-->
                <!--                  class="text-body-2 mb-0"-->
                <!--                >Тут мы будем отображать вашу успеваемость</p>-->
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
      <v-col cols="auto">
        <div
          v-if="events_loading || loading"
          style="height: 270px; width: 350px"
        >
          <v-skeleton-loader
            type="table-tbody"
            :types="{
              'table-tbody': 'table-row-divider@4',
            }"
          />
        </div>
        <div v-else class="show-user-course__card pa-5">
          <h4 style="font-weight: 600">График активности</h4>
          <CourseActivity :series="series" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiCircle } from '@mdi/js'
import CourseActivity from '@/components/Admin/widgets/CourseActivity'
import CoursesEmptyPlaceholder from '@/components/EmptyPlaceholder'

export default {
  name: 'AdminStudentCourseShow',
  components: { CoursesEmptyPlaceholder, CourseActivity },
  props: ['user_id', 'course_id'],
  data() {
    return {
      mdiCircle,
      loading: true,
      events_loading: false,
      tab: undefined,
      modules: undefined,
      events: undefined,
      course: undefined,
      passed_events: undefined,
      total_events: undefined,
      points: undefined,
      series: [],
      user_full_name: undefined,
    }
  },
  watch: {
    tab(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.fetchModule(this.modules[this.tab].id)
      }
    },
  },
  mounted() {
    this.fetchCourse().then(() => {
      this.$nextTick(() => {
        this.$store.dispatch('breadcrumbs/setLinks', [
          {
            text: 'Пользователи',
            to: {
              name: 'AdminUsersIndex',
            },
          },
          {
            text: this.user_full_name || 'Студент',
            to: {
              name: 'AdminStudentShow',
              params: {
                user_id: this.user_id,
              },
            },
          },
          {
            text: this.course.title,
            disabled: true,
          },
        ])
      })
    })
  },
  methods: {
    async fetchCourse() {
      this.loading = true
      try {
        const res = await this.$axios.get(
          'admin/students/' + this.user_id + '/courses/' + this.course_id
        )
        this.course = res?.data?.course
        this.modules = res?.data?.course?.modules || []
        this.user_full_name =
          ('first_name' || 'last_name') in (res?.data?.student || {})
            ? `${res?.data?.student?.first_name || ''} ${res?.data?.student
                ?.last_name || ''}`
            : 'Студент'
      } catch (e) {
        throw new Error(e)
      }
      this.loading = false
    },
    async fetchModule(id) {
      this.events_loading = true
      try {
        const res = await this.$axios.get(
          'admin/students/' + this.user_id + '/modules/' + id
        )
        this.events = res?.data?.events || []
        this.passed_events = res?.data?.passed_events || 0
        this.total_events = res?.data?.total_events || 0
        this.points = res?.data?.score || 0
        this.series[0] = {
          name: 'Оценка',
          type: 'area',
          data: res?.data?.events?.map((event) => event.real_score),
        }
      } catch (e) {
        throw new Error(e)
      }
      this.events_loading = false
    },
    getChipColor(status) {
      let statusBgColorMap = {
        default: 'rgba(23, 23, 41, 0.08)',
        pizdec: 'rgba(241, 102, 53, 0.08)',
        success: 'rgba(11, 196, 184, 0.08)',
        warning: 'rgba(231, 174, 30, 0.12)',
        disabled: '#F8F8F8',
      }
      return statusBgColorMap[status] || 'chip--default'
    },
    getChipTextColor(status) {
      let statusTextColorMap = {
        default: '#5A6275',
        pizdec: '#F16635',
        success: '#0BC3B8',
        warning: '#E7AE1E',
        disabled: '#9FA4B1',
      }
      return statusTextColorMap[status] || 'chip--default'
    },
  },
}
</script>

<style lang="scss">
.show-user-course__card {
  border-radius: 10px !important;
  background-color: #ffffff;
  border: 1px solid rgba(23, 23, 41, 0.08) !important;
  min-height: 200px;

  &-title {
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #9fa4b1;
  }
}

.show-user-course__table {
  border-radius: 10px;

  &__event-title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.02em;
  }
}

.CourseStats__progress-container {
  width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  transform: rotate(270deg);
}

.text__v-progress-linear {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: #171729;
}
</style>
