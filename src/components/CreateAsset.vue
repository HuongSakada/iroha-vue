<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="form"
    :rules="rules"
    :model="form">

    <el-form-item label="Asset Name:" prop="name">
      <el-input name="name" v-model="form.name" placeholder="assetname"/>
    </el-form-item>

    <el-form-item label="Domain Name:" prop="domain">
      <el-input name="domain" v-model="form.domain" placeholder="iroha"/>
    </el-form-item>

    <el-form-item label="Precision:" prop="precision">
      <el-input name="precision" v-model.number="form.precision"/>
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
      isSending: false,
      rules: {
        name: [
          { required: true, trigger: 'change' },
          { pattern: /^[a-z_0-9]{1,32}$/, trigger: 'blur' }
        ],
        domain: {required: true, trigger: 'change'},
        precision: [
          { required: true, trigger: 'change' },
          { type: 'number', min: 1, max: 255, trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if(valid) {
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
