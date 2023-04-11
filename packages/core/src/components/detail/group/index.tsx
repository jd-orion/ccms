import React from 'react'
import { cloneDeep } from 'lodash'
import { setValue, getValue, getChainPath } from '../../../util/value'
import { DetailField, DetailFieldConfig, DetailFieldProps, IDetailField } from '../common'
import BaseComponents, { DetailBaseFieldConfigs } from '../base'
import { IDetailItem } from '../../../steps/detail'
import ConditionHelper from '../../../util/condition'
import { ColumnsConfig } from '../../../interface'

type DetailFieldConfigs = DetailBaseFieldConfigs | GroupFieldConfig

export interface GroupFieldConfig extends DetailFieldConfig {
  type: 'group'
  fields: DetailFieldConfigs[]
  childColumns?: ColumnsConfig
}

export interface IGroupField {
  columns?: ColumnsConfig
  styles?: object
  children: React.ReactNode[]
}

export default class GroupField
  extends DetailField<GroupFieldConfig, IGroupField, { [key: string]: unknown }>
  implements IDetailField<{ [key: string]: unknown }>
{
  ALLComponents = {
    ...BaseComponents,
    group: GroupField
  }

  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: string): typeof DetailField => this.ALLComponents[type]

  detailFields: Array<DetailField<DetailFieldConfigs, unknown, unknown> | null> = []

  detailFieldsMounted: Array<boolean> = []

  constructor(props: DetailFieldProps<GroupFieldConfig, { [key: string]: unknown }>) {
    super(props)

    this.state = {}
  }

  get = async () => {
    let data: { [key: string]: unknown } = {}

    if (Array.isArray(this.props.config.fields)) {
      for (let detailFieldIndex = 0; detailFieldIndex < this.props.config.fields.length; detailFieldIndex++) {
        const detailFieldConfig = this.props.config.fields[detailFieldIndex]
        if (
          !ConditionHelper(detailFieldConfig.condition, {
            record: this.props.value,
            data: this.props.data,
            step: this.props.step,
            containerPath: this.props.containerPath
          })
        ) {
          continue
        }
        const detailField = this.detailFields[detailFieldIndex]
        if (detailField) {
          const value = await detailField.get()
          data = setValue(data, detailFieldConfig.field, value)
        }
      }
    }

    return data
  }

  handleMount = async (detailFieldIndex: number) => {
    if (this.detailFieldsMounted[detailFieldIndex]) {
      return true
    }

    this.detailFieldsMounted[detailFieldIndex] = true

    if (this.detailFields[detailFieldIndex]) {
      const detailField = this.detailFields[detailFieldIndex]
      if (detailField) {
        await detailField?.didMount()
      }
    }
  }

  handleChange: (formFieldIndex: number, value: unknown) => Promise<void> = async () => {
    /* 无逻辑 */
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

      await this.props.onValueSet(fullPath, value)
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

      await this.props.onValueUnset(fullPath)
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

      await this.props.onValueListAppend(fullPath, value)
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

      await this.props.onValueListSplice(fullPath, index, count)
    }
  }

  renderComponent: (props: IGroupField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现GroupField组件。</>
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent: (props: IDetailItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现DetailItem组件。</>
  }

  render = () => {
    const { config, formLayout, value, record, data, step } = this.props

    return (
      <>
        {this.renderComponent({
          columns: config?.columns?.enable ? config.columns : undefined,
          children: (this.props.config.fields || []).map((detailFieldConfig, detailFieldIndex) => {
            if (
              !ConditionHelper(detailFieldConfig.condition, {
                record: value,
                data: this.props.data,
                step: this.props.step,
                containerPath: this.props.containerPath
              })
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

            const DetailFieldComponent = this.getALLComponents(detailFieldConfig.type) || DetailField

            const renderData = {
              key: detailFieldIndex,
              label: detailFieldConfig.label,
              columns: config.columns?.enable
                ? {
                    type: detailFieldConfig.columns?.type || config.childColumns?.type || 'span',
                    value: detailFieldConfig.columns?.value || config.childColumns?.value || 1,
                    wrap: detailFieldConfig.columns?.wrap || config.childColumns?.wrap || false,
                    gap: config.columns?.gap || 0,
                    rowGap: config.columns?.rowGap || 0
                  }
                : undefined,
              styles: detailFieldConfig.styles,
              layout: formLayout,
              visitable: display,
              fieldType: detailFieldConfig.type,
              children: (
                <DetailFieldComponent
                  checkPageAuth={this.props.checkPageAuth}
                  loadPageURL={this.props.loadPageURL}
                  loadPageFrameURL={this.props.loadPageFrameURL}
                  loadPageConfig={this.props.loadPageConfig}
                  loadPageList={this.props.loadPageList}
                  loadCustomSource={this.props.loadCustomSource}
                  handlePageRedirect={this.props.handlePageRedirect}
                  onUnmount={this.props.onUnmount}
                  key={detailFieldIndex}
                  ref={(detailField: DetailField<DetailFieldConfigs, unknown, unknown> | null) => {
                    if (detailFieldIndex !== null) {
                      this.detailFields[detailFieldIndex] = detailField
                      this.handleMount(detailFieldIndex)
                    }
                  }}
                  formLayout={formLayout}
                  value={getValue(value, detailFieldConfig.field)}
                  record={record}
                  data={cloneDeep(data)}
                  step={step}
                  config={detailFieldConfig}
                  detail={this.props.detail}
                  onChange={async (valueChange: unknown) => {
                    await this.handleChange(detailFieldIndex, valueChange)
                  }}
                  onValueSet={async (path, valueSet, options) =>
                    this.handleValueSet(detailFieldIndex, path, valueSet, options)
                  }
                  onValueUnset={async (path, options) => this.handleValueUnset(detailFieldIndex, path, options)}
                  onValueListAppend={async (path, valueAppend, options) =>
                    this.handleValueListAppend(detailFieldIndex, path, valueAppend, options)
                  }
                  onValueListSplice={async (path, index, count, options) =>
                    this.handleValueListSplice(detailFieldIndex, path, index, count, options)
                  }
                  baseRoute={this.props.baseRoute}
                  loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                  containerPath={getChainPath(this.props.containerPath, config.field)}
                />
              )
            }
            // 渲染表单项容器
            return hidden ? this.renderItemComponent(renderData) : <React.Fragment key={detailFieldIndex} />
          })
        })}
      </>
    )
  }
}
