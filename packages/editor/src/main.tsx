import React from 'react'
import App, { AppExternalProps } from './app'
import DefaultConfig from './DefaultConfig'
import appInfo from '../package.json'

function CCMSEditor(props: AppExternalProps) {
  const {
    applicationName,
    type,
    subversion,
    config,
    sourceData,
    baseRoute,
    customConfigCDN,
    onChange,
    checkPageAuth,
    loadPageURL,
    loadPageFrameURL,
    loadPageConfig,
    loadPageList,
    handlePageRedirect,
    loadDomain,
    onSubmit,
    onCancel
  } = props
  return (
    <App
      applicationName={applicationName || 'example'}
      type={type || 'application'}
      version={appInfo.version}
      subversion={subversion || '0'}
      config={config || DefaultConfig}
      sourceData={sourceData}
      baseRoute={baseRoute}
      configDomain={customConfigCDN || `https://cdn.jsdelivr.net/npm/ccms-editor@${appInfo.version}/dist/config`}
      onChange={(val) => {
        onChange(val)
      }}
      checkPageAuth={(pageId) => checkPageAuth(pageId)}
      loadPageURL={async (pageId) => loadPageURL(pageId)}
      loadPageFrameURL={async (pageId) => loadPageFrameURL(pageId)}
      loadPageConfig={async (pageId) => {
        if (loadPageConfig) {
          const pageConfig = await loadPageConfig(pageId)
          if (pageConfig) return pageConfig
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
      loadPageList={loadPageList}
      handlePageRedirect={handlePageRedirect}
      loadDomain={loadDomain}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  )
}

export default CCMSEditor
