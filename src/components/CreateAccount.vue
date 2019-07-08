<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="form"
    :model="form">
    <el-form-item label="Account Name:">
      <el-input name="name" v-model="form.name" placeholder="name"/>
    </el-form-item>
    <el-form-item label="Domain Name:">
      <el-input name="domain" v-model="form.domain" placeholder="iroha"/>
    </el-form-item>

    <el-form-item class="login-button-container">
      <el-button
        class="login-button fullwidth"
        type="danger"
        :loading="isSending"
        @click="onSubmit">
        SEND
      </el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'create-account',

  data () {
    return {
      form: {},
      isSending: false
    }
  },

  methods: {
    onSubmit() {
      this.isSending = true
      this.$store.dispatch('createAccount', {
        accountName: this.form.name,
        domainId: this.form.domain
      })
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
    }
  }
}
</script>

<style scoped>

</style>
