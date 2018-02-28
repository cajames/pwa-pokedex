<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Action,  State } from 'vuex-class'

import TheHeader from '../components/TheHeader.vue'

@Component({
    components: {
        TheHeader
    }
})
export default class ListingPage extends Vue {
    @Action('getUserListing') getUserListing
    @State('userListing') userListing

    timer = null

    created() {
        this.timer = setInterval(() => {
            this.getUserListing()
        }, 10000)
    }

    beforeDestroy() {
        clearInterval(this.timer)
    }
}
</script>

<template>
   <div>
        <the-header></the-header>
        <div class="p-6"></div>
        <div class="container mx-auto p-8 flex flex-col items-stretch">
            <h2 class="text-center text-white mb-8">Users List</h2>

            <div class="flex items-center justify-around text-white font-bold px-4 py-2 border-b">
                <span>Username</span>
                <span>Points</span>
            </div>
            <div v-for="user in userListing" :key="user.username" class="flex items-center justify-around text-white px-4 py-2 border-b">
                <span class="px-2">{{ user.username }}</span>
                <span class="px-2">{{ user.count }}</span>
            </div>
        </div>
    </div> 
</template>