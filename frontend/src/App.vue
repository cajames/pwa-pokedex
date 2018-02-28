<script>
import { Vue, Component } from 'vue-property-decorator'
import { Action } from 'vuex-class'

@Component
export default class App extends Vue {
  @Action('getAllPokemonData') getAllPokemonData

  created() {
    this.getAllPokemonData()
  }

}
</script>

<template>
  <div id="app" class="font-sans bg-red-dark min-h-screen">
    <router-view></router-view>
  </div>
</template>
