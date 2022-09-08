import React from 'react'
import { Drawer, Button, Modal, message, Card, Space, Radio, Dropdown, Menu, ConfigProvider } from 'antd'
import 'antd/lib/drawer/style'
import 'antd/lib/button/style'
import 'antd/lib/modal/style'
import 'antd/lib/message/style'
import 'antd/lib/card/style'
import 'antd/lib/space/style'
import 'antd/lib/radio/style'
import 'antd/lib/dropdown/style'
import 'antd/lib/menu/style'
import { DownOutlined } from '@ant-design/icons'
import { CCMSConfig, BasicConfig, PageListItem } from 'ccms/dist/main'
import { cloneDeep } from 'lodash'
import copy from 'copy-html-to-clipboard'
import { FormConfig } from 'ccms/dist/steps/form'
import { PageTemplate, PageTemplates, StepConfigs, StepTemplates } from './steps'
import './app.less'
import ConfigJSON from './component/ConfigJSON'

const CCMSPreview = React.lazy(() => import('./component/CCMSPreview'))
const CCMSForm = React.lazy(() => import('./component/CCMSForm'))

export interface AppPropsInterface {
  config: CCMSConfig
  sourceData: { [field: string]: unknown }
  applicationName?: string
  type?: 'application' | 'business'
  version?: string
  subversion?: string
  baseRoute: string
  checkPageAuth: (pageID) => Promise<boolean>
  loadPageURL: (pageID) => Promise<string>
  loadPageFrameURL: (pageID) => Promise<string>
  loadPageConfig: (pageID) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  loadDomain: (name: string) => Promise<string>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void
  onChange: (value) => void
  onSubmit: (config: CCMSConfig) => void
  onCancel: () => void
  siderWidth?: number
}
export interface AppExternalProps extends AppPropsInterface {
  customConfigCDN?: string
}
export interface AppProps extends AppPropsInterface {
  configDomain?: string
}

export interface PageConfig extends CCMSConfig {
  ui: 'antd'
}

export interface CCMSConsigState {
  ready: boolean
  pageConfig: PageConfig
  activeTab: number
  pageTemplate: PageTemplate
  configStringify: boolean
}

class App extends React.Component<AppProps, CCMSConsigState> {
  constructor(props) {
    super(props)
    this.state = {
      pageConfig: cloneDeep(props.config) as PageConfig, // 页面配置
      activeTab: -1, // 活跃tab
      pageTemplate: 'normal-form', // 页面类型
      ready: true, // 是否展示，用于刷新
      configStringify: false
    }
  }

  componentDidMount() {
    const { pageConfig } = this.state
    const steps = pageConfig.steps || []

    for (const [pageTemplate, stepTemplates] of Object.entries(PageTemplates)) {
      if (stepTemplates.length === steps.length) {
        let match = true
        for (let i = 0; i < steps.length; i++) {
          if (stepTemplates[i].step !== steps[i].type) {
            match = false
            break
          }
        }
        if (match) {
          this.setState({
            pageTemplate: pageTemplate as PageTemplate
          })
          break
        }
      }
    }

    if (!pageConfig.ui) {
      pageConfig.ui = 'antd'
      this.setState({
        pageConfig
      })
    }
  }

  /**
   * 强制刷新
   */
  handleRefreshPreview = () => {
    const { activeTab } = this.state
    this.setState(
      {
        activeTab: 0,
        ready: false
      },
      () => {
        this.setState({
          activeTab,
          ready: true
        })
      }
    )
  }

  /**
   * 页面保存
   */
  handleSave = () => {
    const { onSubmit } = this.props
    const { pageConfig } = this.state
    if (onSubmit) {
      onSubmit(pageConfig)
    }
  }

  /**
   * 修改页面配置
   * @param basic
   */
  handleChangeBasic = (basic: BasicConfig) => {
    const { pageConfig } = this.state
    pageConfig.basic = basic
    this.setState({
      pageConfig
    })
  }

  /**
   * 修改页面模板
   * @param pageTemplate
   */
  handleChangePageMode = (pageTemplate: PageTemplate) => {
    ConfigProvider.config({
      prefixCls: 'ccms-editor-ant'
    })

    Modal.confirm({
      title: '确定要修改页面类型吗？',
      content: '修改页面类型会丢失部分页面内容数据。',
      okText: '修改',
      cancelText: '取消',
      onOk: () => {
        const { pageConfig } = this.state
        pageConfig.steps = []

        const steps = PageTemplates[pageTemplate]
        for (const step of steps) {
          pageConfig.steps.push(StepTemplates[step.step])
        }

        this.setState({
          pageTemplate,
          pageConfig
        })
      },
      getContainer: () => document.getElementById('ccms-config') || document.body
    })
  }

