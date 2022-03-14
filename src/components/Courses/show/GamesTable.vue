<template>
  <v-row>
    <v-col v-if="!available" cols="12">
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
            buy_link ? 'Чтобы пройти полную программу, купите наш основной курс' : 'Скоро курс будет доступен для покупки'
          }}
        </span>
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
    <v-col
      v-else
      cols="12"
    >
      <span
        v-if="now < start_date"
        class="course-will-start-in-future__text"
      >
        Скоро ваш курс будет открыт. Дата старта: {{ start_date | shortFormat }}
      </span>
    </v-col>
    <v-col>
      <v-simple-table class="my-table">
        <thead>
        <tr>
          <th class="text-left font-weight-regular grayLight--text pl-0">Урок</th>
          <!-- <th class="text-left font-weight-regular grayLight--text">Дата и Время</th> -->
          <th
            class="text-left font-weight-regular grayLight--text"
            style="min-width: 278px;"
          >Название
          </th>
          <th class="text-right font-weight-regular grayLight--text">Прогресс</th>
          <th class="text-right font-weight-regular grayLight--text">Статус</th>
          <th class="text-right font-weight-regular grayLight--text pr-0">Балл</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="chapters">
          <router-link
            v-for="(chapter, ekey) in chapters"
            tag="tr"
            :key="'e+'+ekey"
            :to="(
                chapters[ekey-1] // chapters[-1] returns undefined
                && chapters[ekey-1].next_available // prev chapter not complete
              ) || ekey === 0
              ?  {
                name: 'GameShow',
                params: {
                  chapter_id: chapter.id,
                }
              } : ''
            "
            :style="{
              color: ((
              chapters[ekey-1] // chapters[-1] returns undefined
              && chapters[ekey-1].next_available // prev chapter not complete
              ) || ekey === 0) && !chapter.completed
                ? '#171729' // black
                : (chapter.completed)
                  ? '#0BC3B8' // green
                  : '#9FA4B1', // gray
                cursor: (
                  chapters[ekey-1] // chapters[-1] returns undefined
                  && chapters[ekey-1].next_available // prev chapter not complete
                ) || ekey === 0 //locked by date
                ? 'pointer' : 'default'
              }"
          >
            <td class="pl-0">{{ '#' + (ekey + 1) }}</td>
            <!-- <td class="text-capitalize">
              {{ chapter.starts_at | tableDateFilter }}
            </td> -->
            <v-tooltip
              v-if="(chapters[ekey-1]  // chapters[-1] returns undefined
                && (!chapters[ekey-1].next_available
                  && (chapter.available_by_date === null)
                ) // prev chapter not complete
              ) && !chapter.available_by_date //
              "
              top
            >
              <template #activator="{ on, attrs }">
                <td
                  class="font-weight-medium py-2"
                  style="cursor: inherit;"
                  v-bind="attrs"
                  v-on="on"
                >
                  <!-- v-model="true" -->
                  <span class="td__chapter-title">{{ chapter.title || '' }}</span>
                  <div class="text-truncate">{{ chapter.description || '' }}</div>
                </td>
              </template>
              <span>Доступ откроется после прохождения урока: "{{ chapters[ekey - 1].title }}"</span>
            </v-tooltip>
            <td
              v-else
              class="font-weight-medium py-2"
            >
              <span class="td__chapter-title">{{ chapter.title || '' }}</span>
              <span class="d-inline-block text-truncate" style="max-width: 400px">{{ chapter.description || '' }}</span>
            </td>
            <td>
              <template v-if="(chapter.total_exercises && chapter.passed_exercises)">
                <v-tooltip
                  top
                >
                  <template #activator="{ on }">
                    <v-progress-linear
                      v-on="on"
                      class="mr-0 ml-auto"
                      style="max-width: 6em;"
                      color="rgba(231, 174, 30, 0.12)"
                      background-color='rgba(11, 196, 184, 0.08)'
                      rounded
                      height="25"
                      :value="chapter | progressWaiting"
                    >
                      <v-progress-linear
                        style="position: absolute;"
                        rounded
                        height="25"
                        background-color="transparent"
                        color="#0BC3B8"
                        :value="chapter | progressTotal"
                      ></v-progress-linear>
                      <!-- <strong style="color: white; position:absolute; z-index:1;">
                        {{ chapter.passed_exercises + ' / ' + chapter.total_exercises }}
                      </strong> -->
                    </v-progress-linear>
                  </template>
                  <span style="display: block;">
                      Сдано упражнений: {{ chapter.passed_exercises }} из {{ chapter.total_exercises }}
                    </span>
                  <span style="display: block;">
                      Сдано тестов: {{ chapter.passed_tests }} из {{ chapter.total_tests }}
                    </span>

                  <span style="display: block;">
                      {{
                        chapter.checked_exercises ?
                          ('Проверено ' + chapter.checked_exercises)
                          : 'Ждите проверки'
                      }}
                    </span>
                  <!-- chapter.total_exercises -->
                </v-tooltip>
              </template>
            </td>
            <td class="text-right">
              <v-tooltip
                v-if="
                  (!chapter.completed
                  && (
                    !chapters[ekey-1]
                    || chapters[ekey-1].next_available
                  ) && (
                    !chapter.starts_at // this will be false if lite course w/o event, thus return true
                    || chapter.available_by_date
                  ) && (
                    (lessonsLeft(chapter) > 0)
                    || (testsLeft(chapter) > 0)
                  ))
                "
                top
              >
                <template v-slot:activator="{ on }">
                  <v-icon v-on=" on ">
                    {{ mdiAlertCircleOutline }}
                  </v-icon>
                </template>
                <span
                  v-if="lessonsLeft(chapter) > 0"
                  style="display: block;"
                >
                  Осталось сдать упражнений: {{ lessonsLeft(chapter) }}
                </span>
                <span
                  v-if="testsLeft(chapter) > 0"
                  style="display: block;"
                >
                  Осталось сдать тестов: {{ testsLeft(chapter) }}
                </span>
              </v-tooltip>
              <v-chip
                v-else-if="chapter.status
                    && chapter.status.code
                    && chapter.status.code === 4
                  "
                style="cursor: inherit; height: 24px;"
                color="rgba(231, 174, 30, 0.12)"
                text-color="#E7AE1E"
                width="100%"
                label
              >
                  <span class="chip__text">
                    {{ 'ДЗ на проверке' }}
                  </span>
              </v-chip>
              <v-chip
                v-else-if="chapter.completed"
                style="cursor: inherit; height: 24px;"
                color="rgba(11, 196, 184, 0.08)"
                text-color="#0BC3B8"
                width="100%"
                label
              >
                  <span class="chip__text">
                    {{ 'ПРОЙДЕНО' }}
                  </span>
              </v-chip>
              <template v-else>-</template>
            </td>
            <td class="text-right pr-0">
              {{ chapter.score && (chapter.score + '%') || '' }}
            </td>
            <!-- <td class="text-right">
              <template v-if="chapter.lector">
                <v-avatar
                  size="24"
                  class="ml-1"
                >
                  <v-img
                    :src="chapter.lector.avatar || UserPlaceholderSm"
                    alt=""
                  />
                </v-avatar>
              </template>
            </td> -->
            <!-- <td class="text-right">{{ chapter.score + ((chapter.score >= 0) ? '%' : '')}}</td> -->
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
import { mdiLock, mdiCircle, mdiAlertCircleOutline, mdiClockOutline } from "@mdi/js"

export default {
  name: 'GamesTable',
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
    available: {
      type: Boolean,
      default: true,
    },
    module_id: {
      default: undefined
    },
    start_date: {
      type: Date,
      default: undefined
    },
    chapters: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      EmojiSmileSrc,
      UserPlaceholderSm,
      mdiClockOutline,
      mdiLock,
      mdiCircle,
      mdiAlertCircleOutline,
      now: new Date(Date.now()),
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

.course-will-start-in-future__text {
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 150%;
  letter-spacing: 0.02em;
  color: #F16635;
}

.td__chapter-title {
  display: block;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}

</style>