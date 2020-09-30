// 导入组件
import authManage from './auth-manage'
import debounceButton from './debounce-button'
import fileList from './file-list'
import feroUpload from './fero-upload'
import pageHeader from './page-header'
import pageTitle from './page-title'
import skeletonScreen from './skeleton-screen'
import pagination from './pagination'
import tableInner from './table-inner'
import searchInner from './search-inner'
import pageSide from './page-side'
import subfieldArea from './subfield-area'
import rulesToolkit from './assets/js/rules-toolkit'
import dialogDrag from './assets/js/dialog-drag'
import transferTree from './transfer-tree'
import viewer from "./viewer";


// 存储组件列表
const components = [
  authManage,
  debounceButton,
  fileList,
  feroUpload,
  pageHeader,
  pageTitle,
  pagination,
  skeletonScreen,
  tableInner,
  searchInner,
  pageSide,
  subfieldArea,
  transferTree
]
// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，则所有的组件都将被注册
const install = function (Vue) {
  // 判断是否可以安装
  if (install.installed) return
  // 遍历注册全局组件
  components.map(component => Vue.component(component.name, component))
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  authManage,
  debounceButton,
  fileList,
  feroUpload,
  pageHeader,
  pageTitle,
  pagination,
  skeletonScreen,
  tableInner,
  searchInner,
  pageSide,
  subfieldArea,
  rulesToolkit,
  dialogDrag,
  transferTree,
  viewer
}
