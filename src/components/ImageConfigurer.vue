<template>
    <div id="ImageConfigurer">
        <div v-if="activeImage">
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
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';

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
                opacityLevel: 50
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
            activeImage(newValue) {
                this.imageData = newValue;
            }
        },
        methods: {
            ...mapActions([
                'setActiveImage'
            ]),
            rotateRight() {
                this.imageData.rotation = this.imageData.rotation - 90 >= 0 ? this.imageData.rotation - 90 + "" : 360 - Math.abs(this.imageData.rotation - 90);
                this.setActiveImage(this.imageData);
            },
            rotateLeft() {
                this.imageData.rotation = this.imageData.rotation + 90 < 360 ? this.imageData.rotation + 90 + "" : (this.imageData.rotation + 90) % 360 + "";
                this.setActiveImage(this.imageData);
            }
        }
    };
</script>
<style scoped>
    #ImageConfigurer {
        max-width: 50%;
        margin: auto;
    }
</style>
