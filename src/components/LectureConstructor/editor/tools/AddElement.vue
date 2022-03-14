<template>
  <v-sheet 
    class="constructor__line__tools"
    :class="{
      'constructor__line__tools--active': isHoveredWithin
    }"
  >
    <template v-for="(menuItem, menuItemKey) in menuItems">
      <v-menu
        v-if="menuItem.children"
        :key="menuItemKey"
        open-on-click
        bottom
        tile
        offset-y
        @input="(val) => { $emit('hoverWithin', val) }"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            elevation="0"
            small
            tile
            v-bind="attrs"
            v-on="on"
          >
            <v-icon 
              small
              tile
            >
              {{ menuItem.icon }}
            </v-icon>
          </v-btn>
        </template>
        <v-sheet 
        >
          <v-btn
            v-for="(menuChild, menuChildKey) in menuItem.children"
            :key="menuItemKey+'_'+menuChildKey"
            elevation="0" 
            small
            tile
            @click="menuChild.action"
          >
            <v-icon 
              small
              tile
            >
              {{ menuChild.icon }}
            </v-icon>
          </v-btn>
        </v-sheet>
      </v-menu>
      <v-btn
        v-else
        :key="menuItemKey"
        elevation="0" 
        small
        tile
        @click="menuItem.action"
      >
        <v-icon 
          small
          tile
        >
          {{ menuItem.icon }}
        </v-icon>
      </v-btn>
    </template>
  </v-sheet>
</template>

<script>
import {
  mdiFormatText,
  mdiCodeBracesBox,
  mdiVimeo,
  mdiYoutube,
  mdiMovieOpen,
  mdiImage
} from '@mdi/js';

export default {
  props: {
    index: {
      type: Number, 
    }
  },
  data(){
    return {
      menu: false,
      isHoveredWithin: false,
      menuItems: [
        {
          icon: mdiFormatText,
          action: () => this.$emit('add', this.index+1, 'text'),
        },
        {
          icon: mdiCodeBracesBox,
          action: () => this.$emit('add', this.index+1, 'code'),
        },
        {
          icon: mdiImage,
          action: () => this.$emit('add', this.index+1, 'image'),
        },
        {
          icon: mdiMovieOpen,
          children: [
            {
              icon: mdiYoutube,
              action: () => this.$emit('add', this.index+1, 'video_youtube'),
            },
            {
              icon: mdiVimeo,
              action: () => this.$emit('add', this.index+1, 'video_vimeo'),
            },
          ]
        }
      ]
    }
  },
  methods: {
    handleInput(){
      console.log('handled')
    }
  },
}
</script>