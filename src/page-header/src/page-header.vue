<template>
  <el-header class="header" height="48px">
    <h1 class="logo">
      <a :href="consoleDomain || '/'" class="logo-title"><i class="bicon-logo" :style="{backgroundImage: `url(${logoImg})`}"></i></a>
    </h1>
    <div class="logo-subtitle">
      <router-link to="/">{{ projectTitle }}</router-link>
    </div>
    <slot name="account">
      <div v-if="layout && layout.length > 0" class="account">
        <slot name="before-welcome"></slot>
        <span v-if="layout.indexOf('welcome') !== -1" class="welcome-msg">您好！<span>{{ empName }}</span></span>
        <slot name="after-welcome"></slot>
        <a v-if="layout.indexOf('center') !== -1" class="account-link" :href="`${consoleDomain}`">
          <i class="iconfont icon-gerenzhongxin"></i>
          <span style="">个人中心</span>
        </a>
        <a v-if="layout.indexOf('setting') !== -1" class="account-link" :href="`${consoleDomain}/user/setting`">
          <i class="iconfont icon-shezhi"></i>
          <span style="">设置</span>
        </a>
        <el-badge v-if="layout.indexOf('todo') !== -1" :value="untreatedTodoNum" :hidden="untreatedTodoNum > 0 ? false : true" :max="maxNum" :is-dot="isDot && untreatedTodoNum > 0 ? true : false">
          <router-link class="account-link" :to="{name: 'todo'}" @click="$emit('clickTodo')">
            <i class="iconfont icon-daibanshixiang"></i>
            <span style="">待办事项</span>
          </router-link>
        </el-badge>
        <el-badge v-if="layout.indexOf('message') !== -1" :value="unreadMessageNum" :hidden="unreadMessageNum > 0 ? false : true" :max="maxNum" :is-dot="isDot && unreadMessageNum > 0 ? true : false">
          <a :href="messageLink" class="account-link" @click="$emit('clickMessage')">
            <i class="iconfont icon-xiaoxi"></i>
            <span style="">消息</span>
          </a>
        </el-badge>
        <slot name="before-login"></slot>
        <a v-if="layout.indexOf('logout') !== -1" class="account-link" href="javascript:;" @click="logOut">
          <i class="iconfont icon-tuichu"></i>
          <span style="">退出</span>
        </a>
        <slot name="after-login"></slot>
      </div>
    </slot>
  </el-header>
</template>
<script>
export default {
  name: 'page-header',
  props: {
    isDot: {
      type: Boolean,
      default: true
    },
    maxNum: {
      type: Number,
      default: 99
    },
    logoImg: {
      type: String,
      default: ''
    },
    projectTitle: {
      type: String,
      default: '管理平台'
    },
    empName: {
      type: [String, Number],
      default: ''
    },
    consoleDomain: {
      type: String,
      default: ''
    },
    untreatedTodoNum: {
      type: Number,
      default: null
    },
    unreadMessageNum: {
      type: Number,
      default: null
    },
    messageLink: {
      type: String,
      default: 'javascript:;'
    },
    layout: {
      type: Array,
      default () {
        return ['welcome', 'center', 'setting', 'todo', 'message', 'logout']
      }
    }
  },
  data () {
    return {
      loading: false,
      messageViewStatus: false
    }
  },
  created () {
    // this.getEmpName()
  },
  methods: {
    logOut () {
      this.$emit('logout')
    },
  },
  watch: {
  }
}
</script>
<style lang="less">
</style>
