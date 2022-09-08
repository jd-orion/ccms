import React from 'react'
import marked from 'marked'
import { CCMSConfig, PageListItem } from '../../main'
import { Field, FieldError } from './common'
import getALLComponents, { FieldConfigs } from '.'
import { IFormItem } from '../../steps/form'
import ConditionHelper from '../../util/condition'
import { set } from '../../util/produce'
import StatementHelper from '../../util/statement'
import { getChainPath, getValue, updateCommonPrefixItem } from '../../util/value'

export interface FormContainerProps {
  fieldsConfig: FieldConfigs[]
  value: unknown
  form: React.ReactNode
  formLayout: 'horizontal' | 'vertical' | 'inline'
  datas: {
    record: { [field: string]: unknown }
    data: object[]
    step: { [field: string]: unknown }
    containerPath: string
  }

  onValueSet: (
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  // 事件：置空值
  onValueUnset: (
    path: string,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  // 事件：修改值 - 列表 - 追加
  onValueListAppend: (
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  // 事件：修改值 - 列表 - 删除
  onValueListSplice: (
    path: string,
    index: number,
    count: number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  // 事件：修改值 - 列表 - 修改顺序
  onValueListSort: (
    path: string,
    index: number,
    sortType: 'up' | 'down' | 'top' | 'bottom' | number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => Promise<void>
  onReportFields?: (field: string) => Promise<void> // 向父组件上报依赖字段  1.3.0新增

  checkPageAuth: (pageID: unknown) => Promise<boolean>
  loadPageURL: (pageID: unknown) => Promise<string>
  loadPageFrameURL: (pageID: unknown) => Promise<string>
  loadPageConfig: (pageID: unknown) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  baseRoute: string
  loadDomain: (domain: string) => Promise<string>
}

interface FormContainerState {
  fieldsData: { status: 'normal' | 'error' | 'loading'; message?: string; name?: string }[]
}

export interface IFormContainer {
  children: React.ReactNode[]
}

export default class FormContainer extends React.Component<FormContainerProps, FormContainerState> {
  dependentFields: string[] = []

  fieldsInstance: Array<Field<FieldConfigs, unknown, unknown> | null> = []

  fieldsMounted: Array<boolean> = []

  constructor(props) {
    super(props)

    this.state = {
      fieldsData: []
    }
  }

  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  handleValidation = async (fieldIndex: number, validation: true | FieldError[]) => {
    const { fieldsData } = this.state
    await this.setState({
      fieldsData: set(
        fieldsData,
        `[${fieldIndex}]`,
        validation === true ? { status: 'normal' } : { status: 'error', message: validation[0].message }
      )
    })
  }

  handleFullPath = async (fieldIndex: number, path: string, options?: { noPathCombination?: boolean }) => {
    const { fieldsConfig } = this.props
    const fieldConfig = fieldsConfig[fieldIndex]
    if (fieldConfig) {
      if (options && options.noPathCombination) {
        return path
      }
      const fullPathNode: string[] = []
      if (fieldConfig.field) fullPathNode.push(fieldConfig.field)
      if (path) fullPathNode.push(path)
      return fullPathNode.join('.')
    }
    return ''
  }

  handleValueSet = async (
    fieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { onValueSet } = this.props
    const fullPath = await this.handleFullPath(fieldIndex, path, options)
    await onValueSet(fullPath, value, true)
    await this.handleValidation(fieldIndex, validation)
  }

  handleValueUnset = async (
    fieldIndex: number,
    path: string,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { onValueUnset } = this.props
    const fullPath = await this.handleFullPath(fieldIndex, path, options)
    await onValueUnset(fullPath, true)
    await this.handleValidation(fieldIndex, validation)
  }

  handleValueListAppend = async (
    fieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { onValueListAppend } = this.props
    const fullPath = await this.handleFullPath(fieldIndex, path, options)
    await onValueListAppend(fullPath, value, true)
    await this.handleValidation(fieldIndex, validation)
  }

  handleValueListSplice = async (
    fieldIndex: number,
    path: string,
    index: number,
    count: number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { onValueListSplice } = this.props
    const fullPath = await this.handleFullPath(fieldIndex, path, options)
    await onValueListSplice(fullPath, index, count, true)
    await this.handleValidation(fieldIndex, validation)
  }

  handleValueListSort = async (
    fieldIndex: number,
    path: string,
    index: number,
    sortType: 'up' | 'down' | 'top' | 'bottom' | number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { onValueListSort } = this.props
    const fullPath = await this.handleFullPath(fieldIndex, path, options)
    await onValueListSort(fullPath, index, sortType, true)
    await this.handleValidation(fieldIndex, validation)
  }

  handleReportFields = async (field: string) => {
    const { onReportFields } = this.props
    const update: string[] | boolean = updateCommonPrefixItem(this.dependentFields, field)
    if (typeof update === 'boolean') return
    this.dependentFields = update
    onReportFields && (await onReportFields(field))
  }

  renderComponent: (props: IFormContainer) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FieldContainer组件。</>
  }

  renderItemComponent: (props: IFormItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FieldContainer组件。</>
  }

  render() {
    const {
      fieldsConfig,
      datas,
      formLayout,
      value,
      onValueSet,
      form,
      checkPageAuth,
      loadPageURL,
      loadPageFrameURL,
      loadPageConfig,
      loadPageList,
      baseRoute,
      loadDomain
    } = this.props
    const { fieldsData } = this.state

    return (
      <>
        {this.renderComponent({
          children: (fieldsConfig || []).map((fieldConfig, fieldIndex) => {
            if (!ConditionHelper(fieldConfig.condition, datas)) {
              this.fieldsMounted = set(this.fieldsMounted, `[${fieldIndex}]`, false) as boolean[]
              this.fieldsInstance && (this.fieldsInstance[fieldIndex] = null)
              return null
            }

            const renderItemConfig: IFormItem = {
              key: fieldIndex,
              label: fieldConfig.label,
              status: 'normal',
              required: fieldConfig.required || false,
              layout: formLayout,
              visitable: true,
              fieldType: fieldConfig.type,
              children: undefined
            }

            if (fieldConfig.subLabelConfig && fieldConfig.subLabelConfig.enable) {
              const { subLabelConfig } = fieldConfig
              const subLabelContent = StatementHelper(subLabelConfig.content, datas).trim()
              switch (subLabelConfig.mode) {
                case 'markdown':
                  // eslint-disable-next-line react/no-danger
                  renderItemConfig.subLabel = <div dangerouslySetInnerHTML={{ __html: marked(subLabelContent) }} />
                  break
                case 'html':
                  renderItemConfig.subLabel = (
                    // eslint-disable-next-line react/no-danger
                    <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: subLabelContent }} />
                  )
                  break
                default:
                  renderItemConfig.subLabel = <div style={{ whiteSpace: 'pre-wrap' }}>{subLabelContent}</div>
              }
            }

            if (fieldConfig.extra) {
              renderItemConfig.extra = StatementHelper(fieldConfig.extra, datas)
            }

            if (fieldConfig.columns && fieldConfig.columns.enable) {
              // TODO
            }

            if (fieldConfig.type === 'hidden' || fieldConfig.display === 'none') {
              renderItemConfig.visitable = false
            }

            if (fieldsData[fieldIndex]) {
              const fieldData = fieldsData[fieldIndex]

              if (fieldData.status !== 'normal') {
                if (!['group', 'import_subform', 'object', 'tabs', 'form'].includes(fieldConfig.type)) {
                  renderItemConfig.status = fieldData.status
                }
              }

              if (fieldData.message) {
                renderItemConfig.message = fieldData.message
              }
            }

            const FormField = this.getALLComponents(fieldConfig.type) || Field

            renderItemConfig.children = (
              <React.Suspense fallback={<>Loading</>}>
                <FormField
                  key={fieldIndex}
                  ref={async (fieldInstance: Field<FieldConfigs, unknown, unknown> | null) => {
                    if (fieldInstance) {
                      this.fieldsInstance = set(this.fieldsInstance, `[${fieldIndex}]`, fieldInstance)

                      if (this.fieldsMounted[fieldIndex]) return true
                      this.fieldsMounted = set(this.fieldsMounted, `[${fieldIndex}]`, true)

                      const currentFieldConfig = fieldsConfig[fieldIndex]
                      if (currentFieldConfig) {
                        const sourceValue = getValue(value, currentFieldConfig.field)
                        const targetValue = await fieldInstance.set(
                          currentFieldConfig.defaultValue && sourceValue === undefined
                            ? await fieldInstance.reset()
                            : sourceValue
                        )
                        if (sourceValue !== targetValue) {
                          onValueSet(currentFieldConfig.field, targetValue, true)
                        }
                        if (undefined !== targetValue) {
                          this.handleValidation(fieldIndex, await fieldInstance.validate(targetValue))
                        }
                        await fieldInstance.didMount()
                      }
                    }
                  }}
                  form={form}
                  formLayout={formLayout}
                  value={getValue(value, fieldConfig.field)}
                  record={datas.record}
                  data={datas.data}
                  step={datas.step}
                  containerPath={getChainPath(datas.containerPath, fieldConfig.field)}
                  config={fieldConfig}
                  onChange={async () => {
                    /* 无逻辑 */
                  }}
                  onValueSet={async (path, valueSet, validation, options) =>
                    this.handleValueSet(fieldIndex, path, valueSet, validation, options)
                  }
                  onValueUnset={async (path, validation, options) =>
                    this.handleValueUnset(fieldIndex, path, validation, options)
                  }
                  onValueListAppend={async (path, valueAppend, validation, options) =>
                    this.handleValueListAppend(fieldIndex, path, valueAppend, validation, options)
                  }
                  onValueListSplice={async (path, index, count, validation, options) =>
                    this.handleValueListSplice(fieldIndex, path, index, count, validation, options)
                  }
                  onValueListSort={async (path, index, sortType, validation, options) =>
                    this.handleValueListSort(fieldIndex, path, index, sortType, validation, options)
                  }
                  checkPageAuth={async (pageID) => checkPageAuth(pageID)}
                  loadPageURL={async (pageID) => loadPageURL(pageID)}
                  loadPageFrameURL={async (pageID) => loadPageFrameURL(pageID)}
                  loadPageConfig={async (pageID) => loadPageConfig(pageID)}
                  loadPageList={async () => loadPageList()}
                  baseRoute={baseRoute}
                  loadDomain={async (domain: string) => loadDomain(domain)}
                  onReportFields={async (field: string) => this.handleReportFields(field)}
                />
              </React.Suspense>
            )

            // 渲染表单项容器
            return this.renderItemComponent(renderItemConfig)
          })
        })}
      </>
    )
  }
}
