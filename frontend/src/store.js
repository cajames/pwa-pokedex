import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    message: 'Testing Store'
}

const getters = {
}

const mutations = {

}

const actions = {

}



export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})