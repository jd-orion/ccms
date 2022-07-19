import React from 'react'
import { render, cleanup } from '@testing-library/react'
import FormattedTextColumn, { FormattedTextColumnConfig } from '.'
import { ColumnProps } from '../common'

// 默认入参
const defaultProps: ColumnProps<FormattedTextColumnConfig> = {
  ref: async () => {
    /* 无需处理 */
  },
  record: {},
  value: '',
  data: [],
  step: {},
  config: {
    type: 'formatted_text',
    field: 'test',
    label: 'test',
    statement: { statement: '', params: [] },
    align: 'left'
  }
}

const theTest = (message: string, setvalue: unknown, config: unknown, successValue: unknown) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
        <FormattedTextColumn
          {...Object.assign(defaultProps, setvalue)}
          config={Object.assign(defaultProps.config, config)}
          ref={async (ref) => {
            if (ref) {
              const value = await ref?.getValue()
              expect(value).toEqual(successValue)
              resolve(true)
              cleanup()
            }
          }}
        />
      )
    })
  })
}

theTest('文本- 未配置', { value: '' }, {}, '')
theTest('文本- 配置默认格式', { value: 2020 }, {}, 2020)
theTest('文本- value为空', { value: '' }, { defaultValue: '暂无信息' }, '暂无信息')
