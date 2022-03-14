<template>
  <div class="compiler-verdict">
    <div class="compiler-verdict__header">
      <span>Ошибка компилятора</span>
    </div>
    <div class="compiler-verdict__content">
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompilerVerdict",
  props: {
    text: String
  }
}
</script>

<style lang="scss">
.compiler-verdict {
  margin: 1.5em 0;
  background-color: #171729;
  border-radius: 7px;

  &__header {
    background: rgba(255, 255, 255, 0.08);
    padding: 16px 24px;

    span {
      font-weight: bold;
      color: #FFFFFF;
    }
  }

  &__content {
    padding: 16px 24px;

    span {
      color: #E5E9EF;
      font-weight: 600;
      font-size: 14px;
      white-space: pre;
    }
  }
}
</style>
