import { CCMS } from 'ccms-antd'
import { CCMSConfig, PageListItem } from 'ccms/dist/main'
import React from 'react'

export interface CCMSPreviewProps {
  checkPageAuth: (pageID) => Promise<boolean>
  loadPageURL: (pageID) => Promise<string>
  loadPageFrameURL: (pageID) => Promise<string>
  loadPageConfig: (pageID) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  loadDomain: (name: string) => Promise<string>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void
  sourceData: { [field: string]: unknown }
  baseRoute: string
  pageConfig: CCMSConfig
}

export default class CCMSPreview extends React.PureComponent<CCMSPreviewProps> {
  render() {
    const {
      checkPageAuth,
      loadPageURL,
      loadPageFrameURL,
      loadPageConfig,
      loadPageList,
      loadDomain,
      handlePageRedirect,
      sourceData,
      baseRoute,
      pageConfig
    } = this.props
    return (
      <CCMS
        checkPageAuth={checkPageAuth}
        loadPageURL={loadPageURL}
        loadPageFrameURL={loadPageFrameURL}
        loadPageConfig={loadPageConfig}
        loadPageList={loadPageList}
        loadDomain={loadDomain}
        handlePageRedirect={handlePageRedirect}
        sourceData={sourceData}
        baseRoute={baseRoute}
        callback={() => {
          /** none */
        }}
        config={pageConfig}
      />
    )
  }
}
