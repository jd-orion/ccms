import React from 'react'
import { render, cleanup } from '@testing-library/react'
import Column, { ColumnProps, ColumnConfig } from './tableColumns/common'

// 默认入参
const defaultProps: ColumnProps<ColumnConfig> = {
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
                <Column
                    {...Object.assign(defaultProps, setvalue)}
                    config={Object.assign(defaultProps.config, config)}
                    ref={async (ref: any) => {
                        if (ref) {
                            const value = await ref?.getValue()
                            expect(value).toEqual(successValue)
                            const render = await ref?.renderComponent()
                            expect(render).toEqual(<React.Fragment>您当前使用的UI版本没有实现Column组件。</React.Fragment>)
                            resolve(true)
                            cleanup()
                        }
                    }}
                />
            )
        })
    })
}

theTest('例- 未配置', { value: "" }, {}, "")
theTest('例- 配置默认格式', { value: 2020 }, {}, 2020)
theTest('例- value为空', { value: "" }, {}, "")



import { Field, FieldProps, FieldConfig } from './formFields/common'
import { setValue } from '../util/value'

// 默认入参
const FielddefaultProps: FieldProps<FieldConfig, string> = {
    ref: async (ref) => { },
    formLayout: 'horizontal',
    value: '',
    data: [{}],
    step: 0,
    config: { field: 'jest', label: 'jest' },
    onChange: async () => { },
    record: {},
    onValueSet: async () => {},
    onValueUnset: async () => {},
    onValueListAppend: async () => {},
    onValueListSplice: async () => {},
    baseRoute: '/',
    loadDomain: async () => 'hello'
}

const FieldTest = (message: string, setvalue: any, config: any) => {
    test(message, () => {
        return new Promise((resolve) => {
            render(
                <Field
                    {...Object.assign(FielddefaultProps, setvalue)}
                    config={Object.assign(FielddefaultProps.config, config)}
                    ref={async (ref: any) => {
                        if (ref) {
                            const render = await ref?.renderComponent()
                            expect(render).toEqual(<React.Fragment>
                                当前UI库未实现该表单类型
                              </React.Fragment>)

                            const fieldFormat = await ref?.fieldFormat()
                            expect(fieldFormat).toEqual({})

                            const validate = await ref?.validate()
                            expect(validate).toEqual(true)

                            const reset = await ref?.reset()
                            expect(reset).toEqual(undefined)

                            resolve(true)
                            cleanup()
                        }
                    }}
                />
            )
        })
    })
}

FieldTest('例- 未配置', { value: "" }, {})