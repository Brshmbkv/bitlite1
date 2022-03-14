<template>
  <v-fade-transition>
    <v-speed-dial
      v-if="[1, 2, 3, 8].includes(status.code)"
      v-model="alert_is_open"
      fixed
      :direction="'top'"
      transition="fade-transition"
      class="compiler-alert"
    >
      <template v-slot:activator>
        <v-btn
          :color="getButtonColor(status.code)"
          class="compiler-alert__notification-btn"
          :ripple="false"
          elevation="0"
          fixed
          dark
          fab
          @click.stop="alert_is_open = !alert_is_open"
        >
          <MegaphoneWhite
            v-if="[1, 3].includes(status.code)"
            :class="{
              'compiler-alert__notification__icon--rotate': alert_is_open,
            }"
            class="compiler-alert__notification__icon"
          />
          <PriorityHigh v-else />
        </v-btn>
      </template>
      <div class="compiler-alert__notification-container">
        <div class="my-fucking-figure figure-right" />
        <div class="my-fucking-figure figure-bottom" />
        <template v-if="status.code === 1">
          <div class="notification-container__text-container">
            <p class="notification-container__title--warning">
              Задача находится на проверке у тренера.
              <!--              {{-->
              <!--                attemptsLeft ?-->
              <!--                  'Ваша задача находится на проверке у тренера. \nСдача этого задания заблокировано до проверки. \nМожете приступить к следующим задачам.' :-->
              <!--                  'Попытки проверки у робота кончились, далее вашу задачу будет проверять ваш тренер вручную.'-->
              <!--              }}-->
            </p>
            <p class="notification-container__subtitle">
              {{
                'Сдача этого задания заблокирована до проверки.\nВы можете приступить к следующим задачам.'
              }}
            </p>
            <HoverableButton
              text="К следующей задаче"
              style="--color: #4376FB"
              @click="$emit('clickNext')"
            />
          </div>
        </template>
        <template v-else-if="status.code === 2">
          <div class="notification-container__text-container">
            <p class="notification-container__title--error">Ошибка!</p>
            <p class="notification-container__subtitle">{{ mistakeText }}</p>
            <p
              class="notification-container__info"
              v-if="attempts > 3 && hasAnswer"
            >
              *Посмотрев решение тренера, вы лишаетесь баллов за текущее
              задание.
            </p>
          </div>
          <div v-if="attempts > 3 && hasAnswer" class="d-flex align-center">
            <v-btn
              text
              elevation="0"
              :ripple="false"
              style="font-weight: 600; margin-left: -12px"
              class="text-capitalize primary--text font-weight-medium"
              @click.stop="alert_is_open = false"
            >
              Я справлюсь
            </v-btn>
            <HoverableButton
              text="Решение тренера"
              :icon="mdiLightbulbOutline"
              style="--color: #4376FB"
              @click="$emit('clickShowTeacherAnswer')"
            />
          </div>
          <HoverableButton
            v-else
            :text="btnText"
            style="--color: #4376FB"
            @click="handleBtnClick"
          />
          <!--          <div-->
          <!--            v-if="hasHint"-->
          <!--            class="mt-4">-->
          <!--            <span>У данной задачи есть бесплатная подсказка</span>-->
          <!--            <span-->
          <!--              @click="$emit('clickShowHint')"-->
          <!--              class="d-block text&#45;&#45;primary text-decoration-underline cursor-pointer"-->
          <!--            >Показать подсказку</span>-->
          <!--          </div>-->
        </template>
        <template v-else-if="status.code === 8">
          <div class="notification-container__text-container">
            <p class="notification-container__title--warning">
              Задача решена частично
            </p>
            <p class="notification-container__subtitle">{{ mistakeText }}</p>
            <p
              class="notification-container__info"
              v-if="attempts > 3 && hasAnswer"
            >
              *Посмотрев решение тренера, у вас не будет больше попыток для
              отправки текущей задачи.
            </p>
          </div>
          <div v-if="attempts > 3 && hasAnswer" class="d-flex align-center">
            <v-btn
              text
              elevation="0"
              :ripple="false"
              style="font-weight: 600; margin-left: -12px"
              class="text-capitalize primary--text font-weight-medium"
              @click.stop="alert_is_open = false"
            >
              Я справлюсь
            </v-btn>
            <HoverableButton
              text="Решение тренера"
              :icon="mdiLightbulbOutline"
              style="--color: #4376FB"
              @click="$emit('clickShowTeacherAnswer')"
            />
          </div>
          <HoverableButton
            v-else
            :text="btnText"
            style="--color: #4376FB"
            @click="handleBtnClick"
          />
        </template>
        <template v-else-if="status.code === 3">
          <div class="notification-container__text-container">
            <p class="notification-container__title">Задача решена верно!</p>
            <p class="notification-container__subtitle">
              <template v-if="nextIsEnabled">
                Вы можете перейти к следующей задаче.
              </template>
              <template v-else>
                Это была последняя задача
              </template>
            </p>
          </div>
          <HoverableButton
            text="К следующей задаче"
            style="--color: #4376FB"
            @click="$emit('clickNext')"
          />
        </template>
        <div class="notification-container__robot">
          <WaveSvg />
          <img src="@/assets/png/robot_head.png" class="ml-1" alt="" />
        </div>
      </div>
    </v-speed-dial>
  </v-fade-transition>
