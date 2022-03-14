<template>
  <div class="technical-support">
    <div v-if="!success">
      <div class="technical-support__header">
        <div class="d-flex justify-space-between align-center pa-3 pb-0">
          <div class="d-flex align-center">
            <BitlabLogo class="ml-3 mr-2"/>
            <span class="white--text font-weight-bold">Bitlab</span>
          </div>
          <div style="height: 24px; width: 24px; cursor: pointer" @click="closeModal">
            <CloseIcon class="technical-support__header__close-icon"/>
          </div>
        </div>
        <div class="px-6 py-4">
          <span class="technical-support__header__text">Обращение в техподдержку</span>
        </div>
      </div>
      <div class="technical-support__body">
        <p class="technical-support__body__title mb-2">Тип обращения</p>
        <v-chip-group
          v-model="type"
          active-class="technical-support__chip--active"
          class="mb-3"
        >
          <v-chip
            v-for="type in types"
            :key="type"
            :value="type"
            :ripple="false"
            class="technical-support__chip"
          >
            {{ type }}
          </v-chip>
        </v-chip-group>
        <p class="technical-support__body__title">Ваш отзыв или предложение</p>
        <v-textarea
          v-model="text"
          outlined
          height="140"
          no-resize
          dense
          placeholder="Напишите комментарий"
          background-color="#FFFFFF"
        />
        <v-btn
          :ripple="false"
          color="#0BC3B8"
          block
          class="text-none white--text"
          style="border-radius: 6px; font-size: 16px"
          height="48"
          :disabled="!text || !type"
          large
          elevation="0"
          :loading="loading"
          @click="send"
        >
          Отправить
        </v-btn>
      </div>
    </div>
    <div v-else class="technical-support--success">
      <div class="technical-support--success__close-icon" @click="closeModal">
        <CloseIcon class="technical-support__header__close-icon"/>
      </div>
      <div class="technical-support--success__icon">
        <CheckCircleIcon/>
      </div>
      <div class="technical-support--success__text">
        <p>Отправлено!</p>
        <span>
          Ваше обращение было успешно отправлено.
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import CloseIcon from '@/assets/svg/close.svg'
import CheckCircleIcon from '@/assets/svg/check-circle.svg'
import BitlabLogo from '@/assets/svg/bitlab-logo.svg'

export default {
  name: "TechnicalSupportModal",
  components: {
    CloseIcon,
    BitlabLogo,
    CheckCircleIcon
  },
  data() {
    return {
      types: ['портал', 'контент', 'аккаунт', 'курсы'],
      type: undefined,
      text: '',
      loading: false,
      success: false,
    }
  },
  methods: {
    async send() {
      this.loading = true;
      try {
        const { data } = await this.$axios.post('tech-support', {
          content: this.text,
          type: this.type
        })
        if(data.message) this.success = true
      } catch(e) {
        throw new Error(e);
      }
      this.loading = false;
    },

    closeModal() {
      this.success = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.technical-support {
  position: absolute;
  bottom: 20px;
  right: 0;
  background-color: #F5F6F8;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.12);
  border-radius: 10px;

  &__header {
    background-color: #262940;
    border-radius: 10px 10px 0 0;
    margin-top: -1px;

    &__close-icon {
      path {
        fill: #FFFFFF;
      }
    }

    &__text {
      font-weight: bold;
      font-size: 18px;
      line-height: 24px;
      color: #FFFFFF;
    }
  }

  &__body {
    padding: 24px 24px 32px 24px;

    &__title {
      font-weight: bold;
      letter-spacing: 0.02em;
      color: #171729;
    }
  }

  &__chip {
    background: #FFFFFF !important;
    border: 1px solid #DBDFEA;
    box-sizing: border-box;
    border-radius: 7px !important;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    text-transform: lowercase;
    color: #505768;

    &:before {
      background: transparent !important;
    }

    &--active {
      border: 1px solid #3E77FF !important;
      color: #3E77FF !important;
    }
  }

  &--success {
    width: 330px;
    background-color: #262940;
    display: flex;
    border-radius: 10px;
    padding: 36px 16px;

    &__close-icon {
      height: 24px;
      width: 24px;
      right: 8px;
      top: 8px;
      cursor: pointer;
      position: absolute;
    }

    &__icon {
      width: 64px;
      height: 64px;
      margin-right: 16px;

      path {
        fill: #5cc689;
      }
    }

    &__text {
      p {
        font-weight: bold;
        font-size: 18px;
        line-height: 24px;
        color: #FFFFFF;
      }
      span {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #FFFFFF;
      }
    }
  }
}
</style>
