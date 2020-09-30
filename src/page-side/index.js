// 导入组件，组件必须声明 name
import pageSide from './src/page-side'

// 为组件提供 install 安装方法，供按需引入
pageSide.install = function (Vue) {
    Vue.component(pageSide.name, pageSide)
}

// 默认导出组件
export default pageSide
