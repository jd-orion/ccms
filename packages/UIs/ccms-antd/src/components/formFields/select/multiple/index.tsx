import React from 'react'
import { SelectMultipleField } from 'ccms'
import { Checkbox, Select } from 'antd'
import { ISelectMultipleField } from 'ccms/dist/components/formFields/select/multiple'
import InterfaceHelper from '../../../../util/interface'

export default class SelectSingleFieldComponent extends SelectMultipleField {
  interfaceHelper = new InterfaceHelper()

  renderDorpdownComponent = (props: ISelectMultipleField) => {
    const { value, options, onChange, onClear, disabled, readonly, placeholder } = props

    return (
      <Select
        optionFilterProp="label"
        getPopupContainer={(ele) => ele.parentElement || document.body}
        disabled={disabled || readonly}
        placeholder={placeholder}
        value={value}
        onChange={(selectValue) => onChange(selectValue)}
        style={{ minWidth: '100px' }}
        dropdownMatchSelectWidth={false}
        mode="multiple"
        allowClear={onClear !== undefined}
        onClear={() => onClear !== undefined && onClear()}
      >
        {options.map((option) => (
          <Select.Option key={option.value as any} value={option.value as any} label={option.label}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    )
  }

  renderCheckboxComponent = (props: ISelectMultipleField) => {
    const { value, options, onChange, disabled, readonly } = props
    let tempValue
    let tempOptions
    let onCheckBoxChange
    const createTemp = options.find((option) => option.value === null || option.value === undefined)
    if (createTemp) {
      tempOptions = options.map((option, index) => {
        return {
          label: option.label,
          value: index,
          realValue: option.value
        }
      })
      if (value) {
        tempValue = value.map((v) => {
          return tempOptions.findIndex((option) => v === option.realValue)
        })
      }
      onCheckBoxChange = (checkedValue) => onChange(checkedValue.map((i: number) => tempOptions[i].realValue))
    } else {
      tempValue = value
      tempOptions = options
      onCheckBoxChange = onChange
    }
    return (
      <Checkbox.Group
        disabled={disabled || readonly}
        value={tempValue}
        onChange={(checkedValue) => onCheckBoxChange(checkedValue as Array<string | number>)}
        options={tempOptions}
      />
    )
  }
}