</template>

<script>
import MegaphoneWhite from '@/assets/svg/campaign.svg'
import WaveSvg from '@/assets/svg/robot_head_wave.svg'
import PriorityHigh from '@/assets/svg/priority-high.svg'
import HoverableButton from '@/components/HoverableButton'
import { mdiLightbulbOutline } from '@mdi/js'

// TODO статусы задач после названия задачи.

export default {
  name: 'CompilerAlert',
  components: {
    HoverableButton,
    MegaphoneWhite,
    PriorityHigh,
    WaveSvg,
  },
  props: {
    hasHint: Boolean,
    hasAnswer: Boolean,
    // hasTeacherAnswer: {
    //   type: Boolean,
    //   default: false
    // },
    attemptsLeft: Number,
    attempts: Number,
    status: Object,
    nextIsEnabled: Boolean,
    score: Number,
  },
  data() {
    return {
      mdiLightbulbOutline,
      show_teacher_answer: false,
      alert_is_open: false,
    }
  },
  computed: {
    mistakeText() {
      if (this.attempts === 1 && this.hasHint) {
        return 'Возможно ты не правильно отправил результат задачи, посмотри подсказку и ознакомься с правилами отправки'
      } else if (this.attempts > 3 && this.hasAnswer) {
        return 'Пересмотрите свое решение или посмотрите решение тренера.'
      } else {
        return 'Возможно ты не правильно отправил результат задачи, ознакомься с правилами отправки'
      }
    },
    btnText() {
      if (this.attempts <= 3) {
        return 'Инструкция'
      } else {
        return 'Запросить проверку тренера'
      }
    },
  },
  watch: {
    status() {
      this.alert_is_open = true
    },
  },
  mounted() {
    this.$nextTick(() => {
      try {
        this.$el
          .querySelector('.v-speed-dial__list')
          .addEventListener('click', (e) => {
            e.stopPropagation()
          })
      } catch (e) {
        console.log(e)
      }
    })
  },
  methods: {
    handleBtnClick() {
      if (this.attempts <= 3) {
        this.$emit('clickInstructions')
      } else {
        this.$emit('clickHelp')
      }
    },
    getButtonColor(code) {
      return (
        {
          1: '#E7AE1E',
          2: '#EE5252',
          8: '#E7AE1E',
        }[code] || '#5CC689'
      )
    },
  },
}
</script>

<style lang="scss">
.compiler-alert__notification__icon {
  transform: rotate(0);
  transition: all 0.2s ease;

  &.compiler-alert__notification__icon--rotate {
    transform: rotate(30deg);
  }
}

.compiler-alert {
  z-index: 10;
  right: 16px;
  bottom: 16px;

  .v-speed-dial__list {
    left: auto;
    right: 0;
    width: auto;
    padding-bottom: 0;
  }

  .compiler-alert__notification-btn {
    box-sizing: content-box;
    border: 5px solid #ffffff !important;
    right: 16px;
    bottom: 16px;

    span {
      font-style: normal;
      font-weight: 900;
      font-size: 32px;
      line-height: 40px;
      color: #ffffff;
    }
  }

  .compiler-alert__notification-container {
    background: rgb(23, 23, 41);
    width: 526px;
    min-height: 148px;
    padding: 24px;
    border-radius: 20px 20px 40px 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: space-between;
    // .notification-container__text-container{

    // }
    .notification-container__title {
      margin-bottom: 1em;
      color: #5cc689;
      font-weight: bold;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.02em;
      white-space: pre-line;

      &--error {
        @extend .notification-container__title;
        color: #ee5252;
      }

      &--warning {
        @extend .notification-container__title;
        color: #ffebb9;
      }
    }

    .notification-container__subtitle {
      margin-bottom: 2em;
      color: #ffffff;
      font-weight: 400;
      letter-spacing: 0.02em;
      white-space: pre-line;
    }

    .notification-container__info {
      margin-top: -1.5em;
      margin-bottom: 2em;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.02em;
      color: #dbdfe4;
    }

    .notification-container__attempts {
      display: block;
      margin-bottom: 24px;
      color: #ee5252;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: 0.02em;
    }

    .notification-container__robot {
      display: none;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}

.my-fucking-figure {
  height: 0;
  width: 0;
  border-top: 18px solid white;
  border-left: 6px solid transparent;
  position: absolute;
  z-index: 10;

  &:before {
    content: '';
    width: 6px;
    height: 6px;
    background-color: #383d57;
    position: absolute;
    top: -21px;
    border-radius: 100%;
    right: 0;
  }

  &.figure-right {
    right: 0;
    bottom: 35px;
  }

  &.figure-bottom {
    bottom: -6px;
    right: 41px;
    transform: rotate(270deg) scale(-1, 1);
  }
}
</style>
