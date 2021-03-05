<template>
    <div id="ImageConfigurer" style="padding-left: 1%; padding-right: 1%">
        <div>
            <v-alert
                    v-if="deleteAlertShown"
                    dense
                    text
                    type="warning"
                    transition="fade-transition"
                    dismissible
                    @input="closeDeleteAlert"
            >
                The image has been deleted!
            </v-alert>
        </div>
        <div id="editor" v-if="!deleteAlertShown">
            <v-row cols="1" v-if="value === 'basic'" class="section">
                <v-col md>
                    <v-row no-gutters>
                        <v-col cols="12" md="9">
                            <v-slider
                                    v-model="activeImage.width"
                                    class="align-self-stretch slider-width"
                                    min="0"
                                    :max="maxImageWidth"
                                    step="1"
                                    append-icon="mdi-magnify-plus-outline"
                                    prepend-icon="mdi-magnify-minus-outline"
                                    @click:append="zoomIn"
                                    @click:prepend="zoomOut"
                            ></v-slider>
                        </v-col>
                        <v-col cols="12" md="3" style="margin-top: -20px; padding-left: 10px">
                            <v-text-field
                                    placeholder="Width in %"
                                    v-model="computedWidth"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <div>
                        <v-row no-gutters>
                        <v-col cols="12" md="9">
                            <v-slider
                                    v-model="activeImage.rotation"
                                    class="align-self-stretch slider-width"
                                    min="0"
                                    max="360"
                                    step="1"
                                    :thumb-size="24"
                                    thumb-label="always"
                                    append-icon="mdi-rotate-left"
                                    prepend-icon="mdi-rotate-right"
                                    @click:append="rotateRight"
                                    @click:prepend="rotateLeft"
                            >
                            </v-slider >
                        </v-col>
                        <v-col cols="12" md="3" style="margin-top: -20px; padding-left: 10px">
                            <v-text-field
                                    placeholder="Degrees"
                                    v-model="activeImage.rotation"
                            ></v-text-field>
                        </v-col>
                        </v-row>
                    </div>
                    <v-slider
                            v-model="activeImage.roundFactor"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="50"
                            step="1"
                            label=""
                            prepend-icon="mdi-border-style"
                    >
                    </v-slider>
                </v-col>
            </v-row>
            <v-row cols="2" v-else-if="value === 'filter'" class="section">
                <v-col md>
                    <v-slider
                            v-model="activeImage.blurringLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Blur"
                            prepend-icon="mdi-blur"
                    >
                    </v-slider>
                    <v-slider
                            v-model="activeImage.sepiaLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Sepia"
                            prepend-icon="mdi-format-color-fill"
                    >
                    </v-slider>
                    <v-slider
                            v-model="activeImage.invertLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Invert"
                            prepend-icon="mdi-invert-colors"
                    >
                    </v-slider>
                </v-col>
                <v-col md>
                    <v-slider
                            v-model="activeImage.brightnessLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Brightness"
                            prepend-icon="mdi-brightness-6"
                    >
                    </v-slider>
                    <v-slider
                            v-model="activeImage.contrastLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Contrast"
                            prepend-icon="mdi-contrast-box"
                    >
                    </v-slider>
                    <v-slider
                            v-model="activeImage.saturationLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Saturation"
                            prepend-icon="mdi-decagram"
                    >
                    </v-slider>
                </v-col>
                <v-col md>
                    <v-slider
                            v-model="activeImage.opacityLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Opacity"
                            prepend-icon="mdi-opacity"
                    >
                    </v-slider>
                </v-col>
            </v-row>
            <v-row v-else-if="value === 'other'">
                <v-col md>
                    <v-checkbox
                            v-model="activeImage.isBackgroundImage.isEnabled"
                            label="Set as background"
                            color="primary"
                            value="primary"
                            hide-details
                            @change="handleImageBackground"
                    ></v-checkbox>
                    <v-radio-group v-model="backgroundSize" @change="changeRadio">
                        <v-radio
                                v-for="bs in backgroundSizes"
                                :key="bs"
                                :label="`Mode ${bs}`"
                                :value="bs"
                                :disabled="!activeImage.isBackgroundImage.isEnabled"
                        ></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col md>
                    <v-select
                            :items="gridItems"
                            label="Exchange the image with"
                            @change="exchangeWithSlide"
                    ></v-select>
                </v-col>
            </v-row>
        </div>
        <v-bottom-navigation
                v-model="value"
                color="primary"
                horizontal
                shift
                v-if="!deleteAlertShown"
        >
            <v-btn value="basic">
                <v-icon>mdi-move-resize</v-icon>
            </v-btn>

            <v-btn value="filter">
                <v-icon>mdi-filter</v-icon>
            </v-btn>
            <v-btn value="other">
                <v-icon>mdi-image-area</v-icon>
            </v-btn>
            <v-btn value="exchange" @click="exchangePerRow">
                <v-icon>mdi-format-horizontal-align-center</v-icon>
            </v-btn>
            <v-btn value="exchange" @click="exchangePerColumn">
                <v-icon>mdi-format-vertical-align-center</v-icon>
            </v-btn>
            <v-btn value="basic" @click="revertToPreviousPresentationState" :disabled="previousOperations.length === 0">
                <v-icon>mdi-undo-variant</v-icon>
            </v-btn>
            <v-btn value="remove-image" @click="removeAndClearImage">
                <span>Remove image</span>
                <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn value="close-configurer" @click="closeConfigurer">
                <span>Close configurer</span>
                <v-icon>mdi-window-close</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import EventBus from '../helpers/eventBus';

    export default {
        data: () => ({
            value: 'basic',
            deleteAlertShown: false,
            deleteAlertTimeout: null,
            imageManipulateAction: {
                CONFIGURER_EXITED: 'CONFIGURER_EXITED',
                DELETED_IMAGE: 'DELETED_IMAGE'
            },
            background: {
                isEnabled: null,
                src: '',
                uuid: null,
                backgroundSize: 'cover' // cover|contain|initial
            },
            backgroundSizes: ['cover', 'contain', 'initial'],
            backgroundSize: 'cover',
            gridItems: [],
            maxImageWidth: 800,
            previousOperations: [],
            undoInProgress: false,
            computedWidth: null,
            computingWidth: false
        }),
        props: {
        },
        computed: {
            ...mapState([
                'activeImage',
                'backgroundImageData',
                'activeSlide',
                'globalMaxImageWidth'
            ])
        },
        watch: {
            computedWidth(newValue) {
                this.computingWidth = true;
                this.setWidthOnActiveImage(newValue / 10000 * 100 * this.maxImageWidth);
                setTimeout(() => {
                    this.computingWidth = false;
                }, 50);
            },
            'activeImage.isBackgroundImage'() {
                //this.activeImage.isBackgroundImage = newData;
            },
            'activeImage.width'(newValue, oldValue) {
                if(!this.undoInProgress && !this.computingWidth) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.width = oldValue;
                    this.previousOperations.push({property: 'WIDTH', value: oldValue});
                    this.computedWidth = Math.round(this.activeImage.width / this.maxImageWidth * 100 * 100) / 100;
                }
            },
            'activeImage.rotation'(newValue, oldValue) {
                if(!this.undoInProgress) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.rotation = oldValue;
                    this.previousOperations.push({property: 'ROTATION', value: oldValue});
                }
            },
            'activeImage.roundFactor'(newValue, oldValue) {
                if(!this.undoInProgress) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.roundFactor = oldValue;
                    this.previousOperations.push({property: 'ROUND_FACTOR', value: oldValue});
                }
            },
            'activeImage.sepiaLevel'(newValue, oldValue) {
                if(!this.undoInProgress) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.sepiaLevel = oldValue;
                    this.previousOperations.push({property: 'SEPIA_LEVEL', value: oldValue});
                }
            },
            'activeImage.saturationLevel'(newValue, oldValue) {
                if(!this.undoInProgress) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.saturationLevel = oldValue;
                    this.previousOperations.push({property: 'SATURATION_LEVEL', value: oldValue});
                }
            },
            'activeImage.invertLevel'(newValue, oldValue) {
                if(!this.undoInProgress) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.invertLevel = oldValue;
                    this.previousOperations.push({property: 'INVERT_LEVEL', value: oldValue});
                }
            },
            'activeImage.contrastLevel'(newValue, oldValue) {
                if(!this.undoInProgress) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.contrastLevel = oldValue;
                    this.previousOperations.push({property: 'CONTRAST_LEVEL', value: oldValue});
                }
            },
            'activeImage.brightnessLevel'(newValue, oldValue) {
                if(!this.undoInProgress) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.brightnessLevel = oldValue;
                    this.previousOperations.push({property: 'BRIGHTNESS_LEVEL', value: oldValue});
                }
            },
            'activeImage.blurringLevel'(newValue, oldValue) {
                if(!this.undoInProgress) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.blurringLevel = oldValue;
                    this.previousOperations.push({property: 'BLURRING_LEVEL', value: oldValue});
                }
            },
            'activeImage.opacityLevel'(newValue, oldValue) {
                if(!this.undoInProgress) {
                    const activeImageCopy = Object.assign({}, this.activeImage);
                    activeImageCopy.opacityLevel = oldValue;
                    this.previousOperations.push({property: 'OPACITY_LEVEL', value: oldValue});
                }
            }
        },
        created() {
            EventBus.$on('IMAGE_CLICKED', () => {
                if(this.deleteAlertTimeout !== null) {
                    clearTimeout(this.deleteAlertTimeout);
                    this.clearConfigurer();
                    this.value = 'basic';
                }
            });
        },
        mounted() {
            this.background = this.backgroundImageData;
            if (this.backgroundImageData.uuid === this.activeImage.uuid) {
                this.activeImage.isBackgroundImage = { isEnabled: this.background.isEnabled, backgroundSize: this.background.backgroundSize };
                this.setActiveImage(this.activeImage);
            }

            this.backgroundSize = this.activeImage.isBackgroundImage.backgroundSize;
            for(const uuid in this.activeSlide.images) {
                const image = this.activeSlide.images[uuid];
                if(image.src && (this.activeImage.x + 1) + 'x' + (this.activeImage.y + 1) !== (image.x + 1) + 'x' + (image.y + 1)) {
                    this.gridItems.push((image.x + 1) + 'x' + (image.y + 1));
                }
            }
            this.maxImageWidth = this.globalMaxImageWidth;
            this.computedWidth = Math.round(this.activeImage.width / this.maxImageWidth * 100 * 100) / 100;
        },
        methods: {
            ...mapActions([
                'setActiveImage',
                'setBackgroundImage',
                'deleteActiveImageData',
                'saveImage',
                'exchangeImages',
                'exchangeImageWithNeighbourRow',
                'exchangeImageWithNeighbourColumn',
                'setRotationOnActiveImage',
                'setWidthOnActiveImage',
                'setRoundFactorOnActiveImage',
                'setSepiaLevelOnActiveImage',
                'setBrightnessLevelOnActiveImage',
                'setOpacityLevelOnActiveImage',
                'setBlurringLevelOnActiveImage',
                'setContrastLevelOnActiveImage',
                'setInvertLevelOnActiveImage',
                'setSaturationLevelOnActiveImage'
            ]),
            removeAndClearImage() {
                this.closeDeleteAlert(true);
                this.deleteActiveImageData(this.activeImage);
                EventBus.$emit('DELETED_IMAGE', {uuid: this.activeImage.uuid});
                this.deleteAlertShown = true;
            },
            rotateRight() {
                this.activeImage.rotation = this.activeImage.rotation - 90 >= 0 ? this.activeImage.rotation - 90 + "" : 360 - Math.abs(this.activeImage.rotation - 90);
                this.setActiveImage(this.activeImage);
            },
            rotateLeft() {
                this.activeImage.rotation = this.activeImage.rotation + 90 < 360 ? this.activeImage.rotation + 90 + "" : (this.activeImage.rotation + 90) % 360 + "";
                this.setActiveImage(this.activeImage);
            },
            activateFilterAnimation() {
                EventBus.$emit('ANIMATE_IMAGE', { uuid: this.activeImage.uuid });
            },
            handleImageBackground(e) {
                this.background = {
                    isEnabled: e,
                    src: this.activeImage.src,
                    uuid: this.activeImage.uuid,
                    backgroundSize: this.backgroundSize
                };
                this.setBackgroundImage(this.background);
                EventBus.$emit('BACKGROUND_IMAGE_SET', this.background);
                //this.activeImage.isBackgroundImage.isEnabled = this.background.isEnabled;
                this.activeImage.isBackgroundImage.isEnabled = e;
                this.setActiveImage(this.activeImage);
                this.saveImage(this.activeImage);
            },
            closeDeleteAlert(methodCalled) {
                if(this.deleteAlertTimeout !== null) {
                    clearTimeout(this.deleteAlertTimeout );
                }
                if(methodCalled === false) {
                    //EventBus.$emit(this.imageManipulateAction.DELETED_IMAGE, this.activeImage);
                    this.clearConfigurer();
                } else {
                    EventBus.$emit(this.imageManipulateAction.DELETED_IMAGE, this.activeImage);
                    this.deleteAlertTimeout  = setTimeout(() => {
                        this.clearConfigurer();
                    }, 4000);
                }
            },
            zoomOut () {
                this.activeImage.width = (this.activeImage.width - 5) || 0;
                this.setActiveImage(this.activeImage);
                this.saveImage(this.activeImage);
            },
            zoomIn () {
                this.activeImage.width = (this.activeImage.width + 5) || 500;
                this.setActiveImage(this.activeImage);
                this.saveImage(this.activeImage);
            },
            clearConfigurer() {
                this.deleteAlertShown = false;
                this.setActiveImage(null);
            },
            closeConfigurer() {
                this.saveImage(this.activeImage);
                this.setActiveImage(null);
                EventBus.$emit(this.imageManipulateAction.CONFIGURER_EXITED);
            },
            changeRadio() {
                this.background.backgroundSize = this.backgroundSize;
                this.setBackgroundImage(this.background);//
                EventBus.$emit('BACKGROUND_IMAGE_SET', this.background);
                this.activeImage.isBackgroundImage.backgroundSize = this.backgroundSize;
                this.setActiveImage(this.activeImage);
                this.saveImage(this.activeImage);
            },
            exchangeWithSlide(e) {
                this.exchangeImages({ imageCoordinateToExchangeWithX: e.split("x")[0], imageCoordinateToExchangeWithY: e.split("x")[1] });
                EventBus.$emit("IMAGE_EXCHANGE");
            },
            exchangePerRow() {
                this.exchangeImageWithNeighbourRow(this.activeImage.uuid);
                this.setActiveImage(null);
                EventBus.$emit(this.imageManipulateAction.CONFIGURER_EXITED);
            },
            exchangePerColumn() {
                this.exchangeImageWithNeighbourColumn(this.activeImage.uuid);
                this.setActiveImage(null);
                EventBus.$emit(this.imageManipulateAction.CONFIGURER_EXITED);
            },
            async revertToPreviousPresentationState() {
                this.undoInProgress = true;
                const operation = this.previousOperations.pop();
                //operation.property
                if(operation.property === 'WIDTH') {
                    this.setWidthOnActiveImage(operation.value);
                    this.computedWidth = Math.round(this.activeImage.width / this.maxImageWidth * 100 * 100) / 100;
                } else if(operation.property === 'ROTATION') {
                    this.setRotationOnActiveImage(operation.value);
                } else if(operation.property === 'ROUND_FACTOR') {
                    this.setRoundFactorOnActiveImage(operation.value);
                } else if(operation.property === 'SEPIA_LEVEL') {
                    this.setSepiaLevelOnActiveImage(operation.value);
                } else if(operation.property === 'SATURATION_LEVEL') {
                    this.setSaturationLevelOnActiveImage(operation.value);
                } else if(operation.property === 'BLURRING_LEVEL') {
                    this.setBlurringLevelOnActiveImage(operation.value);
                } else if(operation.property === 'BRIGHTNESS_LEVEL') {
                    this.setBrightnessLevelOnActiveImage(operation.value);
                } else if(operation.property === 'OPACITY_LEVEL') {
                    this.setOpacityLevelOnActiveImage(operation.value);
                } else if(operation.property === 'CONTRAST_LEVEL') {
                    this.setContrastLevelOnActiveImage(operation.value);
                } else if(operation.property === 'INVERT_LEVEL') {
                    this.setInvertLevelOnActiveImage(operation.value);
                }
                //this.activeImage.roundFactor = this.previousOperations.roundFactor;
                setTimeout(() => {
                    this.undoInProgress = false;
                }, 25);
                this.value = 'basic';

            }
        }
    };
</script>
<style scoped>
    #ImageConfigurer {
        max-width: 100%;
        width: 100%;
        margin: auto;
        bottom: 0;
        left: 0;
        z-index: 999;
        position: absolute;
        background-color: rgba(	247, 230, 201, 0.3);
    }
    #editor {
        margin: auto;
    }
    .section {
        padding-right: 1%;
        padding-left: 1%;
        padding-top: 1%;
    }
</style>
