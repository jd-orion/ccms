import React from 'react'
import { render, cleanup } from '@testing-library/react'
import EnumColumn, { EnumColumnConfig } from '.'
import { ColumnProps } from '../common'

// 默认入参
const defaultProps: ColumnProps<EnumColumnConfig> = {
  ref: async () => { },
  record: {},
  value: '',
  data: [],
  step: 0,
  config: {
    type: 'Aenum',
    field: 'test',
    label: 'test',
    valueType: 'string',
    multiple: true,
    options: {
      from: 'manual',
      data: {
        extra: ['a'],
        label: '1',
        key: 'filed'
      }
    }
  }
}

const theTest = (message: string, setvalue: any, config: any, successValue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <EnumColumn
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

theTest('enum- 未配置', { value: '' }, {}, '')
theTest('enum- 配置默认格式', { value: '2020' }, { options: null }, '2020')

theTest('enum- value为空', { value: '' }, { defaultValue: '暂无信息' }, '暂无信息')
theTest('enum- 选项值', { value: 0 }, {
  options: {
    from: 'manual',
    getKey: 'value',
    getValue: 'label',
    data: [
      {
        value: 0,
        label: '快速失效'
      },
      {
        value: 1,
        label: 'Warm Up'
      },
      {
        value: 2,
        label: '排队等待'
      }
    ]
  }
}, '快速失效')

theTest('enum- 选项值多个', { value: [1, 2] }, {
  options: {
    from: 'manual',
    getKey: 'value',
    getValue: 'label',
    data: [
      {
        value: 0,
        label: '快速失效'
      },
      {
        value: 1,
        label: 'Warm Up'
      },
      {
        value: 2,
        label: '排队等待'
      }
    ]
  }
}, 'Warm Up,排队等待')

theTest('enum- 选项值多个', { value: '0,1' }, {
  options: {
    from: 'manual',
    data: [
      {
        value: 0,
        label: '快速失效'
      },
      {
        value: 1,
        label: 'Warm Up'
      },
      {
        value: 2,
        label: '排队等待'
      }
    ]
  }
}, '快速失效,Warm Up')
theTest('enum- 选项值多个', { value: '0|1' }, {
  multiple: {
    type: 'split',
    split: '|'
  },
  options: {
    from: 'manual',
    getKey: 'value',
    getValue: 'label',
    data: [
      {
        value: 0,
        label: '快速失效'
      },
      {
        value: 1,
        label: 'Warm Up'
      },
      {
        value: 2,
        label: '排队等待'
      }
    ]
  }
}, '快速失效,Warm Up')
