<template>
  <v-stepper v-model="restoreStep">
    <v-stepper-items>
      <!-- RESTORE PHONE -->
      <v-stepper-content class="px-8 py-8" step="1">
        <v-form
          v-model="restoreEmailValid"
          ref="restoreEmailForm"
          @submit.prevent="handleSendEmailMessage"
        >
          <h5 style="font-size: 20px" class="mb-6">Восстановление пароля</h5>
          <label class="text-body-2 gray--text mb-1"
          >E-mail</label>
          <v-text-field
            height="48"
            class="mt-1 my-input"
            v-model="restoreEmail"
            :disabled="loading || !!restoreSmsSecondsLeft"
            :loading="loading"
            placeholder="example@mail.kz"
            :error-messages="
              restoreValidationErrors.hasOwnProperty('email')
                ? restoreValidationErrors.email
                : ''
            "
            required
            outlined
            @input="restoreValidationErrors = []"
            :rules="emailRule"
          />
          <span
            class="d-block text-body-2 red--text mb-6"
            v-if="restoreSmsSecondsLeft"
          >
            {{ `Слишком много запросов. Попробуйте через ${this.restoreSmsSecondsLeft} секунд` }}
          </span>
          <v-btn
            height="52"
            :disabled="loading || !!restoreSmsSecondsLeft || !restoreEmailValid"
            :loading="loading"
            block
            style="box-shadow: none"
            class="white--text text-capitalize"
            color="#0BC3B8"
            type="submit"
            @click="restoreEmailValidate"
          >Продолжить
          </v-btn>
          <p class="text-center mt-6">
            <span class="gray--text">Вспомнили пароль? </span>
            <a @click="$emit('change', 'login-auth')">Войдите</a>
          </p>
        </v-form>
      </v-stepper-content>
      <!-- RESTORE PHONE END -->
      <!-- RESTORE CODE -->
