<template>
<el-card class="box-card">
    <div class="all-transactions">
        <el-tabs v-model="activeName">
            <el-tab-pane label="All transactions" name="allTransactions">
                <transactions :transactions="transactions" />
            </el-tab-pane>
            <el-tab-pane label="Pending transactions" name="pendingTransactions">
              <el-table 
                stripe
                :data="pendingTransactions">
                <el-table-column prop="label" label="Label" />
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
            </el-tab-pane>
        </el-tabs>
    </div>
</el-card>
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
        this.getAllAccountAssetsTransactions()
        this.getRawPendingTransactions()

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