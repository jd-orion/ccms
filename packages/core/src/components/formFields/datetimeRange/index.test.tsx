import React from 'react'
import { render, cleanup } from '@testing-library/react'
import DatetimeRangeField, { DatetimeRangeFieldConfig } from '.'
import renderer from 'react-test-renderer'
import { FieldError, FieldProps } from '../common'
import moment from 'moment'

// 默认入参
const defaultProps: FieldProps<DatetimeRangeFieldConfig, [moment.Moment, moment.Moment] | undefined> = {
  ref: async (ref: any) => { },
  formLayout: 'horizontal',
  value: undefined,
  data: [{}],
  step: 0,
  config: { type: 'datetimeRange', field: 'test', label: 'test' },
  onChange: async () => { },
  record: {},
  onValueSet: async () => {},
  onValueUnset: async () => {},
  onValueListAppend: async () => {},
  onValueListSplice: async () => {},
  baseRoute: '/',
  loadDomain: async () => 'hello'
}

const theTest = (message: string, setvalue: any, config: any, successValue: any, getValue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <DatetimeRangeField
                    {...Object.assign(defaultProps, setvalue)}
                    config={Object.assign(defaultProps.config, config)}
                    ref={async (ref: any) => {
                      if (ref) {
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

theTest('时间范围- 未配置', { value: '' }, {}, '', '')

const theRestTest = (message: string, setvalue: any, rsvalue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <DatetimeRangeField
                    {...Object.assign(defaultProps, { value: setvalue.value })}
                    config={{ type: 'datetimeRange', field: 'test', label: 'test', fieldRange: 'test1', defaultValue: { value: setvalue.value, source: 'static' } }}
                    ref={async (ref: any) => {
                      if (ref) {
                        const value = await ref.reset()
                        expect(value).toEqual(rsvalue)
                        cleanup()
                        resolve(true)
                      }
                    }}
                />
      )
    })
  })
}
theRestTest('时间范围- 配置', { value: '2020,2021' }, ['2020', '2021'])
theRestTest('时间范围- 配置错误', { value: 2 }, undefined)
theRestTest('时间范围- 配置数组', { value: ['2020', '2021'] }, ['2020', '2021'])
theRestTest('时间范围- 配置对象', { value: { test: '2020', test1: '2021' } }, ['2020', '2021'])

const formatTest = (message: string, setvalue: any, config: any, getValue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <DatetimeRangeField
                    {...Object.assign(defaultProps, setvalue)}
                    config={Object.assign(defaultProps.config, config)}
                    ref={async (ref: any) => {
                      if (ref) {
                        const getvalue = await ref.getTime(setvalue.value)
                        expect(getvalue).toEqual(getValue)
                        const testempty = await ref.getTime()
                        expect(testempty).toEqual('')
                        cleanup()
                        resolve(true)
                      }
                    }}
                />
      )
    })
  })
}

formatTest('时间范围- 配置默认格式', { value: '2020' }, { default: { type: 'static', value: '2020' } }, moment('2020').format('YYYY-MM-DD HH:mm:ss'))
formatTest('时间范围- 配置时间格式 年', { value: '2020' }, { default: { type: 'static', value: '2020' }, format: 'YYYY' }, moment('2020').format('YYYY'))
formatTest('时间范围- 配置时间格式 月', { value: '2020' }, { default: { type: 'static', value: '2020' }, format: 'MM' }, moment('2020').format('MM'))
formatTest('时间范围- 配置时间格式 时分秒', { value: '2020' }, { default: { type: 'static', value: '2020' }, format: 'HH:mm:ss' }, moment('2020').format('HH:mm:ss'))
formatTest('时间范围- 配置时间格式', { value: '2020' }, { default: { type: 'static', value: '2020' }, format: 'YYYY' }, moment('2020').format('YYYY'))

const validateTest = (message: string, setvalue: any, config: DatetimeRangeFieldConfig, successValue: any, failValue: any, errorMessage?: string | true) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <DatetimeRangeField
                    {...Object.assign(defaultProps, setvalue)}
                    ref={async (ref: any) => {
                      if (ref) {
                        const success = await ref.validate(successValue)
                        successValue && expect(success).toEqual(true)

                        cleanup()
                        resolve(true)
                      }
                    }}
                    config={Object.assign({ type: 'datetimeRange', field: 'test', label: 'test' }, config)}
                    onChange={async () => { }}
                />
      )
    })
  })
}

validateTest('时间范围- 为空校验-不校验', { value: undefined }, Object.assign(defaultProps.config, {
  default: {
    type: 'static', value: undefined
  }
}), '', 2, '')

