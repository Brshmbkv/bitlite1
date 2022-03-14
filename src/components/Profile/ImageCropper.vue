<template>
  <div 
    class="circle-stencil" 
    :style="style"
  >
    <DraggableElement 
      class="circle-stencil__handler" 
      @drag="onHandlerMove"
    >
      <svg
        class="circle-stencil__icon"
        xmlns="http://www.w3.org/2000/svg"
        width="26.7"
        height="26.3"
      >
        <path
          fill="#FFF"
          d="M15.1 4.7L18.3 6l-3.2 3.3 2.3 2.3 3.3-3.3 1.3 3.3L26.7 0zM9.3 14.7L6 18l-1.3-3.3L0 26.3l11.6-4.7-3.3-1.3 3.3-3.3z"
        ></path>
      </svg>
    </DraggableElement>
    <DraggableArea @move="onMove">
      <PreviewResult
        class="circle-stencil__preview"
        :img="img"
        :result-coordinates="resultCoordinates"
        :stencil-coordinates="stencilCoordinates"
      />
    </DraggableArea>
  </div>
</template>
<script>
import {
  DraggableElement,
  DraggableArea,
  PreviewResult,
  ResizeEvent
} from "vue-advanced-cropper";

export default {
  name: "ImageCropper",
  components: {
    PreviewResult,
    DraggableArea,
    DraggableElement
  },
  props: {
    img: {
      type: Object
    },
    resultCoordinates: {
      type: Object
    },
    stencilCoordinates: {
      type: Object
    }
  },
  computed: {
    style() {
      const { height, width, left, top } = this.stencilCoordinates;
      return {
        width: `${width}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`
      };
    }
  },
  methods: {
    onMove(moveEvent) {
      this.$emit("move", moveEvent);
    },
    onHandlerMove(dragEvent) {
      const shift = dragEvent.shift();
      const widthResize = shift.left / 2;
      const heightResize = -shift.top / 2;
      // const { height, width, left, top } = this.resultCoordinates;
      this.$emit(
        "resize",
        new ResizeEvent(
          dragEvent.nativeEvent,
          {
            left: widthResize,
            right: widthResize,
            top: heightResize,
            bottom: heightResize
          },
          {
            compensate: true
          }
        )
      );
    },
    aspectRatios() {
      return {
        minimum: 1,
        maximum: 1
      };
    }
  }
};
</script>

<style lang="scss">
.circle-stencil {
  border-radius: 50%;
  cursor: move;
  position: absolute;
  border: dashed 2px white;
  box-sizing: border-box;
  &__icon {
    user-select: none;
    pointer-events: none;
  }
  &__handler {
    position: absolute;
    right: 15%;
    top: 14%;
    z-index: 1;
    cursor: ne-resize;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(50%, -50%);
  }
  &__preview {
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>