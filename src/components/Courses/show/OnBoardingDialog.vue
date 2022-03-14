<template>
  <v-dialog
    :value="dialog"
    width="800"
    persistent
  >
    <div class="on-boarding">
      <div class="d-flex flex-column on-boarding__content">
        <h1 class="on-boarding__title">{{ name }}, <br> Добро пожаловать</h1>
        <p class="on-boarding__text">
          Приветствуем вас на курсе <b>{{ courseTitle }}</b>. Совсем скоро вы начнете писать собственный код на {{ getCourseLanguage() }}.
          Давайте познакомимся поближе, пожалуйста заполните небольшую анкету о себе.
        </p>
        <v-btn
          :ripple="false"
          elevation="0"
          color="#0ACCDA"
          class="white--text align-self-sm-start px-16 py-7 text-none"
          style="font-size: 16px"
          large
          :to="{
            name: 'Questionnaire'
          }"
        >
          Заполнить анкету
        </v-btn>
      </div>
      <v-img
        :src="Chelovek"
        height="280"
        max-width="200"
        contain
        eager
        class="on-boarding__bg-image"
      />
    </div>
  </v-dialog>
</template>

<script>
import Chelovek from '@/assets/png/chelovek.png'

export default {
  name: "OnBoardingDialog",
  props: {
    name: String,
    courseTitle: String,
    courseId: Number,
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Chelovek
    }
  },
  methods: {
    getCourseLanguage() {
      return {
        2: 'Java',
        4: 'Python',
        3: 'C++',
        13: 'Django',
        11: 'Java',
        6: 'PHP',
        7: 'Java'
      }[this.courseId]
    }
  }
}
</script>

<style lang="scss">
.on-boarding {
  background-color: #FFFFFF;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  padding: 88px 72px;
  min-height: 500px;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;

  &__title {
    font-weight: 600;
    font-size: 40px;
    line-height: 48px;
    margin-bottom: 22px;
  }

  &__text {
    font-size: 16px;
    line-height: 32px;
    margin-bottom: 55px;
  }

  &__content {
    gap: 40px;
  }
}

@media screen and (max-width: 700px) {
  .on-boarding {
    flex-wrap: wrap-reverse;
    justify-content: center;
    padding: 44px 32px;

    &__content {
      align-items: center;
      gap: 24px;
    }
  }
}
</style>
