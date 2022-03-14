<template>
  <div class="pa-5">
    <div class="mb-4">
      <BackButton :route-name="'AdminFinanceIndex'"/>
    </div>
    <p style="font-size: 24px; color: #171729; font-weight: 700" class="my-5">
      {{ checkBox_name }}
    </p>
    <div
      class="d-flex flex-row flex-wrap align-center"
    >
      <v-item-group
        v-model="range"
        mandatory
        class="mr-2 px-3"
        style="height: 100%"
      >
        <v-row
          style="border: 1px solid rgba(23, 23, 41, 0.08);border-radius: 5px;background-color: white"
          class="pa-1"
        >
          <v-col
            v-for="d in date"
            :key="d.name"
            class="pa-0"
            cols="12"
            sm="3"
          >
            <v-item
              v-slot="{ active, toggle }"
              :value="d.value"
            >
              <v-card
                :color="active ? 'rgba(10, 204, 218, 0.15)' : 'white'"
                dark
                :ripple="false"
                :width="$vuetify.breakpoint.width < 600 ? '100%' : '104px'"
                height="34"
                @click="toggle"
                elevation="0"
                class="d-flex align-center"
              >
                <div
                  class="flex-grow-1 text-center align-self-center"
                  :style="{color: active ? '#0ACCDA' : '#9FA4B1'}"
                >
                  {{ d.name }}
                </div>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
      <v-select
        :items="items"
        :menu-props="{ top: false, offsetY: true }"
        style="max-width: 200px !important"
        class="mb-0 mt-sm-0 mt-4 sort-courses__v-select"
        solo
        outlined
        dense
        flat
      >
        <template v-slot:label>
          <span style="font-weight: 400; font-size: 14px">другой диапазон</span>
        </template>
      </v-select>
      <v-chip
        label
        :color="'rgba(92, 198, 137, 0.1)'"
        :text-color="'#5CC689'"
        class="py-5 px-3 ml-auto mt-sm-0 mt-4"
        style="border-radius: 5px"
      >
        <span style="font-size: 14px; font-weight: 500">
          + Добавить транзакцию
        </span>
      </v-chip>
    </div>
    <div>
      <v-select
        flat
        :items="items"
        :menu-props="{ top: false, offsetY: true }"
        background-color="white"
        style="margin-top: 2px;width: 268px;"
        dense
        outlined
        height="40"
        class="sort-courses__v-select mt-6"
        solo
      >
        <template v-slot:prepend-inner>
          <span style="font-size: 12px;color: #9FA4B1;width: 105px">Детализация по:</span>
        </template>
        <template v-slot:label>
          <span>По месяцам</span>
        </template>
        <template v-slot:append>
          <div
            class="sort-courses__v-select__v-append text-center"
          >
            <v-icon>{{ mdiChevronDown }}</v-icon>
          </div>
        </template>
      </v-select>
    </div>
    <div
      class="d-flex justify-end mt-2"
    >
      <v-chip
        class="cashbox-show--table-show"
        text-color="#9FA4B1"
        color="rgba(23, 23, 41, 0.08)"
        @click="showGraph = !showGraph"
        :ripple="false"
        :class="[showGraph ? 'show' : 'hide']"
      >
        {{ showGraph ? 'скрыть график' : 'показать график' }}
        <ArrowRightIcon/>
      </v-chip>
    </div>
    <v-expand-transition>
      <FinanceCashBoxGraph
        v-if="showGraph"
        :title="checkBox_name"
        :loading="loading"
        :series="series"
        :dates="dates"
      />
    </v-expand-transition>
    <div class="mt-4">
      <FinanceCashBoxTable
        :loading="loading"
        :items="data_table_items"
      />
    </div>
  </div>
</template>

<script>
import { mdiChevronDown, mdiChevronLeft } from '@mdi/js'
import ArrowRightIcon from '@/assets/svg/arrow_right.svg'
import FinanceCashBoxGraph from "@/components/Admin/finance/FinanceCashBoxGraph";
import FinanceCashBoxTable from "@/components/Admin/finance/FinanceCashBoxTable";
import BackButton from "@/components/Admin/BackButton";

export default {
  name: "FinanceCashBoxShow",
  components: {
    BackButton,
    FinanceCashBoxTable,
    FinanceCashBoxGraph,
    ArrowRightIcon,
  },
  props: ['cb_id'],
  data() {
    return {
      loading: false,
      mdiChevronDown,
      mdiChevronLeft,
      showGraph: false,
      // date: ['месяц', 'квартал', 'полгода', 'год'],
      date: [
        {
          name: 'месяц',
          value: 'month'
        },
        {
          name: 'квартал',
          value: 'quarter'
        },
        {
          name: 'полгода',
          value: 'half'
        },
        {
          name: 'год',
          value: 'year'
        },
      ],
      items: [],
      checkBox_name: undefined,
      dates: undefined,
      range: undefined,
      series: [],
      data_table_items: undefined,
    }
  },
  watch: {
    range() {
      this.fetchCashBox()
    }
  },
  mounted() {
    this.fetchCashBox()
  },
  methods: {
    async fetchCashBox() {
      this.loading = true
      this.data_table_items = []
      await this.$axios.get(`admin/cashBoxes/${ this.cb_id }`, {
        params: {
          range: this.range
        }
      })
        .then(res => {
          if(res && res.data) {
            // console.log(res.data)
            this.dates = res.data.dates
            this.checkBox_name = res.data.cash_boxes && res.data.cash_boxes.name
            this.data_table_items = res.data.data
            if(res.data.incomes) {
              this.series[0] = {
                name: 'Прибыль',
                type: 'line',
                data: res.data.incomes.map((inc, idx) => {
                  return {
                    x: res.data.dates_income[idx],
                    y: inc
                  }
                })
              }
            }
            if(res.data.outcomes) {
              this.series[1] = {
                name: 'Расход',
                type: 'line',
                data: res.data.outcomes.map((out, idx) => {
                  return {
                    x: res.data.dates_outcome[idx],
                    y: out
                  }
                })
              }
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.cashbox-show--table-show {
  border-radius: 10px 10px 0 0 !important;
  cursor: pointer;

  svg {
    margin-left: 5px;

    path {
      fill: #9FA4B1;
    }
  }

  &.hide {
    svg {
      transform: scale(0.6) rotate(90deg);
      transition-duration: 300ms;
    }
  }

  &.show {
    svg {
      transform: scale(0.6) rotate(-90deg);
      transition-duration: 300ms;
    }
  }
}
</style>
