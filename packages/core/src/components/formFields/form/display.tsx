import React from 'react'
import { cloneDeep } from 'lodash'
import { display as getALLComponents } from '..'
import { FormFieldConfig } from '.'
import { Display, FieldConfigs, DisplayProps } from '../common'
import { getChainPath, getValue, setValue } from '../../../util/value'
import ConditionHelper from '../../../util/condition'

export interface IFormField {
  canCollapse?: boolean
  children: React.ReactNode[]
}

export interface IFormFieldItem {
  index: number
  title: string
  canCollapse?: boolean
  children: React.ReactNode[]
}

export interface IFormFieldItemField {
  index: number
  label: string
  fieldType: string
  children: React.ReactNode
}

interface FormState {
  didMount: boolean
  showItem: boolean
  showIndex: number
}

export default class FormField extends Display<FormFieldConfig, IFormField, { [key: string]: unknown }[], FormState> {
  getALLComponents = (type: string): typeof Display => getALLComponents[type]

  formFieldsList: Array<Array<Display<FieldConfigs, unknown, unknown> | null>> = []

  formFieldsMountedList: Array<Array<boolean>> = []

  constructor(props: DisplayProps<FormFieldConfig, { [key: string]: unknown }[]>) {
    super(props)

    this.state = {
      didMount: false,
      showItem: false,
      showIndex: 0
    }
  }

  didMount = async () => {
    await this.setState({
      didMount: true
    })
  }

  set = async (value: unknown) => {
    const _value = value
    if (this.props.config.unstringify && this.props.config.unstringify.length > 0 && Array.isArray(_value)) {
      for (let index = 0; index < _value.length; index++) {
        if (_value[index]) {
          for (const field of this.props.config.unstringify) {
            const info = getValue(_value[index], field)
            try {
              _value[index] = setValue(_value[index], field, JSON.parse(info))
            } catch (e) {
              /* 无逻辑 */
            }
          }
        }
      }
    }

    return _value
  }

