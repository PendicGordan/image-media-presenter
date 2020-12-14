<template>
    <div :id="'image-upload' + imageData.uuid" class="image-upload" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;;">
        <div id="draggable-container" ref="draggableContainer" class="draggable-container">
            <div :id="'draggable-header' + imageData.uuid" @mousedown="dragMouseDown">
                <div v-if="!imageData.src" class="">
                    <div class="file-upload upload-image">
                        <label :for="'file-input' + imageData.uuid">
                            <img src="../../public/img/uploader.jpg" alt="uploader" class="image-uploader" />
                        </label>
                        <input type="file" :id="'file-input' + imageData.uuid" accept="image/*" @change="onChange">
                    </div>
                </div>
                <div v-else :style="`transform: rotate(${imageData.rotation}deg);`">
                    <v-img
                            :key="imageData.uuid"
                            contain
                            :src="imageData.src"
                            :width="imageData.width"
                            @click="selectImage"
                            :id="imageData.uuid"
                            :style="{
                            'border-radius': imageData.roundFactor + '%',
                            '-webkit-filter': `grayscale(${imageData.blurringLevel / 100}) sepia(${imageData.sepiaLevel / 100}) saturate(${imageData.saturationLevel}) invert(${imageData.invertLevel / 100}) opacity(${imageData.opacityLevel / 100}) brightness(${imageData.brightnessLevel / 100}) contrast(${imageData.contrastLevel / 100})`,
                            'filter': `grayscale(${imageData.blurringLevel / 100}) sepia(${imageData.sepiaLevel / 100}) saturate(${imageData.saturationLevel}) invert(${imageData.invertLevel / 100}) opacity(${imageData.opacityLevel / 100}) brightness(${imageData.brightnessLevel / 100}) contrast(${imageData.contrastLevel / 100})`
                       }"
                    />
                </div>
            </div>
        </div>
        <div v-if="activeImage && imageData.uuid === activeImage.uuid">
            <ImageConfigurer >

            </ImageConfigurer>
        </div>
        </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import EventBus from '../helpers/eventBus';
    import ImageConfigurer from './ImageConfigurer';

    export default {
        data: () => {
          return {
              imageData: {
                  uuid: null,
                  src: null,
                  width: "250",
                  rotation: 0,
                  positionX: null,
                  positionY: null,
                  slideId: -1,
                  roundFactor: 0,
                  x: 0,
                  y: 0,
                  blurringLevel: 0,
                  sepiaLevel: 0,
                  saturationLevel: 1,
                  invertLevel: 0,
                  opacityLevel: 100,
                  brightnessLevel: 100,
                  contrastLevel: 100,
                  isBackgroundImage: null
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
        components: {
            ImageConfigurer
        },
        computed: {
            ...mapState([
                'activeImage',
                'activeSlide'
            ])
        },
        props: {
            clientX: Number,
            clientY: Number,
            uuid: String,
            x: Number,
            y: Number,
            src: String,
            width: String,
            rotation: Number,
            positionX: Number,
            positionY: Number,
            slideId: Number,
            roundFactor: Number,
            blurringLevel: Number,
            sepiaLevel: Number,
            saturationLevel: Number,
            invertLevel: Number,
            opacityLevel: Number,
            brightnessLevel: Number,
            contrastLevel: Number,
            isBackgroundImage: String
        },
        mounted () {
            EventBus.$on('IMAGE_SELECTED', (payload) => {
                const el = document.getElementById(this.imageData.uuid);
                if(payload.uuid === this.imageData.uuid || !el) return;
                el.classList.remove("border");
            });
            EventBus.$on('ANIMATE_IMAGE', (payload) => {
                const el = document.getElementById(this.imageData.uuid);
                if(payload.uuid !== this.imageData.uuid || !el) return;
                this.activateFilterAnimation();
            });
            EventBus.$on('BACKGROUND_IMAGE_SET', payload => {
                if(payload.uuid !== this.imageData.uuid && payload.isEnabled) {
                    this.imageData.isBackgroundImage = null;
                } else if (payload.uuid === this.imageData.uuid) {
                    this.imageData.isBackgroundImage = payload.isEnabled;
                    this.setActiveImage(this.imageData);
                }
                //this.saveImage(this.imageData);
            });
            EventBus.$on('CONFIGURER_EXITED', () => {
                const el = document.getElementById(this.imageData.uuid);
                if(el && el.classList.contains("border")) {
                    el.classList.remove("border");
                }
            });
            EventBus.$on('DELETED_IMAGE', (payload) => {
                if(this.imageData.uuid !== payload.uuid) return;
                const el = document.getElementById(this.imageData.uuid);
                if(el && el.classList.contains("border")) {
                    el.classList.remove("border");
                }
                this.removeImage();
            });
            EventBus.$on('HANDLE_RESIZE', () => {
                if(!this.imageData.src) return;
                let wrapperElement = document.getElementById('image-upload' + this.imageData.uuid);
                let draggableElement = document.getElementById('draggable-header' + this.imageData.uuid);
                let imageHeaderBottom = wrapperElement.getBoundingClientRect().bottom;
                let imageHeaderLeft = wrapperElement.getBoundingClientRect().left;
                let imageHeaderTop = wrapperElement.getBoundingClientRect().top;
                let imageHeaderRight = wrapperElement.getBoundingClientRect().right;

                let draggableHeaderBottom = draggableElement.getBoundingClientRect().bottom;
                let draggableHeaderLeft = draggableElement.getBoundingClientRect().left;
                let draggableHeaderTop = draggableElement.getBoundingClientRect().top;
                let draggableHeaderRight = draggableElement.getBoundingClientRect().right;

                if(imageHeaderRight < draggableHeaderRight && this.$refs.draggableContainer) {
                    this.positions.movementX = wrapperElement.getBoundingClientRect().width - draggableElement.getBoundingClientRect().width;
                    this.imageData.positionY = wrapperElement.getBoundingClientRect().width - draggableElement.getBoundingClientRect().width;
                    this.$refs.draggableContainer.style.left = this.positions.movementX + 'px';
                }

                if(imageHeaderBottom < draggableHeaderBottom && this.$refs.draggableContainer) {
                    this.positions.movementY = wrapperElement.getBoundingClientRect().height - draggableElement.getBoundingClientRect().height;
                    this.imageData.positionY = wrapperElement.getBoundingClientRect().height - draggableElement.getBoundingClientRect().height;
                    this.$refs.draggableContainer.style.top = this.positions.movementY + 'px';
                }

                if(imageHeaderLeft > draggableHeaderLeft && this.$refs.draggableContainer) {
                    this.positions.movementX = 0;
                    this.imageData.positionX = 0;
                    this.$refs.draggableContainer.style.left = this.positions.movementX + 'px';
                }
                if(imageHeaderTop > draggableHeaderTop && this.$refs.draggableContainer) {
                    this.positions.movementY = 0;
                    this.imageData.positionY = 0;
                    this.$refs.draggableContainer.style.top = this.positions.movementY + 'px';
                }
            });

            this.imageData.uuid = this.uuid;
            this.imageData.slideId = this.activeSlide.text;
            this.imageData.x = this.x;
            this.imageData.y = this.y;
            this.imageData.src = this.src;
            this.imageData.width = this.width ? this.width : "250";
            this.imageData.rotation = this.rotation;
            this.imageData.positionX = this.positionX;
            this.imageData.positionY = this.positionY;
            this.imageData.slideId = this.slideId;
            this.imageData.roundFactor = this.roundFactor;
            this.imageData.blurringLevel = this.blurringLevel;
            this.imageData.sepiaLevel = this.sepiaLevel;
            this.imageData.saturationLevel = this.saturationLevel;
            this.imageData.invertLevel = this.invertLevel;
            this.imageData.opacityLevel = this.opacityLevel;
            this.imageData.brightnessLevel = this.brightnessLevel;
            this.imageData.contrastLevel = this.contrastLevel;
            this.imageData.isBackgroundImage = this.isBackgroundImage;

            if(this.imageData.src) {
                // this.positions.movementY = this.positionY;
                // this.positions.movementX = this.positionX;
                // this.$refs.draggableContainer.style.top = this.$refs.draggableContainer.offsetTop - this.positions.movementY + 'px';
                // this.$refs.draggableContainer.style.left = this.$refs.draggableContainer.offsetLeft - this.positions.movementX + 'px';
            }

            // console.log(this.src);
            // console.log(this.width);
            // console.log(this.rotation);
            // console.log(this.positionX);
            // console.log(this.positionY);
            // console.log(this.rotation);
            // console.log(this.slideId);
            // console.log(this.roundFactor);
            // console.log(this.blurringLevel);
            // console.log(this.sepiaLevel);
            // console.log(this.saturationLevel);
            console.log(this.imageData.positionX);
            console.log(this.imageData.positionY);
            this.$refs.draggableContainer.style.left = this.imageData.positionX + 'px';
            this.$refs.draggableContainer.style.top = this.imageData.positionY + 'px';
            this.assignImageToTheSlide(this.imageData);
        },
        methods: {
            onChange(e) {
                if (! e.target.files.length) return;

                let file = e.target.files[0];
                let reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = e => {
                    const src = e.target.result;
                    this.imageData.src = src;
                    let draggableElement = document.getElementById('draggable-header' + this.imageData.uuid);
                    this.$emit('loaded', { src, file });
                    //console.log(draggableElement.getBoundingClientRect().y);
                    this.imageData.positionX = draggableElement.getBoundingClientRect().x;
                    this.imageData.positionY = draggableElement.getBoundingClientRect().y;
                    console.log(this.$refs.draggableContainer.style);
                    this.saveImage(this.imageData);
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
                let wrapperElement = document.getElementById('image-upload' + this.imageData.uuid);
                let draggableElement = document.getElementById('draggable-header' + this.imageData.uuid);

                // console.log('wrapperElement bottom right top left', wrapperElement.getBoundingClientRect().bottom, draggableElement.getBoundingClientRect().right,
                //     wrapperElement.getBoundingClientRect().top, draggableElement.getBoundingClientRect().left);
                // console.log('draggableElement bottom right top left', draggableElement.getBoundingClientRect().bottom, draggableElement.getBoundingClientRect().right,
                //                                 draggableElement.getBoundingClientRect().top, draggableElement.getBoundingClientRect().left);
                // console.log('client left top', event.clientX, event.clientY);

                this.positions.movementX = this.positions.clientX - event.clientX;
                this.positions.movementY = this.positions.clientY - event.clientY;
                this.positions.clientX = event.clientX;
                this.positions.clientY = event.clientY;

                this.positions.movementY = this.$refs.draggableContainer.offsetTop - this.positions.movementY;
                this.positions.movementX = this.$refs.draggableContainer.offsetLeft - this.positions.movementX;
                this.$refs.draggableContainer.style.top = this.positions.movementY + 'px';
                this.$refs.draggableContainer.style.left = this.positions.movementX + 'px';

                this.imageData.positionY = this.positions.movementY;
                this.imageData.positionX = this.positions.movementX;

                let imageHeaderBottom = wrapperElement.getBoundingClientRect().bottom;
                let imageHeaderLeft = wrapperElement.getBoundingClientRect().left;
                let imageHeaderTop = wrapperElement.getBoundingClientRect().top;
                let imageHeaderRight = wrapperElement.getBoundingClientRect().right;

                let draggableHeaderBottom = draggableElement.getBoundingClientRect().bottom;
                let draggableHeaderLeft = draggableElement.getBoundingClientRect().left;
                let draggableHeaderTop = draggableElement.getBoundingClientRect().top;
                let draggableHeaderRight = draggableElement.getBoundingClientRect().right;

                if(imageHeaderRight < draggableHeaderRight) {
                    this.positions.movementX = wrapperElement.getBoundingClientRect().width - draggableElement.getBoundingClientRect().width;
                    this.imageData.positionY = wrapperElement.getBoundingClientRect().width - draggableElement.getBoundingClientRect().width;
                    this.$refs.draggableContainer.style.left = this.positions.movementX + 'px';
                }

                if(imageHeaderBottom < draggableHeaderBottom) {
                    this.positions.movementY = wrapperElement.getBoundingClientRect().height - draggableElement.getBoundingClientRect().height;
                    this.imageData.positionY = wrapperElement.getBoundingClientRect().height - draggableElement.getBoundingClientRect().height;
                    this.$refs.draggableContainer.style.top = this.positions.movementY + 'px';
                }

                if(imageHeaderLeft > draggableHeaderLeft) {
                    this.positions.movementX = 0;
                    this.imageData.positionX = 0;
                    this.$refs.draggableContainer.style.left = this.positions.movementX + 'px';
                }
                if(imageHeaderTop > draggableHeaderTop) {
                    this.positions.movementY = 0;
                    this.imageData.positionY = 0;
                    this.$refs.draggableContainer.style.top = this.positions.movementY + 'px';
                }

                this.saveImage(this.imageData);
            },
            closeDragElement () {
                if(!this.imageData.src) return;
                document.onmouseup = null;
                document.onmousemove = null;
                setTimeout(async () => {
                    this.positions.isDragging = false;
                }, 100);
            },
            async selectImage () {
                if(this.positions.isDragging) return;
                EventBus.$emit('IMAGE_CLICKED', {});
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
                setActiveImage: 'setActiveImage',
                assignImageToTheSlide: 'assignImageToTheSlide',
                saveImage: 'saveImage'
            }),
            activateFilterAnimation() {
                document.getElementById(this.imageData.uuid).classList.toggle('animated');
            },
            removeImage() {
                this.imageData = {
                    uuid: this.imageData.uuid,
                    src: null,
                    width: "250",
                    x: 0,
                    y: 0,
                    rotation: 0,
                    positionX: null,
                    positionY: null,
                    roundFactor: 0,
                    blurringLevel: 0,
                    sepiaLevel: 0,
                    saturationLevel: 1,
                    invertLevel: 0,
                    opacityLevel: 100,
                    brightnessLevel: 100,
                    contrastLevel: 100,
                    isBackgroundImage: null
                };
                this.positions = {
                    clientX: null,
                    clientY: null,
                    movementX: 0,
                    movementY: 0,
                    isDragging: false
                };
                console.log(this.$refs.draggableContainer.style);
                if(this.$refs.draggableContainer.style) {
                    this.$refs.draggableContainer.style.top = '';
                    this.$refs.draggableContainer.style.left = '';
                }
            }
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
                this.imageData.invertLevel = newValue && newValue.invertLevel ? newValue.invertLevel : this.imageData.invertLevel;
                this.imageData.opacityLevel = newValue && newValue.opacityLevel ? newValue.opacityLevel : this.imageData.opacityLevel;
                this.imageData.brightnessLevel = newValue && newValue.brightnessLevel ? newValue.brightnessLevel : this.imageData.brightnessLevel;
                this.imageData.isBackgroundImage = newValue && newValue.isBackgroundImage ? newValue.isBackgroundImage : null;
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
    #draggable-container {
        position: absolute;
        z-index: 9
    }
    #draggable-header {
        z-index: 10;
    }
    .image-upload {
        border: 4px solid #db263b;
        padding: 0;
        position: relative
    }
    .image-uploader {
        cursor: pointer;
        border: 4px solid #2590EB;
    }
    .wrapper .file-upload {
        border: 4px solid #eb263b;
        transition: all 1s;
        color: #FFFFFF;
        height: 100%;
    }
    .wrapper .file-upload:hover {

        //background-image: url("../../public/img/uploader.jpg");
    }
    .border {
        border: 2px solid #555;
    }
    .animated {
        -webkit-animation: filter-animation 5s infinite;
    }
    .upload-image > input {
        display: none;
    }
    .draggable-container {
        border: 2px solid #10ff35;
    }
</style>
