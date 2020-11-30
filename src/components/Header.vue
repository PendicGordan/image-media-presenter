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
                    @click="toggleMenu"
                    text
            >
                <span class="mr-2">Latest Release</span>
                <v-icon>mdi-open-in-new</v-icon>
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

    export default {
        name: 'Header',
        data() {
            return {
                hoverLayout: [1, 2],
                showLayout: false
            };
        },
        components: {
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
            }
        },
        props: {
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
