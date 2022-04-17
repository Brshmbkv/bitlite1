<template>
  <div>
    <v-container class="pb-0">
      <template v-if="tabs_loading">
        <v-col cols="12">
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
          <v-skeleton-loader class="d-inline-block mr-3" type="button" />
        </v-col>
      </template>
      <v-row v-else-if="tabs && tabs.length > 0">
        <v-tabs color="eprimary" show-arrows>
          <v-tab
            v-for="tab in tabs"
            :key="'course_tabs_' + tab.id"
            @click="handleTabClick(tab)"
            >{{ tab.name }}</v-tab
          >
        </v-tabs>
      </v-row>
    </v-container>
    <v-container class="mt-10" style="margin-bottom: 80px;">
      <template v-if="firstTimeLoading">
        <v-skeleton-loader
          v-for="i in 12"
          :key="i"
          :class="{ 'mt-6': i !== 1 }"
          max-height="96px"
          type="image"
        ></v-skeleton-loader>
      </template>
      <v-expansion-panels v-else-if="data && data.length > 0" accordion flat>
        <v-expansion-panel class="panel" v-for="item in data" :key="item.id">
          <v-expansion-panel-header color="panel-title">
            {{ item.title }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <table style="min-width: 100%; padding-top: 16px; border-collapse: collapse">
              <thead style="">
                <tr>
                  <th style="text-align: center;padding: 10px 16px;">#</th>
                  <th style="padding: 10px 16px; text-align: left">
                    Название задания
                  </th>
                  <th style="padding: 10px 16px; text-align: left">
                    Тип задания
                  </th>
                  <th style="padding: 10px 16px; text-align:left ">
                    На проверку
                  </th>
                  <th style="padding: 10px 16px; text-align:"></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(exercise, index) in item.exercises"
                  :key="exercise.id"
                  class="panel-row"
                >
                  <td style="font-weight: 500">#{{ index + 1 }}</td>
                  <td style="font-weight: 500">{{ exercise.title }}</td>
                  <td style="font-weight: 500">{{ exercise.type.text }}</td>
                  <td style="font-weight: 500">
                    {{ exercise.students_count }}
                  </td>
                  <td>
                    <button
                    style="background-color: #4376FB; color: white; padding: 6px 12px; border-radius: 8px"
                      @click="
                        $router.push({
                          name: 'GroupExerciseShow',
                          params: {
                            event_id: item.id,
                            exercise_id: exercise.id,
                          },
                        })
                      "
                    >
                      Проверить
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <!-- <v-expansion-panels
        v-else-if="data && data.length > 0"
        class="exercises-to-check-panels"
        accordion
        flat
      >
        <v-expansion-panel
          class="exercises-to-check-panel"
          v-for="item in data"
          :key="item.id"
        >
          <v-expansion-panel-header
            class="exercises-to-check-panel-header-wrapper"
            disable-icon-rotate
          >
            <template v-slot:actions>
              <button class="exercises-to-check-panel-header__btn">
                <v-icon size="32" color="#0BC3B8">{{ mdiPlus }}</v-icon>
              </button>
            </template>
            <div class="exercises-to-check-panel-header">
              <div class="exercises-to-check-panel__header">
                <h1 class="exercises-to-check-panel-header__title">
                  {{ item.title }}
                </h1>
                <span class="exercises-to-check-panel-header__deadline-text"
                  >до {{ item.deadline_at | deadlineFormat }}</span
                >
              </div>
              <div class="exercises-to-check-panel__subheader">
                <span>
                  <FileIcon />
                  <span>{{ item.results_count }}</span>
                </span>
                <span>{{ item.exercises_count }}</span>
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="exercises-to-check__wrapper">
              <div
                class="exercises-to-check__row"
                v-for="exercise in item.exercises"
                :key="exercise.id"
              >
                <span class="exercises-to-check-row__counter"></span>
                <div>
                  <span class="exercises-to-check-row__title">
                    {{ exercise.title }}</span
                  >
                </div>
                <div
                  class="exercises-to-check-row__type"
                  :style="{
                    backgroundColor: getTypeBgColor(exercise.type.code),
                    color: getTypeTextColor(exercise.type.code),
                  }"
                >
                  <v-icon
                    size="20"
                    :color="getTypeTextColor(exercise.type.code)"
                    >{{ getTypeLogo(exercise.type.code) }}</v-icon
                  >
                  {{ exercise.type.text }}
                </div>
                <span class="exercises-to-check-row__students-count">
                  <v-icon size="20" color="#262940">{{ mdiAccount }}</v-icon>
                  {{ exercise.students_count }}</span
                >
                <button
                  class="exercises-to-check-row__btn"
                  @click="
                    $router.push({
                      name: 'GroupExerciseShow',
                      params: {
                        event_id: item.id,
                        exercise_id: exercise.id,
                      },
                    })
                  "
                >
                  проверить
                </button>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <div v-if="loadingNewData">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
      </v-expansion-panels> -->
      <div v-else class="exercises-to-check__empty">
        <div class="exercises-to-check__not-found">
          <v-icon size="120" color="#CED3E0">{{ mdiFileFind }}</v-icon>
          <div>
            <h1 class="exercises-to-check-not-found__text">
              Задачи не найдены
            </h1>
            <span class="exercises-to-check-not-found__subtext"
              >Похоже, вам нечего проверять...</span
            >
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import {
  mdiPlus,
  mdiStarCircle,
  mdiHome,
  mdiClipboardText,
  mdiAccount,
  mdiFileFind,
} from '@mdi/js'
// import FileIcon from '@/assets/svg/file.svg'

