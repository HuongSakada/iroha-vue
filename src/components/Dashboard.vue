<template>
  <el-container>
    <el-header>
      <el-header>{{this.accountId}}</el-header>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu
          :router="true"
          :default-active="currentActiveMenu"
        >
          <el-menu-item index="/dashboard/transactions">
            <span slot="title">Dashboard</span>
          </el-menu-item>

          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-coin"></i>
              <span>Add transaction</span>
            </template>
            <el-menu-item index="/dashboard/create-account">Create new account</el-menu-item>
            <el-menu-item index="/dashboard/create-asset">Create asset</el-menu-item>
            <el-menu-item index="/dashboard/add-asset-qauntity">Add asset qauntity</el-menu-item>
            <el-menu-item index="/dashboard/transfer-asset">Transfer asset</el-menu-item>
            <el-menu-item index="/dashboard/account-detail">Account detail</el-menu-item>
          </el-submenu>

          <el-menu-item index="/logout" @click="onLogout">
            <span slot="title">Logout</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
    
      <el-main id='main'>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    return {
      
    }
  },
  computed: {
    ...mapState({
      accountId: state => state.Account.accountId
    }),

    currentActiveMenu: function () {
      if (this.$route.path.includes('transactions')) return '/dashboard/transactions'
      if (this.$route.path.includes('create-asset')) return '/dashboard/create-asset'
      if (this.$route.path.includes('transfer-asset')) return '/dashboard/transfer-asset'
      if (this.$route.path.includes('add-asset-qauntity')) return '/dashboard/add-asset-qauntity'
      if (this.$route.path.includes('create-account')) return '/dashboard/create-account'
      if (this.$route.path.includes('account-detail')) return '/dashboard/account-detail'
      return this.$route.path
    }
  },
  created () {
    this.getAccountDetail()
  },
  methods: {
    ...mapActions([
      'getAccountDetail',
      'logout'
    ]),
    onLogout () {
      this.logout()
        .then(() => this.$router.push('/login'))
    }
  }
}
</script>

<style scoped>
  .el-header {
    border-bottom: 1px solid white;
  }
  .el-aside {
    width: 250px;
    height: 100vh;
    border-right: 1px solid #e43e33;
  }
  .el-submenu >>> .el-submenu__title, .el-submenu >>> i {
    color: #e43e33
  }
  .el-menu {
    border-right: 0px;
    text-align: left;
  }
  .el-menu-item:hover {
    background: #e43f338c;
  }
  .el-menu-item.is-active{
    background: #e43e33;
    color: rgb(255, 255, 255, 1);
    font-weight: 500;
  }
  .el-header {
    background-color: #e43e33;
    color: #FFF;
    text-align: right;
    line-height: 60px;
  }
</style>
