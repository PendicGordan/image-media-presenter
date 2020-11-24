<template>
    <div id="ImageConfigurer">
        <div v-if="activeImage">
            <div>
                <v-alert
                        v-if="alertShown"
                        dense
                        text
                        type="success"
                        transition="fade-transition"
                        dismissible
                        @input="closeAlert"
                >
                    The image has been saved!
                </v-alert>
            </div>
            <div id="editor" v-if="!alertShown">
                <v-row cols="1" v-if="value === 'basic'">
                    <v-col md>
                        <v-slider
                                v-model="activeImage.width"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="500"
                                step="1"
                        ></v-slider>
                        <v-btn @click="rotateLeft"
                               fab
                               dark
                               color="primary">
                            <v-icon dark>
                                mdi-rotate-right
                            </v-icon>
                        </v-btn>
                        <v-btn @click="rotateRight"
                               fab
                               dark
                               color="primary">
                            <v-icon dark>
                                mdi-rotate-left
                            </v-icon>
                        </v-btn>
                        <v-slider
                                v-model="activeImage.rotation"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="360"
                                step="1"
                                :thumb-size="24"
                                thumb-label="always"
                        >
                        </v-slider>
                        <v-slider
                                v-model="activeImage.roundFactor"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="50"
                                step="1"
                        >
                        </v-slider>
                    </v-col>
                </v-row>
                <v-row cols="2" v-else-if="value === 'filter'">
                    <v-col md>
                        <v-slider
                                v-model="activeImage.blurringLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                        <v-slider
                                v-model="activeImage.sepiaLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                        <v-slider
                                v-model="activeImage.saturationLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                        <v-slider
                                v-model="activeImage.invertLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                        <v-slider
                                v-model="activeImage.opacityLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
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
                        >
                        </v-slider>
                        <v-slider
                                v-model="activeImage.contrastLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
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
                    v-if="!alertShown"
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
            </v-bottom-navigation>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import EventBus from '../helpers/eventBus';

    export default {
        data: () => ({
            value: 'basic',
            alertShown: false,
            alertTimeout: null
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
                if(this.alertTimeout !== null) {
                    clearTimeout(this.alertTimeout);
                    this.clearImageAndAlert();
                    this.value = 'basic';
                }
            });
        },
        methods: {
            ...mapActions([
                'setActiveImage',
                'setBackgroundImage',
                'saveActiveImageData'
            ]),
            saveAndClearImage () {
                this.saveActiveImageData(this.activeImage);
                this.alertShown = true;
                this.closeAlert(true);
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
            closeAlert (methodCalled) {
                if(this.alertTimeout !== null) {
                    clearTimeout(this.alertTimeout);
                }
                if(methodCalled === false) {
                    this.clearConfigurer();
                } else {
                    this.alertTimeout = setTimeout(() => {
                        this.clearConfigurer();
                    }, 4000);
                }
            },
            clearConfigurer() {
                this.clearImageAndAlert();
                EventBus.$emit('SAVED_IMAGE');
            },
            clearImageAndAlert() {
                this.alertShown = false;
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
        position: fixed;
        bottom: 0;
        z-index: 999
    }
    #editor {
        max-width: 80%;
        margin: auto;
    }
</style>
