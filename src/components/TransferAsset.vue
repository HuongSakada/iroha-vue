<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="form"
    :model="form"
  >
    <el-form-item label="Assets:">
        <el-select
            v-model="form.assetId"
            class="fullwidth"
            placeholder="Select asset">
            <el-option
                v-for="item in this.allAssets"
                :key="item.assetId"
                :label="item.assetId"
                :value="item.assetId">
            </el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="Your balance is:">
      <el-input name="balance" v-model="balance" readonly/>
    </el-form-item>
    <el-form-item label="Transfer asset to:">
      <el-input name="to" v-model="form.to" placeholder="asset#domain"/>
    </el-form-item>

    <el-form-item label="Amount:">
      <el-input name="amount" v-model="form.amount"/>
    </el-form-item>

    <el-form-item label="Message:">
      <el-input name="message" v-model="form.message" type="textarea"/>
    </el-form-item>

    <el-form-item class="send-button-container">
      <el-button
        class="send-button fullwidth"
        type="danger"
        :loading="isSending"
        @click="onSubmit"
      >
        SEND
      </el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  name: 'transfer-form',

  data () {
    return {
      form: {},
      isSending: false,
      balance: 0
    }
  },

  computed: {
    ...mapGetters({
      allAssets: 'allAssets'
    })
  },

  watch: {
    'form.assetId': {
      immediate: true,
      handler: function (value) {
        this.balance = 0

        if(!_.isNil(value)){
          this.balance = _.filter(this.allAssets, ['assetId', value])[0].balance
        }
      }
    }
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
          this.$store.dispatch('transferAsset', {
              assetId: this.form.assetId,
              to: this.form.to,
              amount: this.form.amount,
              description: this.form.message
          })
          .then(() => {
              this.$message({
                  message: 'Transfer successful!',
                  type: 'success'
              })
          })
          .catch(err => {
              console.error(err)
              this.$alert(err.message, 'Transfer error', {
                  type: 'error'
              })
          })
          .finally(() => { this.isSending = false })
      },
      onAssetChange(index, e){
        console.log(index)
      }
    }
}
</script>

<style scoped>

</style>
