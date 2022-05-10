

<p align="center">
  <a href="http://orion.jd.com/#/">
    <img width="80" style="padding:10px 20px;" src="https://img30.360buyimg.com/babel/jfs/t1/165024/4/11595/3392/60487a8cE8de28b8f/f351feb5d1757feb.png">
  </a>
</p>

<h1 align="center">CCMS</h1>


![](https://img.shields.io/badge/license-MIT-blue)

## 🌏 关于CCMS
CCMS是一套完善、通用的可配置化的方案。通过配置化自动生成中后台（CMS）界面。<br/>
CCMS将内容管理系统前端页面抽象为在若干API进行流转的系统。进一步将对后台API的请求按照逻辑类型划分为表单提交、列表展示、查询数据等类型。通过JSON数据格式描述各API请求的接口信息、入参、出参及各种常见校验和简单逻辑，动态渲染前端页面。最终实现零开发搭建内容管理系统。

## ✨  特点
- 🛠️ 配置生成CMS后台管理界面
- 📚 通过步骤设计覆盖不同后台业务应用场景
- 🏹 跨页面数据传输、跨组件交互
- 🎏 支持引入不同组件库

### 工作原理
通过代理组件的属性定义、数据请求、跨组件交互和状态机判断，实现基于组件化的前端页面配置化。

### 便捷使用
通过配置JSON，定义表单步骤与组件。生成完整的后台管理功能。

### 组件库接入
参照猎户座组件开发规范，开发者可以提供丰富种类的组件以供自己使用，并可以将组件发布供所用用户选用。

## ⚙️ 使用
```
npm install ccms ccms-antd
```
## 🌰 示例
```javascript
import { CCMS } from 'ccms-antd';

const App = () => (
  <>
    <CCMS
      config={config}
      sourceData={data}
      baseRoute={'/'}
      checkPageAuth={async () => true}
      loadPageURL={async (id) => `/url?id=${id}&type=page`}
      loadPageFrameURL={async (id) => `/url?id=${id}&type=open`}
      loadPageList={async () => '#'}
      loadPageConfig={async (page) => newConfig }
      loadDomain={async () => ''}
      handlePageRedirect={() => {xxx}}
      callback={() => {xxx}}
      onMount={() => {xxx}}
    />
  </>
);
```

## 📖 API文档
👉 [Api文档]

[Api文档]:https://oriondoc.jd.com/

| 参数               | 说明                                                       | 类型                   | 默认值 | 版本 |
| ------------------ | ---------------------------------------------------------- | ---------------------- | ------ | ---- |
| config             | 配置项，参见附录一                                         | object                 | -      |      |
| sourceData         | 数据项，参见附录二                                         | object                 | -      |      |
| baseRoute          | 页面路由                                                   | string                 | `/`    |      |
| checkPageAuth      | 页面鉴权                                                   | function(e)            | -      |      |
| loadPageURL        | 获取页面的url(用于当前页面打开)                            | function(pageId)       | -      |      |
| loadPageFrameURL   | 获取页面的url(用于新Tab页打开)                             | function(pageId)       | -      |      |
| loadPageList       | 加载页面列表，选中后可通过执行loadPageConfig获取页面配置项 | function()             | -      |      |
| loadPageConfig     | 加载指定页面配置项                                         | function(pageId)       | -      |      |
| loadDomain         | 获取域名                                                   | function()             | -      |      |
| handlePageRedirect | 页面跳转(replace/push)                                     | function(url, replace) | -      |      |
| callback           | 回调函数(关闭或提交)                                       | function()             | -      |      |
| onMount            | 初始化结束，展示界面                                       | function(val)          | -      |      |


#### 附录一
```js
{
  "steps": [
    { "type": "header"},
    {
      "type": "form",
      "fields": [
        {
          "label": "文本框",
          "field": "text",
          "type": "text"
        },
        {
          "label": "单项框",
          "field": "radio",
          "type": "select_single",
          "mode": "radio",
          "options": {
            "from": "manual",
            "data": [
              {
                "label": "选项1",
                "value": 1
              },
              {
                "label": "选项2",
                "value": 2
              }
            ]
          },
          "required": true
        }
      ],
      "actions": [
        {
          "type": "submit",
          "label": "提交",
          "mode": "primary"
        },
        {
          "type": "cancel",
          "label": "取消",
          "mode": "normal"
        }
      ],
      "defaultValue": {
        "source": "data",
        "field": ""
      }
    },
    {
      "type": "fetch",
      "interface": {
        "url": "",
        "method": "GET",
        "withCredentials": true,
        "condition": {
          "enable": false,
          "field": "code",
          "value": 1000,
          "success": {
            "type": "modal",
            "content": {
              "type": "static",
              "content": "成功"
            }
          },
          "fail": {
            "type": "modal",
            "content": {
              "type": "field",
              "field": "msg"
            }
          }
        }
      },
      "nextStep": false
    }
  ]
}
```

#### 附录二
```js
{
  "text": "text",
  "radio": 2
}
```
## 🧑‍🤝‍🧑 参与共建 配置化内容管理系统 UI库（ant design版）

### 初始化工程

**需要首先初始化`ccms`工程！**

```sh
npm install

npm link ccms

sudo npm link
```

### 编译

```sh
npm run build
```
