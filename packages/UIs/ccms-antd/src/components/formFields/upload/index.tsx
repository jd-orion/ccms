import React from "react";
import { UploadField } from 'ccms';
import { Upload as AntdUpload, message, Button } from 'antd'
import { IUploadField, UploadFieldConfig } from "ccms/dist/src/components/formFields/upload";
import { PaperClipOutlined } from '@ant-design/icons'
export const PropsType = (props: UploadFieldConfig) => { };
import 'antd/lib/upload/style/index.css'

export default class UploadFieldComponent extends UploadField {
    file: any
    uploadButton = (value: string, prefix: string, props: any) => {
        const imgUrl = `${prefix || ''}${value}`
        return value ?
            <div>
                <div>
                    <Button>重新上传</Button>
                </div>
                {
                    props.showURL && <div>
                        <hr />
                        <p>图片链接地址: {imgUrl}</p>
                    </div>
                }
            </div>
            :
            <div>
                <Button>点击上传</Button>
            </div>
    }

    renderComponent = (props: IUploadField) => {
        const {
            value,
            onChange,
            readonly,
            disabled,
            uploadName,
            uploadwithCredentials,
            uploadUrl,
            uploadImagePrefix, beforeUpload,
            getValue
        } = props

        const imgUrl = `${uploadImagePrefix || ''}${value || ''}`
        return (
            <div>
                <div style={{ display: 'flex' }}>
                    <AntdUpload
                        name={uploadName || "image"}
                        action={uploadUrl || ""}
                        beforeUpload={async (file) => {
                            const rs: any = await beforeUpload(file);
                            if (value && rs.type) onChange('loading')
                            rs.type && (this.file = file)
                            if (rs?.type === false) {
                                message.error(rs?.err || "上传内容不符合，请重新上传");
                                onChange('')
                            }
                            return rs.type
                        }}
                        showUploadList={false}
                        withCredentials={uploadwithCredentials}
                        onChange={async (e) => {
                            const response = e.file.response
                            const rs = getValue && await getValue(e.file.response)
                            if (response?.code === -1) {
                                message.error(response?.msg || '系统异常')
                                onChange('')
                            } else {
                                rs && onChange(rs)
                            }
                        }}
                        className='ccms-upload'
                        {...{ disabled: disabled || readonly }}
                    >
                        <div className='ccms-upload-image'>{this.uploadButton(value, uploadImagePrefix, props)}</div>
                    </AntdUpload>

                    {
                        imgUrl && <a href={imgUrl} style={{
                            lineHeight: '30px',
                            paddingLeft: '10px',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',    
                            maxWidth: '200px',
                            whiteSpace: 'nowrap'
                        }} target={"_blank"} rel="noreferrer">
                            <PaperClipOutlined />
                            {this.file ? this.file?.name : imgUrl}
                        </a>
                    }
                </div>
                {props.placeholder && <p style={{ color: '#888' }}>{props.placeholder}</p>}
            </div >
        );
    }
}
