<template>
  <div id="image-view">
    <v-row no-gutters>
      <template v-for="n in 4">
        <v-col :key="n">

    <ImageUpload>
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
  </div>
</template>

<script>
  import ImageUpload from './ImageUpload';
  export default {
    name: 'ImageView',
    components: {
      ImageUpload
    },
    data: () => ({

    }),
    methods: {

    }
  }
</script>
