<template>
  <el-row>
    <el-col :span="4">
      <router-link
          v-for="asset in assets"
          :key="asset.id"
          class="card"
          :to="'/dashboard/asset-page/' + asset.id"
        >
          <div class="label">{{ asset.name }}</div>
      </router-link>
    </el-col>
    <el-col :span="20">
        <router-view />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'asset-page',

  data () {
    return {
      
    }
  },

  computed: {
    ...mapGetters({
      assets: 'assets'
    })
  },

  watch: {
    '$route' (to) {
      if (to.name === 'asset-page') {
        this.openDefaultWallet()
      }
    }
  },

  mounted () {
    this.openDefaultWallet()
  },

  created () {
    this.getAccountAssets()
  },

  methods: {
    ...mapActions([
      'getAccountAssets'
    ]),
    openDefaultWallet () {
      if (this.assets[0]) {
        this.$router.push({ name: 'asset', params: { assetId: this.assets[0].id } })
      }
    }
  }
}
</script>

<style scoped>
.card {
  display: block;
  width: 100%;
  font-size: 14px;
  text-decoration: none;
  text-align: left;
  padding: 20px 0px;
}
.card:hover {
background: #e43f338c;
}
.card.router-link-active {
  background: #f4f4f4;
  padding-bottom: 13px;
  border-bottom: 2px solid #e43e33
}
.label {
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  margin-left: 15px
}
.card.router-link-active > .label {
  font-weight: 600;
} 
</style>
