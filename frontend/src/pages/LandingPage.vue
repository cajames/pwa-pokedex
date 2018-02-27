<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component
export default class LandingPage extends Vue {
  @State('message') message

  user = {
    username: '',
    email: ''
  }

  async submitUsername() {
    // create or find user
    // go to dash
    this.$router.push('/dash')
  }

}
</script>

<template>
  <div class="container mx-auto h-screen p-8 flex flex-col justify-center items-center">
    <img src="../assets/icon.png" class="w-1/2 mb-8" alt="PokeDex">
    <input type="text" v-model="user.username" placeholder="Username" class="w-2/3 mx-auto p-4 rounded mb-4">
    <input type="text" v-model="user.email" placeholder="Email" class="w-2/3 mx-auto p-4 rounded mb-4">
    <button class="w-2/3 mx-auto p-4 rounded bg-red-darkest text-white" @click="submitUsername">Continue</button>
  </div>
</template>
