<template>
  <div class="course-stats">
    <div >
      <h5
        class="text-h6 font-weight-bold"
        :class="[disabled && 'grayLight--text']"
      >
        Ваш прогресс
      </h5>
    </div>
    <div v-if="total_events >= 0 && passed_events >= 0" class="mt-4">
      <div class="d-flex align-center" style="gap: 24px">
        <v-progress-linear
          :value="Math.round((100 * passed_events) / total_events)"
          height="10"
          rounded
        ></v-progress-linear>
        <span>{{ Math.round((100 * passed_events) / total_events) }}%</span>
      </div>
      <p
        style="font-weight: 500;font-size: 16px;line-height: 20px; color: #828BABA3; margin-top: 10px;"
      >
        Уроков пройдено: <span style="color: #00665E">{{ passed_events }}</span
        >/{{ total_events }}
      </p>
    </div>
  </div>
</template>

<script>
import dateFiltersMixin from '@/mixins/date-filters.js'

export default {
  filters: {
    cheerUp(score) {
      let cheerUpScoreMap = {
        50: 'Тебе надо уделить больше времени...',
        65: 'Хорошо, но ты можешь лучше',
        75: 'Маленький программист! Нужно больше практики',
        85: 'Хорошо! Ты можешь лучше, делай больше практики',
        95: 'Отлично! Давай доведем до 100!',
        100: 'Отлично!',
      }
      let scoreKey = Object.keys(cheerUpScoreMap)
        .sort((a, b) => a - b)
        .find((minScore) => Number(minScore) >= score)
      return cheerUpScoreMap[scoreKey] || ''
    },
  },
  mixins: [dateFiltersMixin],
  props: {
    level: undefined,
    disabled: {
      type: Boolean,
      default: false,
    },
    prerequesit: undefined,
    total_events: {
      type: Number,
      default: 99,
    },
    passed_events: {
      type: Number,
      default: 0,
    },
    end_date: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    hide_cheerups: {
      type: Boolean,
      default: false,
    },
    chart_scores: {
      type: Array,
    },
    categories: {
      type: Array,
    },
    total_passed: {
      type: Array,
    },
    total_exercises: {
      type: Array,
    },
  },
  data() {
    return {
      now: new Date(Date.now()),
      chartOptions: {
        chart: {
          id: 'student-stats',
        },
        stroke: {
          curve: 'straight',
          width: 1,
        },
        fill: {
          opacity: 0.15,
        },
        markers: {
          size: 5,
        },
        tooltip: {
          custom: ({ series, seriesIndex, dataPointIndex }) => {
            return `<div class='text-center pa-3' style='background: #1C1C1E; backdrop-filter: blur(54.3656px);color:white;border-radius: 7px'>
                        <p class='mb-0' style='font-weight: 600; font-size: 14px'>Сдано ${this.total_passed[dataPointIndex]} из ${this.total_exercises[dataPointIndex]}</p>
                        <p class='mb-0'>${series[seriesIndex][dataPointIndex]}%</p>
                    </div>`
          },
          x: {
            show: true,
            formatter: (val) => {
              return this.categories[val - 1]
            },
          },
        },
        colors: ['#5CC689'],
        xaxis: {
          labels: {
            show: true,
            formatter: (val) => {
              return this.categories.indexOf(val) + 1
            },
            style: {
              colors: '#9FA4B1',
            },
          },
          tooltip: {
            formatter: (val) => {
              return this.categories[val - 1]
            },
          },
          categories: this.categories,
        },
        yaxis: {
          min: 0,
          max: 100,
          tickAmount: 5,
          labels: {
            style: {
              colors: '#9FA4B1',
            },
            formatter: (val) => {
              return val + '%'
            },
          },
        },
      },
    }
  },
}
</script>

<style lang="scss">
.course-stats {
  padding: 16px;
  border: 1px solid #b0b7d08f;
  border-radius: 16px;
}
</style>
