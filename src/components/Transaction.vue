<template>
    <div>
        <el-table 
            stripe
            :data="transactions">
            <el-table-column prop="from" label="From" />
            <el-table-column prop="to" label="To" />
            <el-table-column prop="assetId" label="Asset" />
            <el-table-column prop="amount" label="Amount" />
            <el-table-column prop="message" label="Message" />
            <el-table-column prop="date" label="Date" />
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
