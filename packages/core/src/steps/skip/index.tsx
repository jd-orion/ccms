import React from 'react'
import QueryString from 'query-string'
import { FieldConfigs } from '../../components/formFields'
import TextField from '../../components/formFields/text'
import Step, { StepConfig } from '../common'
import { getValue, setValue } from '../../util/value'

export interface SkipConfig extends StepConfig {
  type: 'skip'
  fields: FieldConfigs[],
  default?: {
    type: 'static' | 'data' | 'query' | 'hash'
    value?: any
    field?: string
  }
}

export default class SkipStep extends Step<SkipConfig> {
  FieldType: { [type: string]: any } = {
    text: TextField
  }

  willMount = async () => {
    // async componentDidMount() {
    const {
      data,
      config: {
        fields,
        default: {
          type: defaultType,
          value: defaultValue,
          field: defaultField
        } = {},
        default: defaultConfig
      },
      step,
      onSubmit
    } = this.props

    const result: { [key: string]: any } = {}

    let formDefault: any

    if (defaultConfig) {
      switch (defaultType) {
        case 'static':
          if (defaultValue) {
            formDefault = defaultValue
          }
          break
        case 'data':
          if (data && data[step]) {
            if (defaultField) {
              formDefault = getValue(data[step], defaultField)
            } else {
              formDefault = data[step]
            }
          }
          break
        case 'query':
          if (window.location.search) {
            const query = QueryString.parse(window.location.search)
            if (defaultField) {
              formDefault = getValue(query, defaultField)
            } else {
              formDefault = query
            }
          }
          break
        case 'hash':
          if (window.location.hash) {
            try {
              const hash = JSON.parse(window.location.hash.substr(1))
              if (defaultField) {
                formDefault = getValue(hash, defaultField)
              } else {
                formDefault = hash
              }
            } catch (e) {
            }
          }
          break
      }
      for (const formFieldIndex in fields) {
        const formFieldConfig = fields[formFieldIndex]
        const value = getValue(formDefault, formFieldConfig.field)
        setValue(result, formFieldConfig.field, value)
      }
    }

    onSubmit(result, false)
  }

  render() {
    return (
      <React.Fragment></React.Fragment>
    )
  }
}
