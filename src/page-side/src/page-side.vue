<template>
  <el-aside class="side" :class="sidePtb" :width="myIsCollapseStatus ? 'auto' : '240px'" id="sideScrollTop">
      <div class="side-header el-submenu is-active is-opened" @click="isCollapseFn" v-if="isSide">
        <i class="side-icon-menu iconfont icon-zhankaishenseban"></i>
      </div>
    <el-menu
      class="el-menu-vertical-side"
      :default-active="activeMenu"
      :unique-opened="uniqueOpened"
      :default-openeds="openArr"
      :collapse="myIsCollapseStatus"
      router
      @open="(index, path) => $emit('open', index, path)"
      @close="(index, path) => $emit('close', index, path)"
    >
      <!-- 一级菜单 -->
      <template v-for="(item) in sideMenu">
        <!-- 一级菜单是分组 -->
        <template v-if="item.menu.menuType === '10'">
          <!-- 分组使用menuCode作为index 以免没有menuUrl导致报错 -->
          <el-submenu v-bind:key="item.menu.menuCode" :index="item.menu.menuCode">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.menu.menuName}}</span>
            </template>
            <!-- 二级菜单 -->
            <template  v-for="child in item.childList">
              <!-- 二级菜单是分组 -->
              <el-submenu v-bind:key="child.menu.menuCode" v-if="child.menu.menuType === '10'" :index="child.menu.menuCode">
                <template slot="title">
                  <!--<i class="el-icon-document"></i>-->
                  <span slot="title">{{child.menu.menuName}}</span>
                </template>
                <!-- 三级菜单 三级菜单是页面 -->
                <!--<el-menu-item v-for="child2 in child.child" v-if="child2.menuType === '20'"  :index="child2.url" :key="child2.id"><i class="el-icon-document"></i>{{child2.name}}</el-menu-item>-->
              </el-submenu>
              <!-- 二级菜单是页面 -->
              <el-menu-item :id="'menu_' + child.menu.menuCode" v-if="child.menu.menuType === '20'"  :index="child.menu.menuUrl" :key="child.menu.menuCode">
                <!--<i class="el-icon-document"></i>-->
                {{child.menu.menuName}}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <!-- 一级菜单是页面 -->
        <el-menu-item v-if="item.menu.menuType === '20'"  :index="item.menu.menuUrl" :key="item.menu.menuCode"><i class="el-icon-document"></i>{{item.menu.menuName}}</el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'page-side',
  props: {
    sideMenu: {
      type: Array,
      default () {
        return []
      }
    },
    openMenu: {
      type: Array
    },
      isSide:{
          type: Boolean,
          default: false
      },
      isCollapseStatus:{
          type: Boolean,
          default: false
      },
      uniqueOpened:{
          type: Boolean,
          default: false
      }
  },
  data () {
    return {
      sidePtb:'',
      myIsCollapseStatus: this.$store.state.spread || this.isCollapseStatus,
      loading: false,
      domPage:'',
      sideVal:'',
      opens: [],
      //        activeMenu : this.$store.state.activeMenu,
      error: null,
      sideScroll:''
    }
  },
  created () {
      // this.myIsCollapseStatus = this.isCollapseStatus
  },
  computed: {
    activeMenu: function () {
      // const urlInfo = this.$store.state.activeMenu
      // if (urlInfo.meta.parentUrl) {
      //   return urlInfo.meta.parentUrl
      // } else {
      //   return urlInfo.path
      // }
      let urlArr = this.$store.state.activeMenu.split('/')
      if (urlArr[1] && urlArr[2]) {
        return '/' + urlArr[1] + '/' + urlArr[2]
      } else {
        return '/'
      }
    },
    openArr: function () {
      let arr = []
      if (this.openMenu) {
        arr = this.openMenu
      }else if (this.sideMenu) {
        for (let i = 0; i < this.sideMenu.length; i++) {
          arr.push(this.sideMenu[i].menu.menuCode)
        }
      }
      return arr
    }
  },
  watch: {
      myIsCollapseStatus: function (val) {
        this.$store.commit('isCollapse', val)
        this.$emit('changeIsCollapseStatus', val)
      }
  },
  updated(){
    // 刷新页面滚动到上次记录位置
    this.sideScrollTop()
  },
  mounted(){
      if(!this.isSide){
          this.sidePtb='sidePtb'
      }
      // if(!this.sideVal){
      //     this.isCollapseStatus =this.sideVal
      // }
    window.addEventListener('scroll',this.handleScroll,true)
    // 点击菜单滚动到上次记录位置
    this.sideScrollTop()
  },
  methods: {
    // 记录每次滚动的位置
    handleScroll(e) {
      if(e.target.localName==='aside'){
        this.sideScroll=e.target.scrollTop
       this.debounceScroll()
      }
    },
    debounceScroll: _.debounce(function () {
      window.localStorage.setItem('sideScrollTop', JSON.stringify(this.sideScroll))
    }, 300),
    // 滚动到上次记录位置
    sideScrollTop(){
      this.$nextTick(() =>{
        let sideScrollTop = JSON.parse(window.localStorage.getItem('sideScrollTop'))
        let div = document.getElementById('sideScrollTop')
        if(sideScrollTop) {
          div.scrollTop = sideScrollTop
        }
      })
    },
      // 判断菜单展开收起
      isCollapseFn(){
          this.myIsCollapseStatus=!this.myIsCollapseStatus
          if(this.myIsCollapseStatus ===false){
              this.$store.commit('isCollapse', true)
          }else{
              this.$store.commit('isCollapse', false)
          }
      },
    },
  destroyed: function () {
    //  离开页面清除（移除）滚轮滚动事件
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="less">

</style>
