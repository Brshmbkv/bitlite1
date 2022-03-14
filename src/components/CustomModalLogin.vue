<template>
  <div class="card">
    <!-- Email header -->
    <div class="card-header" :style="{ backgroundColor: headerColor }">
      <div style="width: 104px; height: 104px">
        <component :is="getIcon()"/>
      </div>
    </div>
    <div class="card-content">
      <h2 class="card-content__title">{{ title }}</h2>
      <div class="card-content__body" v-if="text">
        <slot name="body">
          <p>{{ text }}</p>
        </slot>
      </div>
      <div v-if="reSend">
        <slot name="info">
          <div class="card-content__info">
            <div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
              <path
                d="M9 5H11V7H9V5ZM10 15C10.55 15 11 14.55 11 14V10C11 9.45 10.55 9 10 9C9.45 9 9 9.45 9 10V14C9 14.55 9.45 15 10 15ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18Z"
                fill="#323232"
              />
            </svg>
            </div>
            <span>
              Проверьте папку со спамом в случае, если электронная почта была
              определена неверно.
            </span>
          </div>
        </slot>
      </div>
      <div class="card-content__footer">
        <slot name="footer">
          <v-btn
            v-if="buttonText"
            :ripple="false"
            class="text-none white--text custom-modal-login__btn"
            elevation="0"
            large
            color="#0ACCDA"
            block
            @click="$emit('click-first-button')"
          >
            {{ buttonText }}
          </v-btn>
          <v-btn
            v-if="secondButtonText"
            :ripple="false"
            class="text-none white--text custom-modal-login__btn"
            elevation="0"
            large
            color="#9FA4B1"
            block
            @click="$emit('click-second-button')"
          >
            {{ secondButtonText }}
          </v-btn>
          <div v-if="reSend">
            <p class="card-content__footer-text">
              Не получили письмо?
              <a @click.prevent="$emit('resend-email')">Отправить повторно</a>
            </p>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import CheckCircleIcon from '@/assets/svg/check-circle.svg'
import LockIcon from '@/assets/svg/lock-open-filled.svg'
import MailIcon from '@/assets/svg/mail.svg'

export default {
  components: {
    CheckCircleIcon,
    MailIcon,
    LockIcon
  },
  props: {
    icon: {
      type: String,
      default: 'check'
    },
    headerColor: {
      type: String,
      default: '#5CC689'
    },
    title: String,
    text: String,
    buttonText: String,
    secondButtonText: String,
    reSend: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getIcon() {
      return {
        'check': CheckCircleIcon,
        'mail': MailIcon,
        'lock': LockIcon
      }[this.icon]
    },
  },
};
</script>
<!--sushi time and also the time to have some fun, bitch mthfcka!-->

<style scoped>
.card {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  z-index: 9999;
  max-width: 500px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px 0;
  width: 100%;
}

.card-content {
  padding: 64px 56px;
  background-color: #fff;
  color: #171729;
}

.card-content p {
  margin: 0;
}

.card-content__title {
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
}

.card-content__body {
  margin-top: 32px !important;
}

.card-content__info {
  margin-top: 32px !important;
  display: flex;
  font-size: 14px;
}

.card-content__info > div {
  margin-right: 10px;
}

.card-content__footer {
  margin-top: 52px;
}

.card-content__footer-text {
  margin-top: 48px !important;
  font-size: 14px;
}

.card-content__footer-text > a {
  color: #3e77ff;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.custom-modal-login__btn {
  font-size: 15px;
  font-weight: 600;
}

.custom-modal-login__btn:nth-child(2) {
  margin-top: 16px;
}
</style>
