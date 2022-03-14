<template>
  <div class="min-h-screen d-flex justify-center align-center">
    <div class="brand-wrapper">
      <div class="logo-img__wrapper">
        <img class="logo__img" src="@/assets/png/bitlab_logo_circle.png" alt="bitlab logo" />
      </div>
      <h1><span>Bitlab</span> <span>Academy</span></h1>
    </div>
    <v-container class="pa-0">
      <v-row class="main-row">
        <v-col cols="6" class="left-col">
          <h1 class="left-col__title">Изменение пароля</h1>
          <div class="d-flex left_col__infoblock">
            <div>
              <ExplanationMarkIcon class="mr-2"/>
            </div>
            <p class="left-col__subtext">
              Введите новый пароль, и убедитесь в правильности его написания
              введя его повторно.
            </p>
          </div>
        </v-col>
        <v-col cols="6" class="right-col pa-0">
          <div>
            <h3 class="right-col__title">Восстановление пароля</h3>
            <v-form
              ref="form"
              lazy-validation
              v-model="isFormValid"
              @submit.prevent="handleSubmit"
            >
              <v-row class="flex-column ma-0">
                <label for="password" class="input-label"
                  >Введите новый пароль</label>
                <v-input :rules="rules.password" :value="form.password">
                  <input
                    v-model.trim="form.password"
                    id="password"
                    class="text-field"
                    :type="passwordInputType"
                  />
                  <v-icon class="input-error-icon" color="#EE5252" size="20">{{ mdiInformation }}</v-icon>
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
                  >Повторите пароль</label>
                <v-input
                  :rules="rules.passwordConfirm"
                  :value="form.passwordConfirm"
                >
                  <input
                    v-model.trim="form.passwordConfirm"
                    id="passwordConfirm"
                    type="password"
                    class="text-field"
                  />
                  <v-icon class="input-error-icon" color="#EE5252" size="20">{{ mdiInformation }}</v-icon>
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
                  :disabled="
                    !isFormValid ||
                      this.form.password.length <= 0 ||
                      this.form.passwordConfirm.length <= 0
                  "
                  :loading="loading"
                >
                  Изменить пароль
                </v-btn>
              </v-row>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ExplanationMarkIcon from '@/assets/svg/explanation-mark.svg'
import { mdiEye, mdiEyeOff, mdiInformation } from '@mdi/js';
export default {
  components: {
    ExplanationMarkIcon
  },
  data() {
    return {
      mdiEye,
      mdiEyeOff,
      mdiInformation,
      form: {
        password: '',
        passwordConfirm: '',
      },
      isFormValid: true,
      showPassword: false,
      loading: false,
      rules: {
        password: [(v) => !!v || 'Введите пароль.'],
        passwordConfirm: [
          (v) => !!v || 'Введите пароль.',
          (v) =>
            v === this.form.password ||
            'Пароли не совпадают.',
        ],
      },
    };
  },
  computed: {
    passwordInputType() {
      return this.showPassword ? 'text' : 'password';
    },
  },
  methods: {
    async handleSubmit() {
      try {
        const { id } = this.$route.params;
        const { expires, signature } = this.$route.query;
        this.loading = true;
        await this.$axios.post(
          `password-change-by-email/${id}`,
          {
            password: this.form.password,
            password_confirmation: this.form.passwordConfirm,
          },
          {
            params: {
              signature,
              expires,
            },
          }
        );
        this.$router.push({
          name: 'Login',
          params: {
            componentFrom: 'info-modal',
            paramsFrom: {
              type: 'password_changed'
            }
          }
        });
      } catch (err) {
        if (err.response.status === 400) {
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: err.response.data.message || err.response.data.errors.password[0] ||'Ошибка!',
            color: 'red',
          });
        }
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      this.$refs.form.validate();
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
.min-h-screen {
  height: 100vh;
}
.brand-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  color: #fff;
  left: 64px;
  top: 16px;
@media (min-width: 714px) {
  top: 24px;
}
}
.brand-wrapper > h1 {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: 500;
  line-height: 15px;
  text-transform: uppercase;
}
.logo-img__wrapper {
  height: 48px;
  width: 54px;
}
.logo__img {
  width: 100%;
  object-fit: cover;
}
.main-row {
  width: 956px;
  height: 576px;
  position: relative;
  z-index: 1;
}
.left-col {
  padding: 134px 56px 0;
  background-color: #171729;
  color: #fff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
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
  padding: 134px 64px 0 !important;
  background-color: #f5f6f8;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
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
  margin-top: 32px;
}
.input-label {
  height: 16px;
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
.v-input.error--text input {
  border: 1px solid #ee5252;
}
.v-input.error--text .input-error-icon {
  display: block;
}
</style>
