<template>
  <v-app >
    <v-main class="DefaultLayout">
      <SnackBar/>
      <div
        class="DefaultLayout__bg"
        :style=" imageLoaded && {
          'background-image': 'url('+BgImage+')',
          'filter': 'none'
        }"
      >
      </div>
      <slot />
    </v-main>
  </v-app>
</template>

<script>
import BgImage from '@/assets/login_cover_2.jpg'
import SnackBar from "@/layouts/partials/SnackBar";
export default {
  name: "DefaultLayout",
  components: {
    SnackBar
  },

  data(){
    return{
      imageLoaded: false,
      BgImage,
    }
  },
  mounted(){
    this.setBgImage();
  },
  methods: {
    setBgImage() {
      // console.log('bgImage:', BgImage);
      var highResImage = new Image();
      highResImage.onload = function(){
        this.imageLoaded = true;
      }.bind(this)
      highResImage.src = BgImage;
    },
  },
}
</script>
<style lang="scss">
.DefaultLayout__bg{
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
  background-image: url('data:image/jpeg;base64,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');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: blur(5px) contrast(1.3);
  -webkit-transition: 1s -webkit-filter linear;
  -moz-transition: 1s -moz-filter linear;
  -moz-transition: 1s filter linear;
  -ms-transition: 1s -ms-filter linear;
  -o-transition: 1s -o-filter linear;
  transition: 1s filter linear, 1s -webkit-filter linear;
}
.DefaultLayout__copyright-container{
  user-select: none;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  span{
    margin: 32px auto;
  }
}
</style>
