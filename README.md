[TOC]

# 源码及演示环境地址

源码：http://192.168.0.221:7003/project-base/admin-demo-vue

演示环境：http://admin-demo.dev.fero.com.cn

项目生成器模板：http://192.168.0.221:7003/liusiyao/vue-template

# 包管理

## 上传包
> **注意：每次更新包，必须修改`package.json`中的版本号，并执行`npm run lib`构建**
1. 使用用户名密码邮箱登录本地NPM库

   ```shell
   npm login -registry http://192.168.0.221:7004/repository/npm-hosted/
   Username:npm
   Password:1qaz2wsx
   Email: npm@fero.com.cn
   ```

   成功后显示 `Logged in as npm on http://192.168.0.221:7004/repository/npm-hosted/.`​

2. 执行 `npm publish -registry http://192.168.0.221:7004/repository/npm-hosted/`

   成功后显示 `+ fero-toolkit-vue@x.x.x`

## 撤销包版本
`npm unpublish fero-toolkit-vue@x.x.x -registry http://192.168.0.221:7004/repository/npm-hosted/`

##使用包

`npm i -registry http://192.168.0.221:7004/repository/npm-group/fero-toolkit-vue`

# 组件文档

## authority-management 权限控制

用于根据授权功能列表进行页面元素的权限控制

> 依赖store中的featureList

### 基本用法

基础的组件使用方法

``` vue
<template>
	<auth componentCode="features-code">
    <el-button type="primary">编辑</el-button>
  </auth>
</template>
<script>
	import auth from '@/components/authority-management'
  export default {
    components: {
    	auth: auth
  	},
  }
</script>
```

`componentCode`的值是**预先定义**好的需要权限控制功能元素的功能code，该code不在功能列表中组件slot内容**不会**被渲染。

### 多code共通功能，支持简单逻辑判断

适用于同一个需要控制的元素具有多个功能code，如页面复用等情况

``` vue
<template>
	<auth :componentCode="{code: ['export-credit-btn', 'approve-export-credit-btn'], condition: 'or'}">
    <el-button type="primary">导出PDF</el-button>
  </auth>
</template>
<script>
	import auth from '@/components/authority-management'
  export default {
    components: {
    	auth: auth
  	},
  }
</script>
```
`componentCode`支持传递对象`code`**必须**为数组；`condition`为逻辑判断条件支持`or`和`and`，`or`只要数组中有一个code存在于功能列表中即有权限，`and`为数组中的code在功能列表中都存在才有权限。

### 属性

| 参数          | 说明                                                    | 类型          | 可选值 | 默认值 |
| ------------- | ------------------------------------------------------- | ------------- | ------ | ------ |
| componentCode | 功能code                                                | string/object |        |        |
| code          | 简写，与`componentCode`完全相同，两个都传只有`code`生效 | string/object |        |        |

### componentCode为对象时

| 参数      | 说明                            | 类型   | 可选值 | 默认值 |
| --------- | ------------------------------- | ------ | ------ | ------ |
| code      | 多个功能code                    | array  |        |        |
| condition | 判断条件，不是`or`时按`and`处理 | string | or/and | and    |

## header 头部

固定在页面顶部的全局头部

### 基本用法

``` vue
<template>
	<el-container direction="vertical">
    <page-header></page-header>
  </el-container>
</template>
<script>
	import pageHeader from '@/components/header'
  export default {
    components: {
    	'page-header': pageHeader
  	},
  }
</script>
```

### 属性

| 参数             | 说明                                                    | 类型           | 可选值 | 默认值                                                       |
| ---------------- | ------------------------------------------------------- | -------------- | ------ | ------------------------------------------------------------ |
| logoImg          | logo的图片资源路径                                      | String         |        |                                                              |
| projectTitle     | 简写，与`componentCode`完全相同，两个都传只有`code`生效 | String         |        | 管理平台                                                     |
| empName          | 用户名                                                  | String, Number |        |                                                              |
| consoleDomain    | 控制台域名                                              | String         |        |                                                              |
| untreatedTodoNum | 未处理待办事项数量                                      | Number         |        |                                                              |
| unreadMessageNum | 未处理消息数量                                          | Number         |        |                                                              |
| layout           | 布局控制                                                | Array          |        | ['welcome', 'center', 'setting', 'todo', 'message', 'logout'] |
| messageLink      | 消息跳转链接，URL形式                                   | String         |        | JavaScript:;                                                 |

### 事件

| 事件名称     | 说明           | 回调参数 |
| ------------ | -------------- | -------- |
| logout       | 点击退出时触发 |          |
| clickMessage | 点击消息时触发 |          |
| clickTodo    | 点击待办时触发 |          |

### 插槽

| name           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| account        | 传入后完全覆盖右侧操作区，empName、untreatedTodoNum、unreadMessageNum、layout 无效 |
| before-welcome | 欢迎信息前，必须layout有至少一项                             |
| after-welcome  | 欢迎信息后，必须layout有至少一项                             |
| before-login   | 退出操作前，必须layout有至少一项                             |
| after-login    | 退出操作后，必须layout有至少一项                             |

