<template>
  <div class="lesson-recording flex-wrap flex-md-nowrap">
    <div class="lesson-recording__video" @click="openURL">
      <v-icon size="48" color="#FFFFFF">{{ mdiPlayCircle }}</v-icon>
    </div>
    <div class="lesson-recording__content">
      <h3 class="mb-3">Запись с урока - {{ title || 'Урок' }}</h3>
      <a :href="url" target="_blank" class="lesson-recording__content__link">
        {{ url }}
        <v-icon color="#3E77FF" size="18" class="ml-1">
          {{ mdiOpenInNew }}
        </v-icon>
      </a>
    </div>
  </div>
</template>

<script>
import { mdiOpenInNew, mdiPlayCircle } from '@mdi/js'

export default {
  name: "LessonRecording",
  props: {
    url: String,
    title: String,
  },
  data() {
    return {
      mdiPlayCircle,
      mdiOpenInNew,
    }
  },
  methods: {
    openURL() {
      if(this.url)
        window.open(this.url, "_blank")
    }
  }
}
</script>

<style lang="scss">
.lesson-recording {
  padding: 22px 16px;
  display: flex;
  gap: 22px;
  border-radius: 10px;
  border: 1px solid rgba(23, 23, 41, 0.08);
  margin-bottom: 30px;

  &__video {
    display: grid;
    place-items: center;
    border-radius: 12px;
    background-color: #171729;
    min-width: 180px;
    min-height: 100px;
    cursor: pointer;
  }

  &__content {
    display: flex;
    flex-direction: column;

    &__link {
      text-decoration: none;
      color: #3E77FF !important;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  @media screen and (max-width: 930px) {
    .lesson-recording__video {
      width: 100%;
      min-height: 200px;
    }
  }
}
</style>
