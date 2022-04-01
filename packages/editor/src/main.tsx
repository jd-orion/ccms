
import React from 'react'
import ReactDOM from 'react-dom'
import { FormConfig } from 'ccms/dist/src/steps/form'
import App, { AppProps } from './app'
import DefaultConfig from './DefaultConfig'
import appInfo from '../package.json'
import 'antd/dist/antd.css'


 function CCMSEditor (props: AppProps) {
    return (
      <App
        applicationName="example"
        type="application"
        version={appInfo.version}
        subversion="0"
        config={props.config || DefaultConfig}
        sourceData={props.sourceData}
        onChange={(v)=>{console.log('ccms-editor', v)}}
        baseRoute={'/'}
        checkPageAuth={async (_) => true}
        loadPageURL={async (_) => '#'}
        loadPageFrameURL={async (_) => '#'}
        loadPageConfig={async (pageId) => {
          console.log('pageId--ed', pageId);
          console.log('pageConfig=', await props.loadPageConfig(pageId));
          
          if (props.loadPageConfig && await props.loadPageConfig(pageId)) {
            return await props.loadPageConfig(pageId)
          }
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
        loadPageList={props.loadPageList}
        loadDomain={async () => ''}
        onSubmit={(config) => console.log(JSON.stringify(config, undefined, 2))}
        onCancel={() => {}}
      />
    )
}

export default CCMSEditor