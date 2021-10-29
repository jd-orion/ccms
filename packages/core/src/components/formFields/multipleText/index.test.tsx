import React from 'react'
import { render, cleanup } from '@testing-library/react'
import renderer from 'react-test-renderer'
import MultipleTextField, { MultipleTextFieldConfig } from '.'
import { FieldError, FieldProps } from '../common'

// 默认入参
const defaultProps: FieldProps<MultipleTextFieldConfig, any[]> = {
  ref: async (ref: any) => { },
  formLayout: 'horizontal',
  value: [],
  data: [{}],
  step: 0,
  config: {
    field: 'multipleTextValue',
    label: 'multiple_text',
    type: 'multiple_text'
  },
  onChange: async () => { },
  record: {},
  onValueSet: async (path: string, value: object, validation: true | FieldError[]) => {

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
        <MultipleTextField
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

theTest('MultipleText- 读取默认值和当前值', {}, {}, undefined, [])
theTest('MultipleText- 设置当前值', { value: [1, 2, 3] }, {}, undefined, [1, 2, 3])

test('MultipleText onChange', () => {
  return new Promise((resolve) => {
    const component = renderer.create(
      <MultipleTextField
        {...defaultProps}
        ref={async (ref: any) => { }}
        onValueSet={async (path, value) => {
          expect(value).toEqual([])
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