<!--      <v-stepper-content class="px-8 py-8" step="3">-->
<!--        <v-form-->
<!--          v-model="restoreCodeValid"-->
<!--          ref="restoreCodeForm"-->
<!--          @submit.prevent="handleRestoreCodeVerify"-->
<!--        >-->
<!--          <h5 class="mb-6">Подтверждение номера</h5>-->
<!--          <label class="text-body-2 gray&#45;&#45;text mb-1">Введите код с СМС</label>-->
<!--          <v-text-field-->
<!--            height="48"-->
<!--            class="mt-1"-->
<!--            v-model="restoreCode"-->
<!--            :disabled="loading || !!restoreSmsSecondsLeft"-->
<!--            :loading="loading"-->
<!--            placeholder=" "-->
<!--            :error-messages="restoreSmsCodeError || ''"-->
<!--            required-->
<!--            outlined-->
<!--          />-->
<!--          <template-->
<!--            v-if="restoreSmsSecondsLeft"-->
<!--          >-->
<!--            <span-->
<!--              class="d-block text-body-2 red&#45;&#45;text mb-6"-->
<!--            >-->
<!--              {{`Слишком много запросов. Попробуйте через ${this.restoreSmsSecondsLeft} секунд`}}-->
<!--            </span>-->
<!--          </template>-->
<!--          <template-->
<!--            v-else-->
<!--          >-->
<!--          <span-->
<!--            v-if="restoreSmsStaticSecondsValue"-->
<!--            class="d-block text-body-2 gray&#45;&#45;text mb-6"-->
<!--          >-->
<!--            {{ "Повторная отправка SMS кода доступна через" }}-->
<!--            {{-->
<!--              restoreSmsStaticSecondsValue-->
<!--                ? `${restoreSmsStaticSecondsValue} секунд.`-->
<!--                : ""-->
<!--            }}-->
<!--          </span>-->
<!--            <span-->
<!--              v-else-->
<!--              class="d-block text-body-2 gray&#45;&#45;text mb-6"-->
<!--            >-->
<!--              {{ "Нажмите " }}-->
<!--              <a @click.prevent="handleGetRestoreSmsCode">сюда</a>-->
<!--              {{ " для повторной отправки SMS кода" }}-->
<!--            </span>-->
<!--          </template>-->
<!--          <v-btn-->
<!--            height="52"-->
<!--            :disabled="loading || !!restoreSmsSecondsLeft"-->
<!--            :loading="loading"-->
<!--            block-->
<!--            style="box-shadow: none"-->
<!--            class="white&#45;&#45;text mt-2 text-capitalize"-->
<!--            color="#0BC3B8"-->
<!--            type="submit"-->
<!--            @click="restoreCodeValidate"-->
<!--          >Подтвердить-->
<!--          </v-btn-->
<!--          >-->
<!--          <p class="text-center mt-6">-->
<!--            <span>Вспомнили пароль? </span>-->
<!--            <a @click="$emit('change', 'login-auth')">Войдите</a>-->
<!--          </p>-->
<!--        </v-form>-->
<!--      </v-stepper-content>-->
      <!-- RESTORE CODE END-->
      <!-- RESTORE PASSWORD -->
      <v-stepper-content
        v-model="restorePasswordValid"
        class="px-8 py-8"
        step="2"
      >
        <v-form
          ref="restorePasswordForm"
          @submit.prevent="handleChangePassword"
        >
          <h5 class="mb-6">Создайте пароль заново</h5>
          <label class="text-body-2 gray--text mb-1"
          >Придумайте новый пароль</label
          >
          <v-text-field
            height="48"
            class="mt-1 my-input"
            v-model="restorePassword"
            :disabled="loading"
            :loading="loading"
            :error-messages="
              restoreValidationErrors.hasOwnProperty('password')
                ? restoreValidationErrors.password
                : ''
            "
            :type="showRestorePassword ? 'text' : 'password'"
            @click:append="showRestorePassword = !showRestorePassword"
            autocomplete="restore-password"
            name="restore-password"
            placeholder=" "
            outlined
            :append-icon="showRestorePassword ? mdiEyeOff : mdiEye"
          ></v-text-field>
          <label class="text-body-2 gray--text mb-1"
          >Повторите новый пароль</label
          >
          <v-text-field
            height="48"
            class="mt-1 my-input"
            v-model="restorePasswordRepeat"
            :disabled="loading"
            :loading="loading"
            :error-messages="
              restoreValidationErrors.hasOwnProperty('password_confirmation')
                ? restoreValidationErrors.password_repeat
                : restoreValidationErrors.hasOwnProperty('password')
                ? restoreValidationErrors.password
                : ''
            "
            :type="showRestorePasswordRepeat ? 'text' : 'password'"
            @click:append="showRestorePasswordRepeat = !showRestorePasswordRepeat"
            :append-icon="showRestorePasswordRepeat ? mdiEyeOff : mdiEye"
            autocomplete="restore-password-confirm"
            name="restore-password-confirm"
            persistent-hint
            hint="Пароль должен содержать: заглавную букву и цифру"
            placeholder=" "
            outlined
          ></v-text-field>
          <v-btn
            height="52"
            :disabled="loading"
            :loading="loading"
            block
            style="box-shadow: none"
            class="white--text mt-4"
            color="#0BC3B8"
            type="submit"
            @click="restorePasswordValidate"
          >Сохранить
          </v-btn
          >
        </v-form>
      </v-stepper-content>
      <!-- RESTORE PASSWORD END -->
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js'


