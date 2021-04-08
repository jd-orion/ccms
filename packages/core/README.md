

<p align="center">
  <a href="http://orion.jd.com/#/">
    <img width="80" style="padding:10px 20px;" src="https://img30.360buyimg.com/babel/jfs/t1/165024/4/11595/3392/60487a8cE8de28b8f/f351feb5d1757feb.png">
  </a>
</p>

<h1 align="center">CCMS</h1>



![](https://img.shields.io/badge/license-MIT-blue)
![](https://img.shields.io/badge/coverage-100%25-green)

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

## ⚙️ 使用（以antd ui示例）
```
npm install ccms-antd ccms
```

## 🌰 示例
```
import { CCMS } from 'ccms-antd';

const App = () => (
  <>
    <CCMS
      checkPageAuth={async () => true}
      loadPageURL={async (id) => `/url?id=${id}&type=page`}
      loadPageFrameURL={async (id) => `/url?id=${id}&type=open`}
      // 界面操作更新CCMS config 
      loadPageConfig={async (page) => newConfig }
      sourceData={{}}
      callback={() => {
        if (window.history.length > 1) {
          window.history.back()
        } else {
          window.close()
        }
      }}
      //后附config的demo 详见api文档
      config={config}
    />
  </>
);
```

config参数DEMO

```
{
  "basic": {
      "title": "我的表单"
  },
  "steps": [
    {
      type: "form",
      layout: "horizontal",
      fields:[
            {
                type:'text',
                "field": "text",
                "label": "这是一个提交步骤"
            }
        ]
    },
    {
        "type": "fetch",
        "request": {
            "url": "https://j-api.jd.com/mocker/data?p=263&v=POST&u=list.do",
            "method": "GET"
        },
        "response": {
            "root": "result"
        },
        "condition": {
            "enable": true,
            "field": "code",
            "value": 0,
            "success": {
                "type": "none",
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
    }, {
        "type": "table",
        "primary": "index",
        "columns": [
            {
                "label": "id",
                "field": "id",
                "type": "text",
                "defaultValue": "暂无数据"
            },
            {
                "label": "datetime",
                "field": "datetime",
                "type": "text",
                "defaultValue": "暂无数据"
            },
            {
                "label": "name",
                "field": "name",
                "type": "text",
                "defaultValue": "暂无数据"
            }
        ],
        "operations": {
            "rowOperations": [
                {
                    "type": "button",
                    "label": "编辑",
                    "handle": {
                        "type": "ccms","callback":true,
                        "page": "o_manage_list_edit",
                        "target": "current",
                        "data": {
                            "id": {
                                "source": "record",
                                "field": "id"
                            }
                        }
                    }
                },
                {
                    "type": "button",
                    "label": "删除",
                    "handle": {
                        "type": "ccms","callback":true,
                        "page": "o_manage_list_delete",
                        "target": "current",
                        "data": {
                            "id": {
                                "source": "record",
                                "field": "id"
                            }
                        }
                    },
                    "confirm": {
                        "enable": true,
                        "titleText": "确定删除应用吗？删除后无法恢复"
                    }
                }
            ],
            "tableOperations": [
                {
                    "type": "button",
                    "label": "+ 可以新建应用",
                    "handle": {
                        "type": "ccms",
                        "callback":true,
                        "page": "o_manage_list_create",
                        "target": "current",
                        "data": {}
                    }
                }
            ]
        }
    }
  ]
}
```

## 📖 API文档
👉 [Api文档]

[Api文档]:https://oriondoc.jd.com/

## 🧑‍🤝‍🧑 参与共建

配置化内容管理系统 核心库 (共建与UI接入)


### 初始化工程

```sh
npm install

sudo npm link
```

### 编译

```sh
npm run build
```


### 单元测试

```sh
npm run test
```