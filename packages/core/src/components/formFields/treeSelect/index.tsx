import React from 'react'
import { get } from 'lodash'
import { Field, FieldConfig, FieldError, FieldProps } from '../common'
import InterfaceHelper, { InterfaceConfig } from '../../../util/interface'
import ParamHelper from '../../../util/param'
import { RecordParamConfig, DataParamConfig, StepParamConfig, SourceParamConfig } from '../../../interface'
import { transformValueType } from '../../../util/value'

type OptionsConfigDefaultValue = RecordParamConfig | DataParamConfig | StepParamConfig | SourceParamConfig
export interface TreeSelectFieldConfig extends FieldConfig {
  type: 'tree_select'
  mode?: 'tree' | 'table' | 'treeSelect'
  multiple?: true | TreeSelectMultipleArrayConfig | TreeSelectMultipleSplitConfig
  titleColumn?: string
  treeData?: ManualOptionsConfig | InterfaceOptionsConfig | DataOptionsConfig
}

interface TreeSelectMultipleArrayConfig {
  type: 'array'
}

interface TreeSelectMultipleSplitConfig {
  type: 'split'
  split?: string
  valueType?: 'string' | 'number' | 'boolean' | undefined
}
export interface DataOptionsConfig {
  from: 'data'
  sourceConfig?: OptionsConfigDefaultValue
  format?: InterfaceOptionsListConfig
}

export interface ManualOptionsConfig {
  from: 'manual'
  defaultIndex?: string | number
  data?: TreeSelectFieldOption[]
}
export interface TreeSelectFieldOption {
  key: string | number
  value: string | number
  title: string
  children?: Array<TreeSelectFieldOption>
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

interface TreeSelectFieldState {
  interfaceOptionsData: TreeSelectFieldOption[]
}

type TreeSelectValueType = string | Array<string | number> | undefined

export interface ITreeSelectField {
  multiple?: boolean
  value: TreeSelectValueType
  treeData: Array<TreeSelectFieldOption>
  titleColumn?: string
  onChange: (value: TreeSelectValueType) => Promise<void>
}

export default class TreeSelectField extends Field<TreeSelectFieldConfig, ITreeSelectField, TreeSelectValueType> {
  interfaceHelper = new InterfaceHelper()

  interfaceOptionsConfig = ''

  state: TreeSelectFieldState = {
    interfaceOptionsData: []
  }

  constructor(props: FieldProps<TreeSelectFieldConfig, TreeSelectValueType>) {
    super(props)

    this.state = {
      interfaceOptionsData: []
    }
  }

  optionsData = (sourceConfig: OptionsConfigDefaultValue) => {
    if (sourceConfig !== undefined) {
      return ParamHelper(sourceConfig, {
        record: this.props.record,
        data: this.props.data,
        step: this.props.step,
        containerPath: this.props.containerPath
      })
    }
    return undefined
  }

  formatTree = (treeList: TreeSelectFieldOption[], value: string, title: string, children: string) => {
    const rsMenu: TreeSelectFieldOption[] = []

    treeList.forEach((val: TreeSelectFieldOption) => {
      const theMenu: TreeSelectFieldOption = {
        title: '',
        value: '',
        key: ''
      }

      theMenu.title = get(val, title)
      theMenu.value = get(val, value)
      theMenu.key = get(val, value)

      if (get(val, children)) {
        theMenu.children = this.formatTree(get(val, children), value, title, children)
      }

      rsMenu.push(theMenu)
    })
    return rsMenu
  }

  options = (config: ManualOptionsConfig | InterfaceOptionsConfig | DataOptionsConfig | undefined) => {
    if (config) {
      if (config.from === 'data') {
        if (config.sourceConfig && config.sourceConfig.source && config.sourceConfig.field) {
          const data = this.optionsData(config.sourceConfig)
          if (Array.isArray(data)) {
            return this.formatTree(
              data,
              config.format?.keyField || 'value',
              config.format?.titleField || 'title',
              config.format?.childrenField || 'children'
            )
          }
        }
      } else if (config.from === 'manual') {
        if (config.data) {
          return this.formatTree(config.data, 'value', 'title', 'children')
        }
      } else if (config.from === 'interface') {
        if (config.interface) {
          this.interfaceHelper
            .request(
              config.interface,
              {},
              {
                record: this.props.record,
                data: this.props.data,
                step: this.props.step,
                containerPath: this.props.containerPath
              },
              { loadDomain: this.props.loadDomain },
              this
            )
            .then((data) => {
              this.setState({
                interfaceOptionsData: this.formatTree(
                  data as TreeSelectFieldOption[],
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

  validate = async (_value: TreeSelectValueType): Promise<true | FieldError[]> => {
    const {
      config: { required }
    } = this.props

    const errors: FieldError[] = []

    if (required) {
      if (_value === '' || _value === undefined) {
        errors.push(new FieldError('不能为空'))
      }
    }

    return errors.length ? errors : true
  }

  renderComponent: (props: ITreeSelectField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现TreeSelectField组件的treeSelect模式。</>
  }

  renderTreeComponent: (props: ITreeSelectField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现TreeSelectField组件的tree模式。</>
  }

  renderTableComponent: (props: ITreeSelectField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现TreeSelectField组件的table模式。</>
  }

  render = () => {
    const {
      value,
      config: { multiple, mode, titleColumn, treeData: optionsConfig }
    } = this.props

    const temp = this.options(optionsConfig)
    const props: ITreeSelectField = {
      value: undefined,
      treeData: this.state.interfaceOptionsData,
      onChange: async (valueChange: TreeSelectValueType) => {
        let useV = valueChange
        if (Array.isArray(useV) && multiple !== true && multiple?.type === 'split') {
          useV = useV.join(multiple.split || ',')
        }
        return this.props.onValueSet('', useV, await this.validate(useV))
      }
    }
    if (optionsConfig && (optionsConfig.from === 'manual' || optionsConfig.from === 'data')) {
      props.treeData = temp
    }
    if (multiple === true || multiple?.type === 'array') {
      if (Array.isArray(value)) {
        props.value = value as Array<string | number>
      } else if (value !== undefined) {
        props.value = undefined
      }
    } else if (multiple?.type === 'split') {
      if (typeof value === 'string' && value !== '') {
        props.value = transformValueType(String(value).split(multiple.split || ','), multiple?.valueType)
      } else if (value !== undefined) {
        props.value = undefined
      }
    } else if (Array.isArray(value)) {
      props.value = value
    } else if (mode === 'treeSelect') {
      props.value = value
    } else {
      props.value = undefined
    }

    if (mode === 'table') {
      props.titleColumn = titleColumn
      return this.renderTableComponent(props)
    }
    if (mode === 'tree') {
      return this.renderTreeComponent(props)
    }
    props.multiple = multiple === true || multiple?.type === 'array'
    return <>{this.renderComponent(props)}</>
  }
}
