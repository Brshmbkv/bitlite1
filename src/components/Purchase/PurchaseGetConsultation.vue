<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
    persistent
    content-class="elevation-0"
  >
    <v-icon
      class="close-dialog__icon"
      @click="closeDialog"
      size="64"
      color="white"
    >
      {{ mdiClose }}
    </v-icon>
    <div
      class="get-consultation__dialog"
    >
      <div
        v-if="loading"
        class="get-consultation__dialog__loader"
      >
        <v-progress-circular
          size="64"
          indeterminate
          color="#171729"
        />
      </div>
      <div
        v-else-if="status"
        class="get-consultation__dialog__status"
      >
        <div
          class="get-consultation__dialog__status--circle"
          :style="{
            backgroundColor: status === 'success' ? '#5CC689' : '#EE5252'
          }"
        >
          <CheckIcon v-if="status === 'success'"/>
          <v-icon
            v-else
            size="88"
            color="white"
          >
            {{ mdiClose }}
          </v-icon>
        </div>
        <span style="font-size: 22px; font-weight: 600" class="text-center">{{ message || 'Ошибочка!' }}</span>
      </div>
      <v-form
        v-else
        class="get-consultation__dialog__form"
        v-model="valid"
        ref="form"
      >
        <span class="get-consultation__dialog__title">Получите полную консультацию по курсу</span>
        <span class="get-consultation__dialog__subtitle">Мы свяжемся с вами и ответим на любые возникшие вопросы</span>
        <div>
          <p class="get-consultation__dialog__input-label">ФИО</p>
          <v-text-field
            v-model="user_full_name"
            required
            outlined
            dense
            hide-details
            :rules="[rules.required]"
            class="get-consultation__dialog__input"
          ></v-text-field>
        </div>
        <div>
          <p class="get-consultation__dialog__input-label">Номер телефона</p>
          <v-text-field
            v-model="user_phone"
            required
            outlined
            dense
            hide-details
            :rules="[rules.required, rules.phone]"
            v-mask="mask"
            class="get-consultation__dialog__input"
          ></v-text-field>
        </div>
        <v-btn
          block
          x-large
          elevation="0"
          :ripple="false"
          :loading="loading"
          :disabled="!user_phone || !user_full_name"
          @click="checkForm"
          class="get-consultation__dialog__btn primary text-none mt-4"
        >
          Отправить заявку
        </v-btn>
        <span class="get-consultation__dialog__agreement">
        Нажимая на кнопку, я соглашаюсь на
        <a href="/i/terms">обработку персональных данных и с правилами пользования Платформы</a>
      </span>
      </v-form>
    </div>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import { mdiClose } from '@mdi/js'
import CheckIcon from '@/assets/svg/check.svg'

export default {
  name: "PurchaseGetConsultation",
  components: {
    CheckIcon,
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    course_id: Number,
  },
  data() {
    return {
      mdiClose,
      status: undefined,
      message: undefined,
      user_full_name: undefined,
      user_phone: undefined,
      mask: undefined,
      valid: false,
      loading: false,
      rules: {
        required: v => !!v || 'Заполните поле!',
        phone: v => !!v && v.length === 18 || 'Неверно введен номер телефона',
      }
    }
  },
  computed: {
    ...mapState('user', ['name', 'surname', 'phone'])
  },
  watch: {
    dialog: {
      immediate: true,
      handler(newVal, oldVal) {
        if(newVal !== oldVal && newVal) {
          this.user_full_name = `${ this.name || '' } ${ this.surname || '' }`
          this.user_phone = this.phone
          this.$nextTick(() => {
            this.mask = '+# (###) ###-##-##'
          })
        }
      }
    }
  },
  methods: {
    async sendRequest() {
      this.loading = true
      await this.$axios.post('get-consultation', {
        course_id: this.course_id,
        phone: this.user_phone,
        full_name: this.user_full_name
      }).then(res => {
        if(res && res.data) {
          this.status = 'success'
          this.message = 'Заявка на консультацию отправлена!'
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Успешно!',
            color: 'success'
          })
        }
      }).catch(() => {
        this.status = 'error'
        this.message = 'Произошла ошибка! Повторите попытку позже!'
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Возникла ошибка!',
          color: 'red'
        })
      })
    },

    checkForm() {
      this.$refs.form.validate()
      if(this.valid) {
        console.log(1)
        this.sendRequest()
          .then(() => {
            setTimeout(() => {
              this.closeDialog()
            }, 1000)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Данные заполнены неправильно!',
          color: 'red'
        })
      }
    },

    closeDialog() {
      this.user_phone = undefined
      this.user_full_name = undefined
      this.mask = undefined
      this.status = undefined
      this.message = undefined
      this.$emit('update:dialog', false)
    }
  }
}
</script>

<style lang="scss">
.get-consultation__dialog {
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 48px 56px;

  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 450px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__title {
    font-size: 24px;
    font-weight: bold;
    line-height: 32px;
  }

  &__subtitle {
    font-size: 16px;
    line-height: 24px;
  }

  &__status {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    &--circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .get-consultation__dialog__input-label {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }

  .get-consultation__dialog__input:not(.v-input--is-focused, .error--text) {
    .v-input__slot {
      fieldset {
        border: 1px solid rgba(23, 23, 41, 0.15);
      }
    }
  }

  .get-consultation__dialog__agreement {
    font-size: 12px;
    line-height: 16px;
  }
}
</style>