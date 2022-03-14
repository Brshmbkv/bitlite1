<template>
  <div @click="set_status" style="cursor: pointer">
    <v-snackbar
      v-model="state"
      top
      right
      rounded
      app
      timeout="4000"
      :text="!forAdmins"
      :color="color"
      elevation="0"
      :multi-line="forAdmins"
      class="pa-0"
    >
      <span style="white-space: pre-line;">{{ text || 'Успешно добавлен'}}</span>
      <template v-if="!forAdmins" v-slot:action="{ attrs }">
        <v-btn :color="color" text v-bind="attrs" @click="set_status">
          <v-icon light>{{ mdiClose }}</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mdiClose } from "@mdi/js";
export default {
  props: {
    forAdmins: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mdiClose,
    };
  },
  computed: {
    state: {
      get(){
        return this.$store.state.snackbar.snackbar.state
      },
      set(val) {
        this.$store.commit('snackbar/SET_SNACKBAR_STATE', val)
      }
    },
    text() {
      return this.$store.state.snackbar.snackbar.text
    },
    color() {
      return this.$store.state.snackbar.snackbar.color
    }
  },
  methods: {
    set_status() {
      this.$store.commit("snackbar/SET_SNACKBAR_STATE", false);
    },
  },

};
</script>
