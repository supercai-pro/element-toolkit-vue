<!-- subfield-area -->
<template>
  <div class="subfield-area">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="left-area" :class="{'has-btn': leftButton}">
        <div class="area-inner" :style="{height: leftMaxHeight + 'px'}">
          <slot name="left"></slot>
        </div>
        <div v-if="this.leftButton" class="left-btn-inner">
          <slot name="left-button"></slot>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" class="right-area" :class="{'has-btn': rightButton}">
        <div class="area-inner" :style="{height: rightMaxHeight + 'px'}">
          <slot name="right"></slot>
        </div>
        <div v-if="this.rightButton" class="right-btn-inner">
          <slot name="right-button"></slot>
        </div>
      </el-col>
      <el-col :span="24">
        <div v-if="this.bottomButton" class="bottom-btn-inner">
          <slot name="bottom-button"></slot>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'subfield-area',
  created () {
  },
  mounted () {
    this.setMaxHeight()
    window.addEventListener('resize', this.setMaxHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setMaxHeight)
  },
  props: {
    marginNum: {
      type: Number,
      default: 42
    },
    bottomButton: {
      type: Boolean,
      default: false
    },
    leftButton: {
      type: Boolean,
      default: false
    },
    rightButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      leftMaxHeight: null,
      rightMaxHeight: null,
      buttonHeight: 60
    }
  },
  components: {},
  watch: {},
  methods: {
    setMaxHeight: _.debounce(function () {
      let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      let header = document.getElementsByClassName('header')
      let pageTitle = document.getElementsByClassName('page-title')
      if (header) {
        header = document.getElementsByClassName('header')[0]
      }
      if (pageTitle) {
        pageTitle = document.getElementsByClassName('page-title')[0]
      }
      let headerHeight = header.offsetHeight || 0
      let pageTitleHeight = pageTitle.offsetHeight || 0
      this.leftMaxHeight = windowHeight - headerHeight - pageTitleHeight - this.marginNum - ((this.bottomButton || this.leftButton) ? this.buttonHeight : 0)
      this.rightMaxHeight = windowHeight - headerHeight - pageTitleHeight - this.marginNum - ((this.bottomButton || this.rightButton) ? this.buttonHeight : 0)
    }, 300)
  }
}
</script>
<style lang="less">

</style>
