import React from 'react'
import { SelectSingleFieldConfig } from '.'
import { SelectDisplay, ISelectFieldOption } from '../common'

export interface ISelectSingleField {
  value: undefined | string | number | boolean
  options: Array<ISelectFieldOption>
}

export default class SelectSingleDisplay extends SelectDisplay<
  SelectSingleFieldConfig,
  unknown,
  string | number | boolean | undefined
> {
  renderSelectSingleComponent: (props: ISelectSingleField) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现SelectSingleDisplay组件。</>
  }

  render = () => {
    const {
      value,
      config: { options: optionsConfig, defaultSelect }
    } = this.props

    const props: ISelectSingleField = {
      value: undefined,
      options: this.options(optionsConfig)
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      if (props.options.map((option) => option.value).includes(value)) {
        props.value = value
      } else {
        props.value = undefined
      }
    } else if (value !== undefined) {
      props.value = undefined
    } else if (value === undefined) {
      if (defaultSelect !== undefined && defaultSelect !== false && props.options.length) {
        const { value: valueChange } = props.options[defaultSelect === true || defaultSelect < 0 ? 0 : defaultSelect]
        props.value = valueChange
      }
    }
    return <>{this.renderSelectSingleComponent(props)}</>
  }
}
