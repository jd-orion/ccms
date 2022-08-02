import _ from 'lodash'
import { ReactNode } from 'react'
import EnumerationHelper, { EnumerationOptionsConfig } from '../../../util/enumeration'
import InterfaceHelper from '../../../util/interface'
import { Field, FieldConfig, FieldProps, IField, Display, DisplayProps } from '../common'

export interface SelectFieldConfig extends FieldConfig {
  options?: EnumerationOptionsConfig
  defaultSelect?: boolean | number
}

export interface ISelectFieldOption {
  value: string | number | boolean
  label: ReactNode
  children?: Array<ISelectFieldOption>
}

interface SelectSingleFieldState {
  options: Array<{
    value: string | number | boolean
    label: string
    [extra: string]: unknown
  }>
}

export default class SelectField<C extends SelectFieldConfig, E, T>
  extends Field<C, E, T, SelectSingleFieldState>
  implements IField<T>
{
  interfaceHelper = new InterfaceHelper()

  constructor(props: FieldProps<C, T>) {
    super(props)

    this.state = {
      options: []
    }
  }

  options = (config: EnumerationOptionsConfig | undefined) => {
    if (config) {
      EnumerationHelper.options(
        config,
        (optionConfig, source) =>
          this.interfaceHelper.request(
            optionConfig,
            source,
            {
              record: this.props.record,
              data: this.props.data,
              step: this.props.step,
              containerPath: this.props.containerPath
            },
            { loadDomain: this.props.loadDomain },
            this
          ),
        {
          record: this.props.record,
          data: _.cloneDeep(this.props.data),
          step: this.props.step,
          containerPath: this.props.containerPath
        }
      ).then((options) => {
        if (JSON.stringify(this.state.options) !== JSON.stringify(options)) {
          this.setState({
            options: options.map((option) => ({
              value: option.value as string | number | boolean,
              label: option.label
            }))
          })
        }
      })

      return this.state.options
    }
    return []
  }
}

export class SelectDisplay<C extends SelectFieldConfig, E, T> extends Display<C, E, T, SelectSingleFieldState> {
  interfaceHelper = new InterfaceHelper()

  constructor(props: DisplayProps<C, T>) {
    super(props)

    this.state = {
      options: []
    }
  }

  options = (config: EnumerationOptionsConfig | undefined) => {
    if (config) {
      EnumerationHelper.options(
        config,
        (optionConfig, source) =>
          this.interfaceHelper.request(
            optionConfig,
            source,
            {
              record: this.props.record,
              data: _.cloneDeep(this.props.data),
              step: this.props.step,
              containerPath: this.props.containerPath
            },
            { loadDomain: this.props.loadDomain }
          ),
        {
          record: this.props.record,
          data: this.props.data,
          step: this.props.step,
          containerPath: this.props.containerPath
        }
      ).then((options) => {
        if (JSON.stringify(this.state.options) !== JSON.stringify(options)) {
          this.setState({
            options: options.map((option) => ({
              value: option.value as string | number | boolean,
              label: option.label
            }))
          })
        }
      })

      return this.state.options
    }
    return []
  }
}
