<template>
    <div class="all-transactions">
        <transactions :transactions="transactions" />
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
      return {}
  },
  computed: {
    ...mapGetters({
      transactions: 'transfers'
    })
  },

  methods: {
    ...mapActions([
      'getAllAccountAssetsTransactions'
    ])
  },

  created () {
    this.getAllAccountAssetsTransactions()
  }
}
</script>

<style scoped>

</style>
