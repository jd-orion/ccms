import React from 'react'
import { cleanup } from '@testing-library/react'
import renderer from 'react-test-renderer'
import DescField, { DescFieldConfig } from '.'
import { FieldError, FieldProps } from '../common'

// 默认入参
const defaultProps: FieldProps<DescFieldConfig, string> = {
  ref: async (ref: any) => { },
  formLayout: 'horizontal',
  value: '',
  data: [{}],
  step: 0,
  config: {
    field: 'switchValue',
    label: 'description',
    type: 'desc'
  },
  onChange: async () => { },
  record: {},
  onValueSet: async (path: string, value: string, validation: true | FieldError[]) => {

  },
  onValueUnset: async () => { },
  onValueListAppend: async () => { },
  onValueListSplice: async () => { },
  baseRoute: '/',
  loadDomain: async () => 'hello'
}

const theTest = (message: string, setvalue: any, config: any, successValue: any, descText: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      const component = renderer.create(
        <DescField
          {...defaultProps}
          config={Object.assign(defaultProps.config, config)}
        />
      )

      const o = component.toJSON()
      defaultProps.config.link && expect(o && o[1].children[0].type).toEqual(successValue)
      if (defaultProps.config.link) expect(o && o[1].children[0].children[0]).toEqual(descText)
      else expect(o && o[1].children[0]).toEqual(descText)
      cleanup()
      resolve(true)
    })
  })
}
theTest('desc- 配置为文本', {}, { desc: '描述文字' }, '', '描述文字')
theTest('desc- 配置为link', {}, { link: 'url地址', desc: '描述文字' }, 'a', '描述文字')
