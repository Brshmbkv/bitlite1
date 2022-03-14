<template>
  <div class="catalog__card">
    <div class="d-flex align-center justify-space-between">
      <div class="catalog__card_header__icon_container">
        <component :is="logo" class="catalog__card_header__icon" />
      </div>
      <span class="catalog__card__lite" v-if="is_lite">LITE</span>
      <ChipCatalog
        v-else-if="totally_bought"
        text="куплен"
        :icon="mdiCheck"
        color="#208025"
        bg-color="#D9F7CD"
      />
      <span v-else-if="!is_coming" class="catalog__card__duration">{{
        `${duration} ${month}`
      }}</span>
    </div>
    <div class="catalog__card_body mt-5">
      <div class="catalog__card_body__title">
        <p>{{ title }}</p>
        <span class="text-truncate">{{ description }}</span>
      </div>
    </div>
    <div class="mt-auto">
      <template v-if="!is_coming">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center" style="gap: 4px">
            <ExerciseLevelBar
              class="catalog__card_body__level-bars"
              :level="level"
            />
            <span class="catalog__card_body__right-text">Начинающий</span>
          </div>
          <div class="d-flex align-center" style="gap: 4px" v-if="!is_lite">
            <v-icon color="#383D57" size="20">{{ mdiAccount }}</v-icon>
            <span class="catalog__card_body__right-text"
              >{{ total_finished }} окончили</span
            >
          </div>
          <div v-else-if="lite_chapters >= 0">
            <span
              class="font-weight-bold"
              style="color: #383D57; font-size: 18px"
              >{{ lite_chapters }}</span
            >
            <span class="font-weight-medium ml-1" style="font-size: 15px"
              >уроков</span
            >
          </div>
        </div>
        <v-divider class="my-4" />
      </template>
      <v-btn
        v-if="totally_bought"
        type="button"
        outlined
        :ripple="false"
        block
        class="primary--text text-none py-5 catalog__card__btn"
        @click="handleRouterChange"
      >
        Перейти к Курсу
      </v-btn>
      <template v-else-if="!is_coming">
        <div
          @click="handleRouterChange"
          class="catalog__card__footer--available"
        >
          <div class="catalog__card__footer--available__container">
            <span>Подробнее о курсе</span>
            <v-icon color="#0BC3B8">
              {{ mdiArrowRightThin }}
            </v-icon>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="catalog__card__footer--is-coming">Скоро будет доступен</div>
      </template>
    </div>
  </div>
  <!--  <v-card-->
  <!--    flat-->
  <!--    :ripple="false"-->
  <!--    :to="!is_lite && !is_coming ? {-->
  <!--        name: 'CoursesCatalogShow',-->
  <!--        params: {-->
  <!--          course_id: course_id-->
  <!--        }-->
  <!--      } : undefined"-->
  <!--    class="course-catalog__card"-->
  <!--  >-->
  <!--    <div-->
  <!--      v-if="totally_bought && !is_coming"-->
  <!--      class="course-catalog__card__bought"-->
  <!--    >-->
  <!--      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">-->
  <!--        <path d="M13.5 4.5L6.5 11.4997L3 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>-->
  <!--      </svg>-->
  <!--      <span>Курс куплен</span>-->
  <!--    </div>-->
  <!--    <div-->
  <!--      v-if="is_lite"-->
  <!--      class="course-catalog__back"-->
  <!--      :key="course_id"-->
  <!--    >-->
  <!--      <div>-->
  <!--        <p class="course-catalog__back&#45;&#45;title">{{ title }}</p>-->
  <!--        <p class="course-catalog__back&#45;&#45;description">{{ description }}</p>-->
  <!--      </div>-->
  <!--      <v-btn-->
  <!--        :ripple="false"-->
  <!--        outlined-->
  <!--        max-height="40"-->
  <!--        class="primary&#45;&#45;text mt-auto"-->
  <!--        block-->
  <!--        :disabled="is_coming"-->
  <!--        :to="{-->
  <!--          name: 'CoursesCatalogShow',-->
  <!--          params: {-->
  <!--            course_id: course_id-->
  <!--          }-->
  <!--        }"-->
  <!--      >-->
  <!--        Начать обучение-->
  <!--      </v-btn>-->
  <!--    </div>-->
  <!--    <v-card-title-->
  <!--      class="align-end pa-4 card-with-image__image"-->
  <!--    >-->
  <!--      <div style="width: 100%">-->
  <!--        <p class="mb-2 font-weight-bold" style="font-size: 18px; line-height: 100%; word-break: break-word">{{ title }}</p>-->
  <!--        <p class="text-truncate mb-0" style="font-size: 13px; line-height: 100%">{{ description }}</p>-->
  <!--      </div>-->
  <!--    </v-card-title>-->
  <!--    <v-card-text class="pt-6">-->
  <!--      <p class="course-catalog&#45;&#45;detail__p mb-3">-->
  <!--        <SandClockIcon/>-->
  <!--        <span class="text-truncate">{{ `Длительность: ${duration} месяца` }}</span>-->
  <!--      </p>-->
  <!--      <template v-if="!is_coming">-->
  <!--        <p class="course-catalog&#45;&#45;detail__p mb-3">-->
  <!--          <PeopleIcon/>-->
  <!--          <span class="text-truncate">{{ total_finished > 0 ? `${total_finished * 10} человек прошли курс` : 'Новый курс!' }}</span>-->
  <!--        </p>-->
  <!--        <p class="course-catalog&#45;&#45;detail__p mb-0">-->
  <!--          <ChartBarIcon/>-->
  <!--          <span class="text-truncate">{{ `Уровень: ${level}` }}</span>-->
  <!--        </p>-->
  <!--      </template>-->

  <!--    </v-card-text>-->
  <!--  </v-card>-->
