<template>
  <div class="">
    <el-pagination background prev-text="上一页" next-text="下一页" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" :total="total" layout="prev, pager, next, jumper" :page-count="pages">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    total: {
      type: Number
    },
    pageNum: {
      type: Number
    },
    pageSize: {
      type: Number
    },
    pages: {
      type: Number
    },
    pageId: {
      type: [String, Number]
    }
  },
  methods: {
    handleCurrentChange (pageNum) {
      this.$emit('changePageNum', {pageId: this.pageId, pageNum})
    }
  }
}
</script>

<style>

</style>
