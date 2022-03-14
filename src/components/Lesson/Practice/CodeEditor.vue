<template>
  <div>
    <div class="code-editor mb-10">
      <StatusBar
        :level="level"
        :status="status"
        :loading="sendLoading"
        :attempts="attemptsUser"
        :answer_type="answerType"
        :send_disabled="sendDisabled"
        @openFaqInstructions="T800_faq_active = true"
        @sendAnswer="$emit('send')"
      />
      <Codemirror
        class="Practice__CM"
        v-model="editorContent"
        :options="CM_options"
      />
      <RobotOverlay
        v-if="T800_is_first_submition && (['compiler', 'compiler_noj'].includes(answerType))"
        @click="T800_instructions_active = true"
      />
      <div v-else-if="isLoading" class="code-editor__loading">
        <v-progress-circular
          :size="70"
          :width="7"
          color="gray"
          class="mb-4"
          indeterminate
        ></v-progress-circular>
        <span style="font-size: 14px">Наш T-800 проверяет вашу задачу...</span>
        <span style="font-size: 14px">Можете переходить к следующей задаче!</span>
      </div>
      <CompilerAlert
        v-if="(['compiler', 'compiler_noj'].includes(answerType)) && status"
        :attempts="attemptsUser"
        :attemptsLeft="attemptsMax - attemptsUser"
        :status="status"
        :next-is-enabled="nextIsAvailable"
        :has-hint="hasHint"
        :has-answer="hasAnswer"
        :score="score"
        @clickHelp="$emit('help_request')"
        @clickInstructions="T800_faq_active = true"
        @clickNext="$emit('nextClick')"
        @clickShowHint="$emit('show_hint')"
        @clickShowTeacherAnswer="show_teacher_answer = true"
        @clickSendAnswer="$emit('sendAnswer')"
      />
      <RobotInstructionsOverlay
        v-if="(['compiler', 'compiler_noj'].includes(answerType))"
        :active="T800_instructions_active"
        @close="handleT800InstructionClose"
      />
      <RobotFAQOverlay
        v-if="['compiler', 'compiler_noj'].includes(answerType)"
        v-model="T800_faq_active"
      />
      <LessonPracticeTeacherAnswer
        :exercise-id="exerciseId"
        :dialog="show_teacher_answer"
        :text-color-on-hover="'#383D57'"
        hide-button
        @close="show_teacher_answer = false"
      />
    </div>
  </div>
  <!-- @keydown.ctrl.enter.stop="sendCurrentExercise" -->
  <!-- v-model="problems[currentId - 1].codeChanges" -->
</template>

<script>
import Codemirror from '@/components/codemirror'
import CompilerAlert from '@/components/Lesson/Practice/CodeEditor/CompilerAlert'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/blackboard.css'
import 'codemirror/mode/clike/clike'
import RobotInstructionsOverlay from '@/components/Lesson/Practice/CodeEditor/RobotInstructionsOverlay'
import RobotOverlay from '@/components/Lesson/Practice/CodeEditor/RobotOverlay.vue'
import StatusBar from "@/components/Lesson/Practice/CodeEditor/StatusBar.vue"
import RobotFAQOverlay from '@/components/Lesson/Practice/CodeEditor/RobotFAQOverlay.vue'
import LessonPracticeTeacherAnswer from "@/components/Lesson/Practice/TeacherAnswer";

export default {
  name: "LessonPracticeCodeEditor",

  components: {
    LessonPracticeTeacherAnswer,
    Codemirror,
    CompilerAlert,
    StatusBar,
    RobotFAQOverlay,
    RobotInstructionsOverlay,
    RobotOverlay,
  },

  props: {
    answerType: String, // 'text' or 'compiler'
    attemptsMax: Number,
    attemptsUser: Number,
    exerciseId: Number,
    hasHint: Boolean,
    hasAnswer: Boolean,
    isLoading: Boolean,
    sendLoading: Boolean,
    level: String,
    mode: String,
    nextIsAvailable: Boolean,
    options: {
      type: Object,
      default(){
        return {
          tabSize: 2,
          theme: 'blackboard',
          lineNumbers: true,
          line: true
        }
      }
    },
    sendDisabled: Boolean,
    retry: {
      type: Boolean,
      default: true
    },
    status: Object,
    value: String,
    score: Number
  },

  data(){
    return {
      show_teacher_answer: false,
      editorContent: this.value,
      T800_faq_active: false,
      T800_instructions_active: false,
      T800_is_first_submition: !window.localStorage.getItem('T800_is_instructed'),
    }
  },

  computed: {
    CM_options(){
      let { options, mode, retry } = this
      return {
        ...options,
        readOnly: !retry,
        mode
      }
    },
    // sendBtnText(){
    //   let { sendDisabled, status } = this;
    //   if ( sendDisabled && (status && [1,].includes(status.code)) ){
    //     return 'Задача на проверке'
    //   } else if(status && [3,4].includes(status.code)){
    //     return 'Задача выполнена'
    //   } else {
    //     return 'Отправить на проверку'
    //   }
    // }
  },

  watch: {
    editorContent( newValue, oldValue ){
      if (newValue !== oldValue){
        this.$emit('input', newValue);
      }
    },
    value( newValue ){
      this.editorContent = newValue;
    },
  },

  methods: {
    handleT800InstructionClose(){
      this.T800_instructions_active = false;
      this.T800_is_first_submition = false;
      window.localStorage.setItem('T800_is_instructed', 'true');
    },
  },
}
</script>
<style lang="scss">
.Practice__CM {
  .CodeMirror {
    min-height: 500px;

    .CodeMirror-vscrollbar {
      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(23, 23, 41, 0.08);
        border-radius: 100px;
      }

      &::-webkit-scrollbar-thumb {
        background: #9FA4B1;
        border-radius: 100px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    }
  }
}

.code-editor {
  position: relative;
  min-height: 500px;

  .code-editor__loading {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(94, 94, 107, 0.5);
    backdrop-filter: blur(2px);
  }
}

</style>
