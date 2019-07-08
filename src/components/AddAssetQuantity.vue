<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="form"
    :model="form">
    <el-form-item label="Asset ID:">
      <el-input name="assetId" v-model="form.assetId" placeholder="asset#domain"/>
    </el-form-item>

    <el-form-item label="Amount:">
      <el-input name="amount" v-model="form.amount"/>
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
      isSending: false
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
        this.isSending = true
        this.$store.dispatch('addAssetQuantity', {
            assetId: this.form.assetId,
            amount: this.form.amount
        })
        .then(() => {
            this.$message({
                message: 'Add asset quantity successful!',
                type: 'success'
            })
        })
        .catch(err => {
            console.error(err)
            this.$alert(err.message, 'Add asset quantit error', {
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
