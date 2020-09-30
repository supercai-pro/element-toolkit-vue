<template>
  <div>
    <el-col :xs="item.fieldType === 'datetimerange' ? 24 : 24" :sm="item.fieldType === 'datetimerange' ? 24 : 24" :md="item.fieldType === 'datetimerange' ? 12 : 12" :lg="item.fieldType === 'datetimerange' ? 12 : 6" :xl="item.fieldType === 'datetimerange' ? 12 : 6" v-for="item in searchItem" :key="item.key">
      <el-form-item>
        <slot name="label"><label :style="{width: labelWidth ? labelWidth : 'auto', marginLeft: labelWidth ? ('-' + labelWidth) : 0}" class="el-form-item__label"><i v-if="item.iconClass" :class="item.iconClass"></i>{{item.label}}：</label></slot>
        <el-input v-if="item.fieldType === 'input'" :placeholder="item.placeholder" v-model="item.value"></el-input>
        <el-select v-if="item.fieldType === 'select'" v-model="item.value" :placeholder="item.placeholder">
          <el-option v-for="optionItem in item.options" :key="optionItem.value" :label="optionItem.label" :value="optionItem.value"></el-option>
        </el-select>
        <el-date-picker
          v-if="item.fieldType === 'datetimerange'"
          v-model="item.value"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          :start-placeholder="item.startPlaceholder"
          :end-placeholder="item.endPlaceholder">
        </el-date-picker>
      </el-form-item>
    </el-col>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: {
    labelWidth: {
      type: [String, Number]
    },
    searchItem: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
<style></style>
