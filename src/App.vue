<template>
  <v-app id="app" :style="[backgroundImage]">
    <Header />

    <v-main>
      <ImageView />
    </v-main>
  </v-app>
</template>

<script>
import ImageView from './components/ImageView';
import Header from "./components/Header";
import { mapState } from 'vuex';
import EventBus from './helpers/eventBus';

export default {
  name: 'App',
  components: {
    Header,
    ImageView
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
        'background-size': 'cover'
      };
    },
    ...mapState([
      'backgroundImageData'
    ])
  },
  mounted() {
    EventBus.$on('BACKGROUND_IMAGE_SET', (data) => {
      console.log(data);
      this.imageSrc = data.isEnabled ?' data.src' : '';
    });
  },
  created() {
    // TODO load presentations
    // TODO extract slides
    // TODO set active slide
  },
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
