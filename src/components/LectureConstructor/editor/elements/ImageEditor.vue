<template>
  <div 
    class="constructor__content"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <v-expand-transition>
      <v-row 
        no-gutters
        v-if="!value || isHovered"
        class="mb-1"
      >
        <v-col>
          <input
            type="file"
            ref="imageFileInput"
            name="avatar"
            accept="image/*"
            style="display: none"
            :disabled="loading"
            @change="handleFileInputChange($event)"
          />
          <v-btn 
            color="primary"
            :disabled="tmpUrlValue === value"
            tile
            @click="changeYoutubeUrl(tmpUrlValue)"
          >Добавить</v-btn>
        </v-col>
      </v-row>
    </v-expand-transition>
    <img 
      v-if="value"
      :src="value"
    >
    <slot name="default"/> 
  </div>
</template>

<script>
export default {
  name: 'ConstructorVideoYoutube',
  props: {
    value: String,
  },

  data(){
    return {
      isHovered: false,
      tmpUrlValue: this.value,
      urlError: undefined,
    }
  },
  
  watch: {
    value(newVal){
      this.tmpUrlValue = newVal;
    },
  },

}
</script>