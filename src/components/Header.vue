<template>
    <v-app-bar
            app
            color="primary"
            dark
            id="header"
    >
        <div class="d-flex align-center">

        </div>

        <v-spacer></v-spacer>
        <div>
            <v-select
                    :items="audios"
                    label="Audio Name"
                    @change="changeAudio"
                    v-model="currentAudio"
            >
            </v-select>
        </div>
        <div>
            <v-btn depressed color="primary" @click="playSound" :disabled="audio == null">Play Sound</v-btn>
            <v-btn depressed color="primary" @click="stopSound" :disabled="audio == null">Stop Sound</v-btn>
            <v-btn depressed color="primary" @click="pauseSound" :disabled="audio == null">Pause Sound</v-btn>
        </div>
        <div>
            <v-btn
                    depressed
                    color="primary"
                    @click="createNewSlide"
            >
                New slide
            </v-btn>
        </div>
        <div>
            <v-btn
                    depressed
                    color="primary"
                    @click="savePresentation"
            >
                Save presentation
            </v-btn>
        </div>
        <div>
            <label for="import-presentation" class="btn" style>Load presentation</label>
        </div>
        <input type="file" id="import-presentation" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sh" @change="onChange" style="visibility:hidden;">
        <div>
            <v-select
                    :items="slides"
                    label="Slide No."
                    @change="changeSlide"
                    v-model="currentSlideId"
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
    import readXlsxFile from 'read-excel-file'

    export default {
        name: 'Header',
        data() {
            return {
                hoverLayout: [1, 2],
                showLayout: false,
                toggleActionMenu: false,
                currentSlideId: 1,
                audios: ['audio_1', 'audio_2'],
                currentAudio: '',
                audio: null
            };
        },
        computed: {
            ...mapState([
                'slides',
                'activeSlide',
                'presentationAudio'
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
                'loadPresentation'
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
            onChange(e) {
                if (!e.target.files.length) return;

                let file = e.target.files[0];
                let reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = async () => {
                    //const src = e.target.result;

                    const input = document.getElementById('import-presentation');
                    readXlsxFile(input.files[0]).then((rows) => {
                        // `rows` is an array of rows
                        // each row being an array of cells.
                        this.loadPresentation(rows[1]);
                    });

                    /*console.log(src);
                    const buf = Buffer.from(src, 'base64');
                    const sheet = xlsx.read(buf, { type: 'buffer' });
                    console.log(sheet);*/
                };
            }
        },
        watch: {
            activeSlide(newValue) {
                this.setActiveImage(null);
                this.currentSlideId = newValue.text;
            }
        },
        mounted() {
            this.currentSlideId = this.activeSlide ? this.activeSlide.text : null;
            this.currentAudio = this.presentationAudio;
        }
    };
</script>
<style scoped>
    #header {
        z-index: 999;
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
