<template>
  <v-card
    width="100%"
    height="auto"
    elevation="0"
    class="show-user__card"
  >
    <v-card-title
      class="pr-0 pl-0 pl-md-4"
      v-if="user"
    >
      <v-row no-gutters>
        <v-col cols="12" class="text-center" md="auto">
          <v-avatar
            :color="'#F8F8F8'"
            size="120"
            class="mx-auto"
            rounded
          >
            <v-img
              :src="user.avatar || UserPlaceholderSm"
              alt=""
            />
          </v-avatar>
        </v-col>
        <v-col cols class="px-6 py-3">
          <p class="float-left show-user__label mb-0 text-center">
            {{ (user.first_name || '') + ' ' + (user.last_name || '') }}
            <v-chip
              label
              class="ml-sm-4 ml-0 my-4 my-sm-0"
              style="color: #5CC689;background-color: rgba(92, 198, 137, 0.1);height: 37px"
            >Активен
            </v-chip>
          </p>
          <p class="float-sm-right float-none text-center mb-0">
            <v-btn
              text
              :ripple="false"
              outlined
              right
              :color="'#0ACCDA'"
              class="text-capitalize px-2"
              style="border: 1px solid #0ACCDA"
            >
              <span style="font-weight: normal;font-size:14px; gap: 8px" class="d-flex align-center">
                <PenIcon/>
                <span class="d-none d-md-inline-block">Редактировать</span>
              </span>
            </v-btn>
          </p>
          <v-col class="px-0 pt-10 show-user__goal">
            <p class="mb-2">Цель</p>
            Стать Хокаге
          </v-col>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="mx-md-4 mx-2">
      <v-row class="my-4">
        <v-col
          md="3"
          sm="6"
          cols="12"
          v-for="item in stats"
          :key="item.text"
        >
          <div
            class="d-flex"
          >
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
              <v-sheet v-else color="transparent" class="d-flex" width="24" height="24">
                <CoinIcon/>
              </v-sheet>
            </v-avatar>
            <div class="text-truncate">
              <span
                class="show-user__card-footer-top-text"
                :style="{
                  color: item.textColor || '#171729'
                }"
              >
                <template v-if="item.text === 'Телефон'">{{ item.value | VMask('+# (###) ###-##-##') }}</template>
                <template v-else>{{ item.value }}</template>
              </span>
              <span class="show-user__card-footer-bot-text d-block">{{ item.text }}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiPhone, mdiClockTimeFourOutline, mdiPencilOutline, mdiPercent } from '@mdi/js'
import CoinIcon from '@/assets/svg/coin.svg'
import PenIcon from '@/assets/svg/pen.svg'
import UserPlaceholderSm from '@/assets/user_placeholder_sm.png'

export default {
  name: "StudentInfoAdmin",
  components: {
    CoinIcon,
    PenIcon,
  },
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    }
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
          containerBg: 'rgba(49, 107, 244, 0.1)',
          value: !isNaN(parseInt(this.user.logic_test_score)) ? `${this.user.logic_test_score}%` : '-'
        },
        {
          text: 'Прибыль',
          textColor: '#5CC689',
          containerBg: 'rgba(92, 198, 137, 0.1)',
          value: this.user.total_income ? `+ ${this.user.total_income || 0} KZT` : '-'
        },
        {
          text: 'Телефон',
          icon: mdiPhone,
          iconColor: '#F2C94C',
          value: this.user.phone || '-',
          containerBg: 'rgba(242, 201, 76, 0.1)'
        },
        {
          text: 'Время в системе',
          icon: mdiClockTimeFourOutline,
          iconColor: '#BB6BD9',
          containerBg: 'rgba(187, 107, 217, 0.1)',
          value: '5 мин'
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>

