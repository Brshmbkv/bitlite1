<template>
  <div
    class="constructor__content constructor__content--editor"
  >
    <div
      v-if="state==='default'"
      ref="editableTarget"
      @focus="!show && changeEditorState('edit')"
      @click="!show && changeEditorState('edit')"
      v-html="!!value ? value : 'Пустое поле...'"
    >
    </div>
    <TinyEditor
      v-if="state === 'edit'"
      ref="tinymce"
      @onBlur="changeEditorState('default')"
      api-key="pl2i3ekropfwur5dmu7c009lhqtj15mqmr7zmiiu97tbpw9p"
      inline
      :value="value"
      @input="$emit('update:value', $event)"
      @keyDown.tab.prevent=""
      :init="{
        height: 500,
        menubar: false,
        indentation: '20pt',
        indent_use_margin: true,
        plugins: [
          'paste lists link preview anchor searchreplace visualblocks fullscreen code image',
        ],
        toolbar:
          'formatselect | bold italic underline | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist | code | image',
        /* plugins setup */
        paste_block_drop: false,
        paste_data_images: false,
        paste_as_text: true,
       }"
    />
    <slot name="default"/>
  </div>
</template>

<script>
import TinyEditor from '@tinymce/tinymce-vue';
export default {
  name: "BitEditorText",
  components: {
    TinyEditor,
  },
  props: {
    value: {
      type: String,
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data(){
    return {
      state: 'default',
      editableContent: this.value,
      showTextTools: false,
    }
  },

  // watch: {
  //   state(newValue){
  //     if (newValue){

  //     }
  //   },
  // },

  methods: {

    async changeEditorState(state){
      this.state = state;
      await this.$nextTick();
      if (state === 'edit'){
        console.log(this.$refs?.tinymce)
      }
    },

    handleEnterKey(event){
      this.$emit('newLine');
      event.target.blur();
    },

    handlePaste(e){
      console.log(e);
      e.preventDefault();
      let text = '';
      if (e.clipboardData && e.clipboardData.getData) {
        text = e.clipboardData.getData("text/plain");
        console.log(text)
      } else if (window.clipboardData && window.clipboardData.getData) {
        text = window.clipboardData.getData("Text");
      }
      document.execCommand("insertHTML", false, text);
    },

    resetEditorState(){

    }
  },

}
</script>

<style lang="scss">
.constructor__content{
  .content__text-container{
    padding: 4px 8px;
    &:empty:not(:focus):before{
      content: 'Введите текст';
      color:grey;
      font-style:italic;
    }
  }
  .content__text--bold{
    font-weight: 600;
  }
  .content__text--code{
    background: rgba(135,131,120,0.15);
    color: #EB5757;
    border-radius: 3px;
  }
  .content__text--italic{
    font-style: italic;
  }
  .content__text--line-through{
    text-decoration: line-through;
  }
  .content__text--underline{
    text-decoration: underline;
  }

  &.constructor__content--editor{
    .constructor__text-tools {
      position: absolute;
      top: 0;
      right: -70px;
      background-color: #FFFFFF;
      border-radius: 7px;
      border: 1px solid rgba(23, 23, 41, 0.08);
      transition: top 0.4s ease;

      .constructor__text-tools__elements {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0;

        li {
          list-style: none;
          text-align: center;
          font-size: 18px;
          width: 100%;
          cursor: pointer;
          border-bottom: 1px solid rgba(23, 23, 41, 0.08);

          button {
            padding: 6px 8px;
          }

          &:hover {
            background-color: rgba(23, 23, 41, 0.08);
          }

          &:first-child {
            border-radius: 7px 7px 0 0;
          }

          &:last-child {
            border-bottom: none;
            border-radius: 0 0 7px 7px;
          }
        }
      }
    }
  }
}
</style>