validateTest('时间范围- 为空校验-校验通过', { value: ['2020', '2021'] }, Object.assign(defaultProps.config, {
  default: {
    type: 'static', value: ['2020', '2021']
  }
}), '', 2, '')
validateTest('时间范围- 为空校验-校验通过', { value: ['2020', '2021'] }, Object.assign(defaultProps.config, {
  require: true,
  default: {
    type: 'static', value: ['2020', '2021']
  }
}), ['2020', '2021'], 2, '')

validateTest('时间范围- 校验通过', { value: 'YYYY' }, Object.assign({ required: false }, defaultProps.config, {
  default: {
    type: 'static', value: 'YYYY'
  },
  regExp: {
    expression: '\\w+',
    message: 'message'
  }
}), 'YYYY', '', '')

const validateTestFail = (message: string, setvalue: any, config: DatetimeRangeFieldConfig, errorMessage?: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <DatetimeRangeField
                    {...Object.assign(defaultProps, setvalue)}
                    ref={async (ref: any) => {
                      if (ref) {
                        const fail = await ref.validate(setvalue.value)
                        expect(fail).toContainEqual(new FieldError(errorMessage || ''))

                        cleanup()
                        resolve(true)
                      }
                    }}
                    config={Object.assign({ type: 'datetimeRange', field: 'test', label: 'test' }, config)}
                    onChange={async () => { }}
                />
      )
    })
  })
}

validateTestFail('时间范围- 为空校验', { value: undefined }, Object.assign(defaultProps.config, {
  required: true,
  default: {
    type: 'static', value: undefined
  }
}), '不能为空')
validateTestFail('时间范围- 格式验证 - 默认提示', { value: 'YYYY' }, Object.assign({ required: false }, defaultProps.config, {
  default: {
    type: 'static', value: 'YYYY'
  },
  regExp: {
    expression: '\\d+'
  }
}), '格式错误')

validateTestFail('时间范围- 格式验证 - 定义提示', { value: 'YYYY' }, Object.assign({ required: false }, defaultProps.config, {
  default: {
    type: 'static', value: 'YYYY'
  },
  regExp: {
    expression: '\\d+',
    message: 'message'
  }
}), 'message')

const submitFormatTest = (message: string, config: DatetimeRangeFieldConfig, resInfo: any, value: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <DatetimeRangeField
                    {...Object.assign(defaultProps, value)}
                    ref={async (ref: any) => {
                      if (ref) {
                        const fieldFormat = await ref.fieldFormat()
                        if (defaultProps.config.fieldRange || config.fieldRange) {
                          expect(fieldFormat).toEqual(resInfo)
                        } else {
                          expect(fieldFormat).toEqual({})
                        }
                        cleanup()
                        resolve(true)
                      }
                    }}
                    config={config}
                    onChange={async () => { }}
                />
      )
    })
  })
}

submitFormatTest('时间范围- 提交数据验证', {
  type: 'datetimeRange', field: 'test', label: 'test', defaultValue: { value: '', source: 'static' }
}, {}, { value: '' })

submitFormatTest('时间范围- 配置时间 提交格式', { type: 'datetimeRange', field: 'test', label: 'test', defaultValue: { value: '2020,2021', source: 'static' }, submitFormat: 'YYYY' }, { test: '2020' }, { value: '2020,2021' })
submitFormatTest('时间范围- 配置时间 原数据是字符串', {
  type: 'datetimeRange',
  field: 'test',
  label: 'test',
  defaultValue: {
    value: '2020,2021', source: 'static'
  },
  submitFormat: 'YYYY',
  fieldRange: 'test1'
}, {
  test: '2020',
  test1: '2021'
}, { value: '2020,2021' })
submitFormatTest('时间范围- 配置时间 提交格式 原数据是数组', {
  type: 'datetimeRange',
  field: 'test',
  label: 'test',
  defaultValue: {
    value: '2020,2021', source: 'static'
  },
  submitFormat: 'YYYY',
  fieldRange: 'test1'
}, {
  test: '2020',
  test1: '2021'
}, { value: ['2020', '2021'] })

test('时间范围- onChange', () => {
  return new Promise((resolve) => {
    const component = renderer.create(
            <DatetimeRangeField
                {...Object.assign(defaultProps, undefined)}
                ref={async (ref: any) => { }}
                onValueSet={async (value) => {
                  expect(value).toEqual('')
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

theTest('时间范围- 配置提交格式', { value: ['2020', '2021'] }, {
  format: 'YYYY'
}, '', ['2020', '2021'])
theTest('时间范围- 配置提交格式 comma', { value: ['2020', '2021'] }, {
  submitFormat: 'YYYY',
  submitFormatMode: 'comma'
}, '', '2020,2021')
