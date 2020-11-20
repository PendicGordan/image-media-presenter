<template>
    <div id="ImageConfigurer">
        <div v-if="activeImage">
            <div id="editor">
                <v-row cols="1" v-if="value === 'basic'">
                    <v-col md>
                        <v-slider
                                v-model="imageData.width"
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
                                v-model="imageData.rotation"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="360"
                                step="1"
                                :thumb-size="24"
                                thumb-label="always"
                        >
                        </v-slider>
                        <v-slider
                                v-model="imageData.roundFactor"
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
                                v-model="imageData.blurringLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                        <v-slider
                                v-model="imageData.sepiaLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                        <v-slider
                                v-model="imageData.saturationLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                        <v-slider
                                v-model="imageData.invertLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                        <v-slider
                                v-model="imageData.opacityLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                    </v-col>
                    <v-col md>
                        <v-slider
                                v-model="imageData.brightnessLevel"
                                class="align-self-stretch slider-width"
                                min="0"
                                max="100"
                                step="1"
                        >
                        </v-slider>
                        <v-slider
                                v-model="imageData.contrastLevel"
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
                                v-model="imageData.isBackgroundImage"
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
            >
                <v-btn value="basic">
                    <span>Recents</span>

                    <v-icon>mdi-history</v-icon>
                </v-btn>

                <v-btn value="filter">
                    <span>Favorites</span>

                    <v-icon>mdi-heart</v-icon>
                </v-btn>

                <v-btn value="other">
                    <span>Nearby</span>
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
            imageData: {
                uuid: null,
                src: null,
                width: "0",
                rotation: "0",
                positionX: 0,
                positionY: 0,
                roundFactor: 0,
                blurringLevel: 0,
                sepiaLevel: 0,
                saturationLevel: 60,
                invertLevel: 0,
                opacityLevel: 50,
                brightnessLevel: 100,
                contrastLevel: 100,
                isBackgroundImage: null
            },
            value: 0
        }),
        props: {
        },
        computed: {
            ...mapState([
                'activeImage'
            ])
        },
        watch: {
            'imageData.width'(newValue) {
                if(this.imageData) {
                    this.imageData.width = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            'imageData.rotation'(newValue) {
                if(this.imageData) {
                    this.imageData.rotation = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            'imageData.roundFactor'(newValue) {
                if(this.imageData) {
                    this.imageData.roundFactor = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            'imageData.blurringLevel'(newValue) {
                if(this.imageData) {
                    this.imageData.blurringLevel = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            'imageData.sepiaLevel'(newValue) {
                if(this.imageData) {
                    this.imageData.sepiaLevel = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            'imageData.saturationLevel'(newValue) {
                if(this.imageData) {
                    this.imageData.saturationLevel = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            'imageData.invertLevel'(newValue) {
                if(this.imageData) {
                    this.imageData.invertLevel = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            'imageData.opacityLevel'(newValue) {
                if(this.imageData) {
                    this.imageData.opacityLevel = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            'imageData.brightnessLevel'(newValue) {
                if(this.imageData) {
                    this.imageData.brightnessLevel = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            'imageData.isBackgroundImage'(newValue) {
                if(this.imageData) {
                    this.imageData.isBackgroundImage = newValue;
                    this.setActiveImage(this.imageData);
                }
            },
            activeImage(newValue) {
                this.imageData = newValue;
            }
        },
        methods: {
            ...mapActions([
                'setActiveImage',
                'setBackgroundImage'
            ]),
            rotateRight() {
                this.imageData.rotation = this.imageData.rotation - 90 >= 0 ? this.imageData.rotation - 90 + "" : 360 - Math.abs(this.imageData.rotation - 90);
                this.setActiveImage(this.imageData);
            },
            rotateLeft() {
                this.imageData.rotation = this.imageData.rotation + 90 < 360 ? this.imageData.rotation + 90 + "" : (this.imageData.rotation + 90) % 360 + "";
                this.setActiveImage(this.imageData);
            },
            activateFilterAnimation() {
                EventBus.$emit('ANIMATE_IMAGE', { uuid: this.imageData.uuid });
            },
            handleImageBackground(e) {
                this.setBackgroundImage({
                    isEnabled: e,
                    backgroundImage: this.imageData.src
                });
                EventBus.$emit('BACKGROUND_IMAGE_SET', {
                    uuid: this.imageData.uuid,
                    isEnabled: e
                });
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
