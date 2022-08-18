import React from 'react'
import { cloneDeep, get, set, unset } from 'lodash'
import { DetailField, DetailFieldConfigs } from '../../components/detail/common'
import Step, { StepConfig, StepProps } from '../common'
import getALLComponents from '../../components/detail'
import { getValue, setValue } from '../../util/value'
import { ColumnsConfig, ParamConfig } from '../../interface'
import ParamHelper from '../../util/param'
import ConditionHelper from '../../util/condition'

/**
 * 详情步骤配置文件格式定义
 * - type 对应 detail
 * - layout: 表单布局类型
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - columns: 分栏设置
 * - * type: 分栏类型
 * - * - * span: 固定分栏
 * - * - * width: 宽度分栏
 * - * value: 分栏相关配置值
 * - * wrap: 分栏后是否换行
 * - * gap: 分栏边距
 * - fields: 详情项配置列表
 * - defaultValue  默认值
 * - hiddenBack  是否隐藏返回按钮
 * - backText   返回按钮文案
 */
export interface DetailConfig extends StepConfig {
  type: 'detail'
  layout?: 'horizontal' | 'vertical'
  columns?: ColumnsConfig
  unstringify?: string[] // 反序列化字段
  fields?: DetailFieldConfigs[]
  defaultValue?: ParamConfig
  hiddenBack?: boolean
  backText?: string
}

/**
 * 详情步骤组件 - UI渲染方法 - 入参格式
 * - layout:   表单布局类型
 * - * horizontal: 左侧文本、右侧输入框、纵向排列
 * - * vertical:   顶部文本、底部输入框、纵向排列
 * - * inline:     左侧文本、右侧输入框、横向排列
 * - columns: 分栏设置
 * - * type: 分栏类型
 * - * - * span: 固定分栏
 * - * - * width: 宽度分栏
 * - * value: 分栏相关配置值
 * - * wrap: 分栏后是否换行
 * - * gap: 分栏边距
 * - children: 表单内容
 */
export interface IDetail {
  layout: 'horizontal' | 'vertical'
  columns?: ColumnsConfig
  children: React.ReactNode[]
  onBack?: () => Promise<unknown>
  backText?: string
}

/**
 * 详情项组件 - UI渲染方法
 * - key: react需要的unique key
 * - label:       详情项名称
 * - layout:      详情项布局
 * - columns: 分栏设置
 * - * type: 分栏类型
 * - * - * span: 固定分栏
 * - * - * width: 宽度分栏
 * - * value: 分栏相关配置值
 * - * wrap: 分栏后是否换行
 * - * gap: 分栏边距
 * - collapsible: 详情页group展开收起配置
 * - visitable:  详情项可见性
 * - * horizontal:  左侧文本、右侧输入框、纵向排列
 * - * vertical:    顶部文本、底部输入框、纵向排列
 * - * inline:      左侧文本、右侧输入框、横向排列
 * - children:    详情项内容
 */
export interface IDetailItem {
  key: string | number
  label: string
  layout: 'horizontal' | 'vertical'
  columns?: ColumnsConfig
  styles?: object
  collapsible?: 'header' | 'disabled'
  visitable: boolean
  fieldType: string
  children: React.ReactNode
}

/**
 * 详情步骤组件 - 状态
 * - formData: 表单的值
 */
interface DetailState {
  ready: boolean
  detailValue: { [field: string]: unknown }
}

/**
 * 表单步骤组件
 */
export default class DetailStep extends Step<DetailConfig, DetailState> {
  // 各详情项对应的类型所使用的UI组件的类
  getALLComponents = (type: string): typeof DetailField => getALLComponents[type]

  // 各详情项所使用的UI组件的实例
  detailFields: Array<DetailField<DetailFieldConfigs, unknown, unknown> | null> = []

  detailFieldsMounted: Array<boolean> = []

  detailValue: { [field: string]: unknown } = {}

  detailData: { status: 'normal' | 'error' | 'loading'; message?: string; name: string; hidden: boolean }[] = []

  /**
   * 初始化表单的值
   * @param props
   */
  constructor(props: StepProps<DetailConfig>) {
    super(props)
    this.state = {
      ready: false,
      detailValue: {}
    }
  }

