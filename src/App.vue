<template>
  <v-app id="app" :style="[backgroundImage]">
    <Header />
    <v-main>
      <router-view />
    </v-main>
    <v-btn depressed color="primary" @click="goInFullscreen">Play Presentation</v-btn>
    <v-btn depressed color="primary" @click="goOutFullscreen">Stop Presentation</v-btn>
  </v-app>
</template>

<script>
//import ImageView from './components/ImageView';
import Header from "./components/Header";
import { mapState } from 'vuex';
import EventBus from './helpers/eventBus';

export default {
  name: 'App',
  components: {
    Header,
    //ImageView
  },
  data() {
    return {
      imageSrc: 'https://newevolutiondesigns.com/images/freebies/cool-wallpaper-1.jpg'
    };
  },
  computed: {
    backgroundImage() {
      return {
        background: `url("${this.backgroundImageData.isEnabled ? this.backgroundImageData.src : ''}") no-repeat center center fixed`,
        '-webkit-background-size': 'cover',
        '-moz-background-size': 'cover',
        '-o-background-size': 'cover',
        'background-size': `${this.backgroundImageData.backgroundSize}`
      };
    },
    ...mapState([
      'backgroundImageData'
    ])
  },
  mounted() {
    document.addEventListener('keydown', (event) => {
      console.log(event.code === 'AltLeft');
      console.log(event);
      console.log('ggggggggggggggggg');
    });
    EventBus.$on('BACKGROUND_IMAGE_SET', (data) => {
      this.imageSrc = data.isEnabled ? data.src : '';
    });
  },
  methods: {
    /* Get into full screen */
    goInFullscreen() {
      const element = document.getElementById('app');
      if (element.requestFullscreen)
        element.requestFullscreen();
      else if (element.mozRequestFullScreen)
        element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen)
        element.msRequestFullscreen();
    },
    goOutFullscreen() {
      if (document.exitFullscreen)
        document.exitFullscreen();
      else if (document.mozCancelFullScreen)
        document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
      else if (document.msExitFullscreen)
        document.msExitFullscreen();
    }
  }
};
</script>
<style scoped>
  #app1 {
    background: url("https://newevolutiondesigns.com/images/freebies/cool-wallpaper-1.jpg") no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
</style>
