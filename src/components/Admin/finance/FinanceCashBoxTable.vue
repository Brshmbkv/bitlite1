<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :mobile-breakpoint="0"
      hide-default-footer
    >
      <template v-slot:item.payer="{item}">
        <span>{{ ((item.payer && item.payer.first_name) || '') + ' ' + ((item.payer && item.payer.last_name) || '')}}</span>
      </template>
      <template v-slot:item.created_at="{item}">
        <span>{{item.created_at | longFormat}}</span>
      </template>
      <template v-slot:item.created_by="{item}">
        <span class="text-truncate">{{ ((item.created_by_user && item.created_by_user.first_name) || '') + ' ' + ((item.created_by_user && item.created_by_user.last_name) || '')}}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "FinanceCashBoxTable",
  props: {
    items: Array,
    loading: Boolean,
  },
  data() {
    return {
      headers: [
        {
          text: 'Дата',
          align: 'start',
          value: 'created_at',
        },
        { text: 'Ответственный', value: 'created_by' },
        { text: 'Плательщик', value: 'payer' },
        { text: 'Тип операции', value: 'template.name' },
        { text: 'Сумма', value: 'amount' },
        { text: 'Чек', value: 'iron' },
        { text: 'Комментарий', value: 'description' },
      ],
    }
  }
}
</script>

<style scoped>

</style>
