<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

import TheHeader from '../components/TheHeader.vue'
import Tile from '../components/Tile.vue'
import { EyeOffIcon } from 'vue-feather-icons'

@Component({
    components: {
        TheHeader,
        Tile,
        EyeOffIcon,
    }
})
export default class SeenPage extends Vue {
    @Getter('userSeenPokemon') userSeenPokemon

    get hasSeen() {
        return this.userSeenPokemon && this.userSeenPokemon.length > 0
    }
}
</script>

<template>
    <div>
        <the-header></the-header>
        <div class="container mx-auto pt-14 p-8">
            <h2 v-if="hasSeen" class="text-white my-6 text-center">Discovered Pokémon</h2>

            <!-- Has Seen -->
            <div v-if="hasSeen" class="flex flex-wrap">
                <div v-for="pokemon in userSeenPokemon" :key="pokemon.id" class="flex flex-col justify-center items-center bg-red rounded p-4 shadow mb-4 mx-4 w-2/5">
                    <img class="mb-4" :src="pokemon.image" :alt="pokemon.name">
                    <span class="text-white">{{ pokemon.name | capitalize }}</span>
                </div>
            </div>

            <!-- No Seen -->
            <div v-else class="h-64 flex flex-col mt- items-center justify-center text-white">
                <eye-off-icon class="mb-4 h-8 w-8"></eye-off-icon>
                <span class="mb-8">No pokémon discovered yet!</span>
                <router-link tag="button" to="/discover" class="p-4 bg-red text-white no-underline shadow rounded">Get started?</router-link>
            </div>
        </div>
    </div>
</template>