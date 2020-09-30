<!-- page-title -->
<template >
  <div class="page-title" :class="pageWidth">
    <div class="breadcrumb">
      <i class="el-icon-location breadcrumb-icon"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <slot name="breadcrumb">
          <el-breadcrumb-item v-for="item in breadcrumbInfoList" :key="item.name" :to="item.path">
            <i class="iconfont bread-icon" :class="'icon-' + item.icon" v-if="item.icon"></i>
            <span>{{ item.title }}</span>
          </el-breadcrumb-item>
        </slot>
      </el-breadcrumb>
    </div>
    <div class="btn-inner">
      <slot name="btn-inner"></slot>
      <div class="btn-group" v-if="showBackBtn">
        <el-button icon="iconfont icon-fanhui" @click="$router.back()">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'page-title',
        created () {
            this.getBreadcrumb()
            this.sideStatus(this.$store.state.spread)
        },
        props: {
            showBackBtn: {
                type: Boolean,
                default: false
            },
            indexObj:{
                type: [Boolean,Object],
                default: false
            },
            showPageTitle:{}
        },
        data () {
            return {
                breadcrumbInfoList: [],
                pageWidth:''
            }
        },
        components: {},
        watch: {
            // 监听pageTitle
            '$store.state.spread': function (val) {
                this.sideStatus(val)
            }
        },
        methods: {
            getBreadcrumb () {
                let routeInfo = this.$route
                // console.log(this.$route)
                let breadcrumbArr = []
                let info = {
                    title: routeInfo.meta.title,
                    path: routeInfo.fullPath,
                    group: routeInfo.meta.group,
                    name: routeInfo.name,
                    icon: routeInfo.meta.icon?routeInfo.meta.icon: null
                }
                breadcrumbArr.push(info)
                let getGroup = (info) =>{
                    if(info.meta.group){
                        let groupInfo = {
                            title: info.meta.group
                        }
                        breadcrumbArr.push(groupInfo)
                    } else {
                        return false
                    }
                    if(this.$router){
                        this.$router.options.routes.forEach((item) => {
                            if(item.name ==='index'){
                                if(this.indexObj === true) {
                                    let indexInfo = {
                                        title: '首页',
                                        path: item.path,
                                        name: item.name
                                    }
                                    breadcrumbArr.push(indexInfo)
                                } else if(this.indexObj){
                                    let indexInfo = {
                                        title: this.indexObj.indexTitle,
                                        path: item.path,
                                        name: item.name
                                    }
                                    breadcrumbArr.push(indexInfo)
                                }
                            }
                        })
                    }
                }
                let getParent = (info) => {

                    if (info.meta.parentName) {
                        let parent = this._.find(this.$router.options.routes, o => {
                            return o.name === info.meta.parentName
                        })
                        // console.log('parent',parent)
                        let parentInfo = {
                            title: parent.meta.title,
                            path: parent.path,
                            name: parent.name
                        }
                        breadcrumbArr.push(parentInfo)
                        getParent(parent)
                    } else {
                        return false
                    }
                }
                getParent(routeInfo)
                getGroup(routeInfo)
                this._.reverse(breadcrumbArr)
                this.breadcrumbInfoList = breadcrumbArr
                // console.log(this.breadcrumbInfoList)
            },
            sideStatus(flag){
               if(!flag){
                   this.pageWidth =''
               } else{
                   this.pageWidth ='pageWidth'

               }
            }
        },
    }
</script>
<style lang="less">
</style>
