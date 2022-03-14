<template>
  <v-container>
    <v-row align="center">
      <v-col cols="auto">
        <h2>История Покупок</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col >
        <v-skeleton-loader v-if="loading" type="table-tbody" />
        <v-simple-table v-else-if="payments.length" dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="pl-0 text-left grayLight--text">Курс</th>
                <th class="text-left grayLight--text">Цена</th>
                <th class="text-left grayLight--text">Оплачено</th>
                <th class="text-left grayLight--text">Статус</th>
                <th class="text-left grayLight--text">Дата</th>
              </tr>
            </thead>
            <tbody class="UserPayments__tbody">
              <tr
                v-for="item in payments"
                :key="item.name"
                class="text-no-wrap"
              >
                <td class="py-3 pl-0">
                  {{ item.course_module.title }}
                </td>
                <td class="py-3">
                  {{currencyFormatter.format(item.course_module.price).replace(/,/g, ' ') + " ₸"}}
                </td>
                <td class="py-3">
                  {{ currencyFormatter.format(item.paid).replace(/,/g, ' ') + " ₸" }}
                  {{ item.discount
                    ? " (-" + item.discount+'%)'
                    : ''
                  }}
                </td>
                <td>
                  <v-chip
                    v-if="item.status"
                    :color=" item.status | getStatusChipColor"
                    :text-color=" item.status | getStatusChipTextColor"
                    small
                    label
                    class="font-weight-medium text-uppercase"
                    style="cursor: inherit;"
                  >
                    {{ item.status | statusNameMap }}
                  </v-chip>
                </td>
                <td class="py-3">{{ item.created_at | longFormat }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <p v-else>Нет данных для отображения</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>


export default {
  name: "PaymentsView",
  filters: {
    statusNameMap(status){
      let statusMap = {
        'created': "Неоплачен",
        'payed': "Куплен",
        'error': "Ошибка",
        'return': "Возврат",
        'finished': "Куплен",
      }
      return statusMap[status] || '-';
    },
    getStatusChipColor(status){
      let statusBgColorMap = {
        'created':  'rgba(23, 23, 41, 0.08)',
        'payed' :  'rgba(11, 196, 184, 0.08)',
        'error':  'rgba(23, 23, 41, 0.08)',
        'return':  'rgba(23, 23, 41, 0.08)',
        'finished': 'rgba(11, 196, 184, 0.08)',
      }
      return statusBgColorMap[status] || 'chip--default';
    },
    getStatusChipTextColor(status){
      let statusTextColorMap = {
        'created':  '#5A6275',
        'payed':  '#0BC3B8',
        'error':  '#9FA4B1',
        'return':  '#5A6275',
        'finished': '#0BC3B8',
      }
      return statusTextColorMap[status] || 'chip--default';
    }
    // statusColorMap(){

    // }
  },
  data(){
    return {
      currencyFormatter: new Intl.NumberFormat("en-GB"),
      loading: false,
      payments: []
    }
  },
  mounted(){
    this.loading = true;
    this.fetchPayments().finally(() => {
      this.loading = false;
    });
  },
  methods: {
    async fetchPayments(){
      return this.$axios('/my-purchases/').then((res) => {
        if (res && res.data){
          this.payments = res.data.filter(pay => pay.payed)
        }
      })
    }
  },
}
</script>
<style lang="scss">
tbody.UserPayments__tbody{
  tr:hover {
    background-color: transparent !important;
    cursor: default;
  }
}
</style>
