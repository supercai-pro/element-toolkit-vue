<!-- search-inner -->
<template>
  <div class="search-inner">
    <el-form :label-position="labelPosition" :label-width="labelWidth" :class="{ 'has-label-width': labelWidth }" @submit.native.prevent="search" :model="searchForm">
      <div class="search-hd">
        <p class="title">{{title}}</p>
        <div class="btn-inner">
          <el-select multiple collapse-tags v-if="moreSearch" v-model="searchValue" placeholder="更多搜索项" @change="selectChange" @remove-tag="removeTag">
            <el-option v-for=" item in moreSelectArr" :key="item.key" :label="item.label" :value="item.prop"></el-option>
          </el-select>
          <el-button v-if="clearBtn !== false" @click="reset" class="reset-btn">{{clearBtn}}</el-button>
          <el-button v-if="searchBtn !== false" native-type="submit" type="primary">{{searchBtn}}</el-button>
          <el-button v-if="foldBtn" @click="fold" type="primary" class="fold-btn">
            <i class="el-icon-caret-top" :class="[foldSearch ? 'icon-transform' : 'icon-transform90']"></i>
          </el-button>
        </div>
      </div>
      <div class="search-bd" v-show="foldSearch">
        <el-row :gutter="16" ref="searchBd">
          <search-item :label-width="labelWidth" :searchItem="mustArr"></search-item>
          <search-item :label-width="labelWidth" :searchItem="selectArr"></search-item>
          <slot :searchForm="searchForm"></slot>
        </el-row>
      </div>
      <div class="search-arr" v-if="foldSearchArr && searchArrString !== ''">
        <el-form label-width="160px">
          <el-row :gutter="100">
            <el-col :span="24">
              <el-form-item label="您已选定搜索条件：">
                <p>{{searchArrString}}</p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-form>
  </div>
