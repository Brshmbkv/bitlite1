<template>
  <v-dialog v-model="dialog" max-width="900" @click:outside="closeDialog">
    <div class="guidelines-tags__dialog">
      <h1 class="guidelines-tags-dialog__title">
        {{
          this.item &&
          Object.keys(this.item).length === 0 &&
          this.item.constructor === Object
            ? 'Добавление тэга'
            : 'Редактирование тэга'
        }}
      </h1>
      <form class="guidelines-tags__form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="guidelines-tags__label" for="name">Заголовок</label>
          <input
            class="guidelines-tags__input"
            v-model.trim="name"
            type="text"
            id="name"
            placeholder="Some title"
          />
        </div>
        <div class="form-group">
          <label class="guidelines-tags__label" for="color">Color</label>
          <v-color-picker
            id="color"
            v-model="color"
            hide-mode-switch
          ></v-color-picker>
        </div>
        <div class="guidelines-tags__buttons">
          <v-btn
            class="guidelines-tags__btn guidelines-tags__btn--success"
            type="submit"
            :ripple="false"
            :loading="loading"
            :disabled="!validation"
            depressed
          >
            Сохранить
          </v-btn>
          <button
            class="guidelines-tags__btn guidelines-tags__btn--cancel"
            type="button"
            @click="closeDialog"
          >
            Отменить
          </button>
        </div>
      </form>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
      required: true,
    },
    item: {
      type: Object,
    },
  },
  data() {
    return {
      name: '',
      color: '#000000',
      loading: false,
    }
  },
  computed: {
    validation() {
      return this.name.length > 0 && this.color.length > 0
    },
  },
  watch: {
    item: function() {
      if (
        this.item &&
        Object.keys(this.item).length === 0 &&
        this.item.constructor === Object
      ) {
        this.name = ''
        this.color = '#000000'
        return
      }
      this.name = this.item.name
      this.color = this.item.color
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog')
    },
    async handleSubmit() {
      try {
        this.loading = true
        if (
          this.item &&
          Object.keys(this.item).length === 0 &&
          this.item.constructor === Object
        ) {
          //created
          await this.$axios.post('admin/tags', {
            name: this.name,
            color: this.color,
          })
        } else {
          //editing
          await this.$axios.post('admin/tags', {
            id: this.item.id,
            name: this.name,
            color: this.color,
          })
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
        this.$emit('done')
        this.closeDialog()
      }
    },
  },
}
</script>

<style lang="scss">
.guidelines-tags__dialog {
  background-color: #f5f6f8;
  padding: 40px 50px;
}
.guidelines-tags-dialog__title {
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
}
.v-data-table__wrapper {
  overflow: visible;
}
.guidelines-tags__form {
  margin-top: 35px;
}
.form-group {
  display: flex;
  flex-direction: column;
  & + & {
    margin-top: 25px;
  }
}
.guidelines-tags__label {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.01em;
  color: #5a6275;
  & + * {
    margin-top: 10px;
  }
}
.guidelines-tags__input {
  outline: none;
  background-color: #fff;
  border: 1px solid #1717291f;
  border-radius: 5px;
  padding: 11px 9px;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.01em;
  color: #000000;
}

.guidelines-tags__buttons {
  display: inline-flex;
  gap: 16px;
  margin-top: 30px;
  .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
    background-color: rgba(#0bc3b8, 0.24) !important;
    color: #ffffff !important;
  }
}
.guidelines-tags__btn {
  font-size: 14px !important;
  line-height: 20px !important;
  font-weight: 500 !important;
  color: #5a6275 !important;
  outline: none !important;
  border: 1px solid #17172914 !important;
  border-radius: 5px !important;
  padding: 9px 39px !important;
  widows: unset !important;
  height: unset !important;
  text-transform: capitalize !important;
  &--success {
    color: #fff !important;
    background-color: #0bc3b8 !important;
    border: none !important;
  }
  &--cancel {
    background-color: #17172914;
  }
}
</style>
