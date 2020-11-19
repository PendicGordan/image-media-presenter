<template>
  <div id="image-view">
    <!--<v-select
            v-model="select"
            :hint="'Currently selected: ' + `${select.m} x ${select.n}`"
            :items="items"
            item-text="grid"
            :item-value="select"
            label="Select a grid"
            persistent-hint
            return-object
            single-line
    ></v-select>-->
    <v-row v-for="i in n" :key="i">
      <template>
        <v-col v-for="j in m" :key="(i + 1) * 10 + j" :class="height">
          <ImageUpload class="center" style="">
            <template slot="header">
            </template>
            <template slot="footer">
            </template>
          </ImageUpload>
          <br />
          <div>
        <!--<v-slider

                class="align-self-stretch"
                min="200"
                max="500"
                step="1"
        ></v-slider>-->
          </div>
        </v-col>
      </template>
    </v-row>
    <v-row>
      <v-col>
        <ImageConfigurer/>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import ImageUpload from './ImageUpload';
  import ImageConfigurer from './ImageConfigurer';

  export default {
    name: 'ImageView',
    components: {
      ImageUpload,
      ImageConfigurer
    },
    data: () => ({
      n: 2,
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
    }),
    mounted() {
      console.log(this.height);
    },
    computed: {
      height: function() {
        return 'height-' + this.$vuetify.breakpoint.name;
      }
    },
    watch: {
      select() {
        console.log(this.select);
      }
    },
    methods: {
      makeGrid(e) {
        console.log(e);
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
  }
</style>
