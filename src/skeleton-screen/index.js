// 导入组件，组件必须声明 name
import skeletonScreen from './src/skeleton-screen'

// 为组件提供 install 安装方法，供按需引入
skeletonScreen.install = function (Vue) {
    Vue.component(skeletonScreen.name, skeletonScreen)
}

// 默认导出组件
export default skeletonScreen
