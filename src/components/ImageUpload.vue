<template>
    <div :id="'image-upload' + imageData.uuid" class="image-upload" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
        <div id="draggable-container" ref="draggableContainer" class="draggable-container">
            <div :id="'draggable-header' + imageData.uuid" @mousedown="dragMouseDown">
                <div v-if="!imageData.src && !presentationModeActive" :id="'grid-ceil-' + uuid">
                    <div class="file-upload upload-image">
                        <label :for="'file-input' + uuid">
                            <img src="../../public/img/uploader.jpg" alt="uploader" class="image-uploader" />
                        </label>
                        <input type="file" :id="'file-input' + uuid" accept="image/*" @change="onChange">
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
                    width: "500",
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
                    isBackgroundImage: { isEnabled: null, backgroundSize: 'cover' }
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
                'activeSlide',
                'presentationModeActive'
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
            isBackgroundImage: Object
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
                    this.imageData.isBackgroundImage = { isEnabled: null, backgroundSize: 'cover' };
                } else if (payload.uuid === this.imageData.uuid) {
                    this.imageData.isBackgroundImage = { isEnabled: payload.isEnabled, backgroundSize: payload.backgroundSize };
                    this.setActiveImage(this.imageData);
                }
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
                if(wrapperElement.getBoundingClientRect()) {
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
                }
            });
            EventBus.$on('CHANGE_LAYOUT', async () => {
                this.removeBorder();
            });
            EventBus.$on('IMAGE_EXCHANGE', async () => {
                this.removeBorder();
            });
            EventBus.$on('HANDLE_UPLOAD', async () => {
                this.removeBorder();
                await this.setActiveImage(null);
            });
            EventBus.$on('DESELECT_IMAGES', async () => {
                this.removeBorder();
                await this.setActiveImage(null);
            });
            this.imageData.uuid = this.uuid;
            this.imageData.slideId = this.activeSlide.text;
            this.imageData.x = this.x;
            this.imageData.y = this.y;
            this.imageData.src = this.src;
            this.imageData.width = this.width ? this.width : "500";
            this.imageData.rotation = this.rotation;
            this.imageData.positionX = this.positionX;
            this.imageData.positionY = this.positionY;
            //this.imageData.slideId = this.slideId;
            this.imageData.roundFactor = this.roundFactor;
            this.imageData.blurringLevel = this.blurringLevel;
            this.imageData.sepiaLevel = this.sepiaLevel;
            this.imageData.saturationLevel = this.saturationLevel;
            this.imageData.invertLevel = this.invertLevel;
            this.imageData.opacityLevel = this.opacityLevel;
            this.imageData.brightnessLevel = this.brightnessLevel;
            this.imageData.contrastLevel = this.contrastLevel;
            this.imageData.isBackgroundImage = this.isBackgroundImage;
            this.$refs.draggableContainer.style.left = this.imageData.positionX + 'px';
            this.$refs.draggableContainer.style.top = this.imageData.positionY + 'px';
            this.assignImageToTheSlide(this.imageData);
            let imageInput = document.getElementById('grid-ceil-' + this.imageData.uuid);
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                imageInput.addEventListener(eventName, e => {
                    e.preventDefault();
                    e.stopPropagation();
                }, false)
            });
            ['dragenter', 'dragover'].forEach(eventName => {
                imageInput.addEventListener(eventName, () => imageInput.classList.add('highlight'), false);
            });
            ['dragleave', 'drop'].forEach(eventName => {
                imageInput.addEventListener(eventName, () => imageInput.classList.remove('highlight'), false);
            });
            imageInput.addEventListener('drop', e => {
                if(this.imageData.src) return;
                let dt = e.dataTransfer;
                let file = dt.files[0];
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async e => {
                    const src = e.target.result;
                    this.imageData.src = src;
                    this.$emit('loaded', { src, file });
                    EventBus.$emit('HANDLE_UPLOAD');
                    this.imageData.positionX = this.$refs.draggableContainer.style.left;
                    this.imageData.positionY = this.$refs.draggableContainer.style.top;
                    this.imageData.width = document.getElementById('image-upload' + this.imageData.uuid).offsetWidth;
                    this.saveImage(this.imageData);
                    let gridCell = document.getElementById('grid-ceil-' + this.imageData.uuid);
                    if(gridCell && gridCell.classList.remove('highlight')) {
                        gridCell.classList.remove('highlight');
                    }
                };
            }, false);
            setTimeout(()=> {
                this.setGlobalMaxImageWidth(document.getElementById('image-upload' + this.imageData.uuid).offsetWidth);
            },2000);
            /*console.log(document.getElementById('image-upload' + this.imageData.uuid).offsetWidth);
            this.setGlobalMaxImageWidth(document.getElementById('image-upload' + this.imageData.uuid).offsetWidth);*/
        },
        methods: {
            onChange(e) {
                if (! e.target.files.length) return;
                let file = e.target.files[0];
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async e => {
                    const src = e.target.result;
                    this.imageData.src = src;
                    this.$emit('loaded', { src, file });
                    EventBus.$emit('HANDLE_UPLOAD');
                    this.imageData.positionX = this.$refs.draggableContainer.style.left;
                    this.imageData.positionY = this.$refs.draggableContainer.style.top;
                    this.imageData.width = document.getElementById('image-upload' + this.imageData.uuid).offsetWidth;
                    this.saveImage(this.imageData);
                };
            },
            dragMouseDown (event) {
                if(!this.imageData.src || this.presentationModeActive) return;
                event.preventDefault();
                // get the mouse cursor position at startup:
                this.positions.clientX = event.clientX;
                this.positions.clientY = event.clientY;
                document.onmousemove = this.elementDrag;
                document.onmouseup = this.closeDragElement;
            },
            elementDrag (event) {
                if(!this.imageData.src || this.presentationModeActive) return;
                this.positions.isDragging = true;
                event.preventDefault();
                let wrapperElement = document.getElementById('image-upload' + this.imageData.uuid);
                let draggableElement = document.getElementById('draggable-header' + this.imageData.uuid);
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
                if(imageHeaderRight + 200 < draggableHeaderRight) {
                    this.positions.movementX = wrapperElement.getBoundingClientRect().width - draggableElement.getBoundingClientRect().width;
                    this.imageData.positionY = wrapperElement.getBoundingClientRect().width - draggableElement.getBoundingClientRect().width;
                    this.$refs.draggableContainer.style.left = this.positions.movementX + 200  + 'px';
                }
                if(imageHeaderBottom + 200 < draggableHeaderBottom) {
                    this.positions.movementY = wrapperElement.getBoundingClientRect().height - draggableElement.getBoundingClientRect().height;
                    this.imageData.positionY = wrapperElement.getBoundingClientRect().height - draggableElement.getBoundingClientRect().height;
                    this.$refs.draggableContainer.style.top = this.positions.movementY + 200 + 'px';
                }
                if(imageHeaderLeft - 200 > draggableHeaderLeft) {
                    this.positions.movementX = 0;
                    this.imageData.positionX = this.positions.movementX - 200;
                    this.$refs.draggableContainer.style.left = this.positions.movementX - 200 + 'px';
                }
                if(imageHeaderTop - 200 > draggableHeaderTop) {
                    this.positions.movementY = 0;
                    this.imageData.positionY = this.positions.movementY - 200;
                    this.$refs.draggableContainer.style.top = this.positions.movementY - 200 + 'px';
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
                if(this.positions.isDragging || this.presentationModeActive) return;
                EventBus.$emit('IMAGE_CLICKED', {});
                this.toggleBorder();
            },
            async toggleBorder() {
                const el = document.getElementById(this.imageData.uuid);
                if(el.classList.contains("border")) {
                    await this.setActiveImage(null);
                    return el.classList.remove("border");
                }
                EventBus.$emit('IMAGE_SELECTED', {uuid: this.imageData.uuid});
                await this.setActiveImage(this.imageData);
                el.classList.add("border");
            },
            ...mapActions({
                setActiveImage: 'setActiveImage',
                assignImageToTheSlide: 'assignImageToTheSlide',
                saveImage: 'saveImage',
                setGlobalMaxImageWidth: 'setGlobalMaxImageWidth'
            }),
            activateFilterAnimation() {
                document.getElementById(this.imageData.uuid).classList.toggle('animated');
            },
            removeImage() {
                this.imageData = {
                    uuid: this.imageData.uuid,
                    src: null,
                    width: "500",
                    x: this.imageData.x,
                    y: this.imageData.y,
                    slideId: this.imageData.slideId,
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
                    isBackgroundImage: { isEnabled: null, backgroundSize: 'cover' }
                };
                this.positions = {
                    clientX: null,
                    clientY: null,
                    movementX: 0,
                    movementY: 0,
                    isDragging: false
                };
                if(this.$refs.draggableContainer.style) {
                    this.$refs.draggableContainer.style.top = '';
                    this.$refs.draggableContainer.style.left = '';
                }
            },
            async removeBorder() {
                const el = document.getElementById(this.imageData.uuid);
                if(el && el.classList.contains("border")) {
                    //this.saveImage(this.imageData);
                    await this.setActiveImage(null);
                    return el.classList.remove("border");
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
                this.imageData.isBackgroundImage = newValue && newValue.isBackgroundImage ? newValue.isBackgroundImage : { isEnabled: null, backgroundSize: 'cover' };
                if(newValue && newValue.rotation === 0) {
                    setTimeout(() => {
                        this.imageData.rotation = 0;
                    }, 50);
                }
            }
        }
    }
</script>
