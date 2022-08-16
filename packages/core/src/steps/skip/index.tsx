import React from 'react'
import QueryString from 'query-string'
import { set } from 'lodash'
import { FieldConfigs } from '../../components/formFields'
import TextField from '../../components/formFields/text'
import Step, { StepConfig } from '../common'
import { getValue } from '../../util/value'

export interface SkipConfig extends StepConfig {
  type: 'skip'
  fields: FieldConfigs[]
  default?: {
    type: 'static' | 'data' | 'query' | 'hash' | 'step'
    value?: unknown
    field?: string
    step?: string | number
  }
}

export default class SkipStep extends Step<SkipConfig> {
  FieldType: { [type: string]: unknown } = {
    text: TextField
  }

  stepPush = async () => {
    // async componentDidMount() {
    const {
      data,
      config: {
        fields,
        default: { type: defaultType, value: defaultValue, field: defaultField, step: defaultStep } = {},
        default: defaultConfig
      },
      step,
      onSubmit
    } = this.props

    let result: { [key: string]: unknown } = {}

    let formDefault: unknown

    if (defaultConfig) {
      switch (defaultType) {
        case 'static':
          if (defaultValue) {
            formDefault = defaultValue
          }
          break
        case 'data':
          if (data && step) {
            if (defaultField) {
              formDefault = getValue(step, defaultField)
            } else {
              formDefault = step
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
              /* 无逻辑 */
            }
          }
          break
        case 'step':
          formDefault = defaultStep && getValue(data[defaultStep] || {}, defaultField || '')
          break
        default:
        /* 无逻辑 */
      }
      for (let formFieldIndex = 0; formFieldIndex < fields.length; formFieldIndex++) {
        const formFieldConfig = fields[formFieldIndex]
        const value = getValue(formDefault, formFieldConfig.field)
        if (formFieldConfig.field === '') {
          result = value
        } else {
          set(result, formFieldConfig.field, value)
        }
      }
    }
    onSubmit(result)
  }

  render() {
    return <></>
  }
}
