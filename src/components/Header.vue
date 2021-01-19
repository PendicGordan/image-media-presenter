<template>
    <v-app-bar
            app
            color="primary"
            dark
            id="header"
            v-if="!presentationModeActive"
    >
        <div class="">
            <v-btn depressed color="primary" @click="goInFullscreen">Play Presentation</v-btn>
        </div>
        <div>
            <v-select
                    :items="autosliding.timeLengthsInSeconds"
                    label="Time length"
                    @change="changeSlideTimer"
                    v-model="autosliding.currentTimeLengthInSeconds"
                    :disabled="!autosliding.autoslideEnabled"
            >
            </v-select>
        </div>
        <div>
            <v-checkbox
                    v-model="autosliding.autoslideEnabled"
                    label="Autoslide"
                    color="indigo"
                    hide-details
            ></v-checkbox>
        </div>
        <div>
            <v-checkbox
                    v-model="autosliding.reverse"
                    label="Reverse autosliding"
                    color="indigo"
                    hide-details
                    :disabled="!autosliding.autoslideEnabled"
            ></v-checkbox>
        </div>
        <div style="margin-right: 1%;" >
            <v-checkbox
                    v-model="autosliding.playMusic"
                    label="Play music"
                    color="indigo"
                    hide-details
            ></v-checkbox>
        </div>
        <v-divider
                vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <div style="margin-left: 1%;">
            <v-select
                    :items="audios"
                    label="Audio Name"
                    @change="changeAudio"
                    v-model="currentAudio"
            >
            </v-select>
        </div>
        <div style="margin-right: 0.25%; margin-left: 0.5%">
            <v-btn depressed color="primary" @click="playSound" :disabled="audio == null"><v-icon>mdi-play</v-icon></v-btn>
        </div>
        <div style="margin-right: 0.25%;">
            <v-btn depressed color="primary" @click="stopSound" :disabled="audio == null"><v-icon>mdi-stop</v-icon></v-btn>
        </div>
        <div style="margin-right: 1%;">
            <v-btn depressed color="primary" @click="pauseSound" :disabled="audio == null"><v-icon>mdi-pause</v-icon></v-btn>
        </div>
        <v-divider
                vertical
        ></v-divider>
        <div style="padding: 1%;">
            <v-btn
                    depressed
                    color="primary"
                    @click="createNewSlide"
            >
                <v-icon>mdi-shape-square-plus</v-icon>
            </v-btn>
        </div>
        <div style="padding: 1%;">
            <v-btn
                    depressed
                    color="primary"
                    @click="savePresentation"
            >
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
        </div>
        <div style="padding: 1%;">
            <v-select
                    :items="slides"
                    label="Slide No."
                    @change="changeSlide"
                    v-model="currentSlideId"
                    class="margin: 1%;"
            >
            </v-select>
        </div>
        <div>
            <v-btn
                    @click="toggleMenu"
                    text
            >
                <span class="mr-2">Choose layout</span>
                <v-icon>mdi-grid</v-icon>
            </v-btn>
            <table id="layoutTable" style="position: absolute; color: white; text-align: center; z-index: 11; padding-top: 10px;" v-if="showLayout" >
                <tr>
                    <td :class="{'selectedLayout': hoverLayout[0] >= 1 && hoverLayout[1] >= 1 }"
                        @mouseover="hoverLayout = [1,1]" @mouseleave="hoverLayout = [0,0]"
                        @click="changeLayout(1,1)">1x1</td>
                    <td :class="{'selectedLayout': hoverLayout[0] >= 1 && hoverLayout[1] >= 2 }"
                        @mouseover="hoverLayout = [1,2]" @mouseleave="hoverLayout = [0,0]"
                        @click="changeLayout(1,2)">1x2</td>
                    <td :class="{'selectedLayout': hoverLayout[0] >= 1 && hoverLayout[1] >= 3 }"
                        @mouseover="hoverLayout = [1,3]" @mouseleave="hoverLayout = [0,0]"
                        @click="changeLayout(1,3)">1x3</td>
                </tr>
                <tr>
                    <td :class="{'selectedLayout': hoverLayout[0] >= 2 && hoverLayout[1] >= 1 }"
                        @mouseover="hoverLayout = [2,1]" @mouseleave="hoverLayout = [0,0]"
                        @click="changeLayout(2,1)">2x1</td>
                    <td :class="{'selectedLayout': hoverLayout[0] >= 2 && hoverLayout[1] >= 2 }"
                        @mouseover="hoverLayout = [2,2]" @mouseleave="hoverLayout = [0,0]"
                        @click="changeLayout(2,2)">2x2</td>
                    <td :class="{'selectedLayout': hoverLayout[0] >= 2 && hoverLayout[1] >= 3 }"
                        @mouseover="hoverLayout = [2,3]" @mouseleave="hoverLayout = [0,0]"
                        @click="changeLayout(2,3)">2x3</td>
                </tr>
                <tr>
                    <td :class="{'selectedLayout': hoverLayout[0] >= 3 && hoverLayout[1] >= 1 }"
                        @mouseover="hoverLayout = [3,1]" @mouseleave="hoverLayout = [0,0]"
                        @click="changeLayout(3,1)">3x1</td>
                    <td :class="{'selectedLayout': hoverLayout[0] >= 3 && hoverLayout[1] >= 2 }"
                        @mouseover="hoverLayout = [3,2]" @mouseleave="hoverLayout = [0,0]"
                        @click="changeLayout(3,2)">3x2</td>
                    <td :class="{'selectedLayout': hoverLayout[0] >= 3 && hoverLayout[1] >= 3 }"
                        @mouseover="hoverLayout = [3,3]" @mouseleave="hoverLayout = [0,0]"
                        @click="changeLayout(3,3)">3x3</td>
                </tr>
            </table>
        </div>
    </v-app-bar>