## page-title 标题栏

固定在内容区顶部的标题、操作栏

标题和操作都可通过slot自定义，返回按钮通过属性开启

标题默认通过路由中的`meta.title`获取当前页面标题，通过`meta.parentName`递归读取上级页面标题和路径，注意上级路径是使用动态路由(:id这种形式)的自动读取无法动态改变标题需要手动配置。
面包屑 组通过`meta.group`获取组的名称，首页可配置通过`indexObj`配置控制首页是否展示于面包屑中，支持boolean和对象形式，对象形式支持自定义面包屑主页名称。

> 已集成在`src/layouts/default.vue`中

### 基本用法

``` vue
<template>
	<el-main>
    <page-title :showBackBtn="true">
      <template slot="btn-inner">
      	<el-button icon="iconfont icon-xinzeng" type="success">新增</el-button>
    	</template>
		</page-title>
  </el-main>
</template>
<script>
	import pageHeader from '@/components/header'
  export default {
    components: {
    	'page-header': pageHeader
  	},
  }
</script>
```

### 标题自定义用法

``` vue
<template>
	<el-main>
    <page-title :showBackBtn="true">
      <template slot="breadcrumb">
        <el-breadcrumb-item>页面名称</el-breadcrumb-item>
      </template>
      <template slot="btn-inner">
      	<el-button icon="iconfont icon-xinzeng" type="success">新增</el-button>
    	</template>
		</page-title>
  </el-main>
</template>
<script>
	import pageHeader from '@/components/header'
  export default {
    components: {
    	'page-header': pageHeader
  	},
  }
</script>
```
### 面包屑首页配置

``` vue
<template>
  <el-container class="default-layout" direction="vertical">
    <page-header :logoImg="require('../assets/images/logo.png')" :emp-name="empName" @logout="logout"></page-header>
    <el-container class="main-container">
      <page-side :sideMenu="this.$store.state.sideMenu"></page-side>
      <el-main :class="{ 'no-title': !showPageTitle }">
        <page-title :showBackBtn="showBackBtn" v-if="showPageTitle" :indexObj="{ indexTitle: '主页' }">
          <slot name="breadcrumb" slot="breadcrumb"></slot>
          <slot name="btn-inner" slot="btn-inner"></slot>
        </page-title>
        <slot></slot>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import {cookie} from '../assets/js/config'

export default {
  name: 'default-layout',
}
</script>
```

### 属性

| 参数          | 说明         | 类型    | 可选值     | 默认值 |
| ------------- | ------------ | ------- | ---------- | ------ |
| show-back-btn | 显示返回按钮 | boolean | true/false | false  |
| indexObj | 配置面包屑首页项显示隐藏 |  boolean/object  |         |   boolean   |

### indexObj为对象时

| 参数      | 说明                            | 类型   | 可选值 | 默认值 |
| --------- | ------------------------------- | ------ | ------ | ------ |
|indexTitle | 面包屑首页标题定义名              | string  |        |   首页     |

### 插槽

| name       | 说明                                             |
| ---------- | ------------------------------------------------ |
| breadcrumb | 面包屑导航，请直接传入`<el-breadcrumb-item>`元素 |
| btn-inner  |                      按钮操作区               |


## pagination 分页

分页组件，默认layout为 `prev, pager, next, jumper`可根据需要直接修改组件

### 基本用法

``` vue
<template>
	<pagination :total="total" :pageNum="pageNum" :pageSize="pageSize" :pages="pages" :pageId="pageId" @changePageNum="changePageNum"></pagination>
</template>
<script>
	import pagination from '@/components/pagination'
  export default {
    components: {
    	pagination: pagination
  	},
    data () {
      return {
        total: 10,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        pageId: 'demo1'
      }
    },
    methods: {
      changePageNum ({pageId, pageNum}) {
        console.log({pageId, pageNum})
      }
    }
  }
</script>
```

### 属性

| 参数     | 说明       | 类型          | 可选值 | 默认值 |
| -------- | ---------- | ------------- | ------ | ------ |
| pageNum  | 页数       | number        |        |        |
| total    | 总条数     | number        |        |        |
| pageSize | 每页条目数 | number        |        |        |
| pages    | 总页数     | number        |        |        |
| pageId   | 分页器ID   | String/Number |        |        |

### 事件

| 事件名称      | 说明           | 回调参数          |
| ------------- | -------------- | ----------------- |
| changePageNum | 分页改变时触发 | {pageId, pageNum} |

## search-inner 查询栏

放置查询条件表单的组件,可以通过下拉自定义配置查询项

### 基本用法

``` vue
<template>
	<search-inner :searchId="demo1" :searchForm="searchForm" @submit-search="search" @clear-search="reset">
    <template slot-scope="scope">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="文字输入：">
            <el-input placeholder="请输入文字输入" v-model="searchForm.input1"></el-input>
  				</el-form-item>
 		 		</el-col>
  		</el-row>
		</template>
	</search-inner>
</template>
<script>
	import searchInner from '@/components/search-inner'
  export default {
    components: {
    	'page-header': pageHeader
  	},
    data () {
      return {
        searchForm: {
          input1: ''
        }
      }
    },
    methods: {
      search ({searchId, searchForm}) {
      console.log(searchId, searchForm)
    },
    reset (searchId) {
      console.log('清空', searchId)
    },
    }
  }
</script>
```

