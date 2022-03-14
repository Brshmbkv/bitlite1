<script>
import hljs from "highlight.js/lib/core.js";
import 'highlight.js/styles/agate.css'

hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
hljs.registerLanguage('java', require('highlight.js/lib/languages/java'));
hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'));
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
hljs.registerLanguage('php', require('highlight.js/lib/languages/php'));
hljs.registerLanguage('django', require('highlight.js/lib/languages/django'));
hljs.registerLanguage('php-template', require('highlight.js/lib/languages/php-template'));
hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'));

function escapeHTML(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}


export default {
  props: {
    language: String,
    code: String,
    autodetect: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detectedLanguage: "",
      // unknownLanguage: false
    };
  },
  computed: {
    className() {
      return "hljs " + (this.detectedLanguage || "");
    },
    highlighted() {
      // no idea what language to use, return raw code
      if (!this.autoDetect && !hljs.getLanguage(this.language)) {
        console.warn(`The language "${this.language}" you specified could not be found.`);
        // this.unknownLanguage = true;
        return escapeHTML(this.code);
      }

      let result = {};
      if (this.autoDetect) {
        result = hljs.highlightAuto(this.code);
        // this.detectedLanguage = result.language;
      } else {
        result = hljs.highlight(this.language, this.code, this.ignoreIllegals);
        // this.detectedLanguage = this.language;
      }
      return result;//.value;
    },
    autoDetect() {
      return !this.language || this.autodetect;
    },
    ignoreIllegals() {
      return true;
    }
  },
  watch: {
    highlighted:{
      handler(newResult){
        this.detectedLanguage = this.autoDetect ? newResult.language : this.language;
      }
    }
  },
  // this avoids needing to use a whole Vue compilation pipeline just
  // to build Highlight.js
  render(createElement) {
    return createElement("pre", {}, [
      createElement("code", {
        class: this.className,
        domProps: { innerHTML: this.highlighted.value }
      })
    ]);
  }
  // template: `<pre><code :class="className" v-html="highlighted"></code></pre>`
};
</script>
