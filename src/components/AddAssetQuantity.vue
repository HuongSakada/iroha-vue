<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="form"
    :rules="rules"
    :model="form">
    <el-form-item label="Asset ID:" prop="assetId">
      <el-input name="assetId" v-model="form.assetId" placeholder="assetname#domainname"/>
    </el-form-item>

    <el-form-item label="Amount:" prop="amount">
      <el-input v-model.number="form.amount"></el-input>
    </el-form-item>

    <el-form-item class="send-button-container">
      <el-button
        class="send-button fullwidth"
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
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'add-asset-quantity',

  data () {
    return {
      form: {},
      isSending: false,
      rules: {
        assetId: [
          { required: true, trigger: 'change' },
          { pattern: /^[a-z_0-9]{1,32}#[a-z_0-9]{1,9}$/, trigger: 'blur' }
        ],
        amount: [
          { required: true, trigger: 'change' },
          { type: 'number', min: 1, trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    ...mapGetters({
      allAssets: 'allAssets'
    })
  },

  created () {
    this.getAccountAssets()
  },

  methods: {
      ...mapActions([
          'getAccountAssets'
      ]),
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if(valid){
            this.isSending = true
            this.$store.dispatch('addAssetQuantity', {
                assetId: this.form.assetId,
                amount: String(this.form.amount)
            })
            .then(() => {
                this.$message({
                    message: 'Add asset quantity successful!',
                    type: 'success'
                })
            })
            .catch(err => {
                this.$alert(err.message, 'Add asset quantit error', {
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
