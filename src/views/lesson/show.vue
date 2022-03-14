<template>
  <v-container>
    <v-row v-if="err.msg || err.code">
      <v-col cols="12">
        <v-alert elevation="4" type="warning" outlined>
          <span>{{ err.code + ': ' }}</span>
          <span>{{ err.msg }}</span>
        </v-alert>
        <router-link class="d-block text-center" to="/">На главную</router-link>
      </v-col>
    </v-row>
    <template v-else>
      <div class="d-flex flex-wrap align-center mb-4">
        <v-row no-gutters class="flex-wrap">
          <v-col>
            <h1
              class="mb-0 pr-5 pr-md-10 mr-md-10"
              style="line-height: 1.125em"
            >
              {{ title }}
            </h1>
          </v-col>
        </v-row>
      </div>
      <v-row justify="space-between">
        <v-col class="course-container-tabs pb-0" cols="auto">
          <v-tabs v-model="tab">
            <v-tab
              href="#lect"
              class="text-capitalize chapter__tab"
              :ripple="false"
              >Лекция
            </v-tab>
            <v-tab
              href="#prac"
              class="text-capitalize chapter__tab"
              :ripple="false"
              :disabled="
                exerciseTabDisabled || !(exercises && exercises.length > 0)
              "
            >
              <v-icon
                v-if="
                  exerciseTabDisabled || !(exercises && exercises.length > 0)
                "
                small
                >{{ mdiLock }}
              </v-icon>
              {{ 'Практика ' }}
              <span
                style="font-weight: 400;"
                v-if="exerciseTabDisabled && exerciseTabMinutes >= 0"
              >
                {{
                  exerciseTabMinutes > 0
                    ? ' (откроется через ' + exerciseTabMinutes + ' мин)'
                    : '(Скоро)'
                }}
              </span>
            </v-tab>
            <v-tab
              v-if="hw_exercises && hw_exercises.length"
              href="#hw"
              class="text-capitalize chapter__tab"
              :ripple="false"
              :disabled="
                exerciseTabDisabled ||
                  !(hw_exercises && hw_exercises.length > 0)
              "
            >
              <v-icon
                v-if="
                  exerciseTabDisabled ||
                    !(hw_exercises && hw_exercises.length > 0)
                "
                small
                >{{ mdiLock }}
              </v-icon>
              {{ 'Домашняя работа ' }}
              <span
                style="font-weight: 400;"
                v-if="exerciseTabDisabled && exerciseTabMinutes >= 0"
              >
                {{
                  exerciseTabMinutes > 0
                    ? ' (откроется через ' + exerciseTabMinutes + ' мин)'
                    : '(Скоро)'
                }}
              </span>
            </v-tab>
            <v-tab
              v-if="tests && tests.length > 0"
              href="#test"
              class="text-capitalize chapter__tab"
              :ripple="false"
              >Тест
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <v-divider class="mt-3 mb-2" style="opacity: 0.8" />
      <v-row v-if="loading">
        <v-col>
          <v-skeleton-loader type="article" />
        </v-col>
      </v-row>
      <template v-else>
        <v-tabs-items v-model="tab" touchless>
          <!-- LECTURE -->
          <v-tab-item value="lect" class="py-3">
            <template v-if="lessons">
              <v-row>
                <v-col cols="9">
                  <lesson-videos :videos="lesson_videos" />
                  <LessonRecording
                    v-if="live_url"
                    :title="title"
                    :url="live_url"
                  />
                  <div
                    v-for="(lesson, lessonId) in lessons"
                    :key="'l-content+' + lessonId"
                    class="lecture"
                    v-html="decodeHTML(lesson.content)"
                  ></div>
                  <div
                    class="mt-8 d-flex justify-center"
                    v-if="exercises && exercises.length > 0"
                  ></div>
                </v-col>
                <v-col cols="3">
                  <h1
                    style="font-weight: 600;font-size: 20px;line-height: 24px;"
                  >
                    О лекции
                  </h1>
                  <p
                    class="ma-0 mt-2"
                    style="color: #828BAB; font-size: 14px; line-height: 20px"
                  >
                    Дата и время начала:
                    <b style="color: #000000">{{ start_date | longFormat }} </b>
                  </p>
                  <p
                    key="ma-0 mt-2"
                    style="color: #828BAB; font-size: 14px; line-height: 20px"
                  >
                    Преподователь:
                    <span style="color: #4376FB"
                      >{{ lector.first_name }} {{ lector.last_name }}</span
                    >
                  </p>
                  <LessonAdditionalMaterials
                    v-if="additional_materials && additional_materials.length"
                    :materials="additional_materials"
                  />
                </v-col>
              </v-row>
            </template>
            <p v-else>Нет данных</p>
          </v-tab-item>
          <!-- PRACTICE -->
          <v-tab-item value="prac">
            <LessonPractice
              v-if="exercises && exercises.length"
              :fetching="exercisesFetching"
              :eventId="Number(lesson_id)"
              :status="status"
              :course-type="course_id"
              :exercises="exercises || []"
              :teacher="practicant"
              :deadline="deadline"
            />
            <v-row v-else>
              <v-col cols="12">
                <p>Практика будет открыта во время урока</p>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item value="hw">
            <LessonPractice
              v-if="hw_exercises && hw_exercises.length"
              :fetching="exercisesFetching"
              :eventId="Number(lesson_id)"
              :course-type="course_id"
              :status="status"
              :exercises="hw_exercises || []"
              :teacher="practicant"
              :deadline="deadline"
              :current_exercise="$route.query.exercise"
            />
            <v-row v-else>
              <v-col cols="12">
                <p>Практика будет открыта во время урока</p>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item v-if="tests.length > 0" value="test">
            <v-row align="center" justify="center">
              <v-col cols="12">
                <LessonTest :tests="tests" :lesson_id="lesson_id"></LessonTest>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </template>
    </template>
    <ScrollToTop />
  </v-container>
