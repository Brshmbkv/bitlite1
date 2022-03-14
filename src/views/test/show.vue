<template>
  <div
    class="test-show"
    :style="
      $vuetify.breakpoint.mobile ? 'overflow: hidden' : ''
    "
  >
    <v-speed-dial
      class="d-md-none"
      v-model="fab"
      fixed
      top
      right
      direction="bottom"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="success"
          dark
          fab
        >
          <v-icon v-if="fab">
            {{ mdiClose }}
          </v-icon>
          <v-icon v-else>
            {{ mdiChevronDown }}
          </v-icon>
        </v-btn>
      </template>
      <div
        v-for="(item, idx) in tests"
        :key="item.id"
        style="background-color: white"
      >
        <v-btn
          :active-class="finished ? correctAnswers.includes(item.id) ? 'correct-answer--text' : incorrectAnswers.includes(item.id) ? 'incorrect-answer--text' : 'success--text' : 'success--text'"
          :input-value="answered.includes(item.id)"
          style="font-size: 14px; border-radius: 8px"
          :ripple="false"
          fab
          tile
          x-small
          rounded
          text
          :color="'#9FA4B1'"
          @click="findTestsIndex(item.id)"
          v-scroll-to="'#question-'+item.id"
        >
          {{ idx + 1 }}
        </v-btn>
      </div>
    </v-speed-dial>
    <v-dialog
      v-model="dialog"
      max-width="300px"
      overlay-color="#171729"
      overlay-opacity="0.64"
    >
      <v-card
        class="pa-3"
      >
        <v-card-title class="headline px-3">
          Завершить тест?
        </v-card-title>
        <v-card-text
          class="px-3 pb-2 pt-2"
          style="color: #5A6275;font-weight: 400"
        >
          Вы уверены что хотите завершить тестирование?
        </v-card-text>
        <v-card-actions
          class="justify-space-between"
        >
          <v-btn
            color="#0BC4B8"
            style="color: white"
            elevation="0"
            large
            class="text-capitalize px-5"
            @click="finishTest"
            :loading="loading"
            :disabled="loading"
          >
            Закончить
          </v-btn>
          <v-btn
            color="#5A6275"
            style="color: white"
            elevation="0"
            class="text-capitalize px-5"
            large
            @click="dialog = false"
          >
            Отмена
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialog_finish"
      max-width="600"
    >
      <v-card
        class="px-md-16 px-2 py-4"
      >
        <v-card-title class="headline justify-center mb-5">
          <v-sheet
            color="green"
            elevation="0"
            height="95"
            width="95"
            style="border-radius: 100%;color: white"
            class="pt-8 text-center"
          >
            {{ rightPercent }}%
          </v-sheet>
        </v-card-title>
        <v-card-text
          class="px-md-3 pb-2 text-center"
          style="color: black;font-weight: 600"
        >
          <p
            style="font-weight: 600;font-size: 24px"
          >Поздравляем!</p>
          <p
            style="font-weight: 400; color: #5A6275"
          >Ты прошел данный тест, и получил <span style="color: #0BC4B8">{{ rightPercent }}</span> баллов.</p>
        </v-card-text>
        <v-card-actions
          class="justify-center mt-5 mb-10 flex-wrap"
        >
          <v-btn
            color="#0BC4B8"
            style="color: white"
            elevation="0"
            large
            class="text-capitalize px-sm-5"
            @click="dialog_finish = false"
          >
            Посмотреть ответы
          </v-btn>
          <v-btn
            color="#5A6275"
            style="color: white"
            elevation="0"
            class="text-capitalize px-sm-9"
            large
            @click="closeWindow"
          >
            Выйти
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row
      style="min-height: 100vh"
    >
      <v-col
        style="position:fixed;border-right: 1px solid #d6d6e6;min-height: 100vh;width: 220px"
        class="pl-12 pt-10 pr-10 d-md-block d-none"
      >
        <p class="font-weight-bold mb-8 pl-0" style="font-size: 20px">Вопросы</p>
        <v-row
          class="text-center"
        >
          <v-col
            v-for="(item, idx) in tests"
            :key="item.id"
            cols="4"
            class="text-center"
            style="padding: 6px 0 6px 0"
          >
            <v-btn
              :active-class="finished ? correctAnswers.includes(item.id) ? 'correct-answer--text' : incorrectAnswers.includes(item.id) ? 'incorrect-answer--text' : 'success--text' : 'success--text'"
              :input-value="answered.includes(item.id)"
              style="font-size: 14px; border-radius: 8px"
              :ripple="false"
              fab
              tile
              small
              rounded
              text
              :color="'#9FA4B1'"
              @click="findTestsIndex(item.id)"
              v-scroll-to="'#question-'+item.id"
            >
              {{ idx + 1 }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        :style="
          $vuetify.breakpoint.width > 960 ? 'padding-left: 290px' : ''
        "
        class="pt-md-6"
      >
        <div
          v-for="(test, idx) in testChunk[testsIndex]"
          :key="test.id"
          class="ma-md-5 px-md-5 ma-2 px-2"
          :id="'question-'+test.id"
        >
          <p class="font-weight-bold" style="font-size: 17px">Вопрос №{{ (idx + 1) + (5 * testsIndex) }}</p>
          <p v-html="decodeHTML(test.text)"></p>
          <v-radio-group
            v-model="checkedOptions[idx+(5*testsIndex)]"
            column
            dense
          >
            <v-radio
              v-for="opt in test.options"
              :key="opt.id"
              :value="opt.id"
              :readonly="finished"
              :on-icon="mdiRecordCircle"
              :ripple="false"
              :color="test.auth_user_answer && test.auth_user_answer.option_id === test.right_option_id ? 'success' : (test.auth_user_answer && opt.id === test.auth_user_answer.option_id) ? 'error' : ''"
              style="color: black"
              @click="!finished && answered.push(test.id)"
              @change="saveOption(opt.id, opt.question_id)"
            >
              <template v-slot:label>
                <div class="d-flex align-center">
                  <p
                    v-if="!finished"
                    class="mb-0 test-show__option"
                    v-html="decodeHTML(opt.value)"
                  >
                  </p>
                  <div
                    v-else
                    class="d-flex align-center justify-space-between"
                  >
                    <div
                      class="test-show__option"
                      v-html="decodeHTML(opt.value)"
                    >
                    </div>
                    <span
                      v-if="test.right_option_id === opt.id"
                      style="color: green"
                      class="ml-10"
                    >
                      <v-icon
                        style="color: green !important;"
                        class="mb-1"
                      >
                        {{ mdiCheck }}
                      </v-icon>
                      Верный ответ
                    </span>
                    <span
                      v-else-if="test.auth_user_answer && test.auth_user_answer.option_id === opt.id"
                      class="error--text ml-10"
                    >
                      <v-icon
                        class="mb-1"
                        style="color: #F16635 !important;"
                      >
                        {{ mdiClose }}
                      </v-icon>
                      Неверный ответ
                    </span>
                  </div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
          <v-alert
            v-if="finished"
            elevation="0"
            color="warning"
            outlined
            style="border-radius: 10px;"
            class="py-3"
          >
            <p>
              <v-icon
                color="warning"
                class="mb-1"
              >
                {{ mdiAlertCircleOutline }}
              </v-icon>
              Подсказка
            </p>
            <p
              style="color:black"
              v-html="test.hint && decodeHTML(test.hint)"
            ></p>
          </v-alert>
          <v-divider
            v-if="testChunk.length-1 === testsIndex ? (testChunk[testsIndex].length-1 !== idx) : idx+1%5 !== 5"
          ></v-divider>
        </div>
      </v-col>
      <v-row
        align-content="end"
        :style="
          $vuetify.breakpoint.width > 960 ? 'padding-left: 220px;width:100%' : ''
        "
      >
        <template
          v-if="finished"
        >
          <v-col
            cols="12"
            class="pb-0 pl-0 ml-3"
          >
            <v-btn
              color="success"
              block
              x-large
              tile
              class="text-capitalize"
              @click="closeWindow"
              :ripple="false"
              style="color: white;height:70px; border: 0"
            >
              Закрыть
            </v-btn>
          </v-col>
        </template>
        <template v-else>
          <v-col
            cols="6"
            class="pb-0 pr-0"
          >
            <v-btn
              :disabled="testsIndex===0"
              color="gray"
              block
              x-large
              tile
              class="text-capitalize"
              @click="prevPage"
              :ripple="false"
              style="color: white;height: 70px; border: 0"
            >
              <v-icon
                class="mr-3"
              >
                {{ mdiArrowLeft }}
              </v-icon>
              Назад
            </v-btn>
          </v-col>
          <v-col
            cols="6"
            class="pb-0 pl-0"
          >
            <v-btn
              v-if="testsIndex===testChunk.length-1"
              color="error"
              block
              x-large
              tile
              class="text-capitalize"
              @click="dialog=true"
              :ripple="false"
              style="color: white;height: 70px; border: 0"
            >
              Завершить
            </v-btn>
            <v-btn
              v-else
              color="success"
              block
              x-large
              tile
              class="text-capitalize"
              @click="nextPage"
              :ripple="false"
              style="color: white;height: 70px; border: 0"
            >
              Далее
              <v-icon class="ml-3">
                {{ mdiArrowRight }}
              </v-icon>
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </v-row>
  </div>
</template>

<script>
import {
  mdiTimerOutline,
  mdiRecordCircle,
  mdiArrowLeft,
  mdiArrowRight,
  mdiClose,
  mdiChevronDown,
  mdiAlertCircleOutline,
  mdiCheck
} from '@mdi/js'
import { decodeHTML } from "@/helpers";

export default {
  name: "Test",
  props: ['test_id'],
  data() {
    return {
      fab: false,
      mdiCheck,
      mdiTimerOutline,
      mdiAlertCircleOutline,
      mdiChevronDown,
      mdiClose,
      mdiRecordCircle,
      mdiArrowLeft,
      mdiArrowRight,
      test_title: '',
      dialog: false,
      dialog_finish: false,
      testsIndex: 0,
      tests: [],
      answered: [],
      checkedOptions: [],
      correctAnswers: [],
      incorrectAnswers: [],
      finished: false,
      rightPercent: '',
      loading: false
    }
  },

  computed: {
    testChunk() {
      let chunk = 5
      let i = 0
      let c = 0
      let arrForChunk = []
      if (this.tests.length > chunk) {
        while (c !== Math.ceil(this.tests.length / chunk)) {
          arrForChunk.push(this.tests.slice(i, i += chunk))
          c++
        }
        return arrForChunk
      } else {
        arrForChunk[0] = this.tests
        return arrForChunk
      }
    },

  },

  mounted() {
    this.getTest()
  },

  created() {
    window.addEventListener('beforeunload', this.handleWindowClose);
  },

  beforeDestroy() {
    document.removeEventListener('beforeunload', this.handleWindowClose)
  },

  methods: {
    decodeHTML,

    handleWindowClose(event) {
      if(!this.finished) {
        event.preventDefault()
        event.returnValue = ''
      }
    },

    findTestsIndex(id) {
      for (let i = 0; i < this.testChunk.length; i++) {
        for (let j = 0; j < this.testChunk[i].length; j++) {
          if (this.testChunk[i][j].id === id) {
            this.testsIndex = i
          }
        }
      }
    },

    nextPage() {
      this.testsIndex++
      window.scrollTo(0, 0);
    },

    prevPage() {
      if (this.testsIndex > 0) {
        this.testsIndex--
      }
      window.scrollTo(0, 0)
    },

    async getTest() {
      await this.$axios.get('/tests/' + this.test_id)
        .then((res) => {
          if (res && res.data){
            this.tests = res.data.questions
            this.test_title = res.data.title
          }
        })
    },

    async saveOption(opt_id, que_id) {
      await this.$axios.post('/answers/store', {
        user_id: this.$store.state.user.id,
        question_id: que_id,
        option_id: opt_id
      })
        .then(res => {
          // TODO Сделать здесь что нибудь
          if (res){
            console.log("OK")
          }
        })
    },

    sortAnswers(questions) {
      questions.forEach(q => {
        if((q.auth_user_answer && q.auth_user_answer.option_id) === q.right_option_id) {
          this.correctAnswers.push(q.id)
        } else {
          this.incorrectAnswers.push(q.id)
        }
      })
    },

    async finishTest() {
      this.loading = true
      await this.$axios.post('/answers/finish', {
        test_id: parseInt(this.test_id),
        user_id: this.$store.state.user.id
      }).then(res => {
        // window.opener.location.reload()
        // window.close()
        if (res && res.data){
          this.finished = true
          this.dialog = false
          this.dialog_finish = true
          this.tests = res.data.questions
          this.rightPercent = res.data.testResult && res.data.testResult.rights_percent;
          this.sortAnswers(res.data.questions)
        }
      }).finally(() => {
        this.loading = false
      })
    },

    closeWindow() {
      window.opener.EventBus.$emit('refreshTestAttempts')
      // window.opener.location.reload();
      window.close()
    }
  }
}
</script>

<style lang="scss">
.test-show {

  .theme--light.v-btn {
    border: 2px solid #9FA4B1;
    color: #9FA4B1;
  }

  .theme--light.v-label {
    color: black !important;
    font-size: 14px;
    margin-bottom: 1px;
  }

  .v-btn.success--text {
      color: #0BC4B8;
      border: 2px solid #0BC4B8;
    }

  .v-btn.correct-answer--text {
    color: green !important;
    border: 2px solid green !important;
  }

  .v-btn.incorrect-answer--text {
    color: #F16635 !important;
    border: 2px solid #F16635 !important;
  }
  .theme--light.v-divider {
    border-color: rgba(0, 0, 0, 0.12) !important;
  }

  span.theme--light.v-icon {
    width: 22px;
    height: 22px;
    /*color: rgba(23, 23, 41, 0.08) !important;*/
  }

  .test-show__option {
    p {
      margin-bottom: 0 !important;
    }
  }
}
</style>
