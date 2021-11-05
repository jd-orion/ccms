import React from 'react'
import { render, cleanup } from '@testing-library/react'
import renderer from 'react-test-renderer'
import SwitchField, { SwitchFieldConfig } from '.'
import { FieldError, FieldProps } from '../common'

// 默认入参
const defaultProps: FieldProps<SwitchFieldConfig, string | number | boolean> = {
  ref: async (ref: any) => { },
  formLayout: 'horizontal',
  value: true,
  data: [{}],
  step: 0,
  config: {
    field: 'switchValue',
    label: 'switch',
    type: 'switch',
    valueTrue: true,
    valueFalse: false
  },
  onChange: async () => { },
  record: {},
  onValueSet: async (path: string, value: string | number | boolean, validation: true | FieldError[]) => {

  },
  onValueUnset: async () => { },
  onValueListAppend: async () => { },
  onValueListSplice: async () => { },
  baseRoute: '/',
  loadDomain: async () => 'hello'
}

const theTest = (message: string, setvalue: any, config: any, successValue: any, getValue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
        <SwitchField
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

theTest('switch- 读取默认值和当前值', {}, {}, '', true)

test('switch onChange', () => {
  return new Promise((resolve) => {
    const component = renderer.create(
      <SwitchField
        {...defaultProps}
        ref={async (ref: any) => { }}
        onValueSet={async (path, value) => {
          expect(value).toEqual(false) // 原来是true 点击后就是false, 原来是false,点击后就是true
          cleanup()
          resolve(true)
        }}
      />
    )

    const o = component.toJSON()
    if (o) {
      o[1].children[0].props.onClick()
    }
  })
})
