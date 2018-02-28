<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

import TheHeader from '../components/TheHeader.vue'
import Tile from '../components/Tile.vue'

@Component({
    components: {
        TheHeader,
        Tile
    }
})
export default class SeenPage extends Vue {
    @Getter('userSeenPokemon') userSeenPokemon
}
</script>

<template>
    <div>
        <the-header></the-header>
        <div class="container mx-auto pt-14 p-8">
            <h2 class="text-white my-6 text-center">Indexed Pokémon</h2>

            <div class="flex flex-wrap">
                <div v-for="pokemon in userSeenPokemon" :key="pokemon.id" class="flex flex-col justify-center items-center bg-red rounded p-4 shadow mb-4 mx-4 w-2/5">
                    <img class="mb-4" :src="pokemon.image" :alt="pokemon.name">
                    <span class="text-white">{{ pokemon.name | capitalize }}</span>
                </div>
            </div>
        </div>
    </div>
</template>