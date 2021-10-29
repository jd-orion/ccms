import React from 'react'
import { render, cleanup } from '@testing-library/react'
import HiddenField, { HiddenFieldConfig } from '.'
import { FieldError, FieldProps } from '../common'

// 默认入参
const defaultProps: FieldProps<HiddenFieldConfig, string | number | boolean> = {
  ref: async (ref: any) => { },
  formLayout: 'horizontal',
  value: true,
  data: [{}],
  step: 0,
  config: {
    field: 'switchValue',
    label: 'switch',
    type: 'hidden'
  },
  onChange: async () => { },
  record: {},
  onValueSet: async (path: string, value: string | number | boolean, validation: true | FieldError[]) => {

  },
  onValueUnset: async () => { },
  onValueListAppend: async () => { },
  onValueListSplice: async () => { },
  loadDomain: async () => 'hello'
}

const theTest = (message: string, setvalue: any, config: any, successValue: any, getValue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
        <HiddenField
          {...Object.assign(defaultProps, setvalue)}
          config={Object.assign(defaultProps.config, config)}
          ref={async (ref: any) => {
            if (ref) {
              const value = await ref.reset()
              expect(value).toEqual(successValue)
              const getvalue = await ref.get()
              expect(getvalue).toEqual(getValue)
              cleanup()
              resolve(true)
            }
          }}
        />
      )
    })
  })
}

theTest('hidden组件- 读取默认值和当前值', {}, {}, undefined, true)
