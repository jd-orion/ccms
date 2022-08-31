import React from "react";
import { UploadField } from 'ccms';
import { Upload as AntdUpload, Input, Button, Space, Tooltip } from 'antd'
import { UploadOutlined, EyeOutlined, DeleteOutlined, CloseCircleFilled } from "@ant-design/icons"
import { IUploadField, UploadFieldConfig } from "ccms/dist/components/formFields/upload";
import { PaperClipOutlined } from '@ant-design/icons'
export const PropsType = (props: UploadFieldConfig) => { };
import styles from "./index.less"
import InterfaceHelper from "../../../util/interface";

export default class UploadFieldComponent extends UploadField {
  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: IUploadField) => {
    const {
      mode = 'file',
      value,
      onChange,
      onCancel
    } = props

    return (
      <React.Fragment>
        <AntdUpload
          className={`${styles['ccms-antd-upload']} ${mode === 'image' ? styles['ccms-antd-upload-image-box'] : ''}`}
          beforeUpload={async (file) => {
            await onChange(file)
          }}
          showUploadList={false}
        >
          {mode === 'image' ? (
            value ? (
              <div className={styles['ccms-antd-upload-image']}>
                <img className={styles['image']} src={value} alt={value} />
                <div className={styles['mask']}>
                  <Space>
                    <Tooltip
                      getPopupContainer={(ele) => ele.parentElement || document.body}
                      overlay="上传" ><UploadOutlined /></Tooltip>
                    <Tooltip
                      getPopupContainer={(ele) => ele.parentElement || document.body}
                      overlay="查看">
                      <EyeOutlined onClick={(e) => {
                        e.stopPropagation()
                        window.open(value)
                      }} />
                    </Tooltip>
                    <Tooltip
                      getPopupContainer={(ele) => ele.parentElement || document.body}
                      overlay="清除">
                      <DeleteOutlined onClick={(e) => {
                        e.stopPropagation()
                        onCancel()
                      }} />
                    </Tooltip>
                  </Space>
                </div>
              </div>
            ) : (
              <div className={styles['ccms-antd-upload-image']}>
                <div className={styles['empty']}>
                  <span><UploadOutlined /> 点击上传</span>
                </div>
              </div>
            )
          ) : (
            <Input
              prefix={<UploadOutlined />}
              suffix={value ? <CloseCircleFilled style={{ color: '#d9d9d9' }} onClick={(e) => {
                e.stopPropagation()
                onCancel()
              }} /> : null}
              placeholder="点击上传"
              value={value}
              readOnly
            />
          )}
        </AntdUpload>
      </React.Fragment>
    );
  }
}
