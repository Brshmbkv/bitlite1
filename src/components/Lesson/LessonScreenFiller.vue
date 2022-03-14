<template>
  <v-img 
    src="@/assets/lesson_cover.png"
  >
    <v-overlay absolute>
      <div 
        v-if="date"
        class="absolute text-center" 
        style="cursor: default;"
      >
        <span class="text-h6 d-block" style="font-weight: 600">Урок начнется —</span>
        <span class="text-h4 d-block" style="font-weight: 600">{{ date }}</span>
      </div>
    </v-overlay>

  </v-img>
</template>

<script>
export default {
  name: "ScreenFiller",
  props: ['date'],
}
</script>