</template>

<script>
import { mdiLock, mdiArrowLeft } from '@mdi/js'
import { decodeHTML } from '@/helpers'

import { YouTubeGetID } from '@/helpers'
import LessonPractice from '@/components/Lesson/LessonPractice'
import LessonTest from '@/components/Lesson/LessonTest'
import LessonVideos from '@/components/Lesson/LessonVideos'
import LessonAdditionalMaterials from '@/components/Lesson/LessonAdditionalMaterials'
import LessonRecording from '@/components/Lesson/LessonRecording'
import ScrollToTop from '@/components/ScrollToTop'

export default {
  name: 'LessonShow',
  components: {
    ScrollToTop,
    LessonRecording,
    LessonAdditionalMaterials,
    LessonPractice,
    LessonTest,
    LessonVideos,
  },
  filters: {
    new_dateFilter(d) {
      let date = new Date(Date.parse(d.replace(/ /g, 'T')))
      if (!date) return ''
      let day = date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'short',
      })
      let time = date.toLocaleTimeString('ru-RU', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
      return day.replace(/.$/, ',') + ' в ' + time
    },
  },
  props: ['lesson_id', 'chapter_id'],
  data() {
    return {
      mdiLock,
      mdiArrowLeft,
      tests: '',
      course_id: '',
      module_id: undefined,
      courseModuleTitle: '',
      description: '',
      err: {
        code: '',
        msg: '',
      },
      exercisesFetching: false,
      exercisesTimerUpdate: undefined,
      exerciseTabActivatesIn: undefined,
      exerciseTabMinutes: '',
      exerciseStartsAt: '',
      exerciseTabDisabled: false,
      exercises: [],
      hw_exercises: [],
      bonus_exercises: [],
      additional_materials: undefined,
      lector: undefined,
      lessons: undefined,
      lesson_videos: [],
      live: false,
      live_url: undefined,
      loading: true,
      practicant: undefined,
      selected: null,
      server_time: undefined,
      start_date: undefined,
      status: undefined,
      tab: 'lect',
      telegram_href: '',
      timeOffset: undefined,
      title: '',
      deadline: undefined,
      fromExercisesIndex: false,
      show_review_dialog: false,
    }
  },
  computed: {
    embedSrc() {
      try {
        return YouTubeGetID(this.live_url)
      } catch (error) {
        return false
      }
    },

    bonus_available() {
      let all_exercises = [...this.exercises, ...this.hw_exercises]
      let count = all_exercises.filter((ex) => ex.auth_user_result).length
      return (count / all_exercises.length) * 100 >= 80
    },
  },
  watch: {
    live: function(/*value*/) {
      // this.$vuetify.theme.dark = value;
      if ((this.live && !this.exercises) || !this.exercises.length) {
        this.exerciseTabDisabled = true
        // this.exercisesFetchTimeout = window.setTimeout(
        //   this.fetchExercises,
        //   2*1000, 'That was really slow!');
        this.$nextTick(() => {
          this.updateExerciseTimerMinutes()
          this.exercisesTimerUpdate = window.setInterval(
            this.updateExerciseTimerMinutes,
            15000
          )
        })
      }
    },

    tab: function(value) {
      if (value === undefined) {
        this.$nextTick(() => {
          this.tab = 'info'
        })
      } else if (
        ['prac', 'hw'].includes(value) &&
        this.live &&
        (!this.practice || !(this.practice.length > 0))
      ) {
        // fetch practice here
        this.fetchPractice()
      }
    },
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === 'LessonTestShow') {
        vm.tab = 'test'
      } else if (from.name === 'ExercisesIndex') {
        vm.tab = 'prac'
        vm.fromExercisesIndex = true
      }
    })
  },

  mounted() {
    this.fetchTests()
    this.fetchEvent()
      .then(() => {
        this.$nextTick(() => {
          this.requestAttended()
          this.$store.dispatch('breadcrumbs/setLinks', [
            !this.fromExercisesIndex
              ? {
                  text: this.courseModuleTitle,
                  to: {
                    name: 'CourseShow',
                    params: {
                      course_id: this.course_id,
                      ...(this.module_id && {
                        active_module_id: this.module_id,
                      }),
                    },
                  },
                  back: true,
                  'font-normal': true,
                  underlined: true,
                }
              : {
                  text: 'Мои задания',
                  to: {
                    name: 'ExercisesIndex',
                  },
                  back: true,
                  'font-normal': true,
                  underlined: true,
                },
            {
              text: this.title,
              disabled: true,
              'font-normal': true,
            },
          ])
        })
      })
      .finally(() => {
        this.loading = false
      })
  },

  destroyed() {
    this.$vuetify.theme.dark = false
  },

  methods: {
    decodeHTML,
    handleTabClick(tabName) {
      if (
        tabName === 'prac' &&
        (this.exerciseTabDisabled ||
          !(this.exercises && this.exercises.length > 0))
      ) {
        return
      }
      this.tab = tabName
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
    async requestAttended() {
      if (this.lesson_id) {
        await this.$axios
          .get('/make-me-attended/' + this.lesson_id)
          .then((res) => {
            if (res && res.data) {
              console.log('Урок отмечен как пройденный')
            }
          })
          .catch((err) => {
            if (
              err.response &&
              err.response.status &&
              err.response.status === 406
            ) {
              console.log('Урок уже закончился!')
            } else if (
              err.response &&
              err.response.status &&
              err.response.status === 425
            ) {
              console.log('Урок еще не начался!')
            } else {
              throw err
            }
          })
      }
    },

    async fetchEvent() {
      let fetch_url = this.lesson_id
        ? '/get-event/' + this.lesson_id
        : this.chapter_id
        ? '/get-chapter/' + this.chapter_id
        : ''
      await this.$axios
        .get(fetch_url)
        .then((res) => {
          if (res && res.data) {
            let {
              chapter,
              course_module,
              is_live,
              lector,
              lectures,
              live_url,
              practicant,
              practice,
              practice_starts_at,
              homework,
              server_time,
              videos,
              starts_at,
              status,
              telegram_chat,
              deadline,
              bonus,
              additional_materials,
            } = res.data
            this.live = is_live
            this.start_date = starts_at
            this.lector = lector
            this.live_url = live_url
              ? 'https://youtube.com/embed' +
                live_url.slice(live_url.lastIndexOf('/'))
              : undefined
            this.title = chapter.title
            this.server_time = server_time
            this.timeOffset =
              new Date(server_time.replace(/-/g, '/')).getTime() -
              new Date().getTime()
            this.exerciseStartsAt = practice_starts_at
            this.module_id = course_module.id
            this.course_id = course_module.course_id
            this.courseModuleTitle = course_module.title
            this.description = chapter.description
            this.lessons = [...lectures]
            this.exercises = (practice && practice.exercises) || []
            this.hw_exercises = (homework && homework.exercises) || []
            this.bonus_exercises = (bonus && bonus.exercises) || []
            this.status = status
            this.telegram_href = telegram_chat
            this.practicant = practicant
            this.lesson_videos = videos || []
            this.deadline = deadline
            this.additional_materials = additional_materials || []
          }
        })
        .catch((err) => {
          console.error(err)
          if (err.response && err.response.status) {
            this.err.code = err.response.status
          } else {
            this.err.code = '000'
          }
          this.err.msg = 'Ошибка'
          throw err
        })
    },

    async fetchTests() {
      await this.$axios
        .get('/events/' + this.lesson_id + '/tests')
        .then((res) => {
          if (res && res.data) {
            this.tests = res.data.tests
          }
        })
    },

    async fetchPractice() {
      await this.$axios.get('/get-event/' + this.lesson_id).then((res) => {
        if (res && res.data) {
          let { practice, homework, bonus } = res.data
          this.exercises = (practice && practice.exercises) || []
          this.hw_exercises = (homework && homework.exercises) || []
          this.bonus_exercises = (bonus && bonus.exercises) || []
        }
      })
    },

    updateExerciseTimerMinutes() {
      let minutes =
        (new Date(this.exerciseStartsAt) - this.timeOffset - new Date()) / 60000
      if (minutes < 0) {
        this.exerciseTabDisabled = false
        window.clearInterval(this.exercisesTimerUpdate)
      }
      this.exerciseTabMinutes = Math.floor(minutes)
    },

    escapeHtml(text) {
      let map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
      }
      return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {
        return map[m]
      })
    },
  },
}
</script>

