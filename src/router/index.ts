import { createRouter, createWebHistory } from 'vue-router'
import Begin from '@/views/begin/index.vue'
import Main from '@/views/main/index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '',
            redirect: '/main/pages/chat',
        },
        {
            path: '/begin',
            name: 'BEGIN',
            component: Begin,
        },
        {
            path: '/main/pages',
            name: 'MAIN',
            component: Main,
            children: [
                {
                    path: 'chat',
                    name: 'CHAT',
                    component: () =>
                        import('@/views/main/pages/chat/index.vue'),
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
                    path: 'mail-list',
                    name: 'MAIL-LIST',
                    component: () =>
                        import('@/views/main/pages/mail-list/index.vue'),
                    meta: {
                        keep: true,
                        noAnimate: true,
                    },
                },
                {
                    path: 'wechat-moments',
                    name: 'WECHAT-MOMENTS',
                    component: () =>
                        import('@/views/main/pages/wechat-moments/index.vue'),
                    meta: {
                        noAnimate: true,
                    },
                },
                {
                    path: 'my',
                    name: 'MY',
                    component: () => import('@/views/main/pages/my/index.vue'),
                    meta: {
                        noAnimate: true,
                    },
                },
            ],
        },

        {
            path: '/my-chat',
            name: 'MY_CHAT',
            component: () => import('@/views/my-chat/index.vue'),
        },
        {
            path: '/add-friend',
            name: 'ADD_FRIEND',
            component: () => import('@/views/add-friend/index.vue'),
        },
        {
            path: '/search-user',
            name: 'SEARCH_USER',
            component: () => import('@/views/search-user/index.vue'),
        },
        {
            path: '/new-friend',
            name: 'NEW_FRIEND',
            component: () => import('@/views/new-friend/index.vue'),
        },
        {
            path: '/accept-friend',
            name: 'ACCEPT_FRIEND',
            component: () => import('@/views/accept-friend/index.vue'),
        },
    ],
})

export default router
