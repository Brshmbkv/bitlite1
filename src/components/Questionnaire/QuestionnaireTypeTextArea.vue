<template>
  <div>
    <v-textarea
      @input="$emit('update:value', $event)"
      outlined
      full-width
      height="200"
      class="questionnaire-type__textarea flex-grow-0"
    >
    </v-textarea>
  </div>
</template>

<script>
export default {
  name: "QuestionnaireTypeTextArea",
  props: {
    question: String,
    value: String
  }
}
</script>

<style lang="scss">
.questionnaire-type__textarea:not(.v-input--is-focused, .error--text) {
  .v-input__slot {
    fieldset {
      border: 1px solid #5A6275 !important;
    }
  }
}
</style>
