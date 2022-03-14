<template>
  <div>
    <v-row>
      <v-col>
        <v-simple-table class="my-table">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left font-weight-regular grayLight--text">
                #
              </th>
              <th class="text-left font-weight-regular grayLight--text">
                Название теста
              </th>
              <th class="text-right font-weight-regular grayLight--text">
                Статус
              </th>
              <th class="text-right font-weight-regular grayLight--text">
                Балл
              </th>
            </tr>
            </thead>
            <tbody>
            <router-link
              v-for="(item,idx) in tests"
              :key="item.id"
              tag="tr"
              class="text-left"
              :to="{
            name: 'ChapterTestShow',
            params: {
              test_id: item.id,
              chapter_id: parseInt(chapter_id)
            }
          }"
              style="cursor:pointer;"
            >
              <td>#{{ idx + 1 }}</td>
              <td>
                <p class="font-weight-bold mt-3" style="font-size: 16px">
                  {{ item.title }}
                </p>
              </td>
              <td class="text-right">{{ item.test_results.length > 0 ? 'Пройдено' : '-' }}</td>
              <td class="text-right">
                {{ item.test_results.length > 0 ? item.test_results[0].rights_percent + '%' : '-' }}
              </td>
            </router-link>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ChapterTest",
  props: ['tests', 'chapter_id']
}
</script>