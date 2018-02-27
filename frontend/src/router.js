import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import LandingPage from './pages/LandingPage.vue'
import DashPage from './pages/DashPage.vue'
import DiscoverPage from './pages/DiscoverPage.vue'
import SeenPage from './pages/SeenPage.vue'

const routes = [
    { path: '/', component: LandingPage },
    { path: '/dash', component: DashPage },
    { path: '/discover', component: DiscoverPage },
    { path: '/seen', component: SeenPage },
]

export const router = new VueRouter({
    mode: 'history',
    routes
}) 