</template>

<script>
    import EventBus from "../helpers/eventBus";
    import { mapState, mapActions } from 'vuex';

    export default {
        name: 'Header',
        data() {
            return {
                hoverLayout: [1, 2],
                showLayout: false,
                toggleActionMenu: false,
                currentSlideId: 1,
                audios: ['audio_1', 'audio_2', 'audio_3'],
                currentAudio: '',
                audio: null,
                autoslidingInterval: null
            };
        },
        computed: {
            ...mapState([
                'slides',
                'activeSlide',
                'presentationAudio',
                'presentationModeActive',
                'autosliding'
            ])
        },
        methods: {
            itemTitle(item) {
                let result = item.i;
                if (item.static) {
                    result += " - Static";
                }
                return result;
            },
            toggleMenu() {
                this.showLayout = !this.showLayout;
            },
            changeLayout(rows, columns) {
                EventBus.$emit('CHANGE_LAYOUT', { rows, columns });
            },
            changeSlide(e) {
                this.changeActiveSlide(e);
            },
            changeAudio(e) {
                this.currentAudio = e;
                if(this.audio)
                    this.audio.pause();
                this.audio = null;
                this.setPresentationAudio(this.currentAudio);
                this.audio = new Audio(require('./../assets/audio/' + this.currentAudio + '.mp3'));
            },
            saveCurrentSlide() {
                console.log('console current slide');
            },
            ...mapActions([
                'changeActiveSlide',
                'createNewSlide',
                'setActiveImage',
                'setPresentationAudio',
                'savePresentation',
                'loadPresentation',
                'togglePresentationMode',
                'setCurrentTimeLengthInSeconds',
                'setAutoslideEnabled',
                'setReverse',
                'setPlayMusic'
            ]),
            playSound() {
                this.audio.play();
            },
            pauseSound() {
                this.audio.pause();
            },
            stopSound() {
                this.audio.pause();
                this.audio.currentTime = 0;
            },
            async goInFullscreen() {
                // TODO: update autoslide and time length of the slide in the store and play the presentation with the time slot if the autoslide is enabled
                // TODO: make reverse mode in auto sliding mode of the slides
                this.togglePresentationMode();
                if(this.autosliding.playMusic && this.presentationAudio) {
                    this.changeAudio(this.presentationAudio);
                    this.playSound();
                }
                if(this.autosliding.autoslideEnabled) {
                    document.getElementById('header').dispatchEvent(new KeyboardEvent('keydown',{'key':'ArrowRight'}));
                    this.autoslidingInterval = setInterval(() => {
                        const reversePresentationMode = this.autosliding.reverse;
                        if(reversePresentationMode) {
                            this.changeActiveSlide((this.activeSlide.text - 1) % (this.slides.length + 2));
                        } else {
                            this.changeActiveSlide((this.activeSlide.text + 1) % (this.slides.length + 2));
                        }
                        if(this.activeSlide.text === 1) this.setReverse(false);
                        if(this.activeSlide.text === this.slides.length) this.setReverse(true);
                    }, this.autosliding.currentTimeLengthInSeconds * 1000)
                }
                EventBus.$emit('DESELECT_IMAGES');
                const element = document.getElementById('app');
                if (element.requestFullscreen)
                    element.requestFullscreen();
                else if (element.mozRequestFullScreen)
                    element.mozRequestFullScreen();
                else if (element.webkitRequestFullscreen)
                    element.webkitRequestFullscreen();
                else if (element.msRequestFullscreen)
                    element.msRequestFullscreen();
            },
            changeSlideTimer(e) {
                this.setCurrentTimeLengthInSeconds(e);
            }
        },
        watch: {
            activeSlide(newValue) {
                this.setActiveImage(null);
                this.currentSlideId = newValue.text;
            },
            'autosliding.autoslideEnabled'(newValue) {
                this.setAutoslideEnabled(newValue);
            },
            'autosliding.reverse'(newValue) {
                this.setReverse(newValue);
            },
            'autosliding.playMusic'(newValue) {
                this.setPlayMusic(newValue);
            },
            presentationAudio(newValue) {
                this.currentAudio = newValue;
            }
        },
        mounted() {
            EventBus.$on('PRESENTATION_FINISHED', () => {
                if(this.autoslidingInterval) clearInterval(this.autoslidingInterval);
                if(this.audio)
                    this.stopSound();
            });
            this.currentSlideId = this.activeSlide ? this.activeSlide.text : null;
            this.currentAudio = this.presentationAudio;
        }
    };
</script>
<style scoped>
    #header {
        z-index: 999;
        padding-top: 1%;
    }
    #layoutTable {
        width: 200px;
        height: 200px;
        background-color: white;
        margin: 0 auto;
        border-radius: 20px;
    }

    #layoutTable td {
        background-color: #dddddd;
        border-radius: 10%;
        font-size: 20px;
        color: black;
        cursor: pointer;
    }
    .selectedLayout {
        box-shadow: 0 0 3px #ff932b;
        background-color: #bcbcbc;
    }
</style>
