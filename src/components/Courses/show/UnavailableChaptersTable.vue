<template>
  <v-row>
    <v-col cols="12">
      <v-alert
        elevation="0"
        color="error"
        outlined
        style="border-radius: 10px;"
        class="py-3"
      >
        <template v-slot:prepend>
          <v-avatar size="24" class="mr-3">
            <v-img
              :src="EmojiSmileSrc"
              alt=""
            />
          </v-avatar>
        </template>
        <span
          class="course-buy-alert__text"
        >{{
            buy_link 
              ?'Чтобы пройти полную программу, купите наш основной курс' 
              : starts_soon 
                ? 'Скоро у модуля будет составлено расписание.'
                : is_lite 
                  ? 'Данный курс является подготовительным' 
                  : 'Скоро курс будет доступен для покупки'
          }}</span>
        <template v-slot:append>
          <v-btn
            v-if="buy_link"
            :to="buy_link"
            color="error"
            elevation="0"
            :ripple="false"
            class=""
          >
            КУПИТЬ
          </v-btn>
        </template>
      </v-alert>
    </v-col>
    <v-col>
      <v-simple-table class="my-table">
        <thead>
        <tr>
          <th class="text-left font-weight-regular grayLight--text pl-0">Урок</th>
          <th class="text-left font-weight-regular grayLight--text">Название</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="chapters">
          <router-link
            v-for="(chapter, ekey) in chapters"
            tag="tr"
            :key="'e+'+ekey"
            :to="''"
            :style="{
                color: '#9FA4B1',
                cursor: 'default',
              }"
          >
            <td class="pl-0">{{ '#' + (ekey + 1) }}</td>
            <td class="font-weight-medium py-2">
              <span class="td__chapter-title">{{ chapter.title || '' }}</span>
              <span class="td__chapter-description">{{ chapter.description || '' }}</span>
            </td>
          </router-link>
        </template>
        <p v-else>Нет данных</p>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import EmojiSmileSrc from '@/assets/png/emoji-smile.png'
import { mdiLock, mdiCircle, mdiAlertCircleOutline } from "@mdi/js"

export default {
  name: 'UnavailableChaptersTable',
  filters: {
    progressWaiting(ch) {
      return (
        (ch.passed_exercises + ch.passed_tests)
        /
        (ch.total_exercises + ch.total_tests)
      ) * 100
    },
    progressTotal(ch) {
      return (
        (ch.checked_exercises + ch.passed_tests)
        /
        (ch.total_exercises + ch.total_tests)
      ) * 100
    },
    getChipColor(status) {
      let statusBgColorMap = {
        'default': 'rgba(23, 23, 41, 0.08)',
        'pizdec': 'rgba(241, 102, 53, 0.08)',
        'success': 'rgba(11, 196, 184, 0.08)',
        'warning': 'rgba(231, 174, 30, 0.12)',
        'disabled': '#F8F8F8',
      }
      return statusBgColorMap[status] || 'chip--default';
    },
    getChipTextColor(status) {
      let statusTextColorMap = {
        'default': '#5A6275',
        'pizdec': '#F16635',
        'success': '#0BC3B8',
        'warning': '#E7AE1E',
        'disabled': '#9FA4B1',
      }
      return statusTextColorMap[status] || 'chip--default';
    },
  },
  props: {
    buy_link: {
      type: String,
    },
    module_id: {
      default: undefined
    },
    chapters: {
      type: Array,
      default() {
        return []
      },
    },
    is_lite: {
      type: Boolean,
      default: false,
    },
    starts_soon: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      EmojiSmileSrc,
      UserPlaceholderSm,
      mdiLock,
      mdiCircle,
      mdiAlertCircleOutline
    }
  },
  methods: {
    lessonsLeft(ch) {
      if (ch.total_exercises > 0) {
        return Math.ceil(
          ((ch.total_exercises * ch.min_progress) / 100) - ch.passed_exercises
        )
      } else return 0
    },
    testsLeft(ch) {
      if (ch.total_exercises > 0) {
        return Math.ceil(
          ((ch.total_tests * ch.min_progress) / 100) - ch.passed_tests
        )
      } else return 0
      // ch.passed_exercises
      // ch.total_exercises
      // (ch.min_progress/100)
    },
  }
}
</script>
<style lang="scss">
.course-buy-alert__text {
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 27px;
  letter-spacing: 0.02em;
  text-align: left;
  color: #5A6275;

}

.td__chapter-title {
  display: block;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}

.td__chapter-description {
  display: block;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 150%;
  padding-top: 5px;
}
</style>