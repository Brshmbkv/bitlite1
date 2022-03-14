<template>
  <div>
    <div v-if="questioned" class="d-flex flex-column justify-center align-center text-center" style="height: 100vh">
      <span>ВЫ УЖЕ ПРОШЛИ АНКЕТИРОВАНИЕ</span><br>
      <h1>КЕТ БАР ЕЙ</h1>
    </div>
    <div class="questionnaire-new" v-else>
      <div class="questionnaire-new__header">
        <div class="questionnaire-new__header__text">
          <h1 class="questionnaire-new__header__text__title">Анкета студента Bitlab Academy</h1>
          <div class="questionnaire-new__header__text__subtitle">
            <p>Пожалуйста, заполните анкету, чтобы мы могли улучшать наши курсы и давать вам максимальную пользу во время
              обучения.</p>
            <div class="questionnaire-new__header__text__subtitle__info">
              <InfoCircleIcon/>
              <span>Ваши данные будут в сохранности и используются только в целях улучшения обучения</span>
            </div>
          </div>
          <QuestionnaireNextButton
            :text="'Начать'"
            @click="nextPage"
          />
        </div>
        <v-img
          :src="QuestionMarkImage"
          min-width="150"
          max-width="400"
        />
      </div>
      <div class="questionnaire-new__content">
        <div class="questionnaire-new__progress">
          <div
            v-for="(question, idx) in questions"
            :key="`question-${idx}`"
            class="d-flex justify-center align-center flex-column"
          >
            <v-btn
              icon
              :ripple="false"
              color="#5A6275"
              class="questionnaire-new__progress__btn"
              :class="[idx === currentQuestionIndex && 'questionnaire-new__progress__btn--active']"
              @click="scrollToQuestion(idx)"
            >
              <v-icon
                v-if="question.value || question.answer_id"
                :color="idx === currentQuestionIndex ? '#FFFFFF' : '#0ACCDA'"
                size="20"
              >
                {{ mdiCheck }}
              </v-icon>
              <span v-else>{{ idx + 1 }}</span>

            </v-btn>
            <div
              v-if="idx !== (questions && questions.length - 1)"
              class="questionnaire-new__progress__line"
              :class="[idx < currentQuestionIndex && 'questionnaire-new__progress__line--active']"
            ></div>
          </div>
        </div>
        <div class="questionnaire-new__questions" id="questionnaire-questions" ref="questionnaire-questions">
          <div
            v-for="(question, idx) in questions"
            :key="question.id"
            class="questionnaire-new__question"
            v-scroll:#questionnaire-questions="onScroll"
          >
            <p class="questionnaire-new__question-number">Вопрос {{ idx + 1 }}</p>
            <h1 class="questionnaire-new__question-title">{{ question.question }}</h1>
            <h4 class="questionnaire-question__hint">{{ getQuestionHint(question.type) || 'Выберите подходящий для Вас вариант'}}</h4>
            <component
              :is="getComponent(question.type)"
              :options="question.answers"
              class="questionnaire-question"
              :value.sync="question.value"
              :answer_id.sync="question.answer_id"
            />
            <div class="d-flex" style="gap: 24px">
              <v-btn
                :ripple="false"
                outlined
                icon
                class="questionnaire-new__question__prev-btn"
                large
                :disabled="idx === 0"
                @click="(idx - 1 >= 0) && scrollToQuestion(idx - 1)"
              >
                <v-icon color="#171729">
                  {{ mdiChevronUp }}
                </v-icon>
              </v-btn>
              <QuestionnaireNextButton
                :disabled="idx === (questions && questions.length - 1)"
                @click="() => scrollToQuestion(idx + 1)"
              />
              <v-btn
                v-if="idx === (questions && questions.length - 1)"
                :ripple="false"
                class="ml-auto text-none white--text px-16"
                color="#0ACCDA"
                elevation="0"
                large
                :disabled="!canFinish"
                :loading="loading"
                @click="saveQuestionnaire"
              >
                Завершить
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      :value="finished_modal"
      width="500"
      persistent
    >
      <CustomModal
        title="Ваша анкета сохранена!"
        text="Мы можем сделать обучение еще эффективнее, достаточно пройти маленький тест для определения вашего уровня"
        button-text="Пройти тест сейчас"
        second-button-text="Пройти тест позже"
        @click-first-button="startTest"
        @click-second-button="routeToCourseIndexPage"
      >
        <template #info>
          <div class="d-flex align-center mt-4" style="gap: 8px; color: #9FA4B1">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.0013 0.667969C4.41797 0.667969 0.667969 4.41797 0.667969 9.0013C0.667969 13.5846 4.41797 17.3346 9.0013 17.3346C13.5846 17.3346 17.3346 13.5846 17.3346 9.0013C17.3346 4.41797 13.5846 0.667969 9.0013 0.667969ZM11.9596 12.168L8.55964 10.0763C8.30964 9.9263 8.15964 9.65964 8.15964 9.36797V5.45964C8.16797 5.11797 8.4513 4.83464 8.79297 4.83464C9.13464 4.83464 9.41797 5.11797 9.41797 5.45964V9.16797L12.618 11.093C12.918 11.2763 13.018 11.668 12.8346 11.968C12.6513 12.2596 12.2596 12.3513 11.9596 12.168Z" fill="#9FA4B1"/>
            </svg>
            Время прохождения: 3 мин
          </div>
        </template>
      </CustomModal>
    </v-dialog>
  </div>
</template>

