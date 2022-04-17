<template>
  <v-card class="px-8 py-8">
    <v-form
      ref="loginForm"
      v-model="loginValid"
      :lazy-validation="true"
      @submit.prevent="handleSubmit"
    >
      <h5 style="font-size: 20px" class="mb-6">Вход в профиль</h5>
      <label class="text-body-2 gray--text">Email</label>
      <v-text-field
        height="32"
        class="mt-1"
        v-model="form.email"
        :disabled="loading"
        :loading="loading"
        placeholder="example@gmail.com"
        color="#4376FB"
        required
        outlined
        :error-messages="errors.hasOwnProperty('phone') ? errors.phone : ''"
        @input="errors = []"
      >
        <!--      <div class="d-flex justify-space-between aling-center">-->
        <!--        <label class="text-body-2 gray&#45;&#45;text">E-mail</label>-->
        <!--        <label class="text-body-2 success&#45;&#45;text" ></label>-->
        <!--      </div>-->
        <!--      <v-text-field-->
        <!--        height="32"-->
        <!--        class="mt-1"-->
        <!--        v-model="loginEmail"-->
        <!--        :disabled="loading"-->
        <!--        :loading="loading"-->
        <!--        placeholder="example@gmail.com"-->
        <!--        required-->
        <!--        outlined-->
        <!--        :error-messages="errors.hasOwnProperty('email') ? errors.email : ''"-->
        <!--        @input="errors=[]"-->
        <!--      >-->
        <!-- :value="currentValue"  -->
      </v-text-field>
      <label class="text-body-2 gray--text mb-1">Пароль</label>
      <v-text-field
        height="48"
        class="mt-1"
        v-model="form.password"
        :disabled="loading"
        :loading="loading"
        color="#4376FB"
        :rules="passwordRules"
        :type="showPassword ? 'text' : 'password'"
        name="password"
        autocomplete="current-confirm"
        placeholder=" "
        outlined
        @input="errors = []"
        @click:append="showPassword = !showPassword"
        :append-icon="showPassword ? mdiEyeOff : mdiEye"
      >
      </v-text-field>
      <v-btn
        height="52"
        :disabled="!loginValid || loading"
        :loading="loading"
        block
        class="white--text"
        style="box-shadow: none"
        color="#4376FB"
        type="submit"
        @click="loginValidate"
        >Войти</v-btn
      >
      <!-- <p class="text-center my-6">
        <a
          style="color: rgba(90, 98, 117, 1)"
          class="text-decoration-underline"
          @click="$emit('change', 'login-pass-restore')"
          >Забыли пароль?</a
        >
      </p> -->
      <p class="text-center mt-6">
        <span>Нет аккаунта? </span>
        <a
          @click="$emit('change', 'LoginRegistration')"
          style="
        color:#4376FB
        "
          >Зарегистрируйтесь</a
        >
      </p>
    </v-form>
  </v-card>
</template>

<script>
import { mdiEye, mdiEyeOff } from '@mdi/js'

export default {
  props: ['course_id'],
  data() {
    return {
      mdiEyeOff,
      mdiEye,
      errors: [],
      form: {
        email: '',
        password: '',
      },
      loading: false,
      loginEmail: undefined,
      loginValid: true,
      showPassword: false,
      emailRules: [
        (v) => /.+@.+\..+/.test(v) || 'Введите корректный E-mail адрес',
      ],
      passwordRules: [(v) => !!v || 'Введите пароль'],
    }
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
      } catch (err) {
        this.errors = err?.response?.data
        this.form.password = ''
      } finally {
        this.loading = false
      }
    },

    loginValidate() {
      this.$refs.loginForm.validate()
    },
  },
}
</script>
