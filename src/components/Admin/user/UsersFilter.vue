<template>
  <div>
    <v-btn
      :elevation="0"
      :ripple="false"
      tile
      fab
      small
      outlined
      class="users-filter__btn"
      @click="show_menu = !show_menu"
    >
      <v-icon size="20">{{ mdiFilterOutline }}</v-icon>
    </v-btn>
    <div
      v-if="show_menu"
      class="users-filter__menu"
      v-click-outside="closeMenu"
    >
      <div v-for="filter in filters" :key="filter.text">
        <div
          class="d-flex justify-space-between align-center mb-3"
          @click="changeValue(filter.value)"
        >
          <span class="font-weight-medium">{{ filter.text }}</span>
          <AwesomeSwitch :value="getValue(filter.value)" no-emit />
        </div>
      </div>
      <v-btn
        elevation="0"
        :ripple="false"
        outlined
        color="#4376FB"
        class="mt-4 float-right text-capitalize"
        @click="handleSearchClick"
      >
        Поиск
      </v-btn>
    </div>
  </div>
</template>

<script>
// import FilterIcon from '@/assets/svg/filter.svg'
import { mdiFilterOutline } from '@mdi/js'
import AwesomeSwitch from '@/components/Admin/AwesomeSwitch'

export default {
  name: 'UsersFilter',
  components: { AwesomeSwitch },
  props: {
    has_no_group: {
      type: Boolean,
      default: false,
    },
    has_unpaid_course: {
      type: Boolean,
      default: false,
    },
    has_finished_course: {
      type: Boolean,
      default: false,
    },
    has_return_course: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiFilterOutline,
      show_menu: false,
      filters: [
        {
          text: 'Не было группы',
          value: 'has_no_group',
        },
        {
          text: 'Закончил курс',
          value: 'has_finished_course',
        },
        {
          text: 'Требуют оплаты за след. модуль',
          value: 'has_unpaid_course',
        },
        {
          text: 'Отказались',
          value: 'has_return_course',
        },
      ],
    }
  },
  methods: {
    closeMenu() {
      if (this.show_menu) this.show_menu = false
    },
    handleSearchClick() {
      this.$emit('search')
      this.closeMenu()
    },
    getValue(field) {
      return this[field] || false
    },
    changeValue(field) {
      this.$emit(`update:${field}`, !this[field] || false)
    },
  },
}
</script>

<style lang="scss">
.users-filter__div {
  position: relative;
  width: auto;
}

.users-filter__btn {
  background-color: white;
  border: 1px solid rgba(23, 23, 41, 0.08);
  border-radius: 5px;
}

.users-filter__menu {
  position: absolute;
  top: 100%;
  width: 400px;
  background-color: white;
  border: 1px solid rgba(23, 23, 41, 0.08);
  padding: 16px;
  border-radius: 10px;
  cursor: default;
  z-index: 5;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
    rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
  animation: users-filter 0.4s ease alternate forwards;
}

@keyframes users-filter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
