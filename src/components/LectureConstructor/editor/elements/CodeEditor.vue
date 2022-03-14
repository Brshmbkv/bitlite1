<template>
  <div
    class="constructor__content"
  >
    <v-autocomplete
      ref="langSelector"
      v-if="value && !editing && !show"
      class="constructor__content__lang-selector"
      v-model="languageValue"
      :items="listLanguages"
      dense
      solo-inverted
      clearable
      hide-details="auto"
      label="Выберите язык"
      :dark="!editing"
      @change="handleLanguageChange"
    />
      <!-- hide-details -->
      <!-- :search-input.sync="search" -->
    <div
      ref="editableTarget"
      @focus="!show ? focusOnEditable() : undefined"
      @click="!show ? focusOnEditable() : undefined"
    >
      <highlight
        v-if="!editing"
        :code="value || 'Вставьте сюда кусок кода...'"
        :language="lang"
        class="code-editor__hljs"
      />
    </div>
    <v-textarea
      v-show="editing"
      :value="value"
      @input="$emit('update:value', $event)"
      filled
      label="Вставьте код"
      ref="focusTarget"
      auto-grow
      @blur="editing = false"
      @keydown.tab.prevent=""
      @keydown.ctrl.enter="editing = false"
    />
    <slot name="default"/>
  </div>
</template>

<script>
import highlight from "@/components/highlight";
// import { listLanguages } from "highlight.js";

export default {
  name: 'BitEditorCode',
  components: {
    highlight,
  },
  props: {
    value: {
      type: String,
      // default: 'Code...'
    },
    lang: String,
    show: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      editing: false,
      listLanguages: [
        'python', 'java', 'cpp', 'javascript',
        'django', 'sql', 'php', 'php-template'
      ]
    }
  },

  computed: {
    languageValue: {
      get(){
        return this.lang
      },
      set(newLang){
        this.$emit('setOptions', { lang: newLang });
      }
    }

  },

  methods: {
    focusOnEditable(){
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.focusTarget.focus();
      });
    },
    handleLanguageChange(){
      this.$refs['langSelector'].blur();
    }
  }
}
</script>
<style lang="scss">
.constructor__content__lang-selector {
  position: absolute;
  right: 0;
  top: 0;
  // >.v-text-field{
  //   &.v-text-field--solo{
  >.v-input__control{
    // min-height: auto !important;
    width: auto !important;
  }
}
.code-editor__hljs {
  code {
    min-height: 40px;
  }
}
</style>
