<template>
<div class="wrapper">
  <el-table
    :data="allSignatories"
    style="width: 100%">
    <el-table-column
      label="Your signatory">
      <template slot-scope="scope">
        {{ scope.row }}
      </template>
    </el-table-column>
    
    <el-table-column
      align="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          :disabled="isLoading"
          @click="handleDelete(scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
/* eslint-disable */
export default {
  data() {
    return {
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
    handleDelete(row) {
      this.isLoading = true

      this.$store.dispatch('removeSignatory', row)
      .then(() => {
        this.$message({
          message: 'Remove signatory successful!',
          type: 'success'
        })
      })
      .catch(err => {
        console.error(err)
        this.$alert(err.message, 'Reomve signatory error', {
          type: 'error'
        })
      })
      .finally(() => { this.isLoading = false })
    }
  },
}
</script>

<style scoped>

</style>
