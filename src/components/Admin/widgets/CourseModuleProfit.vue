<template>
  <WidgetsContainer title="Прибыль по модулям" :column="4">
    <apex-chart
      type="pie"
      :options="chartOptions"
      :series="series"
      class="course-module-profit__apex-chart"
    ></apex-chart>
  </WidgetsContainer>
</template>

<script>
import WidgetsContainer from "@/components/Admin/widgets/container";
import ApexChart from "vue-apexcharts";

export default {
  name: "CourseModuleProfit",
  components: {
    WidgetsContainer,
    ApexChart,
  },
  data() {
    return {
      series: [69, 13, 1],
      chartOptions: {
        chart: {
          width: '100%',
          type: 'pie',
        },
        labels: ['Java Lite', 'Java Standard', 'Java Standard 2'],
        theme: {
          monochrome: {
            enabled: true,
            color: '#E289F2',
            shadeTo: 'dark',
            shadeIntensity: 0.9
          }
        },
        stroke: {
          show: false,
        },
        plotOptions: {
          pie: {

          }
        },
        dataLabels: {
          enabled: false,
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex]
            return [name, val.toFixed(1) + '%']
          }
        },
        legend: {
          show: true,
          position: 'bottom',
          horizontalAlign: 'left',
          width: '100%',
          height: '100%',
          fontSize: 14,
          markers: {
            width: 10,
            height: 10,
            offsetY: 0,
          },
          formatter: function (seriesName, opts) {
            console.log(opts)
            return '<p class="mb-0 font-weight-bold" style="display: inline">' + seriesName + `<span class="float-right mr-2" style="color: ${opts.w.globals.colors[opts.seriesIndex]} !important;">` + opts.w.globals.series[opts.seriesIndex] + '%</span></p>'
          }
        },
      },
    }
  }
}
</script>
