<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="form"
    :rules="rules"
    :model="form">

    <el-form-item label="Account Name:" prop="name">
      <el-input name="name" v-model="form.name" placeholder="name"/>
    </el-form-item>
    
    <el-form-item label="Domain Name:" prop="domain">
      <el-input name="domain" v-model="form.domain" placeholder="iroha"/>
    </el-form-item>

    <el-form-item class="login-button-container">
      <el-button
        class="login-button fullwidth"
        type="danger"
        :loading="isSending"
        @click="onSubmit">
        CREATE
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
      isSending: false,
      rules: {
        name: [
          { required: true, trigger: 'change' },
          { pattern: /^[a-z_0-9]{1,32}$/, trigger: 'blur' }
        ],
        domain: { required: true, trigger: 'change'}
      }
    }
  },

  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if(valid) {
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
        else {
          return false
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
