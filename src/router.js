import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

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
      component: require('@/components/Login').default,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/components/Dashboard').default,
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: 'create-asset',
          name: 'create-asset',
          component: require('@/components/CreateAsset').default
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: require('@/components/AllTransactions').default,
        },
        {
          path: 'transfer-asset',
          name: 'transfer-asset',
          component: require('@/components/TransferAsset').default,
        },
        {
          path: 'add-asset-qauntity',
          name: 'add-asset-qauntity',
          component: require('@/components/AddAssetQuantity').default,
        },
        {
          path: 'create-account',
          name: 'create-account',
          component: require('@/components/CreateAccount').default,
        },
        {
          path: 'account-detail',
          name: 'account-detail',
          component: require('@/components/AccountDetail').default,
        },
        {
          path: 'add-signatory',
          name: 'add-signatory',
          component: require('@/components/AddSignatory').default,
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