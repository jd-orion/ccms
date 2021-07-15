import React from 'react'
import { render, cleanup } from '@testing-library/react'
import NumberColumn, { NumberColumnConfig } from '.'
import { ColumnProps } from '../common'

// 默认入参
const defaultProps: ColumnProps<NumberColumnConfig> = {
  ref: async () => { },
  record: {},
  value: '',
  data: [],
  step: 0,
  config: { type: 'number', field: 'test', label: 'test' }
}

const theTest = (message: string, setvalue: any, config: any, successValue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <NumberColumn
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

theTest('数值- 未配置', { value: '' }, {}, '')
theTest('数值- 配置默认格式', { value: 2020 }, {}, '2020')
theTest('数值- value为空', { value: '' }, { defaultValue: '暂无信息' }, '暂无信息')
theTest('数值- 配置数值小数点', { value: 2020 }, { precision: 2 }, '2020.00')
theTest('数值- value为空并配置了小数点', { value: '' }, { precision: 2, defaultValue: '暂无信息' }, '0.00')
