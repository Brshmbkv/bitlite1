<template>
  <widgets-container>
    <v-calendar
      v-if="!loading"
      type="week"
      ref="calendar"
      color="#F16635"
      :interval-format="intervalFormat"
      locale="RU"
      :events="events"
    >
      <template v-slot:day-label-header="{ day }">{{ day }}</template>
    </v-calendar>
  </widgets-container>
</template>

<script>
import WidgetsContainer from '@/components/Admin/widgets/container'
export default {
  name: 'TeacherCalendarWidget',
  components: {
    WidgetsContainer,
  },
  props: {
    events: Array,
    loading: Boolean,
  },
  data() {
    return {

    }
  },
  methods: {
    intervalFormat(locale) {
      return locale.time;
    }
  },
}
</script>
<style>

</style>
