<template>
  <WidgetsContainer title="Аналитика по ЗП">
    <div class="widget-switcher">
      <button 
        class="widget-switcher__btn"
        :class="{
          'widget-switcher__btn--active': display === 'list'
        }"
        @click="display = 'list'"

      >Списком</button>
      <button 
        class="widget-switcher__btn"
        :class="{
          'widget-switcher__btn--active': display === 'chart'
        }"
        @click="display = 'chart'"
      >Графиком</button>
    </div>
    <apex-chart 
      v-if="display === 'chart'"
      type="line"
      class="mr-2"
      :options="options" 
      :series="series"
    ></apex-chart>
    <v-simple-table 
      v-if="display === 'list'"
      class="widget-table"
    >
      <tbody class="widget-table__body">
        <tr 
          v-for="(info, key) in tableData" 
          :key="key"
          :style="{
            'white-space': 'nowrap',
          }"
        >
          <td class="pa-0">{{info.name}}</td>
          <td class="pa-0 pl-1 text-right grayLight--text">{{info.date}}</td>
          <td class="pa-0 pl-1 text-right" style="color: #5CC689;">{{info.amount}}</td>
        </tr>
      </tbody>
    </v-simple-table>
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
      options: {
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
        colors: ['#BB6BD9'],
        xaxis: {
          categories: ['Янв', "Февр", "Март", "Апр.", "Май", "Июнь", "Июль", "Авг"]
        }
      },
      series: [{
        name: 'series-1',
        type: 'area',
        data: [300000, 159999, 189999, 259999, 239999, 229999, 259999, 300000]
      }],
      tableData: [
        {
          name: '1. Bitlab Students AI...',
          date: '22 янв',
          amount: '+ 20 000 KZT',
        },
        {
          name: '2. CSSE [2K21] - C+...',
          date: '22 янв',
          amount: '+ 20 000 KZT',
        },
        {
          name: '1. Bitlab Students AI...',
          date: '22 янв',
          amount: '+ 20 000 KZT',
        },
        {
          name: '2. CSSE [2K21] - C+...',
          date: '22 янв',
          amount: '+ 20 000 KZT',
        },
        {
          name: '1. Bitlab Students AI...',
          date: '22 янв',
          amount: '+ 20 000 KZT',
        },
      ]
    }
  }
}
</script>
<style lang="scss">
.widget-table{
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  padding: 1rem;
}
</style>