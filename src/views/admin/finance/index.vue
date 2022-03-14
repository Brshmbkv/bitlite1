<template>
  <div class="pa-5">
    <div
      class="d-flex flex-row flex-wrap align-center"
    >
      <v-item-group
        mandatory
        class="mr-2 px-3"
        style="height: 100%"
        v-model="range"
      >
        <v-row
          style="border: 1px solid rgba(23, 23, 41, 0.08);border-radius: 5px;background-color: white; padding: 3px"
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
    </div>
    <div class="mb-3">
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
    <v-row
      class="mb-4"
    >
      <template v-if="loading">
        <v-col
          v-for="i in 3"
          :key="i"
          cols="auto"
        >
          <v-skeleton-loader
            width="300"
            type="list-item-three-line, divider, card-heading"
          ></v-skeleton-loader>
        </v-col>
      </template>
      <template v-else>
        <v-col
          cols="auto"
        >
          <FinanceCardBalance
            :sum="total_balance"
          />
        </v-col>
        <v-col
          cols="auto"
        >
          <FinanceCardProfit
            :sum="total_income"
            :chart-series="incomes"
          />
        </v-col>
        <v-col
          cols="auto"
        >
          <FinanceCardLoss
            :sum="total_outcome"
            :chart-series="outcomes"
          />
        </v-col>
      </template>
    </v-row>
    <p
      style="display: flex; justify-content: start; align-items: center; gap: 1rem"
    >
      <span style="font-size: 18px; color: #9FA4B1; font-weight: 500">КАССЫ</span>
      <v-chip
        label
        :color="'rgba(92, 198, 137, 0.1)'"
        :text-color="'#5CC689'"
        class="py-5 px-6"
        style="border-radius: 5px"
      >
        <span style="font-size: 14px; font-weight: 500">
          + Добавить кассу
        </span>
      </v-chip>
    </p>
    <v-row>
      <template v-if="loading">
        <v-col
          v-for="i in 3"
          :key="i"
          cols="auto"
        >
          <v-skeleton-loader
            width="300"
            type="list-item-two-line, card-heading"
          ></v-skeleton-loader>
        </v-col>
      </template>
      <template v-else>
        <v-col
          v-for="cb in cashboxes"
          :key="cb.id"
          cols="auto"
        >
          <FinanceCashbox
            :id="cb.id"
            :balance="Number(cb.balance)"
            :cash-box="cb.name"
          />
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
// import WidgetCourseModuleProfit from '@/components/Admin/widgets/CourseModuleProfit'
// import WidgetCourseProfit from '@/components/Admin/widgets/CourseProfit'
// import WidgetCourseSalaryCosts from '@/components/Admin/widgets/CourseSalaryCosts'
import { mdiChevronDown } from '@mdi/js'
import FinanceCardBalance from "@/components/Admin/finance/FinanceCardBalance";
import FinanceCardProfit from "@/components/Admin/finance/FinanceCardProfit";
import FinanceCardLoss from "@/components/Admin/finance/FinanceCardLoss";
import FinanceCashbox from "@/components/Admin/finance/FinanceCashBox";

export default {
  name: "AdminFinanceIndex",
  components: {
    FinanceCashbox,
    FinanceCardLoss,
    FinanceCardProfit,
    FinanceCardBalance,
    // WidgetCourseModuleProfit,
    // WidgetCourseProfit,
    // WidgetCourseSalaryCosts,
  },
  data() {
    return {
      mdiChevronDown,
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
      range: undefined,
      cashboxes: undefined,
      total_balance: undefined,
      total_outcome: undefined,
      total_income: undefined,
      incomes: [],
      outcomes: [],
      loading: false,
    }
  },
  watch: {
    range() {
      this.fetchCashBoxes()
        .finally(() => {
          this.loading = false
        })
    }
  },
  mounted() {
    this.fetchCashBoxes()
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async fetchCashBoxes() {
      this.loading = true
      await this.$axios.get(`admin/cashBoxes`, {
        params: {
          range: this.range
        }
      })
        .then(res => {
          if(res && res.data) {
            // console.log(res.data)
            this.cashboxes = res.data.cash_boxes
            this.total_balance = res.data.total_balance
            this.total_income = res.data.total_income
            this.total_outcome = res.data.total_outcome
            this.incomes[0] = {
              name: 'Прибыль',
              type: 'line',
              data: res.data.incomes
            }
            this.outcomes[0] = {
              name: 'Расход',
              type: 'line',
              data: res.data.outcomes
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
