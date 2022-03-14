<template>
  <v-dialog v-model="dialog" persistent max-width="370">
    <div class="card-wrapper">
      <div class="close-icon__container">
        <CloseIcon class="close-icon" @click="$emit('update:dialog', false)" />
      </div>
      <div class="icon-wrapper">
        <WarningIcon />
      </div>
      <div class="card-title">{{ title }}</div>
      <div class="card-text">{{ text }}</div>
      <div class="card-actions">
        <v-btn
          elevation="0"
          :ripple="false"
          class="cancel-btn"
          @click="$emit('update:dialog', false)"
        >
          Отменить
        </v-btn>
        <v-btn
          elevation="0"
          :ripple="false"
          class="success-btn"
          :loading="loading"
          @click="$emit('success')"
        >
          {{ action }}
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import CloseIcon from '@/assets/svg/close.svg';
import WarningIcon from '@/assets/svg/warning.svg';
export default {
  name: 'ConfirmationModal',
  components: { WarningIcon, CloseIcon },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    title: String,
    text: String,
    action: String,
  },
};
</script>

<style scoped>
.card-wrapper {
  position: relative;
  padding: 50px 25px 35px;
  background: #f5f6f8;
}
.close-icon__container {
  width: 42px;
  height: 30px;
  position: absolute;
  top: 10px;
  right: 10px;
}
.icon-wrapper {
  padding: 5px;
}
.close-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}
.card-title {
  margin-top: 15px;
  line-height: 24px;
  font-weight: 600;
  color: #000000;
}
.card-text {
  padding: 0;
  margin-top: 15px;
  font-size: 15px;
  line-height: 24px;
  letter-spacing: 0.01em;
  color: #000000;
}
.card-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 20px;
  margin-top: 35px;
  height: 40px;
}
.cancel-btn,
.success-btn {
  height: 100% !important;
  font-weight: 500;
  text-transform: capitalize;
  line-height: 140%;
  border-radius: 5px;
}
.cancel-btn {
  color: #5a6275;
  background-color: rgba(23, 23, 41, 0.08) !important;
  border: 1px solid rgba(23, 23, 41, 0.08);
}
.success-btn {
  color: #ffffff;
  background-color: rgba(235, 87, 87, 0.9) !important;
}
</style>
