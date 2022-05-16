<h1 align="center">CCMS-Editor</h1>



![](https://img.shields.io/badge/license-MIT-blue)

##  CCMS-Editor
CCMS-Editor通过配置化自动生成中后台（CMS）界面。


### 示例
```jsx
import CCMSEditor from 'ccms-editor'

const App = () => (
  <>
    <CCMSEditor
      config={config}
      sourceData={data}
      baseRoute={'/'}
      customConfigCDN=''
      onChange={(v:any)=>{console.log('ccms-editor', v)}}
      checkPageAuth={async (_:any) => true}
      loadPageURL={async (_:any) => '#'}
      loadPageFrameURL={async (_:any) => '#'}
      loadPageList={async () => '#'}
      loadPageConfig={async (pageId: any) => '#'}
      handlePageRedirect= {(path: string, replaceHistory: boolean) => '#'}
      loadDomain={async () => ''}
      onSubmit={(config: any) => console.log(JSON.stringify(config, undefined, 2))}
      onCancel={() => {}}
    />
  </>
);
```
### API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| config | 配置项，参见附录一 | object | - |  |
| sourceData | 数据项，参见附录二 | object | - |  |
| baseRoute | 页面路由 | string | `/` |  |
| customConfigCDN | 配置自定义cdn资源路径 | string | - |  |
| checkPageAuth | 页面鉴权 | function(e) | - | |
| loadPageURL | 获取用于当前页面打开的url | function(pageId) | - |  |
| loadPageFrameURL | 获取用于新Tab页打开的url | function(pageId) | - |  |
| handlePageRedirect | 用于路由跳转方法（非浏览器跳转） | function(path, replaceHistory) | - |  |
| loadPageList | 加载页面列表，选中后可通过执行loadPageConfig获取页面配置项 | function() | - |  |
| loadPageConfig | 加载指定页面配置项 | function(pageId) | - |  |
| loadDomain | 获取域名 | function() | - |  |
| onChange | 组件内容变化的回调 | function(val) | - |  |
| onSubmit | 提交 | function(object) | - |  |
| onCancel | 取消 | function() | - |  |


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
      "rightTopActions": [],
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