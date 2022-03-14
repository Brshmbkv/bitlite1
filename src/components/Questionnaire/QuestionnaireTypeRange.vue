<template>
  <div class="justify-start">
    <div class="questionnaire-question__type-range">
      <v-btn
        :ripple="false"
        elevation="0"
        icon
        outlined
        height="44"
        width="44"
        class="questionnaire-question__type-range__btn"
        @click="decrementValue"
      >
        <v-icon>
          {{ mdiMinus }}
        </v-icon>
      </v-btn>
      <v-text-field
        :value="changeableValue"
        single-line
        outlined
        dense
        hide-details
        height="64"
        class="questionnaire-question__type-range__input"
        @input="changeValue($event)"
      />
      <v-btn
        :ripple="false"
        elevation="0"
        icon
        outlined
        height="44"
        width="44"
        class="questionnaire-question__type-range__btn"
        @click="incrementValue"
      >
        <v-icon>
          {{ mdiPlus }}
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mdiPlus, mdiMinus } from '@mdi/js'

export default {
  name: "QuestionnaireTypeRange",
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      mdiPlus,
      mdiMinus,
      changeableValue: this.value
    }
  },
  methods: {
    changeValue(e) {
      this.changeableValue = Number(e)
      this.$emit('update:value', this.changeableValue)
    },

    incrementValue() {
      if(this.changeableValue < 100) {
        this.changeableValue++
        this.$emit('update:value', this.changeableValue)
      }
    },

    decrementValue() {
      if(this.changeableValue > 0) {
        this.changeableValue--
        this.$emit('update:value', this.changeableValue)
      }
    }
  }
}
</script>

<style lang="scss">
.questionnaire-question__type-range {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 100px;

  &__btn {
    border: 1px solid rgba(23, 23, 41, 0.08) !important;

    &:hover {
      svg {
        fill: #FFFFFF;
      }

      background-color: #0ACCDA;
    }
  }

  &__input {
    max-width: 64px;
    border-radius: 10px;

    &:not(.v-input--is-focused, .error--text) {
      .v-input__slot {
        fieldset {
          border: 1px solid rgba(23, 23, 41, 0.15);
        }
      }
    }

    input {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
    }
  }
}
</style>
