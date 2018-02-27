<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

import TheHeader from '../components/TheHeader.vue'
import Tile from '../components/Tile.vue'

@Component({
    components: {
        TheHeader,
        Tile
    }
})
export default class SeenPage extends Vue {
}
</script>

<template>
    <div>
        <the-header></the-header>
        <div class="container mx-auto pt-14 p-8">
            <h2 class="text-white my-6 text-center">Indexed Pokémon</h2>

            <div class="flex flex-wrap">
                <div v-for="i in 10" :key="i" class="flex flex-col justify-center items-center bg-red rounded p-4 shadow mb-4 mx-4 w-2/5">
                    <img class="mb-4" src="http://via.placeholder.com/96x96" alt="Pokemon Image">
                    <span class="text-white">Pokemon 1</span>
                </div>
            </div>
        </div>
    </div>
</template>