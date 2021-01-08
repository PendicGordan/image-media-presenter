<template>
    <div id="welcome">
        <div>
            <label for="import-presentation" class="btn" style>Load presentation</label>
        </div>
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
                    >
                        Open Dialog
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
</template>

<script>
    import { mapActions } from 'vuex';
    import readXlsxFile from 'read-excel-file'

    export default {
        name: "Welcome",
        data() {
            return {
                dialog: false,
                presentationName: ''
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
                //const src = e.target.result;

                const input = document.getElementById('import-presentation');
                readXlsxFile(input.files[0]).then(async (rows) => {
                    // `rows` is an array of rows
                    // each row being an array of cells.
                    await this.loadPresentation(rows[1]);
                    this.$router.push({ path: 'editor', query: { new: false } });
                });

                /*console.log(src);
                const buf = Buffer.from(src, 'base64');
                const sheet = xlsx.read(buf, { type: 'buffer' });
                console.log(sheet);*/
            };
        },
            createNewPresentation() {
                this.dialog = false;
                this.setPresentationName(this.presentationName);
                this.$router.push({ path: 'editor', query: { new: true } });
            }
        }
    }
</script>

<style scoped>

</style>
