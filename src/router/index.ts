import { createRouter, createWebHistory } from 'vue-router'
import Begin from '@/views/begin/index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '',
            redirect: '/chat',
        },
        {
            path: '/begin',
            name: 'BEGIN',
            component: Begin,
        },
        {
            path: '/chat',
            name: 'CHAT',
            component: () => import('@/views/chat/index.vue'),
            meta: {
                keep: true,
                noAnimate: true,
            },
            beforeEnter() {
                const token = localStorage.getItem('userToken')
                if (!token) {
                    return { name: 'BEGIN' }
                }
            },
        },
        {
            path: '/mail-list',
            name: 'MAIL-LIST',
            component: () => import('@/views/mail-list/index.vue'),
            meta: {
                keep: true,
                noAnimate: true,
            },
        },
        {
            path: '/wechat-moments',
            name: 'WECHAT-MOMENTS',
            component: () => import('@/views/wechat-moments/index.vue'),
            meta: {
                noAnimate: true,
            },
        },
        {
            path: '/my',
            name: 'MY',
            component: () => import('@/views/my/index.vue'),
            meta: {
                noAnimate: true,
            },
        },
        {
            path: '/my-chat',
            name: 'MY_CHAT',
            component: () => import('@/views/my-chat/index.vue'),
        },
    ],
})

export default router
