// 导入组件，组件必须声明 name
import debounceButton from './src/debounce-button'

// 为组件提供 install 安装方法，供按需引入
debounceButton.install = function (Vue) {
    Vue.component(debounceButton.name, debounceButton)
}

// 默认导出组件
export default debounceButton
