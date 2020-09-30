/**
 * main Created by 刘思尧 on 2018/4/11.
 */
import Vue from 'vue'
import Main from './main'
let ViewerConstructor = Vue.extend(Main)
let instance // 查看器实例
Vue.directive('drag', // 自定义指令
  {bind: function (el, binding) {
    let oDiv = el // 当前元素
    oDiv.onmousedown = function (e) {
      let domw = oDiv.parentNode.offsetWidth // 弹出框宽度
      let domh = oDiv.parentNode.offsetHeight // 弹出框高度
      let w = oDiv.width // 图片宽度
      let h = oDiv.height // 图片宽度
      // console.log('domw', domw)
      // console.log('domh', domh)
      // 鼠标按下，计算当前元素距离可视区的距离
      let disX = e.clientX - oDiv.offsetLeft
      let disY = e.clientY - oDiv.offsetTop
      // console.log('disX', disX)
      // console.log('disY', disY)
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let l = e.clientX - disX
        let t = e.clientY - disY
        // 限位 避免被完全移出显示区
        /* if (l < -(0.95 * w) || l > (0.95 * domw)) {
          return false
        }
        if (t < -(0.95 * h) || t > (0.95 * domh)) {
          return false
        } */
        // console.log('e.clientX', e.clientX)
        // console.log('e.clientY', e.clientY)
        // console.log('disX', disX)
        // console.log('disY', disY)
        // console.log('l', l)
        // console.log('t', t)
        // console.log('nml', oDiv.style.marginLeft)
        // console.log('oml', oDiv.style.marginLeft)
        if (w <= domw) {
          if (l < 0) {
            l = 0
          } else if (l > domw - w) {
            l = domw - w
          }
        } else {
          if (l > 0) {
            l = 0
          } else if (l < domw - w) {
            l = domw - w
          }
        }
        if (h <= domh) {
          if (t < 0) {
            t = 0
          } else if (t > domh - h) {
            t = domh - h
          }
        } else {
          if (t > 0) {
            t = 0
          } else if (t < domh - h) {
            t = domh - h
          }
        }
        oDiv.style.left = l + 'px'
        oDiv.style.top = t + 'px'
        // 将此时的位置传出去
        binding.value({x: e.pageX, y: e.pageY})
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
  }
)
const viewer = function (imgInfo, options, callback) {
  if (Vue.prototype.$isServer) return
  options = options || {}
  let close = null
  if (typeof imgInfo === 'object') {
    if (Array.isArray(imgInfo)) {
      // 支持多张切换
      options.imgs = imgInfo
      imgInfo[options.index].index = options.index
      options.imgInfo = imgInfo[options.index]
    } else {
      // 单张图片
      options.imgInfo = imgInfo
    }
  } else if (typeof imgInfo === 'string') {
    // 只有图片url
    if (imgInfo === 'destroy') {
      close = imgInfo
    } else {
      options.imgInfo = {
        src: imgInfo,
        title: ''
      }
    }
  }
  if (close) {
    instance.destroyViewer()
    return false
  }
  instance = new ViewerConstructor({
    data: options
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true
  instance.dom = instance.vm.$el
  if (callback) {
    callback(instance)
  }
}
export default viewer
