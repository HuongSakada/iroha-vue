<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="accountInfo"
    :model="accountInfo">
    <el-form-item label="Name:">
      <el-input name="name" v-model="accountInfo.name" />
    </el-form-item>
    <el-form-item label="Phone number:">
      <el-input name="phone" v-model="accountInfo.phone"/>
    </el-form-item>
    <el-form-item label="Email:">
      <el-input name="email" v-model="accountInfo.email"/>
    </el-form-item>

    <el-form-item>
      <el-button
        class="fullwidth"
        type="danger"
        :loading="isSending"
        @click="onSubmit">
        ADD
      </el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
/* eslint-disable */
import { mapState, mapActions } from 'vuex'

export default {
    name: 'account-detail',

    data () {
        return {
        isSending: false
        }
    },
    computed: {
        ...mapState({
            accountInfo: state => state.Account.accountInfo
        })
    },

    created () {
        this.getAccountDetail()
    },
    methods: {
        onSubmit() {
            this.isSending = true
            this.$store.dispatch('setAccountDetails')
            .then(() => {
                this.$message({
                message: 'Create account successful!',
                type: 'success'
                })
            })
            .catch(err => {
                console.error(err)
                this.$alert(err.message, 'Create account error', {
                type: 'error'
                })
            })
            .finally(() => { this.isSending = false })
        },
        ...mapActions([
            'getAccountDetail'
        ])
    }
}
</script>

<style scoped>

</style>
