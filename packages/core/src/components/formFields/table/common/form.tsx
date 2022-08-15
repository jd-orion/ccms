import marked from 'marked'
import React from 'react'
import getALLComponents, { FieldConfigs } from '../..'
import { ColumnsConfig } from '../../../../interface'
import { CCMSConfig, PageListItem } from '../../../../main'
import { IFormItem } from '../../../../steps/form'
import { push, set, setValue, sort, splice } from '../../../../util/produce'
import StatementHelper from '../../../../util/statement'
import { getValue, updateCommonPrefixItem } from '../../../../util/value'
import { Field, FieldError } from '../../common'
import FormContainer from '../../container'

export interface TableFieldFormProps {
  form: React.ReactNode
  formLayout: 'horizontal' | 'vertical' | 'inline'
  config: { fields: FieldConfigs[]; childColumns?: ColumnsConfig }
  data: { [field: string]: unknown }
  datas: {
    record: { [field: string]: unknown }
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
  formValue: { [key: string]: unknown }
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

  FormContainer = FormContainer

  formFieldsMounted: Array<boolean> = []

  formFields: Array<Field<FieldConfigs, unknown, unknown> | null> = []

  constructor(props) {
    super(props)

    this.state = {
      visible: false,
      formValue: {},
      formData: []
    }
  }

  handleSubLabelContent(config) {
    const { datas } = this.props
    const { formValue } = this.state
    if (config?.subLabelConfig?.enable) {
      const content = StatementHelper(
        {
          statement: config.subLabelConfig?.content?.statement || '',
          params: config.subLabelConfig?.content?.params || []
        },
        { ...datas, record: formValue }
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
        const { formValue } = this.state
        const formFieldConfig = (config.fields || [])[formFieldIndex]
        let value = getValue(formValue, formFieldConfig.field)
        const source = value
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.setState({
            formValue: set(formValue, formFieldConfig.field, value)
          })
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

  handleValueSet = async (path: string, value: unknown) => {
    this.setState((prevState) => ({
      formValue: setValue(prevState.formValue, path, value)
    }))
  }

  handleValueUnset = async (path: string) => {
    this.setState((prevState) => ({
      formValue: set(prevState.formValue, path)
    }))
  }

  handleValueListAppend = async (path: string, value: unknown) => {
    this.setState((prevState) => ({
      formValue: push(prevState.formValue, path, value)
    }))
  }

  handleValueListSplice = async (path: string, index: number, count: number) => {
    this.setState((prevState) => ({
      formValue: splice(prevState.formValue, path, index, count)
    }))
  }

  handleValueListSort = async (path: string, index: number, sortType: 'up' | 'down' | 'top' | 'bottom' | number) => {
    this.setState((prevState) => ({
      formValue: sort(prevState.formValue, path, index, sortType)
    }))
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
      loadDomain
    } = this.props

    const { visible, formValue } = this.state

    return (
      <>
        {children(() => {
          this.setState({
            visible: true,
            formValue: data
          })
        })}
        {visible &&
          this.renderModal({
            title: 'title',
            content: (
              <this.FormContainer
                fieldsConfig={config.fields || []}
                value={formValue}
                form={form}
                formLayout={formLayout}
                datas={datas}
                onValueSet={async (path, valueSet) => this.handleValueSet(path, valueSet)}
                onValueUnset={async (path) => this.handleValueUnset(path)}
                onValueListAppend={async (path, valueAppend) => this.handleValueListAppend(path, valueAppend)}
                onValueListSplice={async (path, index, count) => this.handleValueListSplice(path, index, count)}
                onValueListSort={async (path, index, sortType) => this.handleValueListSort(path, index, sortType)}
                onReportFields={async (field: string) => this.handleReportFields(field)}
                checkPageAuth={async (pageID) => checkPageAuth(pageID)}
                loadPageURL={async (pageID) => loadPageURL(pageID)}
                loadPageFrameURL={async (pageID) => loadPageFrameURL(pageID)}
                loadPageConfig={async (pageID) => loadPageConfig(pageID)}
                loadPageList={async () => loadPageList()}
                baseRoute={baseRoute}
                loadDomain={async (domain: string) => loadDomain(domain)}
              />
            ),
            onOk: () => {
              const { onSubmit } = this.props
              onSubmit(formValue)
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
