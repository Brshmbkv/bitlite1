<template>
  <v-container>
    <v-btn
      v-if="!(err.msg || err.code)"
      fixed
      right
      fab
      :ripple="false"
      elevation="0"
      outlined
      style="background-color: white"
      class="mr-sm-4"
      @click="drawer = true"
    >
      <v-icon>
        {{ mdiText }}
      </v-icon>
    </v-btn>
    <v-navigation-drawer
      v-model="drawer"
      right
      fixed
      temporary
      hide-overlay
      dark
      width="300"
      color="#171729"
    >
      <v-list dense>
        <v-list-item-title
          class="ml-8 mt-6 mb-8 font-weight-bold"
          style="font-size: 22px; line-height: 24px"
        >
          Уроки
        </v-list-item-title>
        <v-list-item
          v-for="(item, idx) in chapters"
          :key="item.id"
          link
          :to="{
                name: 'ChapterShow',
                params: {
                  chapter_id: item.id
                }
             }"
          :disabled="parseInt(chapter_id) !== item.id &&
            ((idx-1>=0 && chapters[idx-1].auth_user_result!==null && !chapters[idx-1].auth_user_result.next_available)
            || (idx-1>=0 && chapters[idx-1].auth_user_result === null))
          "
          :input-value="parseInt(chapter_id) === item.id"
          :active-class="(item.auth_user_result && item.auth_user_result.completed_at) ? 'completed--chapter' : 'active--chapter'"
          :class="(item.auth_user_result!==null) ? (item.auth_user_result && item.auth_user_result.completed_at) ? 'completed--chapter' : 'not--active--chapter' : 'disabled--chapter not--active--chapter'"
          :ripple="false"
        >
          <v-list-item-content>
            <v-list-item-title
              class="ml-4 my-2"
            >{{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
        >Практика
        </v-tab>
        <v-tab
          v-if="tests && tests.length > 0"
          href="#test"
          class="text-capitalize chapter__tab"
          :ripple="false"
        >Тест
        </v-tab>
      </v-tabs>
      <v-divider class="mb-8"/>


      <!-- <v-row>
        <v-col class="course-container-tabs" cols="12">
          <a
            class="course-container-tabs__tab-link"
            :class="tab === 'lect' && 'course-container-tabs__tab-link--active'"
            @click.prevent="handleTabClick('lect')"
          >Лекция</a>
          <a
            v-if="exercises && exercises.length > 0"
            class="course-container-tabs__tab-link"
            :class="{
              'course-container-tabs__tab-link--active': tab === 'prac',
            }"
            @click.prevent="handleTabClick('prac')"
          >Практика</a>
          <a
            v-if="tests && tests.length > 0"
            class="course-container-tabs__tab-link"
            :class="{
              'course-container-tabs__tab-link--active': tab === 'test',
            }"
            @click.prevent="handleTabClick('test')"
          >Тест</a>
        </v-col>
      </v-row> -->
      <v-row v-if="loading">
        <v-col>
          <v-skeleton-loader type="article"/>
        </v-col>
      </v-row>
      <template v-else>
        <!--        <ChapterFinalDialog-->
        <!--          ref="finalDialog"-->
        <!--          :dialog="showModal"-->
        <!--          :to="to"-->
        <!--          @close-dialog="() => {-->
        <!--            this.showModal = false-->
        <!--            this.modalOpened = true-->
        <!--          }"-->
        <!--        />-->
        <v-tabs-items v-model="tab" touchless>
          <!-- LECTURE -->
          <v-tab-item value="lect" class="py-3">
            <LessonReview
            v-if="show_review_dialog"
            :event_id="Number(chapter_id)"
            :noteable_type="'chapter'"
            @close-dialog="show_review_dialog = false"
          />
            <v-btn
              v-else
              fab
              fixed
              bottom
              right
              :ripple="false"
              @click="show_review_dialog = true"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 13H20" stroke="#F16635" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 17H20" stroke="#F16635" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.7087 24.4854L16.8575 27.5708C16.7686 27.7189 16.643 27.8414 16.4927 27.9265C16.3424 28.0116 16.1727 28.0563 16 28.0563C15.8273 28.0563 15.6576 28.0116 15.5073 27.9265C15.357 27.8414 15.2314 27.7189 15.1425 27.5708L13.2913 24.4854C13.2025 24.3374 13.0768 24.2148 12.9265 24.1297C12.7762 24.0447 12.6065 23.9999 12.4338 23.9999H5C4.73478 23.9999 4.48043 23.8946 4.29289 23.7071C4.10536 23.5195 4 23.2652 4 22.9999V7C4 6.73478 4.10536 6.48043 4.29289 6.29289C4.48043 6.10536 4.73478 6 5 6H27C27.2652 6 27.5196 6.10536 27.7071 6.29289C27.8946 6.48043 28 6.73478 28 7V23C28 23.2652 27.8946 23.5196 27.7071 23.7071C27.5196 23.8946 27.2652 24 27 24L19.5662 23.9999C19.3935 23.9999 19.2238 24.0447 19.0735 24.1297C18.9232 24.2148 18.7975 24.3374 18.7087 24.4854V24.4854Z" stroke="#F16635" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </v-btn>
            <div
              ref="videoContent"
              v-if="chapter_videos && (chapter_videos.length === 1)"
              :key="'vid_' + chapter_id"
              v-html="decodeHTML(chapter_videos[0].content)"
            >
            </div>
            <lesson-videos
              v-else-if="chapter_videos && (chapter_videos.length > 1)"
              :videos="chapter_videos"
              :key="'vid_' + chapter_id"
            />
            <template v-if="lectures">
              <template v-for="(lesson, chapter_id) in lectures">
                <h2
                  class="mb-4"
                  :key="'l-title_' + chapter_id"
                >
                  {{ lesson.title }}
                </h2>
                <div
                  :key="'l-content_' + chapter_id"
                  class="lecture"
                  v-html="decodeHTML(lesson.content)"
                ></div>
              </template>
              <div class="mt-8 d-flex justify-center"
                   v-if="exercises && exercises.length > 0"
              >
                <v-btn
                  @click="handleTabClick('prac')"

                >Перейти к практике
                </v-btn>
              </div>
            </template>
            <p
              v-else-if="
                !(videos && videos.length > 0)
                && !(lessons && lessons.length > 0)
              "
            >Нет данных</p>
          </v-tab-item>
          <!-- PRACTICE -->
          <v-tab-item value="prac">
            <lesson-practice
              v-model="practiceProgress"
              v-if="exercises && exercises.length"
              :fetching="loading"
              :event-id="event_id && event_id"
              :course-type="course_id"
              :exercises="exercises || []"
              :deadline="deadline"
              :status="status"
              @setProgress="handleSetProgress"
            />
            <v-row v-else>
              <v-col cols="12">
                <p>У урока нет задач</p>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item value="test" v-if="tests.length>0">
            <!-- Add this to status after returning dark LIVE -->
            <!-- 'color': live ? 'live-white' : 'practice', -->
            <v-row
              align="center"
              justify="center"
            >
              <v-col
                cols="12"
              >
                <chapter-test
                  :tests="tests"
                  :chapter_id="chapter_id"
                ></chapter-test>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </template>
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
          (!!next_available
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
                  || (min_progress >= 0)
                  && (testProgress >= min_progress)
                  && (practiceProgress >= min_progress)
                )
              "
              fab
              outlined
              :ripple="false"
              small
              color="#0BC3B8"
              :style="{
                backgroundColor: !drawer ? 'white' : 'transparent'
              }"
              class="chapter-nav__btn change-chapter-button--disabled float-right mb-2"
              :to="{
                name: 'ChapterShow',
                params: {
                  chapter_id: nextChapterId
                }
              }"
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
        class="chapter-nav__btn float-right"
        :style="[!drawer ? {'background-color': 'white'} : {'background-color': 'transparent', 'color':'white'}]"
        :to="{
          name: 'ChapterShow',
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
import { mdiLock, mdiText, mdiArrowRight, mdiArrowLeft } from "@mdi/js";
import { decodeHTML } from "@/helpers";
import ChapterTest from "@/components/Chapter/ChapterTest";
import LessonPractice from "@/components/Lesson/LessonPractice";
import LessonVideos from "@/components/Lesson/LessonVideos"
import VimeoPlayer from "@vimeo/player";
import LessonReview from "@/components/Lesson/LessonReview";

