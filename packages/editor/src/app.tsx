import React from 'react'
import { Drawer, Button, Modal, message, Card, Space, Radio, Dropdown, Menu } from 'antd'
import { DownOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { CCMS as CCMSAntDesign } from 'ccms-antd'
import { CCMSConfig, BasicConfig, PageListItem } from 'ccms/dist/src/main'
import { FormConfig } from 'ccms/dist/src/steps/form'
import { cloneDeep } from 'lodash'
import copy from 'copy-html-to-clipboard'
import { PageTemplate, PageTemplates, StepConfigs, StepTemplates, stepName } from './steps'
import CCMSForm from './component/CCMSForm'
import './antd.less' // 加载antd样式（用于样式隔离）
import './app.less'
import ConfigJSON from './component/ConfigJSON'
/**
 * 页面配置
 */
const basicForm: FormConfig = {
  type: 'form',
  layout: 'horizontal',
  defaultValue: {
    source: 'data',
    field: ''
  },
  fields: [
    {
      label: '页面标题',
      field: 'title',
      type: 'text',
      defaultValue: {
        source: 'static',
        value: ''
      }
    },
    {
      label: '页面描述',
      field: 'description',
      type: 'group',
      fields: [
        {
          label: '内容格式',
          field: 'type',
          type: 'select_single',
          mode: 'button',
          options: {
            from: 'manual',
            data: [
              {
                value: 'plain',
                label: '纯文本'
              },
              {
                value: 'markdown',
                label: 'MarkDown'
              },
              {
                value: 'html',
                label: 'HTML'
              }
            ]
          }
        },
        {
          label: '内容',
          field: 'content',
          type: 'longtext',
          defaultValue: {
            source: 'static',
            value: ''
          }
        }
      ]
    }
  ],
  actions: [],
  rightTopActions: []
}

export interface AppPropsInterface {
  config: CCMSConfig
  sourceData: { [field: string]: unknown }
  applicationName?: string
  type?: 'application' | 'business'
  version?: string
  subversion?: string
  baseRoute: string
  checkPageAuth: (pageID: any) => Promise<boolean>
  loadPageURL: (pageID: any) => Promise<string>
  loadPageFrameURL: (pageID: any) => Promise<string>
  loadPageConfig: (pageID: any) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  loadCustomSource: (customName: string, version: string) => string
  loadDomain: (name: string) => Promise<string>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void
  onChange: (value: any) => void
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

interface PageConfig extends CCMSConfig {
  ui: 'antd'
}

export interface CCMSConsigState {
  ready: boolean
  pageConfig: PageConfig
  activeTab: number
  pageTemplate: PageTemplate
  configStringify: boolean
  customizeTeplates: { step: string; label: string }[]
}

class App extends React.Component<AppProps, CCMSConsigState> {
  state: CCMSConsigState = {
    pageConfig: cloneDeep(this.props.config || basicForm) as PageConfig, // 页面配置
    activeTab: -1, // 活跃tab
    pageTemplate: 'normal-form', // 页面类型
    ready: true, // 是否展示，用于刷新
    configStringify: false,
    customizeTeplates: []
  }

  componentDidMount() {
    const { pageConfig } = this.state
    const steps = pageConfig.steps || []

    // 是否为自定义流程页面
    let isCustomize = true

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
          isCustomize = false
          break
        }
      }
    }

    if (isCustomize) {
      const customizeTeplates: { step: string; label: string }[] = []

      for (let i = 0; i < steps.length; i++) {
        customizeTeplates.push({
          step: steps[i].type,
          label: stepName[steps[i].type]
        })
      }

      this.setState({
        pageTemplate: 'customize' as PageTemplate,
        customizeTeplates
      })
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
          ready: true,
          activeTab
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

        const isCustomize = pageTemplate === 'customize'
        if (isCustomize) {
          this.setState({
            customizeTeplates: steps
          })
        }
      },
      getContainer: () => document.getElementById('ccms-config') || document.body
    })
  }

  changeCustomType = (step, i) => {
    const { customizeTeplates, pageConfig } = this.state
    customizeTeplates[i] = {
      label: stepName[step],
      step
    }
    if (pageConfig && pageConfig.steps) {
      pageConfig.steps[i] = { type: step }
    }

    this.setState({
      customizeTeplates,
      pageConfig
    })
  }

  addCustomType = (start) => {
    const { customizeTeplates, pageConfig } = this.state
    if (customizeTeplates.length === 6) {
      message.info('自定义流程建议保持在6个以内')
      // return
    }
    const step = 'header'
    const defaultAdd = {
      label: stepName[step],
      step
    }
    start ? customizeTeplates.unshift(defaultAdd) : customizeTeplates.push(defaultAdd)

    if (pageConfig && pageConfig.steps) {
      start ? pageConfig?.steps.unshift({ type: step }) : pageConfig?.steps.push({ type: step })
    }

    this.setState({
      customizeTeplates,
      pageConfig
    })
  }

  exchangeCustomType = (i, exchangeType) => {
    const { customizeTeplates, pageConfig } = this.state

    const startIndex = i
    const endIndex = exchangeType === 'up' ? i - 1 : i + 1

      ;[customizeTeplates[startIndex], customizeTeplates[endIndex]] = [
        customizeTeplates[endIndex],
        customizeTeplates[startIndex]
      ]

    if (pageConfig && pageConfig.steps) {
      ;[pageConfig.steps[startIndex], pageConfig.steps[endIndex]] = [
        pageConfig.steps[endIndex],
        pageConfig.steps[startIndex]
      ]

      this.setState({
        customizeTeplates,
        pageConfig
      })
    }
  }

  deleteCustomType = (i) => {
    const { customizeTeplates, pageConfig } = this.state
    customizeTeplates.splice(i, 1)

    if (pageConfig && pageConfig.steps) {
      pageConfig?.steps.splice(i, 1)
    }

    this.setState({
      customizeTeplates,
      pageConfig
    })
  }

  render() {
    const { ready, pageConfig, activeTab, pageTemplate, configStringify, customizeTeplates } = this.state

    const {
      applicationName,
      version,
      subversion,
      configDomain,
      type,
      baseRoute,
      sourceData,
      checkPageAuth,
      loadPageURL,
      loadPageFrameURL,
      loadPageConfig,
      loadPageList,
      loadDomain,
      handlePageRedirect,
      loadCustomSource,
      onCancel
    } = this.props

    const CCMS = CCMSAntDesign

    const isCustomize = pageTemplate === 'customize'

    const PageTemplatesList = isCustomize ? customizeTeplates : PageTemplates[pageTemplate]

    return (
      <div id="ccms-config" className="ccms-config">
        {/* 预览CCMS */}
        <div className="preview">
          {ready && (
            <CCMS
              checkPageAuth={checkPageAuth}
              loadPageURL={loadPageURL}
              loadPageFrameURL={loadPageFrameURL}
              // @ts-ignore
              loadPageConfig={loadPageConfig}
              loadPageList={loadPageList}
              loadCustomSource={loadCustomSource}
              loadDomain={loadDomain}
              handlePageRedirect={handlePageRedirect}
              sourceData={sourceData}
              baseRoute={baseRoute}
              callback={() => {
                // if (window.history.length > 1) {
                //   window.history.back()
                // } else {
                //   window.close()
                // }
              }}
              // @ts-ignore
              config={pageConfig}
            />
          )}
        </div>

        {/* 配置化步骤内容 */}
        <Drawer width={365} mask={false} placement="right" closable={false} visible getContainer={false}>
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
              ...PageTemplatesList.map(({ label, step }, index) => ({
                key: index.toString(),
                tab: label
              }))
            ]}
            activeTabKey={activeTab.toString()}
            onTabChange={(activeTab) => this.setState({ activeTab: Number(activeTab) })}
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
                        const { pageConfig } = this.state
                        pageConfig.ui = e.target.value
                        this.setState({
                          pageConfig
                        })
                      }}
                    >
                      <Radio.Button value="antd">Ant Design</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                <div className="margin-top16">
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
                      <Radio.Button className="ccms-page-template" value="customize">
                        <div className="ccms-page-template-icon">
                          <PlusCircleOutlined />
                        </div>
                        <span>自定义</span>
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                {isCustomize && (
                  <div className="margin-top16">
                    <div>自定义流程：</div>
                    <div className="add-customize" onClick={() => this.addCustomType(true)}>
                      + 插入流程
                    </div>

                    <div className="customize-body">
                      {customizeTeplates.map((l, i) => {
                        const stepList: { key: any; label: JSX.Element }[] = []
                        Object.keys(stepName).forEach((v) => {
                          stepList.push({
                            key: v,
                            label: stepName[v]
                          })
                        })
                        return (
                          <div key={i} className="customize-list">
                            <div>
                              <span>{`流程${i + 1} `}</span>
                              <Dropdown
                                overlay={
                                  <div className="customize-list-select">
                                    <Radio.Group
                                      onChange={(e) => this.changeCustomType(e.target.value, i)}
                                      value={l.step}
                                    >
                                      {Object.keys(stepName).map((stepType, sindex) => {
                                        return (
                                          <Radio.Button value={stepType} key={`${stepType}${sindex}`}>
                                            {stepName[stepType]}
                                          </Radio.Button>
                                        )
                                      })}
                                    </Radio.Group>
                                  </div>
                                }
                                arrow
                              >
                                <a onClick={(e) => e.preventDefault()}>
                                  <Space>
                                    {l.label}
                                    <DownOutlined />
                                  </Space>
                                </a>
                              </Dropdown>
                            </div>
                            <div>
                              {i > 0 && i !== customizeTeplates.length - 1 && (
                                <ArrowUpOutlined
                                  className="customize-icon"
                                  onClick={() => this.exchangeCustomType(i, 'up')}
                                />
                              )}
                              {i > 0 && i !== customizeTeplates.length - 1 && (
                                <ArrowDownOutlined
                                  className="customize-icon"
                                  onClick={() => this.exchangeCustomType(i, 'down')}
                                />
                              )}
                              <DeleteOutlined className="customize-icon" onClick={() => this.deleteCustomType(i)} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="add-customize" onClick={() => this.addCustomType(false)}>
                      + 追加流程
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
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
                    const { pageConfig } = this.state
                    const { steps = [] } = pageConfig
                    steps[activeTab] = data
                    pageConfig.steps = steps
                    this.setState(
                      {
                        ready: false,
                        pageConfig
                      },
                      () => {
                        this.setState({
                          ready: true
                        })
                      }
                    )
                  }}
                  loadDomain={loadDomain}
                  loadPageList={loadPageList}
                  loadCustomSource={loadCustomSource}
                  baseRoute={baseRoute}
                />
              </>
            )}
          </Card>
        </Drawer>

        {/* 编辑配置文件 */}
        <ConfigJSON
          configStringify={configStringify}
          defaultValue={JSON.stringify(pageConfig, undefined, 2)}
          onOk={(pageConfig) => {
            this.setState({ pageConfig, configStringify: false })
            this.handleRefreshPreview()
          }}
          onCancel={() => this.setState({ configStringify: false })}
        />
      </div>
    )
  }
}

export default App
