import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'
import MfLogin from '@/components/view/MfLogin.vue'
import MfRegister from '@/components/view/MfRegister.vue'
import MfForgot from '@/components/view/MfForgot.vue'
import MfDashboard from '@/components/view/MfDashboard.vue'
import MfImage from '@/components/view/MfImage.vue'
import MfOtroPerfil from '@/components/view/MfOtroPerfil.vue'
import MfDemo from '@/components/view/MfDemo.vue'

const routes = [
    {
        path: '/',
        name: 'login',
        component: MfLogin,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/register',
        name: 'register',
        component: MfRegister,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/forgotPass/',
        name: 'forgotPass',
        component: MfForgot,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: MfDashboard,
        meta: {
            requiresAuth: true
        },
        redirect: { name: 'recent' },
        children: [
            {
                path: 'recent',
                name: 'recent',
                component: () => import('@/components/view2/Recent.vue'),
                meta: {
                    requiresAuth: true
                },
            },
            {
                path: 'search',
                name: 'search',
                component: () => import('@/components/view2/Search.vue'),
                meta: {
                    requiresAuth: true
                },
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import('@/components/view2/Profile.vue'),
                meta: {
                    requiresAuth: true
                },
            },
            {
                path: 'reports',
                name: 'reports',
                component: () => import('@/components/view2/Reports.vue'),
                meta: {
                    requiresAuth: true
                },
            }
        ]
    },
    {
        path: '/image/:id',
        name: 'image',
        component: MfImage,
        props: true,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/post/:id',
        name: 'post',
        component: () => import('@/components/MfPostsUser.vue'),
        props: true,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/:id/comments',
        name: 'comments',
        component: () => import('@/components/view2/Comentarios.vue'),
        props: true,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/report/:id',
        name: 'report',
        component: () => import('@/components/view2/Report.vue'),
        props: true,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/otroPerfil/:id',
        name: 'otroPerfil',
        component: MfOtroPerfil,
        props: true,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/demo',
        name: 'demo',
        component: MfDemo,
        meta: {
            requiresAuth: false
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state.user.loggedIn) {
        next({ name: 'login' })
    } else {
        if (!to.meta.requiresAuth && store.state.user.loggedIn) {
            next({ name: 'dashboard' })
        }
        next()
    }
})

export default router
