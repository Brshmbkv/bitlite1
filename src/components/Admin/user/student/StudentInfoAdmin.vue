<template>
  <v-card width="100%" height="auto" elevation="0" class="show-user__card">
    <v-card-title class="pr-0 pl-0 pl-md-4" v-if="user">
      <v-row no-gutters>
        <v-col cols="12" class="text-center" md="auto">
          <v-avatar :color="'#F8F8F8'" size="100" class="mx-auto" rounded>
            <v-img :src="user.avatar || UserPlaceholderSm" alt="" />
          </v-avatar>
        </v-col>
        <v-col cols class="px-6">
          <p
            class="float-left mb-0 text-center"
            style="display:flex; align-items: center; gap: 8px;"
          >
            <span
              style="font-size: 24px; font-weight: 500; line-height: 36px;"
              >{{
                (user.first_name || '') + ' ' + (user.last_name || '')
              }}</span
            >
            <span
              style="display:inline-block; font-size: 12px; line-height: 16px; font-weight: 500; padding: 4px 16px; border-radius: 9999px; background-color: #4376FB1a"
              >Активен</span
            >
          </p>
          <v-col class="px-0 pt-10 show-user__goal">
            <p class="mb-2">Цель: Стать Хокаге</p>
          </v-col>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="mx-md-4 mx-2">
      <v-row class="my-4">
        <v-col md="3" sm="6" cols="12" v-for="item in stats" :key="item.text">
          <div class="d-flex">
            <v-avatar
              height="40"
              width="40"
              min-width="40"
              class="mr-3"
              :color="item.containerBg"
            >
              <v-icon v-if="item.icon" :color="item.iconColor" size="24">
                {{ item.icon }}
              </v-icon>
              <v-sheet
                v-else
                color="transparent"
                class="d-flex"
                width="24"
                height="24"
              >
                <CoinIcon />
              </v-sheet>
            </v-avatar>
            <div class="text-truncate">
              <span
                class="show-user__card-footer-top-text"
                :style="{
                  color: item.textColor || '#171729',
                }"
              >
                <template v-if="item.text === 'Телефон'">{{
                  item.value | VMask('+# (###) ###-##-##')
                }}</template>
                <template v-else>{{ item.value }}</template>
              </span>
              <span class="show-user__card-footer-bot-text d-block">{{
                item.text
              }}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mdiPhone,
  mdiClockTimeFourOutline,
  mdiPencilOutline,
  mdiCurrencyUsd,
  mdiPercent,
} from '@mdi/js'
import CoinIcon from '@/assets/svg/coin.svg'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'

export default {
  name: 'StudentInfoAdmin',
  components: {
    CoinIcon,
  },
  props: {
    user: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      mdiPhone,
      mdiClockTimeFourOutline,
      mdiPencilOutline,
      UserPlaceholderSm,
      stats: [
        {
          icon: mdiPercent,
          iconColor: '#316BF4',
          text: 'Результат тестирования',
          containerBg: '#316BF41a',

          value: !isNaN(parseInt(this.user.logic_test_score))
            ? `${this.user.logic_test_score}%`
            : '-',
        },
        {
          icon: mdiCurrencyUsd,
          iconColor: '#316BF4',
          text: 'Прибыль',
          containerBg: '#316BF41a',

          value: this.user.total_income
            ? `+ ${this.user.total_income || 0} KZT`
            : '-',
        },
        {
          text: 'Телефон',
          iconColor: '#316BF4',
          icon: mdiPhone,
          value: this.user.phone || '-',
          containerBg: '#316BF41a',
        },
        {
          text: 'Время в системе',
          icon: mdiClockTimeFourOutline,
          iconColor: '#316BF4',
          containerBg: '#316BF41a',
          value: '5 мин',
        },
      ],
    }
  },
}
</script>

<style scoped></style>
