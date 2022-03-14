<template>
  <div class="filter">
    <slot name="button">
      <button
        @click="$emit('openFilter')"
        class="filter__btn"
        :class="{ 'filter__btn--active': showFilter || filtersApplied }"
      >
        <FilterIcon />
        <span class="filter-btn__title">Фильтры</span>
      </button>
    </slot>
    <div
      class="filter__content"
      v-if="showFilter"
      v-click-outside="closeFilter"
    >
      <div class="filter__header">
        <h1 class="filter__title">Фильтры</h1>
        <a class="filter__clear" @click.prevent="$emit('clearFilters')"
          >Очистить все</a
        >
      </div>
      <div class="filter-default__body">
        <slot name="body">
          <span
            >Pass filter options via slot.<br />
            Slot name: body</span
          >
        </slot>
      </div>
      <div class="filter__footer">
        <button
          class="filter-footer__btn filter-footer__btn--cancel"
          @click="$emit('closeFilter')"
        >
          Отменить
        </button>
        <button
          @click="applyFilters"
          class="filter-footer__btn filter-footer__btn--apply"
        >
          Применить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import FilterIcon from '@/assets/svg/filter.svg'
export default {
  components: {
    FilterIcon,
  },
  props: {
    showFilter: {
      type: Boolean,
      default: false,
    },
    filtersApplied: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeFilter() {
      if (this.showFilter) {
        this.$emit('closeFilter')
      }
    },
    applyFilters() {
      this.$emit('applyFilters')
      this.$emit('closeFilter')
    },
  },
}
</script>

<style lang="scss">
.filter {
  position: relative;
  &__btn {
    display: flex;
    align-items: center;
    padding: 11px 15px;
    line-height: 16px;
    background-color: #ffffff;
    border: 1px solid rgba(#171729, 0.12);
    border-radius: 5px;
    cursor: pointer;
    transition-property: background-color, color, fill;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    & > span {
      margin-left: 10px;
    }
    &:hover {
      background-color: rgba(#0bc3b8, 0.8);
      color: #ffffff;
      & > svg > path {
        fill: #ffffff;
      }
    }
  }
  &__custom-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background-color: #fff;
    border: 2px solid #9fa4b1;
    border-radius: 3px;
    display: grid;
    place-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      border-color: #0bc3b8;
    }
    &:checked {
      background-color: #0bc3b8;
      border: none;
    }
    &:checked::before {
      content: '';
      width: 12px;
      height: 12px;
      background-image: url('data:image/svg+xml;utf-8,<svg width="12" height="12" viewBox="0 0 56 43" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 24L21 38L51 5" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>');
    }
  }
  &__custom-checkbox:hover,
  &__custom-checkbox:not(:checked):hover {
    background-color: #0bc3b8;
    border: none;
  }
  &__custom-checkbox:not(:checked):hover::before {
    content: '';
    width: 10px;
    height: 10px;
    background-image: url('data:image/svg+xml;utf-8,<svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.00094 6.00094H9.00141C9.54993 6.00094 10 5.55087 10 5.00234C10 4.45148 9.54993 4.00141 9.00141 4.00141H6.00094V1.00094C6.00094 0.45007 5.55087 0 5.00234 0C4.44913 0 3.99906 0.45007 3.99906 1.00094V4.00141H0.998594C0.45007 4.00141 0 4.45148 0 5.00234C0 5.55087 0.45007 6.00094 0.998594 6.00094H3.99906V9.00141C3.99906 9.55227 4.44913 10.0023 5.00234 10.0023C5.55087 10.0023 6.00094 9.55227 6.00094 9.00141V6.00094Z" fill="white"/></svg>');
  }
  &__custom-checkbox:hover::before {
    content: '';
    width: 10px;
    height: 2px;
    background-image: url('data:image/svg+xml;utf-8,<svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 1.00094C0 1.54946 0.45007 1.99953 0.998594 1.99953H9.00141C9.54993 1.99953 10 1.54946 10 1.00094C10 0.45007 9.54993 0 9.00141 0H0.998594C0.45007 0 0 0.45007 0 1.00094Z" fill="white"/></svg>');
  }
  &__content {
    position: absolute;
    min-width: 335px;
    margin-top: 8px;
    border: 1px solid rgba(#171729, 0.12);
    border-radius: 10px;
    background-color: #fff;
    animation: fadeIn 0.4s ease alternate forwards;
    overflow: hidden;
    z-index: 50;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
  }
  &__clear {
    font-size: 14px;
    font-weight: 500;
    line-height: 24px;
    color: #5a6275 !important;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: #0bc3b8 !important;
    }
  }
  &__title {
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
  }
  &-default__body {
    padding: 20px 20px;
    background-color: #f5f6f8;
  }
  &__footer {
    display: flex;
    border-top: 1px solid #1717291f;
  }
  &-footer__btn {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
    line-height: 24px;
    padding: 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.01em;
    transition: background-color 0.3s ease;
    &--cancel {
      color: #5a6275;
    }
    &--apply {
      color: #0bc3b8;
      &:hover {
        background-color: rgba(#0bc3b8, 0.12);
      }
      &:active {
        background-color: rgba(#0bc3b8, 1);
        color: #ffffff;
      }
    }
    &:nth-child(2) {
      border-left: 1px solid #1717291f;
    }
  }
  &__rounded-checkbox {
    border-radius: 50%;
  }
  &-body__tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border: 1px solid rgba(#171729, 0.12);
    border-radius: 9999px;
    background-color: #fff;
    cursor: pointer;
  }
  &-body__text {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: #5a6275;
  }
}

.filter-btn__title {
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
