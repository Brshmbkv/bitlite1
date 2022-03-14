<template>
  <div class="code-editor__status-bar">
    <div class="status-bar__left">
      <template v-if="['compiler', 'compiler_noj'].includes(answer_type)">
        <v-tooltip
          v-model="showTooltip"
          nudge-top="5"
          content-class="status-bar__tooltip"
          top
        >
          <template v-slot:activator="{ on }">
            <div class="status-bar__icon-container">
              <RobotHead
                v-on="on"
                class="status-bar__robot-head"
                @click="handleRobotHeadClick($event)"
              />
            </div>
          </template>
          <span>Псст, я робот! Я знаю как сдавать задачи!</span>
        </v-tooltip>
      </template>
      <template>
        <v-tooltip
          top
          nudge-top="5"
          content-class="status-bar__tooltip"
        >
          <template v-slot:activator="{ on }">
            <div class="status-bar__icon-container" v-on="on">
              <ExerciseLevelBar :level="levelNumber"/>
            </div>
          </template>
          <span>{{ levelText }}</span>
        </v-tooltip>
      </template>
      <template v-if="attempts >= 0">
        <div class="status-bar__attempts">
          <span>Сделано попыток: <b style="color: #FFFFFF">{{ attempts }}</b></span>
        </div>
      </template>
    </div>
    <div class="status-bar__right">
      <ExerciseChip
        v-if="status.code"
        is-status
        class="py-2 px-4"
        :text="status.text"
        :icon="getStatusIcon(status.code)"
        :text-color="getStatusColor(status.code)"
        :bg-color="`${getStatusColor(status.code)}29`"
      />
      <v-btn
        elevation="0"
        :ripple="false"
        :loading="loading"
        class="primary text-none px-3"
        :class="[`status-bar__btn${send_disabled && '--disabled'}`]"
        @click="!send_disabled && $emit('sendAnswer')"
      >
        Отправить на проверку
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mdiCheck, mdiAlert, mdiWifiOff, mdiCancel } from '@mdi/js';
import RobotHead from "@/assets/svg/status_robot.svg"
import ExerciseChip from "@/components/Lesson/Practice/ExerciseChip";
import ExerciseLevelBar from "@/components/Lesson/Practice/ExerciseLevelBar";

export default {
  name: "CodeEditorStatusBar",
  components: {
    ExerciseLevelBar,
    ExerciseChip,
    RobotHead,
  },
  props: [
    'send_disabled',
    'answer_type',
    'attempts',
    'loading',
    'status',
    'level'
  ],
  data() {
    return {
      mdiCheck,
      mdiAlert,
      hideTooltip: !!localStorage.getItem('hide-robot-tooltip'),
    }
  },

  computed: {
    levelNumber() {
      let number = {
        '0.3': 1,
        '0.5': 2,
        '1': 3
      }[this.level]
      return number || 1
    },
    levelText() {
      return {
        '0.3': 'Сложность: Легко',
        '0.5': 'Сложность: Сложно',
        '1': 'Сложность: Хардкор'
      }[this.level] || ''
    },
    showTooltip: {
      get() {
        return !this.hideTooltip
          && (this.attempts === 1)
          && (this.status?.code === 2)
      },
      set() {
        this.hideTooltip = true;
      }
    },
  },

  methods: {
    getStatusColor(code) {
      return {
        1: '#E7AE1E',
        2: '#EE5252',
        3: '#5CC689',
        4: '#5CC689',
        5: '#E7AE1E',
        6: '#EE5252',
        8: '#E7AE1E'
      }[code]
    },

    getStatusIcon(code) {
      return {
        2: mdiAlert,
        3: mdiCheck,
        6: mdiCancel,
        7: mdiWifiOff,
        8: mdiAlert,
      }[code]
    },

    handleRobotHeadClick(event) {
      event.target.blur();
      this.hideTooltip = true;
      localStorage.setItem('hide-robot-tooltip', 'true')
      this.$emit('openFaqInstructions');
    }
  },
}
</script>
<style lang="scss">
.code-editor__status-bar {
  min-height: 56px;
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #FFFFFF;
  user-select: none;
  cursor: default;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.24)), #10101F;

  .status-bar__right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .status-bar__left {
    display: flex;
    align-items: center;
    gap: 12px;

    .status-bar__attempts {
      color: #9FA4B1;
      font-weight: 600;
      font-size: 15px;
      line-height: 16px;
      margin-left: 12px;
    }

    .status-bar__robot-head {
      cursor: pointer;

      &:focus {
        outline-style: none;
      }
    }
  }
}

.status-bar__tooltip {
  padding: 9px 17px;
  background: #262940;
  border: 1px solid #ffffff;
  border-radius: 5px;
  color: #ffffff;
  opacity: 1 !important;

  &:hover {
    background-color: #5A6275;
  }

  &:after {
    content: '';
    margin: 0 auto;
    width: 10px;
    height: 10px;
    background: #262940;
    border-top: none;
    border-right: 2px solid #ffffff;
    border-bottom: 2px solid #ffffff;
    border-radius: 3px;
    border-left: none;
    position: absolute;
    right: 0;
    left: 0;
    bottom: -6px;
    transform-origin: center center;
    transform: rotate(45deg);
  }
}

.status-bar__icon-container {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  transition: all .2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.24);
  }
}

.status-bar__btn {
  font-weight: 600;
  font-size: 15px;
  line-height: 16px;

  &--disabled {
    opacity: 0.4;
    cursor: default;
  }
}
</style>
