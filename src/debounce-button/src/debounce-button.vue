<!-- debounce-button -->
<template>
  <el-button :type="type" :plain="plain" :round="round" :icon="icon" :disabled="disabled" :loading="loading" :size="size" :circle="circle" :autofocus="autofocus" :nativeType="nativeType" @click="handleClick"><slot></slot></el-button>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'debounce-button',
  created () {
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    // wait: {
    //   type: Number,
    //   default: 300
    // },
    // options: Object,
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean
  },
  data () {
    return {}
  },
  components: {},
  watch: {},
  methods: {
    handleClick: _.debounce(function (evt) {
      this.$emit('click', evt)
    }, 300, {
      'leading': true,
      'trailing': false
    })
  }
}
</script>
<style></style>
