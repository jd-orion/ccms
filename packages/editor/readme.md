<h1 align="center">CCMS-Editor</h1>



![](https://img.shields.io/badge/license-MIT-blue)

##  CCMS-Editor
CCMS-Editor通过配置化自动生成中后台（CMS）界面。


## 🌰 示例
```jsx
import CCMSEditor from 'ccms-editor'

const App = () => (
  <>
    <CCMSEditor
      config={config}
      sourceData={data}
      onChange={(v:any)=>{console.log('ccms-editor', v)}}
      baseRoute={'/'}
      checkPageAuth={async (_:any) => true}
      loadPageURL={async (_:any) => '#'}
      loadPageFrameURL={async (_:any) => '#'}
      loadPageConfig={async (pageId: any) => '#'}
      loadPageList={async () => '#'}
      loadDomain={async () => ''}
      onSubmit={(config: any) => console.log(JSON.stringify(config, undefined, 2))}
      onCancel={() => {}}
    />
  </>
);
```

