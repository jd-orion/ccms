import React from 'react'
import App, { AppExternalProps } from './app'
import DefaultConfig from './DefaultConfig'
import appInfo from '../package.json'
import 'antd/dist/antd.css'

function CCMSEditor(props: AppExternalProps) {
  return (
    <App
      applicationName={props.applicationName || 'example'}
      type={props.type || 'application'}
      version={appInfo.version}
      subversion={props.subversion || '0'}
      config={props.config || DefaultConfig}
      sourceData={props.sourceData}
      baseRoute={props.baseRoute}
      configDomain={props.customConfigCDN || `https://cdn.jsdelivr.net/npm/ccms-editor@${appInfo.version}/dist/config`}
      onChange={(val) => {
        props.onChange(val)
      }}
      checkPageAuth={(pageId) => props.checkPageAuth(pageId)}
      loadPageURL={async (pageId) => props.loadPageURL(pageId)}
      loadPageFrameURL={async (pageId) => props.loadPageFrameURL(pageId)}
      loadPageConfig={async (pageId) => {
        if (props.loadPageConfig && (await props.loadPageConfig(pageId))) {
          return await props.loadPageConfig(pageId)
        }
        return {
          steps: [
            {
              type: 'form',
              fields: [
                {
                  field: 'text',
                  label: 'text',
                  type: 'text'
                }
              ],
              actions: [],
              rightTopActions: []
            }
          ]
        }
      }}
      loadPageList={props.loadPageList}
      loadCustomSource={props.loadCustomSource}
      handlePageRedirect={props.handlePageRedirect}
      loadDomain={props.loadDomain}
      onSubmit={props.onSubmit}
      onCancel={props.onCancel}
    />
  )
}

export default CCMSEditor
