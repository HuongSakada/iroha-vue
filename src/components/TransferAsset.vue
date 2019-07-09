<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="form"
    :rules="rules"
    :model="form">

    <el-form-item 
      label="Assets:"
      prop="assetId">
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

    <el-form-item label="Transfer to:" prop="to">
      <el-input name="to" v-model="form.to" placeholder="username@domainname"/>
    </el-form-item>

    <el-form-item label="Amount:" prop="amount">
      <el-input name="amount" v-model.number="form.amount"/>
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
    var checkAmount = (rule, value, callback) => {
      if (!_.isNil(this.form.amount)) {
        if( value > this.balance)
          callback(new Error('Amount should not greater than balance'));
      }
      callback();
    };

    return {
      form: {},
      isSending: false,
      balance: 0,
      rules: {
        assetId: {required: true},
        to: [
          { required: true, trigger: 'change' },
          { pattern: /^[a-z_0-9]{1,32}@[a-z_0-9]{1,9}$/, trigger: 'blur' }
        ],
        amount: [
          { required: true, trigger: 'change' },
          { type: 'number', min: 1, trigger: 'change' },
          { validator: checkAmount, trigger: 'change' }
        ]
      }
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
        this.$refs['form'].validate((valid) => {
          if(valid){
            this.isSending = true
            this.$store.dispatch('transferAsset', {
                assetId: this.form.assetId,
                to: this.form.to,
                amount: String(this.form.amount),
                description: this.form.message
            })
            .then(() => {
                this.$message({
                    message: 'Transfer successful!',
                    type: 'success'
                })
            })
            .catch(err => {
                this.$alert(err.message, 'Transfer error', {
                    type: 'error'
                })
            })
            .finally(() => { this.isSending = false })
          }
          else {
            return false
          }
        })
      }
    }
}
</script>

<style scoped>

</style>
