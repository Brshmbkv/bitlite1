<template>
  <v-row align="center" justify="center" class="Login">
    <v-col md="6" sm="8" style="max-width: 480px;">
      <div class="Login__logo-container"></div>
      <v-alert
        :value="!!alertMessage"
        :type="alertError ? 'error' : 'success'"
        transition="scale-transition"
        style="white-space: pre-line"
        >{{ alertMessage }}
      </v-alert>
      <v-alert
        :value="
          !!enrol && (phase === 'LoginRegistration' || phase === 'LoginAuth')
        "
        dense
        transition="scale-transition"
        class="text-center"
      >
        Курс будет доступен после регистрации <br />или <br />входа в систему
      </v-alert>
      <transition name="component-fade" mode="out-in">
        <component
          :is="phase"
          :course_id="enrol"
          :step="passRestoreStep"
          v-bind="$attrs"
          @change="
            (val) => {
              this.phase = val
              this.alertMessage = ''
            }
          "
          @alert="
            (text, error) => {
              this.alertMessage = text
              this.alertError = error
            }
          "
        ></component>
      </transition>
    </v-col>
  </v-row>
</template>

<script>
import LoginAuth from '../components/Login/LoginAuth.vue'
import LoginPassRestore from '../components/Login/LoginPassRestore.vue'
import LoginRegistration from '../components/Login/LoginRegistration.vue'
import LoginOrRegister from '../components/Login/LoginOrRegister.vue'
// import EnrolRegistration from "@/components/Login/EnrolRegistration.vue";

export default {
  name: 'Login',
  components: {
    LoginAuth,
    LoginPassRestore,
    LoginRegistration,
    LoginOrRegister,
    // EnrolRegistration,
  },
  props: ['enrol'],
  data() {
    return {
      phase: this.enrol ? 'LoginOrRegister' : 'LoginAuth',
      alertMessage: '',
      alertError: false,
      passRestoreStep: 1,
    }
  },
  beforeMount() {
    let { status, action } = this.$route.query
    if (status) {
      this.$store.dispatch('snackbar/START_SNACKBAR', {
        text: this.getText(status),
        color: status === 'success_verified' ? 'success' : 'error',
      })
    }
    if (action && action === 'password-reset') {
      this.passRestoreStep = 2
      this.phase = 'LoginPassRestore'
    }
  },
  methods: {
    getText(status) {
      return {
        invalid_url: 'Ссылка недействительна!',
        success_verified: 'Почта подтверждена!',
        already_verified: 'Ваша почта уже подтверждена!',
      }[status]
    },
  },
}
</script>
<style lang="scss">
.Login {
  user-select: none;
  min-height: 100%;
  .component-fade-enter-active,
  .component-fade-leave-active {
    transition: opacity 0.3s ease-out;
  }

  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */
 {
    opacity: 0;
  }

  .Login__logo-container {
    max-width: 165px;
    margin: 16px auto 32px;
    position: relative;
    z-index: 1;
  }

  .Login__logo-container__img {
    width: 100%;
  }
}
</style>
