// 导入组件，组件必须声明 name
import searchInner from './src/search-inner'

// 为组件提供 install 安装方法，供按需引入
searchInner.install = function (Vue) {
    Vue.component(searchInner.name, searchInner)
}

// 默认导出组件
export default searchInner
