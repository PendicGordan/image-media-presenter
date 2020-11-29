<template>
    <div :id="'image-upload' + imageData.uuid" class="image-upload" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;;">
        <div id="draggable-container" ref="draggableContainer">
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
        </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import EventBus from '../helpers/eventBus';

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
                  roundFactor: 0,
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
        computed: {
            ...mapState([
                'activeImage'
            ])
        },
        props: {
            clientX: Number,
            clientY: Number,
            uuid: String
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
            EventBus.$on('BACKGROUND_IMAGE_SET', (payload) => {
                if(payload.uuid !== this.imageData.uuid && payload.isEnabled) this.imageData.isBackgroundImage = false;
                else if (payload.uuid === this.imageData.uuid) this.imageData.isBackgroundImage = payload.isEnabled;
            });
            EventBus.$on('SAVED_IMAGE', () => {
                const el = document.getElementById(this.imageData.uuid);
                if(el && el.classList.contains("border")) {
                    el.classList.remove("border");
                }
            });
            //this.draggableValue.boundingRect = this.$refs[this.$ref.handleId];

            this.imageData.uuid = this.uuid;
            console.log(this.imageData.uuid);
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
                    console.log(this.imageData.uuid);
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
                let wrapperElement = document.getElementById('image-upload' + this.imageData.uuid);
                let draggableElement = document.getElementById('draggable-header' + this.imageData.uuid);

                console.log('wrapperElement bottom right top left', wrapperElement.getBoundingClientRect().bottom, draggableElement.getBoundingClientRect().right,
                    wrapperElement.getBoundingClientRect().top, draggableElement.getBoundingClientRect().left);
                console.log('draggableElement bottom right top left', draggableElement.getBoundingClientRect().bottom, draggableElement.getBoundingClientRect().right,
                                                draggableElement.getBoundingClientRect().top, draggableElement.getBoundingClientRect().left);
                console.log('client left top', event.clientX, event.clientY);

                this.positions.movementX = this.positions.clientX - event.clientX;
                this.positions.movementY = this.positions.clientY - event.clientY;
                this.positions.clientX = event.clientX;
                this.positions.clientY = event.clientY;

                this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px';
                this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px';

                let imageHeaderBottom = wrapperElement.getBoundingClientRect().bottom;
                let imageHeaderLeft = wrapperElement.getBoundingClientRect().left;
                let imageHeaderTop = wrapperElement.getBoundingClientRect().top;
                let imageHeaderRight = wrapperElement.getBoundingClientRect().right;

                let draggableHeaderBottom = draggableElement.getBoundingClientRect().bottom;
                let draggableHeaderLeft = draggableElement.getBoundingClientRect().left;
                let draggableHeaderTop = draggableElement.getBoundingClientRect().top;
                let draggableHeaderRight = draggableElement.getBoundingClientRect().right;

                if(imageHeaderRight < draggableHeaderRight) {
                    this.$refs.draggableContainer.style.left =  wrapperElement.getBoundingClientRect().width - draggableElement.getBoundingClientRect().width + 'px';
                    this.positions.movementX = wrapperElement.getBoundingClientRect().width - draggableElement.getBoundingClientRect().width;
                }

                if(imageHeaderBottom < draggableHeaderBottom) {
                    this.$refs.draggableContainer.style.top =  wrapperElement.getBoundingClientRect().height - draggableElement.getBoundingClientRect().height + 'px';
                    this.positions.movementY = wrapperElement.getBoundingClientRect().height - draggableElement.getBoundingClientRect().height;
                }

                if(imageHeaderLeft > draggableHeaderLeft) {
                    this.$refs.draggableContainer.style.left = 0 + 'px';
                    this.positions.movementX = 0;
                }
                if(imageHeaderTop > draggableHeaderTop) {
                    this.$refs.draggableContainer.style.top = 0 + 'px';
                    this.positions.movementY = 0;
                }
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
                EventBus.$emit('IMAGE_CLICKED', {});
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
                setActiveImage: 'setActiveImage'
            }),
            activateFilterAnimation() {
                document.getElementById(this.imageData.uuid).classList.toggle('animated');
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
        z-index: 9;
        //height: 100%;
    }
    #draggable-header {
        z-index: 10;
    }

    .image-upload {
        border: 4px solid #db263b;
        padding: 0;
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
</style>
