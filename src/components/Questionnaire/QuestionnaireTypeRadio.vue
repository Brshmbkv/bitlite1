<template>
  <div>
    <p style="font-weight: 600; font-size: 16px; line-height: 24px; margin-bottom: 8px;">{{ question }}</p>
    <v-radio-group
      row
      class="questionnaire-type__radio"
    >
      <v-radio
        v-for="option in options"
        :key="option.id"
        :value="option.answer"
        :ripple="false"
        :label="option.answer"
        @click="$emit('update:answer_id', option.id)"
      ></v-radio>
    </v-radio-group>
  </div>
</template>

<script>
export default {
  name: "QuestionnaireTypeRadio",
  props: {
    question: String,
    options: Array,
    answer_id: Number
  }
}
</script>

<style lang="scss">
.questionnaire-type__radio {
  margin-top: 4px;

  .v-input--radio-group__input {
    justify-content: space-between;
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
