import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'

import { router } from './router'
import { API_URL } from './config'

import { dbSet, dbGet } from './idb'

const client = axios.create({
    baseURL: API_URL
})

Vue.use(Vuex)

const state = {
    currentUser: null,
    currentQuiz: null,
    pendingUpdates: [],
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
        dbSet('currentUser', null)
    },
    setAllPokemon(state, payload) {
        state.allPokemon = payload
    },
    setUserSeenPokemon(state, payload) {
        state.seenPokemon = payload
    },
    clearUserSeenPokemon(state) {
        state.seenPokemon = []
        dbSet('seenPokemon', [])
    },
    setCurrentQuiz(state, payload) {
        state.currentQuiz = payload
    },
    setPendingUpdates(state, payload) {
        state.pendingUpdates = payload
    }
}

const actions = {

    // Find user or add user
    async login({ commit, dispatch }, payload) {
        try {

            if (!payload.username) {
                throw 'No username'
            }

            const { data } = await client.get(`/users?username=${payload.username}`)
            if (data.length > 0) {
                const user = data[0]
                commit('setCurrentUser', user)
                await dbSet('currentUser', user)
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
        await dbSet('pendingUpdates', null)
        router.push('/')
    },

    // Pokemon
    async getAllPokemonData({ commit }) {
        try {
            const { data } = await client.get('/pokemon')
            commit('setAllPokemon', data)
            await dbSet('allPokemon', data)
        } catch (e) {
            throw 'Failed to get all Pokemon'
        }
    },

    // User Seen Data
    async getUserSeenPokemon({ commit }, payload) {
        try {
            const { data } = await client.get(`/sightings?userId=${payload.userId}`)
            commit('setUserSeenPokemon', data)
            await dbSet('seenPokemon', data)
        } catch (e) {
            throw 'Failed to get user seen pokemon'
        }
    },
    async addNewUserSeenPokemon({ state, commit, dispatch }, payload) {

        try {

            const pokemonIds = state.allPokemon.map(item => item.id)
            if (!pokemonIds.includes(payload.pokemonId)) {
                throw 'Incorrect pokemon id.'
            }
            if (payload.userId !== state.currentUser.id) {
                throw 'Mismatched User.'
            }

            await dispatch('addToPending', payload)
            await client.post(`/sightings`, payload)
            await dispatch('removeFromPending', payload)

            await dispatch('getUserSeenPokemon', { userId: payload.userId })

        } catch (e) {
            console.error(e)
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
    },

    async addToPending({ state, commit }, payload) {
        try {
            const pendingUpdates = await dbGet('pendingUpdates') || []
            await dbSet('pendingUpdates', [...pendingUpdates, payload])
            commit('setPendingUpdates', [...pendingUpdates, payload])
        } catch (e) {
            console.error(e)
            throw e
        }
    },
    async removeFromPending({ state, commit }, payload) {
        try {
            const pendingUpdates = await dbGet('pendingUpdates') || []
            const remainingUpdates = pendingUpdates.filter(item => {
                return item.userId === payload.userId &&
                    item.pokemonId === payload.pokemonId
            })
            await dbSet('pendingUpdates', remainingUpdates)
            commit('setPendingUpdates', remainingUpdates)
        } catch (e) {
            console.error(e)
            throw e
        }
    },
    async uploadPending({ state, commit }, payload) {
        try {
            const pendingUpdates = await dbGet('pendingUpdates')

            const promises = pendingUpdates.map(payload => {
                return client.post(`/sightings`, payload)
            })
            await Promise.all(promises)
            await dbSet('pendingUpdates', null)
            commit('setPendingUpdates', null)
        } catch(e) {
            throw e
        }
    },

    async initStore({ state, commit }) {

        try {
            const allPokemon = await dbGet('allPokemon')
            if (allPokemon) {
                commit('setAllPokemon', allPokemon)
            }

            const user = await dbGet('currentUser')
            if (user) {
                commit('setCurrentUser', user)
            }

            const seenPokemon = await dbGet('seenPokemon')
            if (seenPokemon) {
                commit('setUserSeenPokemon', seenPokemon)
            }

            const pendingUpdates = await dbGet('pendingUpdates')
            if (pendingUpdates) {
                commit('setPendingUpdates', pendingUpdates)
            }
        } catch (e) {
            console.error(e)
        }

    }

}


export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})