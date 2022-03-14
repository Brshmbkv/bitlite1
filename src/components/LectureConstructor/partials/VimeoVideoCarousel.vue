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
        v-for="(slide, i) in value"
        :key="i"
      >
        <v-responsive 
          :aspect-ratio="16/9"
        >
          <!-- <div :id="`video_${parent_key}_${i}`"></div> -->
          <iframe 
            ref="videoContainers"
            :src="slide"
            width="100%"
            height="100%" 
            frameborder="0"
          ></iframe>
        </v-responsive>
      </v-carousel-item>
    </v-carousel>
    <v-item-group
      v-if="value.length"
      v-model="currentId"
      class="text-center"
      mandatory
    >
      <v-item
        v-for="n in value.length"
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
          <v-icon small>{{ mdiRecord }}</v-icon>
        </v-btn>
      </v-item>
    </v-item-group>
  </div>
</template>

<script>
import VimeoPlayer from '@vimeo/player'
import { mdiRecord } from "@mdi/js"
import { decodeHTML } from "@/helpers";
// example videos
// https://player.vimeo.com/video/384162537
// https://player.vimeo.com/video/384479420
// https://player.vimeo.com/video/384499922
export default {
  name: 'VimeoVideoCarousel',
  props: {
    value:{
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
      parent_key: this.$vnode.key,
      players: [],
    }
  },

  watch: {
    currentId(newValue, oldValue){
      if (this.players[oldValue]) {
        this.players[oldValue].pause();
      } 
    },
    
    value: {
      handler(){
        this.$nextTick(() => {
          let iframes = this.$refs.videoContainers;
          this.players = iframes.map( node => new VimeoPlayer(node) )
        });
      },
      immediate: true,
    }
  },
  methods: {
    decodeHTML
  }
}
</script>