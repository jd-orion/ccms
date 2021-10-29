import React from 'react'
import { render, cleanup } from '@testing-library/react'
import NumberField, { NumberFieldConfig } from '.'
import renderer from 'react-test-renderer'
import { FieldError, FieldProps } from '../common'
import moment from 'moment'

// 默认入参
const defaultProps: FieldProps<NumberFieldConfig, string | number | undefined> = {
  ref: async (ref) => { },
  formLayout: 'horizontal',
  value: '',
  data: [{}],
  step: 0,
  config: { type: 'number', field: 'test', label: 'test' },
  onChange: async () => { },
  record: {},
  onValueSet: async () => {},
  onValueUnset: async () => {},
  onValueListAppend: async () => {},
  onValueListSplice: async () => {},
  loadDomain: async () => 'hello'
}
// config={Object.assign(defaultProps, config)}
const theTest = (message: string, setvalue: any, config: any, successValue: any, getValue: any) => {
    test(message, () => {
        return new Promise((resolve) => {
            render(
                <NumberField
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


theTest('数值- 未配置', { value: "" }, {}, "", "")
theTest('数值- 配置默认格式', { value: 2 }, { defaultValue: { source: 'static', value: 2 } }, 2, 2)
theTest('数值- 配置小数位', { value: "2" }, { defaultValue: { source: 'static', value: "2" }, precision: 2 }, "2", "2")

const validateTest = (message: string, config: NumberFieldConfig, successValue: string, failValue: any, errorMessage?: string | true) => {
    test(message, () => {
        return new Promise((resolve) => {
            render(
                <NumberField
                {...defaultProps}
                    ref={async (ref: any) => {
                        if (ref) {
                            const success = await ref.validate(successValue)
                            successValue && expect(success).toEqual(true)

                            const fail = await ref.validate(failValue)
                            if(errorMessage !== true){
                                expect(fail).toContainEqual(new FieldError(errorMessage || ''))
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


validateTest('数值- 格式验证 - 自定义precision', Object.assign({ required: false }, defaultProps.config, {
    default: {
        type: 'static', value: '2.0'
    },
    precision: 2,
}), '', '2.0', '必须为2小数')

validateTest('数值- 格式验证 - 默认提示', Object.assign({ required: false }, defaultProps.config, {
    default: {
        type: 'static', value: new Date()
    },
    regExp: {
        expression: "\w+"
    }
}), '', 'YYYY', '格式错误')

validateTest('数值- 格式验证 - 正确', Object.assign({ required: false }, defaultProps.config, {
    default: {
        type: 'static', value: new Date()
    },
    regExp: {
        expression: "\\d+"
    }
}), '', '2', true)

validateTest('数值- 格式验证 - 自定义提示', Object.assign({ required: false }, defaultProps.config, {
    default: {
        type: 'static', value: 2
    },
    regExp: {
        expression: "/\\d+/",
        message: "message"
    }
}), '', '2', 'message')


validateTest('数值- 必填校验', Object.assign({ required: true }, defaultProps.config), '*', '', '不能为空')

validateTest('数值- 最大值比较', Object.assign({ value: 4, required: true }, defaultProps.config, {
    max: 3,
    default: {
        type: 'static', value: 4,
    }
}), '', '4', '值不能大于3')

validateTest('数值- 最小值比较', Object.assign({ value: 2, required: true }, defaultProps.config, {
    min: 3,
    default: {
        type: 'static', value: 2,
    }
}), '', '2', '值不能小于3')

validateTest('数值- precision小数值配置', Object.assign({ value: 2, required: true }, defaultProps.config, {
    precision: 2,
    default: {
        type: 'static', value: 2,
    }
}), '', '2', '必须为2小数')

validateTest('数值- precision小数值配置2', Object.assign({ value: '2.0', required: true }, defaultProps.config, {
    precision: 2,
    default: {
        type: 'static', value: 2,
    }
}), '', '2.0', '必须为2小数')



const submitFormatTest = (message: string, config: NumberFieldConfig, resInfo: any) => {
    test(message, () => {
        return new Promise((resolve) => {
            render(
                <NumberField
                    {...defaultProps}
                    ref={async (ref: any) => {
                        if (ref) {

                            const fieldFormat = await ref.fieldFormat()
                            if (defaultProps.config.precision) {
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

submitFormatTest('数值- 提交数据验证-无precision', {
    type: 'number', field: 'test', label: 'test'
}, {})

submitFormatTest('数值- 提交数据验证-有precision', {
    type: 'number', field: 'test', label: 'test',
    defaultValue: {
        source: 'static',
        value: 2
    },
    precision: 2
}, { test: Number(2).toFixed(2).toString() })

test('数值- onChange', () => {
    return new Promise((resolve) => {
        const component = renderer.create(
            <NumberField
                {...defaultProps}
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
