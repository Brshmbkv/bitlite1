<template>
  <div>
    <div>
      <v-container class="pb-0">
        <h1 style="font-weight: 700;font-size: 32px;line-height: 42px;">
          {{ group_title }}
        </h1>
        <p class="group-description ma-0 pa-0">
          {{ description }}
        </p>
        <div
          v-if="practicant"
          class="d-flex mt-6 mb-4"
          style="align-items: start"
        >
          <div
            class="mr-4"
            style="border-radius: 8px; overflow: hidden; width: 56px;"
          >
            <v-img
              :src="(practicant && practicant.avatar) || UserPlaceholderSm"
            />
          </div>
          <div>
            <span style="font-size: 16px;font-weight: 600;font-style: normal">{{
              ((practicant && practicant.first_name) || '') +
                ' ' +
                ((practicant && practicant.last_name) || '')
            }}</span>
            <span
              style="line-height: 20px"
              class="d-block text-body-2 grayLight--text"
              >{{ (practicant && practicant.role.name) || '' }}</span
            >
          </div>
          <v-btn
            v-if="$route.query.type === 'lite'"
            class="ml-auto text-capitalize align-self-center"
            elevation="0"
            :ripple="false"
            dark
            color="#F16635"
            :to="{
              name: 'StreamPracticeIndex',
              params: {
                stream_id: this.stream_id,
              },
            }"
            >Практики
          </v-btn>
          <HoverableButton
            v-else
            class="text-capitalize ml-auto"
            style="--color:#4376FB"
            text="Занятия"
            @click="
              $router.push({
                name: 'GroupEventIndex',
                params: {
                  group_id,
                  stream_id,
                },
              })
            "
          >
          </HoverableButton>
        </div>
        <template v-if="tabs_loading">
          <v-col cols="12">
            <v-skeleton-loader class="d-inline-block mr-3" type="button" />
            <v-skeleton-loader class="d-inline-block mr-3" type="button" />
            <v-skeleton-loader class="d-inline-block mr-3" type="button" />
          </v-col>
        </template>
        <v-row justify="space-between" v-else-if="tabs && tabs.length > 0">
          <v-col
            cols="12"
            md="auto"
            class="d-flex pb-0"
            style="overflow-x: auto;"
          >
            <v-tabs color="#00665E">
              <v-tab
                v-for="tab in tabs"
                :key="tab.id"
                :disabled="!(tab.is_practicant || is_lector)"
              >
                <div v-if="!(tab.is_practicant || is_lector)" class="mr-2">
                  <LockedSvg />
                </div>
                <span class="text-capitalize font-weight-medium" style="font-size: 16px; line-height: 20px; letter-spacing: 0.02em">{{ tab.name }}</span>
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container>
      <template v-if="group_loading">
        <v-row>
          <v-col>
            <v-skeleton-loader type="table-tbody" />
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-simple-table class="mt-6">
          <template>
            <thead>
              <tr>
                <th></th>
                <th
                  style="font-size: 14px; line-height: 20px; font-weight: 500; color: #A7ADC3;"
                >
                  Студент
                </th>
                <th
                  style="font-size: 14px; line-height: 20px; font-weight: 500; color: #A7ADC3;"
                >
                  Email
                </th>
                <th
                  style="font-size: 14px; line-height: 20px; font-weight: 500; color: #A7ADC3;"
                >
                  Успеваемость
                </th>
                <th
                  style="font-size: 14px; line-height: 20px; font-weight: 500; color: #A7ADC3;"
                >
                  Посещаемось
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(student, i) in group"
                :key="student.id"
                style="cursor: pointer;"
                @click="
                  $router.push(
                    $route.query.type === 'lite'
                      ? {
                          name: 'TeacherStreamStudentShow',
                          params: {
                            stream_id: group_id,
                            student_id: student.id,
                            column: $parent.column || '',
                            page: $parent.page || '',
                            order: $parent.order || '',
                          },
                        }
                      : {
                          name: 'TeacherGroupStudentShow',
                          params: {
                            group_id,
                            student_id: student.id,
                          },
                        }
                  )
                "
              >
                <td
                  class="font-size: 16px; line-height: 20px; color: #000221A3;"
                >
                  {{ i + 1 }}
                </td>
                <td class="font-size: 16px; line-height: 20px;">
                  <div style="display:flex; align-items: center; gap: 12px">
                    <v-avatar size="32">
                      <img :src="student.avatar" alt="student aavatar" />
                    </v-avatar>
                    <span style="color: #4376FB; font-weight: 500"
                      >{{ student.first_name }} {{ student.last_name }}</span
                    >
                  </div>
                </td>
                <td
                  class="font-size: 16px; line-height: 20px; color: #000221A3;"
                >
                  {{ student.email }}
                </td>
                <td
                  class="font-size: 16px; line-height: 20px; color: #000221A3;"
                >
                  {{ student.score }}%
                </td>
                <td
                  class="font-size: 16px; line-height: 20px; color: #000221A3;"
                >
                  {{ student.attendances }}/{{ total_events }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
    </v-container>
  </div>
</template>
<script>
import LockedSvg from '@/assets/svg/locked.svg'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import HoverableButton from '@/components/HoverableButton.vue'
export default {
  name: 'TeacherStreamShow',
  components: {
    LockedSvg,
    HoverableButton,
  },
  props: {
    stream_id: [Number, String],
    group_id: [Number, String],
  },
  data() {
    return {
      UserPlaceholderSm,
      stream_name: undefined,
      error: false,
      group: undefined,
      group_title: undefined,
      group_loading: true,
      stream_fetch_error: false,
      tabs: [],
      tabs_loading: true,
      is_lector: false,
      loading: true,
      practicant: undefined,
      total_events: undefined,
      description: undefined,
      total_pages: undefined,
      page: this.$route.query.page ? Number(this.$route.query.page) : 1,
      chapters_count: undefined,
      order: this.$route.query.order ? this.$route.query.order : 'desc',
      column: this.$route.query.column ? this.$route.query.column : 'score',
      g_total_students: undefined,
      g_total_passed: undefined,
      g_total_exercises: undefined,
      g_scores: [],
      chapter_titles: undefined,
      stats_loading: false,
    }
  },
  computed: {
    show_practices_link() {
      if (this.tabs && this.group_id) {
        return (
          this.tabs.find((group) => group.id === parseInt(this.group_id)) &&
          this.tabs.find((group) => group.id === parseInt(this.group_id))
            .is_practicant
        )
      } else return false
    },
  },
  watch: {
    group_id(newValue, oldValue) {
      if (newValue >= 0 && newValue !== oldValue) {
        this.stats_loading = true
        // this.$nextTick(() => {
        //   this.show_practices_link = (this.tabs.findIndex((group) => ((group.id === this.group_id) && group.is_practicant)) >=0 );
        // })
        // console.log(this.tabs, this.tabs.length)
        this.fetchGroupData().then(() => {
          this.group_loading = false
          this.fetchGroupStats().finally(() => {
            this.stats_loading = false
          })
        })
      }
    },

    page(newValue, oldValue) {
      if (newValue >= 0 && newValue !== oldValue) {
        this.$router.replace({
          path: this.$route.path,
          query: {
            type: 'lite',
            page: this.page,
            column: this.column,
            order: this.order,
          },
        })
        this.fetchStudents().then(() => {
          this.group_loading = false
          this.fetchLiteGroupStats().finally(() => {
            this.stats_loading = false
          })
        })
      }
    },

    order(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$router.replace({
          path: this.$route.path,
          query: {
            type: 'lite',
            page: this.page,
            column: this.column,
            order: this.order,
          },
        })
        this.fetchStudents().then(() => {
          this.group_loading = false
          this.fetchLiteGroupStats().finally(() => {
            this.stats_loading = false
          })
        })
      }
    },
  },
  mounted() {
    this.$store.dispatch('breadcrumbs/setLinks', [
      {
        text: 'Потоки',
        to: {
          name: 'Streams',
        },
      },
    ])

    this.fetchStreamData()
      .then(() => {
        this.$store.dispatch('breadcrumbs/addLink', {
          text: this.stream_name || 'Содержание модуля',
          disabled: true,
        })

        if (this.$route.query.type === 'lite') {
          this.fetchStudents().then(() => {
            this.group_loading = false
            this.fetchLiteGroupStats().finally(() => {
              this.stats_loading = false
            })
          })
        }

        this.tabs_loading = false
        if (!this.stream_fetch_error && this.tabs.length > 0) {
          // this.group_id = this.tabs[0].id
          if (!this.group_id) {
            this.$router.replace({
              name: 'StreamGroupIndex',
              params: {
                stream_id: this.stream_id,
                group_id: this.tabs[0].id,
              },
            })
          } else {
            // this.show_practices_link = (this.tabs.findIndex((group) => ((group.id === this.group_id) && group.is_practicant)) >=0 );
            this.fetchGroupData().then(() => {
              this.group_loading = false
              this.fetchGroupStats().finally(() => {
                this.stats_loading = false
              })
            })
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.tabs_loading = false
        if (this.stream_id === -1) {
          this.loading = false
        }
      })
  },
  methods: {
    async fetchStreamData() {
      await this.$axios
        .get(
          this.$route.query.type === 'lite'
            ? `teacher/lite/streams/${this.stream_id}`
            : `teacher/streams/${this.stream_id}`
        )
        .then((res) => {
          if (res && res.data && res.data.groups) {
            this.tabs = res.data.groups
            this.stream_name = res.data.name
          } else if (res && res.data && res.data.lectors) {
            this.practicant = res.data.lectors && res.data.lectors[0]
            this.stream_name = res.data.name
            this.description = res.data.description
            this.tabs = []
            this.chapters_count = res.data.chapters_count
          } else {
            this.tabs = []
          }
          this.is_lector = res.data.is_lector
          this.course_title = res.data.title
        })
        .catch((err) => {
          // this.stream_id = -1;
          this.loading = false
          console.error('CourseData fetch error:', err)
        })
    },

    async fetchStudents() {
      this.group_loading = true
      this.group = []
      await this.$axios
        .get(`teacher/lite/streams/${this.stream_id}/students`, {
          params: {
            page: this.page,
            column: this.column,
            order: this.order,
          },
        })
        .then((res) => {
          if (res && res.data) {
            this.group = res.data.data
            this.total_pages =
              res.data.meta &&
              Math.ceil(res.data.meta.total / res.data.meta.per_page)
          }
        })
    },

    async fetchGroupData() {
      this.group_loading = true
      this.group_fetch_error = false
      this.group = []
      await this.$axios
        .get('teacher/get-group/' + this.group_id)
        .then((res) => {
          if (res && res.data) {
            this.group = res.data.students
            this.group_title = res.data.name
            this.practicant = res.data.practicant
            this.total_events = res.data.total_events
            this.description = res.data.description
          }
        })
        .catch((err) => {
          console.error('Error fetching groups:', err)
        })
    },

    async fetchGroupStats() {
      this.stats_loading = true
      await this.$axios
        .get(`teacher/get-group/${this.group_id}/dashboard`) //to $axios
        .then((res) => {
          if (res && res.data) {
            // console.log('not-lite', res.data)
            let scores = res.data.scores.map((num) => {
              if (num) return num
              return 0
            })
            this.g_scores[0] = {
              name: 'Оценка',
              type: 'area',
              data: scores,
            }
            this.g_total_students = res.data.total_students_count
            this.g_total_passed = res.data.total_passed
            this.g_total_exercises = res.data.total_exercises
            this.chapter_titles = res.data.chapter_titles
          }
        })
    },

    async fetchLiteGroupStats() {
      this.stats_loading = true
      await this.$axios
        .get(`teacher/lite/streams/${this.stream_id}/dashboard`) //to $axios
        .then((res) => {
          if (res && res.data) {
            // console.log('lite', res.data)
            let scores = res.data.scores.map((num) => {
              if (num) return num
              return 0
            })
            this.g_scores[0] = {
              name: 'Оценка',
              type: 'area',
              data: scores,
            }
            this.g_total_students = res.data.total_students_count
            this.g_total_passed = res.data.total_passed
            this.g_total_exercises = res.data.total_exercises
            this.chapter_titles = res.data.chapter_titles
          }
        })
    },
  },
}
</script>

<style lang="scss">
p.group-description {
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.02em;
}

.users__v-pagination {
  background: transparent;

  .v-pagination__navigation--disabled {
    .theme--light.v-icon {
      color: rgba(23, 23, 41, 0.2);
    }
  }

  .v-pagination__navigation {
    box-shadow: none;
    /* UI Text/Element Disebled, Line color */

    border: 1px solid rgba(23, 23, 41, 0.2);
    box-sizing: border-box;
    border-radius: 4px;
    background: none !important;
  }

  .v-pagination__item.v-pagination__item--active {
    box-shadow: none;
    border: 1px solid rgba(23, 23, 41, 0.2);
    box-sizing: border-box;
    border-radius: 4px;
    background: #0bc3b8 !important;
  }

  .v-pagination__item {
    box-shadow: none;
    border: 1px solid rgba(23, 23, 41, 0.2);
    box-sizing: border-box;
    border-radius: 4px;
    background: none !important;
    outline: none !important;
  }
}
</style>
