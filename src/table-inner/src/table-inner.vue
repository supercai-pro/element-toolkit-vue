<!-- table-inner -->
<template>
  <div class="table-inner" :class="{'table-border-inner': border}">
    <div v-if="tableHeader" class="table-hd">
      <p class="title">{{ title }}</p>
      <div class="btn-inner">
        <el-select multiple collapse-tags v-if="showMoreColumns" v-model="columnsValue" placeholder="更多列表项" @change="selectChange" @remove-tag="removeTag">
          <el-option v-for=" item in moreColumnsArr" :key="item.key" :label="item.label" :value="item.prop" :disabled="item.disabled"></el-option>
        </el-select>
        <slot name="btn-inner"></slot>
      </div>
    </div>
    <div class="table-bd">
      <slot name="table-bd">
        <el-table v-bind="$attrs" v-on="$listeners" ref="table" :stripe="stripe" :border="border" :data="tableData" :row-class-name="rowClassName" :height="height" :show-summary="showSummary"
                  :row-key="rowKey" :tree-props="treeProps" :lazy="lazy" :load="load" :default-expand-all="defaultExpandAll">
          <el-table-column v-for="item in mustArr" :key="item.key" :prop="item.prop" :label="item.label" :formatter="utils[item.formatter]" show-overflow-tooltip></el-table-column>
          <el-table-column v-for="item in selectArr" :key="item.key" :prop="item.prop" :label="item.label" :formatter="utils[item.formatter]" show-overflow-tooltip></el-table-column>
          <slot name="table-columns"></slot>
        </el-table>
      </slot>
    </div>
    <div v-if="tableFooter" class="table-ft">
      <slot name="table-ft">
        <pagination :total="total" :pageNum="pageNum" :pageSize="pageSize" :pages="pages" :pageId="pageId" @changePageNum="changePageNum"></pagination>
      </slot>
    </div>
  </div>
</template>
<script>
// import pagination from '@/components/pagination'
export default {
  name: 'table-inner',
  created () {
    // 将必选项与非必选项区分
    this.mustArr = []
    this.moreColumnsArr = []
    for (let i in this.columnOption) {
      if (this.columnOption[i].isMust) {
        this.mustArr.push(this.columnOption[i])
      } else {
        this.moreColumnsArr.push(this.columnOption[i])
      }
    }
    // 取本地存储的值  没有赋值为空
    this.selectArr = JSON.parse(localStorage.getItem(this.localTableKey)) ? JSON.parse(localStorage.getItem(this.localTableKey)) : []
    this.columnsValue = JSON.parse(localStorage.getItem(this.localColumnsKey)) ? JSON.parse(localStorage.getItem(this.localColumnsKey)) : []
  },
  props: {
    columnProp: {
      type: Object,
      default () {
        return {}
      }
    },
    columnOption: {
      type: Array,
      default () {
        return []
      }
    },
    showMoreColumns: {
      type: Boolean,
      default: false
    },
    tableHeader: {
      type: Boolean,
      default: true
    },
    tableId: {
      type: [Number, String],
      default: ''
    },
    tableFooter: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    height: {
      type: [Number, String],
    },
    rowClassName: {
      type: [String, Function]
    },
    rowKey: {
      type: [String, Function],
    },
    treeProps: {
      type: Object
    },
    lazy: {
      type: Boolean
    },
    load: {
      type: Function,
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '搜索结果'
    },
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
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
  data () {
    return {
      columnsValue: [],
      mustArr: [],
      moreColumnsArr: [],
      selectArr: [],
      tempArr: [], // 存查询项选中的项的数组
      localTableKey: this.$route.path + 'table' + this.tableId,
      localColumnsKey: this.$route.path + 'columnsValue' + this.tableId
    }
  },
  components: {
    // pagination: pagination
  },
  watch: {
    columnProp (nv) {
      // 初始化时获取查询项的值  赋值给tempArr
      this.tempArr = this._.cloneDeep(nv.selectedSearch)
      for (let i in this.moreColumnsArr) {
        this.moreColumnsArr[i].disabled = false
        for (let j in nv.value) {
          if (this.moreColumnsArr[i].prop === nv.value[j]) {
            this.moreColumnsArr[i].disabled = true
          }
        }
      }
      if (!nv.value.length) {
        this.tempArr = []
      }
      for (let i in nv.value) {
        let flag = false
        // 防止添加重复列
        for (let m in this.selectArr) {
          if (nv.value[i] === this.selectArr[m].prop) {
            flag = true
            break
          }
        }
        if (flag) {
          continue
        }
        // 添加查询项  自动添加列表列
        for (let j in this.moreColumnsArr) {
          if (nv.value[i] === this.moreColumnsArr[j].prop) {
            this.selectArr.push(this.moreColumnsArr[j])
            // 存储一下查询项传过来的列表列
            // this.tempArr.push(this.moreColumnsArr[j])
          }
        }
      }
      this.columnsValue = []
      for (let n in this.selectArr) {
        this.columnsValue.push(this.selectArr[n].prop)
      }
      this.save()
    }
  },
  methods: {
    doLayout () {
      this.$refs.table.doLayout()
    },
    // 保存到本地
    save () {
      let getTableKye = JSON.parse(localStorage.getItem(this.localTableKey))
      let getColumnsKye = JSON.parse(localStorage.getItem(this.localColumnsKey))
      if (getTableKye) {
        localStorage.removeItem(this.localTableKey)
        localStorage.removeItem(this.localColumnsKey)
      }
      localStorage.setItem(this.localTableKey, JSON.stringify(this.selectArr))
      localStorage.setItem(this.localColumnsKey, JSON.stringify(this.columnsValue))
      this.$emit('save', {table: {key: this.localTableKey, value: getTableKye}, moreSelectValue: {key: this.localColumnsKey, value: getColumnsKye}})
    },
    // 点击x号移除列表项函数
    removeTag (value) {
      let tempArr = []
      // 在已选的数组中选出跟删除的列表项不同prop的项
      for (let i in this.selectArr) {
        if (this.selectArr[i].prop !== value) {
          tempArr.push(this.selectArr[i].prop)
        }
      }
      this.addColumn(tempArr)
    },
    // 选择更多列表项函数
    selectChange (value) {
      this.addColumn(value)
      this.$emit('tableChange', value)
    },
    // 添加列表列
    addColumn (value) {
      this.selectArr = []
      // if (!value.length) {
      //   this.selectArr = []
      // }
      // 查询项有的项   表格里必须要有不能删除
      for (let i in this.tempArr) {
        for (let j in this.moreColumnsArr) {
          if (this.tempArr[i].prop === this.moreColumnsArr[j].prop) {
            this.selectArr.push(this.moreColumnsArr[j])
          }
        }
      }
      // this.selectArr = [...this.tempArr]
      for (let i in value) {
        for (let j in this.moreColumnsArr) {
          let flag = false
          // 防止添加重复列
          for (let m in this.selectArr) {
            if (value[i] === this.selectArr[m].prop) {
              flag = true
              break
            }
          }
          if (flag) {
            continue
          }
          if (value[i] === this.moreColumnsArr[j].prop) {
            this.selectArr.push(this.moreColumnsArr[j])
          }
        }
      }
      // 存储到本地  如果原先有值  则先删除  在重新存储
      this.save()
    },
    changePageNum (pageInfo) {
      this.$emit('changePageNum', pageInfo)
    }
  }
}
</script>
<style lang="less">
</style>
