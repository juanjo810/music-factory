import Vue from 'vue'
import {auth} from '@/api/firebase'
import Router from 'vue-router'
import store from '@/store'
import MfLogin from '@/components/view/MfLogin.vue'
import MfRegister from '@/components/view/MfRegister.vue'
import MfForgot from '@/components/view/MfForgot.vue'
import MfDashboard from '@/components/view/MfDashboard.vue'
import MfPerfil from '@/components/view/MfPerfil.vue'
import MfMisFotos from '@/components/view/MfMisFotos.vue'
import MfImage from '@/components/view/MfImage.vue'
import MfReportes from '@/components/view/MfReportes.vue'
import MfOtroPerfil from '@/components/view/MfOtroPerfil.vue'
import MfModificaContra from '@/components/view/MfModificaContra.vue'
import MfModifica from '@/components/view/MfModifica.vue'
import MfDemo from '@/components/view/MfDemo.vue'

Vue.use(Router)

const router =  new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: MfLogin,
            meta: {
                requiresAuth: false
            }
        },
        {
            path: '/register/:id',
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
            redirect: () => {
                return {name: 'recent'}
            },
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
                    component: () => import ('@/components/view2/Reports.vue'),
                    meta: {
                        requiresAuth: true
                    },
                }
            ]
        },
        {
            path: '/misFotos/',
            name: 'misFotos',
            component: MfMisFotos,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/perfil/',
            name: 'perfil',
            component: MfPerfil,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: ':id',
            name: 'image',
            component: MfImage,
            props: true,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: ':id',
            name: 'post',
            component: () => import('@/components/MfPostsUser.vue'),
            props: true,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: ':id',
            name: 'comments',
            component: () => import('@/components/view2/Comentarios.vue'),
            props: true
        },
        {
            path: '/reportes',
            name: 'reportes',
            component: MfReportes,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: ':id',
            name: 'report',
            component: () => import('@/components/view2/Report.vue'),
            props: true,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: 'otropefil/:email',
            name: 'otroPerfil',
            component: MfOtroPerfil,
            props: true,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/perfil/modificaDatos',
            name: 'modificaDatos',
            component: MfModifica,
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/perfil/modificaContra',
            name: 'modificaContra',
            component: MfModificaContra,
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
})

export default router

router.beforeEach((to, from , next) => {
    // instead of having to check every route record with
    // to.matched.some(record => record.meta.requiresAuth)
    console.log(to)
    console.log(from)
    console.log(next)
    console.log(store.state.user)
    console.log(auth.currentUser)
    console.log(to.meta.requiresAuth)


    if (to.meta.requiresAuth && !auth.currentUser)
    {
        next({name:'login'})
    }else{
        if(!to.meta.requiresAuth && auth.currentUser){
            next({name:'dashboard'})
        }
        next()
    }

    /*if (to.meta.requiresAuth && !store.state.user.loggedIn) {
       console.log("Entro")
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        return {
            path: '/',
            // save the location we were at to come back later
            query: { redirect: to.fullPath },
        }
    }*/
})

