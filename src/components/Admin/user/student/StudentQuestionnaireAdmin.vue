<template>
  <div class="show-user__card pa-4 show-user__questionnaire">
    <div
      v-for="(question, idx) in questions"
      :key="question.id"
      class="mb-4"
    >
      <p class="mb-1" style="font-weight: 600; font-size: 18px">{{ `${idx+1}. ${question.question}` }}</p>
      <span class="ml-6 pl-2 py-2 show-user__questionnaire__answer" >
        {{ ((question.answer && question.answer.answer) || (question.user_answer && question.user_answer.value)) || '-' }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentQuestionnaireAdmin",
  props: {
    questions: Array,
  }
}
</script>

<style lang="scss">
.show-user__questionnaire {
  max-height: inherit;
  overflow: auto;
}
.show-user__questionnaire__answer {
  display: block;
  border-left: 3px solid #0ACCDA;
  font-weight: 500;
  transition: all 0.4s ease;
  position: relative;

  &:before {
    content: "";
    background-color: rgba(11, 195, 184, 0.12);
    transition: width 0.5s ease;
    position: absolute;
    width: 0;
    height: 100%;
    left: 0;
    top: 0;
  }

  &:hover {
    &:before {
      width: 100%;
    }
  }
}
</style>
