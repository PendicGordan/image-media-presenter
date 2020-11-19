<template>
    <div id="ImageConfigurer">
        <div v-if="activeImage">
            <v-slider
                    v-model="width"
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
                    mdi-rotate-left
                </v-icon>
            </v-btn>
            <v-btn @click="rotateRight"
                   fab
                   dark
                   color="primary">
                <v-icon dark>
                    mdi-rotate-right
                </v-icon>
            </v-btn>
            <v-slider
                    v-model="rotation"
                    class="align-self-stretch slider-width"
                    min="0"
                    max="360"
                    step="1.0"
                    :thumb-size="24"
                    thumb-label="always"
            >
            </v-slider>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        data: () => ({
            width: "250",
            rotation: "0"
        }),
        props: {
        },
        computed: {
            ...mapState([
                'activeImage'
            ])
        },
        watch: {
            width(newValue) {
                console.log('tttt');
                this.setActiveImage({
                    src: this.activeImage.src,
                    width: newValue,
                    rotation: this.activeImage.rotation
                });
            },
            rotation(newValue) {
                console.log('rrrrr');
                this.setActiveImage({
                    src: this.activeImage.src,
                    width: this.activeImage.width,
                    rotation: newValue
                });
            }
        },
        methods: {
            ...mapActions([
                'setActiveImage'
            ]),
            rotateRight() {
                this.setActiveImage({
                    src: this.activeImage.src,
                    width: this.activeImage.width,
                    rotation: this.activeImage.rotation - 90 >= 0 ? this.activeImage.rotation - 90 + "" : 270
                });
                this.rotation = this.rotation - 90 >= 0 ? this.rotation - 90 + "" : 270;
            },
            rotateLeft() {
                this.setActiveImage({
                    src: this.activeImage.src,
                    width: this.activeImage.width,
                    rotation: this.activeImage.rotation + 90 !== 360 ? this.activeImage.rotation + 90 + "" : 0 + ""
                });
                this.rotation = this.rotation + 90 !== 360 ? this.rotation + 90 + "" : 0 + ""
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
