<script>
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TheHeader extends Vue {
}
</script>

<template>
    <div class="p-4 flex justify-between bg-red shadow-md pin-t w-full fixed">
        <router-link class="text-xl text-white no-underline" to="/dash">Pokédex</router-link>
    </div>
</template>