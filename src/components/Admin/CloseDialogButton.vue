<template>
  <div class="close-dialog__button" @click="$emit('click')">
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M45.75 14.2748C44.775 13.2998 43.2 13.2998 42.225 14.2748L30 26.4748L17.775 14.2498C16.8 13.2748 15.225 13.2748 14.25 14.2498C13.275 15.2248 13.275 16.7998 14.25 17.7748L26.475 29.9998L14.25 42.2248C13.275 43.1998 13.275 44.7748 14.25 45.7498C15.225 46.7248 16.8 46.7248 17.775 45.7498L30 33.5248L42.225 45.7498C43.2 46.7248 44.775 46.7248 45.75 45.7498C46.725 44.7748 46.725 43.1998 45.75 42.2248L33.525 29.9998L45.75 17.7748C46.7 16.8248 46.7 15.2248 45.75 14.2748Z" fill="#FAFAFA"/>
    </svg>
  </div>
</template>

<script>
export default {
  name: "CloseDialogButton"
}
</script>

<style lang="scss">
.close-dialog__button {
  cursor: pointer;
  position: fixed;
  right: 30px;
  top: 30px;
  width: auto;
}
</style>
