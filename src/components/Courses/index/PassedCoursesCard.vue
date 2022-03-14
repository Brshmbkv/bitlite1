<template>
  <router-link
    tag="div"
    :to="{ name: 'CourseShow', params: { course_id: course.id } }"
    class="passed-courses-card"
  >
    <div class="passed-courses-card__icon">
      <component :is="logo" />
    </div>
    <div class="passed-courses-card__content">
      <p class="passed-courses-card__subtitle">Программирование</p>
      <h1 class="passed-courses-card__title">{{ course.title }}</h1>
      <div class="passed-courses-card__progress">
        <v-progress-linear
          :value="+course.score"
          color="#00665e"
          height="10"
          rounded
        />
        <span class="passed-courses-card__score">{{ course.score }}%</span>
      </div>
      <v-divider style="margin: 24px 0;"></v-divider>
      <div class="passed-courses-card__footer">
        <div class="passed-courses-card__status">Пройдено</div>
        <p class="passed-courses-card__footer-score">
          Оценка:
          <span class="passed-courses-card__footer-score-bold">{{
            course.score
          }}</span
          >/100
        </p>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ['course'],

  computed: {
    logo() {
      return {
        4: require('@/assets/svg/catalog_python.svg'), // python
        2: require('@/assets/svg/catalog_java.svg'), // java
        7: require('@/assets/svg/catalog_java.svg'), // java
        3: require('@/assets/svg/catalog_cpp.svg'), // cpp
        6: require('@/assets/svg/catalog_php.svg'), // php
        8: require('@/assets/svg/catalog_ios.svg'), // ios
        17: require('@/assets/svg/catalog_java.svg'), //java
      }[this.course.id || 8]
    },
  },
}
</script>

<style lang="scss">
.passed-courses-card {
  padding: 16px;
  border: 1px solid #b0b7d08f;
  border-radius: 16px;
  display: flex;
  column-gap: 16px;
  cursor: pointer;
  &__icon {
    flex: 0 0 auto;
  }
  &__content {
    flex: 1;
  }
  &__subtitle {
    font-size: 12px;
    line-height: 16px;
    font-weight: 500;
    color: #828bab;
  }
  &__title {
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    margin-top: 4px;
  }
  &__progress {
    display: flex;
    align-items: center;
    column-gap: 12px;
    margin-top: 12px;
  }
  &__progress-bar {
    width: 100%;
    margin-bottom: 0 !important;
  }
  &__score {
    font-size: 14px;
    line-height: 17px;
    letter-spacing: 0.01em;
    font-weight: 500;
  }
  &__divider {
    width: 100%;
    border: none;
    border-top: 1px solid #ebeff2;
    height: 1px;
  }
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__status {
    color: #ffffff;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #00665e;
  }
  &__footer-score {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: #828bab;
    margin-bottom: 0 !important;

    &-bold {
      color: #4d5161;
      font-weight: 500;
    }
  }
}
</style>
