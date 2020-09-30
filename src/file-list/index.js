// 导入组件，组件必须声明 name
import fileList from './src/file-list'

// 为组件提供 install 安装方法，供按需引入
fileList.install = function (Vue) {
    Vue.component(fileList.name, fileList)
}

// 默认导出组件
export default fileList
