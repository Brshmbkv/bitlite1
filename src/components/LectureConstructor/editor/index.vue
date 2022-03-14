<template>
  <div class="constructor">
    <div
      v-for="(content, index) in contents"
      :key="'content-'+index"
      class="constructor__line"
      @click="current_line = index"
    >
      <component
        v-if="isProperObject(content)"
        :is="constructorElementsMap[content.type] || undefined"
        ref="constructorElements"
        v-bind="content.options"
        :value.sync="content.value"
        :key="index"
        :show="show"
        @setOptions="(options) => changeContentsByIndex(index, { options })"
        @newLine="addContent(index+1, 'text')"
      >
        <template v-slot:default="{ on }" v-if="!show">
          <div class="d-flex justify-space-between">
            <AddElement
              :index="index"
              @add="addContent"
              v-on="on"
            />
            <EditElements
              :disableSwapDown="index >= index.length - 1"
              :disableSwapUp="index === 0"
              @swapUp="swapElements(index, index-1)"
              @swapDown="swapElements(index, index+1)"
              @remove="removeElement(index)"
            />
          </div>
        </template>
      </component>
    </div>
    <v-btn
      :ripple="false"
      :elevation="0"
      color="#0BC4B8"
      type="submit"
      :disabled="show"
      :loading="loading"
      class="text-capitalize white--text px-sm-8 py-sm-6 mt-auto align-self-center"
      @click="$emit('save', contents)"
    >Сохранить
    </v-btn>
  </div>
</template>

<script>
import AddElement from '@/components/LectureConstructor/editor/tools/AddElement'
import EditElements from '@/components/LectureConstructor/editor/tools/EditElements';
import constructorElementsMap from '@/components/LectureConstructor/editor/editorElements.js';
export default {
  name: "Constructor",
  components: {
    AddElement,
    EditElements,
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default(){
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected_text: false,
      selected_text_x: undefined,
      selected_text_y: undefined,
      selected_text_start: undefined,
      selected_text_end: undefined,
      current_line: undefined,
      contents: this.value, //exampleContent,
      constructorElementsMap
      // textPreventBlur: false,
    }
  },
  methods: {
    // Changes contents fields. e.g value, options
    // contentsField param shound always be an object
    changeContentsByIndex(idx, contentsField) {
      console.log(contentsField, idx);
      this.$set(this.contents, idx, {
        ...this.contents[idx],
        ...contentsField
      })
    },

    addContent(idx, type) {
      console.log(idx, type)
      let content;
      if (type === 'text'){
        content = {
          type: 'text',
          value: '',
        }
      } else if (type === 'code') {
        content = {
          type,
          value: '',
        }
      } else if (type === 'video_vimeo') {
        content = {
          type,
          value: [],
        }
      } else if (type === 'video_youtube'){
        content = {
          type,
          value: '',
        }
      } else if (type === 'image'){
        content = {
          type,
          value: undefined,
        }
      }

      if (content){
        this.contents = [
          ...this.contents.slice(0, idx),
          content,
          ...this.contents.slice(idx)
        ]
        this.$nextTick(() => {
          this.$refs.constructorElements[idx]?.$refs?.editableTarget?.focus();
        });

      } else {
        throw new Error(`Не удалось заполнить контент: ${type}`)
      }
    },

    swapElements(index1, index2){
      if (index1 < 0
        || index2 < 0
        || index1 > this.contents.length-1
        || index2 > this.contents.length-1) return;

      let temp = this.contents[index1];
      this.$set(this.contents, index1, this.contents[index2]);
      this.$set(this.contents, index2, temp);
    },

    removeElement(index){
      this.contents = this.contents.filter((el, key) => key !== index)
    },

    isProperObject(content){
      return content
        && Object.prototype.hasOwnProperty.call(content, 'type')
        && Object.prototype.hasOwnProperty.call(content, 'value')
    },
  }
}
</script>

<style lang="scss">
.constructor {
  width: 100%;
  min-height: 600px;
  background-color: #FFFFFF;
  border-radius: 4px;
  padding: 20px 18px;
  position: relative;
  display: flex;
  flex-direction: column;

  .constructor__line {
    margin-bottom: 8px;
    box-sizing: border-box;
    position: relative;
    align-self: stretch;

    .constructor__content {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 100%;
      border-bottom: 1px solid #FFFFFF;
      transition: border-bottom-color 0.4s ease;
      overflow-wrap: anywhere;

      &[contenteditable=true]:empty:not(:focus):before {
        content: attr(data-ph);
        pointer-events: none;
        display: block;
        opacity: 0.4;
      }
    }
    // TOOLS START
    &:hover, &:focus-within {
      .constructor__line__tools {
        margin-top: 8px;
        margin-bottom: 8px;
        height: 32px;
        opacity: 0.4;
      }
    }
    .constructor__line__tools {
      opacity: 0;
      height: 0;
      // width: 100%;
      // text-align: center;
      // border-radius: 7px;
      // background-color: #0BC4B8;

      color: #FFFFFF;
      font-size: 1rem;
      line-height: 32px;
      cursor: pointer;
      transition: opacity 0.4s ease;
      transition-delay: opacity 0.4s;
      transition: height 0.4s ease;
      &:hover, &:focus-within{
        height: 32px;
        opacity: 1;
      }
    }
    .constructor__line__tools--active {
      margin-top: 8px;
      margin-bottom: 8px;
      height: 32px;
      opacity: 0.4;
    }
    // TOOLS END
  }
}
</style>
