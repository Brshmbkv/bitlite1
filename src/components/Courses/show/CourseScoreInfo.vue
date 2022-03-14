<template>
  <CustomModal
    :value="value"
    title="Как начисляются баллы"
    :max-width="700"
    :bg-color="'#F5F6F8'"
    @close="closeDialog"
  >
    <div class="score-info">
      <p>Ниже приведена таблица, в которой указано сколько баллов вы cможете набрать, решив задачу определённой
        сложности, на определенный процент:</p>
      <v-simple-table class="score-info__table">
        <thead>
        <tr>
          <th>Сложность</th>
          <th>на 25%</th>
          <th>на 50%</th>
          <th>на 75%</th>
          <th>на 100%</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="data in table_data"
          :key="data.color"
        >
          <td class="d-flex align-center">
            <div class="score-info__table__figure" :style="{backgroundColor: data.color}"/>
            <span>{{ data.complexity }}</span>
          </td>
          <td>{{ `+ ${data['25']} XP` }}</td>
          <td>{{ `+ ${data['50']} XP` }}</td>
          <td>{{ `+ ${data['75']} XP` }}</td>
          <td>{{ `+ ${data['100']} XP` }}</td>
        </tr>
        </tbody>
      </v-simple-table>
      <p class="mb-6">А также, <b>+10 xp</b> за успешную сдачу теста при его наличии.</p>
      <v-btn
        :ripple="false"
        class="text-none white--text px-8"
        color="#0BC3B8"
        elevation="0"
        large
        @click="closeDialog"
      >
        Ок, понятно
      </v-btn>
    </div>
  </CustomModal>
</template>

<script>
import CustomModal from "@/components/CustomModal";

export default {
  name: "CourseScoreInfo",
  components: { CustomModal },
  props: {
    value: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      table_data: [
        {
          complexity: 'Легкая',
          color: '#D9F7CD',
          25: 3,
          50: 5,
          75: 8,
          100: 10
        },
        {
          complexity: 'Средняя',
          color: '#FFEBB9',
          25: 5,
          50: 10,
          75: 15,
          100: 20
        },
        {
          complexity: 'Бонусная',
          color: '#FFCDCB',
          25: 8,
          50: 15,
          75: 23,
          100: 30
        }
      ]
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:value', false)
    }
  }
}
</script>

<style lang="scss">
.score-info__text {
  white-space: pre-wrap;
  font-size: 18px;
}

.score-info--success {
  color: #0BC3B8;
}

.score-info__table {
  border-radius: 7px !important;
  margin-bottom: 20px;

  .v-data-table__wrapper {
    border-radius: 7px;
  }

  thead {
    background: #DBDFEA;

    th {
      font-weight: bold;
      font-size: 14px !important;
      line-height: 16px;
      color: #383D57 !important;
    }
  }

  td {
    font-size: 14px !important;
    font-weight: 500;
    line-height: 16px;
    color: #171729 !important;
  }

  &__figure {
    width: 16px;
    height: 16px;
    margin-right: 6px;
    border-radius: 4px;
  }
}
</style>
