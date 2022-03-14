<template>
  <WidgetsContainer title="Затраты на ЗП" :column="6">
    <apex-chart
      v-if=" display === 'chart'"
      type="line"
      :options="chartOptions"
      :series="chartSeries"
    ></apex-chart>
  </WidgetsContainer>
</template>

<script>
import ApexChart from 'vue-apexcharts'
import WidgetsContainer from '@/components/Admin/widgets/container'
export default {
  components: {
    ApexChart,
    WidgetsContainer,
  },
  data(){
    return {
      display: 'chart',
      chartOptions: {
        chart: {
          id: 'payments_analitics'
        },
        stroke: {
          curve: 'straight',
          // show: true,
          // curve: 'smooth',
          // lineCap: 'butt',
          // colors: undefined,
          width: 1,
          // dashArray: 0,
        },
        fill: {
          opacity: 0.15,
        },
        markers: {
          size: 3,
        },
        colors: ['#EE5252'],
        xaxis: {
          categories: ['Янв', "Февр", "Март", "Апр.", "Май", "Июнь", "Июль", "Авг"]
        }
      },
      chartSeries: [{
        name: 'series-1',
        type: 'area',
        data: [300000, 159999, 189999, 259999, 239999, 229999, 259999, 300000]
      }]
    }
  }
}
</script>