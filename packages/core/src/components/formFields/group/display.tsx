import React from 'react'
import { cloneDeep } from 'lodash'
import { display as getALLComponents, FieldConfigs } from '..'
import { GroupFieldConfig, IGroupField } from '.'
import { setValue, getValue, getBoolean, getChainPath } from '../../../util/value'
import { Display, DisplayProps } from '../common'
import { IFormItem } from '../../../steps/form'
import ConditionHelper from '../../../util/condition'
import StatementHelper from '../../../util/statement'

interface IGroupFieldState {
  didMount: boolean
}

export default class GroupField extends Display<
  GroupFieldConfig,
  IGroupField,
  { [key: string]: unknown },
  IGroupFieldState
> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: string): typeof Display => getALLComponents[type]

  formFields: Array<Display<FieldConfigs, unknown, unknown> | null> = []

  formFieldsMounted: Array<boolean> = []

  constructor(props: DisplayProps<GroupFieldConfig, { [key: string]: unknown }>) {
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
    let data: { [key: string]: unknown } = {}

    if (Array.isArray(this.props.config.fields)) {
      for (let formFieldIndex = 0; formFieldIndex < this.props.config.fields.length; formFieldIndex++) {
        const formFieldConfig = this.props.config.fields[formFieldIndex]
        if (
          !ConditionHelper(formFieldConfig.condition, {
            record: this.props.value,
            data: this.props.data,
            step: this.props.step,
            containerPath: this.props.containerPath
          })
        ) {
          continue
        }
        const formField = this.formFields[formFieldIndex]
        if (formField) {
          const value = await formField.get()
          data = setValue(data, formFieldConfig.field, value)
        }
      }
    }
    return data
  }

  handleMount = async (formFieldIndex: number) => {
    if (this.formFieldsMounted[formFieldIndex]) {
      return true
    }
    this.formFieldsMounted[formFieldIndex] = true

    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const formFieldConfig = this.props.config.fields[formFieldIndex]

        let value = getValue(this.props.value, formFieldConfig.field)
        const source = value
        if (formFieldConfig.defaultValue && value === undefined) {
          value = await formField.reset()
        }
        value = await formField.set(value)
        if (source !== value) {
          this.props.onValueSet(formFieldConfig.field, value)
        }

        await formField.didMount()
      }
    }
  }

  handleValueSet = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath =
        options && options.noPathCombination ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      await this.props.onValueSet(fullPath, value)
    }
  }

  handleValueUnset = async (formFieldIndex: number, path: string, options?: { noPathCombination?: boolean }) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath =
        options && options.noPathCombination ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      await this.props.onValueUnset(fullPath)
    }
  }

  handleValueListAppend = async (
    formFieldIndex: number,
    path: string,
    value: unknown,
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath =
        options && options.noPathCombination ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
      await this.props.onValueListAppend(fullPath, value)
    }
  }

  handleValueListSplice = async (
    formFieldIndex: number,
    path: string,
    index: number,
    count: number,
    options?: { noPathCombination?: boolean }
  ) => {
    const formFieldConfig = (this.props.config.fields || [])[formFieldIndex]
    if (formFieldConfig) {
      const fullPath =
        options && options.noPathCombination ? `${formFieldConfig.field}${path}` : `${formFieldConfig.field}.${path}`
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
  renderItemComponent: (props: IFormItem) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现FormItem组件。</>
  }

  render = () => {
    const { value, record, data, step } = this.props

    return (
      <>
        {this.renderComponent({
          children: this.state.didMount
            ? (this.props.config.fields || []).map((formFieldConfig, formFieldIndex) => {
                if (
                  !ConditionHelper(formFieldConfig.condition, {
                    record: value,
                    data: this.props.data,
                    step: this.props.step,
                    containerPath: this.props.containerPath
                  })
                ) {
                  this.formFieldsMounted[formFieldIndex] = false
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

                const FormField = this.getALLComponents(formFieldConfig.type) || Display

                // eslint-disable-next-line @typescript-eslint/prefer-as-const
                const status: 'normal' = 'normal'
                const renderData = {
                  key: formFieldIndex,
                  label: formFieldConfig.label,
                  status,
                  layout: 'horizontal' as const,
                  extra: StatementHelper(formFieldConfig.extra, {
                    record: this.props.record,
                    data: this.props.data,
                    step: this.props.step,
                    containerPath: this.props.containerPath
                  }),
                  required: getBoolean(formFieldConfig.required),
                  visitable: display,
                  fieldType: formFieldConfig.type,
                  children: (
                    <FormField
                      key={formFieldIndex}
                      ref={(formField: Display<FieldConfigs, unknown, unknown> | null) => {
                        if (formField) {
                          this.formFields[formFieldIndex] = formField
                          this.handleMount(formFieldIndex)
                        }
                      }}
                      value={getValue(value, formFieldConfig.field)}
                      record={record}
                      data={cloneDeep(data)}
                      step={step}
                      config={formFieldConfig}
                      onValueSet={async (path, valueSet, options) =>
                        this.handleValueSet(formFieldIndex, path, valueSet, options)
                      }
                      onValueUnset={async (path, options) => this.handleValueUnset(formFieldIndex, path, options)}
                      onValueListAppend={async (path, valueAppend, options) =>
                        this.handleValueListAppend(formFieldIndex, path, valueAppend, options)
                      }
                      onValueListSplice={async (path, index, count, options) =>
                        this.handleValueListSplice(formFieldIndex, path, index, count, options)
                      }
                      baseRoute={this.props.baseRoute}
                      loadDomain={async (domain: string) => this.props.loadDomain(domain)}
                      containerPath={getChainPath(this.props.containerPath, this.props.config.field)}
                    />
                  )
                }
                // 渲染表单项容器
                return hidden ? this.renderItemComponent(renderData) : <React.Fragment key={formFieldIndex} />
              })
            : []
        })}
      </>
    )
  }
}
