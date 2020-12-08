<template>
  <div style="width: 99.15%; margin-left: 0.40%;" id="image-view">
    <ActionMenu v-if="toggleActionMenu" />
    <v-row>
      <div style="width:100%;margin-top: 0.25%;height:100%;" v-if="activeSlide">
        <grid-layout :layout.sync="layout"
                     :col-num="activeSlide.maxX"
                     :row-height="columnHeight"
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
            <ImageUpload :key="item.i" :uuid="item.i" :x="item.x" :y="item.y" :src="item.src" class="height-child">
            </ImageUpload>
          </grid-item>
        </grid-layout>
      </div>
    </v-row>
    <v-row v-if="activeImage">
      <ImageConfigurer >

      </ImageConfigurer>
    </v-row>
  </div>
</template>

<script>
  import { GridLayout, GridItem } from "vue-grid-layout";
  import ImageConfigurer from './ImageConfigurer';
  import ImageUpload from './ImageUpload';
  //import {uuid} from 'vue-uuid';
  import {mapState, mapActions} from 'vuex';
  import EventBus from "../helpers/eventBus";
  import ActionMenu from "./ActionMenu";

  export default {
    components: {
      GridLayout,
      GridItem,
      ImageConfigurer,
      ImageUpload,
      ActionMenu
    },
    data() {
      return {
        numberOfColumns: 2,
        numberOfRows: 2,
        draggable: false,
        resizable: false,
        responsive: false,
        index: 0,
        columnHeight: 0,
        //columnWidth: 0,
        toggleActionMenu: false,
        layout: [

        ]
      }
    },
    methods: {
      handleResize() {
        let numberOfRows = this.numberOfRows;
        this.layout.forEach(item => item.h = window.innerHeight / numberOfRows);
      },
      ...mapActions({
        restructureActiveSlide: 'restructureActiveSlide'
      })
    },
    created() {
      //window.addEventListener('resize', this.handleResize);
    },
    watch: {
      activeSlide(newSlide) {
        this.layout = [];
        this.columnHeight = window.innerHeight / newSlide.maxY - 35;
        console.log('11111111', newSlide);
        let images = Object.values(newSlide.images);

        images.forEach(image => {
          this.layout.push({"x": image.x, "y": image.y, "w": 1, "h": 1, "i": image.uuid, src: image.src});
        });
        //this.layout.push({
          //"x": image.y, "y": image.x, "w": 1, "h": 1, "i": image.uuid
        //});
      }
    },
    computed: {
      ...mapState([
              'activeImage',
              'activeSlide'
      ])
    },
    mounted() {
      EventBus.$on('CHANGE_LAYOUT', async payload => {
        //const uuids = this.layout.map(layoutItem => layoutItem.i);
        console.log(payload);
        // this.numberOfColumns = payload.columns;
        // this.numberOfRows = payload.rows;
        // this.activeSlide.maxX = payload.columns;
        // this.activeSlide.maxY = payload.rows;
        console.log('activeslide 1', this.activeSlide);
        this.restructureActiveSlide({ columns: payload.columns, rows: payload.rows });
        console.log('activeslide 2', this.activeSlide);
        this.columnHeight = window.innerHeight / this.activeSlide.maxY - 35;


        let images = Object.values(this.activeSlide.images);
        this.layout = [];
        console.log(images);
        images.forEach(image => {
          this.layout.push({"x": image.x, "y": image.y, "w": 1, "h": 1, "i": image.uuid, src: image.src});
        });
        // for(let i = 0; i < this.activeSlide.maxY; ++i) {
        //   for(let j = 0; j < this.activeSlide.maxX; ++j) {
        //     let itemUuid;
        //     if(uuids.length !== 0) {
        //       itemUuid = uuids[0];
        //       uuids.shift();
        //       this.layout.push({
        //         "x":j ,"y":i ,"w":1,"h": 1, "i": itemUuid, src: null
        //       });
        //     } else {
        //       itemUuid = uuid.v4();
        //       this.layout.push({
        //         "x":j ,"y":i ,"w":1,"h": 1, "i": itemUuid
        //       });
        //     }
        //   }
        // }
      });
      EventBus.$on('TOGGLE_ACTION_MENU', payload => {
        this.toggleActionMenu = payload;
      });

      // console.log(window.innerHeight / this.numberOfColumns);
      // this.columnHeight = window.innerHeight / this.numberOfColumns - 35;
      // this.columnWidth = window.innerWidth / this.numberOfRows;
      // if(this.activeSlide)
      //   for(let i = 0; i < this.activeSlide.maxY; ++i) {
      //     for(let j = 0; j < this.activeSlide.maxX; ++j) {
      //       this.layout.push({
      //         "x":j ,"y":i ,"w":1,"h": 1, "i":uuid.v4(), src: null
      //       });
      //     }
      //   }
    }
  }
</script>

<style scoped>
  .vue-grid-layout {
    //background: #eee;
  }
  .vue-grid-item:not(.vue-grid-placeholder) {
    //background: #ccc;
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
  #action-menu {
    position: absolute;
    z-index: 1000;
  }
  #image-view {
    position: relative;
  }
</style>
