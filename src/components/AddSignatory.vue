<template>
<div class="wrapper">
  <el-form
    class="app-form"
    ref="form"
    :model="form">

    <p>You have {{this.allSignatories.length}} {{this.allSignatories.length>1?'signatories':'signatory'}}</p>
    
    <el-form-item label="Signatory:" prop="signatory">
      <el-row type="flex" justify="space-between" class="fullwidth">
        <el-col :span="20">
          <el-input
            name="signatory"
            v-model="form.signatory"
            :disabled="isLoading"
          />
        </el-col>
        <el-upload
          class="auth-form_upload"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onFileChosen"
          :disabled="isLoading">
          <el-button>
            <i class="el-icon-upload2"></i>
          </el-button>
        </el-upload>
      </el-row>
    </el-form-item>

    <el-form-item class="login-button-container">
      <el-button
        class="login-button fullwidth"
        type="danger"
        :loading="isLoading"
        @click="onSubmit">
        ADD
      </el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
/* eslint-disable */
export default {
  name: 'add-signatory',

  data () {
    return {
      form: {
        signatory: ''
      },
      isLoading: false
    }
  },

  computed: {
    ...mapGetters({
      allSignatories: 'getSignatories'
    })
  },

  created () {
    this.getSignatories()
  },

  methods: {
    ...mapActions([
      'getSignatories'
    ]),
    onFileChosen (file, fileList) {
      const reader = new FileReader()

      reader.onload = (ev) => {
        this.form.signatory = (ev.target.result || '').trim()
      }
      reader.readAsText(file.raw)
    },

    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if(valid){
          this.isLoading = true
          this.$store.dispatch('addSignatory', this.form.signatory)
          .then(() => {
            this.$message({
              message: 'Add signatory successful!',
              type: 'success'
            })
          })
          .catch(err => {
            console.error(err)
            this.$alert(err.message, 'Add signatory error', {
              type: 'error'
            })
          })
          .finally(() => { this.isLoading = false })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
