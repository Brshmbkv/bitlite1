<template>
  <v-dialog
    :value="active"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-container class="d-flex align-items-center"
        style="
          height: 100%;
          min-height: 100vh;
        "
      >
        <v-row no-gutters align-content="center" style="flex-direction: column; justify-content: space-around;">
          <v-col style="flex: 0 0 175px; margin: auto" >
            <div class="instructions-stepper">
              <div
                v-for="(step, key) in steps"
                :key="key"
                class="instructions-stepper__step"
                :class="{
                  'instructions-stepper__step--active': step_current >= key
                }"
                @click="step_current = key"
              ></div>
            </div>
          </v-col>
          <v-col class="d-flex justify-center align-center text-center" style="margin: auto;">
            <div>
              <v-img
                v-if="steps[step_current] && steps[step_current].src"
                :key="step_current"
                :src="steps[step_current].src"
                :lazy-src="steps[step_current].lazySrc"
                :max-height="247"
                max-width="250"
                contain
                transition="slide-x-transition"
                class="mx-auto"
              />
              <h1 class="mb-4">{{ steps[step_current] && steps[step_current].title }}</h1>
              <p style="max-width: 700px" class="mx-auto">{{ steps[step_current] && steps[step_current].text }}</p>
            </div>
            <!-- </div> -->
          </v-col>
          <v-col class="d-flex align-end justify-center" style="margin: 32px;">
            <v-btn
              color="#0BC3B8"
              dark
              large
              elevation="0"
              class="text-capitalize"
              style="padding: 13px 60px;"
              :key="step_current"
              @click="step_current = (step_current < steps.length - 1) ? step_current+1 : handleLastStep()"
            >
              Далее
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "T800InstructionsOverlay",
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data(){
    return {
      step_current: 0,
      steps: [
        {
          title: "Как нужно отправлять задачи на проверку роботу",
          text: "Небольшая инструкция поможет вам правильно отсылать задачу роботу и получать максимальный балл",
        },
        {
          title: "Робот весьма строг к задачам",
          text: "Перед тем, как отправлять задачу на проверку внимательно проверьте все кейсы ввода и вывода. Не стоит добавлять лишние текста, на подобие “Insert a” или “Result is 10”. Эти все текста робот считает за ошибку. Должен быть строгий input и output",
          src: require("@/assets/png/robot-mad-x2.png"),
          lazySrc: require("@/assets/png/robot-mad-x0.2.png"),
        },
        {
          title: "Вам даются всего 2 попытки на проверку роботом",
          text: "Не высылайте нерабочий код в надежде на то, что робот как-то поставит вам 50%. Высылайте только рабочий код и никак иначе.",
          src: require("@/assets/png/robot-glad-x2.png"),
          lazySrc: require("@/assets/png/robot-glad-x0.2.png"),
        },
        {
          title: "T-800 может ошибаться. В этом случае обращайтесь к тренеру",
          text: "Если вы решили задачу верно, но наш робот выкинул ошибку - тогда советуем обращаться к тренеру, чтобы тот провел ручную проверку вашего кода. Не судите строго робота, все имеют право на ошибку:)",
          src: require("@/assets/png/robot-error-x2.png"),
          lazySrc: require("@/assets/png/robot-error-x0.2.png"),
        },
        {
          title: "Отправляйте обратную связь вашему тренеру",
          text: "T-800 постоянно улучшается и вы можете помочь ему в этом. Помогите роботу стать умнее и лучше. Давайте обратную связь вашему тренеру по работе T-800 :)",
          src: require("@/assets/png/robot-love-x2.png"),
          lazySrc: require("@/assets/png/robot-love-x0.2.png"),
        },
      ]
    }
  },
  methods: {
    handleLastStep(){
      this.$emit('close');
      return 0;
    }
  }
}
</script>
<style lang="scss">
// html, body, #mydiv {
//   height: 100%;
//   min-height: 100vh;
// }
.instructions-stepper{
  display: flex;
  justify-content: center;
  margin: 32px;
  .instructions-stepper__step{
    flex: 0 1 70px;
    height: 7px;
    background: rgba(23, 23, 41, 0.08);
    border-radius: 3.5px;
    margin: 0 8px;
    cursor: pointer;
  }
  .instructions-stepper__step--active{
    background: #0BC3B8;
  }
}
</style>
