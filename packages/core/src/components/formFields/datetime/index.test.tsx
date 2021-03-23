import React from 'react'
import { render, cleanup } from '@testing-library/react'
import DatetimeField, { DatetimeFieldConfig } from '.'
import renderer from 'react-test-renderer'
import { FieldError, FieldProps } from '../common'
import moment from 'moment'

// 默认入参
const defaultProps: FieldProps<DatetimeFieldConfig, string> = {
    ref: async (ref) => { },
    formLayout: 'horizontal',
    value: '',
    data: [{}],
    step: 0,
    config: { type: 'datetime', field: 'test', label: 'test' },
    onChange: async () => { },
    record: {}
}

const theTest = (message: string, setvalue: any, config: any, successValue: any, getValue: any) => {
    test(message, () => {
        return new Promise((resolve) => {
            render(
                <DatetimeField
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


theTest('时间选择- 未配置', { value: "" }, {}, "", "")
theTest('时间选择- 配置默认格式', { value: "2020" }, { default: { type: 'static', value: "2020" } }, "2020", moment("2020").format("YYYY-MM-DD HH:mm:ss"))
theTest('时间选择- 配置时间格式 年', { value: "2020" }, { default: { type: 'static', value: "2020" }, format: "YYYY" }, "2020", moment("2020").format("YYYY"))
theTest('时间选择- 配置时间格式 月', { value: "2020" }, { default: { type: 'static', value: "2020" }, format: "MM" }, "2020", moment("2020").format("MM"))
theTest('时间选择- 配置时间格式 时分秒', { value: "2020" }, { default: { type: 'static', value: "2020" }, format: "HH:mm:ss" }, "2020", moment("2020").format("HH:mm:ss"))
theTest('时间选择- 配置时间格式', { value: "2020" }, { default: { type: 'static', value: "2020" }, format: "YYYY" }, "2020", moment("2020").format("YYYY"))
theTest('时间选择- 配置时间 提交格式', { value: "2020" }, { default: { type: 'static', value: "2020" }, submitFormat: "YYYY" }, "2020", moment("2020").format("YYYY"))


const validateTest = (message: string, config: DatetimeFieldConfig, successValue: string, failValue: string, errorMessage?: string) => {
    test(message, () => {
        return new Promise((resolve) => {
            render(
                <DatetimeField
                    {...defaultProps}
                    ref={async (ref) => {
                        if (ref) {
                            const success = await ref.validate(successValue)
                            successValue && expect(success).toEqual(true)

                            const fail = await ref.validate(failValue)
                            expect(fail).toContainEqual(new FieldError(errorMessage || ''))

                            cleanup()
                            resolve(true)
                        }
                    }}
                    config={config}
                />
            )
        })
    })
}


validateTest('时间选择- 格式验证 - 默认提示', Object.assign({ required: false }, defaultProps.config, {
    default: {
        type: 'static', value: new Date()
    },
    regExp: {
        expression: "/\\w+/"
    }
}), '', 'YYYY', '格式错误')

validateTest('时间选择- 格式验证 - 自定义提示', Object.assign({ required: false }, defaultProps.config, {
    default: {
        type: 'static', value: new Date()
    },
    regExp: {
        expression: "/\\d+/",
        message: "message"
    }
}), '', '2020', 'message')

validateTest('时间选择- 格式验证1', Object.assign({ required: false }, defaultProps.config, { default: { type: 'static', value: "s" } }), '2020', 'Invalid date', '格式错误')

validateTest('时间选择- 必填校验', Object.assign({ required: true }, defaultProps.config), '*', '', '不能为空')

test('时间onChange', () => {
    return new Promise((resolve) => {
        const component = renderer.create(
            <DatetimeField
                {...defaultProps}
                ref={async (ref) => { }}
                onChange={async (value) => {
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
