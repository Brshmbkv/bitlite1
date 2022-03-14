<template>
  <div class="get-full-course__block">
    <div>
      <p class="get-full-course__start">Старт группы: {{ starts_at | withoutYear }}</p>
      <p class="get-full-course__text">Пройди полный курс по основам {{ title }}! </p>
      <v-chip
        :ripple="false"
        label
        :color="'rgba(255, 255, 255, 0.3)'"
        :text-color="'white'"
        @click="$emit('show-full-course')"
        class="get-full-course__btn py-4 px-6"
      >
        Перейти к курсу
      </v-chip>
    </div>
    <div class="get-full-course__right">
      <div class="get-full-course__circles">
        <div class="get-full-course__circle circle-1"></div>
<!--        <div class="get-full-course__circle circle-2"></div>-->
        <div class="get-full-course__circle circle-3">
          <JavaIcon v-if="title.toLowerCase().includes('java')" class="get-full-course__icon"/>
          <PythonIcon v-else-if="title.toLowerCase().includes('python')" class="get-full-course__icon"/>
          <PHPIcon v-else-if="title.toLowerCase().includes('php')" class="get-full-course__icon"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JavaIcon from '@/assets/svg/java.svg'
import PythonIcon from '@/assets/svg/python.svg'
import PHPIcon from '@/assets/svg/php.svg'

export default {
  name: "CourseShowFullCourse",
  components: {
    JavaIcon,
    PythonIcon,
    PHPIcon
  },
  props: {
    starts_at: String,
    title: String
  },
}
</script>

<style lang="scss">
.get-full-course__block {
  border-radius: 20px;
  background: linear-gradient(90deg, #8896DC 0%, #82E9D7 100%);
  padding: 24px 200px 24px 32px;
  margin: 50px 0;
  min-height: 165px;
  position: relative;

  .get-full-course__start {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 0;
    color: #FFF;
    text-transform: uppercase;
  }

  .get-full-course__text {
    font-weight: 900;
    font-size: 30px;
    line-height: 40px;
    color: #FFFFFF;
    margin-bottom: 8px;
  }

  .get-full-course__btn {
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 4px;
  }

  .get-full-course__right {
    position: absolute;
    right: 100px;
    bottom: 50%;

    .get-full-course__circles {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .get-full-course__circle {
        background-color: #FFF;
        border-radius: 50%;
        padding: 35px;
        position: absolute;

        &.circle-1 {
          height: 300px;
          width: 300px;
          z-index: 1;
          animation: circle-pulse 1.45s infinite linear;

          @keyframes circle-pulse {
            0% {
              opacity: 0.2;
              transform: scale(0.5);
            }
            100% {
              opacity: 0;
              transform: scale(1.25);
            }
          }
        }

        &.circle-3 {
          height: 152px;
          width: 152px;
          z-index: 3;
          background-color: rgba(255,255,255,0.2);
          display: flex;
          justify-content: center;
          align-items: center;

          .get-full-course__icon {
            transform: scale(1.2);
            path {
              fill: rgba(255,255,255,0.7);
            }
          }
        }
      }


    }
  }
}
</style>