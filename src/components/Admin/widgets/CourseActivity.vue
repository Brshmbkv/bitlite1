<template>
  <div>
    <apex-chart
      :options="chartOptions"
      :series="series"
    ></apex-chart>
  </div>
</template>

<script>
import ApexChart from 'vue-apexcharts'

export default {
  name: "CourseActivity",
  components: {
    ApexChart
  },
  props: {
    series: {
      type: Array
    },
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'user-events',
          type: 'line'
        },
        stroke: {
          curve: 'straight',
          width: 1,
        },
        fill: {
          opacity: 0.15,
        },
        markers: {
          size: 3,
        },
        // tooltip: {
        //   custom: ( { series, seriesIndex, dataPointIndex }) => {
        //     return `<div class='text-center pa-3' style='background: #1C1C1E; backdrop-filter: blur(54.3656px);color:white;border-radius: 7px'>
        //                 <p class='mb-0' style='font-weight: 600; font-size: 14px'>Сдано ${this.total_passed[dataPointIndex]} из ${this.total_students * this.total_exercises[dataPointIndex]}</p>
        //                 <p class='mb-0'>Ср. оценка: ${series[seriesIndex][dataPointIndex]}%</p>
        //             </div>`
        //   },
        //   x: {
        //     show: true,
        //     formatter: (val) => {
        //       return this.titles[val-1]
        //     }
        //   }
        // },
        colors: ['#5CC689'],
        xaxis: {
          tooltip: {
            formatter: () => {
              return 'Урок'
            }
          },
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
  },
}
</script>