</template>
<script>
import searchItem from './search-item'
export default {
  name: 'search-inner',
  created () {
    this.getData()
    this.selectArr = JSON.parse(localStorage.getItem(this.localSearchKey)) ? JSON.parse(localStorage.getItem(this.localSearchKey)) : []
    this.searchValue = JSON.parse(localStorage.getItem(this.localSearchValueKey)) ? JSON.parse(localStorage.getItem(this.localSearchValueKey)) : []
    // 初始化时先调用一次下拉变化的函数
    this.selectChange(this.searchValue)
  },
  props: {
    moreSearch: {
      type: Boolean,
      default: false
    },
    foldBtn: {
      type: Boolean,
      default: false
    },
    searchOption: {
      type: Array,
      default () {
        return []
      }
    },
    searchId: {
      type: [Number, String],
      default: ''
    },
    title: {
      type: String,
      default: '条件筛选'
    },
    searchBtn: {
      type: [String, Boolean],
      default: '搜索'
    },
    clearBtn: {
      type: [String, Boolean],
      default: '清空'
    },
    labelPosition: {
      type: String,
      default: 'left'
    },
    labelWidth: {
      type: [String, Number]
    },
    searchForm: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      //折叠搜索条件
      foldSearch:true,
      searchValue: [],
      mustArr: [],
      selectArr: [],
      moreSelectArr: [],
      localSearchKey: this.$route.path + 'search' + this.searchId,
      localSearchValueKey: this.$route.path + 'searchValue' + this.searchId,
      foldSearchArr:false,
      searchArrString: ''
    }
  },
  components: {
    'search-item': searchItem
  },
  watch: {
    searchForm: {
      // 把searchForm传过来的值赋值给表单
      handler: function (nv) {
        for (let i in this.searchOption) {
          for (let j in nv) {
            if (this.searchOption[i].prop === j) {
              this.searchOption[i].value = nv[j]
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    // 分别存储必选项和非必选项的值
    getData () {
      this.mustArr = []
      this.moreSelectArr = []
      for (let i in this.searchOption) {
        if (this.searchOption[i].isMust) {
          this.mustArr.push(this.searchOption[i])
        } else {
          this.moreSelectArr.push(this.searchOption[i])
        }
      }
    },
    // 点击x号移除查询项的函数
    removeTag (value) {
      let tempArr = []
      for (let i in this.selectArr) {
        if (this.selectArr[i].prop !== value) {
          tempArr.push(this.selectArr[i].prop)
        }
      }
      this.addSearchItem(tempArr)
    },
    // 下拉列表变化的函数
    selectChange (value) {
      this.addSearchItem(value)
      this.$emit('selectSearch', {value: value, selectedSearch: this.selectArr})
    },
    // 添加查询项的函数
    addSearchItem (value) {
      this.selectArr = []
      if (!value.length) {
        this.selectArr = []
      }
      for (let i in value) {
        for (let j in this.moreSelectArr) {
          if (value[i] === this.moreSelectArr[j].prop) {
            this.selectArr.push(this.moreSelectArr[j])
          }
        }
      }
      // 取消查询项时  对应查询项的值要删除
      // for (let n in this.searchOption) {
      //   let flag = true
      //   if (!this.searchOption[n].isMust) {
      //     for (let j in value) {
      //       if (value[j] === this.searchOption[n].prop) {
      //         flag = false
      //       }
      //     }
      //   } else {
      //     flag = false
      //   }
      //   if (flag) {
      //     // 清空取消项的值
      //     if (this.searchOption[n].fieldType === 'input' || this.searchOption[n].fieldType === 'select') {
      //       this.searchOption[n].value = ''
      //     } else if (this.searchOption[n].fieldType === 'datetimerange') {
      //       this.searchOption[n].value = []
      //     }
      //   }
      // }
      // 将以选项存储至本地
      this.save()
    },
    save () {
      let getSearchData = JSON.parse(localStorage.getItem(this.localSearchKey))
      let getSearchValueData = JSON.parse(localStorage.getItem(this.localSearchValueKey))
      if (getSearchData) {
        localStorage.removeItem(this.localSearchKey)
        localStorage.removeItem(this.localSearchValueKey)
      }
      localStorage.setItem(this.localSearchKey, JSON.stringify(this.selectArr))
      localStorage.setItem(this.localSearchValueKey, JSON.stringify(this.searchValue))
      this.$emit('save', {search: {key: this.localSearchKey, value: getSearchData}, moreSelectValue: {key: this.localSearchValueKey, value: getSearchValueData}})
    },
    search () {
      let tempArr = [...this.mustArr, ...this.selectArr]
      let tempObj = {}
      for (let i in tempArr) {
        tempObj[tempArr[i].prop] = tempArr[i].value
      }
      // searchFrom传过来的值如果在查询项上没有选中，则不把值返回
      for (let i in this.searchOption) {
        for (let j in this.searchForm) {
          if (this.searchOption[i].prop === j) {
            let index = this._.findIndex(tempArr, function (item) {
              return item.prop === j
            })
            if (index === -1) {
              delete this.searchForm[j]
            }
          }
        }
      }
      this.$emit('submit-search', {searchId: this.searchId, searchForm: {...this.searchForm, ...tempObj}})
      return false
    },
    reset () {
      for (let i in this.searchOption) {
        if (this.searchOption[i].fieldType === 'input' || this.searchOption[i].fieldType === 'select') {
          this.searchOption[i].value = ''
        } else if (this.searchOption[i].fieldType === 'datetimerange') {
          this.searchOption[i].value = []
        }
      }
      this.$emit('clear-search', this.searchId)
    },
    // 折叠搜索条件
    fold(){
      if(this.foldSearch){
        this.foldSearch = false
        this.foldSearchArr = true
        let searchArr = []
        this.$nextTick(() => {
          if (this.searchOption.length > 0) {
            for(let item of this.searchOption) {
              // 判断表单是否有值
              if (this.isFormHaveVal(item.value)) {
                let labelAndValue = item.label + ':'
                if (item.fieldType === 'datetimerange') {
                  labelAndValue += item.value.join('-')
                } else if (item.fieldType === 'select') {
                  labelAndValue += item.options[this._.findIndex(item.options, {value: item.value})].label
                } else {
                  labelAndValue += item.value
                }
                searchArr.push(labelAndValue)
              }
            }
          } else {
            for (let item of this.$refs['searchBd'].$children) {
              if (item.$children.length > 0) {
                let index = 0
                if (item.$children[0].$children.length === 2) {
                  index = 1
                }
                // 判断表单是否有值
                if (this.isFormHaveVal(item.$children[0].$children[index].$options.propsData.value)) {
                  let labelAndValue = ''
                  // 获取表单的label
                  labelAndValue += this.getFormLable(item.$children[0])
                  // 获取表单的val
                  labelAndValue += this.getFormVal(item.$children[0].$children[index].$options.propsData, item.$children[0].$children[index])
                  searchArr.push(labelAndValue)
                }
              }
            }
          }
          this.searchArrString = searchArr.join('，')
        })
      }else{
        this.foldSearch = true
        this.foldSearchArr = false
        this.searchArrString = ''
      }
    },
    // 判断表单是否有值
    isFormHaveVal (val) {
      if (val) {
        if ((Array.isArray(val) && val.length === 0)) {
          return false;
        }
        return true;
      } else {
        return false
      }
    },
    // 获取表单的lable
    getFormLable (ele) {
      if (ele.$options.propsData.label) {
        return ele.$options.propsData.label
      } else {
        return ele.$slots.default[0].children[1].text
      }
    },
    // 获取表单的vlue
    getFormVal(propsData, ele) {
      if ((propsData.type === 'datetimerange' || propsData.type === 'daterange') && Array.isArray(propsData.value)) {
        return propsData.value.join('-')
      } else if (propsData.multiple === '') {
        return  ele.$el.innerText
      } else if (propsData.options && propsData.options.length > 0) {
        return  ele.$el.innerText
      } else {
        if (ele.$options._componentTag === 'el-select') {
          return  ele.$children[0].$el.firstElementChild.value
        } else {
          return  propsData.value
        }
      }
    }
  }
}
</script>
<style lang="less">
</style>
