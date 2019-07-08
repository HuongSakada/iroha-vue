import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login').default
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/components/Dashboard').default,
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