<template>
    <div id="ImageConfigurer">
        <div>
            <v-alert
                    v-if="saveAlertShown"
                    dense
                    text
                    type="success"
                    transition="fade-transition"
                    dismissible
                    @input="closeSaveAlert"
            >
                The image has been saved!
            </v-alert>
        </div>
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
        <div id="editor" v-if="!saveAlertShown && !deleteAlertShown">
            <v-row cols="1" v-if="value === 'basic'" class="section">
                <v-col md>
                    <v-slider
                            v-model="activeImage.width"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="500"
                            step="1"
                            append-icon="mdi-magnify-plus-outline"
                            prepend-icon="mdi-magnify-minus-outline"
                            @click:append="zoomIn"
                            @click:prepend="zoomOut"
                    ></v-slider>
                    <div>
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
                    </div>
                    <v-slider
                            v-model="activeImage.roundFactor"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="50"
                            step="1"
                            label="Border"
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
                    >
                    </v-slider>
                    <v-slider
                            v-model="activeImage.sepiaLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Sepia"
                    >
                    </v-slider>
                    <v-slider
                            v-model="activeImage.invertLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Invert"
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
                    >
                    </v-slider>
                    <v-slider
                            v-model="activeImage.contrastLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Contrast"
                    >
                    </v-slider>
                    <v-slider
                            v-model="activeImage.saturationLevel"
                            class="align-self-stretch slider-width"
                            min="0"
                            max="100"
                            step="1"
                            label="Saturation"
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
                    >
                    </v-slider>
                </v-col>
            </v-row>
            <v-row v-else-if="value === 'other'">
                <v-col md>
                    <v-btn @click="activateFilterAnimation"
                           fab
                           dark
                           color="primary">
                        <v-icon>mdi-animation</v-icon>
                    </v-btn>
                    <v-checkbox
                            v-model="activeImage.isBackgroundImage"
                            label="Set as background"
                            color="primary"
                            value="primary"
                            hide-details
                            @change="handleImageBackground"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </div>
        <v-bottom-navigation
                v-model="value"
                color="primary"
                horizontal
                shift
                v-if="!saveAlertShown && !deleteAlertShown"
        >
            <v-btn value="save-image" @click="saveAndClearImage">
                <span>Save image</span>
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn value="basic">
                <span>Basic</span>
                <v-icon>mdi-move-resize</v-icon>
            </v-btn>

            <v-btn value="filter">
                <span>Filters</span>

                <v-icon>mdi-image-filter-vintage</v-icon>
            </v-btn>

            <v-btn value="other">
                <span>Other</span>
                <v-icon>mdi-map-marker</v-icon>
            </v-btn>
            <v-btn value="remove-image" @click="removeAndClearImage">
                <span>Remove image</span>
                <v-icon>mdi-delete</v-icon>
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
            saveAlertShown: false,
            deleteAlertShown: false,
            saveAlertTimeout: null,
            deleteAlertTimeout: null,
            imageManipulateAction: {
                SAVED_IMAGE: 'SAVED_IMAGE',
                DELETED_IMAGE: 'DELETED_IMAGE'
            }
        }),
        props: {
        },
        computed: {
            ...mapState([
                'activeImage'
            ])
        },
        watch: {

        },
        created() {
            EventBus.$on('IMAGE_CLICKED', () => {
                if(this.saveAlertTimeout !== null) {
                    clearTimeout(this.saveAlertTimeout);
                    this.clearConfigurer();
                    this.value = 'basic';
                }
                if(this.deleteAlertTimeout !== null) {
                    clearTimeout(this.deleteAlertTimeout);
                    this.clearConfigurer();
                    this.value = 'basic';
                }
            });
        },
        methods: {
            ...mapActions([
                'setActiveImage',
                'setBackgroundImage',
                'saveActiveImageData',
                'deleteActiveImageData'
            ]),
            saveAndClearImage () {
                this.saveActiveImageData(this.activeImage);
                this.saveAlertShown = true;
                this.closeSaveAlert(true);
            },
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
                this.setBackgroundImage({
                    isEnabled: e,
                    backgroundImage: this.activeImage.src
                });
                EventBus.$emit('BACKGROUND_IMAGE_SET', {
                    uuid: this.activeImage.uuid,
                    isEnabled: e
                });
            },
            closeSaveAlert(methodCalled) {
                if(this.saveAlertTimeout !== null) {
                    clearTimeout(this.saveAlertTimeout);
                }
                if(methodCalled === false) {
                    EventBus.$emit(this.imageManipulateAction.SAVED_IMAGE);
                    this.clearConfigurer();
                } else {
                    EventBus.$emit(this.imageManipulateAction.SAVED_IMAGE);
                    this.saveAlertTimeout = setTimeout(() => {
                        this.clearConfigurer();
                    }, 4000);
                }
            },
            closeDeleteAlert(methodCalled) {
                if(this.deleteAlertTimeout !== null) {
                    clearTimeout(this.deleteAlertTimeout );
                }
                if(methodCalled === false) {
                    EventBus.$emit(this.imageManipulateAction.DELETED_IMAGE, this.activeImage);
                    this.clearConfigurer();
                } else {
                    EventBus.$emit(this.imageManipulateAction.DELETED_IMAGE, this.activeImage);
                    this.deleteAlertTimeout  = setTimeout(() => {
                        this.clearConfigurer();
                    }, 4000);
                }
            },
            zoomOut () {
                this.activeImage.width = (this.activeImage.width - 5) || 0
            },
            zoomIn () {
                this.activeImage.width = (this.activeImage.width + 5) || 500
            },
            clearConfigurer() {
                this.saveAlertShown = false;
                this.deleteAlertShown = false;
                this.setActiveImage(null);
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
