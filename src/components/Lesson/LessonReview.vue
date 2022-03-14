<template>
  <div class="lesson-review">
    <div class="lesson-review__header">
      <span class="lesson-review__header--text">
        Как прошел урок?<br> Оставьте свой отзыв, чтобы мы могли улучшить его:)
      </span>
      <span class="lesson-review__header--close" @click="$emit('close-dialog')">
        &times;
      </span>
    </div>
    <v-divider/>
    <div class="lesson-review__form">
      <span class="lesson-review__form--label">Общая оценка за урок</span>
      <v-item-group
        v-model="score"
        active-class="lesson-review__form--score__item--active"
      >
        <div class="lesson-review__form--score">
          <div
            class="lesson-review__form--score__item"
            v-for="n in 6"
            :key="n"
          >
            <v-item v-slot="{ active, toggle }">
              <v-card
                class="d-flex align-center justify-center lesson-review__form--score__btn font-weight-bold"
                height="40"
                tile
                @click="toggle"
                :ripple="false"
                elevation="0"
              >
                {{ n - 1 }}
              </v-card>
            </v-item>
          </div>
        </div>
      </v-item-group>
      <span class="lesson-review__form--label" style="margin-top: 24px;">Комментарий к уроку</span>
      <v-textarea
        v-model="text"
        outlined
        class="lesson-review__form__textarea"
      >
      </v-textarea>
      <v-btn
        block
        class="lesson-review__form__btn"
        elevation="0"
        :ripple="false"
        large
        :disabled="!(score >= 0) || !text"
        :loading="loading"
        @click="sendReview"
      >
        Отправить
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "LessonReview",
  props: {
    event_id: Number,
    noteable_type: String,
  },
  data() {
    return {
      score: undefined,
      text: undefined,
      loading: false
    }
  },
  methods: {
    async sendReview() {
      this.loading = true
      await this.$axios.post(`notes`, {
        score: this.score,
        comment: this.text,
        noteable_id: this.event_id,
        noteable_type: this.noteable_type
      }).then(res => {
        if(res && res.data) {
          // console.log(res.data)
          this.$emit('close-dialog')
          this.$store.dispatch('snackbar/START_SNACKBAR', {
            text: 'Благодарим Вас за оставленный отзыв!',
            color: 'success'
          })
        }
      }).catch(e => {
        console.log(e)
        this.$store.dispatch('snackbar/START_SNACKBAR', {
          text: 'Произошла ошибка!',
          color: 'error'
        })
      }).finally(() => {
        this.loading = false
        this.score = undefined
        this.text = undefined
      })
    }
  }
}
</script>

<style lang="scss">
.lesson-review {
  background: #FFFFFF;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 356px;
  z-index: 10;

  .lesson-review__header {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;

    .lesson-review__header--text {
      font-weight: 700;
      font-size: 18px;
      line-height: 24px;
    }

    .lesson-review__header--close {
      color: #9FA4B1;
      font-size: 34px;
      line-height: 100%;
      cursor: pointer;
    }
  }

  .lesson-review__form {
    display: flex;
    flex-direction: column;
    padding: 24px;

    .lesson-review__form--label {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 12px;
    }

    .lesson-review__form__textarea:not(.v-input--is-focused, .error--text) {
      .v-input__slot {
        fieldset {
          border: 1px solid rgba(23, 23, 41, 0.15) !important;
        }
      }
    }

    .lesson-review__form__btn {
      background-color: #0ACCDA !important;
      color: #FFFFFF;
    }
  }
}
</style>
