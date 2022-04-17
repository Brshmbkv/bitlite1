<template>
  <v-container>
    <template v-if="loading">
      <v-skeleton-loader class="mt-6" type="heading"></v-skeleton-loader>
      <div class="d-flex mt-10">
        <v-skeleton-loader type="button"></v-skeleton-loader>
        <v-skeleton-loader class="ml-4" type="button"></v-skeleton-loader>
      </div>
      <v-skeleton-loader class="mt-8" type="paragraph"></v-skeleton-loader>
      <v-skeleton-loader class="mt-4" type="paragraph"></v-skeleton-loader>
      <v-skeleton-loader class="mt-4" type="paragraph"></v-skeleton-loader>
      <v-skeleton-loader class="mt-8" type="table"></v-skeleton-loader>
    </template>
    <template v-else-if="data && data.event">
      <div class="Exercise-to-check__header">
        <h1 class="Exercise-to-check__title">{{ data.event.chapter.title }}</h1>
        <div class="Exercise-to-check__deadline-wrapper">
          <v-icon size="20" color="#000000">{{ mdiClock }}</v-icon>
          <span class="Exercise-to-check__deadline-text">
            <span>До:</span>
            {{ data.event.deadline_at | deadlineFormat }}
          </span>
        </div>
      </div>
      <div class="Exercise-to-check__btns">
        <button
          class="Exercise-to-check__btn Exercise-to-check__btn--left"
          :disabled="checkPrevExercise"
          @click="clickPrev"
        >
          <span class="Exercise-to-check__btn-text">ПРЕДЫДУЩЕЕ</span>
          <span class="Exercise-to-check__icon-wrapper">
            <ChevronRight
              class="Exercise-to-check__btn-icon Exercise-to-check__chevron-left"
            />
          </span>
        </button>
        <button
          class="Exercise-to-check__btn"
          :disabled="checkNextExercise"
          @click="clickNext"
        >
          <span class="Exercise-to-check__btn-text">СЛЕДУЮЩЕЕ</span>
          <span class="Exercise-to-check__icon-wrapper">
            <ChevronRight class="Exercise-to-check__btn-icon" />
          </span>
        </button>
      </div>
      <div class="Exercise-to-check__content">
        <div class="Exercise-to-check-exercise__type">
          <v-icon color="#262940" size="24">{{
            getTypeLogo(data.type.code)
          }}</v-icon>
        </div>
        <div>
          <div
            ref="raws"
            class="Exercise-to-check-exercise__text-wrapper"
            :style="{ '-webkit-line-clamp': showMore ? 'unset' : '' }"
            v-html="contentWithHeading"
          ></div>
          <button
            class="Exercise-to-check__show-btn"
            @click="showMore = !showMore"
          >
            {{ showMore ? 'Скрыть' : 'Ещё' }}
          </button>
        </div>
      </div>
      <div class="Exercise-to-check__table-wrapper">
        <table class="Exercise-to-check__table">
          <thead>
            <tr>
              <th
                class="Exercise-to-check-table__heading Exercise-to-check-table__heading--id"
              >
                #
              </th>
              <th
                class="Exercise-to-check-table__heading Exercise-to-check-table__heading--name"
              >
                Студент
              </th>
              <th
                class="Exercise-to-check-table__heading Exercise-to-check-table__heading--deadline"
              >
                Дата Сдачи
              </th>
              <th
                scope="col"
                class="Exercise-to-check-table__heading Exercise-to-check-table__heading--action"
              ></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="data.exercise.results.length !== 0">
              <tr
                class="Exercise-to-check-table__data-row"
                v-for="(item, i) in data.exercise.results"
                :key="item.id"
              >
                <td
                  class="Exercise-to-check-table__data Exercise-to-check-table__data--id"
                >
                  <span>#{{ i + 1 }}</span>
                </td>
                <td
                  class="Exercise-to-check-table__data Exercise-to-check-table__data--name"
                >
                  <img
                    class="Exercise-to-check__data-avatar"
                    :src="getUserImage(item.user)"
                  />
                  <span>{{ getUserFullname(item.user) }}</span>
                </td>
                <td
                  class="Exercise-to-check-table__data Exercise-to-check-table__data--deadline"
                >
                  <span>{{ item.created_at | deadlineFormat }}</span>
                </td>
                <td
                  class="Exercise-to-check-table__data Exercise-to-check-table__data--button"
                >
                  <button
                    class="Exercise-to-check-table-data__btn"
                    style="background-color: #4376FB"
                    @click="
                      showModal = !showModal
                      userData = {
                        fullName: `${getUserFullname(item.user)}`,
                        code: item.value,
                        comment: item.comment,
                        description: decodedText,
                        courseId: data.event.course_id,
                        overdue: item.overdue,
                        score: item.score,
                        id: item.id,
                        user_id: item.user_id,
                        exercise_id: item.exercise_id,
                      }
                    "
                  >
                    оценить решение
                  </button>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr class="Exercise-to-check-table__data-row">
                <td colspan="4">
                  <div
                    style="padding: 18px 0; display: grid; place-content: center;"
                  >
                    Нету задач для проверок
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>
    <ShowExerciseModal
      v-if="data && data.event"
      :value="showModal"
      :data="userData"
      :course-id="data.event.course_id"
      @clickOutside="showModal = false"
      @save="saveUserResults"
    />
  </v-container>
