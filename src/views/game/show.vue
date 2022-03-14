<template>
  <v-container>
    <v-row v-if="err.msg || err.code">
      <v-col cols="12">
        <v-alert
          elevation="4"
          type="warning"
          outlined
        >
          <span>{{ err.code + ": " }}</span>
          <span>{{ err.msg }}</span>
        </v-alert>
        <router-link
          class="d-block text-center"
          to="/"
        >На главную
        </router-link>
      </v-col>
    </v-row>
    <template v-else>
      <v-row>
        <v-col cols="12" class="d-flex no-wrap">
          <v-row no-gutters style="flex-wrap: nowrap">
            <v-col style="flex-basis: 1px">
              <h1 class="mb-0 pr-md-10 mr-md-10" style="line-height: 1.125em">
                {{ title }}
              </h1>
              <!-- <span class="d-block gray--text">{{ description }}</span> -->
            </v-col>
            <v-col cols="auto" align-self="center">
              <!-- v-if="telegram_href" -->
              <a
                class="d-flex pt-2"
                style="box-shadow: none; color: inherit; text-decoration: none"
              >
                <!-- :href="" -->
                <div class="pr-2" style="fill: currentColor">
                  <TelegramSvg/>
                </div>
                <span
                  style="font-weight: 400; font-size: 16px; line-height: 20px;margin-top: 3px"
                >
                  Чат в Телеграме
                </span
                >
              </a>
              <!--<v-btn @click="() => live = !live">Live</v-btn> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-tabs
        v-model="tab"
      >
        <v-tab

          href="#lect"
          class="text-capitalize chapter__tab"
          :ripple="false"
        >Лекция
        </v-tab>
          <v-tab
            v-if="exercises && exercises.length > 0"
            href="#prac"
            class="text-capitalize chapter__tab"
            :ripple="false"
          >Практика</v-tab>
      </v-tabs>
      <v-divider class="mb-8"/>
      <v-row v-if="loading">
        <v-col>
          <v-skeleton-loader type="article"/>
        </v-col>
      </v-row>
      <v-tabs-items
        v-else
        v-model="tab"
        touchless
      >
        <v-tab-item
          :value="'lect'"
        >
          <LessonInfo
            :status="status"
            :description="description"
          />
          <v-row
            class="pa-0 ma-0 mt-4"
          >
            <div
              v-for="(elem, idx) in lectures"
              :key="'elem-'+idx"
              style="width: 100%; height: 100%"
            >
              <div
                v-if="elem.type === 'lesson'"
              >
                <p
                  v-if="elem.user"
                  class="d-flex justify-start my-5"
                >
                  <v-avatar
                    size="40"
                    class="mr-3"
                  >
                    <v-img
                      :src="elem.user && elem.user.avatar || UserPlaceholderSm"
                    />
                  </v-avatar>
                  <span class="align-self-center font-weight-bold" style="font-size: 18px;"> {{ (elem.user && elem.user.first_name || '') + ' ' + (elem.user && elem.user.last_name || '') }}</span>
                </p>
                <div
                  v-html="decodeHTML(elem.content)"
                  :class="{'ml-13': elem.user}"
                ></div>
              </div>
              <div
                v-if="elem.type === 'video'"
                v-html="decodeHTML(elem.content)"
              ></div>
              <div
                v-if="elem.type === 'test'"
                style="margin-top: 80px"
              >
                <div
                  v-for="(q, q_idx) in elem.questions"
                  :key="q.id"
                >
                  <div
                    class="pa-5 my-5"
                    style="border: 2px solid rgba(23, 23, 41, 0.08); border-radius: 4px"
                  >
                    <p class="font-weight-bold" style="font-size: 18px">Вопрос №{{ q_idx + 1 }}</p>
                    <div
                      style="font-weight: 400 !important; font-size: 16px !important;"
                      v-html="decodeHTML(q.text)"
                    ></div>
                    <v-radio-group
                      v-model="checkedOptions[idx][q_idx]"
                      column
                      dense
                    >
                      <v-radio
                        v-for="opt in q.options"
                        :key="opt.id"
                        :value="opt.id"
                        :readonly="elem.auth_test_result && elem.auth_test_result.length>0"
                        :on-icon="mdiRecordCircle"
                        :ripple="false"
                        style="color: black"
                        :color="!!elem.auth_test_result.length && q.auth_user_answer && q.auth_user_answer.option_id === q.right_option_id
                      ? '#5CC689' : ((elem.auth_test_result.length > 0) && q.auth_user_answer && opt.id === q.auth_user_answer.option_id)
                        ? 'error' : ''"
                        class="lecture-question__radio"
                        @change="saveOption(opt.id, opt.question_id)"
                      >
                        <template v-slot:label>
                          <div>
                            <p
                              v-if="q.auth_user_answer && elem.auth_test_result.length === 0"
                              class="mb-0"
                              style="color: #171729; font-size: 14px"
                            >
                              {{ opt.value }}
                            </p>
                            <p
                              v-else
                              class="mb-0"
                              style="color: #171729; font-size: 14px"
                            >
                              {{ opt.value }}
                              <span
                                v-if="q.right_option_id === opt.id"
                                style="color: green;margin-left: 1rem"
                              >
                          <v-icon
                            style="color: green !important;"
                            class="mb-1"
                          >
                            {{ mdiCheck }}
                          </v-icon>
                          Верный ответ
                        </span>
                              <span
                                v-else-if="q.auth_user_answer && q.auth_user_answer.option_id === opt.id"
                                class="error--text"
                                style="margin-left: 1rem"
                              >
                          <v-icon
                            class="mb-1"
                            style="color: #F16635 !important;"
                          >
                            {{ mdiClose }}
                          </v-icon>
                          Неверный ответ
                        </span>
                            </p>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </div>
                  <div
                    v-if="q.hint && elem.auth_test_result.length > 0"
                    style="border-left: 2px solid #5CC689; padding-left: 40px;margin: 30px 0 80px 0"
                  >
                    <div v-html="decodeHTML(q.hint)"></div>
                  </div>
                </div>
                <v-btn
                  v-if="elem.auth_test_result.length === 0"
                  tile
                  :color="'#0BC4B8'"
                  class="float-right mb-6 text-capitalize"
                  :ripple="false"
                  :disabled="!!checkedOptions[idx] && checkedOptions[idx].indexOf(null) > -1"
                  style="color: white"
                  :elevation="0"
                  @click="finishTest(elem.id)"
                >
                  Проверить ответы
                </v-btn>
              </div>
            </div>
          </v-row>
        </v-tab-item>
        <v-tab-item value="prac">
          <LessonPractice
            v-if="exercises && exercises.length"
            v-model="practiceProgress"
            :fetching="loading"
            :course-type="course_id"
            :exercises="exercises || []"
            @setProgress="handleSetProgress"
          />
          <v-row v-else>
            <v-col cols="12">
              <p>У урока нет задач</p>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </template>
    <div
      class="chapter-nav"
    >
      <v-btn
        v-if="loading"
        block
        rounded
        outlined
        :ripple="false"
        color="#0BC3B8"
        class="chapter-nav__btn"
        disabled
      >
        Загрузка...
      </v-btn>
      <v-tooltip
        v-if="nextChapterId
          && !loading
        "
        :disabled="
          (next_available
            || ((min_progress >= 0)
            && (testProgress >= min_progress)
            && (practiceProgress >= min_progress))
          )
        "
        top
      >
        <template v-slot:activator="{ on }">
          <div
            v-on="on"
            class="chapter-nav__btn-container"
          >
            <v-btn
              :disabled="
                !(next_available
                  || ((min_progress >= 0)
                  && (testProgress >= min_progress)
                  && (practiceProgress >= min_progress))
                )
              "
              fab
              outlined
              :ripple="false"
              small
              style="background-color: white"
              color="#0BC3B8"
              class="chapter-nav__btn change-chapter-button--disabled float-right mb-2"
              :to="(next_available
                  || ((min_progress >= 0)
                  && (testProgress >= min_progress)
                  && (practiceProgress >= min_progress))
                ) ? {
                name: 'GameShow',
                params: {
                  chapter_id: nextChapterId
                }
              } : undefined"
            >
              <p class="show-chapter-text ma-0 pa-0 ml-4 mr-3">К следующему уроку</p>
              <v-icon>
                {{ mdiArrowRight }}
              </v-icon>
            </v-btn>
          </div>
        </template>
        <span>Необходимо решить {{ min_progress }}% задач и тестов</span>
      </v-tooltip>
      <v-btn
        v-if="prevChapterId && !loading"
        fab
        small
        outlined
        :ripple="false"
        style="background-color: white"
        class="chapter-nav__btn float-right"
        :to="{
          name: 'GameShow',
          params: {
            chapter_id: prevChapterId
          }
        }"
      >
        <!--          <div class="chapter-nav__arrow">-->
        <!--            <ArrowRight/>-->
        <!--          </div>-->
        <v-icon>
          {{ mdiArrowLeft }}
        </v-icon>
        <p class="show-chapter-text ma-0 pa-0 ml-2">К предыдущему уроку</p>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import TelegramSvg from '@/assets/svg/telegram_logo.svg'
