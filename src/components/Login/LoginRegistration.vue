<template>
  <v-stepper v-model="regStep">
    <v-stepper-items>
      <!-- REGISTER -->
      <v-stepper-content class="px-8 py-8" step="1">
        <v-form @submit.prevent="handleRegister">
          <h5 style="font-size: 20px" class="mb-6">Регистрация</h5>
          <label class="text-body-2 gray--text mb-1">Ваш E-mail</label>
          <v-text-field
            :height="48"
            class="mt-1"
            color="#4376FB"
            v-model="regEmail"
            :disabled="loading"
            :loading="loading"
            :error-messages="
              regValidationErrors.hasOwnProperty('email')
                ? regValidationErrors.email
                : ''
            "
            placeholder="example@gmail.com"
            persistent-hint
            required
            outlined
          />
          <!--          hint="Ваша почта необходима чтобы подтвердить ваш аккаунт"-->

          <label class="text-body-2 gray--text mb-1">Ваше имя</label>
          <v-text-field
            :height="48"
            class="mt-1"
            color="#4376FB"
            v-model="regName"
            :disabled="loading"
            :loading="loading"
            :error-messages="
              regValidationErrors.hasOwnProperty('first_name')
                ? regValidationErrors.first_name
                : ''
            "
            placeholder=" "
            autocomplete="name"
            required
            outlined
          />
          <label class="text-body-2 gray--text mb-1">Фамилия</label>
          <v-text-field
            :height="48"
            class="mt-1"
            color="#4376FB"
            v-model="regLastName"
            :disabled="loading"
            :loading="loading"
            :error-messages="
              regValidationErrors.hasOwnProperty('last_name')
                ? regValidationErrors.last_name
                : ''
            "
            placeholder=" "
            required
            outlined
          />
          <label class="text-body-2 gray--text mb-1">Придумайте пароль</label>
          <v-text-field
            height="48"
            color="#4376FB"
            class="mt-1 my-input"
            v-model="regPassword"
            :disabled="loading"
            :loading="loading"
            :error-messages="
              regValidationErrors.hasOwnProperty('password')
                ? regValidationErrors.password
                : ''
            "
            :type="showPassword ? 'text' : 'password'"
            autocomplete="reg-password"
            name="reg-password"
            placeholder=" "
            :append-icon="showPassword ? mdiEyeOff : mdiEye"
            @click:append="showPassword = !showPassword"
            outlined
          ></v-text-field>
          <label class="text-body-2 gray--text mb-1">Повторите пароль</label>
          <v-text-field
            height="48"
            class="mt-1"
            color="#4376FB"
            v-model="regPasswordRepeat"
            :disabled="loading"
            :append-icon="showPasswordRepeat ? mdiEyeOff : mdiEye"
            @click:append="showPasswordRepeat = !showPasswordRepeat"
            :loading="loading"
            :error-messages="
              regValidationErrors.hasOwnProperty('password_confirmation')
                ? regValidationErrors.password_confirmation
                : ''
            "
            :type="showPasswordRepeat ? 'text' : 'password'"
            autocomplete="reg-password-confirm"
            name="reg-password-confirm"
            placeholder=" "
            outlined
          ></v-text-field>
          <label class="text-body-2 gray--text mb-1"
            >Введите номер телефона</label
          >
          <v-text-field
            height="48"
            class="mt-1 my-input"
            color="#4376FB"
            v-model="regPhone"
            :disabled="loading"
            :loading="loading"
            v-mask="'+ # (###) ###-##-##'"
            :error-messages="
              regValidationErrors.hasOwnProperty('phone')
                ? regValidationErrors.phone
                : ''
            "
            placeholder="+ 7 (___) ___-__-__"
            autocomplete="reg-phone"
            required
            outlined
          />
          <!-- @focus="regPhone = regPhone || '+ 7 ('" -->
          <v-checkbox
            class="mt-4 my-check-box"
            :ripple="false"
            color="#4376FB"
            v-model="regCheckbox"
            label="Я согласен с условиями политики конфиденциальности и даю согласие на обработку моих персональных данных"
          >
            <!-- <template v-slot:label>
                    <div>
                      Я согласен с условиями поитики конфиденциальности и даю согласие на обработку моих персональных данных
                    </div>
                  </template> -->
          </v-checkbox>
          <v-btn
            height="52"
            :disabled="loading || !regCheckbox"
            :loading="loading"
            block
            color="#4376FB"
            style="box-shadow: none"
            class="white--text text-capitalize"
            type="submit"
            >Продолжить</v-btn
          >
          <p class="text-center mt-6">
            <span class="gray--text">Уже зарегистрированы? </span>
            <a
              @click="$emit('change', 'LoginAuth')"
              style="
        color:#4376FB
            "
              >Войдите</a
            >
          </p>
        </v-form>
      </v-stepper-content>
      <!-- GET-SMS-CODE -->
      <!--      <v-stepper-content class="px-8 py-8" step="2">-->
      <!--        <v-form-->
      <!--          v-model="regCodeValid"-->
      <!--          ref="regCodeForm"-->
      <!--          @submit.prevent="handleRegister"-->
      <!--        >-->
      <!--          <h5 class="mb-6">Подтверждение номера</h5>-->
      <!--          <label class="text-body-2 gray&#45;&#45;text mb-1">Введите код с СМС</label>-->
      <!--          <v-text-field-->
      <!--            height="48"-->
      <!--            class="mt-1"-->
      <!--            v-model="regCode"-->
      <!--            :disabled="loading"-->
      <!--            :loading="loading"-->
      <!--            placeholder=" "-->
      <!--            :error-messages="regSmsCodeError || ''"-->
      <!--            required-->
      <!--            outlined-->
      <!--          />-->
      <!--          <span class="d-block text-body-2 gray&#45;&#45;text">-->
      <!--            {{ "Если вы не получили SMS" }}-->
      <!--            {{-->
      <!--              regSmsStaticSecondsValue-->
      <!--                ? `в течении ${ regSmsStaticSecondsValue } секунд,`-->
      <!--                : ""-->
      <!--            }}-->
      <!--            {{ " нажмите " }}-->
      <!--            <a @click.prevent="handleGetSmsCode">сюда</a>-->
      <!--            {{ " чтобы переотправить" }}-->
      <!--          </span>-->
      <!--          <v-btn-->
      <!--            height="52"-->
      <!--            :disabled="loading"-->
      <!--            :loading="loading"-->
      <!--            block-->
      <!--            style="box-shadow: none"-->
      <!--            class="white&#45;&#45;text mt-2"-->
      <!--            color="#0BC3B8"-->
      <!--            type="submit"-->
      <!--            @click="getCodeValidate"-->
      <!--          >Подтвердить-->
      <!--          </v-btn>-->
      <!--          <p class="text-center mt-6">-->
      <!--            <span>Уже зарегистрированы? </span>-->
      <!--            <a @click="$emit('change', 'login-auth')">Войдите</a>-->
      <!--          </p>-->
      <!--        </v-form>-->
      <!--      </v-stepper-content>-->
    </v-stepper-items>
  </v-stepper>
