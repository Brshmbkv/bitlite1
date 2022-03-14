<template>
  <v-sheet 
    class="constructor__line__tools"
  >
    <v-btn
      class="ml-3"
      elevation="0" 
      small
      icon
      :disabled="disableSwapDown"
      @click="$emit('swapDown')"
    >
      <v-icon>
        {{ mdiChevronDoubleDown }}
      </v-icon>
    </v-btn>
    <v-btn
      class="ml-3"
      elevation="0" 
      small
      icon
      :disabled="disableSwapUp"
      @click="$emit('swapUp')"
    >
      <v-icon>
        {{ mdiChevronDoubleUp }}
      </v-icon>
    </v-btn>
    <v-btn
      class="mx-3"
      elevation="0" 
      small
      icon
      @click="$emit('remove')"
    >
      <v-icon>
        {{ mdiClose }}
      </v-icon>
    </v-btn>
  </v-sheet>
</template>

<script>
import {
  mdiChevronDoubleDown,
  mdiChevronDoubleUp,
  mdiClose,
} from "@mdi/js"
export default {
  name: 'EditElements',
  props: ['disableSwapUp', 'disableSwapDown'],
  data(){
    return {
      mdiChevronDoubleDown,
      mdiChevronDoubleUp,
      mdiClose,
    }
  },

}
</script>