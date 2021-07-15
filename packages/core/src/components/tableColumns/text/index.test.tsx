import React from 'react'
import { render, cleanup } from '@testing-library/react'
import TextColumn, { TextColumnConfig } from '.'
import { ColumnProps } from '../common'

// 默认入参
const defaultProps: ColumnProps<TextColumnConfig> = {
  ref: async () => { },
  record: {},
  value: '',
  data: [],
  step: 0,
  config: { type: 'text', field: 'test', label: 'test' }
}

const theTest = (message: string, setvalue: any, config: any, successValue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <TextColumn
                    {...Object.assign(defaultProps, setvalue)}
                    config={Object.assign(defaultProps.config, config)}
                    ref={async (ref: any) => {
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
