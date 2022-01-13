import React from 'react'
import { cloneDeep } from 'lodash'
import { setValue, getValue } from '../../../util/value'
import { DetailField, DetailFieldConfig, DetailFieldError, DetailFieldProps, IDetailField } from '../common'
import getALLComponents, { DetailFieldConfigs } from '../'
import { IDetailItem } from '../../../steps/detail'
import ConditionHelper from '../../../util/condition'
import { ColumnsConfig } from '../../../interface'

export interface GroupFieldConfig extends DetailFieldConfig {
  type: 'group'
  fields: DetailFieldConfigs[]
}

export interface IGroupField {
  columns?: ColumnsConfig
  styles?: object
  children: React.ReactNode[]
}

interface IGroupFieldState {
  detailData: { status: 'normal' | 'error' | 'loading', message?: string }[]
}

export default class GroupField extends DetailField<GroupFieldConfig, IGroupField, any, IGroupFieldState> implements IDetailField<string> {
  // 各表单项对应的类型所使用的UI组件的类
  getALLComponents = (type: any): typeof DetailField => getALLComponents[type]

  detailFields: Array<DetailField<DetailFieldConfigs, {}, any> | null> = []
  detailFieldsMounted: Array<boolean> = []

  constructor (props: DetailFieldProps<GroupFieldConfig, any>) {
    super(props)

    this.state = {
      detailData: []
    }
  }

