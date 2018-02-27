<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

import TheHeader from '../components/TheHeader.vue'
import Tile from '../components/Tile.vue'
import { CameraIcon, LayersIcon, UsersIcon } from 'vue-feather-icons'

@Component({
    components: {
        TheHeader,
        Tile,
        CameraIcon,
        LayersIcon,
        UsersIcon,
    }
})
export default class DashPage extends Vue {

    goToDiscover() {
        this.$router.push('/discover')
    }
    goToSeen() {
        this.$router.push('/seen')
    }
}
</script>

<template>
    <div>
        <the-header></the-header>
        <div class="p-6"></div>
        <div class="container mx-auto h-screen p-8 flex flex-wrap justify-around">
            <tile @click.native="goToDiscover">
                <camera-icon class="w-1/2 mb-2"></camera-icon>
                <span class="text-xl">Discover</span>
            </tile>
            <tile @click.native="goToSeen">
                <layers-icon class="w-1/2 mb-2"></layers-icon>
                <span class="text-xl">Seen</span>
            </tile>
        </div>
    </div>
</template>