import React from 'react'
import { getParamText, setValue } from './value'
import { requestCondition } from './request'

test('getParamText- ', () => {
    const value = getParamText('sss', [
        {
            field: 'radio',
            data: {
                source: 'record',
                field: 'radio'
            }
        },
        {
            field: 'radio',
            data: {
                source: 'data',
                field: 'radio'
            }
        },
        {
            field: 'radio',
            data: {
                source: 'source',
                field: 'radio'
            }
        },
        {
            field: 'radio',
            data: {
                source: 'url',
                field: 'radio'
            }
        },
        {
            field: 'radio',
            data: {
                source: 'step',
                field: 'radio',
                step: 1
            }
        },
        {
            field: 'radio'
        }
    ], {
        record: {},
        data: [{}],
        step: 1
    })
    expect(value).toBe('sss');
})

test('setValue- ', () => {
    const value = setValue({}, "value", 'appId')
    expect(value).toEqual({ value: "appId" })

    const value1 = setValue({}, "value.a", 'appId')
    expect(value1).toEqual({ value: { a: "appId" } })

    const value2 = setValue({}, "value.0", 'appId')
    expect(value2).toEqual({ "value": { "0": "appId" } })


})