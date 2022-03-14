<template>
  <v-card
    flat
    width="300"
    style="border: 1px solid rgba(23, 23, 41, 0.08);"
  >
    <div class="pa-5">
      <p class="d-flex flex-row align-start justify-space-between mb-0">
        <span
          style="font-size: 14px; font-weight: 400; color: #9FA4B1"
        >
          Расходы:
        </span>
        <v-chip
          :ripple="false"
          style="background: rgba(238, 82, 82, 0.12);border-radius: 7px;"
          class="px-2"
        >
          <DownGrowthIcon/>
        </v-chip>
      </p>
      <p class="mb-0" style="font-size: 20px; font-weight: 900; color: #EE5252">- {{ (sum && sum.toLocaleString()) + ' ₸'}}</p>
    </div>
    <v-divider
      style="border-color: rgba(23, 23, 41, 0.08);"
    />
    <div class="pa-1">
      <apex-chart
        height="65"
        type="area"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </v-card>
</template>

<script>
import DownGrowthIcon from '@/assets/svg/finance_down_growth.svg'
import ApexChart from 'vue-apexcharts'

export default {
  name: "FinanceCardLoss",
  components: {
    DownGrowthIcon,
    ApexChart,
  },
  props: {
    sum: Number,
    chartSeries: Array
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'finance-loss',
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        grid: {
          show: false,      // you can either change hear to disable all grids
        },
        annotations: {
          show: false
        },
        stroke: {
          curve: 'straight',
          width: 2,
        },
        markers: {
          size: 4,
        },
        colors: ['#EE5252'],
        yaxis: {
          floating: true,
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          },
          labels: {
            show: false
          },
        },
        tooltip: {
          x: {
            show: false
          }
        },
        xaxis: {
          floating: true,
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          },
          labels: {
            show: false
          },
        }
      },
    }
  }
}
</script>

<style scoped>

</style>
