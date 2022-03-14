<template>
  <v-dialog
    :value="active"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card class="RobotFAQOverlay">
      <div class="RobotFAQOverlay__cross-container">
        <CloseIcon
          class="RobotFAQOverlay__cross"
          @click="active = false"
        />
      </div>
      <v-container
        class="d-flex align-items-center"
        style="max-width: 960px !important;"
      >
        <v-row>
          <v-col cols=12>
            <h1 class="RobotFAQOverlay__title text-lg-h3 text-md-h4 text-h5">Как нужно отправлять задачи роботу</h1>
          </v-col>
          <v-col cols=12>
            <v-expansion-panels
              accordion
              flat
              v-model="panel"
            >
              <v-expansion-panel
                v-for="(faq_item, i) in faq"
                :key="i"
                class="RobotFAQOverlay__FAQ-item"
              >
                <v-expansion-panel-header>
                  <span class="FAQ-item__title  text-md-h5 text-h6">
                    {{ `${i+1}. ` + faq_item.title }}
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <span class="FAQ-item__content text-md-h6 text-subtitle-1">
                    {{ faq_item.text }}
                  </span>
                </v-expansion-panel-content>
                <!-- DRAKE -->
                <v-expansion-panel-content v-if="faq_item.drake">

                  <v-row
                    v-if="faq_item.drake.no"
                    no-gutters
                    justify="center"
                    align="center"
                    class="mb-4"
                  >
                    <v-col
                      cols="2"
                      sm="3"
                    >
                      <v-img
                        :src="require('@/assets/png/drake-no-x2.png')"
                        :lazy-src="require('@/assets/png/drake-no-x05.png')"
                      >
                      </v-img>
                    </v-col>
                    <v-col
                      cols="9"
                      sm="8"
                      md="6"
                      offset="1"
                    >
                      <highlight
                        class="hightlight--drake"
                        :code="faq_item.drake.no"
                        :lang="faq_item.drake.lang"
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="faq_item.drake.yes"
                    no-gutters
                    justify="center"
                    align="center"
                    class="mb-4"
                  >
                    <v-col
                      cols="2"
                      sm="3"
                    >
                      <v-img
                        :src="require('@/assets/png/drake-yes-x2.png')"
                        :lazy-src="require('@/assets/png/drake-yes-x05.png')"
                      >
                      </v-img>
                    </v-col>
                    <v-col
                      cols="9"
                      sm="8"
                      md="6"
                      offset="1"
                    >
                      <highlight
                        class="hightlight--drake"
                        :code="faq_item.drake.yes"
                        :lang="faq_item.drake.lang"
                      />
                    </v-col>
                  </v-row>

                </v-expansion-panel-content>
                <!-- DRAKE -->
                <v-expansion-panel-content>
                  <v-row no-gutters justify="center">
                    <v-col
                      cols="12"
                      sm="9"
                      md="8"
                      lg="7"
                    >
                      <highlight
                        v-if="faq_item.code"
                        class="hightlight--drake"
                        :code="faq_item.code.content"
                        :lang="faq_item.code.lang"
                      />
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>

              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <!-- style="
          height: 100%;
          height: 100%;
          min-height: 100vh;
        " -->
        <!-- <v-row no-gutters align-content="center" style="flex-direction: column; justify-content: space-around;">
          <v-col style="flex: 0 0 175px">

          </v-col>
        </v-row> -->
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import CloseIcon from "@/assets/svg/close.svg";
import highlight from "@/components/highlight.vue"

export default {
  components: {
    highlight,
    CloseIcon,
  },
  props: {
    value: {
      type: Boolean,
    }
  },
  data(){
    return {
      panel: 0,
      faq: [
        {
          title: "Проверьте ваш код у себя, запустите и посмотрите результаты",
          text: "Очень важно, чтобы вы отправляли работающий код нашему роботу. Посмотрите на условие задания и убедитесь в том, что все примеры отрабатывают правильно.",
        },
        {
          title: "Уберите лишние символы в вводе и выводе",
          text: "Обращайте внимание на ввод и вывод. Лишний текст “Insert number” и другие принимаются как ошибка. Отправляйте задачи без лишних символов.",
          drake: {
            lang: "java",
            no: 'public static void main(String args[]) {\n\tScanner in = new Scanner(System.in);\n\tSystem.out.println("Insert Number");\n\tint i = in.nextInt();\n\tSystem.out.println(i*i);\n}',
            yes: 'public static void main(String args[]) {\n\tScanner in = new Scanner(System.in);\n\tint i = in.nextInt();\n\tSystem.out.println(i*i);\n}',
          }
        },
        {
          title: 'Название класса должно быть Main и импортируйте все, что нужно',
          text: "Называйте класс правильно, а именно Main. Другие названия классов просто не принимаются. Также при заливке важно указать все импорты, которые нужны. “Package” отправлять не нужно, только import и ваш класс Main целиком",
          code: {
            lang: "java",
            content: "import java.util.Scanner;\n\npublic class Main {\n\tpublic static void main(String args[]) {\n\t\tScanner in = new Scanner(System.in);\n\t\tint i = in.nextInt();\n\t\tSystem.out.println(i*i);\n\t}\n}",
          }
        },
        {
          title: "Вам даются всего 2 попытки на проверку роботом",
          text: "Не высылайте нерабочий код в надежде на то, что робот как-то поставит вам 50%. Высылайте только рабочий код и никак иначе.",
        },
        {
          title: "T-800 может ошибаться. В этом случае обращайтесь к тренеру",
          text: "Если вы решили задачу верно, но наш робот выкинул ошибку - тогда советуем обращаться к тренеру, чтобы тот провел ручную проверку вашего кода. Не судите строго робота, все имеют право на ошибку:)",
        },
        {
          title: "Отправляйте обратную связь вашему тренеру",
          text: "T-800 постоянно улучшается и вы можете помочь ему в этом. Помогите роботу стать умнее и лучше. Давайте обратную связь вашему тренеру по работе T-800 :)",
        },
      ]
    }
  },
  computed: {
    active: {
      get(){
        return this.value;
      },
      set(newValue){
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
<style lang="scss">
.RobotFAQOverlay{
  .RobotFAQOverlay__cross-container{
    margin: 0 60px 36px auto;
    width: 36px;
      @media screen and (max-width: 800px) {
        margin: 0 30px 18px auto;
        width: 24px;
      }
      @media screen and (max-width: 600px) {
        margin: 0 15px 18px auto;
        width: 20px;
      }
    .RobotFAQOverlay__cross{
      width: 64px;
      height: 64px;
      margin-top: 50px;
      cursor: pointer;
      @media screen and (max-width: 800px) {
        margin-top: 25px;
      }
      @media screen and (max-width: 600px) {
        margin-top: 12px;
      }
    }

  }
  .RobotFAQOverlay__title{
    font-style: normal;
    font-weight: bold;
    // font-size: 48px;
    // line-height: 64px;
    text-align: center;
    color: #171729;
  }
  .RobotFAQOverlay__FAQ-item{
    .FAQ-item__title{
      margin-right: 20px;
      font-style: normal;
      font-weight: bold;
      font-size: 22px;
      line-height: 24px;
      color: #171729;
    }
    .FAQ-item__content{
      display: block;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 28px;
      color: #171729;
      margin: 24px auto;
      max-width: 674px;
    }
  }
  .hightlight--drake{
    @media screen and (min-width: 1264px) {
      font-size: 18px;
    }
    @media screen and (max-width: 800px) {
      font-size: 14px;
    }
    @media screen and (max-width: 480px) {
      font-size: 12px;
    }
  }
}
</style>
