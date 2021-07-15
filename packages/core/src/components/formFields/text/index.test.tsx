import React from 'react'
import { render, cleanup } from '@testing-library/react'
import renderer from 'react-test-renderer'
import TextField, { TextFieldConfig } from '.'
import { FieldError, FieldProps } from '../common'

// 默认入参
const defaultProps: FieldProps<TextFieldConfig, string> = {
  ref: async (ref: any) => { },
  formLayout: 'horizontal',
  value: '',
  data: [{}],
  step: 0,
  config: { field: 'jest', label: 'jest', type: 'text' },
  onChange: async () => { },
  record: {}
}

test('文本框默认值 - 未配置', () => {
  return new Promise((resolve) => {
    render(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => {
          if (ref) {
            const value = await ref.reset()
            expect(value).toEqual('')
          }
          cleanup()
          resolve(true)
        }}
      />
    )
  })
})

test('文本框默认值 - 静态值', () => {
  return new Promise((resolve) => {
    render(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => {
          if (ref) {
            const value = await ref.reset()
            expect(value).toEqual('default')
          }
          cleanup()
          resolve(true)
        }}
        config={{ field: 'jest', label: 'jest', type: 'text', default: { type: 'static', value: 'default' } }}
      />
    )
  })
})
test('文本框默认值 -数据值', () => {
  return new Promise((resolve) => {
    render(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => {
          if (ref) {
            const value = await ref.reset()
            expect(value).toEqual('')
          }
          cleanup()
          resolve(true)
        }}
        config={{ field: 'jest', label: 'jest', type: 'text', default: { type: 'data', value: 'default' } }}
      />
    )
  })
})
test('文本框默认值 -数据值 query', () => {
  return new Promise((resolve) => {
    render(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => {
          if (ref) {
            const value = await ref.reset()
            expect(value).toEqual('')
          }
          cleanup()
          resolve(true)
        }}
        config={{ field: 'jest', label: 'jest', type: 'text', default: { type: 'query', value: 'default' } }}
      />
    )
  })
})

test('文本框默认值 -数据值 hash', () => {
  return new Promise((resolve) => {
    render(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => {
          if (ref) {
            const value = await ref.reset()
            expect(value).toEqual('')
          }
          cleanup()
          resolve(true)
        }}
        config={{ field: 'jest', label: 'jest', type: 'text', default: { type: 'hash', value: 'default' } }}
      />
    )
  })
})
test('文本框默认值 - 接口值 -GET', () => {
  return new Promise((resolve) => {
    render(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => {
          if (ref) {
            const value = await ref.reset()
            expect(typeof value).toEqual('string')
          }
          cleanup()
          resolve(true)
        }}
        config={{
          field: 'jest',
          label: 'jest',
          type: 'text',
          default: {
            type: 'interface',
            api: {
              url: 'http://j-api.jd.com/mocker/data?p=263&v=POST&u=list.do',
              method: 'GET',
              contentType: 'json',
              withCredentials: true
            },
            apiResponse: 'result.0.datetime'
          }
        }}
      />
    )
  })
})
test('文本框默认值 - 接口值 -POST', () => {
  return new Promise((resolve) => {
    render(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => {
          if (ref) {
            const value = await ref.reset()
            expect(typeof value).toEqual('string')
          }
          cleanup()
          resolve(true)
        }}
        config={{
          field: 'jest',
          label: 'jest',
          type: 'text',
          default: {
            type: 'interface',
            api: {
              url: 'http://j-api.jd.com/mocker/data?p=263&v=POST&u=list.do',
              method: 'POST',
              contentType: 'json',
              withCredentials: true
            },
            apiResponse: 'result.0.datetime'
          }
        }}
      />
    )
  })
})
test('文本框默认值 - 接口值 -fial', () => {
  return new Promise((resolve) => {
    render(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => {
          if (ref) {
            const value = await ref.reset()
            expect(typeof value).toEqual('string')
          }
          cleanup()
          resolve(true)
        }}
        config={{
          field: 'jest',
          label: 'jest',
          type: 'text',
          default: {
            type: 'interface',
            api: {
              url: 'http://j-api.jd.com/mocker/data/',
              method: 'POST',
              contentType: 'json',
              withCredentials: true
            },
            apiResponse: 'result.0.datetime'
          }
        }}
      />
    )
  })
})
test('文本框解析', () => {
  return new Promise((resolve) => {
    render(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => {
          if (ref) {
            await ref.set('test')
          }
        }}
        onChange={async (value) => {
          expect(value).toEqual('test')
          cleanup()
          resolve(true)
        }}
      />
    )
  })
})

const validateTest = (message: string, config: TextFieldConfig, successValue: string, failValue: string, errorMessage?: string) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
        <TextField
          {...defaultProps}
          ref={async (ref: any) => {
            if (ref) {
              const success = await ref.validate(successValue)
              expect(success).toEqual(true)

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

validateTest('文本框必填校验', Object.assign({ required: true }, defaultProps.config), '*', '', '不能为空')
validateTest('文本框类型校验-数字', Object.assign({ characterType: { enable: true, number: true } }, defaultProps.config), '1', '1aA中_-', '仅能输入数字')
validateTest('文本框类型校验-大写拉丁字母', Object.assign({ characterType: { enable: true, uppercase: true } }, defaultProps.config), 'A', '1aA中_-', '仅能输入大写拉丁字母')
validateTest('文本框类型校验-小写拉丁字母', Object.assign({ characterType: { enable: true, lowercase: true } }, defaultProps.config), 'a', '1aA中_-', '仅能输入小写拉丁字母')
validateTest('文本框类型校验-中日韩字符', Object.assign({ characterType: { enable: true, cjk: true } }, defaultProps.config), '中', '1aA中_-', '仅能输入中日韩字符')
validateTest('文本框类型校验-下划线', Object.assign({ characterType: { enable: true, underline: true } }, defaultProps.config), '_', '1aA中_-', '仅能输入下划线')
validateTest('文本框类型校验-中划线', Object.assign({ characterType: { enable: true, hyphen: true } }, defaultProps.config), '-', '1aA中_-', '仅能输入中划线')
validateTest('文本框最大长度校验', Object.assign({ maxLength: 5 }, defaultProps.config), '12345', '123456', '最长可输入5个字符。')
validateTest('文本框最小长度校验', Object.assign({ minLength: 5 }, defaultProps.config), '12345', '1234', '最短需输入5个字符。')
validateTest('文本框最大长度校验-中日韩字符', Object.assign({ maxLength: 5, cjkLength: 2 }, defaultProps.config), '中中', '中中中', '最长可输入5个字符。')
validateTest('文本框最小长度校验-中日韩字符', Object.assign({ minLength: 5, cjkLength: 2 }, defaultProps.config), '中中中', '中中', '最短需输入5个字符。')
validateTest('文本框正则校验-默认提示', Object.assign({ regExp: { expression: '^[0-9]$' } }, defaultProps.config), '0', 'a', '格式错误')
validateTest('文本框正则校验-自定提示', Object.assign({ regExp: { expression: '^[0-9]$', message: '提示' } }, defaultProps.config), '0', 'a', '提示')

test('文本框渲染', async () => {
  const component = renderer.create(
    <TextField {...defaultProps} ref={async (ref: any) => { }} />
  )

  const o = component.toJSON()
  expect(o).toMatchSnapshot()
})

test('文本框onChange', () => {
  return new Promise((resolve) => {
    const component = renderer.create(
      <TextField
        {...defaultProps}
        ref={async (ref: any) => { }}
        onChange={async (value) => {
          expect(value).toEqual('onChange')
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
