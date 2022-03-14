<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      :width="payWithQR ? 330 : 500"
    >
      <v-icon
        v-if="dialog"
        style="position: fixed; top: 20px; right: 20px;cursor:pointer;;"
        color="white"
        size="50"
        @click="closeDialog()"
      >
        {{mdiClose}}
      </v-icon>
      <v-card
        v-if="!payWithQR && !payWithPC"
        class="pa-md-8 pa-4"
      >
        <p class="font-weight-bold mb-8" style="font-size: 24px">Выберите удобный способ оплаты</p>
        <div
          class="d-flex flex-row align-center mb-8"
          style="border-radius: 4px; border: 1px solid rgba(23, 23, 41, 0.08); cursor:pointer;"
          @click="makePurchaseKaspi()"
        >
          <v-img
            :src="KaspiLogo"
            :max-height="50"
            :max-width="50"
            class="ma-3"
          />
          <span class="font-weight-bold ml-2">Kaspi платежи</span>
          <ArrowIcon
            class="ml-auto mr-4"
          />
        </div>
        <div
            class="d-flex flex-row align-center"
            style="border-radius: 4px; border: 1px solid rgba(23, 23, 41, 0.08);cursor:pointer;"
            @click="makePurchaseBank()"
        >
          <v-img
              :src="VisaLogo"
              :max-height="50"
              :max-width="50"
              class="ma-3"
          />
          <span class="font-weight-bold ml-2 ">Оплата картой банка</span>
          <ArrowIcon
              class="ml-auto mr-4"
          />
        </div>
      </v-card>
      <v-card
        v-else-if="payWithPC"
        class="pa-6 text-center"
      >
        <p class="font-weight-bold mb-1" style="font-size: 22px">Зайдите на страницу оплаты через компьютер и считайте QR код для оплаты через Kaspi.kz</p>
        <v-btn
          :elevation="0"
          :ripple="false"
          :color="'#0BC3B8'"
          class="text-capitalize mt-4"
          large
          style="color: white"
          @click="closeDialog()"
        >
          Окей
        </v-btn>
      </v-card>
      <v-card
        v-else
        class="pa-6 text-center"
      >
        <p class="font-weight-bold mb-1" style="font-size: 22px">Отсканируйте QR код</p>
        <p style="font-size: 18px">к оплате <b>{{price.toLocaleString()}}тг</b></p>
        <v-img
          :src="KaspiQR"
          :max-width="200"
          :max-height="200"
          class="mx-auto"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import KaspiLogo from '@/assets/png/kaspi.png'
import VisaLogo from '@/assets/png/visa.png'
import ArrowIcon from '@/assets/svg/arrow_right.svg'
import KaspiQR from '@/assets/png/kaspiQR.png'

import { mdiClose } from '@mdi/js'

export default {
  name: "PurchaseDialog",
  components: {
    ArrowIcon,
  },
  props: {
    dialog: Boolean,
    module_id: Number,
    group_id: Number,
    price: Number,
  },
  data() {
    return {
      KaspiLogo,
      VisaLogo,
      KaspiQR,
      payWithQR: false,
      payWithPC: false,
      mdiClose,
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
      this.payWithQR = false
      this.payWithPC = false
    },

    makePurchaseKaspi() {
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i) || navigator.userAgent.match(/android/i)) {
        this.payWithPC = true
        // window.open('https://kaspi.kz/pay/_gate?action=service_with_subservice&service_id=3025&region_id=18&subservice_id=12695&started_from=global_search', '_blank')
      } else {
        this.payWithQR = true
      }
    },
    async makePurchaseBank() {
      this.buttonLoading = true
      await this.$axios.post('/init-purchase', {
        course_module_id: this.module_id,
        group_id: this.group_id
      })
        .then((res) => {
          if(res && res.data) {
            window.open(res.data.url)
          }
        })
        .catch(err => {
          if(err && err.response) {
            this.$store.dispatch('snackbar/START_SNACKBAR', {
              text:  err.response.data.message,
              color: 'red'
            })
          }
        })
        .finally(() => {
          this.buttonLoading = false
        })
    }
  }
}
</script>

