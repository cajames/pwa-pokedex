<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

import TheHeader from '../components/TheHeader.vue'
import Tile from '../components/Tile.vue'
import { CameraIcon, LayersIcon, UsersIcon, UploadCloudIcon } from 'vue-feather-icons'
import { State, Action } from 'vuex-class'

@Component({
    components: {
        TheHeader,
        Tile,
        CameraIcon,
        LayersIcon,
        UsersIcon,
        UploadCloudIcon,
    }
})
export default class DashPage extends Vue {

    @State('pendingUpdates') pendingUpdates
    @Action('uploadPending') uploadPending

    get showPending() {
        return this.pendingUpdates && this.pendingUpdates.length > 0
    }

    get pendingLength() {
        return this.showPending && this.pendingUpdates.length
    }

    goToDiscover() {
        this.$router.push('/discover')
    }
    goToSeen() {
        this.$router.push('/seen')
    }
    goToList() {
        this.$router.push('/list')
    }
}
</script>

<template>
    <div>
        <the-header></the-header>
        <div class="p-6"></div>
        <div class="container mx-auto p-8 flex flex-wrap justify-around">
            <tile class="mb-4" @click.native="goToDiscover">
                <camera-icon class="w-1/2 mb-2"></camera-icon>
                <span class="text-xl">Discover</span>
            </tile>
            <tile class="mb-4" @click.native="goToSeen">
                <layers-icon class="w-1/2 mb-2"></layers-icon>
                <span class="text-xl">Seen</span>
            </tile>
            <tile class="mb-4" @click.native="goToList">
                <users-icon class="w-1/2 mb-2"></users-icon>
                <span class="text-xl">Leaders</span>
            </tile>
            <tile class="mb-4" v-if="showPending" @click.native="uploadPending">
                <upload-cloud-icon class="w-1/2 mb-2"></upload-cloud-icon>
                <span class="text-xl">Upload Pending ({{ pendingLength }})</span>
            </tile>
        </div>
    </div>
</template>