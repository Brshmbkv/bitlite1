<template>
  <v-container>
    <template v-if="pageLoading">
      <v-row class="ma-0 mt-4">
        <v-skeleton-loader type="chip"></v-skeleton-loader>
        <v-skeleton-loader class="ml-2" type="chip"></v-skeleton-loader>
        <v-skeleton-loader class="ml-2" type="chip"></v-skeleton-loader>
      </v-row>
      <v-skeleton-loader class="mt-16" type="heading"></v-skeleton-loader>
      <v-skeleton-loader class="mt-8" type="text"></v-skeleton-loader>
      <v-skeleton-loader class="mt-4" type="text"></v-skeleton-loader>
      <v-skeleton-loader class="mt-4" type="text"></v-skeleton-loader>
      <v-row class="ma-0 mt-6">
        <v-col class="pa" cols="8">
          <v-skeleton-loader type="image"></v-skeleton-loader>
          <v-skeleton-loader class="mt-4" type="image"></v-skeleton-loader>
          <v-skeleton-loader class="mt-4" type="image"></v-skeleton-loader>
        </v-col>
        <v-col class="pa" cols="4">
          <v-skeleton-loader type="image"></v-skeleton-loader>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <CustomTabs :items="tabItems" v-model="tab"></CustomTabs>
      <h1 class="exercise-practice__title">{{ event.title }}</h1>
      <div class="exercise-practice__deadline-wrapper">
        <FilledClockIcon />
        <p class="exercise-practice__deadline-text">
          До: {{ event.deadline_at | deadlineFormat }}
        </p>
      </div>
      <div class="exercise-practice__content-wrapper">
        <v-tabs-items v-model="tab" style="flex: 1;">
          <v-tab-item v-for="tab in tabItems" :key="tab.key" :value="tab.key">
            <div
              class="exercise-practice__content"
              :style="{ 'place-content': loading ? 'center' : '' }"
            >
              <template v-if="loading">
                <v-progress-circular size="64" indeterminate />
              </template>
              <template
                v-else-if="
                  event[tab.key] &&
                    event[tab.key].length === 0 &&
                    selectedFilterTags.length !== 0
                "
              >
                <div class="exercise-practice__filter-not-found">
                  <v-icon size="80" color="#CED3E0">{{ mdiFileFind }}</v-icon>
                  <div>
                    <h1 class="exercise-practice-filter__text">
                      Задачи не найдены
                    </h1>
                    <span class="exercise-practice-filter__subtext"
                      >Нет задач по данному фильтру</span
                    >
                  </div>
                </div>
              </template>
              <template
                v-else-if="event[tab.key] && event[tab.key].length === 0"
              >
                <div class="exercise-practice__filter-not-found">
                  <v-icon size="80" color="#CED3E0">{{ mdiFileFind }}</v-icon>
                  <div>
                    <h1 class="exercise-practice-filter__text">
                      Задачи не найдены
                    </h1>
                  </div>
                </div>
              </template>

              <template v-else>
                <PracticeCard
                  v-for="(item, i) in event[tab.key]"
                  :item="item"
                  :event-id="event.id"
                  :type="tab.key"
                  :key="item.id"
                  :class="{
                    'exercise-practice-card--active':
                      i === 0 && !getFirstPracticeStatus,
                  }"
                />
              </template>
            </div>
          </v-tab-item>
        </v-tabs-items>
        <CustomFilterWithoutButton @clearFilters="selectedFilterTags = []">
          <div>
            <h3 class="filter-body__title">Статус:</h3>
            <div class="filter-body__wrapper">
              <label
                class="filter-body__tag"
                v-for="item in filterTags.status"
                :key="item.id"
              >
                <input
                  class="filter__custom-checkbox filter__rounded-checkbox"
                  type="checkbox"
                  :value="item.value"
                  v-model="selectedFilterTags"
                />
                <span class="filter-body__text">{{ item.text }}</span>
              </label>
            </div>
            <hr class="filter-body__line" />
            <h3 class="filter-body__title">Уровень сложности:</h3>
            <div class="filter-body__wrapper">
              <label
                class="filter-body__tag"
                v-for="item in filterTags.difficulty"
                :key="item.id"
              >
                <input
                  class="filter__custom-checkbox filter__rounded-checkbox"
                  type="checkbox"
                  :value="item.value"
                  v-model="selectedFilterTags"
                />
                <span class="filter-body__text">{{ item.text }}</span>
              </label>
            </div>
          </div>
        </CustomFilterWithoutButton>
      </div>
    </template>
  </v-container>
