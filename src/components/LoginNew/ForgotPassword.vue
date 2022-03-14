<template>
  <v-container style="max-width: 956px !important;" class="pa-0">
    <v-row class="main-row ma-0">
      <v-col class="left-col">
        <h1 class="left-col__title">Забыли пароль?</h1>
        <div class="d-flex left_col__infoblock">
          <div>
            <svg
              class="exclamation"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21C13.1046 21 14 20.1046 14 19C14 17.8954 13.1046 17 12 17C10.8954 17 10 17.8954 10 19C10 20.1046 10.8954 21 12 21Z"
                fill="#0ACCDA"
              />
              <path
                d="M12 3C10.9 3 10 3.9 10 5V13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13V5C14 3.9 13.1 3 12 3Z"
                fill="#0ACCDA"
              />
            </svg>
          </div>
          <p class="left-col__subtext">
            Введите свой адрес электронной почты, чтобы мы смогли выслать
            инструкцию по получению нового пароля.
          </p>
        </div>
      </v-col>
      <v-col class="right-col">
        <div>
          <h3 class="right-col__title">Восстановление пароля</h3>
          <v-form
            ref="form"
            lazy-validation
            v-model="isFormValid"
            @submit.prevent="handleSubmit"
          >
            <v-row class="flex-column ma-0">
              <label for="email" class="input-label">E-mail</label>
              <v-input
                :rules="emailRules"
                :value="form.email"
                :error-messages="error"
              >
                <input
                  v-model.trim="form.email"
                  id="email"
                  type="email"
                  class="text-field"
                  placeholder="example@gmail.com"
                  @input="error = ''"
                />
                <svg
                  class="input-error-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.99984 0.667969C4.39984 0.667969 0.666504 4.4013 0.666504 9.0013C0.666504 13.6013 4.39984 17.3346 8.99984 17.3346C13.5998 17.3346 17.3332 13.6013 17.3332 9.0013C17.3332 4.4013 13.5998 0.667969 8.99984 0.667969ZM8.99984 9.83464C8.54151 9.83464 8.16651 9.45964 8.16651 9.0013V5.66797C8.16651 5.20964 8.54151 4.83464 8.99984 4.83464C9.45817 4.83464 9.83317 5.20964 9.83317 5.66797V9.0013C9.83317 9.45964 9.45817 9.83464 8.99984 9.83464ZM9.83317 13.168H8.16651V11.5013H9.83317V13.168Z"
                    fill="#EE5252"
                  />
                </svg>
                <template v-slot:message="{ message }">
                  <p class="input-error-message ma-0">{{ message }}</p>
                </template>
              </v-input>
            </v-row>
            <v-row class="ma-0 flex-column">
              <v-btn
                class="form-btn"
                type="submit"
                @click="validateForm"
                :disabled="!isFormValid || form.email.length <= 0"
                :loading="loading"
              >
                Отправить
              </v-btn>
              <span class="form-btn__subtext">
                Или
                <a
                  class="login-link" @click.prevent="$emit('change', 'login')"
                >Войти в профиль</a>
              </span>
            </v-row>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
      },
      isFormValid: true,
      loading: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      error: '',
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        await this.$axios.post('email/password-resend', this.form)
        this.$emit('change', 'info-modal', {
          type: 'forgot_password',
          email: this.form.email,
        })
      } catch (err) {
        const { errorCode, error_code, message } = err?.response?.data
        if (error_code === 29) {
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: message || 'Ошибка!',
            color: 'red',
          })
        } else if (errorCode === 22) {
          this.error = 'Аккаунт с таким email не существует. '
        }
      } finally {
        this.loading = false
      }
    },
    validateForm() {
      this.$refs.form.validate()
    },
  },
}
</script>

<style lang="scss" scoped>
.main-row {
  position: relative;
  z-index: 9999;
}
.exclamation {
  width: 24px;
  margin-right: 8px;
}
.left-col {
  padding: 170px 56px 0;
  background-color: #171729;
  color: #fff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  display: none;
  @media (min-width: 714px) {
    flex: 0 0 50%;
    max-width: 50%;
    display: block;
  }
}
.left-col__title {
  width: 316px;
  line-height: 40px;
  font-weight: 700;
}
.left_col__infoblock {
  margin-top: 80px;
}
.left-col__subtext {
  line-height: 24px;
}
.right-col {
  padding: 120px 32px 40px;
  background-color: #f5f6f8;
  margin: 0 10px;
  border-radius: 10px;
  @media (min-width: 714px) {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 170px 64px 40px;
    border-radius: 0 10px 10px 0;
    margin: 0;
  }
}
.right-col__title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
}
form {
  margin-top: 32px;
}
.input-label {
  margin-bottom: 10px;
  color: #5a6275;
  font-size: 14px;
  letter-spacing: 0.01em;
  font-weight: 600;
}
.text-field {
  min-height: 40px;
  width: 100%;
  padding: 0 10px;
  background-color: #fff;
  border: 1px solid rgba(23, 23, 41, 0.12);
  border-radius: 5px;
  color: #5a6275 !important;
  font-size: 14px;
  letter-spacing: 0.01em;
}
.text-field:focus {
  outline: none;
  border: 1px solid #5a6275;
}
.form-btn {
  margin-top: 10px;
  height: 48px !important;
  text-transform: capitalize;
  color: #fafafa;
  letter-spacing: 0.01em;
  line-height: 16px;
  font-weight: 600;
  background-color: #0accda !important;
  box-shadow: none;
}
.form-btn:hover {
  background-color: #0accda !important;
}
.form-btn__subtext {
  margin-top: 140px;
  color: #9fa4b1;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
}
.login-link {
  margin-left: 8px;
  color: #3e77ff;
  font-weight: 600;
}
.v-btn.v-btn--disabled {
  color: #fafafa !important;
  background-color: #17172914 !important;
}
.input-error-icon {
  display: none;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
  margin-right: 2px;
}
.input-error-message {
  color: #ee5252;
  font-size: 12px;
  letter-spacing: 0.01em;
}
.v-input {
  position: relative;
}
.v-input.error--text input {
  border: 1px solid #ee5252;
}
.v-input.error--text .input-error-icon {
  display: block;
}
</style>
