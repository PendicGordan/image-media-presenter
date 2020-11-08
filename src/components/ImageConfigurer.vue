<template>
    <div class="ImageConfigurer">
        <v-slider
                v-if="activeImage"
                v-model="width"
                class="align-self-stretch slider-width"
                min="0"
                max="500"
                step="1"
        ></v-slider>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';

    export default {
        data: () => ({
            width: "250"
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
                    width: newValue
                });
            }
        },
        methods: {
            ...mapActions([
                'setActiveImage'
            ])
        }
    };
</script>