</template>

<script>
import CustomTabs from '@/components/CustomTabs.vue'
import FilledClockIcon from '@/assets/svg/filledClock.svg'
import CustomFilterWithoutButton from '@/components/CustomFilterWithoutButton.vue'
import PracticeCard from '@/components/Exercises/Practice/PracticeCard.vue'

import { mdiFileFind } from '@mdi/js'

export default {
  components: {
    CustomTabs,
    FilledClockIcon,
    CustomFilterWithoutButton,
    PracticeCard,
  },
  props: ['event_id', 'prev_tab'],
  data() {
    return {
      mdiFileFind,
      event: {},
      tab: 'practice',
      tabItems: [
        { title: 'Практические задания', key: 'practice' },
        { title: 'Домашние задания', key: 'homework' },
        { title: 'Бонусные задания', key: 'bonus' },
      ],
      filterTags: {
        status: [
          { id: 1, text: 'Решено', value: 'passed' },
          { id: 2, text: 'Не решено', value: 'not_passed' },
        ],
        difficulty: [
          { id: 1, text: 'Легкий', value: 'easy' },
          { id: 2, text: 'Средний', value: 'medium' },
          { id: 3, text: 'Сложный', value: 'hard' },
        ],
      },
      selectedFilterTags: [],
      loading: false,
      pageLoading: false,
    }
  },
  computed: {
    getFirstPracticeStatus() {
      const firstEvent = this.event[this.tab][0]
      const statuses = [3, 4, 6, 8]
      return (
        firstEvent &&
        Object.prototype.hasOwnProperty.call(firstEvent, 'auth_user_result') &&
        statuses.includes(firstEvent?.auth_user_result?.status.code)
      )
    },
  },
  watch: {
    selectedFilterTags: function(newVal, oldVal) {
      if (newVal.length === oldVal.length) return
      this.fetchPractice()
    },
    tab: function() {
      this.selectedFilterTags = []
    },
  },
  mounted() {
    this.pageLoading = true
    this.tab = this.prev_tab || 'practice'
    this.fetchPractice().then(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: `Мои задания`,
          to: {
            name: 'ExercisesIndex',
          },
        },
        {
          text: `${this.event.title}`,
        },
      ])
    })
  },
  methods: {
    async fetchPractice() {
      try {
        this.loading = true
        let arr = []
        for (const key in this.filterTags) {
          arr = [...arr, ...this.filterTags[key]]
        }
        const queryParams = {}
        this.selectedFilterTags.forEach((el) => {
          queryParams[el] = true
        })
        const { data } = await this.$axios.get(
          `my-exercises/events/${this.event_id}`,
          {
            params: queryParams,
          }
        )
        this.event = data
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
        this.pageLoading = false
      }
    },
  },
}
</script>

<style lang="scss">
.v-window {
  overflow: unset;
}
.exercise-practice {
  &__title {
    margin-top: 12px;
    font-size: 22px;
    font-weight: 700;
    line-height: 32px;
    color: #171729;
  }
  &__deadline-wrapper {
    margin-top: 16px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  &__deadline-text {
    margin-bottom: 0 !important;
    font-size: 15px;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.01em;
  }
  &__content-wrapper {
    margin: 32px 0 80px;
    display: flex;
    gap: 20px;
  }
  &__content {
    display: grid;
    gap: 16px;
  }
}
.filter-body__wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}
.filter-body__title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}
.filter-body__line {
  display: block;
  border: none;
  border-top: 1px solid #dbdfea;
  margin: 20px 0 24px;
}
.exercise-practice__filter-not-found {
  padding: 56px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #f9fafb;
  border-radius: 10px;
  margin-top: 62px;
}
.exercise-practice-filter__text {
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0.01em;
  color: #383d57;
}
.exercise-practice-filter__subtext {
  margin-top: 14px;
  font-size: 14px;
  line-height: 24px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #5e6a82;
}
</style>
