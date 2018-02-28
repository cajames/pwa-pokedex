import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from './store'

Vue.use(VueRouter)

import LandingPage from './pages/LandingPage.vue'
import DashPage from './pages/DashPage.vue'
import DiscoverPage from './pages/DiscoverPage.vue'
import SeenPage from './pages/SeenPage.vue'

const routes = [
    { 
        path: '/',
        component: LandingPage,
        beforeEnter: (to, from, next) => {
            if (store.state.currentUser) {
                next('/dash')
            }
            next()
        }
    },
    { path: '/dash', component: DashPage },
    { path: '/discover', component: DiscoverPage },
    { path: '/seen', component: SeenPage },
]

export const router = new VueRouter({
    mode: 'history',
    routes
}) 