<script>
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

@Component
export default class LandingPage extends Vue {
  @Action('login') login
  @State('currentUser') currentUser

  user = {
    username: '',
    email: ''
  }

  async submitUsername() {
    // create or find user
    this.login(this.user)
  }

  mounted() {
    console.log('Current User', this.currentUser)
  }

  @Watch('currentUser')
  onCurrentUserChange(newVal, oldVal) {
    if (newVal) {
      this.$router.push('/dash')
    }
  }

}
</script>

<template>
  <div class="container mx-auto max-w-sm h-screen p-8 flex flex-col justify-center items-center">
    <img src="../assets/icon.png" class="w-1/2 mb-8" alt="PokeDex">
    <input type="text" v-model="user.username" placeholder="Username" @keyup.enter="submitUsername" class="w-2/3 mx-auto p-4 rounded mb-4">
    <button class="w-2/3 mx-auto p-4 rounded bg-red-darkest text-white" @click="submitUsername">Continue</button>
  </div>
</template>
