<template>
  <div class="student-review">
    <v-expansion-panels
      accordion
      flat
    >
      <v-expansion-panel
        v-for="review in reviews"
        :key="review.id"
        class="student-review__panel"
      >
        <v-expansion-panel-header class="px-4 py-6">
          <div class="student-review__panel__header">
            <span class="d-flex align-center">
              <v-icon >
                {{ mdiGuyFawkesMask }}
              </v-icon>
              Anonymous
            </span>
            <span class="d-flex align-center">
              {{ review.score || 0 }}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.31282 1.0868C7.57394 0.484638 8.42789 0.484639 8.68901 1.0868L10.0926 4.32364C10.31 4.82487 10.7826 5.16829 11.3265 5.22011L14.8387 5.55478C15.492 5.61704 15.7559 6.42919 15.2639 6.86361L12.6192 9.19875C12.2097 9.56036 12.0292 10.116 12.1479 10.6493L12.915 14.093C13.0577 14.7336 12.3668 15.2355 11.8016 14.9019L8.7635 13.1082C8.29305 12.8305 7.70878 12.8305 7.23833 13.1082L4.20022 14.9019C3.63503 15.2355 2.94417 14.7336 3.08687 14.093L3.85389 10.6493C3.97267 10.116 3.79212 9.56036 3.38259 9.19875L0.737909 6.86361C0.245911 6.42919 0.509796 5.61704 1.16317 5.55478L4.67533 5.22011C5.21919 5.16829 5.69187 4.82487 5.90922 4.32364L7.31282 1.0868Z" fill="#F16635"/>
              </svg>
            </span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{ review.comment }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mdiGuyFawkesMask } from '@mdi/js'

export default {
  name: "StudentReviews",
  props: {
    reviews: Array,
  },
  data() {
    return {
      mdiGuyFawkesMask
    }
  }
}
</script>

<style lang="scss">
.student-review {
  width: 100%;

  &__panel {
    border: 1px solid rgba(23, 23, 41, 0.08);
    border-radius: 10px !important;
    margin-bottom: 16px;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        gap: 5px;
        font-weight: 500;
        font-size: 16px
      }
    }
  }
  .v-expansion-panel-content {
    overflow-wrap: anywhere;

    &__wrap {
      background-color: #F8F8F8;
      border-radius: 0 0 10px 10px;
      padding-top: 16px;
      border-top: 1px solid rgba(23, 23, 41, 0.08);
      line-height: 28px;
      font-size: 14px;
      letter-spacing: 0.02em;
    }
  }
}
</style>
