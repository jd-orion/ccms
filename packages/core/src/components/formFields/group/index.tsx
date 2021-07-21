import React from 'react'
import { getParamText, getValue, setValue } from '../../../util/value'
import { Field, FieldConfig, FieldError, FieldProps, IField } from '../common'
import getALLComponents, { FieldConfigs } from '../'
import { IFormItem } from '../../../steps/form'
import * as _ from 'lodash'

export interface GroupFieldConfig extends FieldConfig {
  type: 'group'
  fields: FieldConfig[]
}

export interface IGroupField {
  children: React.ReactNode[]
}

interface IGroupFieldState {
  formData: { [field: string]: { value: any, status: 'normal' | 'error' | 'loading', message?: string } }
}

export default class GroupField extends Field<GroupFieldConfig, IGroupField, any, IGroupFieldState> implements IField<string> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any) => getALLComponents[type]

  // 用于请求防频的判断条件
  requestConfig: string = ''
  value: string = ''


  formFields: Array<Field<FieldConfigs, {}, any> | null> = []
  formFieldsMounted: Array<boolean> = []

  constructor (props: FieldProps<GroupFieldConfig, any>) {
    super(props)

    this.state = {
      formData: {}
    }
  }

  handleFormFieldMount = async (formFieldIndex: number) => {
    if (this.formFieldsMounted[formFieldIndex]) {
      return true
    }

    this.formFieldsMounted[formFieldIndex] = true

    const formData = _.cloneDeep(this.state.formData)

    if (this.formFields[formFieldIndex]) {
      const formField = this.formFields[formFieldIndex]
      if (formField) {
        const formFieldConfig = this.props.config.fields[formFieldIndex]
        let value = getValue(formData, formFieldConfig.field, {}).value
        if (formFieldConfig.default) {
          value = await formField.reset()
        }
        const validation = await formField.validate(value)
        if (validation === true) {
          setValue(formData, formFieldConfig.field, { value, status: 'normal' })
        } else {
          setValue(formData, formFieldConfig.field, { value, status: 'error', message: validation[0].message })
        }
      }
    }
    await this.setState({
      formData
    })
  }

  handleChange = async (formFieldIndex: number, value: any) => {
    const {
      onChange
    } = this.props

    const formField = this.formFields[formFieldIndex]
    const formFieldConfig = this.props.config.fields[formFieldIndex]

    const formData = _.cloneDeep(this.state.formData)
    const _value = _.cloneDeep(this.props.value)

    if (formField && formFieldConfig.field) {
      const validation = await formField.validate(value)
      setValue(_value, formFieldConfig.field, value)
      if (validation === true) {
        setValue(formData, formFieldConfig.field, { status: 'normal' })
      } else {
        setValue(formData, formFieldConfig.field, { status: 'error', message: validation[0].message })
      }

      await this.setState({
        formData
      })
      if (onChange) {
        onChange(_value)
      }
    }
  }

  validate = async (value: string): Promise<true | FieldError[]> => {
    return true
  }

  renderComponent = (props: IGroupField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现GroupField组件。
    </React.Fragment>
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
   renderItemComponent = (props: IFormItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现FormItem组件。
    </React.Fragment>
  }

  render = () => {
    const {
      config,
      formLayout,
      value,
      record,
      data,
      step
    } = this.props

    return (
      <React.Fragment>
        {this.renderComponent({
          children: this.props.config.fields.map((formFieldConfig, formFieldIndex) => {
            let hidden: boolean = true
            let display: boolean = true
            if (formFieldConfig.condition && formFieldConfig.condition.statement) {
              let statement = formFieldConfig.condition.statement
              if (formFieldConfig.condition.params && Array.isArray(formFieldConfig.condition.params)) {
                statement = getParamText(formFieldConfig.condition.statement, formFieldConfig.condition.params, { record, data, step })
              }
              try {
                // eslint-disable-next-line no-eval
                const result = eval(statement)
                if (!result) {
                  hidden = false
                }
              } catch (e) {
                console.error('表单项展示条件语句执行错误。', statement)
                hidden = false
              }
            }

            if (formFieldConfig.type === 'hidden') {
              hidden = false
            }

            if (formFieldConfig.display === 'none') {
              hidden = true
              display = false
            }

            const FormField = this.getALLComponents(formFieldConfig.type) || React.Fragment

            const fieldData = formFieldConfig.field !== undefined ? getValue(this.state.formData, formFieldConfig.field, {}) : {}

            const renderData = {
              label: formFieldConfig.label,
              status: fieldData.status || 'normal',
              message: fieldData.message || '',
              layout: formLayout,
              fieldType: formFieldConfig.type,
              children: (
                  <FormField
                    key={formFieldIndex}
                    ref={(formField: Field<FieldConfigs, any, any> | null) => {
                      if (formFieldIndex !== null) {
                        this.formFields[formFieldIndex] = formField
                        this.handleFormFieldMount(formFieldIndex)
                      }
                    }}
                    formLayout={formLayout}
                    value={formFieldConfig.field !== undefined ? getValue(value, formFieldConfig.field) : undefined}
                    record={record}
                    data={_.cloneDeep(data)}
                    step={step}
                    config={formFieldConfig}
                    onChange={async (value: any) => { await this.handleChange(formFieldIndex, value) }}
                  />
              )
            }
            // 渲染表单项容器
            return (
              hidden
                ? <div key={formFieldIndex} style={display
                  ? { position: 'relative' }
                  : {
                      overflow: 'hidden',
                      height: 0,
                      width: 0
                    }}>
                {this.renderItemComponent(renderData)}
              </div>
                : <></>
            )
          })
        })}
      </React.Fragment>
    )
  }
}
