<template>
  <div class="mb-6">
    <v-carousel
      v-model="currentId"
      :continuous='false'
      :height="'auto'"
      show-arrows-on-hover
      hide-delimiters
    >
      <v-carousel-item
        v-for="(slide, i) in videos"
        :key="i"
      >
        <div
          ref="videoContainers"
          v-html="decodeHTML(slide.content)"
        ></div>
      </v-carousel-item>
    </v-carousel>
    <v-item-group
      v-model="currentId"
      class="text-center"
      mandatory
    >
      <v-item
        v-for="n in videos.length"
        :key="`btn-${n}`"
        v-slot="{ active, toggle }"
      >
        <v-btn
          small
          :input-value="active"
          :ripple="false"
          icon
          @click="toggle"
        >
          <v-icon small>{{mdiRecord}}</v-icon>
        </v-btn>
      </v-item>
    </v-item-group>
  </div>

</template>

<script>
import VimeoPlayer from '@vimeo/player'
import { mdiRecord } from "@mdi/js"
import { decodeHTML } from "@/helpers";

export default {
  name: 'LessonVideos',
  props: {
    videos:{
      type: Array,
      default(){
        return []
      }
    },
  },
  data(){
    return {
      mdiRecord,
      currentId: 0,
      players: []
    }
  },
  watch: {
    currentId(newValue, oldValue){
      if (this.players[oldValue]) {
        this.players[oldValue].pause();
      } else {
        let iframe = this.$refs.videoContainers[oldValue]?.getElementsByTagName("iframe")?.[0];
        let player = new VimeoPlayer(iframe);
        player.pause();
        this.players[oldValue] = player;
      }
    }
  },
  methods: {
    decodeHTML
  }
}
</script>
