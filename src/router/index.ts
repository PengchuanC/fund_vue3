import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        name: 'home',
        path: '/home',
        component: () => import('../components/Home.vue'),
        meta: {keepAlive: true}
    },
    {
        name: 'cart',
        path: '/cart',
        component: () => import('../components/Cart.vue'),
        meta: {keepAlive: true}
    },
    {
        name: 'etf',
        path: '/etf',
        component: () => import('../components/etf/ETFLayout.vue'),
        meta: {keepAlive: true}
    },
    {
        name: 'screen',
        path: '/screen',
        component: () => import('../components/Screen.vue')
    },
    {
        name: 'dashboard',
        path: '/dashboard',
        component: () => import('../components/Dashboard.vue'),
        meta: {keepAlive: true}
    },
    {
        name: 'news',
        path: '/news',
        component: () => import('../components/News.vue'),
        meta: {keepAlive: true}
    },
    {
        name: 'portfolio',
        path: '/portfolio',
        component: () => import('../components/portfolio/Portfolio.vue'),
        meta: {keepAlive: true}
    },
    {
        name: 'info',
        path: '/info/:secucode(\\d+)',
        component: () => import('../components/details/DetailLayout.vue'),
        meta: {keepAlive: true}
    },
    {
        path: '/',
        redirect: () => {
            return {name: 'home'}
        }
    },
]

export default createRouter({
    end: false,
    history: createWebHistory(),
    sensitive: false,
    strict: false,
    routes
})
