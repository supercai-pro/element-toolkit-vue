// 导入组件，组件必须声明 name
import pageTitle from './src/page-title'

// 为组件提供 install 安装方法，供按需引入
pageTitle.install = function (Vue) {
    Vue.component(pageTitle.name, pageTitle)
}

// 默认导出组件
export default pageTitle
