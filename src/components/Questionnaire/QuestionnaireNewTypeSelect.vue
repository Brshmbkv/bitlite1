<template>
  <div class="align-self-stretch">
    <v-item-group
      active-class="questionnaire-question__option--active"
      v-model="selected"
    >
      <div class="questionnaire-question__options">
        <div
          v-for="opt in options"
          :key="opt.id"
          class="flex-grow-1"
          @click="setValue(opt.id)"
        >
          <v-item v-slot="{ active, toggle }" :value="opt.id">
            <div
              class="questionnaire-question__option questionnaire-question__option__type-select"
              @click="toggle"
            >
              <component :is="getIcon(opt.svg || 'other')" :level="3"/>
              <span>{{ opt.answer }}</span>
            </div>
          </v-item>
        </div>
      </div>
    </v-item-group>
    <v-textarea
      placeholder="Введите Ваш ответ..."
      :disabled="!show_textarea"
      outlined
      dense
      hide-details
      height="100"
      class="flex-grow-0 questionnaire-question__option__textarea"
      :style="{
        opacity: !show_textarea ? 0 : 1
      }"
      @input="$emit('update:value', $event)"
    />
  </div>
</template>

<script>
const GroupsIcon = () => import('@/assets/svg/questionnaire/groups.svg')
const ConnectIcon = () => import('@/assets/svg/questionnaire/connect_without_contact.svg')
const SiteIcon = () => import('@/assets/svg/questionnaire/travel explore.svg')
const OtherIcon = () => import('@/assets/svg/questionnaire/category.svg')
export default {
  name: "QuestionnaireNewTypeSelect",
  props: {
    options: Array,
    value: [String, Number],
    answer_id: [Number, String]
  },
  data() {
    return {
      selected: undefined,
      show_textarea: false
    }
  },
  methods: {
    getIcon(name) {
      return {
        'social-media': GroupsIcon,
        'friend': ConnectIcon,
        'site': SiteIcon,
        'other': OtherIcon,
      }[name]
    },

    setValue(id) {
      let opt = this.options.find(o => o.id === id)
      if(opt.answer === 'Другое') {
        this.$emit('update:answer_id', undefined)
        this.show_textarea = !this.show_textarea
      } else {
        this.$emit('update:answer_id', this.selected)
        this.show_textarea = false
      }
    }
  }
}
</script>

<style lang="scss">
.questionnaire-question__option__type-select {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.questionnaire-question__option__textarea {
  transition: all 0.3s;
}
</style>