<style lang="scss">
.theme--dark {
  .lecture {
    code {
      display: inherit;
      background: #d6d6e6;
      color: black;
    }
  }
}

.lecture {
  code {
    display: inherit;
    background: #f8f8f8;
    padding: 0.25rem 0.5rem;
    border-radius: 5px;
    color: black;
  }

  p {
    letter-spacing: normal !important;
    font-family: 'Inter', sans-serif !important;
    letter-spacing: 2% !important;
  }

  img {
    max-width: 100%;
    height: auto;
  }
}

.course-container-tabs {
  letter-spacing: 0.02em;
  padding-bottom: 22px;

  a.course-container-tabs__tab-link {
    color: rgba(159, 164, 177, 1);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
  }

  a.course-container-tabs__tab-link:not(:last-child) {
    margin-right: 32px;
  }

  a.course-container-tabs__tab-link--active {
    color: #66f0e3;
  }

  a.course-container-tabs__tab-link--disabled {
    color: #9fa4b1;
    cursor: default;
  }
}

.chapter__tab:not(.v-tab--active) {
  color: #171729 !important;
  font-weight: 600 !important;
}

.chapter__tab {
  &::before {
    background-color: transparent;
  }
}

.lesson__show-bonus-exercises {
  color: #0bc3b8 !important;
  background-color: rgba(11, 195, 184, 0.12) !important;
  user-select: none;

  &--disabled {
    color: #9fa4b1 !important;
    background-color: rgba(23, 23, 41, 0.08) !important;
    cursor: default !important;

    path {
      fill: #9fa4b1;
    }
  }
}
</style>
