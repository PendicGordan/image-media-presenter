<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Header />
    <ImageView msg="Welcome to Your Vue.js App"/>
    <ImageConfigurer />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "../components/Header";
import ImageView from '@/components/ImageView.vue'
import ImageConfigurer from "../components/ImageConfigurer";

export default {
  name: 'Home',
  components: {
    Header,
    ImageConfigurer,
    ImageView
  }
}
</script>
