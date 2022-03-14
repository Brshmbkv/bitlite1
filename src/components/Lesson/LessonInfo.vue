<template>
  <v-row class="mt-3">
    <v-col cols="12" md=6>
      <v-row no-gutters>
        <v-col 
          cols="6"
          sm="4"
          md="6"
          lg="4" 
          class="mb-3 d-flex align-center"
        >
          <span class="grayLight--text">Статус</span>  
        </v-col>
        <v-col 
          cols="6"
          sm="8"
          md="6"
          lg="8"
        >
          <v-chip 
            v-if="status"
            style="cursor: inherit; height: 1.5rem;"
            :color="status.color | getChipColor"
            :text-color="status.color | getChipTextColor"
            label
          >
            <v-icon 
              x-small
              v-if="live"
              color="red"
              class="mr-1"
            >{{ mdiCircle }}</v-icon>
            <span class="chip__text">
              {{ status.text || ''}}
            </span>            
          </v-chip>
        </v-col>
        <v-col 
          cols="6"
          sm="4"
          md="6" 
          lg="4"
        >
          <span 
            class="grayLight--text"
            style="line-height: 32px"
          >{{ teacherTitle }}</span>
        </v-col>
        <v-col 
          cols="6"
          sm="8"
          md="6"
          lg="8"
        >
          <template v-if="lector">
            <v-avatar 
              size="32" 
              class="mr-3"
            >
              <v-img
                :src="lector.avatar || UserPlaceholderSm"
              />
            </v-avatar>
            <span>{{ 
              (lector.first_name ? lector.first_name : '') 
              + ' ' 
              + (lector.last_name ? lector.last_name : '')
            }}</span>
          </template>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md=6>
      <p class="LessonInfo__description-text">{{ description }}</p>
    </v-col>
  </v-row>
</template>

<script>
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'
import { mdiCircle } from "@mdi/js"
export default {
  name: 'LessonInfo',
  filters: {
    getChipColor(status){
      let statusBgColorMap = {
        'default':  'rgba(23, 23, 41, 0.08)',
        'disabled': '#F8F8F8',
        'pizdec' :  'rgba(241, 102, 53, 0.08)',
        'practice': 'rgba(23, 23, 41, 0.08)',
        'success':  'rgba(11, 196, 184, 0.08)',
        'warning':  'rgba(231, 174, 30, 0.12)',
        'live': 'rgba(241, 102, 53, 0.08)',
        'live-white': 'rgba(255, 255, 255, 0.12',
      }
      return (statusBgColorMap[status] || 'chip--default');
    },
    getChipTextColor(status){
      let statusTextColorMap = {
        'default':  '#5A6275',
        'disabled': '#9FA4B1',
        'pizdec' :  '#F16635',
        'success':  '#0BC3B8',
        'warning':  '#E7AE1E',
        'live': '#F16635',
        'live-white': '#FFF'
      }
      return (statusTextColorMap[status] || 'chip--default');
    }
  },
  props: [
    'date', 
    'description', 
    'teacher-title',
    'lector', 
    'live', 
    'status' 
  ],
  data(){
    return {
      UserPlaceholderSm,
      mdiCircle
    }
  },
}
</script>
<style lang="scss">
.LessonInfo__description-text{
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.02em;
  color: #5A6275;
}
</style>