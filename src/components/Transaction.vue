<template>
    <div>
        <el-table 
            stripe
            :data="transactions.slice((currentPage-1)*pagesize, currentPage*pagesize)">
            <el-table-column prop="from" label="From" />
            <el-table-column prop="to" label="To" />
            <el-table-column prop="assetId" label="Asset" />
            <el-table-column prop="amount" label="Amount" />
            <el-table-column prop="message" label="Message" />
            <el-table-column prop="date" label="Date" />
        </el-table>
        
        <div style="text-align: center; margin-top: 20px">
            <el-pagination
            layout="prev, pager, next"
            :total="transactions.length"
            @current-change="current_change">
        </el-pagination>
        </div>
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
    },
    data() {
        return {
            total: 0,
            pagesize:10,
            currentPage:1
        }
    },
    methods: {
        current_change:function(currentPage){
            this.currentPage = currentPage;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
