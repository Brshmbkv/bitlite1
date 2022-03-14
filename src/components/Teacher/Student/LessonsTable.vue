<template>
  <v-row>
    <v-col>
      <v-simple-table class="my-table">
        <thead>
          <tr>
            <th
              class="text-left"
              style="font-size: 14px; line-height: 20px; font-weight:500; letter-spacing: 0.02em; color: #A7ADC3"
            ></th>
            <th
              class="text-left"
              style="font-size: 14px; line-height: 20px; font-weight:500; letter-spacing: 0.02em; color: #A7ADC3"
            >
              Дата и Время
            </th>
            <th
              class="text-left"
              style="font-size: 14px; line-height: 20px; font-weight:500; letter-spacing: 0.02em; color: #A7ADC3"
            >
              Название
            </th>
            <th
              class="text-center"
              style="font-size: 14px; line-height: 20px; font-weight:500; letter-spacing: 0.02em; color: #A7ADC3"
            >
              Статус
            </th>
            <th
              class="text-right"
              style="font-size: 14px; line-height: 20px; font-weight:500; letter-spacing: 0.02em; color: #A7ADC3"
            >
              Балл
            </th>
          </tr>
        </thead>
        <tbody v-if="events && events.length > 0">
          <template>
            <component
              :is="areLinks ? 'router-link' : 'tr'"
              v-for="(event, ekey) in events"
              :key="'e+' + ekey"
              tag="tr"
              :to="
                areLinks
                  ? {
                      name: 'StudentEventPractice',
                      params: {
                        student_id,
                        stream_id,
                        event_id: event.id,
                      },
                    }
                  : undefined
              "
              :style="{
                color:
                  (event.status && event.status.color) === 'disabled'
                    ? '#9FA4B1'
                    : (event.status && event.status.color) === 'success'
                    ? '#0BC3B8'
                    : '#171729',
                cursor: areLinks ? 'pointer' : 'default',
              }"
            >
              <td class="">{{ ekey + 1 }}</td>
              <td class="text-capitalize text-no-wrap">
                {{ event.starts_at | longFormat }}
              </td>
              <td style="font-weight: 600;font-size: 15px">
                <template v-if="'chapter' in event">
                  {{ event.chapter.title || '' }}
                </template>
              </td>
              <td class="text-center">
                <div
                  v-if="event.status"
                  style="border-radius: 4px"
                  :style="{
                    'background-color': getChipColor(event.status.color),
                    color: getChipTextColor(),
                  }"
                  label
                >
                  <span
                    style="font-size: 12px; line-height: 16px; font-weight: 600; letter-spacing: 0.02em; padding: 4px 8px;"
                  >
                    {{ event.status.text || '' }}
                  </span>
                </div>
              </td>

              <td class="text-right  pr-0">
                {{ event.real_score + (event.real_score >= 0 ? '%' : '') }}
              </td>
            </component>
          </template>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="text-center">
              Нет данных. У модуля нет расписания
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import { mdiLock, mdiCircle } from '@mdi/js'
export default {
  filters: {
    // chipDateFilter(d){
    //   if (!d) return ''
    //   let date = new Date(d);
    //   let dateText = date.toLocaleDateString('ru-RU', {
    //     day: "2-digit",
    //     month: "short",
    //     hour12: false,
    //     hour: '2-digit',
    //     minute: '2-digit'
    //   });
    //   return dateText;
    // },
  },
  props: {
    student_id: {
      default: undefined,
    },
    stream_id: {
      default: undefined,
    },
    module_id: {
      default: undefined,
    },
    areLinks: {
      type: Boolean,
      default: false,
    },
    events: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      UserPlaceholderSm,
      mdiLock,
      mdiCircle,
    }
  },
  methods: {
    getChipColor(status) {
      let statusBgColorMap = {
        default: '#9ca3af',
        pizdec: '#ef4444',
        success: '#00665E',
        warning: '#fbbf24',
        disabled: '#d1d5db',
      }
      return statusBgColorMap[status] || 'chip--default'
    },
    getChipTextColor() {
      return '#ffffff'
    },
  },
}
</script>
<style lang="scss" scoped></style>
