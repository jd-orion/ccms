import React from 'react'
import { render, cleanup } from '@testing-library/react'
import renderer from 'react-test-renderer'
import LongTextField, { LongtextFieldConfig } from '.'
import { FieldError, FieldProps } from '../common'

// 默认入参
const defaultProps: FieldProps<LongtextFieldConfig, string> = {
  ref: async (ref) => { },
  formLayout: 'horizontal',
  value: '',
  data: [{}],
  step: 0,
  config: { field: 'jest', label: 'jest', type: 'longtext' },
  onChange: async () => { },
  record: {}
}

test('长文本- 默认值 - 未配置', () => {
  return new Promise((resolve) => {
    render(
      <LongTextField
        {...defaultProps}
        ref={async (ref) => {
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

test('长文本- 默认值 - 静态值', () => {
  return new Promise((resolve) => {
    render(
      <LongTextField
        {...defaultProps}
        ref={async (ref) => {
          if (ref) {
            const value = await ref.reset()
            expect(value).toEqual('default')
          }
          cleanup()
          resolve(true)
        }}
        config={{ field: 'jest', label: 'jest', type: 'longtext', default: { type: 'static', value: 'default' } }}
      />
    )
  })
})

test('长文本- 解析', () => {
  return new Promise((resolve) => {
    render(
      <LongTextField
        {...defaultProps}
        ref={async (ref) => {
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

const validateTest = (message: string, config: LongtextFieldConfig, successValue: string, failValue: string, errorMessage?: string) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
        <LongTextField
          {...defaultProps}
          ref={async (ref) => {
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

validateTest('长文本- 必填校验', Object.assign({ required: true }, defaultProps.config), '*', '', '不能为空')
validateTest('长文本- 类型校验-数字', Object.assign({ characterType: { enable: true, number: true } }, defaultProps.config), '1', '1aA中_-', '仅能输入数字')
validateTest('长文本- 类型校验-大写拉丁字母', Object.assign({ characterType: { enable: true, uppercase: true } }, defaultProps.config), 'A', '1aA中_-', '仅能输入大写拉丁字母')
validateTest('长文本- 类型校验-小写拉丁字母', Object.assign({ characterType: { enable: true, lowercase: true } }, defaultProps.config), 'a', '1aA中_-', '仅能输入小写拉丁字母')
validateTest('长文本- 类型校验-中日韩字符', Object.assign({ characterType: { enable: true, cjk: true } }, defaultProps.config), '中', '1aA中_-', '仅能输入中日韩字符')
validateTest('长文本- 类型校验-下划线', Object.assign({ characterType: { enable: true, underline: true } }, defaultProps.config), '_', '1aA中_-', '仅能输入下划线')
validateTest('长文本- 类型校验-中划线', Object.assign({ characterType: { enable: true, hyphen: true } }, defaultProps.config), '-', '1aA中_-', '仅能输入中划线')
validateTest('长文本- 最大长度校验', Object.assign({ maxLength: 5 }, defaultProps.config), '12345', '123456', '最长可输入5个字符。')
validateTest('长文本- 最小长度校验', Object.assign({ minLength: 5 }, defaultProps.config), '12345', '1234', '最短需输入5个字符。')
validateTest('长文本- 最大长度校验-中日韩字符', Object.assign({ maxLength: 5, cjkLength: 2 }, defaultProps.config), '中中', '中中中', '最长可输入5个字符。')
validateTest('长文本- 最小长度校验-中日韩字符', Object.assign({ minLength: 5, cjkLength: 2 }, defaultProps.config), '中中中', '中中', '最短需输入5个字符。')
validateTest('长文本- 正则校验-默认提示', Object.assign({ regExp: { expression: '^[0-9]$' } }, defaultProps.config), '0', 'a', '格式错误')
validateTest('长文本- 正则校验-自定提示', Object.assign({ regExp: { expression: '^[0-9]$', message: '提示' } }, defaultProps.config), '0', 'a', '提示')

test('长文本- 渲染', async () => {
  const component = renderer.create(
    <LongTextField {...defaultProps} ref={async (ref) => { }} />
  )

  const o = component.toJSON()
  expect(o).toMatchSnapshot()
})

test('长文本- onChange', () => {
  return new Promise((resolve) => {
    const component = renderer.create(
      <LongTextField
        {...defaultProps}
        ref={async (ref) => { }}
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
