<template>
  <v-app id="app" :style="[backgroundImage]">
    <Header v-if="slides.length !== 0" style="height: 12%"/>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import { mapState, mapActions } from 'vuex';
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
      'backgroundImageData',
      'presentationModeActive',
      'slides',
      'activeSlide',
      'autosliding'
    ])
  },
  async mounted() {
    window.addEventListener('scroll', () => window.scrollTo(0, 0));
    document.addEventListener('keydown', (event) => {
      if(this.presentationModeActive) {
        if(this.autosliding.autoslideEnabled) {
          console.log(this.autosliding.autoslideEnabled);
        } else {
          if (event.code === 'ArrowLeft') {
            console.log('ArrowLeft');
            this.changeActiveSlide((this.activeSlide.text - 1) % (this.slides.length + 2));
          } else if (event.code === 'ArrowRight' || event.code === 'Space') {
            console.log('ArrowRight');
            this.changeActiveSlide((this.activeSlide.text + 1) % (this.slides.length + 2));
          }
        }
      }

      let deferredPrompt;

      window.addEventListener('beforeinstallprompt', function(e) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
      });

      let btnAdd = document.getElementById('btnAdd');
      // Installation must be done by a user gesture! Here, the button click
      btnAdd.addEventListener('click', () => {
        // hide our user interface that shows our A2HS button
        btnAdd.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
                .then((choiceResult) => {
                  if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                  } else {
                    console.log('User dismissed the A2HS prompt');
                  }
                  deferredPrompt = null;
                });
      });
    });
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        this.togglePresentationMode();
        EventBus.$emit('PRESENTATION_FINISHED');
      }
    });
    document.addEventListener('webkitfullscreenchange', () => {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        this.togglePresentationMode();
        EventBus.$emit('PRESENTATION_FINISHED');
      }
    });
    document.addEventListener('mozfullscreenchange', () => {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        this.togglePresentationMode();
        EventBus.$emit('PRESENTATION_FINISHED');
      }
    });
    document.addEventListener('MSFullscreenChange', () => {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        this.togglePresentationMode();
        EventBus.$emit('PRESENTATION_FINISHED');
      }
    });

    EventBus.$on('BACKGROUND_IMAGE_SET', (data) => {
      this.imageSrc = data.isEnabled ? data.src : '';
    });
  },
  methods: {
    ...mapActions([
      'togglePresentationMode',
      'changeActiveSlide'
    ])
  }
};
</script>
<style scoped>
</style>
