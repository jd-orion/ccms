import React, { ReactNode } from 'react'
import { get } from 'lodash'
import { Field, FieldConfig, IField, FieldError, FieldProps } from '../common'
import InterfaceHelper, { InterfaceConfig } from '../../../util/interface'

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
  interface?: InterfaceConfig
  format?: InterfaceOptionsListConfig
}

export interface InterfaceOptionsKVConfig {
  type: 'kv'
}

export interface InterfaceOptionsListConfig {
  type: 'list'
  keyField?: string
  titleField?: string
  childrenField?: string
}

export interface ISelectFieldOption {
  value: string | number,
  title: ReactNode,
  children?: Array<ISelectFieldOption>
}

interface treeData {
  value: any,
  title: string,
  children?: treeData[]
}

interface SelectSingleFieldState {
  interfaceOptionsData: treeData[]
}

export interface ITreeSelectField {
  value?: string,
  treeData: Array<ISelectFieldOption>
  onChange: (value: string) => Promise<void>
}

export default class TreeSelectField extends Field<TreeSelectFieldConfig, ITreeSelectField, string> implements IField<string> {
  interfaceHelper = new InterfaceHelper()

  interfaceOptionsConfig: string = ''
  state: SelectSingleFieldState = {
    interfaceOptionsData: []
  }

  constructor (props: FieldProps<TreeSelectFieldConfig, string>) {
    super(props)

    this.state = {
      interfaceOptionsData: []
    }
  }

  formatTree = (treeList: any, value: string, title: string, children: string) => {
    const rsMenu: treeData[] = []

    treeList.forEach((val: any) => {
      const theMenu: treeData = {
        title: '',
        value: null
      }

      theMenu.title = get(val, title)
      theMenu.value = get(val, value)

      if (get(val, children)) {
        theMenu.children = this.formatTree(get(val, children), value, title, children)
      }

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
          return this.formatTree(config.data, 'value', 'title', 'children')
        }
      } else if (config.from === 'interface') {
        if (config.interface) {
          this.interfaceHelper.request(
            config.interface,
            {},
            { record: this.props.record, data: this.props.data, step: this.props.step },
            { loadDomain: this.props.loadDomain }
          ).then((data) => {
            this.setState({
              interfaceOptionsData: this.formatTree(
                data,
                config.format?.keyField || 'value',
                config.format?.titleField || 'title',
                config.format?.childrenField || 'children'
              )
            })
          })
        }
      }
    }
    return []
  }

  // reset = async () => {
  //   const defaults = await this.defaultValue()

  //   if (defaults === undefined) {
  //     const {
  //       config: {
  //         treeData
  //       }
  //     } = this.props

  //     return undefined
  //   } else {
  //     if (typeof defaults === 'string' || typeof defaults === 'number') {
  //       return defaults
  //     } else {
  //       console.warn('单项选择框的值需要是字符串或数值。')
  //       return undefined
  //     }
  //   }
  // }

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

    this.options(optionsConfig, { record, data, step })

    return (
      <React.Fragment>
        {this.renderComponent({
          value,
          treeData: this.state.interfaceOptionsData,
          onChange: async (value: string) => await this.props.onValueSet('', value, await this.validate(value))
        })}
      </React.Fragment>
    )
  }
}
