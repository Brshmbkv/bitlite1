<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader v-if="loading" type="table-tbody" />
        <v-simple-table v-else-if="payments && payments.length" class="payment__table" dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left grayLight--text py-4">Курс</th>
              <th class="text-left grayLight--text py-4">Цена</th>
              <th class="text-left grayLight--text py-4">Статус</th>
              <th class="text-left grayLight--text py-4">Дата</th>
            </tr>
            </thead>
            <tbody class="UserPayments__tbody">
            <tr
              v-for="item in payments"
              :key="item.name"
              class="text-no-wrap"
            >
              <td class="py-4 font-weight-medium">
                {{ item.course_module.title }}
              </td>
              <td class="py-4 font-weight-bold">
                {{currencyFormatter.format(item.course_module.price).replace(/,/g, ' ') + " ₸"}}
              </td>
              <td>
                <v-chip
                  v-if="item.status"
                  :color="getStatusChipColor(item.status)"
                  :text-color="getStatusChipTextColor(item.status)"
                  small
                  label
                  class="font-weight-medium text-uppercase"
                  style="cursor: inherit;"
                >
                  {{ statusNameMap(item.status) }}
                </v-chip>
              </td>
              <td class="py-4">{{ item.created_at | longFormat }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
        <p v-else>Нет данных для отображения</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "PaymentHistoryTable",
  props: {
    payments: Array,
    loading: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      currencyFormatter: new Intl.NumberFormat("en-GB"),
    }
  },
  methods: {
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
  }
}
</script>

<style lang="scss">
.payment__table {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 5px;

  th {
    font-size: 15px !important;
  }
}
</style>
