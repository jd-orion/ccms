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
}

export interface IUploadField {
    value?: any
    onChange: (value: any) => Promise<void>
    beforeUpload: (file: any) => Promise<boolean>
    getValue?: (value: any) => Promise<string>
    readonly?: any
    disabled?: any
    uploadName: string
    uploadUrl: string
    uploadImagePrefix: string
    uploadwithCredentials: boolean
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
          required
        }
      } = this.props

      const rsvalue = value

      const errors: FieldError[] = []
      if (this.err) {
        errors.push(new FieldError(`${this.err}`))
      }

      if (required) {
        if (rsvalue === '') {
          errors.push(new FieldError('不能为空'))
        }
      }

      return errors.length ? errors : true
    }

    beforeUpload = (file: any) => {
      const {
        value,
        config
      } = this.props
      this.err = ''

      if (file.type.indexOf('image/') !== 0) {
        this.err = '只能上传图片'
        this.validate(value)
        return false
      }

      const getmaxSize = config.sizeCheck ? Number(config.sizeCheck.maxSize) : 0
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
          if (sizeNumber > 1024) {
            const t = Math.floor(sizeNumber / 1024)
            sizeString += `${t}K`
            sizeNumber -= t * 1024
          }
          if (sizeNumber > 0) {
            sizeString += `${sizeNumber}B`
          }
          this.err = `文件大小超过${sizeString}`
          this.validate(value)
          return false
        }
      }

      const imageWidth = config.sizeCheck?.width
      const imageHeight = config.sizeCheck?.height
      const checkSize = () => {
        return new Promise((resolve, reject) => {
          const _URL = window.URL || window.webkitURL
          const img = new Image()
          img.onload = function () {
            const valid = img.width === imageWidth && img.height === imageHeight
            valid ? resolve(1) : reject(new Error())
          }
          img.src = _URL.createObjectURL(file)
        })
      }

      if (getValue(config, 'uploadImageSizeCheck') && imageWidth && imageHeight) {
        try {
          checkSize()
        } catch (e) {
          this.err = `图片尺寸：${imageWidth}×${imageHeight}`
          this.validate(value)
          return false
        }
      }
      return true
    }

    getValue = (file: any) => {
      const {
        config: {
          resposeName,
          uploadImagePrefix
        }
      } = this.props
      if (typeof file === 'string') {
        try {
          file = JSON.parse(file)
        } catch (error) {
          return ''
        }
      }
      const imgUrl = `${resposeName ? getValue(file, `${resposeName}`) || '' : ''}`
      if (imgUrl === '') return ''

      const rs = `${uploadImagePrefix || ''}${imgUrl}`
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
