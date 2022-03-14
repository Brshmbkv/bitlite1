<template>
  <div class="vue-codemirror">
    <textarea
      ref="textarea"
      :name="name"
      :placeholder="placeholder"
    ></textarea>
  </div>
</template>

<script>
import _CodeMirror from 'codemirror'
const CodeMirror = window.CodeMirror || _CodeMirror
// export
export default {
  name: 'codemirror',
  props: {
    code: String,
    value: String,
    marker: Function,
    unseenLines: Array,
    name: {
      type: String,
      default: 'codemirror'
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => ({})
    },
    events: {
      type: Array,
      default: () => ([])
    },
    globalOptions: {
      type: Object,
      default: () => ({})
    },
    globalEvents: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      content: '',
      codemirror: null,
      cminstance: null
    }
  },
  watch: {
    options: {
      deep: true,
      handler(options) {
        for (const key in options) {
          this.cminstance.setOption(key, options[key])
        }
      }
    },
    code(newVal) {
      this.handleCodeChange(newVal)
    },
    value(newVal) {
      this.handleCodeChange(newVal)
    },
  },
  mounted() {
    this.initialize()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    initialize() {
      const cmOptions = Object.assign({}, this.globalOptions, this.options)

      this.codemirror = CodeMirror.fromTextArea(this.$refs.textarea, cmOptions);
      this.cminstance = this.codemirror;
      this.cminstance.setValue(this.code || this.value || this.content);

      this.cminstance.on('change', cm => {
        this.content = cm.getValue();
        if (this.$emit) {
          this.$emit('input', this.content);
        }
      })
      const tmpEvents = {}
      const allEvents = [
        'scroll',
        'changes',
        'beforeChange',
        'cursorActivity',
        'keyHandled',
        'inputRead',
        'electricInput',
        'beforeSelectionChange',
        'viewportChange',
        'swapDoc',
        'gutterClick',
        'gutterContextMenu',
        'focus',
        'blur',
        'refresh',
        'optionChange',
        'scrollCursorIntoView',
        'update'
      ]
        .concat(this.events)
        .concat(this.globalEvents)
        .filter(e => (!tmpEvents[e] && (tmpEvents[e] = true)))

      allEvents.forEach(event => {
        this.cminstance.on(event, (...args) => {
          this.$emit(event, ...args)
          const lowerCaseEvent = event.replace(/([A-Z])/g, '-$1').toLowerCase()
          if (lowerCaseEvent !== event) {
            this.$emit(lowerCaseEvent, ...args)
          }
        })
      })
      this.$emit('ready', this.codemirror)
      this.unseenLineMarkers()
      // prevents funky dynamic rendering
      this.refresh()
    },
    refresh() {
      this.$nextTick(() => {
        this.cminstance.refresh()
      })
    },
    destroy() {
      // garbage cleanup
      const element = this.cminstance.doc.cm.getWrapperElement()
      element && element.remove && element.remove()
    },

    handleCodeChange(newVal) {
      const cm_value = this.cminstance.getValue()
      if (newVal !== cm_value) {
        const scrollInfo = this.cminstance.getScrollInfo()
        this.cminstance.setValue(newVal)
        this.content = newVal
        this.cminstance.scrollTo(scrollInfo.left, scrollInfo.top)
      }
      this.unseenLineMarkers()
    },

    unseenLineMarkers() {
      if (this.unseenLines !== undefined && this.marker !== undefined) {
        this.unseenLines.forEach(line => {
          const info = this.cminstance.lineInfo(line)
          this.cminstance.setGutterMarker(line, 'breakpoints', info.gutterMarkers ? null : this.marker())
        })
      }
    },

    switchMerge() {
      // Save current values
      const history = this.cminstance.doc.history
      const cleanGeneration = this.cminstance.doc.cleanGeneration
      this.options.value = this.cminstance.getValue()
      this.destroy()
      this.initialize()
      // Restore values
      this.cminstance.doc.history = history
      this.cminstance.doc.cleanGeneration = cleanGeneration
    }
  },
}
</script>
