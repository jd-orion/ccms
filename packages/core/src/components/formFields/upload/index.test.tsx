import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
// import renderer from 'react-test-renderer'
import { FieldError, FieldProps } from '../common'
import UploadField, { UploadFieldConfig } from '.'

// 上传图片入参
const uploadImageDefaultProps: FieldProps<UploadFieldConfig, any> = {
  ref: async (ref: any) => { },
  formLayout: 'horizontal',
  value: '',
  data: [{}],
  step: 0,
  config: {
    type: 'upload',
    field: 'uploadimage',
    label: 'uploadimage',
    interface: {},
    requireField: '',
    responseField: '',
    mode: 'image',
    imagePrefix: '',
    sizeCheck: {
      height: 1,
      width: 1,
      maxSize: 1
    }
  },
  onChange: async () => { },
  record: {},
  onValueSet: async (path: string, value: string, validation: true | FieldError[]) => {

  },
  onValueUnset: async () => { },
  onValueListAppend: async () => { },
  onValueListSplice: async () => { },
  baseRoute: '/',
  loadDomain: async () => 'hello'
}

// 上传文件入参
const uploadFieldDefaultProps: FieldProps<UploadFieldConfig, any> = {
  ...uploadImageDefaultProps,
  ref: async (ref: any) => { },
  config: {
    type: 'upload',
    field: 'uploadfile',
    label: 'uploadfile',
    interface: {},
    requireField: '',
    responseField: '',
    mode: 'file',
    sizeCheck: {
      maxSize: 100
    }
  }
}

const defaultProps = uploadImageDefaultProps || uploadFieldDefaultProps

const theTest = (message: string, setvalue: any, config: any, successValue: any, getValue: any) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
        <UploadField
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

theTest('upload组件- 默认值', { value: '' }, {}, '', '')

const validateTest = (message: string, config: UploadFieldConfig, successValue: string, failValue: string, errorMessage?: string) => {
  test(message, () => {
    return new Promise((resolve) => {
      render(
        <UploadField
          {...defaultProps}
          ref={async (ref: any) => {
            if (ref) {
              const success = await ref.validate(successValue)
              expect(success).toEqual(true)

              const fail = await ref.validate(failValue)
              if (fail.length) expect(fail).toContainEqual(new FieldError(errorMessage || ''))
              else expect(fail).toEqual(true)

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

validateTest('upload组件- 必填项校验', Object.assign(defaultProps.config, { required: true }), 'foo.png', '', '不能为空')
validateTest('upload组件- 非必填项校验', Object.assign(defaultProps.config, { required: false }), '', '')

const uploadTest = (message: string, props: FieldProps<UploadFieldConfig, any>, config: UploadFieldConfig, successValue: string, failValue: string, errorMessage?: string) => {
  test(message, (done) => {
    // return new Promise((resolve) => {
      // const component = renderer.create(
      //   <UploadField
      //     {...defaultProps}
      //     ref={async (ref: any) => {
      //       ref.beforeUpload = async (file: any) => {
      //         console.log('file-----', file)
      //         cleanup()
      //         resolve(true)
      //       }
      //     }}
      //   />
      // )
      // const o = component.toJSON()
      // if (o) {
      //   const file_ = { files: [{ file: 'foo.png' }] }
      //   o[1].children[0].props.onClick(file_)
      // }
    const { getByTestId } = render(
    <UploadField
      {...props}
      ref={async (ref: any) => {
        ref && (ref.beforeUpload = async (file_: any) => { // beforeUpload函数的测试，需要更多出口测试内部的异步逻辑，要修改index.tsx中beforeUpload内逻辑，如果把全部逻辑抄到这里不好 TODO
          expect(file_.type).toEqual(successValue)
          cleanup()
          done()
        })
      } }
      />)
    fireEvent.change(getByTestId('upload-input'), {
      target: {
        files: [
          new File(['foo'], 'foo.png', {
            type: 'image/png'
          })]
      }
    })
    // })
  })
}
uploadTest('upload- onChange', uploadImageDefaultProps, Object.assign(uploadImageDefaultProps.config), 'image/png', '', '')