<script>
import QuestionnaireNextButton from "@/components/Questionnaire/QuestionnaireNextButton";
import { mdiChevronUp, mdiCheck } from '@mdi/js'
import QuestionMarkImage from '@/assets/png/question-mark.png'
import QuestionnaireTypeTextArea from "@/components/Questionnaire/QuestionnaireTypeTextArea";
import QuestionnaireNewTypeRadio from "@/components/Questionnaire/QuestionnaireNewTypeRadio";
import QuestionnaireTypeScale from "@/components/Questionnaire/QuestionnaireTypeScale";
import QuestionnaireNewTypeSelect from "@/components/Questionnaire/QuestionnaireNewTypeSelect";
import QuestionnaireTypeRange from "@/components/Questionnaire/QuestionnaireTypeRange";
import InfoCircleIcon from '@/assets/svg/info-circle.svg'
import EventBus from "@/EventBus";
import { mapState } from "vuex";
const CustomModal = () => import('@/components/CustomModalLogin')

export default {
  name: "QuestionnaireNew",
  components: { QuestionnaireTypeRange, QuestionnaireNextButton, InfoCircleIcon, CustomModal },
  data() {
    return {
      mdiChevronUp,
      mdiCheck,
      QuestionMarkImage,
      questions: undefined,
      offsetTop: 0,
      currentQuestionIndex: 0,
      value: 10,
      finished_modal: false,
      loading: false,
    }
  },
  computed: {
    canFinish() {
      return this.questions.every(q => q.value || q.answer_id)
    },
    ...mapState("user", ['questioned'])
  },
  mounted() {
    window.scrollTo(0,0)
    window.addEventListener("wheel", this.preventMouseScroll, { passive:false })
    document.body.classList.add('scrollbar--hidden')
    this.fetchQuestionnaire()
  },
  beforeDestroy() {
    document.body.classList.remove('scrollbar--hidden')
    window.removeEventListener("wheel", this.preventMouseScroll, { passive: false })
  },
  destroyed() {
    EventBus.$off()
  },
  methods: {
    startTest() {
      let routeData = this.$router.resolve({ name: 'TestStart', params: { test_id: '51' } })
      window.open(routeData.href, "Test", "resizable,scrollbars,width=1500,height=900")
      EventBus.$on('refreshTestAttempts', this.routeToCourseIndexPage)
    },

    routeToCourseIndexPage() {
      this.$store.dispatch('user/getUser');
      this.$router.push({ name: 'CoursesIndex' })
    },

    preventMouseScroll(e) {
      e.preventDefault()
    },

    nextPage() {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
      });
    },

    scrollToQuestion(index) {
      this.currentQuestionIndex = index
      this.$refs["questionnaire-questions"].scrollTo({
        top: this.$refs["questionnaire-questions"].offsetHeight * index,
        behavior: 'smooth'
      });
    },

    onScroll(e) {
      this.offsetTop = e.target.scrollTop
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
        }).then(() => {
          this.finished_modal = true
          this.$store.dispatch("user/getUser");
        })

      } catch(e) {
        console.log(e)
      }
      this.loading = false
    },

    getComponent(type) {
      return {
        'radio': QuestionnaireNewTypeRadio,
        'textarea': QuestionnaireTypeTextArea,
        'select': QuestionnaireNewTypeSelect,
        'scale': QuestionnaireTypeScale,
        'range': QuestionnaireTypeRange
      }[type]
    },

    getQuestionHint(type) {
      return {
        'range': 'Введите в поле или регулируйте кнопками',
        'textarea': 'Нам будет достаточно 2-3 предложения',
      }[type]
    }
  }
}
</script>

<style lang="scss">
.questionnaire-new {
  margin: 0 auto;

  &__loading {
    display: grid;
    place-items: center;
  }

  &__header {
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap-reverse;
    max-width: 1180px;
    margin: 0 auto;

    &__text {
      flex: 0.9;

      &__title {
        font-size: 40px;
        font-weight: 700;
        line-height: 48px;
        margin-bottom: 56px;
      }

      &__subtitle {
        margin-bottom: 72px;

        p {
          font-size: 20px;
          font-weight: 500;
          line-height: 32px;
          letter-spacing: 0.01em;
        }

        &__info {
          display: flex;
          align-items: center;

          span {
            color: #9FA4B1;
            font-size: 14px;
            line-height: 16px;
          }
        }
      }
    }
  }

  &__content {
    position: relative;
  }

  &__questions {
    position: absolute;
    inset: 0 0 0 15%;
    overflow-y: scroll;
    height: 100vh;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__progress {
    height: 100vh;
    width: 15%;
    background-color: #FFFFFF;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 20px;
    font-weight: 600;

    &__btn {
      border: 1px solid rgba(23, 23, 41, 0.08) !important;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      margin-bottom: 4px;

      &--active {
        background-color: #0ACCDA;
        border: 1px solid #0ACCDA !important;
        color: #FFFFFF !important;
      }
    }

    &__line {
      width: 2px;
      height: 42px;
      background-color:  rgba(23, 23, 41, 0.08);
      border-radius: 10px;

      &--active {
        background-color: #0ACCDA;
      }
    }
  }

  &__question {
    min-height: 100vh;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    padding: 6% 10% 6% 0;

    &-number {
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      color: #9FA4B1;
      margin-bottom: 32px !important;
    }

    &-title {
      margin-bottom: 24px;
    }

    &__prev-btn {
      border-radius: 5px;
      background-color: #FFFFFF;
    }
  }
}

@media screen and (max-width: 1180px) {
  .questionnaire-question__option {
    padding: 32px 44px;
  }

  .questionnaire-new__header {
    padding: 24px;

    &__text {
      flex: 1;
    }
  }
}
</style>
