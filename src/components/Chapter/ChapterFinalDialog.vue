<template>
  <div>
    <v-dialog
      v-model="dialog"
      width="500"
      persistent
    >
      <v-card
        class="pa-6 text-center"
      >
        <div
          class="chapter-finished--circle d-flex align-center justify-center mx-auto mb-4"
        >
          <CheckIcon/>
        </div>
        <p class="font-weight-bold" style="font-size: 24px; color: #171729">Поздравляем!</p>
        <v-card-actions
          class="d-flex justify-center"
        >
          <v-btn
            :elevation="0"
            :ripple="false"
            :color="'#0BC3B8'"
            class="text-capitalize"
            style="color: white"
            @click="closeDialog()"
          >
            Окей
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CheckIcon from '@/assets/svg/check.svg'

export default {
  name: "ChapterFinalDialog",
  components: {
    CheckIcon,
  },
  props: {
    dialog: Boolean,
    to: Object,
  },
  methods: {
    closeDialog() {
      this.$emit('close-dialog')
      if(this.to) {
        this.$router.push(this.to.path)
      }
    }
  }
}
</script>

<style lang="scss">
.chapter-finished--circle {
  width: 100px;
  height: 100px;
  background-color: #5cc689;
  border-radius: 100% !important;
  border: 5px solid #00C667
}
</style>
