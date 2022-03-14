<template>
  <WidgetsContainer title="Группы" expand>
    <div class="widget-switcher">
      <button
        class="widget-switcher__btn"
        :class="{
          'widget-switcher__btn--active': display
        }"
        @click="display = 1"

      >Текущие</button>
      <button
        class="widget-switcher__btn"
        :class="{
          'widget-switcher__btn--active': !display
        }"
        @click="display = 0"
      >Завершенные</button>
    </div>
    <v-simple-table class="teacher-groups__table">
      <thead>
        <tr>
          <th>Название группы</th>
          <th>Курс</th>
          <th>Дата начала</th>
          <th>Дата завершения</th>
          <th>Прибыль</th>
          <th>Кол-во нач.-зав студ.</th>
          <th>Начисленно ЗП</th>
          <th>Поток</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="groups_loading">
          <td
            class="d-flex justify-center my-4"
          >
            <v-progress-circular
              indeterminate
              size="48"
            />
          </td>
        </tr>
        <tr
          v-else-if="groups && groups.length === 0"
        >
          <td>
            <span>
              Пусто...
            </span>
          </td>
        </tr>
        <tr
          v-else
          v-for="(group, idx) in groups"
          :key="group.id"
        >
          <td>
            {{ `${idx+1}. ${group.name}` }}
          </td>
          <td>
            {{ group.course && group.course.title }}
          </td>
          <td>
            {{ group.starts_at | shortFormat }}
          </td>
          <td>
            {{ group.ends_at | shortFormat }}
          </td>
          <td>
            {{ group.total_income }}
          </td>
          <td>
            {{ `${group.students_count}-${group.finished_students_count}` }}
          </td>
          <td>
            {{ group.total_outcome }}
          </td>
          <td>
            {{ group.parent && group.parent.name }}
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </WidgetsContainer>
</template>

<script>
import WidgetsContainer from '@/components/Admin/widgets/container'
export default {
  components: {
    WidgetsContainer,
  },
  props: {
    expand: Boolean,
    groups: Array,
    groups_loading: Boolean,
  },
  data(){
    return {
      display: 1,
    }
  },
  watch: {
    display: {
      immediate: true,
      handler(newValue) {
        this.$emit('fetch', newValue)
      }
    }
  },
}
</script>

<style lang="scss">
.teacher-groups__table {
  thead {
    th {
      color: #9FA4B1;
      font-weight: 400;
      font-size: 12px;
    }
  }

  tbody tr {
    td {
      font-weight: 400;
      font-size: 14px;
    }

    td:first-child {
      font-weight: 500;
    }
  }
}
</style>
