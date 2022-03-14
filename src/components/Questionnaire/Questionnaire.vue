<template>
  <div class="text-left pt-5">
    <p class="questionnaire__title">{{ `${name}, а теперь расскажи немного о себе 🤔` }}</p>
    <p class="questionnaire__subtitle">
      Это необходимо для того чтобы мы могли лучше подобрать тебе обучающий материал
    </p>
    <v-divider class="mb-4"/>
    <component
      v-for="(question) in questions"
      :key="question.id"
      :is="getComponent(question.type)"
      :question="question.question"
      :options="question.answers"
      :value.sync="question.value"
      :answer_id.sync="question.answer_id"
    />
  </div>
</template>

<script>
import QuestionnaireTypeRadio from "@/components/Questionnaire/QuestionnaireTypeRadio";
import QuestionnaireTypeTextArea from "@/components/Questionnaire/QuestionnaireTypeTextArea";
import QuestionnaireTypeSelect from "@/components/Questionnaire/QuestionnaireTypeSelect";
import QuestionnaireTypeScale from "@/components/Questionnaire/QuestionnaireTypeScale";

export default {
  name: "Questionnaire",
  props: {
    name: String,
    questions: Array
  },
  methods: {
    getComponent(type) {
      return {
        'radio': QuestionnaireTypeRadio,
        'textarea': QuestionnaireTypeTextArea,
        'select': QuestionnaireTypeSelect,
        'scale': QuestionnaireTypeScale,
      }[type]
    }
  }
}
</script>

<style lang="scss">
.questionnaire__title {
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  margin-bottom: 8px;
  text-align: center;
}
.questionnaire__subtitle {
  color: #5A6275;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 40px;
  text-align: center;
}
</style>
