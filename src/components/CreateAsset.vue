<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="form"
    :model="form">
    <el-form-item label="Asset Name:">
      <el-input name="name" v-model="form.name" />
    </el-form-item>
    <el-form-item label="Domain Name:">
      <el-input name="domain" v-model="form.domain" placeholder="iroha"/>
    </el-form-item>
    <el-form-item label="Precision:">
      <el-input name="precision" v-model="form.precision" />
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
  name: 'create-asset',

  data () {
    return {
      form: {},
      isSending: false
    }
  },

  methods: {
    onSubmit() {
      this.isSending = true
      this.$store.dispatch('createAsset', {
        assetName: this.form.name,
        domainId: this.form.domain,
        precision: this.form.precision
      })
      .then(() => {
        this.$message({
          message: 'Create asset successful!',
          type: 'success'
        })
      })
      .catch(err => {
        console.error(err)
        this.$alert(err.message, 'Create asset error', {
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