### 配置自定义查询项用法
``` vue
<template>
	<search-inner :searchId="demo1" :moreSearch="true" :searchOption="searchOption" :searchForm="searchForm" @submit-search="search" @clear-search="reset" @selectSearch="selectSearch">
	</search-inner>
</template>
<script>
	import searchInner from '@/components/search-inner'
  export default {
    components: {
    	'page-header': pageHeader
  	},
    data () {
      return {
        searchForm: {
          input1: ''
        }，
        searchOption: [
                {
                  key: 1,
                  fieldType: 'input',
                  label: '用信单号',
                  placeholder: '请输入文字',
                  isMust: true,
                  prop: 'no',
                  value: ''
                },
                {
                  key: 4,
                  fieldType: 'input',
                  label: '申请人',
                  placeholder: '请输入文字',
                  isMust: false,
                  prop: 'name',
                  value: ''
                },
                {
                  key: 5,
                  fieldType: 'input',
                  label: '授信单号',
                  placeholder: '请输入文字',
                  isMust: false,
                  prop: 'no2',
                  value: ''
                },
                {
                  key: 2,
                  fieldType: 'select',
                  label: '状态',
                  placeholder: '请选择状态',
                  isMust: false,
                  prop: 'status',
                  options: [
                    {
                      label: '通过',
                      value: 1
                    },
                    {
                      label: '驳回',
                      value: 2
                    }
                  ],
                  value: ''
                },
                {
                  key: 3,
                  fieldType: 'datetimerange',
                  isMust: false,
                  label: '时间范围',
                  startPlaceholder: '开始时间',
                  endPlaceholder: '结束时间',
                  prop: 'money',
                  value: []
                }
              ]
      }
    },
    methods: {
      search ({searchId, searchForm}) {
      console.log(searchId, searchForm)
    },
    reset (searchId) {
      console.log('清空', searchId)
    },
    selectSearch (value) {
          // 把选择的查询项传给table-inner的columnProp属性
          this.columnProp = value
          // 因为表格列增加了，所以要重新获取表格数据
        },
    }
  }
</script>
```

### 属性

| 参数          | 说明                            | 类型           | 可选值 | 默认值   |
| ------------- | ------------------------------- | -------------- | ------ | -------- |
| searchId      | 搜索框ID(如果页面有多个<br>search-inner,ID必填)<br/> | number/string  |        |      ' '    |
| title         | 搜索框标题                      | String         |        | 条件筛选 |
| searchBtn     | 搜索按钮文字，传`false`隐藏按钮 | String/Boolean |        | 搜索     |
| clearBtn      | 清空按钮文字，传`false`隐藏按钮 | String/Boolean |        | 清空     |
| foldBtn       | 是否显示折叠搜索条件按钮        | Boolean        |        | false    |
| labelPosition | 表单域标签的位置                | String         |        | left     |
| labelWidth    | 表单域标签的宽度                | String         |        |          |
| searchForm    | 搜索条件(可以给自定义查询项赋默<br>认值,使用slot自己写查询项时仍在</br><br>此处传值)</br>| Object         |        | {}       |
| moreSearch    | 是否显示自定义查询项的下拉选择  | Boolean        |        |   false  |
| searchOption  | 查询条件配置项                  | Object         |        |   {}     |

### searchOption可配置项

| 参数          | 说明                            | 类型           | 可选值 |
| ------------- | ------------------------------- | -------------- | ------ |
| key           |唯一的标识                       | Number         |        |
| fieldType     |查询项的类型                     | String         |input/select/datetimerange|
| isMust        |是否为不可配置的查询项           | Boolean        |        |
| label         |查询项的label值                  | String         |        |
| placeholder   |查询项的placeholder的值<br>fieldType为input和select时配置此项          | String         |        |
|startPlaceholder|查询项的placeholder的值<br>fieldType为datetimerange时配置此项          | String         |        |
|endPlaceholder |查询项的placeholder的值<br>fieldType为datetimerange时配置此项          | String         |        |
| prop          |与列表列对应的值，必须与列表列的prop对应上| String         |        |
| value         |查询项绑定的值                   | String         |        |
| options       |当fieldType为select时，下拉选项绑定的数组| Array  |        |
| iconClass |搜索条件的图标class，按正常class格式传递如：“iconfont icon-yewuzhuti”| String | |

### 插槽

| name | 说明                                                         |
| ---- | ------------------------------------------------------------ |
| -    | 请直接传入`<el-col>`元素，`searchForm`会通过`slot-scope`返回，在绝大多数情况用不上 |

### 事件

