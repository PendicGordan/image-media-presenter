<template>
  <v-app id="app">
    <Header />

    <v-main>
      <ImageView />
    </v-main>
  </v-app>
</template>

<script>
import ImageView from './components/ImageView';
import Header from "./components/Header";


export default {
  name: 'App',

  components: {
    Header,
    ImageView
  },
  created() {
    // TODO load presentations
    // TODO extract slides
    // TODO set active slide
  },
  data: () => ({

  }),
};
</script>
<style scoped>

</style>
