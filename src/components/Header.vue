<template>
    <v-app-bar
            app
            color="primary"
            dark
            id="header"
    >
        <div class="d-flex align-center">
            <v-img
                    alt="Vuetify Logo"
                    class="shrink mr-2"
                    contain
                    src="256x256.png"
                    transition="scale-transition"
                    width="40"
            />
        </div>

        <v-spacer></v-spacer>

        <v-btn
                href="https://github.com/vuetifyjs/vuetify/releases/latest"
                target="_blank"
                text
        >
            <span class="mr-2">Latest Release</span>
            <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
    export default {
        name: 'Header',
        props: {
        },
    };
</script>
<style scoped>
    #header {
        z-index: 999;
    }
</style>
