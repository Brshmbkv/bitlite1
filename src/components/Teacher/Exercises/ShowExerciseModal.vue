<template>
  <div>
    <div
      ref="modal"
      :style="{ display: value ? 'flex' : '' }"
      class="modal-wrapper"
    >
      <div class="modal-header">
        <div class="username-wrapper">
          <v-icon size="32" color="#262940">{{ mdiAccount }}</v-icon>
          <h1 class="username">{{ data.fullName }}</h1>
        </div>
        <div class="overdue" :class="{ 'bg-overdue': data.overdue }">
          <v-icon color="#208025" v-if="!data.overdue">{{
            mdiCheckCircle
          }}</v-icon>
          <v-icon color="#956C24" v-else>{{ mdiClock }}</v-icon>
          <span
            class="overdue-text"
            :style="{ color: data.overdue ? '#956C24' : '#208025' }"
            >{{ data.overdue ? 'С опозданием' : 'В срок' }}</span
          >
        </div>
      </div>
      <div class="description">
        <h2 class="description-title">Описание</h2>
        <div v-html="data.description"></div>
      </div>
      <div class="codemirror-header">
        <span class="codemirror-header__text">Ответ</span>
      </div>
      <Codemirror
        class="cm Practice__CM"
        ref="cm"
        :code="data.code"
        :options="cmOptions"
      />
      <div class="comment-wrapper">
        <h3 class="comment-title">Комментарий</h3>
        <textarea
          class="comment"
          v-model="data.comment"
          placeholder="Напишите комментарий к решению"
        >
        </textarea>
      </div>
      <div class="score-wrapper">
        <span class="score-text">Оценка:</span>
        <div style="position: relative;">
          <input
            class="score-input"
            v-model="data.score"
            type="number"
            min="0"
            max="100"
            step="1"
          />
          <button @click="up" type="button">
            <v-icon
              class="arrow-up"
              size="20"
              color="#171729"
              style="font-weight: 700"
              >{{ mdiChevronUp }}</v-icon
            >
          </button>
          <button @click="down" type="button">
            <v-icon
              class="arrow-down"
              size="20"
              color="#171729"
              style="font-weight: 700"
              >{{ mdiChevronDown }}</v-icon
            >
          </button>
        </div>
      </div>
      <div class="buttons">
        <div class="btns-left">
          <button @click="saveResults(true)" class="btn send-back-btn">
            Отправить на доработку
          </button>
        </div>
        <div class="btns-right">
          <button @click="saveResults()" class="btn save-btn">Сохранить</button>
          <button @click="$emit('clickOutside')" class="btn cancel-btn">
            Отменить
          </button>
        </div>
      </div>
    </div>
    <div
      ref="modalOverlay"
      :style="{
        opacity: value ? '100' : '',
        visibility: value ? 'visible' : '',
      }"
      class="overlay-cm"
      @click="$emit('clickOutside')"
    ></div>
  </div>
</template>

<script>
import Codemirror from '@/components/codemirror.vue'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/blackboard.css'
import { getCourseConfig } from '@/helpers'
import {
  mdiAccount,
  mdiCheckCircle,
  mdiClock,
  mdiChevronUp,
  mdiChevronDown,
} from '@mdi/js'

