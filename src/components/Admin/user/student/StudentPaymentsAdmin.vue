<template>
  <v-card
    width="100%"
    elevation="0"
    class="show-user__card"
  >
    <v-card-title>
      История оплат
    </v-card-title>
    <v-card-text>
      <div
        v-if="payments && payments.length === 0"
        class="text-center pt-4 pb-2"
      >
        <span style="font-size: 20px;font-weight: 600">Нет данных</span>
      </div>
      <v-simple-table v-else class="show-user-courses__table">
        <thead>
        <tr>
          <th class="text-left font-weight-regular grayLight--text pl-0">ID</th>
          <th class="text-left font-weight-regular grayLight--text">Название курса</th>
          <th class="text-left font-weight-regular grayLight--text">Модуль</th>
          <th class="text-left font-weight-regular grayLight--text">Дата</th>
          <th class="text-left font-weight-regular grayLight--text">Сумма</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(pay, idx) in payments"
          :key="'c+'+idx"
        >
          <td class="pl-0">
            {{ idx + 1 }}
          </td>
          <td class="text-capitalize">
            <span>{{ pay.module && pay.module.course && pay.module.course.title }}</span>
          </td>
          <td class="text-capitalize">
            <span>{{ pay.module && pay.module.title }}</span>
          </td>
          <td class="text-none">
            {{ pay.created_at | shortFormat }}
          </td>
          <td class="font-weight-medium" style="color: #5CC689">
            {{ pay.paid > 0 ? '+ ' + pay.paid + ' KZT' : '-' }}
          </td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "StudentPaymentsAdmin",
  props: {
    payments: Array
  }
}
</script>

<style scoped>

</style>
