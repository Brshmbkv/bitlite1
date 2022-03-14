<template>
  <div class="course-locked">
    <div class="course-locked__key px-3">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.0836 16.6662C19.5003 12.1829 14.8336 9.16622 9.61697 10.1996C5.80031 10.9662 2.70031 14.0162 1.90031 17.8329C0.53364 24.2829 5.43364 29.9995 11.667 29.9995C16.017 29.9995 19.717 27.2162 21.0836 23.3329H28.3336V26.6662C28.3336 28.4995 29.8336 29.9995 31.667 29.9995C33.5003 29.9995 35.0003 28.4995 35.0003 26.6662V23.3329C36.8336 23.3329 38.3336 21.8329 38.3336 19.9996C38.3336 18.1662 36.8336 16.6662 35.0003 16.6662H21.0836ZM11.667 23.3329C9.83364 23.3329 8.33364 21.8329 8.33364 19.9996C8.33364 18.1662 9.83364 16.6662 11.667 16.6662C13.5003 16.6662 15.0003 18.1662 15.0003 19.9996C15.0003 21.8329 13.5003 23.3329 11.667 23.3329Z" fill="#0BC3B8"/>
      </svg>
    </div>
    <div class="course-locked__content">
      <div class="course-locked__content__text">
        <span class="course-locked__content__text-title">Закрыт доступ к урокам?</span>
        <span class="course-locked__content__text-subtitle mt-auto">Пройдите тест для определения уровня, чтобы открыть занятия.</span>
      </div>
      <v-btn
        :ripple="false"
        class="text-none white--text px-10 py-4 mt-2 mt-sm-0"
        color="#0ACCDA"
        elevation="0"
        @click="startTest"
      >
        Пройти тест
      </v-btn>
    </div>
  </div>
</template>

<script>
import EventBus from "@/EventBus";

export default {
  name: "CourseLockedAlert",
  destroyed() {
    EventBus.$off()
  },
  methods: {
    startTest() {
      let routeData = this.$router.resolve({ name: 'TestStart', params: { test_id: '51' } })
      window.open(routeData.href, "Test", "resizable,scrollbars,width=1920,height=1080,top=0,left=0")
      EventBus.$on('refreshTestAttempts', () => this.$router.go())
    },
  }
}
</script>

<style lang="scss">
.course-locked {
  background-color: #FFFFFF;
  border: 1px solid rgba(23, 23, 41, 0.08);
  border-radius: 5px;
  border-left: 5px solid #0BC3B8;
  display: flex;
  margin-bottom: 32px;

  &__key {
    background: rgba(11, 195, 184, 0.12);
    display: grid;
    place-items: center;
  }

  &__content {
    padding: 24px 32px 24px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;

    &__text {
      display: flex;
      flex-direction: column;
      max-width: 350px;

      &-title {
        font-weight: bold;
        font-size: 18px;
        line-height: 24px;
        margin-bottom: 8px;
      }
      &-subtitle {
        font-size: 14px;
        line-height: 24px;
      }
    }
  }
}
</style>
