import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'

import { router } from './router'
import { API_URL } from './config'

const client = axios.create({
    baseURL: API_URL
})

Vue.use(Vuex)

const state = {
    currentUser: null,
    currentQuiz: null,
    allPokemon: [],
    seenPokemon: [],
}

const getters = {

    userSeenPokemon(state) {
        if (!state.currentUser || state.seenPokemon.length === 0) {
            return []
        }
        const seenPokemonEntries = state.seenPokemon
        const allPokemon = state.allPokemon

        const seenIds = seenPokemonEntries.map(pokemon => pokemon.pokemonId)
        const seenPokemon = allPokemon.filter(pokemon => {
            return seenIds.includes(pokemon.id)
        })
        return seenPokemon
    }

}

const mutations = {
    setCurrentUser(state, payload) {
        state.currentUser = payload
    },
    clearCurrentUser(state) {
        state.currentUser = null
    },
    setAllPokemon(state, payload) {
        state.allPokemon = payload
    },
    setUserSeenPokemon(state, payload) {
        state.seenPokemon = payload
    },
    clearUserSeenPokemon(state) {
        state.seenPokemon = []
    },
    setCurrentQuiz(state, payload) {
        state.currentQuiz = payload
    }
}

const actions = {

    // Find user or add user
    async login({ commit, dispatch }, payload) {
        try {
            const { data } = await client.get(`/users?username=${payload.username}`)
            if (data.length > 0) {
                const user = data[0]
                commit('setCurrentUser', user)
                dispatch('getUserSeenPokemon', { userId: user.id })
            } else {
                await dispatch('createUser', payload)
            }
            router.push('/dash')
        } catch (e) {
            throw 'Failed to log in.'
        }
    },
    async createUser({ commit, dispatch }, payload) {
        try {
            const { data } = await client.post(`/users`, payload)
            commit('setCurrentUser', data)
            dispatch('getUserSeenPokemon', { userId: data.id })
        } catch (e) {
            throw 'Failed to create user'
        }
    },
    async logout({ commit }) {
        // Clear all local user data
        commit('clearCurrentUser')
        commit('clearUserSeenPokemon')
        router.push('/')
    },

    // Pokemon
    async getAllPokemonData({ commit }) {
        try {
            const { data } = await client.get('/pokemon')
            commit('setAllPokemon', data)
        } catch (e) {
            throw 'Failed to get all Pokemon'
        }
    },

    // User Seen Data
    async getUserSeenPokemon({ commit }, payload) {
        try {
            const { data } = await client.get(`/sightings?userId=${payload.userId}`)
            commit('setUserSeenPokemon', data)
        } catch (e) {
            throw 'Failed to get user seen pokemon'
        }
    },
    async addNewUserSeenPokemon({ state, commit, dispatch }, payload) {
        try {
            await client.post(`/sightings`, payload)
            await dispatch('getUserSeenPokemon')
        } catch (e) {
            throw 'Failed to add new user seen pokemon'
        }
    },

    async getQuiz({ state, commit, getters }) {

        // Find at least 4 pokemon you don't know
        const seenPokemon = getters.userSeenPokemon
        const allPokemon = state.allPokemon
        const seenPokemonIds = seenPokemon.map(item => item.id)
        const unseenPokemon = allPokemon.filter(pokemon => {
            return !seenPokemonIds.includes(pokemon.id)
        })

        const unseenSize = unseenPokemon.length

        if (unseenSize === 0) {
            commit('setCurrentQuiz', null )
            return null
        }

        // if less than 4 unseen, add more samples
        if (unseenSize >= 4) {
            const quizSample = _.sampleSize(unseenPokemon, 4)
            const question = _.sample(quizSample)
            commit('setCurrentQuiz', { question, quizSample })
        } else {
            const question = _.sample(unseenPokemon)
            const quizSample = _.shuffle([
                ..._.sampleSize(unseenPokemon, unseenSize),
                ..._.sampleSize(seenPokemon, 4 - unseenSize)
            ])
            commit('setCurrentQuiz', { question, quizSample })
        }
    }

}


export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})