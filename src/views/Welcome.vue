<template>
    <div id="welcome">
        <div id="center">
            <v-img
                    src="../../public/256x256.png"
                    max-height="256"
                    max-width="256"
                    id="welcome-image"
            ></v-img>
            <v-btn
                    color="primary"
                    dark
                    class="welcome-button"
                    large
                    style="width: 50%;"
            >
                <label for="import-presentation" class="btn" style>Import presentation</label>
                <v-icon>mdi-import</v-icon>
            </v-btn>
            <input type="file" id="import-presentation" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sh" @change="onChange" style="visibility:hidden;">
            <div>
                <v-dialog
                        v-model="dialog"
                        :scrollable="false"
                        max-width="300px"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                                color="primary"
                                dark
                                v-bind="attrs"
                                v-on="on"
                                class="welcome-button"
                                large
                                style="width: 50%;"
                        >

                            New presentation
                            <v-icon>mdi-new-box</v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-text style="height: 67px;">
                            <v-text-field
                                    label="Presentation name"
                                    solo
                                    style="margin-top: 10px; padding-top: 10px"
                                    v-model="presentationName"
                            ></v-text-field>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="dialog = false"
                            >
                                Close
                            </v-btn>
                            <v-btn
                                    color="blue darken-1"
                                    text
                                    @click="createNewPresentation"
                            >
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </div>
        <div>
            <v-btn
                    class="mx-2 install-btn"
                    fab
                    dark
                    large
                    color="primary"
                    id="btnAdd"
            >
                <v-icon dark>
                    mdi-desktop-mac
                </v-icon>
            </v-btn>
            <v-alert
                    dense
                    type="info"
                    v-if="pwaAlreadyInstalled"
            >
                Application is already installed or your browser doesn't support progressive web applications.
            </v-alert>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import readXlsxFile from 'read-excel-file'

    export default {
        name: "Welcome",
        data() {
            return {
                dialog: false,
                presentationName: '',
                pwaAlreadyInstalled: false
            };
        },
        methods: {
            ...mapActions([
                'changeActiveSlide',
                'createNewSlide',
                'setActiveImage',
                'setPresentationAudio',
                'savePresentation',
                'loadPresentation',
                'setPresentationName'
            ]),
        onChange(e) {
            if (!e.target.files.length) return;

            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = async () => {
                const input = document.getElementById('import-presentation');
                readXlsxFile(input.files[0]).then(async (rows) => {
                    await this.loadPresentation(rows[1]);
                    this.$router.push({ path: 'editor', query: { new: false } });
                });
            };
        },
            createNewPresentation() {
                this.dialog = false;
                this.setPresentationName(this.presentationName);
                this.$router.push({ path: 'editor', query: { new: true } });
            }
        },
        mounted() {
            let deferredPrompt;

            window.addEventListener('beforeinstallprompt', function(e) {
                // Prevent Chrome 67 and earlier from automatically showing the prompt
                e.preventDefault();
                // Stash the event so it can be triggered later.
                deferredPrompt = e;
            });

            let btnAdd = document.getElementById('btnAdd');
            btnAdd.addEventListener('click', () => {
                if(!deferredPrompt) {
                    this.pwaAlreadyInstalled = true;
                    return setTimeout(() => {
                        this.pwaAlreadyInstalled = false;
                    }, 4000);
                }
                deferredPrompt.prompt();
                deferredPrompt.userChoice
                    .then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the A2HS prompt');
                        } else {
                            console.log('User dismissed the A2HS prompt');
                        }
                        deferredPrompt = null;
                    });
            });

        }
    }
</script>

<style scoped>
    #welcome {

    }
    #center {
        position: fixed;
        top: 30%;
        left: 50%;
        margin-top: -75px;
        margin-left: -100px;
    }
    .welcome-button {
        margin-bottom: 1%;
        margin-top: 4%;
    }
    #welcome-image {
        margin-top: -15%;
        margin-bottom: 10%;
    }
    #welcome {
        background-color: rgba(	247, 230, 201, 0.3);
    }
    .install-btn {
        position: absolute;
        right: 0;
        bottom: 0;
        margin: 1%;
    }
</style>
