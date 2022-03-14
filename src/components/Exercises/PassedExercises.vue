<template>
  <v-item-group style="margin-bottom: 80px;" v-model="selected" multiple>
    <v-item
      v-for="course in passedCourses"
      :key="course.id"
      v-slot="{ active, toggle }"
    >
      <div class="passed-exercise__item">
        <div class="passed-exercise__block" :class="{ 'hide-shadow': active }">
          <div class="passed-exercise__left">
            <div class="passed-exercise__icon-wrapper">
              <component class="passed-exercise__icon" :is="logo[course.id]" />
            </div>
            <h3 class="passed-exercise__title">{{ course.title }}</h3>
          </div>
          <button
            class="passed-exercise__btn"
            type="button"
            @click="toggle()"
            @click.once="loadEvents(course.id)"
          >
            {{ active ? 'Скрыть' : 'Показать' }}
          </button>
        </div>
        <v-expand-transition>
          <div v-if="active && loadingObj[course.id] !== undefined">
            <ExerciseCardSlider show-arrows>
              <ExerciseCard
                v-for="event in data[course.id].events"
                :key="event.id"
                :event="event"
              ></ExerciseCard>
            </ExerciseCardSlider>
          </div>
          <div v-else-if="active">
            <v-row class="ma-0">
              <v-col v-for="i in 3" :key="i">
                <v-skeleton-loader type="card"></v-skeleton-loader>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </div>
    </v-item>
  </v-item-group>
</template>

<script>
import ExerciseCard from '@/components/Exercises/ExerciseCard.vue'
import ExerciseCardSlider from '@/components/Exercises/ExerciseCardSlider.vue'
export default {
  components: {
    ExerciseCard,
    ExerciseCardSlider,
  },
  props: ['passedCourses'],
  data() {
    return {
      selected: [],
      data: {},
      loadingObj: {},
    }
  },
  computed: {
    logo() {
      return {
        4: require('@/assets/svg/catalog_python.svg'),
        2: require('@/assets/svg/catalog_java.svg'),
        7: require('@/assets/svg/catalog_java.svg'),
        3: require('@/assets/svg/catalog_cpp.svg'),
        6: require('@/assets/svg/catalog_php.svg'),
        8: require('@/assets/svg/catalog_ios.svg'),
      }
    },
  },
  methods: {
    async loadEvents(id) {
      try {
        const { data } = await this.$axios.get(
          `my-exercises/courses/${id}/events`
        )
        this.$set(this.data, id, data)
        this.$set(this.loadingObj, id, false)
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>

<style lang="scss">
.passed-exercise {
  &__block {
    padding: 28px 32px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
  }
  &__left {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  &__title {
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    color: #171729;
    word-break: keep-all;
  }
  &__icon-wrapper {
    width: 40px;
    height: 40px;
    background-color: #171729;
    border-radius: 50%;
    display: grid;
    place-content: center;
    flex-shrink: 0;
  }
  &__icon {
    width: 24px;
    height: 24px;
  }
  &__btn {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    color: #0bc3b8;
    padding: 10px 12px;
    text-transform: uppercase;
    transition: background-color 0.3s ease;
    border-radius: 5px;

    &:hover {
      background-color: #d8f5f3;
    }
  }
}
.passed-exercise__item + .passed-exercise__item {
  margin-top: 16px;
}
.hide-shadow {
  box-shadow: none;
  margin-bottom: 32px;
}
</style>
