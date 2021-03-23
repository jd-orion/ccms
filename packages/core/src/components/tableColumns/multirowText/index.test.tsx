import React from 'react'
import { render, cleanup } from '@testing-library/react'
import MultirowColumn, { MultirowColumnConfig } from '.'
import { ColumnProps } from '../common'
import renderer from 'react-test-renderer'

// 默认入参
const defaultProps: ColumnProps<MultirowColumnConfig> = {
    ref: async () => { },
    record: {},
    value: '',
    data: [],
    step: 0,
    config: { type: 'multirowText', field: 'test', label: 'test' }
}

const theTest = (message: string, setvalue: any, config: any, successValue: any) => {
    test(message, () => {
        return new Promise((resolve) => {
            render(
                <MultirowColumn
                    {...Object.assign(defaultProps, setvalue)}
                    config={Object.assign(defaultProps.config, config)}
                    ref={async (ref: any) => {
                        if (ref) {
                            const value = await ref?.getValue('test')
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

theTest('多行文本- 未配置', { value: "" }, {}, [])
theTest('多行文本- 暂无信息', { value: null }, { defaultValue: '暂无信息', }, ['暂无信息'])

test("多行文本- 无内容渲染 验证dom长度", () => {
    return new Promise((resolve) => {

        const renderTest = renderer.create(<MultirowColumn
            {...Object.assign(defaultProps, { value: null })}
            config={Object.assign(defaultProps.config,{ defaultValue: '暂无信息'})}
            ref={async (ref: any) => {
                if (ref) {
                    const value = await ref?.getValue()
                    expect(value).toEqual(['暂无信息'])
                    cleanup()
                    resolve(true)
                }
            }}
        />)
        const o = renderTest.toJSON()
        const testInstance = renderTest.root;
        expect(testInstance.children.length).toEqual(1)
    })
})

theTest('多行文本- 配置默认格式 单行 非字符串', { value: 1 }, {}, [1])
theTest('多行文本- 配置默认格式 单行 字符串', { value: '1' }, {}, ['1'])
theTest('多行文本- 配置默认格式', { value: '第一行,第二行' }, {}, ["第一行", "第二行"])
theTest('多行文本- 数组', { value: ["第一行", "第二行"] }, {}, ["第一行", "第二行"])
theTest('多行文本- 添加前缀', { value: '第一行,第二行' }, { style: { prefix: "LINE:" } }, ["LINE:第一行", "LINE:第二行"])
theTest('多行文本- 添加后缀', { value: '第一行,第二行' }, { style: { postfix: "end" } }, ["第一行end", "第二行end"])
theTest('多行文本- 添加前后缀', { value: '第一行,第二行' }, { style: { prefix: "LINE:", postfix: "end" } }, ["LINE:第一行end", "LINE:第二行end"])


test("多行文本- 有内容 验证dom长度", () => {
    return new Promise((resolve) => {
        const renderTest = renderer.create(<MultirowColumn
            {...Object.assign(defaultProps, { value: '第一行,第二行' })}
            config={Object.assign(defaultProps.config, { style: { prefix: "", postfix: '' } })}
            ref={async (ref: any) => {
                if (ref) {
                    const value = await ref?.getValue()
                    expect(value).toEqual(["第一行", "第二行"])
                    cleanup()
                    resolve(true)
                }
            }}
        />)
        const o = renderTest.toJSON()
        expect(o).toMatchSnapshot()
        const testInstance = renderTest.root;
        expect(testInstance.children.length).toEqual(2)
    })

})