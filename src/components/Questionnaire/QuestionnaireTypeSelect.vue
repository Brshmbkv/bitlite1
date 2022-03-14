<template>
  <div>
    <p style="font-weight: 600; font-size: 16px; line-height: 24px; margin-bottom: 0;">{{ question }}</p>
    <v-radio-group
      class="questionnaire-type__radio"
    >
      <v-radio
        v-for="option in options"
        :key="option.id"
        :value="option.id"
        :ripple="false"
        :label="option.answer"
        @click="setValue(option.id)"
      ></v-radio>
    </v-radio-group>
    <v-textarea
      outlined
      ref="custom_option"
      :filled="disabled"
      :disabled="disabled"
      @input="$emit('update:value', $event)"
    >
    </v-textarea>
  </div>
</template>

<script>
export default {
  name: "QuestionnaireTypeSelect",
  props: {
    question: String,
    options: Array,
    value: [Number, String],
    answer_id: Number
  },
  data() {
    return {
      fake_value: this.value,
      disabled: true,
    }
  },
  methods: {
    setValue(id) {
      let opt = this.options.find(o => o.id === id)
      if(opt.answer === 'Другое') {
        this.disabled = false
        this.$emit('update:answer_id', undefined)
      } else {
        this.$refs['custom_option'].reset()
        this.$emit('update:answer_id', id)
        this.disabled = true
      }

    }
  }
}
</script>

<style lang="scss">
.questionnaire-type__radio {
  margin-top: 4px;

  .v-input--radio-group__input {
  }
  .v-radio {
    .v-input--selection-controls__input {
      margin-right: 4px;
    }
    label {
      color: #171729 !important;
    }
  }
}
</style>
