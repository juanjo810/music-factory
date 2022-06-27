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
import MfReporte from '@/components/view/MfReporte.vue'
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
      path: '/misFotos/:id',
      name: 'imagen',
      component: MfImage,
      props: true
    },
    {
      path: '/reportes',
      name: 'reportes',
      component: MfReportes
    },
    {
      path: '/reportes/:id',
      name: 'reporte',
      component: MfReporte,
      props: true
    },
    {
      path: '/dashboard/:email',
      name: 'otroPerfil',
      component: MfOtroPerfil,
      props: true
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
