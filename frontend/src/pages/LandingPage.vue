<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component
export default class LandingPage extends Vue {
  @State('message') message
}
</script>

<template>
  <h1 class="text-center">{{ message }}</h1>
</template>
