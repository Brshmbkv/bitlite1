<template>
  <v-container style="max-width: 956px !important;" class="pa-0">
    <v-row class="main-row ma-0">
      <v-col class="left-col">
        <h1 class="left-col__title">Добро пожаловать в Bitlab Academy !</h1>
        <p class="left-col__text">
          Присоединяйтесь к Bitlab Academy и получите доступ к онлайн урокам,
          практическим заданиям, тестам, и многому другому.
        </p>
        <div class="d-flex">
          <div>
            <ExplanationMarkIcon class="mr-2"/>
          </div>
          <p class="left-col__subtext">
            Регистрируясь на портале, Вы даете согласие на обработку
            персональных данных.
          </p>
        </div>
      </v-col>
      <v-col class="right-col">
        <h3 class="right-col__title">Регистрация</h3>
        <v-form ref="form" v-model="isFormValid" @submit.prevent="handleSubmit">
          <v-row class="row-double-col">
            <v-col class="flex-column">
              <label for="name" class="input-label">Имя</label>
              <v-input :rules="rules.first_name" :value="form.first_name">
                <input
                  v-model.trim="form.first_name"
                  id="name"
                  type="text"
                  class="text-field"
                />
                <template v-slot:message="{ message }">
                  <p class="input-error-message ma-0">{{ message }}</p>
                </template>
              </v-input>
            </v-col>
            <v-col class="flex-column">
              <label for="surname" class="input-label">Фамилия</label>
              <v-input :rules="rules.last_name" :value="form.last_name">
                <input
                  v-model.trim="form.last_name"
                  id="surname"
                  type="text"
                  class="text-field"
                />
                <template v-slot:message="{ message }">
                  <p class="input-error-message ma-0">{{ message }}</p>
                </template>
              </v-input>
            </v-col>
          </v-row>
          <v-row class="flex-column ma-0">
            <label for="email" class="input-label">E-mail</label>
            <v-input
              :rules="rules.email"
              :value="form.email"
              :error-messages="errors[0]"
            >
              <input
                v-model.trim="form.email"
                id="email"
                type="email"
                class="text-field"
                placeholder="example@gmail.com"
                @input="() => $set(errors, 0, undefined)"
              />
              <v-icon class="input-error-icon" color="#EE5252" size="20">{{ mdiInformation }}</v-icon>
              <template v-slot:message="{ message }">
                <p class="input-error-message ma-0">{{ message }}</p>
              </template>
            </v-input>
          </v-row>
          <v-row class="flex-column ma-0">
            <label for="phonenumber" class="input-label">Телефон</label>
            <v-input
              v-mask="'+#(###)###-##-##'"
              :rules="rules.tel"
              :value="phoneWithMask"
              :error-messages="errors[1]"
            >
              <input
                v-model.trim="phoneWithMask"
                id="phonenumber"
                type="text"
                class="text-field"
                placeholder="+7(___)___-__-__"
                @keyup="formatPhone"
                @input="() => $set(errors, 1, undefined)"
              />
              <v-icon class="input-error-icon" color="#EE5252" size="20">{{ mdiInformation }}</v-icon>
              <template v-slot:message="{ message }">
                <p class="input-error-message ma-0">{{ message }}</p>
              </template>
            </v-input>
          </v-row>
          <v-row class="flex-column ma-0">
            <label for="password" class="input-label">Пароль</label>
            <v-input :rules="rules.password" :value="form.password">
              <input
                v-model.trim="form.password"
                id="password"
                class="text-field"
                :type="passwordInputType"
              />
              <div
                class="input-inner-icon"
                v-if="form.password"
                @click="togglePassword"
              >
                <v-icon v-if="showPassword" color="#5A6275" size="20">{{ mdiEye }}</v-icon>
                <v-icon v-else color="#5A6275" size="20">{{ mdiEyeOff }}</v-icon>
              </div>
              <template v-slot:message="{ message }">
                <p class="input-error-message ma-0">{{ message }}</p>
              </template>
            </v-input>
          </v-row>
          <v-row class="flex-column ma-0">
            <label for="passwordConfirm" class="input-label"
              >Повторите пароль</label
            >
            <v-input
              :rules="rules.passwordConfirm"
              :value="form.password_confirmation"
            >
              <input
                v-model.trim="form.password_confirmation"
                id="passwordConfirm"
                type="password"
                class="text-field"
              />
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
              :disabled="!isFormValid || checkForm"
              :loading="loading"
              text
            >
              Продолжить
            </v-btn>
            <span class="form-btn__subtext">
              Уже есть аккаунт?
              <a class="login-link" @click.prevent="$emit('change', 'login')"
                >Войти</a>
            </span>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ExplanationMarkIcon from '@/assets/svg/explanation-mark.svg'
