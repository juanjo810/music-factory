import Vue from 'vue'
import Router from 'vue-router'

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

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: MfLogin
    },
    {
      path: '/register/',
      name: 'register',
      component: MfRegister
    },
    {
      path: '/forgotPass/',
      name: 'forgotPass',
      component: MfForgot,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: MfDashboard,
      redirect: () => {
        return {name:'recent'}
      },
      children:[
        {
          path: 'recent',
          name: 'recent',
          component: () => import('@/components/view2/Recent.vue'),
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/components/view2/Search.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/components/view2/Profile.vue'),
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import ('@/components/view2/Reports.vue')
        }
      ]
    },
    {
      path: '/misFotos/',
      name: 'misFotos',
      component: MfMisFotos
    },
    {
      path: '/perfil/',
      name: 'perfil',
      component: MfPerfil
    },
    {
      path: ':id',
      name: 'image',
      component: MfImage,
      props: true
    },
    {
      path: ':id',
      name: 'post',
      component: () => import('@/components/MfPostsUser.vue'),
      props: true
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
      component: MfReportes
    },
    {
      path: ':id',
      name: 'report',
      component: () => import('@/components/view2/Report.vue'),
      props: true
    },
    {
      path: ':email',
      name: 'otroPerfil',
      component: MfOtroPerfil,
      props: true,
    },
    {
      path: '/perfil/modificaDatos',
      name: 'modificaDatos',
      component: MfModifica
    },
    {
      path: '/perfil/modificaContra',
      name: 'modificaContra',
      component: MfModificaContra
    },
    {
      path: '/demo',
      name: 'demo',
      component: MfDemo
    }
  ]
})
