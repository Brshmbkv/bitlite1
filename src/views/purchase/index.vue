<template>
  <div>
    <v-container
      v-if="error"
    >
      <v-alert
        border="bottom"
        colored-border
        type="error"
        elevation="2"
      >
        Ошибка: {{ error.message }}
      </v-alert>
    </v-container>
    <v-row
      v-else
      justify="center"
      align="center"
      class="flex-column py-6 px-4 text-center ma-0"
      style="position: relative"
    >
      <v-btn
        class="text-capitalize mt-3 ml-4 mb-4 course-purchase__btn--back mr-auto "
        top
        left
        :absolute="$vuetify.breakpoint.mdAndUp"
        style="background-color: rgba(23, 23, 41, 0.08);border: 1px solid rgba(23, 23, 41, 0.08);"
        :ripple="false"
        :elevation="0"
        @click="$router.go(-1)"
      >
        вернуться назад
      </v-btn>
      <p style="font-size: 30px; font-weight: 700;">Привет, будущий специалист ! 👋😃</p>
      <p style="font-size: 18px; font-weight: 400">Выбери свой подходящий поток</p>
      <v-chip
        v-if="streams && streams.length !== 0"
        label
        :color="'rgba(11, 195, 184, 0.12)'"
        :text-color="'#0BC3B8'"
        style="font-weight: 500"
      >
        <v-icon
          size="20"
          class="mr-2"
        >{{ mdiEyeOutline }}
        </v-icon>
        {{ randomNumber }} просматривают сейчас
      </v-chip>
    </v-row>
    <v-container class="pa-0">
      <PurchaseStreamCard
        :streams="streams"
        :loading="loading"
      />
    </v-container>
  </div>
</template>

<script>
import PurchaseStreamCard from "@/components/Purchase/PurchaseStreamCard";

import { mdiEyeOutline } from '@mdi/js'

export default {
  name: "PurchaseIndex",
  components: {
    PurchaseStreamCard,
  },
  props: ['module_id'],
  data() {
    return {
      loading: false,
      streams: undefined,
      purchaseCourse: false,
      error: undefined,
      mdiEyeOutline,
      randomNumber: Math.floor(Math.random() * (6 - 3)) + 3,
    }
  },
  mounted() {
    this.fetchStreams()
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async fetchStreams() {
      this.loading = true
      await this.$axios.get(`catalog/modules/${ this.module_id }/available-streams`)
        .then(res => {
          if(res && res.data) {
            this.streams = res.data
          }
        })
        .catch(err => {
          if(err) {
            // console.log(err.response.data)
            this.error = err.response && err.response.data
          }
        })
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if(from.name === 'CoursesCatalogShow') {
        vm.purchaseCourse = true
      }
    })
  },
}
</script>

<style lang="scss">
.course-purchase__btn--back {
  &:before {
    background: transparent;
  }
}

.course-purchase__clock-svg {
  circle {
    stroke: white;
  }

  path {
    stroke: white;
  }
}
</style>