  /**
   * 重写表单步骤装载事件
   */
  stepPush = async () => {
    // 处理表单步骤配置文件的默认值
    const {
      config: { fields: detailFieldsConfig = [] },
      data,
      step,
      onMount
    } = this.props

    if (this.props.config.defaultValue) {
      let detailDefault = ParamHelper(this.props.config.defaultValue, {
        data,
        step,
        containerPath: '',
        record: {}
      })
      if (this.props.config.unstringify) {
        for (const field of this.props.config.unstringify) {
          const info = getValue(detailDefault, field)
          try {
            detailDefault = setValue(detailDefault, field, JSON.parse(info))
          } catch (e) {
            /* 无逻辑 */
          }
        }
      }
      for (let detailFieldIndex = 0; detailFieldIndex < detailFieldsConfig.length; detailFieldIndex++) {
        const detailFieldConfig = detailFieldsConfig[detailFieldIndex]
        const value = getValue(detailDefault, detailFieldConfig.field)
        this.detailValue = setValue(this.detailValue, detailFieldConfig.field, value)
      }
    }

    await this.setState({
      ready: true,
      detailValue: this.detailValue
    })

    // 表单初始化结束，展示表单界面。
    onMount()
  }

  handleDetailFieldMount = async (detailFieldIndex: number) => {
    if (this.detailFieldsMounted[detailFieldIndex]) {
      return true
    }
    this.detailFieldsMounted[detailFieldIndex] = true

    if (this.detailFields[detailFieldIndex]) {
      const detailField = this.detailFields[detailFieldIndex]
      if (detailField) {
        const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]

        const value = getValue(this.detailValue, detailFieldConfig.field)
        this.detailValue = setValue(this.detailValue, detailFieldConfig.field, value)

        await detailField.didMount()
      }
    }

