import marked from 'marked'
import React from 'react'
import getALLComponents, { FieldConfigs } from '../..'
import { ColumnsConfig } from '../../../../interface'
import { CCMSConfig, PageListItem } from '../../../../main'
import { IFormItem } from '../../../../steps/form'
import ConditionHelper from '../../../../util/condition'
import { push, set, sort, splice } from '../../../../util/produce'
import StatementHelper from '../../../../util/statement'
import { getBoolean, getValue, updateCommonPrefixItem } from '../../../../util/value'
import { Field, FieldError } from '../../common'

export interface TableFieldFormProps {
  form: React.ReactNode
  formLayout: 'horizontal' | 'vertical' | 'inline'
  config: { fields: FieldConfigs[]; childColumns?: ColumnsConfig }
  data: { [field: string]: unknown }
  datas: {
    record?: object | undefined
    data: object[]
    step: {
      [field: string]: unknown
    }
    containerPath: string
  }
  checkPageAuth: (pageID: unknown) => Promise<boolean>
  loadPageURL: (pageID: unknown) => Promise<string>
  loadPageFrameURL: (pageID: unknown) => Promise<string>
  loadPageConfig: (pageID: unknown) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  baseRoute: string
  loadDomain: (domain: string) => Promise<string>
  containerPath: string // 容器组件所在路径以字段拼接展示  1.3.0新增
  onReportFields?: (field: string) => Promise<void> // 向父组件上报依赖字段  1.3.0新增

  children: (onClick: () => void) => JSX.Element | JSX.Element[]
  onSubmit: (value: { [key: string]: unknown }) => void
}

interface TableFieldFormState {
  visible: boolean
  formData: { status: 'normal' | 'error' | 'loading'; message?: string; name: string }[]
}

export interface ITableFieldFormModal {
  title: string
  content: React.ReactNode
  onOk: () => void
  onClose: () => void
}

export default class TableFieldForm extends React.Component<TableFieldFormProps, TableFieldFormState> {
  dependentFields: string[] = []

  formFieldsMounted: Array<boolean> = []

  formFields: Array<Field<FieldConfigs, unknown, unknown> | null> = []

  formValue: { [key: string]: unknown } = {}

