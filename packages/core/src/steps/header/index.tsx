import React, { ReactNode } from 'react'
import marked from 'marked'
import { merge } from 'lodash'
import Step, { StepConfig } from '../common'
import { ParamConfig } from '../../interface'
import StatementHelper, { StatementConfig } from '../../util/statement'
import ParamHelper from '../../util/param'
import EnumerationHelper, { EnumerationOptionsConfig } from '../../util/enumeration'
import { InterfaceHelper } from '../..'
import OperationHelper, { OperationConfig } from '../../util/operation'
import { DetailFieldConfigs } from '../../components/detail'
import DetailStep, { DetailConfig } from '../detail'

/**
 * header页头配置文件格式定义
 * - breadcrumb:   面包屑内容定义
 * - title: 主标题
 * - subTitle: 副标题
 * - back: 返回按钮
 * -- enable: 启用
 * - mainContent: 主内容
 * - extraContent: 扩展内容
 */
export interface HeaderConfig extends StepConfig {
  type: 'header'
  breadcrumb?: {
    enable?: boolean
    separator?: string
    items?: breadcrumbConfig[]
  }
  title?: StatementConfig
  subTitle?: StatementConfig
  back?: {
    enable?: boolean
  }
  mainContent?:
    | plainContentConfig
    | markdownContentConfig
    | htmlContentConfig
    | detailContentConfig
    | statisticContentConfig
  extraContent?: statisticContentConfig | imageContentConfig
}

/**
 * 面包屑内容
 */
export interface breadcrumbConfig {
  label?: string
  type?: 'normal' | 'bold'
  action?: OperationConfig
}

interface basicContentConfig {
  enable?: boolean
}

export interface plainContentConfig extends basicContentConfig {
  type: 'plain'
  content?: string
  params?: { field: string; data: ParamConfig }[]
}
export interface markdownContentConfig extends basicContentConfig {
  type: 'markdown'
  content?: string
  params?: { field: string; data: ParamConfig }[]
}
export interface htmlContentConfig extends basicContentConfig {
  type: 'html'
  content?: string
  params?: { field: string; data: ParamConfig }[]
}
export interface detailContentConfig extends basicContentConfig {
  type: 'detail'
  fields?: DetailFieldConfigs[]
  defaultValue?: ParamConfig
}
export interface statisticContentConfig extends basicContentConfig {
  type: 'statistic'
  statistics?: (valueStatisticConfig | enumerationStatisticConfig)[]
}

interface basicStatisticConfig {
  label?: string
  value?: ParamConfig
}

export interface valueStatisticConfig extends basicStatisticConfig {
  type: 'value'
}

export interface enumerationStatisticConfig extends basicStatisticConfig {
  type: 'enumeration'
  options?: EnumerationOptionsConfig
}
export interface imageContentConfig extends basicContentConfig {
  type: 'image'
  image?: {
    maxWidth?: string
    maxHeight?: string
    src?: string
  }
}

/**
 * 面包屑元素config
 * - label: 文案
 * - type: 展示形式
 * - onClick: 点击事件
 */
export interface IBreadcurmbItemProps {
  label: string
  type: 'normal' | 'bold'
  onClick: () => void
}

/**
 * 面包屑内容config
 * - items: 面包屑内容
 * - separator: 分割符
 */
export interface IBreadcurmbProps {
  items: Array<React.ReactNode>
  separator: string
}

/**
 * 绘制统计内容config
 * - label: 统计标题
 * - value: 统计数值
 */
export interface IStatisticProps {
  label: string
  value: string | number
}

/**
 * 头部组件config
 * - breadcrumb:面包屑内容
 * - title: 主标题
 * - subTitle: 副标题
 * - onBack: 返回按钮点击事件
 * - mainContent: 主内容
 * - extraContent: 扩展内容
 */
export interface IHeaderProps {
  breadcrumb?: ReactNode
  title?: string
  subTitle?: string
  onBack?: () => void
  mainContent?: ReactNode
  extraContent?: ReactNode
}

