<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { HomeIcon } from 'vue-feather-icons'
import { Action } from 'vuex-class'

@Component({
    components: {
        HomeIcon,
    }
})
export default class TheHeader extends Vue {
    @Action('logout') logout
}
</script>

<template>
    <div class="p-4 flex justify-between bg-red shadow-md pin-t w-full fixed">
        <router-link class="text-xl text-white no-underline flex items-center" to="/dash">
            <home-icon class="mr-2"></home-icon>
            <span>Pokédex</span>
        </router-link>
        <button class="text-white flex items-center" @click="logout">
            <span>Logout</span>
        </button>
    </div>
</template>