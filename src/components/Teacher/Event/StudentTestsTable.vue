<template>
  <div>
    <v-row justify="center">
      <v-expansion-panels
        focusable
        flat
        mandatory
      >
        <v-expansion-panel
          v-for="(test,i) in tests"
          :key="i"
          style="border: 1px solid #d6d6e6"
        >
          <v-expansion-panel-header>{{test.title}}</v-expansion-panel-header>
          <v-expansion-panel-content>
              <v-simple-table class="my-table">
                <thead>
                <tr>
                  <th class="text-left text-no-wrap font-weight-regular grayLight--text pl-0">Имя студента</th>
                  <th class="text-left text-no-wrap font-weight-regular grayLight--text">Дата сдачи</th>
                  <th class="text-center text-no-wrap font-weight-regular grayLight--text pr-0">Количество попыток</th>
                  <th class="text-right text-no-wrap font-weight-regular grayLight--text pr-0">Балл</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="test.students_results">
                  <tr
                    v-for="(result, s_key) in test.students_results"
                    :key="'e+'+s_key"
                  >
                    <td
                      class="text-capitalize text-no-wrap pl-0"
                    >
                        <span class="ma-0 pa-0">
                          {{
                            (result.user.first_name ? result.user.first_name : '')
                            + ' ' + (result.user.last_name ? result.user.last_name : '')
                          }}
                        </span>
                    </td>
                    <td>
                        {{ (result && result.created_at) | deadlineFormat }}
                    </td>
                    <td
                      class="text-center pr-0"
                    >
                      {{result.count}}
                    </td>
                    <td
                      class="text-right pr-0"
                      :class="(result && result.rights_percent>=0) ? 'success--text' : undefined"
                    >
                      {{result.rights_percent && result.rights_percent>=0 && result.rights_percent + '%'}}
                    </td>
                  </tr>
                </template>
                <p v-else>Нет данных</p>
                </tbody>
              </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'StudentTestsTable',
  props: ['tests'],
}
</script>