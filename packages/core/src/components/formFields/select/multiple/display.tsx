import React from 'react'
import { SelectMultipleFieldConfig } from '.'
import { SelectDisplay, ISelectFieldOption } from '../common'

export interface ISelectMultipleField {
  value: undefined | Array<string | number>,
  options: Array<ISelectFieldOption>
}

export default class SelectMultipleDisplay extends SelectDisplay<SelectMultipleFieldConfig, {}, string | Array<string | number> | undefined> {
  renderSelectMultipleComponent = (props: ISelectMultipleField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现SelectMultipleDisplay组件。
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config: {
        multiple,
        options: optionsConfig
      }
    } = this.props

    const props: ISelectMultipleField = {
      value: undefined,
      options: this.options(optionsConfig)
    }

    if (multiple === true || multiple?.type === 'array') {
      if (Array.isArray(value)) {
        props.value = (value as Array<string | number>)
      } else if (value !== undefined) {
        props.value = undefined
        console.warn('数组类型的多项选择框的值需要是字符串或数值的数组。')
      }
    } else if (multiple?.type === 'split') {
      if (typeof value === 'string') {
        props.value = String(value).split(multiple.split || ',')
      } else if (value !== undefined) {
        props.value = undefined
        console.warn('字符串分隔类型的多项选择框的值需要是字符串。')
      }
    } else {
      props.value = Array.isArray(value) ? value : undefined
    }

    if (props.value !== undefined) {
      props.value = props.value.filter((v) => {
        if (props.options.find((option) => option.value === v.toString())) {
          return true
        } else {
          console.warn(`选择框的当前值中${v}不在选项中。`)
          return false
        }
      })
    }

    return (
      <React.Fragment>
        {
          this.renderSelectMultipleComponent(props)
        }
      </React.Fragment>
    )
  }
}
