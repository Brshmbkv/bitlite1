<template>
  <v-row>
    <v-col>
      <v-simple-table class="my-table">
        <thead>
        <tr>
          <th class="text-left font-weight-regular grayLight--text pl-0">Урок</th>
          <th class="text-left font-weight-regular grayLight--text">Дата и Время</th>
          <th class="text-left font-weight-regular grayLight--text">Название</th>
          <th class="text-right font-weight-regular grayLight--text">Статус</th>
          <th class="text-right font-weight-regular grayLight--text pr-0">Балл</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="chapters">
          <component
            :is="areLinks ? 'router-link' : 'tr'"
            v-for="(chapter, ekey) in chapters"
            :key="'e+'+ekey"
            tag="tr"
            :to="areLinks ? {
                name: 'TeacherStreamStudentChapterShow',
                params: {
                  student_id: student_id,
                  group_id: stream_id,
                  chapter_id: chapter.id,
                  column: $parent.column,
                  order: $parent.order,
                  page: $parent.page,
                },
              } : undefined"
            :style="{
                color: (chapter.status && chapter.status.color) === 'disabled'
                  ? '#9FA4B1'
                  : (chapter.status && chapter.status.color) === 'success'
                    ? '#0BC3B8'
                    : '#171729',
                cursor: areLinks ? 'pointer' : 'default',
              }"
          >
            <td class="pl-0">{{ '#' + (ekey+1) }}</td>
            <td class="text-capitalize text-no-wrap">
              {{ chapter.starts_at | longFormat }}
            </td>
            <td style="font-weight: 600;font-size: 15px">
              <template>
                {{ chapter.title || ''}}
              </template>
            </td>
            <td class="text-right">
              <v-chip
                v-if="chapter.status"
                style="cursor: inherit; height: 24px;"
                :color=" chapter.status.color | getChipColor"
                :text-color=" chapter.status.color | getChipTextColor"
                label
              >
                <span class="chip__text">
                    {{ chapter.status.text || ''}}
                  </span>
              </v-chip>
            </td>
            <td class="text-right  pr-0">{{ chapter.score ? chapter.score + ((chapter.score >= 0) ? '%' : '') : '-'}}</td>
          </component>
        </template>
        <p v-else>Нет данных</p>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import { mdiLock, mdiCircle } from "@mdi/js"
export default {
  name: 'LiteChaptersTable',
  filters: {
    getChipColor(status){
      let statusBgColorMap = {
        'default':  'rgba(23, 23, 41, 0.08)',
        'pizdec' :  'rgba(241, 102, 53, 0.08)',
        'success':  'rgba(11, 196, 184, 0.08)',
        'warning':  'rgba(231, 174, 30, 0.12)',
        'disabled': '#F8F8F8',
      }
      return statusBgColorMap[status] || 'chip--default';
    },
    getChipTextColor(status){
      let statusTextColorMap = {
        'default':  '#5A6275',
        'pizdec' :  '#F16635',
        'success':  '#0BC3B8',
        'warning':  '#E7AE1E',
        'disabled': '#9FA4B1',
      }
      return statusTextColorMap[status] || 'chip--default';
    }
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
      default: undefined
    },
    stream_id: {
      default: undefined
    },
    areLinks: {
      type: Boolean,
      default: false,
    },
    chapters: {
      type: Array,
    },
  },
  data(){
    return {
      UserPlaceholderSm,
      mdiLock,
      mdiCircle,
    }
  }
}
</script>