<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <div class="course-onboarding">
      <template v-if="type === 'lite' && course_id === 2">
        <div class="d-flex justify-center align-center course-onboarding__header">
          <v-slide-group
            v-model="slide"
            mandatory
          >
            <v-slide-item
              v-for="n in JavaContent.length + 2"
              :key="n"
              v-slot="{ active, toggle }"
            >
              <v-sheet
                :color="active ? '#0BC3B8' : 'rgba(23, 23, 41, 0.08)'"
                class="ma-1"
                @click="toggle"
                rounded
                :width="$vuetify.breakpoint.width > 600 ? 70 : 35"
                height="7"
                style="cursor:pointer;"
              >
              </v-sheet>
            </v-slide-item>
          </v-slide-group>
        </div>
        <div class="course-onboarding__content">
          <v-tabs-items
            class="course-onboarding__content__slider"
            v-model="slide"
            style="color: #171729;"
            :style="{
              width: $vuetify.breakpoint.width > 600 ? '60%' : '90%',
              display: slide === JavaContent.length + 1 ? 'block' : 'flex'
            }"
          >
            <v-tab-item eager>
              <p class="font-weight-bold" style="font-size: 24px">
                {{ name }}, привет! 👋😃
              </p>
              <p
                style="font-size: 18px; font-weight: 400; letter-spacing: 0.02em; line-height: 150%"
              >
                Нам очень приятно, что ты становишься частью нашего семейства Bitlab! Сегодня начинается твое
                путешествие в мир IT. Жми Далее и начинай свое обучение!
              </p>
            </v-tab-item>
            <v-tab-item
              v-for="(content, index) in JavaContent"
              :key="'content-'+index"
              eager
            >
              <v-img
                v-if="content.img"
                :src="content.img"
                width="180"
                height="180"
                class="mx-auto mb-4"
                eager
              />
              <p style="font: bold 24px/24px Inter;color: #171729;">{{ content.title }}</p>
              <p style="font: 400 18px/170% Inter;color: #171729;letter-spacing: 0.02em" v-html="content.content">
              </p>
            </v-tab-item>
            <v-tab-item eager>
              <Questionnaire
                :name="name || 'Незнакомец'"
                :questions="questions"
              />
            </v-tab-item>
          </v-tabs-items>
        </div>
        <div class="course-onboarding__footer">
          <v-btn
            :elevation="0"
            :ripple="false"
            :color="'#0BC3B8'"
            class="px-4 px-md-12 py-4 py-md-6 text-none"
            style="color: white"
            :disabled="(slide === JavaContent.length + 1) && !validate"
            :loading="loading"
            @click="slide !== JavaContent.length + 1 ? slide++ : saveQuestionnaire()"
          >
            {{ slide !== JavaContent.length + 1 ? 'Далее' : 'Отправить и Начать обучение' }}
          </v-btn>
        </div>
      </template>
      <template v-else>
        <div class="course-onboarding__questionnaire">
          <v-container>
            <Questionnaire
              :name="name || 'Незнакомец'"
              :questions="questions"
            />
          </v-container>
          <div class="course-onboarding__footer">
            <v-btn
              :elevation="0"
              :ripple="false"
              :color="'#0BC3B8'"
              class="px-4 px-md-12 py-4 py-md-6 text-none"
              style="color: white"
              :disabled="!validate"
              :loading="loading"
              @click="saveQuestionnaire()"
            >
              {{ 'Отправить и Начать обучение' }}
            </v-btn>
          </div>
        </div>
      </template>
    </div>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { JavaContent } from '@/text_content/onboarding-texts'
import Questionnaire from "@/components/Questionnaire/Questionnaire";

export default {
  name: "CourseOnboardingDialog",
  components: { Questionnaire },
  props: {
    dialog: Boolean,
    type: String,
    course_id: Number,
  },
  data() {
    return {
      loading: false,
      slide: 0,
      questions: undefined,
      JavaContent,
    }
  },
  computed: {
    ...mapState('user', ['name']),
    validate() {
      return this.questions?.every(question => question.answer_id || (question.value || question.value === 0))
    }
  },
  mounted() {
    this.fetchQuestionnaire()
  },
  methods: {
    closeDialog() {
      localStorage.setItem('show-course-info', 'false')
      this.$emit('update:dialog', false)
    },
    async fetchQuestionnaire() {
      try {
        const res = await this.$axios.get('questionnaires')
        // console.log(res.data)
        if(res?.data) {
          this.questions = res.data.map(q => {
            return {
              ...q,
              value: undefined,
              answer_id: undefined
            }
          })
        }
      } catch(e) {
        console.log(e)
      }
    },

    async saveQuestionnaire() {
      this.loading = true
      try {
        let questions_for_post = this.questions.map(question => {
          return {
            question_id: question.id,
            ...(question.answer_id && { answer_id: question.answer_id }),
            ...((question.value || question.value === 0) && { value: question.value }),
          }
        })
        await this.$axios.post('questionnaires/list', {
          answers: questions_for_post
        })
        this.closeDialog()
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Спасибо за прохождение опросника. \n Желаем Вам приятного обучения!!',
          color: 'success'
        })
        this.$store.dispatch("user/getUser");
      } catch(e) {
        console.log(e)
      }
      this.loading = false
    },
  }
}
</script>

<style lang="scss">
.course-onboarding {
  position: fixed;
  min-height: 100%;
  width: 100%;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__header {
    height: 40px;
  }

  &__content {
    text-align: center;
    height: calc(100vh - 120px);

    .v-window.v-item-group {
      margin: auto;
      min-height: calc(100vh - 120px);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;

      &::-webkit-scrollbar {
        width: 0;
      }

      //
      //&::-webkit-scrollbar-track {
      //  background: rgba(23, 23, 41, 0.08);
      //  border-radius: 100px;
      //}
      //
      //&::-webkit-scrollbar-thumb {
      //  background: rgba(23, 23, 41, 0.15);
      //  border-radius: 100px;
      //}
      //
      //&::-webkit-scrollbar-thumb:hover {
      //  background: #555;
      //}


      .v-window__container {
        height: auto !important;
        max-height: calc(100vh - 120px) !important;
      }
    }
  }

  &__footer {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__questionnaire {
    height: 100vh;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(23, 23, 41, 0.08);
      border-radius: 100px;
      padding-top: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(23, 23, 41, 0.15);
      border-radius: 100px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  }
}
</style>
