<template>
  <v-container style="max-width: 956px !important;" class="pa-0">
    <v-row class="main-row ma-0">
      <v-col class="left-col">
        <h1 class="left-col__title">Добро пожаловать в Bitlab Academy !</h1>
        <div class="d-flex left_col__infoblock">
          <div>
            <ExplanationMarkIcon class="mr-2"/>
          </div>
          <p class="left-col__subtext">
            Авторизируясь, Вы даете согласие на обработку персональных данных.
          </p>
        </div>
      </v-col>
      <v-col class="right-col" :class="{ 'pt-10': error }">
        <div class="error-block" :class="{ 'd-none': !error }">
          <v-icon color="#FFFFFF" class="mr-2">{{ mdiInformation }}</v-icon>
          <div class="d-flex flex-column">
            <span>{{ (error && error.message) || 'Ошибка!' }}</span>
            <span v-if="error && error.errorCode === 69">
              <a href="#" @click.stop="resendSms" class="resend__link">отправить код повторно</a>
            </span>
          </div>
        </div>
        <div>
          <h3 class="right-col__title">Вход</h3>
          <v-form @submit.prevent="handleSubmit">
            <v-row class="flex-column ma-0">
              <label for="emailOrTel" class="input-label">E-mail</label>
              <input
                v-model.trim="form.email"
                type="text"
                id="emailOrTel"
                class="text-field"
                placeholder="example@gmail.com"
              />
            </v-row>
            <v-row class="flex-column ma-0 mt-6">
              <label for="password" class="input-label">Пароль</label>
              <input
                v-model.trim="form.password"
                id="password"
                type="password"
                class="text-field"
              />
              <a
                class="forgot-password-link"
                @click.prevent="$emit('change', 'forgot-password')"
              >Забыли пароль?</a>
            </v-row>
            <v-row class="ma-0 flex-column">
              <v-btn
                class="form-btn"
                type="submit"
                text
                :disabled="checkForm"
                :loading="loading"
              >
                Войти
              </v-btn>
              <span class="form-btn__subtext">
                Нет профиля?
                <a
                  class="login-link"
                  @click.prevent="$emit('change', 'register')"
                >Зарегистрируйтесь</a>
              </span>
            </v-row>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiInformation } from '@mdi/js'
import ExplanationMarkIcon from '@/assets/svg/explanation-mark.svg'

export default {
  components: { ExplanationMarkIcon },
  data() {
    return {
      mdiInformation,
      form: {
        email: '',
        password: '',
      },
      loading: false,
      error: undefined,
    }
  },
  computed: {
    checkForm() {
      return Object.values(this.form).includes('')
    },
  },
  async mounted() {
    this.loginWithHash()
  },
  methods: {
    async handleSubmit() {
      this.error = undefined
      try {
        this.loading = true
        const res = await this.$axios.post('login', this.form)
        this.$store.dispatch('session/set', { token: res?.data?.token })
        this.$store.dispatch('user/init', res?.data?.user).then(() => {
          this.$router.push({
            name: 'Home',
          })
        })
      } catch(err) {
        this.error = err?.response?.data
        this.form.password = ''
      } finally {
        this.loading = false
      }
    },
    async resendSms() {
      if(!this.loading) {
        this.loading = true
        try {
          const res = await this.$axios.post('email/resend', {
            email: this.form.email
          })
          if(res?.data?.message) {
            this.error = undefined
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: res?.data?.message || 'Успешно отправлено!',
              color: 'success'
            })
          }

        } catch(err) {
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: err?.response?.data?.message || 'Произошла ошибка!',
            color: 'error'
          })
        }
        this.loading = false
      }
    },
    loginWithHash() {
      const { hash } = this.$route.query
      if(!hash) return
      this.$store.dispatch('session/set', { token: hash })
      this.$store.dispatch('user/getUser')
      this.$router.push({
        name: 'CoursesIndex',
      })
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
  padding: 120px 56px 0;
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
  margin-bottom: 248px;
}

.right-col {
  margin: 0 10px;
  padding: 80px 32px;
  background-color: #f5f6f8;
  border-radius: 10px;
  @media (min-width: 714px) {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 120px 64px;
    border-radius: 0 10px 10px 0;
    margin: 0;
  }
}

.right-col > div {
  flex: 1;
}

.right-col__title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
}

form {
  margin-top: 24px;
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
  margin-top: 25px;
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
  text-align: center;
}

.forgot-password-link {
  display: flex;
  justify-content: flex-end;
  text-decoration: none;
  color: #3e77ff;
  font-size: 14px;
  margin-top: 8px;
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

.error-block {
  padding: 18px 10px;
  display: flex;
  align-items: center;
  background-color: #ee5252;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border-radius: 5px;
  margin-bottom: 24px;
}

.error-block > svg {
  margin-right: 10px;
  flex-shrink: 0;
}

.resend__link {
  color: #FFF;
}
</style>
