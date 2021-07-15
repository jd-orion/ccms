import React, { ReactNode } from 'react'
import { APIConfig, ParamConfig } from '../../../interface'
import { request } from '../../../util/request'
import { getParam, getValue, setValue } from '../../../util/value'
import { Field, FieldConfig, IField, FieldError } from '../common'

export interface TreeSelectFieldConfig extends FieldConfig {
  type: 'tree_select'
  treeData?: ManualOptionsConfig | InterfaceOptionsConfig
}

export interface ManualOptionsConfig {
  from: 'manual'
  defaultIndex?: string | number
  data?: Array<{
    value: string | number
    title: string
    [extra: string]: any
  }>
}

export interface InterfaceOptionsConfig {
  from: 'interface'
  api?: APIConfig
  defaultIndex?: string | number
  request?: {
    data?: { [key: string]: ParamConfig }
  }
  response: {
    root?: string
    data?: InterfaceOptionsKVConfig | InterfaceOptionsListConfig
  }
}

export interface InterfaceOptionsKVConfig {
  type: 'kv'
}

export interface InterfaceOptionsListConfig {
  type: 'list'
  keyField: string
  titleField: string
}

export interface ISelectFieldOption {
  value: string | number,
  title: ReactNode,
  children?: Array<ISelectFieldOption>
}

interface SelectSingleFieldState {
  interfaceOptionsData: Array<{
    value: string | number
    title: string
    [extra: string]: any
  }>
}

export interface ITreeSelectField {
  value?: string,
  treeData: Array<ISelectFieldOption>
  onChange: (value: string) => Promise<void>
}

export default class TreeSelectField extends Field<TreeSelectFieldConfig, ITreeSelectField, string> implements IField<string> {
  interfaceOptionsConfig: string = ''
  state: SelectSingleFieldState = {
    interfaceOptionsData: []
  }

  formatTree = (treeList: any, value: string, title: string) => {
    const rsMenu: any = []

    treeList.forEach((val: any) => {
      const theMenu: any = {
        title: '',
        value: null
      }

      theMenu.title = getValue(val, title)
      theMenu.value = getValue(val, value)

      val.children && (theMenu.children = this.formatTree(val.children, value, title))
      val.isHidden && (theMenu.isLeaf = val.isHidden)
      rsMenu.push(theMenu)
    })
    return rsMenu
  }

  options = (
    config: ManualOptionsConfig | InterfaceOptionsConfig | undefined,
    datas: {
      record?: object
      data: object[]
      step: number
    }
  ) => {
    if (config) {
      if (config.from === 'manual') {
        if (config.data) {
          return this.formatTree(config.data, 'value', 'title')
        }
      } else if (config.from === 'interface') {
        if (config.api) {
          const interfaceOptionsParams: { [key: string]: any } = {}
          if (config.request && config.request.data) {
            for (const field in config.request.data) {
              const param = config.request.data[field]
              setValue(interfaceOptionsParams, field, getParam(param, datas))
            }
          }

          const interfaceOptionsConfig: string = JSON.stringify({
            api: config.api,
            params: interfaceOptionsParams
          })

          if (interfaceOptionsConfig !== this.interfaceOptionsConfig) {
            this.interfaceOptionsConfig = interfaceOptionsConfig
            request(config.api, interfaceOptionsParams).then((_response) => {
              if (config.response) {
                const response = getValue(_response, config.response.root || '')
                if (config.response.data) {
                  if (config.response.data.type === 'kv') {
                    this.setState({
                      interfaceOptionsData: Object.keys(response).map((key) => ({
                        value: key,
                        title: response[key]
                      }))
                    })
                  } else if (config.response.data.type === 'list') {
                    this.setState({
                      interfaceOptionsData: response.map((item: any) => {
                        if (config.response.data?.type === 'list') {
                          const value = config.response.data.keyField
                          const title = config.response.data.titleField
                          return this.formatTree(item, value, title)
                        } else {
                          return {}
                        }
                      })
                    })
                  }
                }
              }
            })
          }
          return this.state.interfaceOptionsData.map((option) => {
            return {
              value: option.value,
              title: option.label
            }
          })
        }
      }
    }
    return []
  }

  reset = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      const {
        config: {
          treeData
        }
      } = this.props

      if (treeData && treeData.from === 'interface' && treeData.api) {
        let interfaceOptionsData: any = []
        await request(treeData.api, {}).then((_response: any) => {
          if (treeData.response) {
            const response = getValue(_response, treeData.response.root || '')
            if (treeData.response.data) {
              if (treeData.response.data.type === 'kv') {
                interfaceOptionsData = Object.keys(response).map((key) => ({
                  value: key,
                  label: response[key]
                }))
              } else if (treeData.response.data.type === 'list') {
                interfaceOptionsData = response.map((item: any) => {
                  if (treeData.response.data?.type === 'list') {
                    return ({
                      value: getValue(item, treeData.response.data.keyField),
                      label: getValue(item, treeData.response.data.titleField)
                    })
                  }
                  return {}
                })
              }
            }
          }
        })
        return treeData.defaultIndex === undefined ? undefined : interfaceOptionsData[treeData.defaultIndex || 0].value
      }
      return undefined
    } else {
      if (typeof defaults === 'string' || typeof defaults === 'number') {
        return defaults
      } else {
        console.warn('单项选择框的值需要是字符串或数值。')
        return undefined
      }
    }
  }

  validate = async (_value: string | number | undefined): Promise<true | FieldError[]> => {
    const {
      config: {
        required
      }
    } = this.props

    const errors: FieldError[] = []

    if (required) {
      if (_value === '' || _value === undefined) {
        errors.push(new FieldError('不能为空'))
      }
    }

    return errors.length ? errors : true
  }

  renderComponent = (props: ITreeSelectField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现TreeSelectSingleField组件的SelectSingle模式。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange('')}>onChange</button>
      </div>
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config: {
        treeData: optionsConfig
      },
      onChange,
      record,
      data,
      step
    } = this.props

    const treeData = this.options(optionsConfig, { record, data, step })

    return (
      <React.Fragment>
        {this.renderComponent({
          value,
          treeData,
          onChange: async (value: string) => await onChange(value)
        })}
      </React.Fragment>
    )
  }
}
