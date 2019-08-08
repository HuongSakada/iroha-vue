import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export const lazyComponent = (name) => () => import(`@/components/${name}.vue`)

const ifNotAuthenticated = (to, from, next) => {
  if (localStorage.getItem('user-token') === null) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (localStorage.getItem('user-token')) {
    next()
    return
  }
  next('/login')
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard/transactions'
    },
    {
      path: '/login',
      name: 'login',
      component: lazyComponent('Login'),
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: lazyComponent('Dashboard'),
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: 'create-asset',
          name: 'create-asset',
          component: lazyComponent('CreateAsset')
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: lazyComponent('AllTransactions'),
        },
        {
          path: 'transfer-asset',
          name: 'transfer-asset',
          component: lazyComponent('TransferAsset'),
        },
        {
          path: 'add-asset-qauntity',
          name: 'add-asset-qauntity',
          component: lazyComponent('AddAssetQuantity'),
        },
        {
          path: 'create-account',
          name: 'create-account',
          component: lazyComponent('CreateAccount'),
        },
        {
          path: 'account-detail',
          name: 'account-detail',
          component: lazyComponent('AccountDetail'),
        },
        {
          path: 'add-signatory',
          name: 'add-signatory',
          component: lazyComponent('AddSignatory'),
        },
        {
          path: 'remove-signatory',
          name: 'remove-signatory',
          component: lazyComponent('RemoveSignatory'),
        },
        {
          path: 'assets',
          name: 'assets',
          component: lazyComponent('Assets'),
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router;