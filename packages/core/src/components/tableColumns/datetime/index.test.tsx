import React from 'react'
import { render, cleanup } from '@testing-library/react'
import DatetimeColumn, { DatetimeColumnConfig } from '.'
import { ColumnProps } from '../common'

// 默认入参
const defaultProps: ColumnProps<DatetimeColumnConfig> = {
    ref: async () => { },
    record: {},
    value: '',
    data: [],
    step: 0,
    config: { type: 'datetime', field: 'test', label: 'test' }
}

const theTest = (message: string, setvalue: any, config: any, successValue: string | undefined) => {
    test(message, () => {
        return new Promise((resolve) => {
            render(
                <DatetimeColumn
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

theTest('日期时间- 未配置', { value: "" }, {}, undefined)
theTest('日期时间- 配置默认格式', { value: "2020" }, {}, "2020-01-01 00:00:00")
theTest('日期时间- 配置自定义格式', { value: "2020-01-01 00:00:00" }, { format: "YYYY", }, "2020")
theTest('日期时间- 默认暂无信息', { value: "" }, { defaultValue: '暂无信息', }, "暂无信息")
