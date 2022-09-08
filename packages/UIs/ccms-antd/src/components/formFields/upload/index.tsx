import React from 'react'
import { UploadField } from 'ccms'
import { Upload as AntdUpload, Input, Space, Tooltip } from 'antd'
import 'antd/lib/upload/style'
import 'antd/lib/input/style'
import 'antd/lib/space/style'
import 'antd/lib/tooltip/style'
import { UploadOutlined, EyeOutlined, DeleteOutlined, CloseCircleFilled } from '@ant-design/icons'
import { IUploadField } from 'ccms/dist/components/formFields/upload'
import './index.less'
import InterfaceHelper from '../../../util/interface'

export default class UploadFieldComponent extends UploadField {
  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: IUploadField) => {
    const { mode = 'file', value, onChange, onCancel } = props

    return (
      <>
        <AntdUpload
          className={`ccms-antd-upload ${mode === 'image' ? 'ccms-antd-upload-image-box' : ''}`}
          beforeUpload={async (file) => {
            await onChange(file)
          }}
          showUploadList={false}
        >
          {mode === 'image' && value && (
            <div className="ccms-antd-upload-image">
              <img className="image" src={value} alt={value} />
              <div className="mask">
                <Space>
                  <Tooltip getPopupContainer={(ele) => ele.parentElement || document.body} overlay="上传">
                    <UploadOutlined />
                  </Tooltip>
                  <Tooltip getPopupContainer={(ele) => ele.parentElement || document.body} overlay="查看">
                    <EyeOutlined
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(value)
                      }}
                    />
                  </Tooltip>
                  <Tooltip getPopupContainer={(ele) => ele.parentElement || document.body} overlay="清除">
                    <DeleteOutlined
                      onClick={(e) => {
                        e.stopPropagation()
                        onCancel()
                      }}
                    />
                  </Tooltip>
                </Space>
              </div>
            </div>
          )}
          {mode === 'image' && !value && (
            <div className="ccms-antd-upload-image">
              <div className="empty">
                <span>
                  <UploadOutlined /> 点击上传
                </span>
              </div>
            </div>
          )}
          {mode !== 'image' && (
            <Input
              prefix={<UploadOutlined />}
              suffix={
                value ? (
                  <CloseCircleFilled
                    style={{ color: '#d9d9d9' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onCancel()
                    }}
                  />
                ) : null
              }
              placeholder="点击上传"
              value={value}
              readOnly
            />
          )}
        </AntdUpload>
      </>
    )
  }
}