| 事件名称    | 说明             | 回调参数               |
| ----------- | ---------------- | ---------------------- |
|submit-search| 点击搜索按钮触发，如果使用可自定义查询，必须使用方法返回的searchForm | {searchId, searchForm} |
| reset       | 点击重置按钮触发 | searchId               |
| selectSearch| 自定义查询项下拉列表变化时触发 | {value, selectedSearch}|
| save          |本地存储已经自定义的查询项<br>返回Object,search存储的是查询项</br><br>moreSelectValue存储的是下拉列</br><br>表选中的值,key值为本地存储时的</br><br>key值，value是存储的数据</br>|     {search:{key,value}, moreSelectValue:{key, value}}|

## side 侧栏

固定在页面左侧的菜单栏
> 已集成在`src/layouts/default.vue`中

### 基本用法

``` vue
<template>
	<el-container class="main-container">
      <page-side></page-side>
  </el-container>
</template>
<script>
	import pageSide from '@/components/side'
  export default {
    components: {
    	'page-side': pageSide
  	},
  }
```

### 可配置侧栏显示隐藏

`isSide`的值是**预先定义**好的,用于配置侧栏显示隐藏功能。

> 已集成在`src/layouts/default.vue`中

``` vue
<template>
	<el-container class="main-container">
      <page-side :isSide='true'></page-side>
  </el-container>
</template>
<script>
	import pageSide from '@/components/side'
  export default {
    components: {
    	'page-side': pageSide
  	}
  }
```

### 属性

|    参数   |         说明          |      类型     | 可选值   |    默认值    |
| -------- | -------------------- | ------------- | ------ |   ------    |
| isSide   |  侧栏显示隐藏功能配置项   | boolean       |        |   false      |

## table-inner 表格容器

整合标题、按钮、表格和分页的综合表格区域,可自定义要展示的列表项

### 基本用法

``` vue
<template>
	<table-inner title="列表" :table-data="tableList.list" :pageNum="tableList.pageNum" :pageSize="tableList.pageSize" :pages="tableList.pages" pageId="test1" @changePageNum="changePageNum">
    <template slot="btn-inner">
      <el-button type="primary">按钮1</el-button>
    </template>
    <template slot="table-columns">
			<el-table-column prop="no" label="编号"></el-table-column>
		</template>
  </table-inner>
</template>
<script>
	import tableInner from '@/components/table-inner'
  export default {
    components: {
    	'table-inner': tableInner
  	},
    data () {
      return {
        tableList: {
          total: 10,
          pageNum: 1,
          pageSize: 10,
          pages: 1,
          list: [
            no: 'A001'
          ]
        }
      }
    },
    methods: {
      changePageNum ({pageId, pageNum}) {
        console.log({pageId, pageNum})
      }
    }
  }
</script>
```

### 自定义展示列表项的用法

``` vue
<template>
	<table-inner :tableId="1" title="列表" :showMoreColumns="true" :columnProp="columnProp" :columnOption="columnOption" :table-data="tableList.list" :pageNum="tableList.pageNum" :pageSize="tableList.pageSize" :pages="tableList.pages" pageId="test1" @changePageNum="changePageNum" @tableChange="tableChange">
    <template slot="btn-inner">
      <el-button type="primary">按钮1</el-button>
    </template>
    <template slot="table-columns">
              <el-table-column fixed="right" label="操作" width="200px">
              <template slot-scope="scope">
              <a class="text-btn" href="javascript:;">补充资料</a>
              <a class="text-btn" href="javascript:;">编辑</a>
              <a class="text-btn" href="javascript:;" @click="submitSome(scope.row.id)">提交</a>
              <a class="text-btn danger" href="javascript:;">删除</a>
              </template>
              </el-table-column>
            </template>
  </table-inner>
</template>
<script>
	import tableInner from '@/components/table-inner'
  export default {
    components: {
    	'table-inner': tableInner
  	},
    data () {
      return {
        tableList: {
          total: 10,
          pageNum: 1,
          pageSize: 10,
          pages: 1,
          list: [
            no: 'A001'
          ]
        }，
        columnOption: [
                {
                  key: 1,
                  prop: 'no',
                  label: '用信单号',
                  formatter: 'isEffective',
                  isMust: true
                },
                {
                  key: 2,
                  prop: 'name',
                  label: '申请人',
                  formatter: 'isEffective',
                  isMust: false
                },
                {
                  key: 3,
                  prop: 'no2',
                  label: '授信单号',
                  formatter: 'isEffective',
                  isMust: false
                },
                {
                  key: 4,
                  prop: 'status',
                  label: '状态',
                  formatter: 'formatStatus',
                  isMust: false
                },
                {
                  key: 5,
                  prop: 'money',
                  label: '时间范围',
                  formatter: 'tableMoneyFormat',
                  isMust: false
                }
              ]
      }
    },
    methods: {
      tableChange () {
          console.log('列表改变')
          // 表格内容变化 需要重新请求数据
        },
      changePageNum ({pageId, pageNum}) {
        console.log({pageId, pageNum})
      }
    }
  }
</script>
```

### 属性

