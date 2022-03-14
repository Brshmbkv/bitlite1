<template>
  <v-card
    flat
    width="300"
    style="border: 1px solid rgba(23, 23, 41, 0.08);"
  >
    <div class="pa-5">
      <p class="d-flex flex-row align-start justify-space-between mb-0">
        <span
          style="font-size: 14px; font-weight: 400; color: #9FA4B1"
        >
          Текущий баланс:
        </span>
        <v-chip
          :ripple="false"
          style="background: rgba(10, 204, 218, 0.12);border-radius: 7px;"
          class="px-2"
        >
          <WalletIcon/>
        </v-chip>
      </p>
      <p class="mb-0" style="font-size: 20px; font-weight: 900">{{ sum && sum.toLocaleString() + ' ₸'}}</p>
    </div>
    <v-divider
      style="border-color: rgba(23, 23, 41, 0.08);"
    />
    <div class="px-5 py-8">
      <p class="mb-0 d-flex justify-space-between align-center" style="font-size: 14px;color: #9FA4B1">
        Баланс вырос на:
        <span style="font-weight: 600; color: #0ACCDA">
          69%
          <UpGrowthIcon
            class="finance-card-balance__svg"
          />
        </span>
      </p>
    </div>
  </v-card>
</template>

<script>
import WalletIcon from '@/assets/svg/finance_wallet.svg'
import UpGrowthIcon from '@/assets/svg/finance_up_growth.svg'

export default {
  name: "FinanceCardBalance",
  components: {
    WalletIcon,
    UpGrowthIcon,
  },
  props: {
    sum: Number,
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss">
.finance-card-balance__svg {
  path {
    fill: #0ACCDA;
  }
}
</style>
