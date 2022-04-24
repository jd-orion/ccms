import React from 'react'
import { display as getALLComponents } from '../'
import { TabsFieldConfig } from '.'
import { Display, FieldConfigs, DisplayProps } from '../common'
import ConditionHelper from '../../../util/condition'
import { getValue, setValue, getBoolean } from '../../../util/value'
import { cloneDeep } from 'lodash'

export interface ITabsField {
  children: React.ReactNode[]
}

export interface ITabsFieldItem {
  key: string
  label: string
  children: React.ReactNode[]
}

export interface ITabsFieldItemField {
  index: number
  label: string
  required: boolean
  status: 'normal' | 'error' | 'loading'
  description?: string
  message?: string
  extra?: string
  fieldType: string
  children: React.ReactNode
}
export interface TabsFieldState<S> {
  didMount: boolean
  extra?: S
}

export default class TabsField<S> extends Display<TabsFieldConfig, ITabsField, { [key: string]: any }, TabsFieldState<S>> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof Display => getALLComponents[type]

  formFieldsList: Array<Array<Display<FieldConfigs, {}, any> | null>> = []
  formFieldsMountedList: Array<Array<boolean>> = []

  constructor(props: DisplayProps<TabsFieldConfig, any>) {
    super(props)

    this.state = {
      didMount: false
    }
  }

  didMount = async () => {
    await this.setState({
      didMount: true
    })
  }

  get = async () => {
    let data: any = {}

    for (let index = 0; index < (this.props.config.tabs || []).length; index++) {
      const tab = (this.props.config.tabs || [])[index]
      const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])

      for (let formFieldIndex = 0; formFieldIndex < fields.length; formFieldIndex++) {
        const formFieldConfig = fields[formFieldIndex]
        if (!ConditionHelper(formFieldConfig.condition, { record: getValue(this.props.value, tab.field), data: this.props.data, step: this.props.step })) {
          continue
        }
        const formField = this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]
        if (formField) {
          const value = await formField.get()
          const fullPath = tab.field === '' || formFieldConfig.field === '' ? `${tab.field}${formFieldConfig.field}` : `${tab.field}.${formFieldConfig.field}`
          data = setValue(data, fullPath, value)
        }
      }
    }

    return data
  }

  handleMount = async (index: number, formFieldIndex: number) => {
    if (!this.formFieldsMountedList[index]) {
      this.formFieldsMountedList[index] = []
    }
    if (this.formFieldsMountedList[index][formFieldIndex]) {
      return true
    }
    this.formFieldsMountedList[index][formFieldIndex] = true

    const tab = (this.props.config.tabs || [])[index]

    if (this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]) {
      const formField = this.formFieldsList[index][formFieldIndex]
      if (formField) {
        const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
        const formFieldConfig = fields[formFieldIndex]

        const fullPath = tab.field === '' || formFieldConfig.field === '' ? `${tab.field}${formFieldConfig.field}` : `${tab.field}.${formFieldConfig.field}`

        let value = getValue(this.props.value, fullPath)
        const source = value
        if ((formFieldConfig.defaultValue) && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(fullPath, value)
        }

        await formField.didMount()
      }
    }
  }

  handleChange = async (index: number, formFieldIndex: number, value: any) => {
  }

  handleValueSet = async (index: number, formFieldIndex: number, path: string, value: any, options?: { noPathCombination?: boolean }) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      const fieldPath = options && options.noPathCombination ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueSet(fullPath, value)
    }
  }

  handleValueUnset = async (index: number, formFieldIndex: number, path: string, options?: { noPathCombination?: boolean }) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      const fieldPath = options && options.noPathCombination ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueUnset(fullPath)
    }
  }

  handleValueListAppend = async (index: number, formFieldIndex: number, path: string, value: any, options?: { noPathCombination?: boolean }) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      const fieldPath = options && options.noPathCombination ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueListAppend(fullPath, value)
    }
  }

  handleValueListSplice = async (index: number, formFieldIndex: number, path: string, _index: number, count: number, options?: { noPathCombination?: boolean }) => {
    const tab = (this.props.config.tabs || [])[index]

    const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
    const formFieldConfig = fields[formFieldIndex]
    if (formFieldConfig) {
      const fieldPath = options && options.noPathCombination ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      const fullPath = tab.field === '' || fieldPath === '' ? `${tab.field}${fieldPath}` : `${tab.field}.${fieldPath}`
      await this.props.onValueListSplice(fullPath, _index, count)
    }
  }

  /**
  * 用于展示子表单组件
  * @param _props
  * @returns
  */
  renderComponent = (_props: ITabsField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件。
    </React.Fragment>
  }

  /**
  * 用于展示子表单组件中的每一个子项
  * @param props
  * @returns
  */
  renderItemComponent = (props: ITabsFieldItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemComponent方法。
    </React.Fragment>
  }

  /**
  * 用于展示子表单组件中的每一子项中的每一个子表单项组件
  * @param props
  * @returns
  */
  renderItemFieldComponent = (props: ITabsFieldItemField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormField组件的renderItemFieldComponent方法。
    </React.Fragment>
  }

  render = () => {
    const {
      value = {}
    } = this.props

    return (
      <React.Fragment>
        {
          this.renderComponent({
            children: (
              this.state.didMount
                ? (this.props.config.tabs || []).map((tab: any, index: number) => {
                  const fields = this.props.config.mode === 'same' ? (this.props.config.fields || []) : (((this.props.config.tabs || [])[index] || {}).fields || [])
                  return (
                    <React.Fragment key={index}>
                      {this.renderItemComponent({
                        key: index.toString(),
                        label: tab.label,
                        children: fields.map((formFieldConfig, formFieldIndex) => {
                          if (!ConditionHelper(formFieldConfig.condition, { record: this.props.record, data: this.props.data, step: this.props.step })) {
                            if (!this.formFieldsMountedList[index]) this.formFieldsMountedList[index] = []
                            this.formFieldsMountedList[index][formFieldIndex] = false
                            return null
                          }
                          let hidden: boolean = true
                          let display: boolean = true

                          if (formFieldConfig.type === 'hidden') {
                            hidden = true
                            display = false
                          }

                          if (formFieldConfig.display === 'none') {
                            hidden = true
                            display = false
                          }

                          const FormField = this.getALLComponents(formFieldConfig.type) || Display

                          let status: 'normal' = 'normal'
                          // 渲染表单项容器
                          if (hidden) {
                            return (
                              <div key={formFieldIndex} style={display ? { position: 'relative' } : { overflow: 'hidden', width: 0, height: 0 }}>
                                {this.renderItemFieldComponent({
                                  index: formFieldIndex,
                                  label: formFieldConfig.label,
                                  status,
                                  required: getBoolean(formFieldConfig.required),
                                  fieldType: formFieldConfig.type,
                                  children: (
                                    <FormField
                                      key={formFieldIndex}
                                      ref={(formField: Display<FieldConfigs, any, any> | null) => {
                                        if (!this.formFieldsList[index]) this.formFieldsList[index] = []
                                        this.formFieldsList[index][formFieldIndex] = formField
                                        this.handleMount(index, formFieldIndex)
                                      }}
                                      value={getValue(getValue(value, tab.field), formFieldConfig.field)}
                                      record={getValue(value, tab.field)}
                                      data={cloneDeep(this.props.data)}
                                      step={this.props.step}
                                      config={formFieldConfig}
                                      onValueSet={async (path, value, validation) => this.handleValueSet(index, formFieldIndex, path, value, validation)}
                                      onValueUnset={async (path, validation) => this.handleValueUnset(index, formFieldIndex, path, validation)}
                                      onValueListAppend={async (path, value, validation) => this.handleValueListAppend(index, formFieldIndex, path, value, validation)}
                                      onValueListSplice={async (path, _index, count, validation) => this.handleValueListSplice(index, formFieldIndex, path, _index, count, validation)}
                                      baseRoute={this.props.baseRoute}
                                      loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                                    />
                                  )
                                })}
                              </div>
                            )
                          } else {
                            return <React.Fragment key={formFieldIndex} />
                          }
                        })
                      })}
                    </React.Fragment>
                  )
                })
                : []
            )
          })
        }
      </React.Fragment>
    )
  }
}
