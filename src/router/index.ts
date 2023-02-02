import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/main/index.vue'
import Login from '@/views/login/index.vue'
import Register from '@/views/register/index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '',
            redirect: '/main/pages',
        },
        {
            path: '/login',
            name: 'LOGIN',
            component: Login,
        },
        {
            path: '/register',
            name: 'REGISTER',
            component: Register,
        },
        {
            path: '/main/pages',
            name: 'MAIN',
            component: Main,
            redirect: '/main/pages/chat',
            children: [
                {
                    path: 'chat',
                    name: 'CHAT',
                    component: () =>
                        import('@/views/main/pages/chat/index.vue'),
                },
                {
                    path: 'mail-list',
                    name: 'MAIL-LIST',
                    component: () =>
                        import('@/views/main/pages/mail-list/index.vue'),
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
