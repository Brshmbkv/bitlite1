<template>
  <div class="my-4">
    <div class="d-flex align-center justify-space-between flex-wrap" style="gap: 15px">
      <span>Текущий урок: {{ currentLesson }}</span>
      <div class="d-flex flex-wrap align-center" style="gap: 15px">
        <v-chip
          :text-color="'#F16635'"
          :color="'rgba(241, 102, 53, 0.12)'"
        >
          Ближайший старт: {{ startDate || 'Скоро' }}
        </v-chip>
        <v-btn
          class="primary text-none"
          :ripple="false"
          elevation="0"
          @click="$emit('to-full-course')"
        >
          Записаться на полный курс
        </v-btn>
      </div>
    </div>
    <div class="d-flex justify-space-between align-center mt-8" style="gap: 15px">
      <v-progress-linear
        v-for="chapter in chapters"
        :key="chapter.id"
        :value="chapter.score || 0"
        background-color="rgba(23, 23, 41, 0.08)"
        rounded
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ChaptersProgress",
  props: {
    startDate: String,
    chapters: Array
  },
  computed: {
    currentLesson() {
      return this.chapters.find(chapter => !chapter.next_available)?.title
    }
  }
}
</script>

<style scoped>

</style>