| 参数        | 说明             | 类型          | 可选值     | 默认值   |
| ----------- | ---------------- | ------------- | ---------- | -------- |
| tableId     | 表格id(页面多个表格时必传)|Number|            |          |
| tableHeader | 表格头部         | Boolean       | true/false | true     |
| tableFooter | 表格底部         | Boolean       | true/false | true     |
| title       | 标题，位于头部内 | String        |            | 搜索结果 |
| border      | 边线             | Boolean       | true/false | false    |
| stripe      | 斑马纹           | Boolean       | true/false | true     |
| height      | Table 的高度     | string/number |            |          |
| rowClassName| 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。| Function({row, rowIndex})/String |            |          |
| showSummary | 是否在表尾显示合计行 | Boolean   | true/false | false    |
| rowKey      | 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的 | Function(row)/String |            |          |
| treeProps   | 渲染嵌套数据的配置选项(主要用于Table树形数据) | Object   |            | { hasChildren: 'hasChildren', children: 'children' }    |
| lazy        | 是否懒加载子节点数据   | Boolean       | true/false |            |
| load        | 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息   | Function(row, treeNode, resolve)       |            |            |
| defaultExpandAll  | 是否默认展开所有行，当 Tale 包含展开行存在或者为树形表格时有效   | Boolean       | true/false | false    |
| tableData   | 表格数据         | Array         |            | []       |
| pageNum     | 页数             | number        |            |          |
| total       | 总条数           | number        |            |          |
| pageSize    | 每页条目数       | number        |            |          |
| pages       | 总页数           | number        |            |          |
| pageId      | 分页器ID         | String/Number |            |          |
|showMoreColumns|是否显示自定义列表的下拉框| Boolean | true/false |false |
|columnProp   |接收查询项的selectChange返回的值| Object |     |          |
|columnOption |列表所有列的配置项数组| Array     |            |          |


### 自定义小,中,高不同level的行高的表格
只需在table-inner加上不同行高的class，小level的行高的class='table-level-mini',中level的行高的class='table-level-small'，大level的行高的class='table-level-medium'
``` vue
<template>
	<table-inner :tableId="1" title="列表" class="table-level-mini">
  </table-inner>
</template>
```
### 表格操作位置信息提示
需在table-inner加上中:row-class-name="rowClass" 给表格x选中某一行className附上'current-row'
``` vue
<template>
	<table-inner title="列表" :table-data="tableList.lists" :row-class-name="rowClass">
  </table-inner>
</template>
<script>
  methods: {
    rowClass (row) {
      if (row.row.id === Number(this.rowIndexId)) {
        return 'current-row'
      } else {
        return ''
      }
    }
   }
   </script>
```

### 插槽

| name          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| btn-inner     | 标题右侧按钮区                                               |
| table-bd      | 表格主体部分，用于完全自定义主体区域                         |
| table-columns | 表格项，请直接传入`<el-table-column>`元素                    |
| table-ft      | 表格底部，用于完全自定义底部区域，传入后底部默认分页内容无效 |

### columnOption配置参数

