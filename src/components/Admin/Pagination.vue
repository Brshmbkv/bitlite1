<template>
  <div
    class="admin-pagination"
    :class="[
      { 'admin-pagination--with-text': showText },
      { 'admin-pagination--justify-start': justify === 'start' },
      { 'admin-pagination--justify-center': justify === 'center' },
      { 'admin-pagination--justify-end': justify === 'end' },
    ]"
  >
    <v-pagination
      :value="value"
      @input="changePage"
      :total-visible="totalVisible"
      :length="length"
      :disabled="disabled"
    >
    </v-pagination>
    <span v-if="showText" class="admin-pagination__text">{{
      `Показано ${shownItems} из ${totalItems}`
    }}</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    length: {
      required: true,
    },
    totalVisible: {
      type: Number,
      default: 7,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    showText: {
      type: Boolean,
      required: false,
      default: false,
    },
    shownItems: {
      type: Number,
      required: false,
    },
    totalItems: {
      type: Number,
      required: false,
    },
    justify: {
      type: String,
      requred: false,
      default: 'center',
    },
  },
  methods: {
    changePage(val) {
      this.$emit('input', val)
    },
  },
}
</script>

<style lang="scss">
.admin-pagination {
  background: transparent;
  &--with-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 8px;
    .v-pagination {
      justify-content: normal;
    }
  }
  &--justify-start {
    .v-pagination {
      justify-content: flex-start;
    }
  }
  &--justify-center {
    .v-pagination {
      justify-content: center;
    }
  }
  &--justify-end {
    .v-pagination {
      justify-content: flex-end;
    }
  }
  &__text {
    font-size: 15px;
    font-weight: 500;
    line-height: 32px;
    color: #9fa4b1;
  }
  .v-pagination__navigation--disabled {
    .theme--light.v-icon {
      color: rgba(23, 23, 41, 0.2);
    }
  }
  .v-pagination {
    gap: 8px;
  }
  .v-pagination__navigation,
  .v-pagination__item {
    margin: 0;
  }
  .v-pagination__navigation {
    box-shadow: none;
    box-sizing: border-box;
    border-radius: 4px;
    background: none !important;
  }
  .v-pagination__item.v-pagination__item--active {
    box-shadow: none;
    border: 1px solid rgba(23, 23, 41, 0.2);
    box-sizing: border-box;
    border-radius: 6px;
    background: #4376fb !important;
    border-color: #1651e5 !important;
  }
  .v-pagination__item {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    box-shadow: none;
    border-radius: 6px;
    background: none !important;
    font-weight: 600;
    color: #5a6275;
    &:not(.v-pagination__item--active):hover {
      background-color: #4376fb1a !important;
    }
  }
}
</style>
