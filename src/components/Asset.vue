<template>
<el-card class="box-card">
    <transactions :transactions="transactions" />
</el-card>
</template>

<script>
import Transactions from './Transaction'
import { mapGetters } from 'vuex'

export default {
  name: 'Asset',

  components: {
    Transactions
  },
  data () {
    return {
      
    }
  },
  computed: {
    ...mapGetters([
      'getTransactionByAssetId'
    ]),
    asset () {
      const assetId = this.$route.params.assetId
      const asset = this.$store.getters.assets.find(a => (a.id === assetId)) || {}

      return asset
    },
    transactions () {
      return this.getTransactionByAssetId(this.asset.assetId)
    }
  },

  methods: {
    
  }
}
</script>

<style scoped>
</style>