    await this.setState({
      detailValue: this.detailValue
    })
  }

  /**
   * 处理表单返回事件
   */
  handleCancel = async () => {
    const { onUnmount } = this.props

    onUnmount()
  }

  /**
   * 处理详情项change事件
   * @param field 详情项配置
   * @param value 目标值
   */
  handleChange = async (detailFieldIndex: number, value: unknown) => {
    const detailField = this.detailFields[detailFieldIndex]
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailField && detailFieldConfig) {
      this.detailValue = setValue(this.detailValue, detailFieldConfig.field, value)

      await this.setState({
        detailValue: this.detailValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }
    }
  }

  handleValueSet = async (
    detailFieldIndex: number,
    path: string,
    value: unknown,
    options?: { noPathCombination?: boolean }
  ) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (detailFieldConfig.field === '' || path === '') {
        fullPath = `${detailFieldConfig.field}${path}`
      } else {
        fullPath = `${detailFieldConfig.field}.${path}`
      }

      set(this.detailValue, fullPath, value)
      this.setState({
        detailValue: this.detailValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }
    }
  }

  handleValueUnset = async (detailFieldIndex: number, path: string, options?: { noPathCombination?: boolean }) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (detailFieldConfig.field === '' || path === '') {
        fullPath = `${detailFieldConfig.field}${path}`
      } else {
        fullPath = `${detailFieldConfig.field}.${path}`
      }

      unset(this.detailValue, fullPath)
      this.setState({
        detailValue: this.detailValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }
    }
  }

  handleValueListAppend = async (
    detailFieldIndex: number,
    path: string,
    value: unknown,
    options?: { noPathCombination?: boolean }
  ) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (detailFieldConfig.field === '' || path === '') {
        fullPath = `${detailFieldConfig.field}${path}`
      } else {
        fullPath = `${detailFieldConfig.field}.${path}`
      }

      const list = get(this.detailValue, fullPath, []) as unknown[]
      list.push(value)
      set(this.detailValue, fullPath, list)
      this.setState({
        detailValue: this.detailValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }
    }
  }

  handleValueListSplice = async (
    detailFieldIndex: number,
    path: string,
    index: number,
    count: number,
    options?: { noPathCombination?: boolean }
  ) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (detailFieldConfig.field === '' || path === '') {
        fullPath = `${detailFieldConfig.field}${path}`
      } else {
        fullPath = `${detailFieldConfig.field}.${path}`
      }

      const list = get(this.detailValue, fullPath, []) as unknown[]
      list.splice(index, count)
      set(this.detailValue, fullPath, list)
      this.setState({
        detailValue: this.detailValue
      })
      if (this.props.onChange) {
        this.props.onChange(this.detailValue)
      }
    }
  }

  /**
   * 详情步骤组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderComponent: (props: IDetail) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现Detail组件。</>
  }

  /**
   * 详情项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent: (props: IDetailItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现DetailItem组件。</>
  }

  render() {
    const { config, data, step } = this.props

    const layout = this.props.config?.layout || 'vertical'
    const fields = this.props.config?.fields || []

    const { ready, detailValue } = this.state

    if (ready) {
      return (
        <>
          {/* 渲染表单 */}
          {this.renderComponent({
            layout,
            columns: config.columns?.enable ? config.columns : undefined,
            onBack: this.props.config.hiddenBack ? undefined : async () => this.handleCancel(),
            backText: this.props.config?.backText?.replace(/(^\s*)|(\s*$)/g, ''),
            children: fields.map((detailFieldConfig, detailFieldIndex) => {
              if (
                !ConditionHelper(detailFieldConfig.condition, { record: detailValue, data, step, containerPath: '' })
              ) {
                this.detailFieldsMounted[detailFieldIndex] = false
                return null
              }
              let hidden = true
              let display = true

              // if (detailFieldConfig.type === 'hidden') {
              //   hidden = true
              //   display = false
              // }

              if (detailFieldConfig.display === 'none') {
                hidden = true
                display = false
              }

              // 隐藏项同时打标录入数据并清空填写项
              if (!hidden) {
                this.detailData[detailFieldIndex] = { status: 'normal', name: detailFieldConfig.label, hidden }
              }

              const DetailFieldComponent = this.getALLComponents(detailFieldConfig.type) || DetailField

              const renderData = {
                key: detailFieldIndex,
                label: detailFieldConfig.label,
                // status: detailFieldConfig.field !== undefined ? getValue(detailData, detailFieldConfig.field, {}).status || 'normal' : 'normal',
                // message: detailFieldConfig.field !== undefined ? getValue(detailData, detailFieldConfig.field, {}).message || '' : '',
                columns: config.columns?.enable
                  ? {
                      type: detailFieldConfig.columns?.type || config.columns?.type || 'span',
                      value: detailFieldConfig.columns?.value || config.columns?.value || 1,
                      wrap: detailFieldConfig.columns?.wrap || config.columns?.wrap || false,
                      gap: detailFieldConfig.columns?.gap || config.columns?.gap || 0,
                      rowGap: detailFieldConfig.columns?.rowGap || config.columns?.rowGap || 0
                    }
                  : undefined,
                layout,
                styles: detailFieldConfig.styles || {},
                visitable: display,
                fieldType: detailFieldConfig.type,
                children: (
                  <DetailFieldComponent
                    onUnmount={this.props.onUnmount}
                    checkPageAuth={this.props.checkPageAuth}
                    loadPageConfig={this.props.loadPageConfig}
                    loadPageList={this.props.loadPageList}
                    loadPageURL={this.props.loadPageURL}
                    loadPageFrameURL={this.props.loadPageFrameURL}
                    handlePageRedirect={() => this.props.handlePageRedirect}
                    key={detailFieldIndex}
                    ref={(detailField: DetailField<DetailFieldConfigs, unknown, unknown> | null) => {
                      if (detailFieldIndex !== null) {
                        this.detailFields[detailFieldIndex] = detailField
                        this.handleDetailFieldMount(detailFieldIndex)
                      }
                    }}
                    formLayout={layout}
                    value={
                      detailFieldConfig.field !== undefined
                        ? getValue(detailValue, detailFieldConfig.field) || detailFieldConfig.defaultValue
                        : undefined
                    }
                    record={detailValue}
                    step={cloneDeep(detailValue)}
                    data={cloneDeep(data)}
                    detail={this}
                    config={detailFieldConfig}
                    onChange={async (value: unknown) => {
                      await this.handleChange(detailFieldIndex, value)
                    }}
                    onValueSet={async (path, value) => this.handleValueSet(detailFieldIndex, path, value)}
                    onValueUnset={async (path) => this.handleValueUnset(detailFieldIndex, path)}
                    onValueListAppend={async (path, value) => this.handleValueListAppend(detailFieldIndex, path, value)}
                    onValueListSplice={async (path, index, count) =>
                      this.handleValueListSplice(detailFieldIndex, path, index, count)
                    }
                    baseRoute={this.props.baseRoute}
                    loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                    containerPath=""
                  />
                )
              }
              // 渲染详情项容器
              return hidden ? this.renderItemComponent(renderData) : <React.Fragment key={detailFieldIndex} />
            })
          })}
        </>
      )
    }
    return <></>
  }
}
