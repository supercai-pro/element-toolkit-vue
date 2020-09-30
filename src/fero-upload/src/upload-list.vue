<template>
  <transition-group
    tag="ul"
    :class="[
      'el-upload-list',
      'el-upload-list--' + listType,
      { 'is-disabled': disabled },
      { 'edit-mode': edit },
      { 'remark-mode': remark }
    ]"
    name="el-list"
  >
    <li
      v-for="(file, fileIndex) in files"
      :class="[{'is-edit': editStatus[fileIndex]}, 'el-upload-list__item', 'is-' + file.status, focusing ? 'focusing' : '', {'el-upload-picture-li': (listType === 'picture')}, getItemClass(file)]"
      :key="file.uid"
      tabindex="0"
      @keydown.delete="!disabled && !editStatus[fileIndex] && $emit('remove', file)"
      @focus="focusing = true"
      @blur="focusing = false"
      @click="focusing = false"
    >
      <template v-if="file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(listType) > -1">
        <img
          v-if="isImg(file[props.name], file)"
          :class="{'el-upload-list__item-thumbnail': true, 'el-upload-picture-img': (listType === 'picture')}"
          :src="file[props.src] || file.url" alt=""
        >
        <span v-else class="file-item">{{_.toUpper(getFileType(file[props.name], file))}}</span>
        <div v-if="!editStatus[fileIndex]" :class="{'file-name': true,'picture-edit-input': true,'file-name-picture': (listType === 'picture')}">{{file[props.name]}}</div>
        <div v-if="editStatus[fileIndex]" :class="{'file-name': true,'file-name-picture': (listType === 'picture')}">
          <input class="file-name-input picture-edit-input" v-model="file[props.name]" placeholder="请输入文件名"/>
        </div>
        <div v-if="!editStatus[fileIndex] && remark" :class="{'file-name': true,'picture-edit-input': true,'file-name-picture': (listType === 'picture')}">{{file[props.remark]?file[props.remark]: ''}}</div>
        <div v-if="editStatus[fileIndex]" :class="{'file-name': true,'file-name-picture': (listType === 'picture')}">
          <input class="file-remark-input picture-edit-input" v-model="file[props.remark]" placeholder="请输入备注"/>
        </div>
      </template>
      <a v-if="listType === 'text'" class="el-upload-list__item-name" @click="handleClick(file, fileIndex)">
        <i v-if="isImg(file[props.name], file)" class="el-icon-picture file-type-icon"></i>
        <i v-else class="el-icon-document file-type-icon"></i>
        <div class="file-info-item">
          <input v-if="editStatus[fileIndex]" class="file-name-input" v-model="file[props.name]" placeholder="请输入文件名"/>
          <el-tooltip v-else class="" effect="dark" :content="file[props.name]" placement="top">
            <span class="file-name">{{file[props.name]}}</span>
          </el-tooltip>
        </div>
        <div v-if="remark" class="file-info-item">
          <input v-if="editStatus[fileIndex]" class="file-remark-input" v-model="file[props.remark]" placeholder="请输入备注"/>
          <el-tooltip v-else class="" effect="dark" :content="file[props.remark]" placement="top">
            <span class="file-remark">{{file[props.remark]}}</span>
          </el-tooltip>
        </div>
      </a>
      <label v-if="listType !== 'picture'" class="el-upload-list__item-status-label">
        <i :class="{
          'el-icon-upload-success': true,
          'el-icon-circle-check': listType === 'text',
          'el-icon-check': ['picture-card'].indexOf(listType) > -1
        }"></i>
      </label>
      <!--<a  href="javascript:;" class="del-btn" v-if="!disabled && file.status !== 'uploading'" @click="$emit('remove', file)">删除</a>-->
      <i class="iconfont icon-xiugai1 upload-icon-xiugai1" v-if="edit && listType === 'text' && file.status !== 'uploading'" @click="changeEditMode(fileIndex, file)"></i>
      <i class="el-icon-close" v-if="!disabled && listType !== 'picture'" @click="$emit('remove', file)"></i>
      <i class="el-icon-close-tip" v-if="!disabled">{{ t('el.upload.deleteTip') }}</i> <!--因为close按钮只在li:focus的时候 display, li blur后就不存在了，所以键盘导航时永远无法 focus到 close按钮上-->
      <el-progress
        v-if="file.status === 'uploading'"
        :type="listType === 'picture-card' ? 'circle' : 'line'"
        :class="{'picture-line': listType === 'picture'}"
        :stroke-width="listType === 'picture-card' ? 6 : 2"
        :width="86"
        :percentage="parsePercentage(file.percentage)">
      </el-progress>
      <span class="el-upload-list__item-actions" :class="{'active': editStatus[fileIndex]}" v-if="listType === 'picture-card' && file.status !== 'uploading'">
        <el-popover v-if="edit" class="" placement="top" width="180" v-model="editStatus[fileIndex]" @hide="$emit('edit', {fileIndex, file})">
          <div class="pic-edit-pop">
            <div class="pic-edit-item">
            <span>文件名：</span>
            <input class="file-name-input" v-model="file[props.name]" placeholder="请输入文件名"/>
          </div>
          <div v-if="remark" class="pic-edit-item">
            <span>备注：</span>
            <input class="file-remark-input" v-model="file[props.remark]" placeholder="请输入备注"/>
          </div>
          <div class="confirm-btn">
            <a href="javascript:;" @click="handlePicEdit(file, fileIndex)">完成</a>
          </div>
          </div>
          <span
                  slot="reference"
                  class="el-upload-list__item-edit"
                  v-if="edit && handlePicEdit && listType === 'picture-card'"
          >
            <i class="iconfont icon-xiugai1 upload-icon-xiugai1"></i>
          </span>
        </el-popover>
        <span
          class="el-upload-list__item-preview"
          v-if="handleClick && listType === 'picture-card'"
          @click="handleClick(file, fileIndex)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="$emit('remove', file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
      <span class="el-upload-list__item-actions" :class="{'active': editStatus[fileIndex], 'active-picture-options': true}" v-if="listType === 'picture' && file.status !== 'uploading'">
        <span
                  slot="reference"
                  class="el-upload-list__item-edit edit-icon-font picture-operate-span"
                  v-if="edit && handlePicEdit && listType === 'picture' && !editStatus[fileIndex]"
                  @click="handlePicEdit(file, fileIndex)"
          >
            <i class="iconfont icon-xiugai1 picture-upload-xiugai"></i>
          </span>
        <span
                class="el-upload-list__item-preview upload-picture-zoom picture-operate-span"
                v-if="handleClick && listType === 'picture' && !editStatus[fileIndex]"
                @click="handleClick(file, fileIndex)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
                class="picture-operate-span"
                v-if="!disabled  && !editStatus[fileIndex]"
                @click="$emit('remove', file)"
        >
          <i class="el-icon-delete delete-picture-icon"></i>
        </span>
          <a class="picture-sure" v-if="editStatus[fileIndex]" href="javascript:;" @click="handlePicEdit(file, fileIndex)">确认</a>
      </span>
      <slot v-bind:file="file"></slot>
    </li>
  </transition-group>
</template>
<script>
import Locale from './locale'
import ElProgress from 'element-ui/packages/progress'
import viewer from '../../viewer/index'
import Url from 'url-parse'

export default {

  name: 'ElUploadList',

  mixins: [Locale],

  data () {
    return {
      focusing: false,
      editStatus: []
    }
  },
  components: { ElProgress, viewer },

  props: {
    edit: {
      type: Boolean,
      default: false
    },
    remark: {
      type: Boolean,
      default: false
    },
    files: {
      type: Array,
      default () {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
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
    listType: String,
    itemClass: [String, Function]
  },
  watch: {
  },
  methods: {
    getItemClass (file) {
      if (typeof this.itemClass === 'function') {
        return this.itemClass(file)
      } else {
        return this.itemClass
      }
    },
    // 切换编辑状态
    changeEditMode (index, file) {
      if (this.editStatus[index]) {
        this.$set(this.editStatus, index, false)
      } else {
        this.$set(this.editStatus, index, true)
      }
      if (!this.editStatus[index]) {
        this.$emit('edit', {index, file})
      }
    },
    // 图片名称编辑
    handlePicEdit (file, index) {
      if (this.editStatus[index]) {
        this.$set(this.editStatus, index, false)
      } else {
        this.$set(this.editStatus, index, true)
      }
    },
    parsePercentage (val) {
      return parseInt(val, 10)
    },
    handleClick (file, index) {
      if (this.editStatus[index]) return false
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
    // 图片预览
    viewImg (file) {
      var fileList = []
      var imgIndex = 0
      this.files.forEach((item) => {
        // if ((item[this.props.src] || item.url) === (file[this.props.src] || file.url)) {
        //   imgIndex = index
        // }
        if (this.isImg(item[this.props.name], item)) {
          fileList.push({
            title: item[this.props.name],
            src: item[this.props.src] || item.url
          })
        }
      })
      imgIndex = this._.findIndex(fileList, o => {
        if (o.src === (file[this.props.src] || file.url)) {
          return o
        }
      })
      viewer(fileList, {index: imgIndex})
    }
  }
}
</script>
<style lang="less">
  .pic-edit-pop {
    .pic-edit-item {
      text-align: left;
      margin-bottom: 5px;
      input {
        display: inline-block;
        padding: 2px 5px;
        border: 1px solid #E5E5E5;
        width: 105px;
      }
      span {
        display: inline-block;
        width: 60px;
      }
    }
    .confirm-btn {
      margin-top: 5px;
      text-align: right;
    }
  }

</style>
