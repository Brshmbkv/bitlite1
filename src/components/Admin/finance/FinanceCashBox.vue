<template>
  <v-card
    flat
    class="pa-5"
    width="300"
    style="border: 1px solid rgba(23, 23, 41, 0.08);box-sizing: border-box;border-radius: 5px;"
  >
    <div class="d-flex justify-space-between align-center mb-6">
      <span style="font-size: 14px; color: #9FA4B1">{{cashBox}}</span>
      <GearIcon/>
    </div>
    <div class="d-flex justify-space-between align-center">
      <span style="font-size: 20px; color: #5A6275">{{balance && balance.toLocaleString()}} ₸</span>
      <router-link
        :to="{
          name: 'FinanceCashBoxShow',
          params: {
            cb_id: id
          }
        }"
      >
        <ArrowRightIcon
          class="finance-card-balance__svg"
          style="transform: scale(0.8)"
        />
      </router-link>
    </div>
  </v-card>
</template>

<script>
import GearIcon from '@/assets/svg/gear.svg'
import ArrowRightIcon from '@/assets/svg/arrow_right.svg'

export default {
  name: "FinanceCashBox",
  components: {
    GearIcon,
    ArrowRightIcon,
  },
  props: {
    cashBox: String,
    balance: Number,
    id: Number,
  }
}
</script>

<style scoped>

</style>
