<template>
    <div id="image-upload">
        <div id="draggable-container" ref="draggableContainer">
            <div id="draggable-header" @mousedown="dragMouseDown">
                <slot name="header"></slot>
                <div v-if="!imageData.src" class="wrapper">
                    <div  class="file-upload" >
                        <input type="file" accept="image/*" @change="onChange">
                        <em class="fa fa-arrow-up"></em>
                    </div>
                </div>
                <div v-else
                     :style="`transform: rotate(${imageData.rotation}deg);`"
                >
                    <v-img
                           contain
                           :src="imageData.src"
                           :width="imageData.width"
                           @click="selectImage"
                           :id="imageData.uuid"
                           :style="{
                                'border-radius': imageData.roundFactor + '%',
                                '-webkit-filter': `grayscale(${imageData.blurringLevel / 100}) sepia(${imageData.sepiaLevel / 100}) saturate(${imageData.saturationLevel})`,
                                'filter': `grayscale(${imageData.blurringLevel / 100}) sepia(${imageData.sepiaLevel / 100}) saturate(${imageData.saturationLevel})`
                           }"
                           class="blur"
                    />
                </div>
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import { uuid } from 'vue-uuid';
    import EventBus from '../helpers/eventBus';

    export default {
        data: () => {
          return {
              imageData: {
                  uuid: uuid.v1(),
                  src: null,
                  width: "250",
                  rotation: 0,
                  positionX: null,
                  positionY: null,
                  roundFactor: 0,
                  blurringLevel: 0,
                  sepiaLevel: 0,
                  saturationLevel: 1
              },
              positions: {
                  clientX: null,
                  clientY: null,
                  movementX: 0,
                  movementY: 0,
                  isDragging: false
              }
          }
        },
        computed: {
            ...mapState([
                'activeImage'
            ])
        },
        mounted () {
            EventBus.$on('IMAGE_SELECTED', (payload) => {
                const el = document.getElementById(this.imageData.uuid)
                if(payload.uuid === this.imageData.uuid || !el) return;
                el.classList.remove("border");
            });
        },
        methods: {
            onChange(e) {
                if (! e.target.files.length) return;

                let file = e.target.files[0];

                let reader = new FileReader();

                reader.readAsDataURL(file);

                reader.onload = e => {
                    let src = e.target.result;
                    this.imageData.src = src;
                    this.$emit('loaded', { src, file });
                };
            },
            dragMouseDown (event) {
                if(!this.imageData.src) return;
                event.preventDefault();
                // get the mouse cursor position at startup:
                this.positions.clientX = event.clientX;
                this.positions.clientY = event.clientY;

                document.onmousemove = this.elementDrag;
                document.onmouseup = this.closeDragElement;
            },
            elementDrag (event) {
                if(!this.imageData.src) return;
                this.positions.isDragging = true;
                event.preventDefault();
                if(event.clientY  <= document.getElementById('header').getBoundingClientRect().height) return;
                this.positions.movementX = this.positions.clientX - event.clientX;
                this.positions.movementY = this.positions.clientY - event.clientY;
                this.positions.clientX = event.clientX;
                this.positions.clientY = event.clientY;
                // set the element's new position:
                this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px';
                this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px';
            },
            closeDragElement () {
                if(!this.imageData.src) return;
                document.onmouseup = null;
                document.onmousemove = null;
                setTimeout(async () => {
                    this.positions.isDragging = false;
                }, 50);
            },
            async selectImage () {
                if(this.positions.isDragging) return;
                const el = document.getElementById(this.imageData.uuid);
                if(el.classList.contains("border")) {
                    await this.setActiveImage(null);
                    return el.classList.remove("border");
                }
                EventBus.$emit('IMAGE_SELECTED', {uuid: this.imageData.uuid});
                el.classList.add("border");
                await this.setActiveImage(this.imageData);
            },
            ...mapActions({
                setActiveImage: 'setActiveImage' // map `this.add()` to `this.$store.commit('increment')`
            })
        },
        watch: {
            activeImage(newValue) {
                if(newValue && newValue.uuid !== this.imageData.uuid) return;
                this.imageData.width = newValue && newValue.width ? newValue.width : this.imageData.width;
                this.imageData.rotation = newValue && newValue.rotation ? (newValue.rotation !== 1 ? newValue.rotation : 0) : this.imageData.rotation;
                this.imageData.roundFactor = newValue && newValue.roundFactor ? (newValue.roundFactor !== 1 ? newValue.roundFactor : 0) : this.imageData.roundFactor;
                this.imageData.blurringLevel = newValue && newValue.blurringLevel ? (newValue.blurringLevel !== 1 ? newValue.blurringLevel : 0) : this.imageData.blurringLevel;
                this.imageData.sepiaLevel = newValue && newValue.sepiaLevel ? (newValue.sepiaLevel !== 1 ? newValue.sepiaLevel : 0) : this.imageData.sepiaLevel;
                this.imageData.saturationLevel = newValue && newValue.saturationLevel ? newValue.saturationLevel : this.imageData.saturationLevel;
                if(newValue && newValue.rotation === 0) {
                    setTimeout(() => {
                        this.imageData.rotation = 0;
                    }, 50);
                }
            }
        }
    }
</script>
<style scoped>
    #image-upload {
    }
    #draggable-container {
        position: absolute;
        z-index: 9;
    }
    #draggable-header {
        z-index: 10;
    }
    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .wrapper .file-upload {
        height: 130px;
        width: 130px;
        border-radius: 100px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 4px solid #2590EB;
        overflow: hidden;
        background-image: linear-gradient(to bottom, #2590EB 50%, #FFFFFF 50%);
        background-size: 100% 200%;
        transition: all 1s;
        color: #FFFFFF;
        font-size: 100px;
    }
    .wrapper .file-upload input[type='file'] {
        height: 125px;
        width: 125px;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
    }
    .wrapper .file-upload:hover {
        background-position: 0 -100%;
        color: #2590EB;
    }
    .border {
        border: 2px solid #555;
    }
    .slider-width {
        width: 50%;
    }
</style>
