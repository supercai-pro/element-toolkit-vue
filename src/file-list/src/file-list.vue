<!-- file-list -->
<template>
  <ul class="file-list el-upload-list" :class="['el-upload-list--' + listType]">
    <template v-if="listType === 'picture-card'">
      <template v-for="file in files">
        <li :key="file[nodeKey]" v-if="isImg(file[props.src], file)" class="el-upload-list__item" :class="getItemClass(file)">
          <a href="javascript:;" @click="handleClick(file)">
            <img :src="file[props.src]">
            <el-tooltip class="pic-tip-item" effect="dark" placement="right">
              <div slot="content">
                <p>文件名：{{file[props.name]}}</p>
                <p v-if="file[props.remark]">备注：{{file[props.remark]}}</p>
              </div>
              <span class="file-name">{{file[props.name]}}</span>
            </el-tooltip>
          </a>
          <slot v-bind:file="file"></slot>
        </li>
        <li v-else :key="file[nodeKey]" class="el-upload-list__item" :class="getItemClass(file)">
          <a href="javascript:;" @click="handleClick(file)">
            <span class="file-item">{{_.toUpper(getFileType(file[props.src], file))}}</span>
            <el-tooltip class="pic-tip-item" effect="dark" placement="right">
              <div slot="content">
                <p>文件名：{{file[props.name]}}</p>
                <p v-if="file[props.remark]">备注：{{file[props.remark]}}</p>
              </div>
              <span class="file-name">{{file[props.name]}}</span>
            </el-tooltip>
          </a>
          <slot v-bind:file="file"></slot>
        </li>
      </template>
    </template>
    <template v-else>
      <template v-for="file in files">
        <li :key="file[nodeKey]" class="el-upload-list__item" :class="getItemClass(file)">
          <template v-if="isImg(file[props.src], file)">
            <a href="javascript:;" @click="handleClick(file)" class="el-upload-list__item-name">
            <span>
              <i class="el-icon-picture"></i>
              <span>{{file[props.name]}}</span>
            </span>
              <span v-if="file[props.remark]">{{file[props.remark]}}</span>
            </a>
          </template>
          <template v-else>
            <a href="javascript:;" @click="handleClick(file)" class="el-upload-list__item-name">
            <span>
              <i class="el-icon-document"></i>
              <span>{{file[props.name]}}</span>
            </span>
              <span v-if="file[props.remark]">{{file[props.remark]}}</span>
            </a>
          </template>
          <slot v-bind:file="file"></slot>
        </li>
      </template>
    </template>
  </ul>
</template>
<script>
import viewer from '../../viewer/index'
import Url from 'url-parse'
export default {
  name: 'file-list',
  created () {

  },
  props: {
    listType: {
      type: String,
      default: 'text'
    },
    files: {
      type: Array,
      default () {
        return []
      }
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    props: {
      type: Object,
      default () {
        return {
          name: 'name',
          src: 'src',
          remark: 'remark'
        }
      }
    },
    handlePreview: Function,
    itemClass: [String, Function]
  },
  data () {
    return {}
  },
  components: {},
  watch: {},
  methods: {
    getItemClass (file) {
      if (typeof this.itemClass === 'function') {
        return this.itemClass(file)
      } else {
        return this.itemClass
      }
    },
    getFileType (name, file) {
      let type = ''
      if (file && file.type) {
        type = file.type.toLowerCase()
        return type
      }
      if (name) {
        let url = new Url(name)
        let index1 = url.pathname.lastIndexOf('.')
        let index2 = url.pathname.length
        type = url.pathname.substring(index1 + 1, index2).toLowerCase()
      }
      return type
    },
    isImg (name, file) {
      return (this.getFileType(name, file) === 'jpg' || this.getFileType(name, file) === 'jpeg' || this.getFileType(name, file) === 'png' || this.getFileType(name, file) === 'bmp' || this.getFileType(name, file) === 'gif')
    },
    handleClick (file) {
      if (this.handlePreview) {
        this.handlePreview && this.handlePreview(file)
      } else {
        if (this.isImg(file[this.props.name], file)) {
          this.viewImg(file)
        } else {
          window.open(file[this.props.src])
        }
      }
    },
    // 图片预览
    viewImg (file) {
      var fileList = []
      var imgIndex = 0
      this.files.forEach((item) => {
        if (this.isImg(item[this.props.name], item)) {
          fileList.push({
            title: item[this.props.name],
            src: item[this.props.src] || item.url
          })
        }
      })
      imgIndex = this._.findIndex(fileList, o => {
        if (o.src === (file[this.props.src] || file.href)) {
          return o
        }
      })
      viewer(fileList, {index: imgIndex})
    }
  }
}
</script>
<style lang="less">
  .pic-tip-item {
    p {
      line-height: 1.5;
    }
  }
</style>
