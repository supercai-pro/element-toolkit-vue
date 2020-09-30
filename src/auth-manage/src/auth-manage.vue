<template>
  <span class="authority-management" v-if="show">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'auth-manage',
  props: ['componentCode', 'code', 'featureList'],
  created () {
    this.getFeatureList()
  },
  data () {
    return {
      show: false,
      authCode: this.code || this.componentCode,
      features: this.featureList || this.$store.state.featureList
    }
  },
  methods: {
    // 获取设置的按钮列表
    getFeatureList () {
      if (typeof this.authCode === 'object') {
        if (this.authCode.condition === 'or') {
          this.features.forEach((item) => {
            if (this.authCode.code.indexOf(item.code) !== -1) {
              this.show = true
              return false
            }
          })
        } else {
          let show = true
          this.authCode.code.forEach(value => {
            if (!this._.find(this.features, {code: value})) {
              show = false
            }
          })
          this.show = show
        }
      } else {
        this.features.forEach((item) => {
          if (item.code === this.authCode) {
            this.show = true
            return false
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
