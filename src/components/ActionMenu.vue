<template>
    <div style="width: 12%; position: absolute; right: 0; top: 0; margin-right: 0; padding-right: 0">
        <v-card height="350px">
            <v-navigation-drawer
                    absolute
                    permanent
                    right
            >
                <v-list dense>
                    <v-list-item
                            v-for="item in items"
                            :key="item.title"
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: 'ActionMenu',
        data () {
            return {
                items: [
                    { title: 'New Slide', icon: 'mdi-new-box' },
                    { title: 'My Account', icon: 'mdi-account' },
                    { title: 'Users', icon: 'mdi-account-group-outline' },
                ],
            }
        }
    };
</script>
<style scoped>

</style>
