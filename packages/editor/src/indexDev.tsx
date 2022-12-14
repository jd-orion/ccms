import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import DefaultConfig from './DefaultConfig'
import appInfo from '../package.json'
import 'antd/dist/antd.css'

const treeData = [
  {
    key: 621,
    value: 621,
    title: '管理',
    children: [
      {
        key: 622,
        value: 622,
        title: '业务管理',
        children: []
      },
      {
        key: 623,
        value: 623,
        title: '角色管理',
        children: []
      }
    ]
  }
]
const sourceData = {
  text: 'text',
  radio: 2
}
const pageList = [
  {
    key: 1,
    value: 621,
    title: '管理',
    children: [
      {
        key: 2,
        value: 625,
        title: '业务表单',
        children: []
      },
      {
        key: 3,
        value: 622,
        title: '业务管理描述',
        children: []
      }
    ]
  }
]
const demoPageConfigs = {
  '621': {
    steps: [
      {
        type: 'header'
      },
      {
        type: 'form',
        columns: {},
        fields: [
          {
            label: '名称',
            field: 'name',
            type: 'text',
            defaultValue: {
              source: 'static',
              value: ''
            }
          }
        ],
        actions: [
          {
            type: 'submit',
            label: '提交',
            mode: 'primary',
            submitValidate: false
          },
          {
            type: 'cancel',
            label: '取消',
            mode: 'normal',
            submitValidate: false
          }
        ],
        rightTopActions: [],
        applicationName: 'example',
        businessSuffix: '',
        version: '1.0.0',
        subversion: '0'
      },
      {
        type: 'fetch',
        interface: {
          url: '',
          method: 'GET',
          withCredentials: true,
          condition: {
            enable: false,
            field: 'code',
            value: 1000,
            success: {
              type: 'modal',
              content: {
                type: 'static',
                content: '成功'
              }
            },
            fail: {
              type: 'modal',
              content: {
                type: 'field',
                field: 'msg'
              }
            }
          }
        },
        nextStep: false
      }
    ],
    ui: 'antd'
  },
  '622': {
    steps: [
      {
        type: 'header'
      },
      {
        type: 'form',
        columns: {},
        fields: [
          {
            label: '业务描述',
            field: 'hello',
            type: 'longtext',
            defaultValue: {
              source: 'static',
              value: 'business...'
            }
          }
        ],
        actions: [
          {
            type: 'submit',
            label: '提交',
            mode: 'primary',
            submitValidate: false
          },
          {
            type: 'cancel',
            label: '取消',
            mode: 'normal',
            submitValidate: false
          }
        ],
        rightTopActions: [],
        applicationName: 'example',
        businessSuffix: '',
        version: '1.0.0',
        subversion: '0'
      },
      {
        type: 'fetch',
        interface: {
          url: '',
          method: 'GET',
          withCredentials: true,
          condition: {
            enable: false,
            field: 'code',
            value: 1000,
            success: {
              type: 'modal',
              content: {
                type: 'static',
                content: '成功'
              }
            },
            fail: {
              type: 'modal',
              content: {
                type: 'field',
                field: 'msg'
              }
            }
          }
        },
        nextStep: false
      }
    ],
    ui: 'antd'
  },
  '625': {
    steps: [
      {
        type: 'form',
        fields: [
          {
            label: '文本框',
            field: 'text',
            type: 'text'
          },
          {
            label: '单项框',
            field: 'radio',
            type: 'select_single',
            mode: 'radio',
            options: {
              from: 'manual',
              data: [
                {
                  label: '选项1',
                  value: 1
                },
                {
                  label: '选项2',
                  value: 2
                }
              ]
            },
            required: true
          }
        ],
        actions: [
          {
            type: 'submit',
            label: '提交',
            mode: 'primary'
          },
          {
            type: 'cancel',
            label: '取消',
            mode: 'normal'
          }
        ],
        rightTopActions: [],
        defaultValue: {
          source: 'data',
          field: ''
        }
      },
      {
        type: 'fetch',
        interface: {
          url: '',
          method: 'GET',
          withCredentials: true,
          condition: {
            enable: false,
            field: 'code',
            value: 1000,
            success: {
              type: 'modal',
              content: {
                type: 'static',
                content: '成功'
              }
            },
            fail: {
              type: 'modal',
              content: {
                type: 'field',
                field: 'msg'
              }
            }
          }
        },
        nextStep: false
      }
    ]
  }
}

const handlePageConfig = (pageId: any) => {
  // @ts-ignore
  return demoPageConfigs[pageId]
}

const handlePageList = () => {
  return pageList
}

const handlePageFrameURL = (pageId: any) => {
  return 'https://www.jd.com/'
}

const handlePageURL = (pageId: any) => {
  return 'https://www.jd.com/'
}

const handleCustomSource = (customName, version) => {
  return `${customName}@${version}/index.html`
}

const render = () => {
  ReactDOM.render(
    <App
      applicationName="example"
      type="application"
      version={appInfo.version}
      subversion="0"
      config={DefaultConfig}
      sourceData={sourceData}
      baseRoute="/"
      configDomain={'/ccms/config/1.0.0/0' || `https://cdn.jsdelivr.net/npm/ccms-editor@${appInfo.version}/dist/config`}
      onChange={(v) => {
        console.log('ccms-editor', v)
      }}
      checkPageAuth={async (_) => true}
      loadPageURL={async (pageId: any) => handlePageURL(pageId)}
      loadPageFrameURL={async (pageId: any) => handlePageFrameURL(pageId)}
      loadPageConfig={async (pageId: any) => handlePageConfig(pageId)}
      loadPageList={async () => handlePageList()}
      loadCustomSource={(customName, version) => handleCustomSource(customName, version)}
      loadDomain={async () => ''}
      handlePageRedirect={() => { }}
      onSubmit={(config) => console.log(JSON.stringify(config, undefined, 2))}
      onCancel={() => { }}
    />,
    document.getElementById('root')
  )
}
render()