  formData: { status: 'normal' | 'error' | 'loading'; message?: string; name: string }[] = []

  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      formData: []
    }
  }

  handleSubLabelContent(config) {
    const { datas } = this.props
    if (config?.subLabelConfig?.enable) {
      const content = StatementHelper(
        {
          statement: config.subLabelConfig?.content?.statement || '',
          params: config.subLabelConfig?.content?.params || []
        },
        { ...datas, record: this.formValue }
      ).replace(/(^\s*)|(\s*$)/g, '')
      const mode = config.subLabelConfig?.mode
      switch (mode) {
        case 'markdown':
          // eslint-disable-next-line react/no-danger
          return <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
        case 'html':
          // eslint-disable-next-line react/no-danger
          return <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: content }} />
        default:
          return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
      }
    }
    return undefined
  }

  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  handleReportFields: (field: string) => void = async (field) => {
    const { onReportFields } = this.props
    const update: string[] | boolean = updateCommonPrefixItem(this.dependentFields, field)
    if (typeof update === 'boolean') return
    this.dependentFields = update
    onReportFields && (await onReportFields(field))
  }

  handleMount = async (formFieldIndex: number) => {
    if (this.formFieldsMounted[formFieldIndex]) {
      return true
    }
    this.formFieldsMounted = set(this.formFieldsMounted, `[${formFieldIndex}]`, true)

    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const { config } = this.props
        const formFieldConfig = (config.fields || [])[formFieldIndex]
        let value = getValue(this.formValue, formFieldConfig.field)
        const source = value
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          set(this.formValue, formFieldConfig.field, value)
        }

        if (value !== undefined) {
          const validation = await formField.validate(value)
          this.handleValueCallback(formFieldIndex, validation)
        }
        await formField.didMount()
      }
    }
  }

  handleValueCallback = async (formFieldIndex: number, validation: true | FieldError[]) => {
    let { formData } = this.state
    if (validation === true) {
      formData = set(formData, `[${formFieldIndex}]`, { status: 'normal' })
    } else {
      formData = set(formData, `[${formFieldIndex}]`, { status: 'error', message: validation[0].message })
    }

    await this.setState({
      formData
    })
  }

  handleValueSet = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { config } = this.props
    const formFieldConfig = (config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      this.formValue = set(this.formValue, fullPath, value)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueUnset = async (
    formFieldIndex: number,
    path: string,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { config } = this.props
    const formFieldConfig = (config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      this.formValue = set(this.formValue, fullPath)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueListAppend = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { config } = this.props
    const formFieldConfig = (config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      this.formValue = push(this.formValue, fullPath, value)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueListSplice = async (
    formFieldIndex: number,
    path: string,
    index: number,
    count: number,
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { config } = this.props
    const formFieldConfig = (config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      this.formValue = splice(this.formValue, fullPath, index, count)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  handleValueListSort = async (
    formFieldIndex: number,
    path: string,
    index: number,
    sortType: 'up' | 'down' | 'top' | 'bottom',
    validation: true | FieldError[],
    options?: { noPathCombination?: boolean }
  ) => {
    const { config } = this.props
    const formFieldConfig = (config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      this.formValue = sort(this.formValue, fullPath, index, sortType)
      this.handleValueCallback(formFieldIndex, validation)
    }
  }

  renderModal: (props: ITableFieldFormModal) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现OpertionHelper组件。</>
  }

  renderItemComponent: (props: IFormItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormItem组件。</>
  }

  render() {
    const {
      form,
      formLayout,
      config,
      data,
      datas,
      children,
      checkPageAuth,
      loadPageURL,
      loadPageFrameURL,
      loadPageConfig,
      loadPageList,
      baseRoute,
      loadDomain,
      containerPath
    } = this.props

    const { visible, formData } = this.state

    return (
      <>
        {children(() => {
          this.formValue = data
          this.setState({ visible: true })
        })}
        {visible &&
          this.renderModal({
            title: 'title',
            content: (config.fields || []).map((formFieldConfig, formFieldIndex) => {
              if (!ConditionHelper(formFieldConfig.condition, { ...datas, record: this.formValue })) {
                this.formFieldsMounted = set(this.formFieldsMounted, `[${formFieldIndex}]`, false)
                this.formFields && (this.formFields[formFieldIndex] = null)
                return null
              }
              let hidden = true
              let display = true

              if (formFieldConfig.type === 'hidden') {
                hidden = true
                display = false
              }

              if (formFieldConfig.display === 'none') {
                hidden = true
                display = false
              }

              // 隐藏项同时打标录入数据并清空填写项
              if (!hidden) {
                this.formData = set(this.formData, `[${formFieldIndex}]`, {
                  status: 'normal',
                  name: formFieldConfig.label
                })
              }

              const FormField = this.getALLComponents(formFieldConfig.type) || Field

              let status = formData[formFieldIndex]?.status || 'normal'

              if (['group', 'import_subform', 'object', 'tabs', 'form'].some((type) => type === formFieldConfig.type)) {
                status = 'normal'
              }

              const renderData = {
                key: formFieldIndex,
                label: formFieldConfig.label,
                subLabel: this.handleSubLabelContent(formFieldConfig),
                styles: formFieldConfig.styles,
                status,
                message: (formData[formFieldIndex] || {}).message || '',
                extra: StatementHelper(formFieldConfig.extra, { ...datas, record: this.formValue }),
                required: getBoolean(formFieldConfig.required),
                layout: formLayout,
                visitable: display,
                fieldType: formFieldConfig.type,
                children: (
                  <FormField
                    key={formFieldIndex}
                    ref={(formField: Field<FieldConfigs, unknown, unknown> | null) => {
                      if (formField) {
                        this.formFields = set(this.formFields, `[${formFieldIndex}]`, formField)
                        this.handleMount(formFieldIndex)
                      }
                    }}
                    form={form}
                    formLayout={formLayout}
                    value={getValue(this.formValue, formFieldConfig.field)}
                    record={this.formValue}
                    data={datas.data}
                    step={datas.step}
                    config={formFieldConfig}
                    onChange={async () => {
                      /* 无逻辑 */
                    }}
                    onValueSet={async (path, valueSet, validation, options) =>
                      this.handleValueSet(formFieldIndex, path, valueSet, validation, options)
                    }
                    onValueUnset={async (path, validation, options) =>
                      this.handleValueUnset(formFieldIndex, path, validation, options)
                    }
                    onValueListAppend={async (path, valueAppend, validation, options) =>
                      this.handleValueListAppend(formFieldIndex, path, valueAppend, validation, options)
                    }
                    onValueListSplice={async (path, index, count, validation, options) =>
                      this.handleValueListSplice(formFieldIndex, path, index, count, validation, options)
                    }
                    onValueListSort={async (path, index, sortType, validation, options) =>
                      this.handleValueListSort(formFieldIndex, path, index, sortType, validation, options)
                    }
                    checkPageAuth={async (pageID) => checkPageAuth(pageID)}
                    loadPageURL={async (pageID) => loadPageURL(pageID)}
                    loadPageFrameURL={async (pageID) => loadPageFrameURL(pageID)}
                    loadPageConfig={async (pageID) => loadPageConfig(pageID)}
                    loadPageList={async () => loadPageList()}
                    baseRoute={baseRoute}
                    loadDomain={async (domain: string) => loadDomain(domain)}
                    containerPath={containerPath}
                    onReportFields={async (field: string) => this.handleReportFields(field)}
                  />
                )
              }
              // 渲染表单项容器
              return hidden ? this.renderItemComponent(renderData) : <React.Fragment key={formFieldIndex} />
            }),
            onOk: () => {
              const { onSubmit } = this.props
              onSubmit(this.formValue)
              this.setState({
                visible: false
              })
            },
            onClose: () => {
              this.setState({
                visible: false
              })
            }
          })}
      </>
    )
  }
}
