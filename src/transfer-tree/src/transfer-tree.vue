<template>
  <div class="tree-transfer">
    <el-form label-width="0" label-position="left" class="col-item">
      <el-row :gutter="10">
        <el-col :span="10">
          <div class="tree-transfer-title">
            <span>可选列表</span>
            <el-input class="input" prefix-icon="el-icon-search" placeholder="请输入关键字" v-model="filterText"></el-input>
          </div>
          <el-form-item>
            <div class="transfer-boder">
              <el-tree ref="tree" v-if="type === 'table'" :data="list" show-checkbox :props="defaultProp" default-expand-all class="tree-style"  node-key="id" @check="tableTreeClick" :filter-node-method="filterNode">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span>
                        <span v-if="node.childNodes.length <= 0"></span>
                        <span v-else-if="node.expanded === true"><i class="el-icon-minus"></i></span>
                        <span v-else-if="node.expanded === false"><i class="el-icon-plus"></i></span>
                      </span>
                    </span>
              </el-tree>
              <el-tree v-if="type !== 'table'" ref="tree" :data="list" show-checkbox :props="defaultProp" default-expand-all class="tree-style"  node-key="id" @check="treeClick" :filter-node-method="filterNode">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span>
                        <span v-if="node.childNodes.length <= 0"></span>
                        <span v-else-if="node.expanded === true"><i class="el-icon-minus"></i></span>
                        <span v-else-if="node.expanded === false"><i class="el-icon-plus"></i></span>
                      </span>
                    </span>
              </el-tree>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <div style="padding: 10px 20px;font-size: 16px;color:#333333;font-weight: 400;"><p style="height: 30px;">已选列表</p></div>
          <div class="transfer-boder">
            <div v-for="(item, index) in selectedArr" v-if="type === 'table'" :key="index" style="padding: 0 10px;margin:5px 0;background-color: #E5E9F2;height: 36px;line-height: 36px;">
              <span style="margin-right: 6px;"><img src="./close.png" alt="" @click="delCheckedTree(item, index)"></span>
              <span style="color:#333333;">{{item.currentValue}}</span>
              <span style="float: right;color: #999999;font-size: 12px;">{{item.parentValue}}</span>
              <div style="clear: both;"></div>
            </div>
            <el-tree v-if="type !== 'table'" ref="tree2" :data="rightTreeList" show-checkbox empty-text="" :props="defaultProp" default-expand-all class="tree-style"  node-key="id" :default-checked-keys="defaultChecked" @check="rightTreeCheck">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ node.label }}</span>
                      <span>
                        <span v-if="node.childNodes.length <= 0"></span>
                        <span v-else-if="node.expanded === true"><i class="el-icon-minus"></i></span>
                        <span v-else-if="node.expanded === false"><i class="el-icon-plus"></i></span>
                      </span>
                    </span>
            </el-tree>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'transfer-tree',
  props: {
    type: {
      type: String,
      required: false,
      default: 'table'
    },
    list: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      filterText: '',
      defaultProp: {
        children: 'childList',
        label: 'orgName'
      },
      parentArr: [],
      childArr: [],
      tempArr: [],
      selectedArr: [],
      rightTreeList: [],
      defaultChecked: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    findChild (data) {
      if (data.childList[0].childList.length) {
        let val = this.findChild(data.childList[0])
        return val
      } else {
        return data
      }
    },
    findChildId (data, id, child) {
      if (data.id !== id) {
        this.findChildId(data.childList[0], id, child)
      } else {
        data.childList.push(child)
      }
    },
    delTreeNode (checkNodes) {
      if (checkNodes.parent.childNodes.length > 1) {
        this.$refs.tree2.remove(checkNodes.data)
      } else {
        if (!checkNodes.parent.parent) {
          this.$refs.tree2.remove(checkNodes.data)
        } else {
          this.delTreeNode(checkNodes.parent)
        }
      }
    },
    rightTreeCheck (node) {
      let checkNodes = this.$refs.tree2.getNode(node)
      if (!checkNodes.checked) {
        this.$refs.tree.setChecked(node.id, false, true)
        this.delTreeNode(checkNodes)
        // 取消选中 删除左边树选中时自己构造的数组中对应的数据
        for (let i = 0; i < this.parentArr.length; i++) {
          let flag = false
          for (let j in this.parentArr[i]) {
            if (this.parentArr[i][j].id === node.id) {
              flag = true
            }
          }
          if (flag) {
            this.parentArr.splice(i, 1)
            // i 应该什么时候  --
            if (i === 0) {
              i--
            }
          }
        }
      }
    },
    tableTreeClick (node) {
      this.tempArr = []
      this.childArr = []
      let checkNodes = this.$refs.tree.getNode(node)
      if (checkNodes.checked) {
        if (checkNodes.childNodes.length > 0) {
          this.getTreeChildNode(checkNodes)
          for (let i in this.childArr) {
            let tempNode = this.$refs.tree.getNode(this.childArr[i])
            this.getTreeParentNode(tempNode)
            let flag = true
            for (let j in this.parentArr) {
              if (this.parentArr[j][0].id === this.tempArr[0].id) {
                flag = false
              }
            }
            if (flag) {
              this.parentArr.push(this.tempArr)
            }
            this.tempArr = []
          }
        } else {
          this.getTreeParentNode(checkNodes)
          let flag = true
          for (let j in this.parentArr) {
            if (this.parentArr[j][0].id === this.tempArr[0].id) {
              flag = false
            }
          }
          if (flag) {
            this.parentArr.push(this.tempArr)
          }
        }
        this.selectedArr = []
        for (let i in this.parentArr) {
          let tempVal = ''
          for (let j = 1; j < this.parentArr[i].length; j++) {
            tempVal += this.parentArr[i][j].orgName + '/'
          }
          this.selectedArr.push({currentValue: this.parentArr[i][0].orgName, parentValue: tempVal.substring(0, tempVal.length - 1), data: this.parentArr[i][0]})
        }
      } else {
        if (checkNodes.childNodes.length > 0) {
          this.getTreeChildNode(checkNodes)
          for (let i in this.childArr) {
            for (let j in this.selectedArr) {
              if (this.selectedArr[j].data.id === this.childArr[i].id) {
                this.selectedArr.splice(j, 1)
                this.parentArr.splice(j, 1)
                break
              }
            }
          }
        } else {
          for (let i in this.selectedArr) {
            if (checkNodes.data.id === this.selectedArr[i].data.id) {
              this.selectedArr.splice(i, 1)
              this.parentArr.splice(i, 1)
            }
          }
        }
      }
      this.$emit('selectData', this.selectedArr)
    },
    treeClick (node) {
      this.tempArr = []
      this.childArr = []
      let noSameArr = []
      let checkNodes = this.$refs.tree.getNode(node)
      if (checkNodes.checked) {
        if (checkNodes.childNodes.length > 0) {
          this.getTreeChildNode(checkNodes)
          for (let i in this.childArr) {
            let tempNode = this.$refs.tree.getNode(this.childArr[i])
            this.getTreeParentNode(tempNode)
            let flag = true
            for (let j in this.parentArr) {
              if (this.parentArr[j][0].id === this.tempArr[0].id) {
                flag = false
              }
            }
            if (flag) {
              this.parentArr.push(this.tempArr)
            }
            this.tempArr = []
          }
        } else {
          this.getTreeParentNode(checkNodes)
          let flag = true
          for (let j in this.parentArr) {
            if (this.parentArr[j][0].id === this.tempArr[0].id) {
              flag = false
            }
          }
          if (flag) {
            this.parentArr.push(this.tempArr)
          }
        }
        // parentArr 数据添加完毕
        let parentArr = _.cloneDeep(this.parentArr)
        let tempParent = []
        let clone = []
        for (let i in parentArr) {
          if (parentArr[i].length > 1) {
            for (let j = 0; j < parentArr[i].length - 1; j++) {
              parentArr[i][j + 1].childList = [parentArr[i][j]]
              clone = _.cloneDeep(parentArr[i])
            }
          } else {
            clone = _.cloneDeep(parentArr[i])
          }
          tempParent.push(clone[clone.length - 1])
        }
        for (let i = 0; i < tempParent.length; i++) {
          let sameArr = []
          sameArr.push(tempParent[i])
          for (let j = 1; j < tempParent.length; j++) {
            if (tempParent[i].id === tempParent[j].id) {
              sameArr.push(tempParent[j])
            }
          }
          // 如果找到两个以上相同的即sameArr长度大于1  要把sameArr合并  如果等于1  push到noSameArr
          for (let m in sameArr) {
            tempParent.splice(_.findIndex(tempParent, sameArr[m]), 1)
            if (m * 1 > 0) {
              let data = this.findChild(sameArr[m])
              this.findChildId(sameArr[0], data.id, data.childList[0])
            }
          }
          if (tempParent.length >= 1) {
            i--
          }
          noSameArr.push(sameArr[0])
        }
        this.rightTreeList = noSameArr
        for (let i in this.rightTreeList) {
          this.defaultChecked.push(this.rightTreeList[i].id)
        }
      } else {
        let checkedNode = this.$refs.tree2.getNode(node)
        for (let i = 0; i < this.parentArr.length; i++) {
          let flag = false
          for (let j in this.parentArr[i]) {
            if (this.parentArr[i][j].id === node.id) {
              flag = true
            }
          }
          if (flag) {
            this.parentArr.splice(i, 1)
            // i 应该什么时候  --
            if (i === 0) {
              i--
            }
          }
        }
        this.delTreeNode(checkedNode)
      }
      this.$emit('selectData', this.rightTreeList)
    },
    getTreeParentNode (node) {
      if (node.parent) {
        this.tempArr.push(node.data)
        this.getTreeParentNode(node.parent)
      }
    },
    getTreeChildNode (node) {
      if (node.childNodes.length) {
        for (let i in node.childNodes) {
          this.getTreeChildNode(node.childNodes[i])
        }
      } else {
        this.childArr.push(node.data)
      }
    },
    delCheckedTree (item, index) {
      let checkedArr = this.$refs.tree.getCheckedNodes()
      this.$refs.tree.setChecked(checkedArr[_.findIndex(checkedArr, item.data)].id, false)
      this.selectedArr.splice(index, 1)
      for (let i in this.parentArr) {
        if (item.data.id === this.parentArr[i][0].id) {
          this.parentArr.splice(i, 1)
          break
        }
      }
      this.$emit('selectData', this.selectedArr)
    }
  }
}
</script>
<style scoped lang="less">
  .transfer-boder{
    border: 1px solid #E5E9F2;
    padding: 20px;
    height: 500px;
    overflow-y: auto;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .tree-transfer-title {
    padding: 10px 20px;display: flex;flex-flow: row nowrap;justify-content: space-between;
    span {
      font-size: 16px;color:#333333;font-weight: 400;
      flex: 1;
    }
    .input {
      width: 50px;
      flex: 1;
    }
  }
  .tree-transfer .tree-style .el-tree-node .el-tree-node__content:hover{
    background-color: #E5E9F2;
  }
  .tree-transfer .el-input--prefix .el-input__inner{
    padding-left: 30px;
  }
</style>
