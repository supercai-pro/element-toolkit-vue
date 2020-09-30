// 导入组件，组件必须声明 name
import subfieldArea from './src/subfield-area'

// 为组件提供 install 安装方法，供按需引入
subfieldArea.install = function (Vue) {
    Vue.component(subfieldArea.name, subfieldArea)
}

// 默认导出组件
export default subfieldArea
