<template>
  <div>
    <v-item-group
      active-class="questionnaire-question__option--active"
      :value="selected"
      @change="$emit('update:answer_id', $event)"
    >
      <div class="questionnaire-question__options">
        <div
          v-for="opt in options"
          :key="opt.id"
        >
          <v-item v-slot="{ active, toggle }" :value="opt.id">
            <div
              class="questionnaire-question__option questionnaire-question__option__type-radio"
              @click="toggle"
            >
              <component
                :is="getIcon(opt.svg || 'other')"
                :class="[`questionnaire__${opt.svg}`]"
              />
              <span class="font-weight-medium">{{ opt.answer }}</span>
            </div>
          </v-item>
        </div>
      </div>
    </v-item-group>
  </div>
</template>

<script>
const OtherIcon = () => import('@/assets/svg/questionnaire/category.svg')
const SchoolIcon = () => import('@/assets/svg/questionnaire/school.svg')
const VideoIcon = () => import('@/assets/svg/questionnaire/video.svg')
const WorkIcon = () => import('@/assets/svg/questionnaire/work.svg')
const ZeroIcon = () => import('@/assets/svg/questionnaire/zero.svg')
const LevelOneIcon = () => import('@/assets/svg/questionnaire/levels-1.svg')
const LevelTwoIcon = () => import('@/assets/svg/questionnaire/levels-2.svg')
const LevelThreeIcon = () => import('@/assets/svg/questionnaire/levels-3.svg')
export default {
  name: "QuestionnaireNewTypeRadio",
  props: {
    options: Array,
    answer_id: Number
  },
  data() {
    return {
      selected: this.answer_id
    }
  },
  methods: {
    getIcon(name) {
      return {
        'other': OtherIcon,
        'levels-1': LevelOneIcon,
        'levels-2': LevelTwoIcon,
        'levels-3': LevelThreeIcon,
        'school': SchoolIcon,
        'work': WorkIcon,
        'video': VideoIcon,
        'zero': ZeroIcon
      }[name]
    },
  }
}
</script>

<style lang="scss">
.questionnaire-question__option__type-radio {
  padding: 52px 79px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
}

@media screen and (max-width: 1180px) {
  .questionnaire-question__option__type-radio {
    gap: 24px;
  }
}
</style>
