import React from 'react'
import { Tooltip } from 'antd'
import 'antd/lib/tooltip/style'
import { EyeOutlined } from '@ant-design/icons'
import { UploadDisplay } from 'ccms'
import { IUploadField } from 'ccms/dist/components/formFields/upload/display'
import './index.less'

export default class UploadDisplayComponent extends UploadDisplay {
  renderComponent = (props: IUploadField) => {
    const { mode = 'file', value } = props
    if (mode === 'image') {
      if (value) {
        return (
          <div className="ccms-antd-upload-image">
            <img className="image" src={value} alt={value} />
            <div className="mask">
              <Tooltip overlay="查看" getPopupContainer={(ele) => ele.parentElement || document.body}>
                <EyeOutlined
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(value)
                  }}
                />
              </Tooltip>
            </div>
          </div>
        )
      } else {
        return (
          <div className="ccms-antd-upload-image">
            <div className="empty">
              <span>未上传</span>
            </div>
          </div>
        )
      }
    } else {
      return <>value</>
    }
  }
}
