<template>
  <div style="width: 99.15%; margin-left: 0.40%;">
    <v-row>
      <div style="width:100%;margin-top: 0.25%;height:100%;">
        <grid-layout :layout.sync="layout"
                     :col-num="4"
                     :row-height="1"
                     :is-draggable="draggable"
                     :is-resizable="resizable"
                     :responsive="responsive"
                     :vertical-compact="true"
                     :use-css-transforms="true"
                     :margin="[0, 0]"
                     :autoSize="true"
        >
          <grid-item v-for="item in layout"
                     :static="item.static"
                     :x="item.x"
                     :y="item.y"
                     :w="item.w"
                     :h="item.h"
                     :i="item.i"
                     :key="item.i"
                     :margin="[0, 0]"
                     class="height-parent"
          >
            <ImageUpload :key="item.i" :uuid="item.i" class="height-child">
            </ImageUpload>
          </grid-item>
        </grid-layout>
      </div>
    </v-row>
    <v-row v-if="activeImage">
      <ImageConfigurer>

      </ImageConfigurer>
    </v-row>
  </div>
</template>

<script>
  import { GridLayout, GridItem } from "vue-grid-layout";
  import ImageConfigurer from './ImageConfigurer';
  import ImageUpload from './ImageUpload';
  import {uuid} from 'vue-uuid';
  import {mapState} from 'vuex';

  export default {
    components: {
      GridLayout,
      GridItem,
      ImageConfigurer,
      ImageUpload
    },
    data() {
      return {
        numberOfColumns: 2,
        numberOfRows: 2,
        draggable: false,
        resizable: false,
        responsive: false,
        index: 0,
        layout: [
          {"x":0,"y":0,"w":2,"h":window.innerHeight / 2 - 35, "i":uuid.v4()},
          {"x":2,"y":0,"w":2,"h":window.innerHeight / 2 - 35, "i":uuid.v4()},
          {"x":0,"y":2,"w":2,"h":window.innerHeight / 2 - 35, "i":uuid.v4()},
          {"x":2,"y":2,"w":2,"h":window.innerHeight / 2 - 35, "i":uuid.v4()}
        ]
      }
    },
    methods: {
      handleResize() {
        let numberOfRows = this.numberOfRows;
        this.layout.forEach(item => item.h = window.innerHeight / numberOfRows);
      }
    },
    created() {
      window.addEventListener('resize', this.handleResize);
    },
    computed: {
      ...mapState([
              'activeImage'
      ])
    }
  }
</script>

<style scoped>
  .vue-grid-layout {
    background: #eee;
  }
  .vue-grid-item:not(.vue-grid-placeholder) {
    background: #ccc;
    border: 1px solid black;
  }
  .vue-grid-item .resizing {
    opacity: 0.9;
  }
  .vue-grid-item .static {
    background: #cce;
  }
  .vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .vue-grid-item .no-drag {

  }
  .vue-grid-item .minMax {
    font-size: 12px;
  }
  .vue-grid-item .add {
    cursor: pointer;
  }
  .vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
  }
  .height-parent {
    border: 10px solid #FFbFFa;
  }
  .height-child {
    /*display: table-caption;
    vertical-align: middle; !*Vertically centered*!
    text-align: center;*/
    height:100%;
    border: 4px solid #adF4FF;/* Horizontally centered */
  }
</style>
