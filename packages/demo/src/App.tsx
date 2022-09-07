import CCMSEditor from 'ccms-editor';
import { CCMSConfig } from 'ccms/dist/main';
import React from 'react';
import port from './port';
import sourceConfig from './sourceConfig';
import sourceData from './sourceData';
import sourcePageConfig from './sourcePageConfig';
import sourcePageList from './sourcePageList';

export default class App extends React.Component {
  handlePageURL: (pageId: unknown) => string = () => {
    return 'https://www.jd.com/'
  }

  handlePageFrameURL: (pageId: unknown) => string = () => {
    return 'https://www.jd.com/'
  }
  
  handlePageConfig: (pageId: number) => Promise<CCMSConfig> = async (pageId) => {
    return sourcePageConfig[pageId]
  }

  handlePageList = () => {
    return sourcePageList
  }

  render() {
    return (
      <div className="App">
        <CCMSEditor
          applicationName="example"
          type="application"
          version=""
          subversion="0"
          config={sourceConfig}
          sourceData={sourceData}
          baseRoute="/"
          customConfigCDN={`http://localhost:${port}`}
          onChange={(config) => {
            console.log('触发 onChange 事件', JSON.stringify(config, undefined, 2))
          }}
          checkPageAuth={async () => true}
          loadPageURL={async (pageId) => this.handlePageURL(pageId)}
          loadPageFrameURL={async (pageId) => this.handlePageFrameURL(pageId)}
          loadPageConfig={async (pageId) => this.handlePageConfig(pageId)}
          loadPageList={async () => this.handlePageList()}
          loadDomain={async () => ''}
          handlePageRedirect={(path, replaceHistory) =>
            console.log('触发 handlePageRedirect 事件', { path, replaceHistory })
          }
          onSubmit={(config) => console.log('触发 onSubmit 事件', JSON.stringify(config, undefined, 2))}
          onCancel={() => console.log('触发 onCancel 事件')}
        />
      </div>
    );
  }
  
}
