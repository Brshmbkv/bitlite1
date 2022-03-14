<template>
  <v-btn
    :ripple="false"
    elevation="0"
    color="#171729"
    class="text-none font-weight-medium white--text questionnaire-next__btn"
    width="160"
    :disabled="disabled"
    @click="$emit('click')"
  >
    {{ text }}
    <ArrowIcon
      class="questionnaire-next__btn__icon"
    />
  </v-btn>
</template>

<script>
import ArrowIcon from '@/assets/svg/arrow-long.svg'

export default {
  name: "QuestionnaireNextButton",
  components: {
    ArrowIcon
  },
  props: {
    text: {
      type: String,
      default: 'Следующий'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.questionnaire-next__btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 14px 22px 22px !important;

  &:hover {
    .questionnaire-next__btn__icon {
      animation: tuda-syuda 0.4s ease alternate infinite;

      @keyframes tuda-syuda {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-3px);
        }
        100% {
          transform: translateY(3px);
        }
      }
    }
  }
}
</style>
