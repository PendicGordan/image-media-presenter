<template>
  <div id="image-view"
    :style="{
      'background-image': `${backgroundImageData.isEnabled ? 'url(' + backgroundImageData.backgroundImage + ')' : 'none'}`,
    }"
  >
    <v-row v-for="i in n" :key="i" @click.self="addImageUpload" class="fill-height" fluid>
      <template>
        <component
                v-for="(component, index) in components"
                :key="index"
                :is="component.componentName"
                v-bind="{clientX: component.clientX, clientY: component.clientY}"
        />
        <!--<v-col v-for="j in m" :key="(i + 1) * 10 + j" :class="height">
          <ImageUpload class="center" style="">
            <template slot="header">
            </template>
            <template slot="footer">
            </template>
          </ImageUpload>
          <br />
        </v-col>-->
      </template>
    </v-row>
    <v-row v-if="activeImage">
      <v-col>
        <ImageConfigurer/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import ImageUpload from './ImageUpload';
  import ImageConfigurer from './ImageConfigurer';
  import { mapState } from 'vuex';

  export default {
    name: 'ImageView',
    components: {
      ImageUpload,
      ImageConfigurer
    },
    data: () => ({
      components: [],
      n: 1,
      m: 3,
      select: { grid: '1 x 2', m: '1', n: '2' },
      items: [
        { grid: '1 x 3', m: '1', n: '3' },
        { grid: '1 x 4', m: '1', n: '4' },
        { grid: '2 x 1', m: '2', n: '1' },
        { grid: '2 x 2', m: '2', n: '2' },
        { grid: '2 x 3', m: '2', n: '3' },
        { grid: '2 x 4', m: '2', n: '4' },
        { grid: '3 x 1', m: '3', n: '1' },
        { grid: '3 x 2', m: '3', n: '2' },
        { grid: '3 x 3', m: '3', n: '3' },
        { grid: '3 x 4', m: '3', n: '4' }
      ],
      isEnabled: false
    }),
    computed: {
      height: function() {
        return 'height-' + this.$vuetify.breakpoint.name;
      },
      ...mapState([
        'backgroundImageData',
        'activeImage'
      ])
    },
    watch: {
      select() {
        console.log(this.select);
      }
    },
    methods: {
      makeGrid(e) {
        console.log(e);
      },
      addImageUpload(e) {
        this.components.push({componentName: ImageUpload, clientX: e.clientX, clientY: e.clientY});
      }
    }
  }
</script>
<style scoped>
  .height-xs {
    height: 220px
  }
  .height-sm {
    height: 250px
  }
  .height-md {
    height: 150px
  }
  .height-lg {
    height: 280px
  }
  .height-xl {
    height: 300px
  }
  #image-view {
    overflow: hidden;
    //background-image: url('https://cdn.pixabay.com/photo/2015/06/19/21/24/the-road-815297__340.jpg');
    /* background-color: #8f2c2c; */
    height: 100vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
  }

</style>
