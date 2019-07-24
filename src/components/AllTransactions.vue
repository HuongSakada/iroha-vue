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
                <el-table-column prop="from" label="From" />
                <el-table-column prop="to" label="To" />
                <el-table-column prop="assetId" label="Asset" />
                <el-table-column prop="amount" label="Amount" />
                <el-table-column prop="message" label="Message" />
                <el-table-column prop="date" label="Date" />
                <el-table-column label="Action">
                  <template slot-scope="scope">
                    <div class="transaction_action">
                      <el-button
                        size="small"
                        type="danger"
                        plain
                        @click="onSignPendingTransaction(scope.row.id, scope.row.signatures)"
                      >
                        Confirm
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>

              <!-- {{pendingTransactions}} -->
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
      'getRawPendingTransactions',
      'signPendingTransaction'
    ]),
    onSignPendingTransaction (txStoreId, signatures) {
      this.signPendingTransaction(txStoreId)
      .then(() => {
        this.$message({
          message: 'Confirm transaction successful!',
          type: 'success'
        })
      })
      .catch(err => {
        console.error(err)
        this.$alert(err.message, 'Confirm transaction error', {
          type: 'error'
        })
      })
    }
  },

  created () {
    this.getAllAccountAssetsTransactions()
    this.getRawPendingTransactions()
  }
}
</script>

<style scoped>

</style>