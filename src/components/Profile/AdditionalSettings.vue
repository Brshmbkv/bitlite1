<template>
  <div class="additional-settings">
    <v-tooltip top :disabled="!!nickname">
      <template v-slot:activator="{ on, attrs }">
        <div
          class="additional-settings__item"
          :class="!nickname ? 'additional-settings__item--disabled' : ''"
          @click="nickname ? updateSettings('show_nickname') : undefined"
          v-on="on"
          v-bind="attrs"
        >
          <AwesomeSwitch v-model="show_nickname" no-emit/>
          <span>Показывать Никнейм</span>
        </div>
      </template>
      <span>Сначала укажите никнейм!</span>
    </v-tooltip>
    <div class="additional-settings__item" @click="updateSettings('show_hh')">
      <AwesomeSwitch v-model="show_hh" no-emit/>
      <span>Показывать вакансии hh.kz(HeadHunter) внутри курса</span>
    </div>
    <div class="additional-settings__item additional-settings__item--disabled">
      <AwesomeSwitch v-model="value"/>
      <span>Цвет системы (dark/light mode)</span>
    </div>
  </div>
</template>

<script>
import AwesomeSwitch from "@/components/Admin/AwesomeSwitch";
export default {
  name: "AdditionalSettings",
  components: { AwesomeSwitch },
  props: {
    settings: Object,
    nickname: String
  },
  data() {
    return {
      value: true,
      show_hh: this.settings && this.settings.show_hh || false,
      show_nickname: this.settings && this.settings.show_nickname || false,
    }
  },
  methods: {
    async updateSettings(option) {
      try {
        const res = await this.$axios.post('/settings', {
          [option]: !this[option]
        })
        if(res?.data) {
          this.show_hh = res?.data?.settings?.show_hh
          this.show_nickname = res?.data?.settings?.show_nickname
          this.$store.dispatch('user/updateSettings', res?.data?.settings)
        }
      } catch(e) {
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Произошла ошибка! Повторите попытку.',
          color: 'error'
        })

        throw new Error(e)
      }
    }
  }
}
</script>

<style lang="scss">
.additional-settings {
  border: 1px solid rgba(23, 23, 41, 0.08);
  border-radius: 10px;
  display: inline-flex;
  flex-direction: column;

  .additional-settings__item {
    padding: 24px;
    font-weight: 500;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 18px;
    cursor: pointer;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(23, 23, 41, 0.08);
    }
    &--disabled {
      opacity: 0.5;
      user-select: none;
      cursor: default;

      .awesome-switch__slider {
        cursor: default;
      }
    }
  }
}
</style>