import { mdiRecordCircle, mdiCheck, mdiClose, mdiArrowLeft, mdiArrowRight } from '@mdi/js'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import LessonInfo from "@/components/Lesson/LessonInfo";
import LessonPractice from "@/components/Lesson/LessonPractice";
import { decodeHTML } from "@/helpers";

export default {
  name: "GameShow",
  components: {
    LessonInfo,
    LessonPractice,
    TelegramSvg,
  },
  props: ['chapter_id'],
  data() {
    return {
      loading: false,
      UserPlaceholderSm,
      mdiRecordCircle,
      mdiCheck,
      mdiClose,
      mdiArrowRight,
      mdiArrowLeft,
      err: {
        code: "",
        msg: "",
      },
      title: undefined,
      lectures: undefined,
      checkedOptions: [],
      finished: false,
      tab: 'lect',
      status: undefined,
      date: undefined,
      description: undefined,
      course_title: undefined,
      course_id: undefined,
      exercises: [],
      practiceProgress: undefined,
      testProgress: undefined,
      nextChapterId: undefined,
      prevChapterId: undefined,
      next_available: undefined,
      min_progress: undefined,
    }
  },
  watch: {
    chapter_id: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        this.practiceProgress = undefined;
        this.testProgress = undefined;
        this.tab = 'lect'
        this.loading = true
        this.fetchLectures().then(() => {
          this.$nextTick(() => {
            // this.requestAttended();
            this.$store.dispatch("breadcrumbs/setLinks", [
              {
                text: this.course_title,
                to: {
                  name: "CourseShow",
                  params: {
                    course_id: this.course_id,
                    ...(this.module_id && { active_module_id: this.module_id })
                  },
                },
                back: true,
                'font-normal': true,
                underlined: true,
              },
              {
                text: this.title,
                disabled: true,
                // to: { name: 'LessonShow', params: { lesson_id: this.lesson_id }}
              },
            ]);
          });
        }).finally(() => {
          this.loading = false;
        });
      }
    }
  },

  methods: {
    decodeHTML,
    async fetchLectures() {
      await this.$axios.get(`game/chapter/${this.chapter_id}`)
        .then(res => {
          if (res && res.data) {
            // console.log('game-ch', res.data)
            this.title = res.data.title
            this.lectures = res.data.lectures
            this.description = res.data.description
            this.status = res.data.status
            this.course_id = res.data.course_module && res.data.course_module.course_id
            this.course_title = res.data.course_module && res.data.course_module.title
            this.exercises = (res.data.practice && res.data.practice.exercises) || []
            this.practiceProgress = this.exercises.length // if lessons has no exercises then 100
              ? (this.exercises.filter(e => e.auth_user_result).length / this.exercises.length) * 100
              : 100
            this.testProgress = this.lectures.length // if lessons has no exercises then 100
              ? (this.lectures.filter(test => test.type === 'test' && (test.auth_test_result.length > 0)).length / this.lectures.filter(t => t.type === 'test').length) * 100
              : 100
            this.checkedOptions = res.data.lectures.map(elem => {
              if(elem.type === 'test') {
                return elem.questions.map(q => q.auth_user_answer && q.auth_user_answer.option_id)
              }
            })
            this.min_progress = res.data.min_progress
            this.next_available = res.data.next_available
            this.nextChapterId = res.data.next_chapter && res.data.next_chapter.id;
            this.prevChapterId = res.data.prev_chapter && res.data.prev_chapter.id;
          }
        })
        .catch((err) => {
          console.error('err', err);
          this.err.code = (err.response && err.response.status) || '0';
          this.err.msg = (err.response && err.response.data.message) || 'Ошибка';
          this.lectures = undefined;
          this.videos = undefined;
          this.title = undefined;
          this.description = undefined;
          this.exercises = undefined;
          this.practiceProgress = undefined;
          this.nextChapterId = undefined;
          this.prevChapterId = undefined;
          this.course_id = undefined;
          this.module_id = undefined;
          this.course_title = undefined;
          this.next_available = undefined;
          this.min_progress = undefined;
          this.chapters = undefined;
          throw err;
        });
    },

    async saveOption(opt_id, que_id) {
      await this.$axios.post('/answers/store', {
        user_id: this.$store.state.user.id,
        question_id: que_id,
        option_id: opt_id
      })
        .then(res => {
          // TODO Сделать здесь что нибудь
          if (res) {
            console.log("OK")
          }
        })
    },

    changeQuestions(test_id, questions) {
      this.lectures.forEach(elem => {
        if(elem.type === 'test' && elem.id === test_id) {
          elem.questions = questions
        }
      })
    },

    async finishTest(test_id) {
      await this.$axios.post('/answers/finish', {
        test_id: parseInt(test_id),
        user_id: this.$store.state.user.id
      }).then(res => {
        if (res && res.data){
          // console.log('test', res.data)
          this.changeQuestions(test_id, res.data.questions)
          this.fetchLectures()
        }
      }).finally(() => {
        this.loading = false
      })
    },

    handleSetProgress(val) {
      this.practiceProgress = val * 100
    },
  }
}
</script>

<style lang="scss">
.lecture-question__radio:not(.v-item--active) {
  .v-input--selection-controls__input {
    .v-icon {
      color: rgba(23, 23, 41, 0.08) !important;
    }
  }
}
</style>
