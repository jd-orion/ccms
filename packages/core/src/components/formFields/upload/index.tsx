import React from 'react'
import { Field, FieldConfig, FieldError, IField } from '../common'
import { getBoolean, getValue } from '../../../util/value'
import { InterfaceHelper } from '../../..'
import { InterfaceConfig } from '../../../util/interface'
import { merge } from 'lodash'

export type UploadFieldConfig = UploadFieldConfigImage | UploadFieldConfigFile
export interface UploadFieldConfigBasic extends FieldConfig {
  type: 'upload'
  interface: InterfaceConfig
  requireField: string
  responseField: string
}

export interface UploadFieldConfigImage extends UploadFieldConfigBasic {
  mode: 'image'
  imagePrefix: string
  sizeCheck?: {
    height?: number
    width?: number
    maxSize?: number,
    sizeUnit?: 'B' | 'K' | 'M' | 'G' | 'T'
  },
}
export interface UploadFieldConfigFile extends UploadFieldConfigBasic {
  mode: 'file'
  sizeCheck?: {
    maxSize?: number,
    sizeUnit?: 'B' | 'K' | 'M' | 'G' | 'T'
  },
}

export interface IUploadField {
  mode: 'image' | 'file'
  value?: string
  onChange: (file: any) => Promise<void>
  onCancel: () => Promise<void>
  readonly?: any
  disabled?: any
}

export default class UploadField extends Field<UploadFieldConfig, IUploadField, string> implements IField<string> {
  interfaceHelper = new InterfaceHelper()
  errors: FieldError[] = []

  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      return ''
    } else {
      return defaults
    }
  };

  validate = async (value: any): Promise<true | FieldError[]> => {
    const errors: FieldError[] = []

    if (this.props.config.required) {
      if (!value) {
        errors.push(new FieldError('不能为空'))
      }
    }
    errors.push(...this.errors)

    return errors.length ? errors : true
  }

  beforeUpload = async (file: any) => {
    const {
      config
    } = this.props

    this.errors = []

    if (config.mode === 'image' && file.type.indexOf('image/') !== 0) {
      this.errors.push(new FieldError('只能上传图片。'))
    }

    if (config.sizeCheck && config.sizeCheck.maxSize) {
      const maxSize = config.sizeCheck.maxSize
      let sizeString = ''
      const sizeUnit = config.sizeCheck.sizeUnit
      switch (sizeUnit) {
        case 'B':
          if (file.size > maxSize) {
            sizeString = `${maxSize}B`
          }
          break
        case 'K':
          if (file.size > maxSize * 1024) {
            sizeString = `${maxSize}K`
          }
          break
        case 'M':
          if (file.size > maxSize * 1024 * 1024) {
            sizeString = `${maxSize}M`
          }
          break
        case 'G':
          if (file.size > maxSize * 1024 * 1024 * 1024) {
            sizeString = `${maxSize}G`
          }
          break
        case 'T':
          if (file.size > maxSize * 1024 * 1024 * 1024 * 1024) {
            sizeString = `${maxSize}T`
          }
          break
      }
      sizeString && this.errors.push(new FieldError(`文件大小超过${sizeString}。`))
    }

    if (config.mode === 'image' && config.sizeCheck && (config.sizeCheck.width || config.sizeCheck.height)) {
      const checkSize = () => {
        return new Promise((resolve, reject) => {
          const URL = window.URL || window.webkitURL
          const img = new Image()
          img.onload = () => {
            if (config.sizeCheck) {
              if (config.sizeCheck.width && config.sizeCheck.height) {
                if (img.width !== config.sizeCheck.width || img.height !== config.sizeCheck.height) {
                  this.errors.push(new FieldError(`图片应为宽度${config.sizeCheck.width}像素，高度${config.sizeCheck.height}像素。`))
                  resolve(false)
                  return
                }
              } else {
                if (config.sizeCheck.width) {
                  if (img.width !== config.sizeCheck.width) {
                    this.errors.push(new FieldError(`图片应为宽度${config.sizeCheck.width}像素。`))
                    resolve(false)
                    return
                  }
                }
                if (config.sizeCheck.height) {
                  if (img.height !== config.sizeCheck.height) {
                    this.errors.push(new FieldError(`图片应为高度${config.sizeCheck.height}像素。`))
                    resolve(false)
                    return
                  }
                }
              }
            }
            resolve(true)
          }
          img.src = URL.createObjectURL(file)
        })
      }

      await checkSize()
    }

    if (this.errors.length === 0) {
      // TODO 实际执行上传

      const response = await this.interfaceHelper.request(
        merge(config.interface, { caches: false, contentType: 'form-data' }),
        {},
        { record: this.props.record, data: this.props.data, step: this.props.step },
        {
          loadDomain: this.props.loadDomain,
          extra_data: { data: { [config.requireField]: file } }
        }
      )
      const value = getValue(response, config.responseField)

      this.props.onValueSet('', value, true)
    } else {
      this.props.onValueSet('', this.props.value, this.errors)
    }

    throw new Error('Do not upload.')
  }

  renderComponent = (props: IUploadField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现UploadField组件。
      <div style={{ display: 'none' }}>
        <input data-testid="upload-input" type='file' onChange={(file) => props.onChange(file.target.files?.[0])}/>
      </div>
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config
    } = this.props

    if (config.mode === 'image') {
      return (
        <React.Fragment>
          {this.renderComponent({
            mode: 'image',
            value: value ? `${config.imagePrefix || ''}${value}` : undefined,
            onChange: async (file) => await this.beforeUpload(file),
            onCancel: async () => this.props.onValueSet('', '', true),
            disabled: getBoolean(config.disabled),
            readonly: getBoolean(config.readonly)
          })}
        </React.Fragment>
      )
    } else if (config.mode === 'file') {
      return (
        <React.Fragment>
          {this.renderComponent({
            mode: 'file',
            value,
            onChange: async (file) => await this.beforeUpload(file),
            onCancel: async () => this.props.onValueSet('', '', true),
            disabled: getBoolean(config.disabled),
            readonly: getBoolean(config.readonly)
          })}
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment></React.Fragment>
      )
    }
  }
}
