<template>
  <v-simple-table class="my-table text-h6">
    <template v-slot:default>
      <thead>
      <tr>
        <th class="text-left font-weight-regular grayLight--text" width="70px">
          #
        </th>
        <th class="text-left font-weight-regular grayLight--text">
          Дата
        </th>
        <th class="text-right font-weight-regular grayLight--text">
          Баллы
        </th>
        <th class="text-right font-weight-regular grayLight--text">
          Оценка
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(item,idx) in attempts"
          :key="item.id"
          class="text-left"
      >
        <td>#{{ (attempts.length) - idx }}</td>
        <td class="text-capitalize">{{ item.created_at | longFormat }}</td>
        <td class="text-right">{{ item.right_answers }}/{{ item.total_questions }}</td>
        <td class="text-right">{{ item.rights_percent }}%</td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: "TrainingTestAttemptTable",
  props: {
    attempts: {
      type: Array,
    }
  }
}
</script>