  get = async () => {
    const data: { [key: string]: unknown }[] = []

    for (let index = 0; index < this.formFieldsList.length; index++) {
      if (this.formFieldsList[index]) {
        let item: { [key: string]: unknown } = {}

        if (Array.isArray(this.props.config.fields)) {
          for (let formFieldIndex = 0; formFieldIndex < this.props.config.fields.length; formFieldIndex++) {
            const formFieldConfig = this.props.config.fields[formFieldIndex]
            if (
              !ConditionHelper(formFieldConfig.condition, {
                record: this.props.value[index],
                data: this.props.data,
                step: this.props.step,
                containerPath: this.props.containerPath
              })
            ) {
              continue
            }
            const formField = this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]
            if (formField) {
              const value = await formField.get()
              item = setValue(item, formFieldConfig.field, value)
            }
          }
        }

        if (this.props.config.stringify) {
          for (const field of this.props.config.stringify) {
            const info = getValue(item, field)
            item = setValue(item, field, JSON.stringify(info))
          }
        }

        data[index] = item
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

    if (this.formFieldsList[index] && this.formFieldsList[index][formFieldIndex]) {
      const formField = this.formFieldsList[index][formFieldIndex]
      if (formField) {
        const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]

        let value = getValue(
          this.props.value[index] === undefined ? {} : this.props.value[index],
          formFieldConfig.field
        )
        const source = value
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(`[${index}]${formFieldConfig.field}`, value)
        }

        await formField.didMount()
      }
    }
  }

  handleValueSet = async (
    index: number,
    formFieldIndex: number,
    path: string,
    value: unknown,
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      await this.props.onValueSet(`[${index}]${fullPath}`, value)
    }
  }

  handleValueUnset = async (
    index: number,
    formFieldIndex: number,
    path: string,
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      await this.props.onValueUnset(`[${index}]${fullPath}`)
    }
  }

  handleValueListAppend = async (
    index: number,
    formFieldIndex: number,
    path: string,
    value: unknown,
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      await this.props.onValueListAppend(`[${index}]${fullPath}`, value)
    }
  }

  handleValueListSplice = async (
    index: number,
    formFieldIndex: number,
    path: string,
    _index: number,
    count: number,
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      let fullPath = ''
      if (options && options.noPathCombination) {
        fullPath = path
      } else if (formFieldConfig.field === '' || path === '') {
        fullPath = `${formFieldConfig.field}${path}`
      } else {
        fullPath = `${formFieldConfig.field}.${path}`
      }

      await this.props.onValueListSplice(`[${index}]${fullPath}`, _index, count)
    }
  }

  /**
   * 用于展示子表单组件中的每一子项中的每一个子表单项组件
   * @param props
   * @returns
   */
  renderItemFieldComponent: (props: IFormFieldItemField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormField组件的renderItemFieldComponent方法。</>
  }

  /**
   * 用于展示子表单组件中的每一个子项
   * @param props
   * @returns
   */
  renderItemComponent: (props: IFormFieldItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormField组件的renderItemComponent方法。</>
  }

  /**
   * 用于展示子表单组件
   * @param _props
   * @returns
   */
  renderComponent: (props: IFormField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormField组件。</>
  }

  render = () => {
    const {
      value = [],
      data,
      step,
      config: { fields, primaryField, canCollapse }
    } = this.props

    return (
      <>
        {this.renderComponent({
          canCollapse,
          children: this.state.didMount
            ? (Array.isArray(value) ? value : []).map((itemValue: { [key: string]: unknown }, index: number) => {
                return (
                  <React.Fragment key={index}>
                    {this.renderItemComponent({
                      index,
                      title:
                        primaryField !== undefined
                          ? getValue(itemValue, primaryField, '').toString()
                          : index.toString(),
                      canCollapse,
                      children: (fields || []).map((formFieldConfig, fieldIndex) => {
                        if (
                          !ConditionHelper(formFieldConfig.condition, {
                            record: itemValue,
                            data: this.props.data,
                            step: this.props.step,
                            containerPath: this.props.containerPath
                          })
                        ) {
                          if (!this.formFieldsMountedList[index]) this.formFieldsMountedList[index] = []
                          this.formFieldsMountedList[index][fieldIndex] = false
                          return null
                        }
                        const CurrentFormField = this.getALLComponents(formFieldConfig.type) || Display

                        // 渲染表单项容器
                        return (
                          <div key={fieldIndex}>
                            {this.renderItemFieldComponent({
                              index: fieldIndex,
                              label: formFieldConfig.label,
                              fieldType: formFieldConfig.type,
                              children: (
                                <CurrentFormField
                                  ref={(fieldRef: Display<FieldConfigs, unknown, unknown> | null) => {
                                    if (fieldRef) {
                                      if (!this.formFieldsList[index]) this.formFieldsList[index] = []
                                      this.formFieldsList[index][fieldIndex] = fieldRef
                                      this.handleMount(index, fieldIndex)
                                    }
                                  }}
                                  value={getValue(value[index], formFieldConfig.field)}
                                  record={value[index]}
                                  data={cloneDeep(data)}
                                  step={step}
                                  config={formFieldConfig}
                                  onValueSet={async (path, valueSet, options) =>
                                    this.handleValueSet(index, fieldIndex, path, valueSet, options)
                                  }
                                  onValueUnset={async (path, options) =>
                                    this.handleValueUnset(index, fieldIndex, path, options)
                                  }
                                  onValueListAppend={async (path, valueAppend, options) =>
                                    this.handleValueListAppend(index, fieldIndex, path, valueAppend, options)
                                  }
                                  onValueListSplice={async (path, _index, count, options) =>
                                    this.handleValueListSplice(index, fieldIndex, path, _index, count, options)
                                  }
                                  baseRoute={this.props.baseRoute}
                                  loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                                  containerPath={getChainPath(this.props.containerPath, this.props.config.field, index)}
                                />
                              )
                            })}
                          </div>
                        )
                      })
                    })}
                  </React.Fragment>
                )
              })
            : []
        })}
      </>
    )
  }
}
