<template>
  <v-dialog
    v-model="dialog"
    width="800"
    persistent
  >
    <v-icon
      style="position: fixed; z-index: 10; top: 10px; right: 10px"
      size="64"
      color="white"
      @click="$emit('update:dialog', false)"
    >
      {{ mdiClose }}
    </v-icon>
    <v-card
      class="d-flex flex-wrap"
    >
      <v-col
        cols="12"
        md="6"
        class="pa-16 ma-0 d-flex align-center justify-center flex-column text-center"
        style="background-color: #ededee; gap: 15px"
      >
        <v-icon
          style="background-color: #5cc689; border-radius: 50%; padding: 5px"
          color="white"
        >
          {{ mdiCheck }}
        </v-icon>
        <span class="font-weight-bold" style="font-size: 24px">
            Спасибо за заявку!
          </span>
        <span class="font-weight-regular" style="font-size: 14px">
            Наш менеджер свяжется с вами в ближайшее время
          </span>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="py-16 px-8 ma-0 d-flex flex-column justify-center align-center text-center"
        style="gap: 15px"
      >
          <span class="font-weight-bold" style="font-size: 24px">
            10% скидка на курc при оплате за 2 месяца
          </span>
        <span class="font-weight-regular text-center" style="font-size: 14px">
          оплатите за полный курс и получите гарантированную скидку
        </span>
        <v-btn
          :ripple="false"
          color="#0BC3B8"
          style="color: white"
          x-large
          elevation="0"
          class="text-none"
        >
          Перейти к оплате
        </v-btn>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiCheck, mdiClose } from '@mdi/js'

export default {
  name: "PurchaseRequestSuccess",
  props: {
    dialog: Boolean
  },
  data() {
    return {
      mdiCheck,
      mdiClose,
    }
  }
}
</script>

<style lang="scss">

</style>
