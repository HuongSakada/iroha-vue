<template>
    <div class="all-transactions">
        <el-tabs v-model="activeName">
            <el-tab-pane label="All transactions" name="allTransactions">
                <transactions :transactions="transactions" />
            </el-tab-pane>
            <el-tab-pane label="Pending transactions" name="pendingTransactions">
              <el-table 
                stripe
                :data="pendingTransactions">
                <el-table-column prop="label" label="Transaction type" />
                <el-table-column prop="date" label="Date" />
              </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState, mapGetters } from 'vuex'
import Transactions from './Transaction'

export default {
  name: 'all-transactions',
  components: {
    Transactions
  },
  data () {
      return {
        activeName: 'allTransactions'
      }
  },
  computed: {
    ...mapGetters({
      transactions: 'transfers',
      pendingTransactions: 'getPendingTransactions'
    })
  },

  methods: {
    ...mapActions([
      'getAllAccountAssetsTransactions',
      'getPendingTransactions'
    ])
  },

  created () {
    this.getAllAccountAssetsTransactions()
    this.getPendingTransactions()
  }
}
</script>

<style scoped>

</style>