<script>
import { Vue, Component } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

@Component
export default class App extends Vue {
  @Action('getAllPokemonData') getAllPokemonData
  @Action('initStore') initStore
  @Action('loadPokemonImages') loadPokemonImages
  @State('allPokemon') allPokemon

  created() {

    try {
      this.initStore().then(() => {
        return this.getAllPokemonData()
      })
    } catch (error) {
      console.error(error)
    }
  }

}
</script>

<template>
  <div id="app" class="font-sans bg-red-dark min-h-screen">
    <router-view></router-view>
  </div>
</template>