export default {
  props: {
    step: Number
  },
  data() {
    return {
      mdiEye,
      mdiEyeOff,
      loading: false,
      restoreCode: "",
      restoreCodeValid: true,
      restoreHash: "",
      restorePassword: "",
      showRestorePassword: false,
      restorePasswordRepeat: "",
      showRestorePasswordRepeat: false,
      restorePasswordValid: true,
      restoreEmail: "",
      restoreEmailValid: false,
      restoreSmsCodeError: undefined,
      restoreSmsSecondsLeft: undefined,
      restoreSmsInterval: undefined,
      restoreStep: this.step,
      restoreValidationErrors: [],
      // in restore form
      restoreSmsStaticSecondsValue: undefined,
      restoreSmsStaticSecondsInterval: undefined,
      emailRule: [
        v => /.+@.+\..+/.test(v) || 'Введите корректный E-mail адрес'
      ],
    };
  },
  //
  // watch: {
  //   regSmsInterval: {
  //     handler: function (newVal, oldVal) {
  //       window.clearInterval(oldVal);
  //       if (newVal === undefined) {
  //         this.regSmsSecondsLeft = undefined;
  //       }
  //     },
  //     immediate: true,
  //   },
  //   regSmsStaticSecondsInterval: {
  //     handler: function (newVal, oldVal) {
  //       window.clearInterval(oldVal);
  //     },
  //     immediate: true,
  //   },
  //   restoreSmsStaticSecondInteval: {
  //     handler: function (newValue, oldValue) {
  //       window.clearInterval(oldValue);
  //     },
  //     immediate: true,
  //   },
  // },
  methods: {
    // async handleRestoreCodeVerify() {
    //   this.loading = true;
    //   this.restoreSmsCodeError = [];
    //   await this.$axios
    //     .post("/verify-sms-code", {
    //       hash: this.restoreHash,
    //       code: this.restoreCode,
    //     })
    //     .then((res) => {
    //       if (res && res.data && res.data.success) {
    //         this.$emit('alert', '')
    //         this.restoreStep = 3;
    //       }
    //     })
    //     .catch((err) => {
    //       this.$nextTick(() => {
    //         if (err.response && err.response.data && err.response.data.errors) {
    //           if (err.response.data.errors.code) {
    //             this.restoreSmsCodeError = err.response.data.errors.code;
    //           } else {
    //             this.$emit('alert', err.response.data.message, true)
    //           }
    //         } else if (
    //           err.response &&
    //           err.response.data &&
    //           err.response.data.message
    //         ) {
    //           this.$emit('alert', err.response.data.message, true)
    //         } else if (err.response) {
    //           this.$emit('alert', err.response, true)
    //         } else {
    //           this.$emit('alert', err || 'Ошибка!', true)
    //         }
    //       });
    //     })
    //     .finally(() => {
    //       this.loading = false;
    //     });
    // },

    async handleSendEmailMessage() {
      this.loading = true
      this.restoreValidationErrors = []
      this.$emit('alert', '', false)
      await this.$axios.post('email/password-resend', {
        email: this.restoreEmail
      })
        .then(() => {
          // console.log(res?.data)
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: "Сообщение отправлено на ваш E-Mail!",
            color: 'success'
          })
          this.$emit('change', 'login-auth')
        })
        .catch((err) => {
          console.error(err.response);
          this.alertError = true;
          if (err.response) {
            if (
              err.response &&
              err.response.data &&
              err.response.data.seconds_left
            ) {
              this.restoreSmsSecondsLeft = err.response.data.seconds_left;
              // this.$store.dispatch('snackbar/START_SNACKBAR', {
              //   text: `Слишком много запросов. Попробуйте через ${this.restoreSmsSecondsLeft} секунд`,
              //   color: 'red'
              // })
              if (!this.restoreSmsStaticSecondsValue) {
                this.restoreSmsInterval = window.setInterval(
                  this.restoreSmsIntervalFunction.bind(this),
                  1000
                );
              }
            } else if (
              err.response &&
              err.response.data &&
              err.response.data.errors
            ) {
              this.restoreValidationErrors = err.response.data.errors;
            } else if (
              err.response &&
              err.response.data &&
              err.response.data.message
            ) {
              this.$emit('alert', err.response.data.message, true)
            } else {
              this.$emit('alert', err.response, true)
              console.log(err.response)
            }
          } else {
            // this.$store.dispatch('snackbar/START_SNACKBAR', {
            //   text: err,
            //   color: 'red'
            // })
            this.$emit('alert', err, true)
            console.log(err)
          }
          return err;
        })
        .finally(() => {
          this.loading = false
        })
    },

    // async handleGetRestoreSmsCode() {
    //   this.loading = true;
    //   this.restoreValidationErrors = [];
    //   this.restoreSmsCodeError = [];
    //   let phone = this.restoreEmail;
    //   return await this.$axios
    //     .post("get-sms-code", {
    //       phone: phone.replace(/[^0-9.]/g, ""),
    //     })
    //     .then((res) => {
    //       if (res && res.data && res.data.hash) {
    //         this.restoreHash = res.data.hash;
    //         let mess = "СМС код отправлен на номер: \n " + phone
    //         this.$emit('alert', mess, false);
    //         this.restoreStep = 2;
    //         this.restoreSmsStaticSecondsValue = 60;
    //         this.restoreSmsStaticSecondsInterval = window.setInterval(
    //           this.restoreSmsStaticSecondsIntervalFunction.bind(this),
    //           1000
    //         );
    //         return res.data;
    //       } else throw new Error("Ошибка: нет хэша :/");
    //     })
    //     .catch((err) => {
    //       console.error(err.response);
    //       this.alertError = true;
    //       if (err.response) {
    //         if (
    //           err.response &&
    //           err.response.data &&
    //           err.response.data.seconds_left
    //         ) {
    //           this.restoreSmsSecondsLeft = err.response.data.seconds_left;
    //           // this.$store.dispatch('snackbar/START_SNACKBAR', {
    //           //   text: `Слишком много запросов. Попробуйте через ${this.restoreSmsSecondsLeft} секунд`,
    //           //   color: 'red'
    //           // })
    //           if (!this.restoreSmsStaticSecondsValue) {
    //             this.restoreSmsInterval = window.setInterval(
    //               this.restoreSmsIntervalFunction.bind(this),
    //               1000
    //             );
    //           }
    //         } else if (
    //           err.response &&
    //           err.response.data &&
    //           err.response.data.errors
    //         ) {
    //           this.restoreValidationErrors = err.response.data.errors;
    //         } else if (
    //           err.response &&
    //           err.response.data &&
    //           err.response.data.message
    //         ) {
    //           this.$emit('alert', err.response.data.message, true)
    //         } else {
    //           this.$emit('alert', err.response, true)
    //           console.log(err.response)
    //         }
    //       } else {
    //         // this.$store.dispatch('snackbar/START_SNACKBAR', {
    //         //   text: err,
    //         //   color: 'red'
    //         // })
    //         this.$emit('alert', err, true)
    //         console.log(err)
    //       }
    //       return err;
    //     })
    //     .finally(() => {
    //       this.loading = false;
    //     });
    // },

    async handleChangePassword() {
      this.loading = true;
      let { data, expires, signature } = this.$route?.query
      await this.$axios.post(`password-change-by-email/${data}`, {
        password: this.restorePassword,
        password_confirmation: this.restorePasswordRepeat,
      }, { params: {
        signature: signature,
        expires: expires,
      } })
        .then(res => {
          if (res && res.data){
            // this.restoreSmsInterval = undefined;
            // this.restoreSmsStaticSecondsInterval = undefined;
            this.loading = false;
            // this.loginPhone = "";
            this.$nextTick(() => {
              // this.loginPhone = " " + res.data.phone.substring(1);
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: 'Пароль успешно изменен!',
                color: 'success'
              })
              this.$emit('change', 'login-auth')
            })
          }
        })
        .catch(err => {
          // this.regSmsInterval = undefined;
          if (err.response && err.response.data && err.response.data.errors) {
            this.restoreValidationErrors = err.response.data.errors;
            if (Object.prototype.hasOwnProperty.call(err.response.data.errors, 'code')) {
              this.restoreStep = 2;
              this.restoreCode = "";
              this.$store.dispatch('snackbar/START_SNACKBAR', {
                text: err.response.data.errors['code'],
                color: 'red'
              })
              this.$emit('alert', err.response.data.errors['code'], true)
            }
          } else if (err.response && err.response.data && err.response.data.message) {
            this.$emit('alert', err.response.data.message, true)
          } else {
            this.$emit('alert', err || 'Ошибка!', true)
          }
          // this.$nextTick(()=> {
          //   this.alertError = true;
          //   if (err.response && err.response.data && err.response.data.errors){
          //     if (err.response.data.errors.code){
          //       this.restoreSmsCodeError = err.response.data.errors.code;
          //     } else {
          //       this.alertMessage = err.response.data.message;
          //     }
          //   } else if (err.response && err.response.data && err.response.data.message){
          //     this.alertMessage = err.response.data.message;
          //   } else if (err.response){
          //     this.alertMessage = err.response;
          //   } else {
          //     this.alertMessage = err || "Ошибка"
          //   }
          // });
        })
        .finally(() => {
          this.loading = false;
        })

    },

    // restoreSmsStaticSecondsIntervalFunction() {
    //   if (this.restoreSmsStaticSecondsValue > 0) {
    //     this.restoreSmsStaticSecondsValue =
    //       this.restoreSmsStaticSecondsValue - 1;
    //   } else {
    //     window.clearInterval(this.restoreSmsStaticSecondsInterval);
    //     this.restoreSmsStaticSecondsInterval = undefined;
    //     // this.regSmsStaticSecondsValue = undefined;
    //   }
    // },

    restoreSmsIntervalFunction() {
      if (this.restoreSmsSecondsLeft > 0) {
        this.restoreSmsSecondsLeft =
          this.restoreSmsSecondsLeft - 1;
      } else {
        window.clearInterval(this.restoreSmsInterval);
        this.restoreSmsInterval = undefined;
        this.restoreSmsSecondsLeft = undefined;
      }
    },

    restoreEmailValidate() {
      this.$refs.restoreEmailForm.validate();
    },
    // restoreCodeValidate() {
    //   this.$refs.restoreCodeForm.validate();
    // },
    restorePasswordValidate() {
      this.$refs.restorePasswordForm.validate();
    },

    beforeDestroy() {
      window.clearInterval(this.restoreSmsInterval);
    },
  },
};
</script>
