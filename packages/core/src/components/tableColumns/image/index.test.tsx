import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { ColumnProps } from '../common'
import ImageColumn, { ImageColumnConfig } from '.'

// 默认入参
const defaultProps: ColumnProps<ImageColumnConfig> = {
  ref: async () => { },
  record: {},
  value: '',
  data: [],
  step: 0,
  config: {
    type: 'image',
    field: 'imageVaule',
    label: 'image',
    size: {
      height: '',
      width: ''
    }
  }
}

const theTest = (message: string, setvalue: any, config: any, successValue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
                <ImageColumn
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

theTest('数值- 未配置', {}, {}, '')
theTest('数值- 未配置defaultValue', { value: 'url地址' }, {}, 'url地址')
theTest('数值- 未配置value', {}, { defaultValue: 'url地址' }, 'url地址')
