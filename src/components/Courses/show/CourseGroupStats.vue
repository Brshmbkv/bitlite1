<template>
  <div>
    <template v-if="loading">
      <v-skeleton-loader
        type="table-tbody"
      />
    </template>
    <template v-else>
      <div
        v-if="scores && scores.length > 0 && titles && titles.length > 0"
      >
        <p class="text-subtitle-2 grayLight--text">График активности групп</p>
        <apex-chart
          height="400"
          :series="scores"
          :options="chartOptions"
        />
      </div>
    </template>
  </div>
</template>

<script>
import ApexChart from "vue-apexcharts";

export default {
  name: "CourseGroupStats",
  components: {
    ApexChart,
  },
  props: {
    scores: Array,
    total_passed: Array,
    total_students: Number,
    total_exercises: Array,
    titles: Array,
    loading: Boolean,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'course-group-stats',
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
              <p class='mb-0' style='font-weight: 600; font-size: 14px'>Сдано ${this.total_passed[dataPointIndex]} из ${this.total_students * this.total_exercises[dataPointIndex]}</p>
              <p class='mb-0'>Ср. оценка: ${series[seriesIndex][dataPointIndex]}%</p>
            </div>`
          },
          x: {
            show: true,
            formatter: (val) => {
              return this.titles[val-1]
            }
          }
        },
        colors: ['#5CC689'],
        xaxis: {
          labels: {
            show: true,
            formatter: (val) => {
              return val
            },
            style: {
              colors: '#9FA4B1',
            }
          },
          tooltip: {
            formatter: (val) => {
              return this.titles[val-1]
            }
          },
          titles: this.titles,
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
              return val+'%'
            },
          }
        }
      },
    }
  }
}
</script>
