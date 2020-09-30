// 导入组件，组件必须声明 name
import authManage from './src/auth-manage'

// 为组件提供 install 安装方法，供按需引入
authManage.install = function (Vue) {
    Vue.component(authManage.name, authManage)
}

// 默认导出组件
export default authManage
