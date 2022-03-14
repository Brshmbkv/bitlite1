<template>
  <CustomModal
    :icon="fields.icon"
    :text="fields.text"
    :title="fields.title"
    :header-color="fields.headerColor"
    :re-send="fields.reSend"
    :button-text="fields.buttonText"
    @click-first-button="$emit('change', 'login')"
    @resend-email="resendEmail"
  />
</template>

<script>
import CustomModal from "@/components/CustomModalLogin";
export default {
  name: "InfoModal",
  components: { CustomModal },
  props: {
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      password_changed: {
        icon: 'check',
        headerColor: '#5CC689',
        title: 'Пароль был успешно изменен!',
        buttonText: 'Вернуться к Входу',
        text: 'Ваш пароль был обновлен. Введите свой email и новый пароль для входа в профиль.',
      },
      after_registration: {
        icon: 'mail',
        headerColor: '#0accda',
        reSend: true,
        title: 'Подтвердите Ваш адрес электронной почты',
        text: 'На Вашу почту была отправлена ссылка для подтверждения. Пройдите по ней, чтобы завершить регистрацию.',
        api: 'email/resend',
      },
      forgot_password: {
        icon: 'mail',
        reSend: true,
        headerColor: '#0accda',
        title: 'Письмо было успешно отправлено!',
        api: 'email/password-resend'
      }
    }
  },
  computed: {
    fields() {
      const { type } = this.params
      return this[type] || {}
    }
  },
  methods: {
    async resendEmail() {
      const { email } = this.params;
      try {
        if(this.fields.api && email) {
          const res = await this.$axios.post(this.fields.api, { email });
          if(res?.data?.message) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text: res?.data?.message,
              color: res?.data?.color || 'success'
            })
          }
        }
      } catch(err) {
        if(err?.response?.data?.message) {
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: err.response.data.message || 'Ошибка!',
            color: 'error'
          })
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
