import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/main/index.vue'
import Begin from '@/views/begin/index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '',
            redirect: '/main/pages',
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
            redirect: '/main/pages/chat',
            beforeEnter() {
                const token = localStorage.getItem('userToken')
                if (!token) {
                    return { name: 'BEGIN' }
                }
            },
            children: [
                {
                    path: 'chat',
                    name: 'CHAT',
                    component: () =>
                        import('@/views/main/pages/chat/index.vue'),
                    meta: {
                        keep: true,
                    },
                },
                {
                    path: 'mail-list',
                    name: 'MAIL-LIST',
                    component: () =>
                        import('@/views/main/pages/mail-list/index.vue'),
                    meta: {
                        keep: true,
                    },
                },
                {
                    path: 'wechat-moments',
                    name: 'WECHAT-MOMENTS',
                    component: () =>
                        import('@/views/main/pages/wechat-moments/index.vue'),
                },
                {
                    path: 'my',
                    name: 'MY',
                    component: () => import('@/views/main/pages/my/index.vue'),
                },
            ],
        },
    ],
})

export default router