export default {
  name: 'TeacherExercisesIndex',
  components: {
    // FileIcon,
  },
  data() {
    return {
      mdiPlus,
      mdiStarCircle,
      mdiHome,
      mdiClipboardText,
      mdiAccount,
      mdiFileFind,
      tabs_loading: true,
      tabs: undefined,
      group_id: undefined,
      lessons_loading: false,
      data: [],
      firstTimeLoading: true,
      loadingNewData: false,
      current_page: 1,
      last_page: undefined,
    }
  },
  activated() {
    this.$nextTick(() => {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Задания на проверку',
        },
      ])
      if (this.group_id) {
        this.current_page = 1
        this.fetchExercises(true)
      }
    })
  },
  mounted() {
    this.fetchGroups().then(() => {
      this.fetchExercises()
    })
  },
  methods: {
    async fetchGroups() {
      try {
        this.tabs_loading = true
        this.lessons_loading = true
        const { data } = await this.$axios.get('teacher/check/groups')
        this.tabs = data
        this.group_id = data[0].id
      } catch (err) {
        console.log(err)
      } finally {
        this.tabs_loading = false
      }
    },
    async fetchExercises(loadNewData = false) {
      try {
        this.lessons_loading = true
        this.loadingNewData = true
        const {
          data: { data, meta },
        } = await this.$axios.get(
          `teacher/check/groups/${this.group_id}/events`,
          {
            params: {
              paginate: 8,
              page: this.current_page,
            },
          }
        )
        if (loadNewData) this.data = data
        else this.data = [...this.data, ...data]
        this.current_page = meta.current_page
        this.last_page = meta.last_page
      } catch (err) {
        console.log(err)
      } finally {
        this.lessons_loading = false
        this.firstTimeLoading = false
        this.loadingNewData = false
        this.$nextTick(() => {
          this.initIntersection()
        })
      }
    },
    initIntersection() {
      try {
        const lastEl = document.querySelector(
          '.exercises-to-check-panel:last-child'
        )
        const observer = new IntersectionObserver(async (entries) => {
          const lastCard = entries[0]
          if (!lastCard.isIntersecting) return
          if (this.current_page < this.last_page) {
            this.current_page += 1
            await this.fetchExercises()
            observer.unobserve(lastCard.target)
            observer.observe(lastEl)
          }
        })
        if (lastEl) observer.observe(lastEl)
      } catch (err) {
        console.log(err)
      }
    },
    handleTabClick(group) {
      if (this.group_id !== group.id) {
        this.group_id = group.id
        this.firstTimeLoading = true
        this.data = []
        this.current_page = 1
        this.fetchExercises()
      }
    },
    getTypeLogo(type) {
      return {
        2: this.mdiClipboardText,
        3: this.mdiHome,
        5: this.mdiStarCircle,
      }[type]
    },
    getTypeTextColor(type) {
      return {
        2: '#208025',
        3: '#274EC4',
        5: '#956C24',
      }[type]
    },
    getTypeBgColor(type) {
      return {
        2: '#D9F7CD',
        3: '#D6E6FF',
        5: '#FFEBB9',
      }[type]
    },
  },
}
</script>