  get = async () => {
    let data: any = {}

    if (Array.isArray(this.props.config.fields)) {
      for (const detailFieldIndex in this.props.config.fields) {
        const detailFieldConfig = this.props.config.fields[detailFieldIndex]
        if (!ConditionHelper(detailFieldConfig.condition, { record: this.props.value, data: this.props.data, step: this.props.step })) {
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
        const detailFieldConfig = this.props.config.fields[detailFieldIndex]

        const value = getValue(this.props.value, detailFieldConfig.field)

        const validation = await detailField.validate(value)
        if (value === undefined || validation === true) {
          await this.setState(({ detailData }) => {
            detailData[detailFieldIndex] = { status: 'normal' }
            return { detailData: cloneDeep(detailData) }
          })
        } else {
          await this.setState(({ detailData }) => {
            detailData[detailFieldIndex] = { status: 'error', message: validation[0].message }
            return { detailData: cloneDeep(detailData) }
          })
        }
        await detailField?.didMount()
      }
    }
  }

  handleChange = async (formFieldIndex: number, value: any) => {
    // const formField = this.formFields[formFieldIndex]
    // const formFieldConfig = this.props.config.fields[formFieldIndex]

    // const formData = cloneDeep(this.state.formData)

    // if (formField && formFieldConfig) {
    //   if (this.props.onChange) {
    //     if (formFieldConfig.field === '') {
    //       await this.props.onChange(value)
    //     } else {
    //       const changeValue = setValue({}, formFieldConfig.field, value)
    //       await this.props.onChange(changeValue)
    //     }
    //   }

    //   const validation = await formField.validate(value)
    //   if (validation === true) {
    //     formData[formFieldIndex] = { value, status: 'normal' }
    //   } else {
    //     formData[formFieldIndex] = { value, status: 'error', message: validation[0].message }
    //   }

    //   await this.setState({
    //     formData
    //   })
    // }
  }

  handleValueSet = async (detailFieldIndex: number, path: string, value: any, validation: true | DetailFieldError[]) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      const fullPath = detailFieldConfig.field === '' || path === '' ? `${detailFieldConfig.field}${path}` : `${detailFieldConfig.field}.${path}`
      await this.props.onValueSet(fullPath, value, true)

      const detailData = cloneDeep(this.state.detailData)
      if (validation === true) {
        detailData[detailFieldIndex] = { status: 'normal' }
      } else {
        detailData[detailFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        detailData
      })
    }
  }

  handleValueUnset = async (detailFieldIndex: number, path: string, validation: true | DetailFieldError[]) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      const fullPath = detailFieldConfig.field === '' || path === '' ? `${detailFieldConfig.field}${path}` : `${detailFieldConfig.field}.${path}`
      await this.props.onValueUnset(fullPath, true)

      const detailData = cloneDeep(this.state.detailData)
      if (validation === true) {
        detailData[detailFieldIndex] = { status: 'normal' }
      } else {
        detailData[detailFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        detailData
      })
    }
  }

  handleValueListAppend = async (detailFieldIndex: number, path: string, value: any, validation: true | DetailFieldError[]) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      const fullPath = detailFieldConfig.field === '' || path === '' ? `${detailFieldConfig.field}${path}` : `${detailFieldConfig.field}.${path}`
      await this.props.onValueListAppend(fullPath, value, true)

      const detailData = cloneDeep(this.state.detailData)
      if (validation === true) {
        detailData[detailFieldIndex] = { status: 'normal' }
      } else {
        detailData[detailFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        detailData
      })
    }
  }

  handleValueListSplice = async (detailFieldIndex: number, path: string, index: number, count: number, validation: true | DetailFieldError[]) => {
    const detailFieldConfig = (this.props.config.fields || [])[detailFieldIndex]
    if (detailFieldConfig) {
      const fullPath = detailFieldConfig.field === '' || path === '' ? `${detailFieldConfig.field}${path}` : `${detailFieldConfig.field}.${path}`
      await this.props.onValueListSplice(fullPath, index, count, true)

      const detailData = cloneDeep(this.state.detailData)
      if (validation === true) {
        detailData[detailFieldIndex] = { status: 'normal' }
      } else {
        detailData[detailFieldIndex] = { status: 'error', message: validation[0].message }
      }

      this.setState({
        detailData
      })
    }
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
  renderItemComponent = (props: IDetailItem) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现DetailItem组件。
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
          children: (this.props.config.fields || []).map((detailFieldConfig, detailFieldIndex) => {
            if (!ConditionHelper(detailFieldConfig.condition, { record: value, data: this.props.data, step: this.props.step })) {
              this.detailFieldsMounted[detailFieldIndex] = false
              return null
            }
            let hidden: boolean = true
            let display: boolean = true

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
                    type: detailFieldConfig.columns?.type || config.columns?.type || 'span',
                    value: detailFieldConfig.columns?.value || config.columns?.value || 1,
                    wrap: detailFieldConfig.columns?.wrap || config.columns?.wrap || false,
                    gap: detailFieldConfig.columns?.gap || config.columns?.gap || 0,
                    rowGap: detailFieldConfig.columns?.rowGap || config.columns?.rowGap || 0
                  }
                : undefined,
              styles: detailFieldConfig.styles,
              layout: formLayout,
              visitable: display,
              fieldType: detailFieldConfig.type,
              children: (
                  <DetailFieldComponent
                    key={detailFieldIndex}
                    ref={(detailField: DetailField<DetailFieldConfigs, any, any> | null) => {
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
                    onChange={async (value: any) => { await this.handleChange(detailFieldIndex, value) }}
                    onValueSet={async (path, value, validation) => this.handleValueSet(detailFieldIndex, path, value, validation)}
                    onValueUnset={async (path, validation) => this.handleValueUnset(detailFieldIndex, path, validation)}
                    onValueListAppend={async (path, value, validation) => this.handleValueListAppend(detailFieldIndex, path, value, validation)}
                    onValueListSplice={async (path, index, count, validation) => this.handleValueListSplice(detailFieldIndex, path, index, count, validation)}
                    baseRoute={this.props.baseRoute}
                    loadDomain={async (domain: string) => await this.props.loadDomain(domain)}
                  />
              )
            }
            // 渲染表单项容器
            return (
              hidden
                ? this.renderItemComponent(renderData)
                : <React.Fragment key={detailFieldIndex} />
            )
          })
        })}
      </React.Fragment>
    )
  }
}