  render() {
    const { ready, pageConfig, activeTab, pageTemplate, configStringify } = this.state

    const {
      checkPageAuth,
      loadPageURL,
      loadPageFrameURL,
      loadPageConfig,
      loadPageList,
      loadDomain,
      handlePageRedirect,
      onCancel,
      sourceData,
      baseRoute,
      applicationName,
      type,
      version,
      subversion,
      configDomain
    } = this.props

    return (
      <ConfigProvider prefixCls="ccms-editor-ant">
        <div id="ccms-config" className="ccms-config">
          {/* 预览CCMS */}
          <div className="preview">
            {ready && (
              <React.Suspense fallback={<>Loading</>}>
                <CCMSPreview
                  checkPageAuth={checkPageAuth}
                  loadPageURL={loadPageURL}
                  loadPageFrameURL={loadPageFrameURL}
                  loadPageConfig={loadPageConfig}
                  loadPageList={loadPageList}
                  loadDomain={loadDomain}
                  handlePageRedirect={handlePageRedirect}
                  sourceData={sourceData}
                  baseRoute={baseRoute}
                  pageConfig={pageConfig}
                />
              </React.Suspense>
            )}
          </div>

          {/* 配置化步骤内容 */}
          <Drawer width={350} mask={false} placement="right" closable={false} visible getContainer={false}>
            <Card
              title="页面配置"
              extra={
                <Space>
                  <Button.Group>
                    <Button type="primary" onClick={() => this.handleSave()}>
                      保存
                    </Button>
                    <Button onClick={() => onCancel && onCancel()}>取消</Button>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item onClick={() => this.handleRefreshPreview()}>强制刷新</Menu.Item>
                          <Menu.Item
                            onClick={() => {
                              copy(JSON.stringify(pageConfig))
                              message.info('复制成功')
                            }}
                          >
                            复制配置
                          </Menu.Item>
                          <Menu.Item onClick={() => this.setState({ configStringify: true })}>配置文件</Menu.Item>
                        </Menu>
                      }
                      getPopupContainer={(ele) =>
                        document.getElementById('ccms-config') || ele.parentElement || document.body
                      }
                    >
                      <Button icon={<DownOutlined />} />
                    </Dropdown>
                  </Button.Group>
                </Space>
              }
              tabList={[
                {
                  key: '-1',
                  tab: '基本信息'
                },
                ...PageTemplates[pageTemplate].map(({ label }, index) => ({
                  key: index.toString(),
                  tab: label
                }))
              ]}
              activeTabKey={activeTab.toString()}
              onTabChange={(activeTabChange) => this.setState({ activeTab: Number(activeTabChange) })}
              tabProps={{ size: 'small' }}
              bordered={false}
            >
              {activeTab === -1 ? (
                <>
                  <div>
                    <div>UI风格：</div>
                    <div>
                      <Radio.Group
                        size="small"
                        value={pageConfig.ui}
                        style={{ display: 'block', marginTop: 8 }}
                        defaultValue="antd"
                        onChange={(e) => {
                          this.setState((state) => {
                            return { pageConfig: { ...state.pageConfig, ui: e.target.value } }
                          })
                        }}
                      >
                        <Radio.Button value="antd">Ant Design</Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div>页面类型：</div>
                    <div>
                      <Radio.Group
                        size="small"
                        value={pageTemplate}
                        style={{ display: 'block', marginTop: 8 }}
                        onChange={(e) => this.handleChangePageMode(e.target.value)}
                      >
                        <Radio.Button className="ccms-page-template" value="normal-table">
                          <div className="ccms-page-template-icon">
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '3px solid black',
                                marginLeft: 4,
                                marginBottom: 2,
                                marginTop: 4
                              }}
                            />
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '1px solid black',
                                marginLeft: 4,
                                marginBottom: 2
                              }}
                            />
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '1px solid black',
                                marginLeft: 4,
                                marginBottom: 2
                              }}
                            />
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '1px solid black',
                                marginLeft: 4,
                                marginBottom: 2
                              }}
                            />
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '1px solid black',
                                marginLeft: 4,
                                marginBottom: 2
                              }}
                            />
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '1px solid black',
                                marginLeft: 4,
                                marginBottom: 2
                              }}
                            />
                          </div>
                          <span>普通列表</span>
                        </Radio.Button>
                        <Radio.Button className="ccms-page-template" value="filter-table">
                          <div className="ccms-page-template-icon">
                            <div
                              style={{
                                width: 18,
                                height: 3,
                                marginLeft: 4,
                                marginBottom: 3,
                                marginTop: 4,
                                display: 'flex'
                              }}
                            >
                              <div style={{ width: 10, height: 3, border: '1px solid black', marginRight: 2 }} />
                              <div style={{ width: 6, height: 0, borderTop: '3px solid black' }} />
                            </div>
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '3px solid black',
                                marginLeft: 4,
                                marginBottom: 2
                              }}
                            />
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '1px solid black',
                                marginLeft: 4,
                                marginBottom: 2
                              }}
                            />
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '1px solid black',
                                marginLeft: 4,
                                marginBottom: 2
                              }}
                            />
                            <div
                              style={{
                                width: 18,
                                height: 0,
                                borderTop: '1px solid black',
                                marginLeft: 4,
                                marginBottom: 2
                              }}
                            />
                          </div>
                          <span>筛选列表</span>
                        </Radio.Button>
                        <Radio.Button className="ccms-page-template" value="normal-form">
                          <div className="ccms-page-template-icon">
                            <div
                              style={{
                                width: 19,
                                height: 5,
                                display: 'flex',
                                marginLeft: 4,
                                marginBottom: 2,
                                marginTop: 4
                              }}
                            >
                              <div
                                style={{
                                  width: 4,
                                  height: 2,
                                  borderBottom: '1px solid black',
                                  marginRight: 1,
                                  opacity: 0.5
                                }}
                              />
                              <div style={{ width: 13, height: 5, border: '1px solid black' }} />
                            </div>
                            <div style={{ width: 19, height: 7, display: 'flex', marginLeft: 4, marginBottom: 2 }}>
                              <div
                                style={{
                                  width: 4,
                                  height: 2,
                                  borderBottom: '1px solid black',
                                  marginRight: 1,
                                  opacity: 0.5
                                }}
                              />
                              <div style={{ width: 13, height: 7, border: '1px solid black' }} />
                            </div>
                            <div style={{ width: 19, height: 3, marginLeft: 9, display: 'flex' }}>
                              <div style={{ width: 6, height: 3, border: '1px solid black', marginRight: 1 }} />
                              <div style={{ width: 6, height: 3, border: '1px solid black' }} />
                            </div>
                          </div>
                          <span>普通表单</span>
                        </Radio.Button>
                        <Radio.Button className="ccms-page-template" value="edit-form">
                          <div className="ccms-page-template-icon">
                            <div
                              style={{
                                width: 19,
                                height: 5,
                                display: 'flex',
                                marginLeft: 4,
                                marginBottom: 2,
                                marginTop: 4
                              }}
                            >
                              <div
                                style={{
                                  width: 4,
                                  height: 2,
                                  borderBottom: '1px solid black',
                                  marginRight: 1,
                                  opacity: 0.5
                                }}
                              />
                              <div style={{ width: 13, height: 5, border: '1px solid black' }}>
                                <div
                                  style={{
                                    width: 9,
                                    height: 0,
                                    borderTop: '1px solid black',
                                    marginLeft: 1,
                                    marginTop: 1
                                  }}
                                />
                              </div>
                            </div>
                            <div style={{ width: 19, height: 7, display: 'flex', marginLeft: 4, marginBottom: 2 }}>
                              <div
                                style={{
                                  width: 4,
                                  height: 2,
                                  borderBottom: '1px solid black',
                                  marginRight: 1,
                                  opacity: 0.5
                                }}
                              />
                              <div style={{ width: 13, height: 7, border: '1px solid black' }}>
                                <div
                                  style={{
                                    width: 9,
                                    height: 0,
                                    borderTop: '1px solid black',
                                    marginLeft: 1,
                                    marginTop: 1
                                  }}
                                />
                                <div
                                  style={{
                                    width: 4,
                                    height: 0,
                                    borderTop: '1px solid black',
                                    marginLeft: 1,
                                    marginTop: 1
                                  }}
                                />
                              </div>
                            </div>
                            <div style={{ width: 19, height: 3, marginLeft: 9, display: 'flex' }}>
                              <div style={{ width: 6, height: 3, border: '1px solid black', marginRight: 1 }} />
                              <div style={{ width: 6, height: 3, border: '1px solid black' }} />
                            </div>
                          </div>
                          <span>编辑表单</span>
                        </Radio.Button>
                      </Radio.Group>
                      <Radio.Group
                        size="small"
                        value={pageTemplate}
                        style={{ display: 'block', marginTop: 8 }}
                        onChange={(e) => this.handleChangePageMode(e.target.value)}
                      >
                        <Radio.Button className="ccms-page-template" value="detail">
                          <div className="ccms-page-template-icon">
                            <div style={{ width: 19, display: 'flex', marginLeft: 4, marginBottom: 2, marginTop: 4 }}>
                              <div
                                style={{
                                  width: 4,
                                  height: 2,
                                  borderBottom: '1px solid black',
                                  marginRight: 1,
                                  opacity: 0.5
                                }}
                              />
                              <div>
                                <div style={{ width: 9, height: 0, borderTop: '1px solid black', marginTop: 1 }} />
                              </div>
                            </div>
                            <div style={{ width: 19, display: 'flex', marginLeft: 4, marginBottom: 2 }}>
                              <div
                                style={{
                                  width: 4,
                                  height: 2,
                                  borderBottom: '1px solid black',
                                  marginRight: 1,
                                  opacity: 0.5
                                }}
                              />
                              <div>
                                <div style={{ width: 12, height: 0, borderTop: '1px solid black', marginTop: 1 }} />
                                <div style={{ width: 12, height: 0, borderTop: '1px solid black', marginTop: 1 }} />
                                <div style={{ width: 8, height: 0, borderTop: '1px solid black', marginTop: 1 }} />
                              </div>
                            </div>
                            <div style={{ width: 19, display: 'flex', marginLeft: 4, marginBottom: 2 }}>
                              <div
                                style={{
                                  width: 4,
                                  height: 2,
                                  borderBottom: '1px solid black',
                                  marginRight: 1,
                                  opacity: 0.5
                                }}
                              />
                              <div style={{ display: 'flex' }}>
                                <div style={{ width: 2, height: 0, borderTop: '1px solid black', marginTop: 1 }} />
                                <div
                                  style={{
                                    width: 2,
                                    height: 0,
                                    borderTop: '1px solid black',
                                    marginLeft: 1,
                                    marginTop: 1
                                  }}
                                />
                                <div
                                  style={{
                                    width: 2,
                                    height: 0,
                                    borderTop: '1px solid black',
                                    marginLeft: 1,
                                    marginTop: 1
                                  }}
                                />
                              </div>
                            </div>
                            <div style={{ width: 19, height: 3, marginLeft: 9, display: 'flex' }}>
                              <div style={{ width: 6, height: 3, border: '1px solid black' }} />
                            </div>
                          </div>
                          <span>详情页面</span>
                        </Radio.Button>
                        <Radio.Button className="ccms-page-template" value="opera">
                          <div className="ccms-page-template-icon">
                            <div
                              style={{
                                width: 18,
                                height: 7,
                                border: '1px solid black',
                                marginLeft: 4,
                                marginTop: 8,
                                borderRadius: 2,
                                display: 'flex',
                                position: 'relative'
                              }}
                            >
                              <div style={{ width: 2, borderTop: '1px solid black', marginLeft: 2, marginTop: 2 }} />
                              <div
                                style={{
                                  width: 9,
                                  borderTop: '1px solid black',
                                  marginLeft: 1,
                                  marginTop: 2,
                                  opacity: 0.5
                                }}
                              />
                              <div
                                style={{
                                  width: 8,
                                  borderTop: '1px solid black',
                                  position: 'absolute',
                                  left: 12,
                                  top: 4,
                                  transform: 'rotate(90deg)',
                                  transformOrigin: 'left top'
                                }}
                              />
                              <div
                                style={{
                                  width: 8,
                                  borderTop: '1px solid black',
                                  position: 'absolute',
                                  left: 12,
                                  top: 4,
                                  transform: 'rotate(35deg)',
                                  transformOrigin: 'left top'
                                }}
                              />
                            </div>
                          </div>
                          <span>操作按钮</span>
                        </Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>
                </>
              ) : (
                <React.Suspense fallback={<>Loading</>}>
                  <CCMSForm
                    key={activeTab}
                    data={[
                      {
                        ...(pageConfig.steps || [])[activeTab],
                        applicationName,
                        businessSuffix: type === 'business' ? '/business' : '',
                        version,
                        subversion,
                        configDomain
                      }
                    ]}
                    config={(StepConfigs[((pageConfig.steps || [])[activeTab] || {}).type] || {}) as FormConfig}
                    onChange={(data) => {
                      const { pageConfig: currentPageConfig, activeTab: currentActiveTab } = this.state
                      const { steps = [] } = currentPageConfig
                      steps[currentActiveTab] = data as FormConfig
                      currentPageConfig.steps = steps
                      this.setState({
                        pageConfig: currentPageConfig
                      })
                    }}
                    loadDomain={loadDomain}
                    loadPageList={loadPageList}
                    baseRoute={baseRoute}
                  />
                </React.Suspense>
              )}
            </Card>
          </Drawer>

          {/* 编辑配置文件 */}
          <ConfigJSON
            configStringify={configStringify}
            defaultValue={JSON.stringify(pageConfig, undefined, 2)}
            onOk={(pageConfigChange) => {
              this.setState({ pageConfig: pageConfigChange, configStringify: false })
              this.handleRefreshPreview()
            }}
            onCancel={() => this.setState({ configStringify: false })}
          />
        </div>
      </ConfigProvider>
    )
  }
}

export default App
