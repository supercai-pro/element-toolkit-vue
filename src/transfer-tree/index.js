// 导入组件，组件必须声明 name
import transferTree from './src/transfer-tree'

// 为组件提供 install 安装方法，供按需引入
transferTree.install = function (Vue) {
    Vue.component(transferTree.name, transferTree)
}

// 默认导出组件
export default transferTree
