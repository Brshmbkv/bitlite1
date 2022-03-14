<template>
  <div
    class="constructor__content"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <v-expand-transition>
      <v-row
        no-gutters
        v-if="(!value || isHovered || isHoveredWithin || isEditingUrl) && !show"
        class="mb-1"
      >
        <v-col>
          <v-text-field
            ref="editableTarget"
            v-model="tmpUrlValue"
            class="mr-1 elevation-0"
            dense
            hide-details="auto"
            :error-messages="urlError"
            placeholder="Вставьте ссылку YouTube ролика"
            outlined
            @focus="isEditingUrl = true"
            @blur="isEditingUrl = false"
          >
          </v-text-field>
        </v-col>
        <v-col>
          <v-btn
            color="primary"
            :disabled="tmpUrlValue === value"
            tile
            height="40"
            elevation="0"
            @click="changeYoutubeUrl(tmpUrlValue)"
          >Изменить</v-btn>
        </v-col>
      </v-row>
    </v-expand-transition>
    <v-responsive
      v-if="embedSrc"
      :aspect-ratio="16/9"
      content-class="d-flex justify-center"
    >
      <iframe
        :src="embedSrc"
        width="100%"
        frameborder="0"
        allowfullscreen
      ></iframe>
        <!-- style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        "
        :video-id="embedSrc"
        :player-width="'100%'"
        :player-height="'100%'"
        :player-vars="{
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          showinfo: 0,
          cc_load_policy: 0,
          iv_load_policy: 3,
        }" -->
    </v-responsive>
    <v-row v-else-if="value && !embedSrc">
      <v-col>
        <p>О шайтан! Это плохой ютьюб сылька</p>
      </v-col>
    </v-row>
    <slot
      name="default"
      :on="{ hoverWithin }"
    />
  </div>
</template>

<script>
import { YouTubeGetID } from '@/helpers';

export default {
  name: 'ConstructorVideoYoutube',
  props: {
    value: String,
    show: {
      type: Boolean,
      default: false
    }
  },

  data(){
    return {
      isHovered: false,
      isHoveredWithin: false,
      isEditingUrl: false,
      tmpUrlValue: this.value,
      urlError: undefined,
    }
  },
  computed: {
    embedSrc(){
      try{
        let id = YouTubeGetID(this.value)
        return id ? ('https://www.youtube.com/embed/' + id) : '';
      } catch(error){
        return false;
      }
    },
  },
  watch: {
    value(newVal){
      this.tmpUrlValue = newVal;
    }
  },
  methods: {
    changeYoutubeUrl(url){
      this.urlError = undefined;
      // check if url is valid
      let regEx = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*?[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/gi;
      let match = url.match(regEx) // && match[2].length == 11
      if (match){
        this.$emit('update:value', match[0])
      } else {
        this.urlError = "Не удалось извлечь ID видео"
      }
    },
    // triggered when AddElement is active
    hoverWithin(value){
      this.isHoveredWithin = value;
    }
  }
}
</script>
