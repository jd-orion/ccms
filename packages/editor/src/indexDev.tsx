
import React from 'react'
import ReactDOM from 'react-dom'
import { FormConfig } from 'ccms/dist/src/steps/form'
import App, { AppProps } from './app'
import DefaultConfig from './DefaultConfig'
import appInfo from '../package.json'
import 'antd/dist/antd.css'
const treeData = [
  {
    "key": 621,
    "value": 621,
    "title": "管理",
    "children": [
      {
        "key": 622,
        "value": 622,
        "title": "业务管理",
        "children": []
      },
      {
        "key": 623,
        "value": 623,
        "title": "角色管理",
        "children": []
      }
    ]
  }
]

//  function CCMSEditor (props: AppProps) {
    // return (
      // <App
      //   applicationName="example"
      //   type="application"
      //   version={"1.0.0"} // 后面改为appInfo.version
      //   subversion="0"
      //   config={props.config || DefaultConfig}
      //   sourceData={props.sourceData}
      //   configDomain={props.customConfigCDN || `https://cdn.jsdelivr.net/npm/ccms-editor@${appInfo.version}/dist/config`}
      //   onChange={(v)=>{console.log('ccms-editor', v)}}
      //   baseRoute={'/'}
      //   checkPageAuth={async (_) => true}
      //   loadPageURL={async (_) => '#'}
      //   loadPageFrameURL={async (_) => '#'}
      //   loadPageConfig={async (param) => {
      //     console.log('param--ed', param);
      //     return({
      //       steps: [
      //         {
      //           type: 'form',
      //           fields: [
      //             {
      //               field: 'text2',
      //               label: 'text2',
      //               type: 'text'
      //             }
      //           ],
      //           "actions": []
      //         }
      //       ]
      //   })}}
      //   loadPageList={props.loadPageList}
      //   loadDomain={async () => ''}
      //   onSubmit={(config) => console.log(JSON.stringify(config, undefined, 2))}
      //   onCancel={() => {}}
      // />
    // )
// }
const render = () => {


ReactDOM.render(<App
  applicationName="example"
  type="application"
  version={appInfo.version}
  subversion="0"
  config={DefaultConfig}
  sourceData={{}}
  baseRoute={'/'}
  configDomain={null || `https://cdn.jsdelivr.net/npm/ccms-editor@${appInfo.version}/dist/config`}
  onChange={(v)=>{console.log('ccms-editor', v)}}
  checkPageAuth={async (_) => true}
  loadPageURL={async (_) => '#'}
  loadPageFrameURL={async (_) => '#'}
  loadPageConfig={async (param) => {
    return({
      steps: [
        {
          type: 'form',
          fields: [
            {
              field: 'text2',
              label: 'text2',
              type: 'text'
            }
          ],
          "actions": []
        }
      ]
  })}}
  loadPageList={async ()=> treeData}
  loadDomain={async () => ''}
  onSubmit={(config) => console.log(JSON.stringify(config, undefined, 2))}
  onCancel={() => {}}
/>, document.getElementById('root'))
}
render()