</template>
<script>
import { mdiEye, mdiEyeOff } from '@mdi/js'

export default {
  name: 'LoginRegistration',
  props: ['course_id'],
  data() {
    return {
      mdiEye,
      mdiEyeOff,
      loading: false,
      showPassword: false,
      showPasswordRepeat: false,
      regCheckbox: false,
      regCode: '',
      regCodeValid: true,
      regEmail: '',
      regHash: '',
      regName: '',
      regLastName: '',
      regPassword: '',
      regPasswordRepeat: '',
      regPhone: this.$attrs.phone || '',
      regStep: 1,
      regValid: true,
      regValidationErrors: {},
      // in top error bar
      regSmsSecondsLeft: undefined,
      regSmsInterval: undefined,
      regSmsCodeError: undefined,
      // in reg form
      regSmsStaticSecondsValue: undefined,
      regSmsStaticSecondsInterval: undefined,
    }
  },

  watch: {
    regSmsInterval: {
      handler: function(newVal, oldVal) {
        window.clearInterval(oldVal)
        if (newVal === undefined) {
          this.regSmsSecondsLeft = undefined
        }
      },
      immediate: true,
    },
    regSmsStaticSecondsInterval: {
      handler: function(newVal, oldVal) {
        window.clearInterval(oldVal)
      },
      immediate: true,
    },
  },

  beforeDestroy() {
    window.clearInterval(this.regSmsInterval)
    window.clearInterval(this.regSmsStaticSecondsInterval)
  },

  methods: {
    async handleRegister() {
      this.loading = true
      let url = this.course_id ? 'register/login' : 'register'
      try {
        let res = await this.$axios.post(url, {
          // code: this.regCode,
          // hash: this.regHash,
          phone: this.regPhone.replace(/[^0-9.]/g, ''),
          first_name: this.regName,
          last_name: this.regLastName,
          password: this.regPassword,
          email: this.regEmail,
          password_confirmation: this.regPasswordRepeat,
          ...(this.course_id && { course_id: this.course_id }),
        })
        if (res && res.data) {
          if (url === 'register') {
            this.regSmsInterval = undefined
            this.regSmsStaticSecondsInterval = undefined
            this.loginPhone = ''
            this.loading = false
            this.$nextTick(() => {
              this.loginPhone = ' ' + res.data.phone.substring(1)
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: 'Вы успешно зарегистрировались!',
                color: 'success',
              })
              this.$emit('change', 'LoginAuth')
            })
          } else if (url === 'register/login') {
            // console.log(res.data)
            if (res && res.data && res.data.token && res.data.user) {
              this.$store.dispatch('session/set', { token: res.data.token })
              this.$store.dispatch('user/init', res.data.user)
              this.$router.push({
                name: 'CourseShow',
                params: {
                  course_id: this.course_id,
                },
              })
            } else throw new Error('Ошибка ответа')
          }
        }
      } catch (err) {
        console.log(err)
        this.regSmsInterval = undefined
        this.$nextTick(() => {
          this.alertError = true
          if (err?.response?.data?.errors?.code) {
            this.regSmsCodeError = err.response.data.errors.code
          } else {
            this.regValidationErrors = err?.response?.data?.errors
            // this.$store.dispatch('snackbar/START_SNACKBAR', {
            //   text: err?.response?.data?.message || err?.response || 'Ошибка!',
            //   color: 'red'
            // });
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Некоторые поля не заполнены или заполнены неправильно!',
              color: 'red',
            })
          }
        })
      }
      this.loading = false
    },

    async handleGetSmsCode() {
      this.loading = true
      let phone = this.regPhone
      await this.$axios
        .post('get-sms-code', {
          phone: phone.replace(/[^0-9.]/g, ''),
        })
        .then((res) => {
          if (res && res.data && res.data.hash) {
            this.regHash = res.data.hash
            this.$emit('alert', 'СМС код отправлен на номер: \n' + phone)
            return res.data
          } else throw new Error('Ошибка: нет хэша :/')
        })
        .catch((err) => {
          console.log(err.response)
          this.alertError = true
          if (err.response) {
            if (
              err.response &&
              err.response.data &&
              err.response.data.seconds_left
            ) {
              this.regSmsSecondsLeft = err.response.data.seconds_left
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: `Слишком много запросов. Попробуйте через ${this.regSmsSecondsLeft} секунд`,
                color: 'red',
              })
              // this.regSmsInterval = window.setInterval(
              //     this.regSmsCodeIntervalFunction.bind(this),
              //     1000
              // );
            } else if (
              err.response &&
              err.response.data &&
              err.response.data.errors
            ) {
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: err.response.data.error,
                color: 'red',
              })
            } else if (
              err.response &&
              err.response.data &&
              err.response.data.message
            ) {
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: err.response.data.message,
                color: 'red',
              })
            } else {
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: err.response,
                color: 'red',
              })
            }
          } else {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: err,
              color: 'red',
            })
          }
          return err
        })
        .finally(() => {
          this.loading = false
        })
    },

    async handleRegistrationValidate() {
      this.loading = true
      this.regValidationErrors = {}
      // this.

      await this.$axios
        .post('register-validate', {
          password: this.regPassword,
          password_confirmation: this.regPasswordRepeat,
          first_name: this.regName,
          last_name: this.regLastName,
          phone: this.regPhone.replace(/[^0-9.]/g, ''),
          email: this.regEmail,
        })
        .then((res) => {
          // console.log(res);
          if (res && res.data && res.data.success) {
            // setTimeout(() => {
            //   this.handleGetSmsCode().then(() => {
            //     this.regStep += 1;
            //     this.regSmsStaticSecondsValue = 60;
            //     this.regSmsStaticSecondsInterval = window.setInterval(
            //       this.regSmsStaticSecondsIntervalFunction.bind(this),
            //       1000
            //     );
            //   });
            // }, 800);
          } else throw new Error('Ошибка сервера')
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.errors) {
            this.regValidationErrors = err.response.data.errors
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Некоторые поля не заполнены или заполнены неправильно!',
              color: 'red',
            })
          } else if (
            err.response &&
            err.response.data &&
            err.response.data.message
          ) {
            //   this.alertError = true;
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: err.response.data.message || 'Ошибка!',
              color: 'red',
            })
          } else {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: err || 'Ошибка!',
              color: 'red',
            })
          }
          this.loading = false
        })
      // .finally(() => {
      //   this.loading = false;
      // })
    },

    // regSmsStaticSecondsIntervalFunction() {
    //   if(this.regSmsStaticSecondsValue > 0) {
    //     this.regSmsStaticSecondsValue = this.regSmsStaticSecondsValue - 1;
    //   } else {
    //     window.clearInterval(this.regSmsStaticSecondsInterval);
    //     this.regInterval = undefined;
    //     // this.regSmsStaticSecondsValue = undefined;
    //   }
    // },

    // getCodeValidate() {
    //   this.$refs.regCodeForm.validate();
    // },
  },
}
</script>