export default {
  name: "ChapterShow",
  components: {
    LessonReview,
    LessonVideos,
    LessonPractice,
    ChapterTest,
  },
  props: [
    'chapter_id',
  ],
  data() {
    return {
      mdiLock,
      mdiText,
      mdiArrowRight,
      mdiArrowLeft,
      drawer: false,
      lectures: undefined,
      loading: true,
      chapter_videos: undefined,
      nextChapterId: undefined,
      prevChapterId: undefined,
      title: undefined,
      description: undefined,
      practice: undefined,
      tests: [],
      course_id: undefined,
      module_id: undefined,
      event_id: undefined,
      course_title: undefined,
      err: {
        code: "",
        msg: "",
      },
      practiceProgress: undefined,
      testProgress: undefined,
      exercises: [],
      practicant: undefined,
      selected: null,
      server_time: undefined,
      start_date: undefined,
      status: undefined,
      tab: "lect",
      next_available: undefined,
      min_progress: undefined,
      chapters: [],
      deadline: undefined,
      showModal: false,
      modalOpened: false,
      to: undefined,
      show_review_dialog: false
    };
  },
  watch: {
    chapter_id: {
      // the callback will be called immediately after the start of the observation
      immediate: true,
      handler() {
        this.practiceProgress = undefined;
        this.testProgress = undefined;
        this.tab = 'lect'
        this.fetchLightChapters().then(() => {
          this.fetchTests();
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
              },
            ]);
          });
        }).finally(() => {
          this.loading = false;
          let vm = this
          this.$nextTick(() => {
            try {
              if(this.$refs.videoContent) {
                let iframe = this.$refs.videoContent
                let player = new VimeoPlayer(iframe)
                player.on('ended', function() {
                  vm.showModal = true
                })
              }
            } catch(e) {
              console.log(e)
            }
          })
        });
      }
    }
  },
  // created() {
  //   // var iframe = document.getElementById('finalVideo');
  //   // console.log(1, this.$refs.videoContent)
  //   // if (iframe) {
  //   //   var vPlayer = new VimeoPlayer(iframe);
  //   //   setInterval(function ()
  //   //   {
  //   //     console.log(iframe);
  //   //     console.log(vPlayer);
  //   //     var currtym = vPlayer.getCurrentTime();
  //   //     console.log(currtym);
  //   //     var currentTime = 0;
  //   //     vPlayer.getCurrentTime().then(function() {});
  //   //     console.log(currentTime);
  //   //   }, 1000);
  //   // }
  // },
  methods: {
    decodeHTML,

    async fetchTests() {
      await this.$axios.get('/lite/chapter/' + this.chapter_id + '/tests')
        .then((res) => {
          if(res && res.data) {
            this.tests = res.data.tests;
            this.testProgress = this.tests.length // if lessons has no exercises then 100
              ? (this.tests.filter(test => test.test_results && (test.test_results.length > 0)).length / this.tests.length) * 100
              : 100
          }
          // = (!this.tests.length)
          //   || (this.tests.every(test => test.test_results && (test.test_results.length > 0)));
        })

    },

    handleTabClick(tabName) {
      if(tabName === 'prac' && !(this.exercises && this.exercises.length > 0)) {
        return
      }
      this.tab = tabName;
    },

    handleSetProgress(val) {
      this.practiceProgress = val * 100
    },

    handleSetTestComplete(val) {
      this.testProgress = val * 100
    },

    async fetchLightChapters() {
      this.err = {
        code: "",
        msg: "",
      };
      this.loading = true;
      let fetch_url = '/lite/chapter/' + this.chapter_id;
      await this.$axios.get(fetch_url).then((res) => {
        if(res && res.data) {
          // console.log(fetch_url, res.data);
          let {
            course_module,
            description,
            lectures,
            next_chapter,
            practice,
            prev_chapter,
            title,
            videos,
            next_available,
            min_progress,
            deadline,
            event_id,
            status,
          } = res.data;
          this.lectures = lectures;
          this.chapter_videos = videos;
          this.title = title;
          this.description = description;
          this.exercises = practice && practice.exercises || [];
          this.practiceProgress = this.exercises.length // if lessons has no exercises then 100
            ? (this.exercises.filter(e => e.auth_user_result).length / this.exercises.length) * 100
            : 100
          this.nextChapterId = next_chapter && next_chapter.id;
          this.prevChapterId = prev_chapter && prev_chapter.id;
          this.course_id = course_module.course_id;
          this.module_id = course_module.id;
          this.course_title = course_module.title;
          this.next_available = next_available;
          this.min_progress = min_progress;
          this.chapters = course_module.chapters
          this.deadline = deadline
          this.event_id = event_id
          this.status = status
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
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if(from.name === 'ChapterTestShow') {
        vm.tab = 'test'
      }
    })
  },

  // beforeRouteLeave(to, from, next) {
  //   if(!this.modalOpened) {
  //     this.to = to
  //     this.showModal = true
  //   } else {
  //     next()
  //   }
  // }
};
</script>
