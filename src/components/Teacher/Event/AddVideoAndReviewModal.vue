<template>
  <v-dialog
    v-model="value"
    @click:outside="closeDialog"
    width="600"
  >
    <!-- https://www.youtube.com/watch?v=nhBVL41-_Cw -->
    <v-card
      :disabled="false"
      :loading="false"
    >
      <v-card-title class="text-h6">
        Добавить видео или отзыв к уроку
      </v-card-title>
      <v-divider class="mb-4 mt-2"/>
      <v-card-text>
        <v-responsive
          class="mb-2 rounded"
          :aspect-ratio="16/9"
        >
          <youtube-embed
            v-if="videoUrlActual && YouTubeGetID(videoUrlActual)"
            style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              "
            :video-id="YouTubeGetID(videoUrlActual)"
            :player-width="'100%'"
            :player-height="'100%'"
            :player-vars="player_vars"
            :mute='true'
          />
        </v-responsive>
        <v-text-field
          v-model="videoUrlNew"
          :disabled="videoURLLoading"
          hint="URL для Youtube видео"
          label="URL видео"
          :loading="videoURLLoading"
          :name="Math.random()"
          outlined
          single-line
        >
          <template v-slot:prepend-inner>
            <v-icon class="mr-1">{{ mdiYoutube }}</v-icon>
          </template>
        </v-text-field>

        <!-- @playing="handleYtPlaying"
        @ready="handleYtReady"
        @stop="handleYtStop" -->
        <v-textarea
          v-model="eventReviewNew"
          :disabled="eventReviewLoading"
          :hint="'Не понравился студент? Плохо поняли контент? Нужно дополнить материал?'"
          label="Оставить комментарий"
          :loading="eventReviewLoading"
          :name="Math.random()"
          outlined
          single-line
        >
          <template v-slot:prepend-inner>
            <v-icon class="mr-1">{{ mdiCommentProcessingOutline }}</v-icon>
          </template>
        </v-textarea>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          autocomplete="false"
          color="secondary"
          text
          @click="closeDialog"
        >Закрыть
        </v-btn>
        <v-btn
          autocomplete="false"
          color="primary"
          outlined
          :disabled="!(videoSendable || reviewSendable)"
          @click="postVideoURLAndReview"
        >Добавить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiYoutube, mdiCommentProcessingOutline } from "@mdi/js";
import { YouTubeGetID } from '@/helpers'
export default {
  name: "AddVideoAndReviewModal",
  props: {
    eventId: Number,
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiYoutube,
      mdiCommentProcessingOutline,
      // videoUrlActual - репрезентация значения на сервере
      videoUrlActual: undefined,
      videoUrlNew: undefined,
      videoUrlPostError: undefined,
      videoURLLoading: false,
      // eventReviewActual - репрезентация значения на сервере
      eventReviewActual: undefined,
      eventReviewNew: undefined,
      eventReviewPostError: undefined,
      eventReviewLoading: false,

      player_vars: {
        autoplay: 1,
        controls: 1,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        showinfo: 0,
        cc_load_policy: 0,
        iv_load_policy: 3,
      }
    }
  },
  computed: {
    videoSendable() {
      return !!(this.videoUrlNew
        && (this.videoUrlNew !== this.videoUrlActual))
    },

    reviewSendable() {
      return !!(this.eventReviewNew
        && (this.eventReviewNew !== this.eventReviewActual))
    },
  },
  watch: {
    videoUrlActual(newValue) {
      // videoUrlActual - меняется только после смены значения на серваке
      // Меняем значение для поля ввода, например после POST нового URL
      this.videoUrlNew = newValue;
    },
    eventReviewActual(newValue) {
      this.eventReviewNew = newValue
    }
  },
  methods: {
    YouTubeGetID,
    closeDialog() {
      this.$emit('update:value', false)
    },
    async postVideoURLAndReview() {
      try {
        if(this.eventReviewNew !== this.eventReviewActual) {
          await this.postEventReview();
        }
        if(this.videoUrlNew !== this.videoUrlActual) {
          await this.postVideoURL();
        }
      } catch(err) {
        console.log(err);
      }
    },

    async postVideoURL() {
      this.videoURLLoading = true;
      try {
        await this.$axios.put(
          `teacher/events/${ this.eventId }`,
          {
            live_url: this.videoUrlNew
          }
        )
        this.videoUrlActual = this.videoUrlNew;
      } catch(err) {
        this.videoURLPostError = err;
        throw err;
      }
      this.videoURLLoading = false;
    },

    async postEventReview() {
      this.eventReviewLoading = true;
      try {
        await this.$axios.post(
          `notes`,
          {
            noteable_type: 'event',
            noteable_id: this.eventId,
            comment: this.eventReviewNew,
          }
        );
        this.eventReviewActual = this.eventReviewNew;
      } catch(err) {
        this.eventReviewPostError = err;
        throw err;
      }
      this.eventReviewLoading = false;
    },
  }
}
</script>

<style scoped>

</style>