</template>

<script>
import { mdiCheck, mdiAccount, mdiArrowRightThin } from '@mdi/js'
import LazyImage from '@/assets/png/lazy-image.png'
import BgImage from '@/assets/lesson_cover.png'
// import SandClockIcon from '@/assets/svg/sand_clock.svg'
// import PeopleIcon from '@/assets/svg/people.svg'
// import ChartBarIcon from '@/assets/svg/chartbar.svg'
import ChipCatalog from '@/components/Catalog/ChipCatalog'
import ExerciseLevelBar from '@/components/Lesson/Practice/ExerciseLevelBar'

export default {
  name: 'CourseCatalogCard',
  components: {
    ExerciseLevelBar,
    ChipCatalog,
    // SandClockIcon,
    // PeopleIcon,
    // ChartBarIcon,
  },
  props: {
    course_id: Number,
    title: String,
    description: String,
    duration: Number,
    total_finished: Number,
    level: String,
    is_lite: {
      type: Boolean,
      default: false,
    },
    totally_bought: Boolean,
    is_coming: Boolean,
    lite_chapters: Number,
  },
  data() {
    return {
      mdiCheck,
      mdiAccount,
      mdiArrowRightThin,
      LazyImage,
      BgImage,
    }
  },
  computed: {
    month() {
      switch (this.duration) {
        case 1:
          return 'месяц'
        case 2:
        case 3:
        case 4:
          return 'месяца'
        default:
          return 'месяцев'
      }
    },
    logo() {
      return (
        {
          4: require('@/assets/svg/python--colored.svg'),
          7: require('@/assets/svg/java.svg'),
          2: require('@/assets/svg/java.svg'),
          3: require('@/assets/svg/cpp--colored.svg'),
          6: require('@/assets/svg/php--colored.svg'),
          8: require('@/assets/svg/uxui--colored.svg'),
        }[this.course_id] || require('@/assets/svg/java.svg')
      )
    },
  },
  methods: {
    handleRouterChange() {
      this.$router.push({
        name: 'CoursesCatalogShow',
        params: {
          course_id: this.course_id,
        },
      })
    },
  },
}
</script>

<style lang="scss">
.catalog__card {
  height: 100%;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  &_header {
    &__icon {
      width: 30px;
      height: 30px;
    }

    &__icon_container {
      width: 48px;
      height: 48px;
      background: #f5f6f8;
      border-radius: 5px;
      display: grid;
      place-items: center;
    }
  }

  &_body {
    display: flex;
    flex-direction: column;

    &__title {
      display: grid;
      margin-bottom: 30px;

      p {
        font-weight: bold;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        margin-bottom: 12px !important;
      }

      span {
        font-size: 13px;
        line-height: 16px;
        color: #171729;
        margin-bottom: 24px;
      }
    }

    &__right-text {
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      letter-spacing: 0.01em;
    }

    &__level-bars {
      width: 18px;
      height: 18px;

      & > svg > * {
        fill: #383d57;
      }
    }
  }

  &__btn {
    border: 2px solid #0bc3b8;
    font-weight: 600;
    border-radius: 7px;
    font-size: 16px !important;
    letter-spacing: 0.01em;
  }

  &__duration {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.01em;
  }
}

.course-catalog--detail__p {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  line-height: 15px;
  color: #5a6275;

  svg {
    path {
      stroke: #5a6275;
    }
  }
}

.course-catalog__card {
  position: relative;
  min-height: 280px;
  border: 1px solid rgba(23, 23, 41, 0.08) !important;
  border-radius: 20px !important;
  height: 100%;

  &:before {
    background-color: transparent !important;
  }

  .course-catalog__card__bought {
    position: absolute;
    left: 15px;
    top: 15px;
    background-color: #1ec5bbc2;
    border-radius: 100px !important;
    font-size: 13px;
    font-weight: 600;
    line-height: 24px;
    padding: 8px 16px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .course-catalog__back {
    display: flex;
    flex-direction: column;
    align-content: space-between;
    border-radius: 20px;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: white;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 24px 16px 16px 16px;
    z-index: 4;
    cursor: default;

    & .course-catalog__back--title {
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 8px;
    }

    & .course-catalog__back--description {
      font-size: 13px;
      font-weight: 400;
      line-height: 24px;
      color: #5a6275;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
    }
  }

  &:hover {
    .course-catalog__back {
      opacity: 1;
    }
  }
}

.catalog__card__footer--is-coming {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffebb9;
  border-radius: 7px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.01em;
  color: #956c24;
  padding: 16px 36px;
}

.catalog__card__footer--available {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.01em;
  color: #0bc3b8;
  display: flex;
  margin: 24px 0 6px 0;

  &__container {
    border-bottom: 2px solid #ffffff;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  &:hover {
    .catalog__card__footer--available__container {
      border-bottom: 2px solid #0bc3b8;
    }
  }
}

.catalog__card__lite {
  font-weight: 600;
  font-size: 15px;
  line-height: 16px;
  letter-spacing: 0.01em;
  color: #77818f;
}
</style>
