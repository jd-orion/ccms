import React from 'react'
import { render, cleanup } from '@testing-library/react'
import DatetimeRangeColumn, { DatetimeRangeColumnConfig } from '.'
import { ColumnProps } from '../common'
// 默认入参
const defaultProps: ColumnProps<DatetimeRangeColumnConfig> = {
  ref: async (ref) => { },
  record: {},
  value: '',
  data: [],
  step: 0,
  config: { type: 'datetimeRange', field: 'test', label: 'test' }
}

const theTest = (message: string, setvalue: any, config: any, successValue: string) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
        <DatetimeRangeColumn
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

theTest('日期时间范围- 默认空 无默认值', { value: '' }, {}, '')
theTest('日期时间范围- 默认空 有默认值', { value: '' }, { defaultValue: '暂无信息' }, '暂无信息')
theTest('日期时间范围- 默认暂无信息', {}, { defaultValue: '暂无信息' }, '暂无信息')
theTest('日期时间范围- 单独一个数', { value: '2020' }, {}, '2020-01-01 00:00:00')
theTest('日期时间范围- 默认字符串', { value: '2020,2021' }, {}, '2020-01-01 00:00:00-2021-01-01 00:00:00')
theTest('日期时间范围- 默认数组', { value: ['2020', '2021'] }, {}, '2020-01-01 00:00:00-2021-01-01 00:00:00')
theTest('日期时间范围- 非字符串', { value: new Date() }, { format: 'YYYY' }, `${new Date().getFullYear()}`)
theTest('日期时间范围- 设置格式', { value: '2020,2021' }, { format: 'YYYY' }, '2020-2021')
theTest('日期时间范围- 设置分隔符', { value: '2020,2021' }, { format: 'YYYY', split: '~' }, '2020~2021')
