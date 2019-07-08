<template>
    <div>
        <el-table 
            stripe
            :data="transactions">
            <el-table-column prop="from" label="from" />
            <el-table-column prop="to" label="to" />
            <el-table-column prop="assetId" label="Asset" />
            <el-table-column prop="amount" label="amount" />
            <el-table-column prop="message" label="message" />
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'transactions',
    props: {
        transactions: {
            type: Array,
            required: true
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
