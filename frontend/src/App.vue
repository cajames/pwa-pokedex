<script>
import { Vue, Component } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

@Component
export default class App extends Vue {
  @Action('getAllPokemonData') getAllPokemonData
  @Action('initStore') initStore
  @State('allPokemon') allPokemon

  created() {
    this.initStore()
      .then(() => {
        if (this.allPokemon) {
          this.getAllPokemonData()
        }
      })
  }

}
</script>

<template>
  <div id="app" class="font-sans bg-red-dark min-h-screen">
    <router-view></router-view>
  </div>
</template>
