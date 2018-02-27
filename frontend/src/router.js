import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import LandingPage from './pages/LandingPage.vue'
import DashPage from './pages/DashPage.vue'

const routes = [
    { path: '/', component: LandingPage },
    { path: '/dash', component: DashPage },
]

export const router = new VueRouter({
    mode: 'history',
    routes
}) 