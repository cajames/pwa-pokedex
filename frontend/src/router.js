import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import LandingPage from './pages/LandingPage.vue'

const routes = [
    { path: '/', component: LandingPage },
]

export const router = new VueRouter({
    routes
}) 