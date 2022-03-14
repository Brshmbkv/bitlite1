<template>
  <div>
    <v-btn
      icon
      :ripple="false"
      class="edit-dropdown__btn"

      @click.stop.prevent="show_menu = !show_menu"
    >
      <ThreeDotsIcon/>
      <div
        v-if="show_menu"
        class="edit-dropdown__btn__menu"
        v-click-outside="handleOutsideClick"
      >
        <div
          v-if="!forMove"
          class="edit-dropdown__btn__menu-item"
          @click="$emit('edit')"
          style="color: #0ACCDA"
        >
          <PenIcon/>Изменить
        </div>
        <div
          v-else
          class="edit-dropdown__btn__menu-item"
          @click="$emit('move')"
          style="color: #3E77FF"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.11657 9.88335L2.7999 12.2083C2.64157 12.375 2.64157 12.6333 2.7999 12.8L5.11657 15.125C5.3749 15.3917 5.8249 15.2 5.8249 14.8333V13.3333H10.8332C11.2916 13.3333 11.6666 12.9583 11.6666 12.5C11.6666 12.0417 11.2916 11.6667 10.8332 11.6667H5.8249V10.175C5.8249 9.80001 5.3749 9.61668 5.11657 9.88335ZM17.2082 7.20835L14.8916 4.88335C14.6332 4.61668 14.1832 4.80835 14.1832 5.17501V6.66668H9.16657C8.70824 6.66668 8.33324 7.04168 8.33324 7.50001C8.33324 7.95835 8.70824 8.33335 9.16657 8.33335H14.1749V9.82501C14.1749 10.2 14.6249 10.3833 14.8832 10.1167L17.1999 7.79168C17.3666 7.63335 17.3666 7.36668 17.2082 7.20835Z" fill="#3E77FF"/>
          </svg>Переместить
        </div>
        <div
          class="edit-dropdown__btn__menu-item"
          style="color: #EB5757"
          @click="$emit('delete')"
        >
          <TrashIcon/>Удалить
        </div>
      </div>
    </v-btn>
  </div>
</template>

<script>
import ThreeDotsIcon from '@/assets/svg/three-dots.svg'
import PenIcon from '@/assets/svg/pen.svg'
import TrashIcon from '@/assets/svg/trash.svg'

export default {
  name: "EditDropDownButton",
  components: {
    ThreeDotsIcon,
    TrashIcon,
    PenIcon
  },
  props: {
    forMove: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show_menu: false
    }
  },
  methods: {
    handleOutsideClick() {
      this.show_menu = false
    }
  }
}
</script>

<style lang="scss">
.edit-dropdown__btn {
  position: relative;

  &__menu {
    position: absolute;
    right: 70%;
    top: 70%;
    background-color: #FFFFFF;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
    border-radius: 10px;

    &-item {
      padding: 10px 12px;
      text-transform: none;
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      letter-spacing: 0.01em;
      display: flex;
      align-items: center;
      gap: 6px;

      &:first-child {
        border-radius: 10px 10px 0 0;
      }

      &:last-child {
        border-radius: 0 0 10px 10px;
      }

      &:hover {
        background-color: rgba(23, 23, 41, 0.08);

        &:first-child {
          background: rgba(10, 204, 218, 0.12);
        }

        &:last-child {
          background: rgba(235, 87, 87, 0.12);
        }
      }
    }
  }
}
</style>
