<template>
    <div id="welcome">
        <div>
            <label for="import-presentation" class="btn" style>Load presentation</label>
        </div>
        <input type="file" id="import-presentation" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sh" @change="onChange" style="visibility:hidden;">
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import readXlsxFile from 'read-excel-file'

    export default {
        name: "Welcome",
        data() {
            return {};
        },
        methods: {
            ...mapActions([
                'changeActiveSlide',
                'createNewSlide',
                'setActiveImage',
                'setPresentationAudio',
                'savePresentation',
                'loadPresentation'
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
                    this.$router.push({ path: 'editor' });
                });

                /*console.log(src);
                const buf = Buffer.from(src, 'base64');
                const sheet = xlsx.read(buf, { type: 'buffer' });
                console.log(sheet);*/
            };
        }
        }
    }
</script>

<style scoped>

</style>
