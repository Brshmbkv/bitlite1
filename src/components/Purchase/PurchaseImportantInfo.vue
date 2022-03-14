<template>
  <div>
    <v-dialog
      v-model="dialog"
      @click:outside="closeDialog()"
      width="500px"
    >
      <v-icon
          style="position: fixed; top: 20px; right: 20px;cursor:pointer;;"
          color="white"
          size="50"
          @click="closeDialog()"
      >
        {{mdiClose}}
      </v-icon>
      <v-card>
        <v-card-title
          style="font-size: 24px; font-weight: 700; letter-spacing: 0.02em"
          :style="{fontSize: $vuetify.breakpoint.mdAndDown ? '22px' : '24px'}"
        >
          Важная информация!
        </v-card-title>
        <v-card-text style="color: #171729" class="pt-4 pb-0">
          <p style="font-size: 24px; font-weight: 700; letter-spacing: 0.02em" class="mb-1 d-flex justify-space-between flex-wrap">
            Оплата сегодня
            <span class="float-right">
              {{price && price.toLocaleString()}}тг
            </span>
          </p>
          <p style="font-size: 14px">Первый месяц обучения</p>
          <p style="font-size: 24px; font-weight: 700; letter-spacing: 0.02em" class="mb-1 d-flex justify-space-between flex-wrap">
            Оплата 15 мая 2021
            <span class="float-right">
              {{price && price.toLocaleString()}}тг
            </span>
          </p>
          <p style="font-size: 14px">Второй месяц обучения</p>
          <div class="my-8">
            <p class="font-weight-bold mb-1">Оплата за весь курс идет ежемесячно</p>
            <p>
              Сейчас вы вносите оплату за первый месяц обучения
              на курсе Java SE. Второй модуль курса начнется
              15 мая 2021, в это время вам необходимо внести
              второй платеж, чтобы продолжить курс.
            </p>
            <p class="font-weight-bold mb-1">Доступ откроется после оплаты</p>
            <p>
              После внесения платежа за первый месяц, с вами
              свяжется наш менеджер и подтвердив вашу оплату,
              откроет доступ к курсу и добавит в общий чат группы
            </p>
          </div>
          <v-checkbox
              class="mt-4 my-check-box"
              :ripple="false"
              v-model="agree"
              dense
              label="Я согласен с условиями обучения и внимательно прочитал информацию об ежемесячной оплате"
          ></v-checkbox>
        </v-card-text>
        <v-card-actions
          class="pa-6 pt-0"
        >
          <v-btn
            :ripple="false"
            :elevation="0"
            :color="'#0BC4B8'"
            large
            :disabled="!agree"
            class="text-capitalize"
            style="color: white"
            block
            @click="openDialog()"
          >
            Продолжить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  name: "PurchaseImportantInfo",
  props: {
    dialog: Boolean,
    price: Number,
  },
  data() {
    return {
      mdiClose,
      agree: false,
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
      this.agree = false
    },

    openDialog() {
      this.$emit('open-dialog')
      this.agree = false
    }
  }
}
</script>

<style scoped>

</style>