| 参数          | 说明                            | 类型           | 可选值 |
| ------------- | ------------------------------- | -------------- | ------ |
| key           |唯一的标识                       | Number         |        |
| prop          |列表列的prop                     | String         |        |
| isMust        |是否为不可配置的列表列           | Boolean        |        |
| label         |列表列的label                    | String         |        |
| formatter     |列表列的formatter方法(传utils文件内的方法名,<br>例如状态列，需要用formatter实现进行转换）</br>   | String         |        |

### 事件

| 事件名称      | 说明           | 回调参数          |
| ------------- | -------------- | ----------------- |
| changePageNum | 分页改变时触发 | {pageId, pageNum} |
| tableChange   |列表列变化是触发<br>返回自定义展示的列数据</br>|     []           |
| save          |本地存储已经自定义的列表列<br>返回Object,table存储的是表格列</br><br>moreSelectValue存储的是下拉列</br><br>表的选中的值,key值为本地存储时</br><br>的key值，value是存储的数据</br>|     {table:{key,value}, moreSelectValue:{key, value}}|

### 方法

| 方法名称 | 说明                                     | 回调参数 |
| -------- | ---------------------------------------- | -------- |
| doLayout | 更新表格样式，调用el-table doLayout 方法 | -        |



## fero-upload 上传

上传文件组件，与element-ui上传组件高度一致，只提供扩展功能的文档

### 属性

| 参数   | 说明                         | 类型     | 可选值     | 默认值 |
| ------ | ---------------------------- | -------- | ---------- | ------ |
| edit   | 是否可编辑                   | Boolean  | true/false | false  |
| remark | 是否可编辑备注               | Boolean  | true/false | false  |
| onEdit | 编辑回调，返回 {index, file} | Function |            |        |

### 插槽

| name           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| uploadListSlot | 上传文件列表每一个文件都会使用的插槽，在`slotProps`中会返回对应文件的`file` |



## file-list 文件列表

用于放置附件的列表，有文字型和卡片型两种样式，可与图片预览组件结合使用

### 基础用法

``` vue
<template>
	<default-layout>
		<!-- 其他无关元素已省略 -->
    <!-- 文字型 -->
    <file-list :files="fileList"></file-list>
    <!-- 图片型 -->
    <file-list :files="fileList" list-type="picture-card"></file-list>
  </default-layout>
</template>
<script>
  import fileList from '@/components/file-list'
  export default {
    components: {
      fileList
  	},
    data () {
      return {
        fileList: [
          {
            name: '图片名称',
            src: 'http://xxx.com/file/img1.png'
          },
          {
            name: '文件名称',
            src: 'http://xxx.com/file/file.pdf'
          }
        ]
      }
    }
  }
</script>
```

### 自定义配置用法

``` vue
<template>
	<default-layout>
		<!-- 其他无关元素已省略 -->
    <!-- 文字型 -->
    <file-list :files="fileList" :props="{name: 'name', src: 'url'}"></file-list>
    <!-- 图片型 -->
    <file-list :files="fileList" :props="{name: 'name', src: 'url'}" list-type="picture-card"></file-list>
  </default-layout>
</template>
<script>
  import fileList from '@/components/file-list'
  export default {
    components: {
      fileList
  	},
    data () {
      return {
        fileList: [
          {
            name: '图片名称',
            url: 'http://xxx.com/file/img1.png'
          },
          {
            name: '文件名称',
            url: 'http://xxx.com/file/file.pdf'
          }
        ]
      }
    }
  }
</script>
```

### 属性

| 参数     | 说明     | 类型   | 可选值            | 默认值 |
| -------- | -------- | ------ | ----------------- | ------ |
| listType | 列表类型 | String | text/picture-card/picture | text   |
| files    | 文件列表 | Array  |                   | []   |
| nodeKey | 节点ID | String | | id |
| props | 配置选项 | Object | |  |

### props

| 参数 | 说明     | 类型   | 可选值 | 默认值 |
| ---- | -------- | ------ | ------ | ------ |
| name | 文件名   | String |        | name   |
| src  | 文件路径 | String |        | src    |

### 事件

| 事件名称      | 说明                                 | 回调参数 |
| ------------- | ------------------------------------ | -------- |
| handlePreview | 点击时触发，传入会覆盖默认的预览行为 | file     |

### 插槽

| name    | 说明                                          | 参数 |
| ------- | --------------------------------------------- | ---- |
| default | 每个文件的插槽，位于文件容器内最后一个DOM节点 | file |

## viewer 图片查看器

用来对图片进行预览的组件，支持图片组切换、放大缩小、旋转, 自定义是否显示遮罩层，自定义查看器的位置

### 基础用法

``` vue
<template>
	<default-layout>
		<button @click="viewImg(file)">查看图片</p>
  </default-layout>
</template>
<script>
  import viewer from '@/components/viewer/index'
  export default {
    components: {
      fileList
  	},
    data () {
      return {
        file: 'http://xxx.com/img/photo.jpg'
      }
    },
    methods: {
      viewImg (file) {
        viewer(file)
      }
    }
  }
</script>
```

### 带有文件信息

文件名称和路径必须为title和src

``` vue
<template>
	<default-layout>
		<button @click="viewImg(file)">查看图片</p>
  </default-layout>
</template>
<script>
  import viewer from '@/components/viewer/index'
  export default {
    components: {
      fileList
  	},
    data () {
      return {
        file: {
          src: 'http://xxx.com/img/photo.jpg‘,
          title: '图片标题'
        }
      }
    },
    methods: {
      viewImg (file) {
        viewer(file)
      }
    }
  }
</script>
```

### 多文件预览

``` vue
<template>
	<default-layout>
    <template v-for="file in files">
      <button :key="file.id" @click="viewImg(file)">查看图片</p>
		</template>
  </default-layout>
</template>
<script>
  import viewer from '@/components/viewer/index'
  export default {
    components: {
      fileList
  	},
    data () {
      return {
        files: [
          {
            id:1,
            src: 'http://xxx.com/img/photo1.jpg‘,
            title: '图片标题1'
        	},
          {
            id:2,
            src: 'http://xxx.com/img/photo2.jpg‘,
            title: '图片标题2'
        	}
        ]
      }
    },
    methods: {
      viewImg (file) {
        var fileList = []
        var imgIndex = 0
        this.files.forEach((item, index) => {
          if (item.id === file.id) {
            imgIndex = index
          }
          fileList.push({
            title: item.title,
            src: item.src
          })
        })
        let _this = this
        viewer(fileList, {index: imgIndex, modal: false, position: right},
         function (instance) { _this.instance = instance })
      }
    },
    beforeDestroy () {
      if (this.instance) {
        this.instance.destroyViewer()
      }
    }
  }
</script>
```

### 自定义位置以及遮罩层

``` vue
<template>
	<default-layout>
    <template v-for="file in files">
      <button :key="file.id" @click="viewImg(file)">查看图片</p>
		</template>
  </default-layout>
</template>
<script>
  import viewer from '@/components/viewer/index'
  export default {
    components: {
      fileList
  	},
    data () {
      return {
        files: [
          {
            id:1,
            src: 'http://xxx.com/img/photo1.jpg‘,
            title: '图片标题1'
        	},
          {
            id:2,
            src: 'http://xxx.com/img/photo2.jpg‘,
            title: '图片标题2'
        	}
        ]
      }
    },
    methods: {
      viewImg (file) {
        var fileList = []
        var imgIndex = 0
        this.files.forEach((item, index) => {
          if (item.id === file.id) {
            imgIndex = index
          }
          fileList.push({
            title: item.title,
            src: item.src
          })
        })
        let _this = this
        viewer(fileList, {index: imgIndex, modal: false, position: right},
         function (instance) { _this.instance = instance })
      }
    },
    beforeDestroy () {
      //if (this.instance) {
      //  this.instance.destroyViewer()
      //}
      viewer('destroy')
    }
  }
</script>
```

### 调用参数

| 参数    | 说明     | 类型          | 可选值 | 默认值 |
| ------- | -------- | ------------- | ------ | ------ |
| imgInfo | 图片信息，如果参数值为destroy时，关闭viewer | String/Object |      |        |
| options | 配置     | Object        |        |        |
| callback | 回调函数，返回viewer的实例 | Function |

#### imgInfo

| 参数  | 说明     | 类型   | 可选值 | 默认值 |
| ----- | -------- | ------ | ------ | ------ |
| title | 图片名称 | String |        |        |
| src   | 图片链接 | String |        |        |

#### options可配置参数

| 参数     | 说明                   | 类型   | 可选值            | 默认值 |
| -----    | ---------------------- | ------ | ----------------- | ------ |
| imgs     | 图片数组               | Array  |                   |        |
| index    | 预览图片在数组中的位置 | Number |                   |        |
| modal    | 是否显示遮罩层         | Boolean| true/false        | true   |
| position | viewer显示的位置,如果值为数组，<br/>则第一个元素为查看器位置与屏幕左边的距离的百分比，</br><br/>第二个元素为查看器的宽度百分比</br> | String/Array | center/left/right/[50,40] | center |

### Methods

| 方法名        | 说明              |     参数 |
| --------      | -------------     | -------- |
| destroyViewer | 销毁viewer的方法  |    --    |



## 节流按钮

用于需要防止双击的、重复提交的按钮，用法及参数与普通`el-button`没有区别，默认延时`300ms`，按钮点击立即触发，`300ms` 内只执行一次，**注意节流按钮不能替代加载效果，加载效果也不能替代节流**。

### 基本用法

``` vue
<template>
	<default-layout>
		<debounce-button icon="iconfont icon-tijiao" type="primary" @click="saveForm">节流按钮</debounce-button>
  </default-layout>
</template>
<script>
  import debounceButton from '@/components/debounce-button'
  export default {
    components: {
      debounceButton
  	},
    data () {
      return {
      }
    },
    methods: {
      saveForm () {
        console.log(new Date())
      }
    }
  }
</script>
```
##  带父子级的复选组件

一个带父子级的复选组件，类似穿梭框，左边选择，右侧出现选中项（两种形式展示，1是平级展示，2是树形展示）

### 基本用法
``` vue
<template>
	<default-layout>
  	    <transfer-tree :list="list" :type="'table'" @selectData="selectData"></transfer-tree>
  </default-layout>
</template>
<script>
  export default {
    components: {
        list: []
  	},
  	methods:{
  	    selectData (data) {
  	        console.log(data)
  	    }
  	}
  }
</script>
```
### 属性

| 参数            | 说明         | 类型    | 可选值     | 默认值 | required |
| --------------- | ------------ | ------- | ---------- | ------ | -------- |
| list            | 左侧树的数据 | Array   |            | []     | true |
| type            | 展示形式（table<br/>为平级展示 tree<br/> 为树形展示） |  String    | 'table'/'tree'| 'table'  | false |

### 事件
| 事件名          | 说明               |   返回值   | 默认值 |
|-------------    |-------------       |----------- |--------|
| selectData      | 选择或删除后的回调 | 选中的数据 |   []   |

## skeleton-screen 骨架屏

一个友好的加载中占位组件，避免在加载时页面塌陷

### 基本用法

``` vue
<template>
	<default-layout>
		<skeleton-screen type="tagBlockCard" :loading="loading" :list="sectionList">
      <div class="section-block-completed mb" v-for="item in sectionList" :key="item.id">
        ...
  		</div>
  	</skeleton-screen>
  </default-layout>
</template>
<script>
  export default {
    data () {
      return {
        loading: true,
        sectionList: [
          {title: '测试标题', date: '2019-10-12 12:12:12'}
        ]
      }
    },
    methods: {
    }
  }
</script>
```

### 属性

| 参数    | 说明                 | 类型    | 可选值                                                       | 默认值 |
| ------- | -------------------- | ------- | ------------------------------------------------------------ | ------ |
| type    | 占位样式             | String  | simpleParagraph/simpleImgParagraph/complexParagraph<br>simpleBlockCard/tagBlockCard/operateBlockCard/simpleCompletedCard/tagCompletedCard/operateCompletedCard<br>simpleTable/simpleSupTable/horizontalSupTable/complexImgTable/complexTable |        |
| loading | 是否显示占位         | Boolean |                                                              |        |
| list    | 数据，用于占位的个数 | Array   |                                                              |        |

### 插槽

| 名称    | 说明                     |
| ------- | ------------------------ |
| default | 占位结束后需要展示的内容 |



# 布局文档

### default 默认布局

带有头部、侧栏、标题、主要内容区的默认页面布局，组件已在Vue初始化时注册，使用时无需引入，当然引入也没有问题

### 基本用法

``` vue
<template>
	<default-layout>
  	<template slot="breadcrumb">
      <el-breadcrumb-item>页面标题</el-breadcrumb-item>
    </template>
		<template slot="btn-inner">
			<el-button icon="iconfont icon-xinzeng" type="success">新增</el-button>
		</template>
		<!-- 其他页面元素 -->
  </default-layout>
</template>
<script>
  export default {
    components: {
  	}
  }
</script>
```

### 属性

| 参数            | 说明         | 类型    | 可选值     | 默认值 |
| --------------- | ------------ | ------- | ---------- | ------ |
| show-back-btn   | 显示返回按钮 | boolean | true/false | false  |
| show-page-title | 显示页面标题 | boolean | true/false | true   |

### 插槽

| name       | 说明                                             |
| ---------- | ------------------------------------------------ |
| breadcrumb | 面包屑导航，请直接传入`<el-breadcrumb-item>`元素 |
| btn-inner  | 按钮操作区                                       |
| -          | 默认插槽，用容纳主体区域的元素                   |

## simple 简单布局

一个简单的空白页布局，用于错误页、登录页等自定义页，组件已在Vue初始化时注册，使用时无需引入

### 基本用法

``` vue
<template>
	<simple-layout>
		<!-- 任意页面元素 -->
  </default-layout>
</template>
<script>
  export default {
    components: {
  	}
  }
</script>
```

### 插槽

| name | 说明                       |
| ---- | -------------------------- |
| -    | 默认插槽，用于容纳页面元素 |

# 页面布局指引

参考在线演示环境（http://admin-demo.dev.fero.com.cn/）进行布局

##  列表页

- 对列表页展示的业务进行新增等针对业务本身的操作，放置在标题栏
- 搜索框，提供上下排列和左右排列两种样式。如果有搜索条件较长或要求输入框必须对齐等要求建议选择上下排列。搜索和重置按钮都提供关闭和自定义文字，但如果全局修改建议直接更改组件
- 搜索框每列4个，输入框较长的条件如时间范围占2个长度，一般不一个条件占一行
- 列表筛选数据的导出等针对有条件的数据，按钮放置在列表标题的右侧
- 列表按钮统一使用文字按钮
- 列表的左中右对齐根据项目实际要求设置
- tab内直接放置search-inner 和 table-inner 样式已进行调整无需额外更改

## 表单/详情页

- 默认情况下一行两列输入框，有文本域等情况可以一行一个，如有多行表单/详情与单行表单放在同一行，应注意对换行样式进行处理，避免样式错位
- 带tab的表单内可在表单上部或下部放置tab内的保存按钮，整体保存按钮应位于标题栏
- 注意仔细查看demo页面，表格容器与表单/详情容器是并列的
- 表单/详情的具体内容与标题有20px的缩进是为背景色预留的，在`.detail-inner`元素增加`.bg`即可开启
- 只有标题栏的按钮带图标，主要内容区的按钮都没有图标
- 表单/详情页的表格默认是带边线的
- 表单、表格、tabs组合边距已进行调整，一般无需额外更改
- 上传/文件展示，采用图片列表模式显示时，独占一行
- 新增按钮都使用绿色

# 内置功能/插件用法

## vue-meta

页面标题会从路由中的`meta.title`读取，可被页面内的`metaInfo.title`覆盖，具体用法详见https://github.com/nuxt/vue-meta

## 弹框拖动

### v-dialogDrag

此功能用于实现弹层的拖拽、拖拽范围不能超过屏幕范围，不能出现完全拖出屏幕导致弹层无法关闭以及关闭弹窗时弹窗复位。要使用此功能时需要在el-dialog上加上自定义指令v-dialogDrag，还需在main.js里注册全局指令Vue.directive('dialogDrag', feroToolkit.dialogDrag)

#### 基本用法

``` vue
<template>
   <el-dialog title="弹层拖拽" :visible.sync="dialog.detail3" v-dialogDrag></>
</template>

```
``` main.js
Vue.directive('dialogDrag', feroToolkit.dialogDrag)

```
##  四种主题切换

为了满足不同用户的审美要求，可以选择四种不同的主题色，需要在App.vue里配置不同的class,基础主题class='normal',贸易主题class='trade',科技主题class='technology',金融主题class='finance'

### 基本用法

``` vue
<template>
  <div id="app" :class="theme">
    <router-view/>
  </div>
</template>
```

