import React from 'react'
import { render, cleanup } from '@testing-library/react'
import NumberRangeColumn, { NumberRangeColumnConfig } from '.'
import { ColumnProps } from '../common'

// 默认入参
const defaultProps: ColumnProps<NumberRangeColumnConfig> = {
    ref: async () => { },
    record: {},
    value: '',
    data: [],
    step: 0,
    config: { type: 'numberRange', field: 'test', label: 'test' }
}

const theTest = (message: string, setvalue: any, config: any, successValue: any) => {
    test(message, () => {
        return new Promise((resolve) => {
            render(
                <NumberRangeColumn
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

theTest('数值范围- 未配置', { value: "" }, {}, "")
theTest('数值范围- value为空有默认值', { value: "" }, { defaultValue: '暂无信息', }, "暂无信息")
theTest('数值范围- 默认暂无信息', {}, { defaultValue: '暂无信息', }, "暂无信息")
theTest('数值范围- 单独一个数', { value: "2020" }, {}, "2020")
theTest('数值范围- 默认字符串', { value: '10,20' }, {}, "10-20")
theTest('数值范围- 默认数组', { value: [2020, 2021] }, { }, "2020-2021")
theTest('数值范围- 单个数值', { value: 2020 }, { }, "2020")
theTest('数值范围- 设置分隔符', { value: "2020,2021" }, { split: "~" }, "2020~2021")
theTest('数值范围- 单个数值 其它参数', { value: new Date() }, { precision: 2 }, (new Date().getTime()).toFixed(2))
theTest('数值范围- 配置数值小数点', { value: [2020, 2021] }, { precision: 2, split: "~" }, "2020.00~2021.00")