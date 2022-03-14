import Vue from 'vue';
import Vuetify from 'vuetify/lib';
Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    light: true,
    themes: {
      light: {
        primary: '#0BC4B8',
        secondary: '#b0bec5',
        success: '#0BC3B8',
        accent: '#8c9eff',
        error: '#F16635',
        gray: '#5A6275',
        live: '#F16635',
        grayLight: '#9FA4B1',
        warning: '#E7AE1E',
      },
      dark: {
        primary: '#0BC4B8',
        secondary: '#66F0E3',
        live: '#F16635',
        gray: '#5A6275',
        grayLight: '#9FA4B1'
      }
    },
  },
  icons: {
    iconfont: 'mdiSvg',
  },
});
