import React from 'react'
import App, { AppExternalProps } from './app'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const appInfo = require('../package.json')

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
      config={config || {}}
      sourceData={sourceData}
      baseRoute={baseRoute}
      configDomain={customConfigCDN || `https://cdn.jsdelivr.net/npm/ccms-editor@${appInfo.version}/config`}
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
          steps: []
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
