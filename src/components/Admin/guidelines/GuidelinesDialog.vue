<template>
  <v-dialog v-model="dialog" max-width="1025" @click:outside="closeDialog">
    <div class="guidelines-dialog">
      <h1 class="guidelines-dialog__title">
        {{
          this.item &&
          Object.keys(this.item).length === 0 &&
          this.item.constructor === Object
            ? 'Добавление статьи'
            : 'Редактирование статьи'
        }}
      </h1>
      <form class="guidelines-dialog__form" @submit.prevent="handleSubmit">
        <div class="guidelines-dialog__form-group">
          <label class="guidelines-dialog__label" for="title">Заголовок</label>
          <input
            class="guidelines-dialog__input"
            v-model.trim="title"
            id="title"
            type="text"
          />
        </div>
        <div class="guidelines-dialog__form-group">
          <label class="guidelines-dialog__label" for="tags">Тип</label>
          <div class="guidelines-dialog__tags">
            <template v-for="tag in tags">
              <input
                class="guidelines-dialog-tag__checkbox"
                :id="tag.id"
                type="checkbox"
                :key="tag.id"
                :value="tag.id"
                v-model.trim="selectedTags"
              />
              <label
                class="guidelines-dialog__tag"
                :for="tag.id"
                :key="tag.name"
                >{{ tag.name }}</label
              >
            </template>
          </div>
        </div>
        <div class="guidelines-dialog__form-group">
          <label class="guidelines-dialog__label" for="content">Материал</label>
          <!-- <textarea
            class="guidelines-dialog__content"
            id="content"
            v-model.trim="content"
          ></textarea> -->
          <Editor
            v-model.trim="content"
            api-key="pl2i3ekropfwur5dmu7c009lhqtj15mqmr7zmiiu97tbpw9p"
            :init="{
              menubar: false,
              plugins: ['lists image paste wordcount'],
              toolbar:
                'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
            }"
          />
        </div>
        <div class="guidelines-dialog__buttons">
          <v-btn
            class="guidelines-dialog__btn guidelines-dialog__btn--success"
            type="submit"
            :disabled="!validation"
            :loading="loading"
            :ripple="false"
            depressed
          >
            Сохранить
          </v-btn>
          <button
            class="guidelines-dialog__btn guidelines-dialog__btn--cancel"
            @click.prevent="closeDialog"
            type="button"
          >
            Отменить
          </button>
        </div>
      </form>
    </div>
  </v-dialog>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
export default {
  components: {
    Editor,
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
      default: false,
    },
    item: {
      type: Object,
      required: false,
    },
    tags: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      title: '',
      content: '',
      selectedTags: [],
      loading: false,
    }
  },
  computed: {
    validation() {
      return (
        this.content.length > 0 &&
        this.title.length > 0 &&
        this.selectedTags.length > 0
      )
    },
  },
  watch: {
    item: function() {
      if (
        this.item &&
        Object.keys(this.item).length === 0 &&
        this.item.constructor === Object
      ) {
        this.title = ''
        this.content = ''
        this.selectedTags = []
        return
      }
      this.selectedTags = []
      this.title = this.item.title
      this.content = this.item.content
      this.item.tags.forEach((el) => {
        this.selectedTags.push(el.id)
      })
    },
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        if (
          this.item &&
          Object.keys(this.item).length === 0 &&
          this.item.constructor === Object
        ) {
          //create
          await this.$axios.post('admin/faqs', {
            title: this.title,
            content: this.content,
            tag_ids: this.selectedTags,
          })
          return
        }
        //editing
        await this.$axios.post('admin/faqs', {
          id: this.item.id,
          title: this.title,
          content: this.content,
          tag_ids: this.selectedTags,
        })
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
        this.$emit('done')
        this.closeDialog()
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
  },
}
</script>

<style lang="scss">
.guidelines-dialog {
  padding: 40px 75px 40px 50px;
  background-color: #f5f6f8;
  border-radius: 10px;
  &__title {
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
  }
  &__form {
    margin-top: 35px;
  }
  &__form-group + &__form-group {
    margin-top: 25px;
  }
  &__label {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0.01em;
    color: #5a6275;
    & ~ * {
      margin-top: 10px !important;
      padding: 0;
    }
  }
  &__input {
    width: 100%;
    background-color: #fff;
    padding: 12px 10px;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.01em;
    border: 1px solid rgba(#171729, 0.12);
    border-radius: 5px;
    outline: none;
  }
  &__tags {
    margin-top: 16px !important;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  &-tag__checkbox {
    display: none;
    &:checked + .guidelines-dialog__tag {
      padding-top: 5px;
      padding-bottom: 5px;
      border: 2px solid;
      border-color: #3e77ff;
      color: #3e77ff;
    }
  }
  &__tag {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    max-width: 240px;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    color: #5a6275;
    background-color: #fff;
    padding: 6px 21.5px;
    border: 1px solid rgba(#171729, 0.12);
    border-radius: 9999px;
    user-select: none;
    cursor: pointer;
    transition: border-color 0.3s ease, color 0.3s ease;
  }
  &__form-group .v-input__slot::before {
    content: unset;
  }
  &__content {
    display: block;
    width: 100%;
    outline: none;
    border: 1px solid rgba(#171729, 0.12);
    border-radius: 5px;
    background-color: #ffffff;
    padding: 14px 16px;
    min-height: 200px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.02em;
    transition: border-color 0.3s ease;
    &:focus {
      border-color: #0bc3b8;
    }
  }
  &__buttons {
    margin-top: 30px;
    display: flex;
    gap: 18px;
    .theme--light.v-btn.v-btn--disabled.v-btn--has-bg {
      background-color: rgba(#0bc3b8, 0.24) !important;
      color: #ffffff !important;
    }
  }
  &__btn {
    height: unset !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    line-height: 20px !important;
    padding: 10px 37.5px !important;
    border-radius: 5px !important;
    transition: background-color 0.3s ease;
    text-transform: capitalize;
    letter-spacing: normal;
    &--success {
      background-color: #0bc3b8 !important;
      color: #ffffff !important;
    }
    &--cancel {
      background-color: #17172914;
      border: 1px solid #17172914;
      color: #5a6275;
    }
  }
}
</style>
