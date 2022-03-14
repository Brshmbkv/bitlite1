<template>
  <div
    style="width: 100%; height: 500px; background-color: white; border-radius: 5px; border: 1px solid rgba(23, 23, 41, 0.08)"
    class="pa-4"
  >
    <p style="font-weight: 500">
      График доходов и расходов по {{ title || 'кассе' }}
    </p>
    <v-skeleton-loader
      v-if="loading"
      type="image,image"
    />
    <apex-chart
      v-else-if="series && series.length > 0"
      height="400"
      :series="series"
      :options="chartOptions"
    />
  </div>
</template>
<script>
import ApexChart from "vue-apexcharts";

export default {
  name: "FinanceCashBoxGraph",
  components: {
    ApexChart,
  },
  props: {
    series: Array,
    title: String,
    dates: Array,
    loading: Boolean,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'finance-cash-box-graph',
          dropShadow: {
            enabled: true,
            top: 4,
            left: 2,
            blur: 5,
            color: '#000',
            opacity: 0.20
          },
        },
        grid: {
          show: false,      // you can either change hear to disable all grids
        },
        stroke: {
          curve: 'straight',
          width: 1,
        },
        markers: {
          size: 0,
        },
        tooltip: {
          x: {
            show: false,
          }
        },
        colors: ['#5CC689', '#EE5252'],
        xaxis: {
          categories: this.dates,
          labels: {
            showDuplicates: true,
            formatter: function (value) {
              let date = new Date(value)
              return date.toLocaleDateString('ru-RU', {
                month: "short",
                year: "numeric",
              }).slice(0, -2);
            },
            style: {
              colors: '#9FA4B1',
            },
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#9FA4B1',
              fontSize: 12
            },
            formatter: (val) => {
              return val && val.toLocaleString()
            },
          }
        }
      },
    }
  }
}
</script>

<style scoped>

</style>
