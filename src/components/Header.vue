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
                    @click="saveCurrentSlide"
            >
                Save slide
            </v-btn>
        </div>
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
        <div>
            <v-btn
                    class="mx-2"
                    fab
                    dark
                    color="teal"
                    @click="toggleManagementMenu"
            >
                <v-icon dark>
                    mdi-format-list-bulleted-square
                </v-icon>
            </v-btn>
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
                currentSlideId: 1
            };
        },
        computed: {
            ...mapState([
                'slides',
                'activeSlide'
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
            toggleManagementMenu() {
                this.toggleActionMenu = !this.toggleActionMenu;
                EventBus.$emit('TOGGLE_ACTION_MENU', this.toggleActionMenu)
            },
            saveCurrentSlide() {
                console.log(this.activeSlide);
            },
            ...mapActions([
                'changeActiveSlide',
                'createNewSlide'
            ])
        },
        watch: {
            activeSlide(newValue) {
                this.currentSlideId = newValue.text;
            }
        },
        mounted() {
            this.currentSlideId = this.activeSlide ? this.activeSlide.text : null;
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
