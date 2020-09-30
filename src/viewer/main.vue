<!-- component -->
<template>
  <div
    id="viewer"
    v-if="visible"
    :class="modal ? 'viewer' : ''"
  >
    <div ref="wrapInner" v-bind:class="computedPosition">
      <div :title="imgInfo.title" class="viewer-title"><span>{{imgInfo.title}}</span><a @click="close" class="viewer-close" href="javascript:;"><i class="el-icon-close"></i></a></div>
      <div ref="viewInner" class="viewer-img" @mousewheel="watchMouse">
        <div v-if="imgs.length > 1" @click="prevImg" class="arrow-inner left"><i class="el-icon-arrow-left"></i></div>
        <img :class="'rotate' + imgClass" ref="imgInner" :src="imgInfo.src" ondragstart="return false" v-drag="onDrag">
        <div v-if="imgs.length > 1" @click="nextImg" class="arrow-inner right"><i class="el-icon-arrow-right"></i></div>
      </div>
      <div class="viewer-tool">
        <div class="tool">
          <span @click="toFullScreen" class="oper-fullscreen" title="全屏查看"><i class="viewer-icons icontool-fullscreen"></i></span>
          <span @click="zoomIn" class="oper-bigger" title="放大图片"><i class="viewer-icons icontool-bigger"></i></span>
          <span @click="zoomOut" class="oper-smaller" title="缩小图片"><i class="viewer-icons icontool-smaller"></i></span>
          <span @click="rotate" class="oper-rotate" title="向右旋转"><i class="viewer-icons icontool-rotate"></i></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  created () {
  },
  data () {
    return {
      imgs: [],
      imgInfo: {},
      visible: false,
      isFull: false,
      imgInner: {
        width: 100,
        height: 100
      },
      full: {
        preWidth: null,
        preHeight: null,
        preTop: null,
        preLeft: null
      },
      imgClass: 0,
      modal: true,
      position: 'center'
    }
  },
  components: {},
  watch: {
    visible: 'viewInfo'
  },
  computed: {
    computedPosition: {
      get: function () {
        let arr = []
        if (this.position === 'center') {
          arr.push('viewer-inner')
        } else if (this.position === 'left') {
          arr.push('viewer-inner-left')
        } else if (this.position === 'right') {
          arr.push('viewer-inner-right')
        } else if (Array.isArray(this.position)) {
          arr.push('custom')
        } else {
          arr.push('viewer-inner')
        }
        if (this.isFull) {
          arr.push('full')
        } else {
          arr.push('')
        }
        return arr
      }
    }
  },
  methods: {
    destroyViewer () {
      document.body.removeChild(document.getElementById('viewer'))
    },
    viewInfo: function (visibleStatus) {
      if (!visibleStatus) return false
      this.$nextTick(() => {
        let img = new Image()
        img.src = this.imgInfo.src
        let viewInner = this.$refs['viewInner']
        if (Array.isArray(this.position)) {
          this.$refs['wrapInner'].style.left = this.position[0] + '%'
          this.$refs['wrapInner'].style.width = this.position[1] + '%'
        }
        // 显示界面宽度、高度
        let viewWidth = viewInner.clientWidth
        let viewHeight = viewInner.clientHeight
        // 图片宽度、高度
        let _this = this
        try {
          img.onload = function () {
            let imgWidth = img.naturalWidth
            let imgHeight = img.naturalHeight
            _this.imgInner.originalWidth = imgWidth
            _this.imgInner.originalHeight = imgHeight
            // 计算图片与显示界面的差值
            // 长度差值
            let differenceWidth = viewWidth - imgWidth
            // 高度差值
            let differenceHeight = viewHeight - imgHeight
            if (differenceWidth >= 0) {
              // 界面比图片宽
              if (differenceHeight > 0) {
                // 界面高度也比图片宽
                if (differenceWidth < differenceHeight) {
                  // 界面宽度差值更小，拉伸图片的宽度
                  let ratio = differenceWidth / imgWidth
                  // 等比拉伸
                  imgWidth = imgWidth * (1 + ratio)
                  imgHeight = imgHeight * (1 + ratio)
                } else {
                  // 界面高度差值更小，拉伸图片高度
                  let ratio = differenceHeight / imgHeight
                  // 等比拉伸
                  imgWidth = imgWidth * (1 + ratio)
                  imgHeight = imgHeight * (1 + ratio)
                }
              } else {
                // 界面比图片宽，但高度比图片低 必须压缩图片高度
                let ratio = Math.abs(differenceHeight) / imgHeight
                // 等比压缩
                imgWidth = imgWidth * (1 - ratio)
                imgHeight = imgHeight * (1 - ratio)
              }
            } else {
              // 界面比图片窄，必须压缩图片宽度
              // 界面比图片宽，但高度比图片低 必须压缩图片高度
              let ratio = Math.abs(differenceHeight) / imgHeight
              // 等比压缩
              imgWidth = imgWidth * (1 - ratio)
              imgHeight = imgHeight * (1 - ratio)
            }
            _this.imgInner.width = imgWidth
            _this.imgInner.height = imgHeight
            _this.setImgInner()
          }
        } catch (e) {
          this.$message.error('无效图片')
        }
      })
    },
    watchMouse (e) {
      if (e.wheelDelta > 0) {
        this.zoomIn()
      } else {
        this.zoomOut()
      }
    },
    toFullScreen () {
      let wrapInner = this.$refs['wrapInner']
      if (this.isFull) {
        this.isFull = false
        this.viewInfo()
        wrapInner.style.width = '80%'
        wrapInner.style.height = '80%'
      } else {
        this.isFull = true
        this.viewInfo()
        this.full.preTop = wrapInner.style.top
        this.full.preLeft = wrapInner.style.left
        wrapInner.style.width = window.innerWidth + 'px'
        wrapInner.style.height = window.innerHeight + 'px'
      }
      // this.setImgInner()
    },
    zoomIn () {
      if (this.imgInner.width > this.imgInner.originalWidth * 10) {
        return false
      }
      this.imgInner.width = this.imgInner.width * 1.1
      this.imgInner.height = this.imgInner.height * 1.1
      this.setImgInner()
    },
    zoomOut () {
      if (this.imgInner.width < this.imgInner.originalWidth * 0.1) {
        return false
      }
      this.imgInner.width = this.imgInner.width * 0.9
      this.imgInner.height = this.imgInner.height * 0.9
      this.setImgInner()
    },
    rotate () {
      if (this.imgClass === 270) {
        this.imgClass = 0
      } else {
        this.imgClass = this.imgClass + 90
      }
    },
    prevImg () {
      var index = this.imgInfo.index
      if (index > 0) {
        let img = this.imgs[index - 1]
        img.index = index - 1
        this.imgInfo = img
        this.viewInfo()
      }
    },
    nextImg () {
      var index = this.imgInfo.index
      if ((index + 1) < this.imgs.length) {
        let img = this.imgs[index + 1]
        img.index = index + 1
        this.imgInfo = img
        this.viewInfo()
      }
    },
    onDrag () {},
    setImgInner () {
      let imgInner = this.$refs['imgInner']
      let viewInner = this.$refs['viewInner']
      imgInner.style.width = this.imgInner.width + 'px'
      imgInner.style.height = this.imgInner.height + 'px'
      imgInner.style.top = (viewInner.clientHeight / 2) - (this.imgInner.height / 2) + 'px'
      imgInner.style.left = (viewInner.clientWidth / 2) - (this.imgInner.width / 2) + 'px'
    },
    close () {
      this.visible = false
    }
  }
}
</script>
<style>
  .viewer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 1002;
  }
  .viewer-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 80%;
    min-height: 200px;
    min-width: 200px;
    transform: translate(-50% ,-50%);
    background-color: #e5e5e5;
    z-index: 1003;
  }
  .custom {
    position: absolute;
    top: 50%;
    width: 80%;
    height: 80%;
    min-height: 200px;
    min-width: 200px;
    transform: translate(-50% ,-50%);
    background-color: #e5e5e5;
    z-index: 1003;
  }
  .viewer-inner-right {
    position: absolute;
    top: 50%;
    right: -13%;
    width: 35%;
    height: 80%;
    min-height: 200px;
    min-width: 200px;
    transform: translate(-50% ,-50%);
    background-color: #e5e5e5;
    z-index: 1003;
  }
  .viewer-inner-left {
    position: absolute;
    top: 50%;
    left: 38%;
    width: 35%;
    height: 80%;
    min-height: 200px;
    min-width: 200px;
    transform: translate(-50% ,-50%);
    background-color: #e5e5e5;
    z-index: 1003;
  }
  .viewer-inner.full {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
  }
  .viewer-title {
    position: relative;
    height: 40px;
    line-height: 20px;
    font-size: 16px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
  }
  .viewer-title span {
    width: calc(100% - 20px);
    box-sizing: border-box;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .viewer-inner.full .viewer-img {
    height: calc(100% - 40px);
  }
  .viewer-img {
    overflow: hidden;
    position: relative;
    width: 100%;
    height: calc(100% - 40px);
  }
  .viewer-img img {
    position: absolute;
    /*width: 100%;*/
    /*height: 100%;*/
    /*top: 50%;*/
    /*left: 50%;*/
    cursor: move;
    z-index: 1100;
    /*transform: translate(-50% ,-50%);*/
  }
  .viewer-close {
    float: right;
    color: #222;
    font-size: 16px;
  }
  .viewer-tool {
    position: absolute;
    bottom: 15px;
    width: 100%;
    text-align: center;
    z-index: 8990;
  }
  .viewer-tool .tool {
    display: inline-block;
    height: 30px;
    background-color: rgba(111,105,101,.7);
    padding: 5px 14px;
    box-sizing: border-box;
    border-radius: 6px;
  }
  .viewer-tool .tool span {
    margin-left: 20px;
  }
  .viewer-tool .tool span:first-child {
    margin-left: 0;
  }
  .viewer-icons {
    position: relative;
    width: 20px;
    height: 20px;
    z-index: 99999;
    display: inline-block;
    background-repeat: no-repeat;
    background-image: url(./viewer.png);
    cursor: pointer
  }

  .viewer-icons.icontool-fullscreen {
    background-position: 0 0
  }

  .viewer-icons.icontool-bigger {
    background-position: 0 -20px
  }

  .viewer-icons.icontool-smaller {
    background-position: 0 -40px
  }

  .viewer-icons.icontool-rotate {
    background-position: 0 -60px
  }
  .viewer-icons.iconclose-small {
    width: 9px;
    height: 9px;
    background-position: 0 -80px
  }
  .arrow-inner {
    position: absolute;
    top: 50%;
    margin-top: -15px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background-color: #000;
    opacity: 0.6;
    border-radius: 50%;
    text-align: center;
    z-index: 1200;
    cursor: pointer;
  }
  .arrow-inner.left {
    left: 15px;
  }
  .arrow-inner.right {
    right: 15px;
  }
  .arrow-inner i {
    font-size: 16px;
  }
  .viewer-img .rotate0{ transform: rotate(0deg);  -webkit-transform: rotate(0deg);}
  .viewer-img .rotate90{ transform: rotate(90deg); -webkit-transform: rotate(90deg);}
  .viewer-img .rotate180{ transform: rotate(180deg); -webkit-transform: rotate(180deg);}
  .viewer-img .rotate270{ transform: rotate(270deg);  -webkit-transform: rotate(270deg);}
</style>
