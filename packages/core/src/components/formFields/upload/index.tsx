import React from 'react'
import { APIConfig } from '../../../interface'
import { Field, FieldConfig, FieldError, IField, FieldInterface } from '../common'
import { getBoolean, getValue } from '../../../util/value'

export interface UploadFieldConfig extends FieldConfig, FieldInterface {
  type: 'upload'
  api: APIConfig
  uploadName: string
  uploadUrl: string
  uploadwithCredentials: string | boolean
  uploadImagePrefix: string
  sizeCheck?: {
    height?: string | number
    width?: string | number
    maxSize?: string | number
  },
  resposeName?: string
  placeholder?: string
  showUrl?: boolean
}

export interface IUploadField {
  value?: any
  onChange: (value: any) => Promise<void>
  beforeUpload: (file: any) => Promise<any>
  getValue?: (value: any) => Promise<string>
  readonly?: any
  disabled?: any
  uploadName: string
  uploadUrl: string
  uploadImagePrefix: string
  uploadwithCredentials: boolean
  placeholder?: string
  showUrl?: boolean
}

export default class UploadField extends Field<UploadFieldConfig, IUploadField, string> implements IField<string> {
  err = ''
  reset: () => Promise<string> = async () => {
    const defaults = await this.defaultValue()

    if (defaults === undefined) {
      return ''
    } else {
      return defaults
    }
  };

  validate = async (value: any): Promise<true | FieldError[]> => {
    const {
      config: {
        label,
        required
      }
    } = this.props

    const rsvalue = value

    const errors: FieldError[] = []
    console.log(this.err, 'this.err')
    if (this.err) {
      errors.push(new FieldError(`${this.err}`))
      if (!getBoolean(required)) { return true }
      return errors
    }

    if (getBoolean(required)) {
      if (rsvalue === '' || rsvalue === undefined) {
        errors.push(new FieldError(`请上传${label}`))
      }
    }

    return errors.length ? errors : true
  }

  beforeUpload = async (file: any) => {
    const {
      config
    } = this.props
    this.err = ''
    console.log(file.type, file.type.indexOf('jpg'), file.type.indexOf('png'), file.type.indexOf('jpeg'))
    const imgType = file.type.indexOf('jpg') >= 0 || file.type.indexOf('png') >= 0 || file.type.indexOf('jpeg') >= 0
    if (!imgType) {
      this.err = `${config.label}只能上传图片`
      return {
        err: this.err,
        type: false
      }
    }

    // 以KB
    const getmaxSize = config.sizeCheck ? Number(config.sizeCheck.maxSize) * 1024 : 0
    if (getmaxSize) {
      if (file.size > getmaxSize) {
        let sizeNumber = getmaxSize
        let sizeString = ''
        if (sizeNumber > 1024 * 1024 * 1024 * 1024) {
          const t = Math.floor(sizeNumber / (1024 * 1024 * 1024 * 1024))
          sizeString += `${t}T`
          sizeNumber -= t * 1024 * 1024 * 1024 * 1024
        }
        if (sizeNumber > 1024 * 1024 * 1024) {
          const t = Math.floor(sizeNumber / (1024 * 1024 * 1024))
          sizeString += `${t}G`
          sizeNumber -= t * 1024 * 1024 * 1024
        }
        if (sizeNumber > 1024 * 1024) {
          const t = Math.floor(sizeNumber / (1024 * 1024))
          sizeString += `${t}M`
          sizeNumber -= t * 1024 * 1024
        }
        if (sizeNumber > 0) {
          const t = Math.floor(sizeNumber / 1024)
          sizeString += `${t}KB`
        }

        this.err = `文件大小超过${sizeString}`
        return {
          err: this.err,
          type: false
        }
      }
    }

    const imageWidth = config.sizeCheck?.width
    const imageHeight = config.sizeCheck?.height

    if (imageWidth && imageHeight) {
      try {
        const checkSize = () => {
          return new Promise((resolve, reject) => {
            const _URL = window.URL || window.webkitURL
            const img = new Image()
            img.onload = function () {
              const valid = img.width.toString() === imageWidth.toString() && img.height.toString() === imageHeight.toString()
              valid ? resolve(1) : reject(new Error())
            }
            img.src = _URL.createObjectURL(file)
          })
        }
        await checkSize()
      } catch (e) {
        this.err = `图片尺寸需要：${imageWidth}×${imageHeight}px`
        return {
          err: this.err,
          type: false
        }
      }
    }
    return {
      err: '',
      type: true
    }
  }

  getValue = (file: any) => {
    const {
      config: {
        resposeName,
        uploadImagePrefix
      },
      onChange
    } = this.props
    if (typeof file === 'string') {
      try {
        file = JSON.parse(file)
      } catch (error) {
        return ''
      }
    }
    const imgUrl = `${resposeName ? getValue(file, `${resposeName}`) || '' : ''}`
    console.log(imgUrl, 'imgurl')
    if (imgUrl === '') return ''

    const rs = `${uploadImagePrefix || ''}${imgUrl}`
    this.validate(rs)
    onChange(rs)
    return rs
  }

  renderComponent = (props: IUploadField) => {
    return <React.Fragment>
      您当前使用的UI版本没有实现UploadField组件。
      <div style={{ display: 'none' }}>
        <button onClick={() => props.onChange({})}>onChange</button>
      </div>
    </React.Fragment>
  }

  render = () => {
    const {
      value,
      config: {
        readonly,
        disabled,
        placeholder,
        showUrl,
        uploadName,
        uploadUrl,
        uploadImagePrefix,
        uploadwithCredentials
      },
      onChange
    } = this.props
    return (
      <React.Fragment>
        {uploadName
          ? this.renderComponent({
            disabled: getBoolean(disabled),
            readonly: getBoolean(readonly),
            value,
            uploadName,
            uploadImagePrefix,
            uploadUrl,
            placeholder,
            showUrl,
            uploadwithCredentials: uploadwithCredentials === 'false' ? false : Boolean(uploadwithCredentials),
            beforeUpload: async (file: any) => await this.beforeUpload(file),
            onChange: async (value: any) => await onChange(value),
            getValue: async (file: any) => await this.getValue(file)
          })
          : <div>未设置uploadName</div>}
      </React.Fragment>
    )
  }
}