</template>

<script>
import ShowExerciseModal from '@/components/Teacher/Exercises/ShowExerciseModal.vue'
import ChevronRight from '@/assets/svg/chevron-right.svg'
import { mdiClock, mdiStarCircle, mdiHome, mdiClipboardText } from '@mdi/js'
import { decodeHTML } from '@/helpers'

export default {
  name: 'GroupExercise',
  components: {
    ChevronRight,
    ShowExerciseModal,
  },
  props: ['exercise_id', 'event_id'],
  data() {
    return {
      mdiClipboardText,
      mdiStarCircle,
      mdiHome,
      mdiClock,
      data: {},
      userData: {},
      loading: false,
      showMore: false,
      showModal: false,
    }
  },
  computed: {
    checkPrevExercise() {
      return !this.data.prev_exercise_id || this.loading
    },
    checkNextExercise() {
      return !this.data.next_exercise_id || this.loading
    },
    decodedText() {
      return decodeHTML(this.data.exercise.content)
    },
    contentWithHeading() {
      return decodeHTML(
        `<h1 class="Exercise-to-check-exercise__title">${this.data.exercise.title}</h1>` +
          this.data.exercise.content
      )
    },
  },
  mounted() {
    this.fetchExercises().then(() => {
      this.setBreadcrumbs()
    })
  },
  methods: {
    setBreadcrumbs() {
      this.$store.dispatch('breadcrumbs/setLinks', [
        {
          text: 'Задания на проверку',
          to: {
            name: 'TeacherExercisesIndex',
          },
        },
        {
          text: this.data.exercise.title,
        },
      ])
    },
    async fetchExercises() {
      try {
        this.loading = true
        const { data } = await this.$axios.get(
          `teacher/check/events/${this.event_id}/exercises/${this.exercise_id}`
        )
        this.data = data
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    async fetchExercise(id) {
      try {
        this.loading = true
        const { data } = await this.$axios.get(
          `teacher/check/events/${this.event_id}/exercises/${id}`
        )
        this.data = data
        this.setBreadcrumbs()
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    clickPrev() {
      if (!this.data.prev_exercise_id) return
      this.fetchExercise(this.data.prev_exercise_id)
    },
    clickNext() {
      if (!this.data.next_exercise_id) return
      this.fetchExercise(this.data.next_exercise_id)
    },
    decodeHTML,
    getUserFullname(user) {
      return `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
    },
    getUserImage(user) {
      return user.avatar ?? require('@/assets/user_placeholder_sm.png')
    },
    getTypeLogo(type) {
      return {
        2: this.mdiClipboardText,
        3: this.mdiHome,
        5: this.mdiStarCircle,
      }[type]
    },
    async saveUserResults(dataObj) {
      await this.$axios.post('teacher/save-score', {
        ...dataObj,
        event_id: this.data.event.id,
      })
      await this.fetchExercises()
    },
  },
}
</script>

<style lang="scss">
.Exercise-to-check {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
    margin-top: 12px;
  }
  &__title {
    font-size: 22px;
    font-weight: 700;
    line-height: 32px;
    color: #171729;
  }
  &__deadline-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  &__deadline-text {
    color: #171729;
    font-size: 15px;
    line-height: 24px;
    letter-spacing: 0.01em;
    font-weight: 500;
    span:nth-child(1) {
      font-weight: 600;
    }
  }
  &__btns {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px 40px;
    margin-top: 40px;
  }
  &__btn {
    display: inline-flex;
    align-items: center;
    background-color: #f0f2f6;
    color: #697382;
    font-size: 14px;
    line-height: 16px;
    font-weight: 600;
    padding: 8px 2px 8px 10px;
    border-radius: 7px;
    gap: 4px;
    transition: background-color 0.3s ease;
    &--left {
      flex-direction: row-reverse;
      padding: 8px 10px 8px 2px;
    }
    &:disabled {
      background-color: #f5f6f8;
      color: #bcc1c9;
      cursor: not-allowed;
    }
  }
  &__icon-wrapper {
    display: grid;
    width: 24px;
    height: 24px;
    place-content: center;
  }
  &__btn-icon {
    width: 8px;
    height: 14px;
  }
  &__chevron-left {
    transform: rotate(180deg);
  }
  &__content {
    display: flex;
    gap: 24px;
    padding: 24px 0;
    border-top: 1px solid #dbdfea;
    border-bottom: 1px solid #dbdfea;
    margin-top: 40px;
  }
  &-exercise__type {
    display: grid;
    place-content: center;
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #f0f2f6;
  }
  &-exercise__title {
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    color: #171729;
    margin-bottom: 18px;
  }
  &__table-wrapper {
    margin: 40px 0 80px;
    overflow-x: auto;
  }
  &__table {
    min-width: 100%;
    table-layout: auto;
    border-collapse: collapse;
    border-radius: 7px 7px 0 0;
    overflow: hidden;
    thead {
      background-color: #f5f6f8;
    }
  }
  &-table__heading {
    padding: 21px 0 20px;
    text-align: left;
    font-size: 15px;
    line-height: 16px;
    font-weight: 600;
    color: #383d57;
  }
  &-table__data {
    padding: 18px 0;
    text-align: left;
    font-size: 15px;
    line-height: 16px;
    font-weight: 500;
    white-space: nowrap;
    color: #171729;
  }
  &-table__heading,
  &-table__data {
    &--id {
      padding-left: 16px;
      padding-right: 32px;
    }
    &--name {
      padding-left: 32px;
      padding-right: 32px;
    }
    &--deadline {
      padding-left: 100px;
      padding-right: 30px;
    }
    &--action {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
  &-table-data__btn {
    font-size: 15px;
    line-height: 20px;
    letter-spacing: 0.01em;
    font-weight: 600;
    text-transform: lowercase;
    padding: 8px 10px;
    background-color: #0bc3b8;
    color: #ffffff;
    border-radius: 7px;
  }
  &-table__data--button {
    text-align: right;
    padding-left: 16px;
    padding-right: 16px;
  }
  &__data-avatar {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 9px;
    object-fit: cover;
  }
  &-table__data-row {
    border-bottom: 1px solid #dbdfea;
  }
  &-exercise__text-wrapper {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8;
  }
  &__show-btn {
    margin-top: 14px;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: #5a6275;
  }
}
.MsoTableGrid {
  width: 100% !important;
}
</style>