export default {
  components: {
    Codemirror,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    courseId: {
      type: Number,
    },
  },
  data() {
    return {
      mdiAccount,
      mdiCheckCircle,
      mdiClock,
      mdiChevronUp,
      mdiChevronDown,
      cmOptions: {
        theme: 'blackboard',
        readOnly: 'nocursor',
        tabSize: 2,
        lineNumbers: true,
        line: true,
      },
    }
  },
  computed: {
    score() {
      return this.data.score
    },
  },
  watch: {
    value: function(newVal) {
      if (newVal) {
        document.documentElement.style.overflow = 'hidden'
        document.querySelector('.modal-wrapper').scrollTop = 0
        return
      }
      document.documentElement.style.overflow = ''
    },
    score: function(newVal) {
      if (newVal < 0) {
        this.data.score = 0
      } else if (newVal > 100) {
        this.data.score = 100
      }
    },
  },
  created() {
    const func = async () => {
      const { path, mode } = getCourseConfig(this.courseId)
      await import('codemirror/mode/' + path + '/' + path + '.js')
      return mode
    }
    func().then((mode) => {
      this.cmOptions = { ...this.cmOptions, mode: mode }
    })
  },
  mounted() {
    window.addEventListener('keyup', this.handleEscPressed)
  },
  destroyed() {
    window.removeEventListener('keyup', this.handleEscPressed)
  },
  methods: {
    getCourseConfig,
    handleEscPressed(e) {
      if (e.key === 'Escape' && this.value) {
        this.$emit('clickOutside')
      }
    },
    up() {
      if (+this.data.score >= 100) return
      this.data.score = +this.data.score + 1
    },
    down() {
      if (+this.data.score <= 0) return
      this.data.score -= 1
    },
    saveResults(retake = false) {
      const obj = {
        id: this.data.id,
        user_id: this.data.user_id,
        exercise_id: this.data.exercise_id,
        score: this.score,
        comment: this.data.comment ?? null,
      }
      if (retake) {
        obj['retake'] = true
        obj.score = 0
      }
      this.$emit('save', obj)
      this.$emit('clickOutside')
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-wrapper {
  display: none;
  flex-direction: column;
  position: fixed;
  z-index: 201;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 1260px;
  max-height: 90%;
  overflow: auto;
  border-radius: 10px;
  padding: 40px 70px 60px;
  background-color: #fff;
}
.cm {
  position: relative;
  z-index: inherit;
  width: 100%;
}
.overlay-cm {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  z-index: 200;
  background-color: rgba(#000000, 0.46);
  inset: 0;
  transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.modal-header {
  display: flex;
  align-items: center;
  gap: 40px;
}
.username-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 16px;
}
.username {
  font-size: 22px;
  line-height: 32px;
  font-weight: 700;
  color: #171729;
}
.overdue {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 7px;
  background-color: #d9f7cd;
}
.bg-overdue {
  background-color: #ffebb9;
}
.overdue-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
}
.description {
  margin: 32px 0;
  padding: 24px 24px 0;
  background-color: #f5f6f8;
  max-height: 200px;
  overflow-y: auto;
  flex-shrink: 0;
}
.description-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #171729;
  margin-bottom: 8px;
}
.codemirror-header {
  width: 100%;
  border-radius: 10px 10px 0 0;
  background-color: #10101f;
  &__text {
    color: #fff;
    font-weight: 700;
    font-size: 18px;
    line-height: 24px;
    padding: 24px;
    display: inline-block;
  }
}
.comment-wrapper {
  min-height: 200px;
  border-radius: 10px;
  background-color: #f5f6f8;
  padding: 24px;
  margin: 24px 0 40px;
}
.comment-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #171729;
}
.comment {
  display: block;
  width: 100%;
  min-height: 130px;
  outline: none;
  margin-top: 16px;
  resize: none;
}
.score-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}
.score-text {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  color: #171729;
}
.score-input {
  min-width: 102px;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
  padding: 18px 32px 18px 12px;
  background-color: #f5f6f8;
  border-radius: 10px;
  outline: none;
  -moz-appearance: textfield;
  &:focus {
    outline: 1px solid #dbdfe4;
  }
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
.arrow-up,
.arrow-down {
  position: absolute;
  right: 10px;
}
.arrow-up {
  top: 35%;
  transform: translateY(-50%);
}
.arrow-down {
  top: 65%;
  transform: translateY(-50%);
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-top: 64px;
}
.btn {
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.01em;
  font-weight: 600;
  border-radius: 5px;
  color: #ffffff;
}
.send-back-btn {
  padding: 12px 40px;
  color: #ef4444;
  border: 2px solid #ef4444;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #fee2e2;
  }
}
.save-btn,
.cancel-btn {
  min-width: 170px;
}
.save-btn {
  padding: 12px 40px;
  background-color: #4376FB;
}
.cancel-btn {
  padding: 12px 44px;
  background-color: #9daabc;
}
.btns-right {
  display: inline-flex;
  align-items: center;
  gap: 27px;
}
</style>

<style lang="scss">
.Practice__CM {
  .CodeMirror {
    min-height: 500px;
    border-radius: 0 0 10px 10px;
    .CodeMirror-vscrollbar {
      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(23, 23, 41, 0.08);
        border-radius: 100px;
      }

      &::-webkit-scrollbar-thumb {
        background: #9fa4b1;
        border-radius: 100px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    }
    .CodeMirror-hscrollbar {
      &::-webkit-scrollbar {
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(23, 23, 41, 0.08);
        border-radius: 100px;
      }

      &::-webkit-scrollbar-thumb {
        background: #9fa4b1;
        border-radius: 100px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    }
    .CodeMirror-scrollbar-filler {
      display: none !important;
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