<style lang="scss" scoped>
.panel {
  margin-bottom: 4px;
  overflow: hidden;
  & + & {
    border-top: 1px solid #e4e4e4;
    margin-top: 4px;
  }
  &.v-expansion-panel--active {
    box-shadow: 0px 0px 5px rgba(23, 23, 41, 0.12);
    border-radius: 8px;
    .panel-title {
      background-color: rgba(#4376fb, 0.05);
    }
  }
  &-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
  }
  &-row {
    & > td {
      padding: 10px 16px;
    }
    & + & {
      border-top: 1px solid #e4e4e4;
    }
  }
}

.exercises-to-check-panels {
  gap: 24px;
}
.exercises-to-check-panel {
  box-shadow: 0px 0px 5px rgba(23, 23, 41, 0.12);
  border-radius: 10px !important;
  transition: box-shadow 0.3s ease;
  counter-reset: exercise;
  &.v-expansion-panel--active {
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.12);
    .exercises-to-check-panel-header__btn {
      transform: rotate(315deg);
    }
  }
  &-header-wrapper {
    padding: 16px 66px 16px 10px;
    flex-direction: row-reverse;
    gap: 16px;
    transition: background-color 0.3s ease;
    &.v-expansion-panel-header--active {
      background-color: #f5f6f8;
    }
  }
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 36px;
  }
  &-header__btn {
    display: grid;
    place-content: center;
    min-width: 40px;
    min-height: 40px;
    border-radius: 50%;
    transition-property: background-color, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    &:hover {
      background-color: #0bc3b81f;
    }
  }
  &-header__title {
    font-size: 18px;
    line-height: 24px;
    font-weight: 700;
    color: #171729;
  }
  &-header__deadline-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: #5e6a82;
  }
  &__subheader {
    margin-top: 20px;
    display: inline-flex;
    gap: 45px;
    & > span {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.01em;
      color: #383d57;
      font-weight: 500;
    }
  }
  .v-expansion-panel-content__wrap {
    padding: 8px 66px;
  }
}

.exercises-to-check {
  &__wrapper {
    overflow-x: auto;
  }
  &__row {
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 1.5fr 1.5fr 1fr;
    gap: 16px;
    padding: 14px 0;
    & > * {
      display: inline-flex;
      align-items: center;
    }
    & + & {
      border-top: 1px solid #dbdfea;
    }
  }
  &-row__counter::before {
    counter-increment: exercise;
    content: '#' counter(exercise, decimal-leading-zero);
    font-size: 15px;
    line-height: 16px;
    font-weight: 500;
    color: #171729;
  }
  &-row__title {
    font-size: 15px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #171729;
  }
  &-row__type {
    justify-self: start;
    gap: 4px;
    padding: 6px 10px;
    border-radius: 9999px;
    font-size: 14px;
    line-height: 16px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: lowercase;
  }
  &-row__students-count {
    text-transform: lowercase;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: #383d57;
  }
  &-row__btn {
    text-transform: lowercase;
    padding: 8px 10px;
    font-size: 15px;
    line-height: 20px;
    font-weight: 500;
    color: #ffffff;
    letter-spacing: 0.01em;
    background-color: #0bc3b8;
    border-radius: 7px;
    justify-self: end;
  }
}
.exercises-to-check__empty {
  background-color: #f9fafb;
  border-radius: 10px;
}
.exercises-to-check__not-found {
  max-width: 240px;
  padding: 56px 0;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.exercises-to-check-not-found__text {
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  letter-spacing: 0.01em;
  color: #5e6a82;
  margin-top: 16px;
}
.exercises-to-check-not-found__subtext {
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.01em;
  color: #5e6a82;
  display: inline-block;
  margin-top: 12px;
}
.teacher-exercises__group__tabs {
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(23, 23, 41, 0.08);
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(23, 23, 41, 0.15);
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}
</style>