export default class HeaderStep extends Step<HeaderConfig> {
  interfaceHelper = new InterfaceHelper()

  OperationHelper = OperationHelper

  DetailStep = DetailStep

  stepPush = async () => {
    // 表单初始化结束，展示表单界面。
    if (this.props.onMount) {
      this.props.onMount()
    }
    if (this.props.onSubmit) {
      this.props.onSubmit({})
    }
  }

  /**
   * 用于展示面包屑元素
   * @param props
   * @returns
   */
  renderBreadcurmbItemComponent: (props: IBreadcurmbItemProps) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现HeaderStep组件的renderBreadcurmbItemComponent方法。</>
  }

  /**
   * 用于展示面包屑
   * @param props
   * @returns
   */
  renderBreadcurmbComponent: (props: IBreadcurmbProps) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现HeaderStep组件的renderBreadcurmbComponent方法。</>
  }

  /**
   * 用于展示统计内容
   * @param props
   * @returns
   */
  renderStatisticComponent: (props: IStatisticProps) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现HeaderStep组件的renderStatisticComponent方法。</>
  }

  renderComponent: (props: IHeaderProps) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现HeaderStep组件。</>
  }

  handlePlainContent: (config: plainContentConfig, position: string) => string = (config) => {
    return StatementHelper(
      { statement: config.content || '', params: config.params || [] },
      {
        data: this.props.data,
        step: this.props.step,
        containerPath: '',
        record: {}
      }
    )
  }

  handleMarkdownContent: (config: markdownContentConfig, position: string) => JSX.Element = (config) => {
    const content = StatementHelper(
      { statement: config.content || '', params: config.params || [] },
      {
        data: this.props.data,
        step: this.props.step,
        containerPath: '',
        record: {}
      }
    )
    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
  }

  handleHTMLContent: (config: htmlContentConfig, position: string) => JSX.Element = (config) => {
    const content = StatementHelper(
      { statement: config.content || '', params: config.params || [] },
      {
        data: this.props.data,
        step: this.props.step,
        containerPath: '',
        record: {}
      }
    )
    // eslint-disable-next-line react/no-danger
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }

  handleDetailContent: (config: detailContentConfig, position: string) => JSX.Element = (config) => {
    const defaultConfig: DetailConfig = {
      type: 'detail',
      hiddenBack: true
    }
    return (
      <this.DetailStep
        ref={(e: Step<DetailConfig, unknown> | null) => {
          e && e.stepPush()
        }}
        data={this.props.data}
        step={this.props.step}
        onSubmit={async () => {
          /* 无逻辑 */
        }}
        onMount={async () => {
          /* 无逻辑 */
        }}
        onUnmount={async () => {
          /* 无逻辑 */
        }}
        config={merge(config, defaultConfig)}
        baseRoute={this.props.baseRoute}
        checkPageAuth={this.props.checkPageAuth}
        loadPageURL={this.props.loadPageURL}
        loadPageFrameURL={this.props.loadPageFrameURL}
        loadPageConfig={this.props.loadPageConfig}
        loadPageList={this.props.loadPageList}
        loadDomain={this.props.loadDomain}
        handlePageRedirect={this.props.handlePageRedirect}
      />
    )
  }

  handleStatisticContent = (config: statisticContentConfig, _position: string) => {
    return (config.statistics || []).map((statistic, index) => {
      const value = statistic.value
        ? ParamHelper(statistic.value, {
            data: this.props.data,
            step: this.props.step,
            containerPath: '',
            record: {}
          })
        : undefined
      switch (statistic.type) {
        case 'value':
          return this.renderStatisticComponent({
            label: statistic.label || '',
            value
          })
        case 'enumeration':
          if (statistic.options) {
            EnumerationHelper.options(
              statistic.options,
              (optionConfig, source) =>
                this.interfaceHelper.request(
                  optionConfig,
                  source,
                  {
                    data: this.props.data,
                    step: this.props.step,
                    containerPath: '',
                    record: {}
                  },
                  { loadDomain: this.props.loadDomain }
                ),
              {
                data: this.props.data,
                step: this.props.step,
                containerPath: '',
                record: {}
              }
            ).then((options) => {
              if (
                !this.state ||
                JSON.stringify(this.state[`statistic_options_${_position}_${index}`]) !== JSON.stringify(options)
              ) {
                this.setState({
                  [`statistic_options_${_position}_${index}`]: options
                })
              }
            })

            const options: { value: unknown; label: unknown }[] =
              this.state && this.state[`statistic_options_${_position}_${index}`]
            if (options) {
              const option = options.find((currentOption) => currentOption.value === value)
              if (option) {
                return this.renderStatisticComponent({
                  label: statistic.label || '',
                  value: option.label as string | number
                })
              }
            }
          }
          return this.renderStatisticComponent({
            label: statistic.label || '',
            value
          })
        default:
          return null
      }
    })
  }

  handleImageContent: (config: imageContentConfig, position: string) => JSX.Element = (config) => {
    if (config.image && config.image.src) {
      return (
        <img
          src={config.image.src}
          alt={config.image.src}
          style={{ maxWidth: config.image.maxWidth, maxHeight: config.image.maxHeight }}
        />
      )
    }
    return <></>
  }

  render() {
    const props: IHeaderProps = {}

    if (this.props.config.breadcrumb && this.props.config.breadcrumb.enable) {
      const currentBreadcrumbConfig = this.props.config.breadcrumb
      props.breadcrumb = this.renderBreadcurmbComponent({
        items: (currentBreadcrumbConfig.items || []).map((breadcrumbItem, index) => (
          <this.OperationHelper
            key={index}
            config={breadcrumbItem.action}
            datas={{ data: this.props.data, step: this.props.step, record: {} }}
            checkPageAuth={this.props.checkPageAuth}
            loadPageURL={this.props.loadPageURL}
            loadPageFrameURL={this.props.loadPageFrameURL}
            loadPageConfig={this.props.loadPageConfig}
            loadPageList={this.props.loadPageList}
            baseRoute={this.props.baseRoute}
            loadDomain={this.props.loadDomain}
            handlePageRedirect={this.props.handlePageRedirect}
          >
            {(onClick) =>
              this.renderBreadcurmbItemComponent({
                label: breadcrumbItem.label || '',
                type: breadcrumbItem.type || 'normal',
                onClick
              })
            }
          </this.OperationHelper>
        )),
        separator: currentBreadcrumbConfig.separator || '>'
      })
    }

    if (this.props.config.title) {
      props.title = StatementHelper(this.props.config.title, {
        data: this.props.data,
        step: this.props.step,
        containerPath: '',
        record: {}
      })
    }

    if (this.props.config.subTitle) {
      props.subTitle = StatementHelper(this.props.config.subTitle, {
        data: this.props.data,
        step: this.props.step,
        containerPath: '',
        record: {}
      })
    }

    if (this.props.config.back && this.props.config.back.enable) {
      props.onBack = () => {
        this.props.onUnmount()
      }
    }

    if (this.props.config.mainContent && this.props.config.mainContent.enable) {
      const { mainContent } = this.props.config
      switch (mainContent.type) {
        case 'plain':
          props.mainContent = this.handlePlainContent(mainContent, 'main')
          break
        case 'markdown':
          props.mainContent = this.handleMarkdownContent(mainContent, 'main')
          break
        case 'html':
          props.mainContent = this.handleHTMLContent(mainContent, 'main')
          break
        case 'detail':
          props.mainContent = this.handleDetailContent(mainContent, 'main')
          break
        case 'statistic':
          props.mainContent = this.handleStatisticContent(mainContent, 'main')
          break
        default:
      }
    }

    if (this.props.config.extraContent && this.props.config.extraContent.enable) {
      const { extraContent } = this.props.config
      switch (extraContent.type) {
        case 'statistic':
          props.extraContent = this.handleStatisticContent(extraContent, 'extra')
          break
        case 'image':
          props.extraContent = this.handleImageContent(extraContent, 'extra')
          break
        default:
          break
      }
    }

    return <>{this.renderComponent(props)}</>
  }
}
