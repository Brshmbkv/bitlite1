<template>
  <v-form
    id="password_change_form"
    @submit.prevent="changePassword"
  >
    <h2 class="mb-10">Изменить пароль</h2>
    <v-row>
      <v-col cols=12 md=9>
        <v-row>
          <v-col cols=12 class="py-0">
            <p class="profile-edit__dialog__main__label">Старый пароль</p>
            <v-text-field
              v-model="password"
              class="profile-edit__dialog__main__input"
              height="48"
              dense
              outlined
              :type="showPassword ? 'text' : 'password'"
              :disabled="passwordLoading"
              :append-icon="showPassword ? mdiEyeOff : mdiEye"
              @click:append="showPassword = !showPassword"
            >
            </v-text-field>
          </v-col>
          <v-col cols=12 class="py-0">
            <p class="profile-edit__dialog__main__label">Новый пароль</p>
            <v-text-field
              v-model="passwordNew"
              class="profile-edit__dialog__main__input"
              height="48"
              dense
              outlined
              :type="showPasswordNew ? 'text' : 'password'"
              :disabled="passwordLoading"
              :append-icon="showPasswordNew ? mdiEyeOff : mdiEye"
              @click:append="showPasswordNew = !showPasswordNew"
            />
          </v-col>
          <v-col cols=12 class="py-0">
            <p class="profile-edit__dialog__main__label">Повторите новый пароль</p>
            <v-text-field
              v-model="passwordRepeat"
              class="profile-edit__dialog__main__input"
              height="48"
              dense
              outlined
              :type="showPasswordRepeat ? 'text' : 'password'"
              :append-icon="showPasswordRepeat ? mdiEyeOff : mdiEye"
              :disabled="passwordLoading"
              @click:append="showPasswordRepeat = !showPasswordRepeat"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn
              block
              x-large
              color="primary"
              type="submit"
              form="password_change_form"
              :loading="passwordLoading"
              :disabled="!password || !passwordNew || !passwordRepeat"
              @click="changePassword"
            >
              Сохранить
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js';


export default {
  name: 'password-update-form',
  data() {
    return {
      mdiEye,
      mdiEyeOff,
      passwordLoading: false,
      passwordAlert: '',
      password: "",
      passwordNew: "",
      passwordRepeat: "",
      showPassword: false,
      showPasswordNew: false,
      showPasswordRepeat: false
    }
  },
  methods: {
    async changePassword() {
      const { password, passwordNew, passwordRepeat } = this;
      this.passwordAlert = '';
      if (passwordNew === passwordRepeat) {
        this.passwordLoading = true;
        this.$axios.post('/profile/change-password', {
          current_password: password,
          password: passwordNew,
          password_confirmation: passwordRepeat,
        }).then((res) => {
          if (res && res.data && res.data.message) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Пароль успешно изменен!',
              color: 'success'
            })
          }
        }).catch((err) => {
          if (err && err.response && err.response.data && err.response.data.errors) {
            // console.log( err.response.data.errors)
            this.passwordAlert = 'Ошибки:';
            for (const k in err.response.data.errors) {
              this.passwordAlert += ' *'
              this.passwordAlert += err.response.data.errors[k]
            }
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: this.passwordAlert,
              color: 'red'
            })
            // err.response.data.errors
          } else {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: 'Ошибка запроса!',
              color: 'red'
            })
          }
        })
          .finally(() => {
            this.passwordLoading = false;
            this.clearPassword()
          })
      } else {
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Пароли не совпадают, введите данные заново',
          color: 'red'
        })
        this.clearPassword();
      }
    },
    clearPassword() {
      this.password = '';
      this.passwordNew = '';
      this.passwordRepeat = '';
    }
  }
}
</script>

<style lang="scss">
.profile-edit__dialog__main__input {
  .v-input__slot {
    .v-input__append-inner {
      margin-top: 0 !important;
      align-self: center;
    }
  }
}
</style>
