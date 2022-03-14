<template>
  <div
    class="constructor__content"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <v-expand-transition>
      <div v-if="(isHovered || isHoveredWithin || isEditingUrl) && value && value.length && !show">
        <p class="text-h6 font-weight-medium mb-1">Добавленные видеоматериалы: </p>
        <ul class="mb-1">
          <li
            v-for="(video, k) in value"
            :key="k"
          >
            {{ video }}
            <v-btn
              icon
              small
              :ripple="false"
              @click="removeVideoByIndex(k)"
            >
              <v-icon
                small
              >{{ mdiClose }}</v-icon>
            </v-btn>
          </li>
        </ul>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <v-row
        no-gutters
        v-if="(!value || !value.length || isHovered || isHoveredWithin || isEditingUrl) && !show"
        class="mb-1"
      >
        <v-col>
          <v-text-field
            v-model="newVideo"
            ref="editableTarget"
            class="mr-1"
            dense
            hide-details="auto"
            placeholder="Вставьте ссылку ролика Vimeo"
            outlined
            @focus="isEditingUrl = true"
            @blur="isEditingUrl = false"
          >
          </v-text-field>
        </v-col>
        <v-col>
          <v-btn
            color="primary"
            :disabled="!newVideo || value.includes(newVideo.trim())"
            tile
            elevation="0"
            :ripple="false"
            height="40"
            @click="addNewVideo"
          >Добавить</v-btn>
        </v-col>
      </v-row>
    </v-expand-transition>
    <VimeoVideoCarousel
      v-if="value && value.length"
      :key="$vnode.key"
      :value="value"
    />
    <slot
      name="default"
      :on="{ hoverWithin }"
    />
  </div>
</template>

<script>
import VimeoVideoCarousel from "@/components/LectureConstructor/partials/VimeoVideoCarousel.vue"
import { mdiClose } from "@mdi/js"

export default {
  name: 'ConstructorVideoVimeo',
  components: {
    VimeoVideoCarousel,
  },
  props: {
    value : {
      type: [Array],
      default(){
        return []
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      newVideo: undefined,
      isHovered: false,
      isHoveredWithin: false,
      isEditingUrl: false,
      mdiClose
    }
  },
  methods: {
    removeVideoByIndex(index){
      this.$emit('update:value', this.value.filter((val, i) => i !== index));
    },

    addNewVideo(){
      let embedURL = this.newVideo.replace('vimeo.com/', 'player.vimeo.com/video/')
      this.$emit('update:value', [ ...this.value, embedURL]);
      this.newVideo = ''
    },
    // triggered when AddElement is active
    hoverWithin(value){
      this.isHoveredWithin = value;
    }
  }
}
</script>

<style>

</style>
