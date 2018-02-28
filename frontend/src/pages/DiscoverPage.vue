<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

import TheHeader from '../components/TheHeader.vue'

@Component({
    components: {
        TheHeader
    }
})
export default class DiscoverPage extends Vue {

    @Action('getQuiz') getQuiz
    @Action('addNewUserSeenPokemon') addNewSeenPokemon
    @State('currentQuiz') quiz
    @State('currentUser') user

    readyTimer = null
    seenTimeLeft = null
    seenTimer = null
    state = null // valid states: correct|wrong|fled

    get showQuiz() {
        return this.seenTimer !== null && this.seenTimer > 0
    }

    created() {
        this.startReadyCounter()
        this.getQuiz()
    }

    reset() {
        this.state = null
        this.getQuiz()
        this.startReadyCounter()
    }

    pokemonFled() {
        this.state = 'fled'
    }
    pokemonGuessed() {
        this.clearSeenTimer()
        const payload = {
            userId: this.user.id,
            pokemonId: this.quiz.question.id,
        }
        this.addNewSeenPokemon(payload)
        this.state = 'correct'
    }
    pokemonWrong() {
        this.clearSeenTimer()
        this.state = 'wrong'
    }

    selectAnswer(pokemonId) {
        if (this.quiz.question.id === pokemonId) {
            this.pokemonGuessed()
        } else {
            this.pokemonWrong()
        }
    }

    clearSeenTimer() {
        clearInterval(this.seenTimer)
        this.seenTimeLeft = null
    }

    startReadyCounter() {
        let timeLeft = 3
        this.readyTimer = timeLeft
        const timer = setInterval(() => {
            timeLeft -= 1
            this.readyTimer = timeLeft
            if (timeLeft <= 0) {
                this.readyTimer = null
                this.startSeenCounter()
                clearInterval(timer)
            }
        }, 1000)
    }
    startSeenCounter() {
        let timeLeft = 5
        this.seenTimeLeft = timeLeft
        this.seenTimer = setInterval(() => {
            timeLeft -= 1
            this.seenTimeLeft = timeLeft
            if (timeLeft <= 0) {
                this.seenTimeLeft = null
                this.pokemonFled()
                clearInterval(this.seenTimer)
            }
        }, 1000)
    }
}
</script>

<template>
    <div>
        <the-header></the-header>
        <div class="container mx-auto">

            <!-- Message -->
            <div v-if="readyTimer !== null" class="flex flex-col pt-12 h-screen justify-center items-center">
                <span class="text-xl text-white mb-4">Get ready...</span>
                <span class="text-2xl text-white font-bold">{{ readyTimer }}</span>
            </div>

            <!-- Quiz -->
            <div v-else-if="seenTimeLeft !== null && seenTimeLeft > 0" class="pt-12 p-8 h-screen flex flex-col justify-center items-center">
                <span class="text-white mb-8 text-xl">Be quick! Pokémon will flee in <span class="font-bold">{{ seenTimeLeft }}</span>...</span>
                <div class="bg-red shadow rounded p-4 mb-8">
                    <img class="outline-image" :src="quiz.question.image" alt="Question Image">
                </div>
                <span class="text-white text-xl mb-4">What's this pokémon's name?</span>
                <div class="flex flex-wrap justify-around p-4">
                    <button v-for="item in quiz.quizSample" :key="item.id" class="p-4 bg-red text-white w-2/5 shadow mx-2 mb-6 rounded" @click="selectAnswer(item.id)">{{ item.name | capitalize }}</button>
                </div>
            </div>

            <!-- Success -->
            <div v-else-if="state === 'correct'" class="pt-12 p-8 h-screen flex flex-col h-64 justify-center items-center text-white">
                <h3 class="mb-4">Correct!</h3>
                <div class="bg-red shadow rounded p-4 mb-4">
                    <img :src="quiz.question.image" :alt="quiz.question.name">
                </div>
                <span class="mb-8">You've discovered {{ quiz.question.name | capitalize }}!</span>
                <button class="p-4 rounded bg-red text-white shadow" @click="reset">Try another?</button>
            </div>

            <!-- Failed -->
            <div v-else-if="state === 'wrong'" class="pt-12 p-8 h-screen flex flex-col h-64 justify-center items-center text-white">
                <h3 class="mb-4">Nope... That wasn't it.</h3>
                <button class="p-4 rounded bg-red text-white shadow" @click="reset">Try another?</button>
            </div>

            <!-- Fled -->
            <div v-else-if="state === 'fled'" class="pt-12 p-8 h-screen flex flex-col h-64 justify-center items-center text-white">
                <h3 class="mb-4">Dam! It got away.</h3>
                <button class="p-4 rounded bg-red text-white shadow mb-4" @click="reset">Try another?</button>
            </div>
        </div>
    </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.outline-image {

    filter: contrast(0%)

}
</style>