import { mdiEye, mdiEyeOff, mdiInformation } from '@mdi/js'

export default {
  components: {
    ExplanationMarkIcon
  },
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
      },
      phoneWithMask: '',
      isFormValid: true,
      showPassword: false,
      loading: false,
      mdiEye,
      mdiEyeOff,
      mdiInformation,
      rules: {
        first_name: [(v) => !!v || 'Введите имя.'],
        last_name: [(v) => !!v || 'Введите фамилию.'],
        email: [
          (v) => !!v || 'Введите E-mail.',
          (v) => /.+@.+\..+/.test(v) || 'Введите корректный E-mail.',
        ],
        tel: [
          (v) => !!v || 'Введите номер телефона.',
          (v) => v.length === 16 || 'Введите правильный номер телефона'
        ],
        password: [(v) => !!v || 'Введите пароль.'],
        passwordConfirm: [
          (v) => !!v || 'Введите пароль.',
          (v) =>
            v === this.form.password ||
            'Пароли не совпадают.',
        ],
      },
      errors: [],
    }
  },
  computed: {
    passwordInputType() {
      return this.showPassword ? 'text' : 'password'
    },
    checkForm() {
      return Object.values({
        name: this.form.first_name,
        surname: this.form.last_name,
        password: this.form.password,
        passwordConfirm: this.form.password_confirmation,
        email: this.form.email,
        phone: this.phoneWithMask,
      }).includes('')
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        await this.$axios.post('register', this.form)
        this.$emit('change', 'info-modal', {
          type: 'after_registration',
          email: this.form.email,
        })
      } catch (err) {
        const { errors, errorCode } = err?.response?.data
        if (errors.email) {
          this.$set(this.errors, 0, errors.email)
        }
        if (errors.phone) {
          this.$set(this.errors, 1, errors.phone)
        }
        if (errorCode === 1) {
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: errors?.password?.[0] || 'Ошибка!',
            color: 'red',
          })
        }
      } finally {
        this.loading = false
      }
    },
    validateForm() {
      this.$refs.form.validate()
    },
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    formatPhone() {
      this.form.phone = this.phoneWithMask.replace(/[^0-9.]/g, '')
    },
  },
}
</script>

<style lang="scss" scoped>
.main-row {
  position: relative;
  z-index: 9999;
}
.left-col {
  padding: 48px 56px 0;
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
.left-col__text {
  margin-top: 72px;
  margin-bottom: 72px;
  font-size: 18px;
  line-height: 32px;
  font-weight: 400;
  letter-spacing: 0.01em;
}
.left-col__subtext {
  line-height: 24px;
}
.right-col {
  margin: 0 10px;
  padding: 48px 32px 40px;
  background-color: #f5f6f8;
  border-radius: 10px;
  @media (min-width: 714px) {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 48px 64px 40px;
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
  margin-top: 24px;
}
.row-double-col {
  margin: 0;
  display: flex;
  flex-direction: column;
  .col {
    margin: 0;
    padding: 0;
  }
  @media(min-width: 714px) {
    flex-direction: row;
    .col + .col {
      margin-left: 10px;
    }
  }
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
  margin-top: 5px;
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
  margin-top: 10px;
  color: #9fa4b1;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.01em;
  text-align: center;
}
.login-link {
  margin-left: 10px;
  color: #3e77ff;
  font-weight: 600;
}
.input-inner-icon {
  cursor: pointer;
  position: absolute;
  display: grid;
  place-items: center;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
  margin-right: 2px;
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
.v-btn.v-btn--disabled {
  color: #fafafa !important;
  background-color: #17172914 !important;
}
</style>
