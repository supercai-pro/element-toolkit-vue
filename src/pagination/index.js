// 导入组件，组件必须声明 name
import pagination from './src/pagination'

// 为组件提供 install 安装方法，供按需引入
pagination.install = function (Vue) {
    Vue.component(pagination.name, pagination)
}

// 默认导出组件
export default pagination
