import React from "react";
import { UploadField } from 'ccms';
import { Upload as AntdUpload, message, Button } from 'antd'
import { IUploadField, UploadFieldConfig } from "ccms/dist/src/components/formFields/upload";
export const PropsType = (props: UploadFieldConfig) => { };
import 'antd/lib/upload/style/index.css'

export default class UploadFieldComponent extends UploadField {
    uploadButton = (value: string, prefix: string, props: any) => {
        const imgUrl = `${prefix || ''}${value}`
        return value ?
            <div>
                <div>
                    <Button>重新上传</Button>
                </div>
                {props.placeholder && <p style={{ color: '#888' }}>{props.placeholder}</p>}
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
                {props.placeholder && <p style={{ color: '#888' }}>{props.placeholder}</p>}
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

        const imgUrl = `${uploadImagePrefix || ''}${value}`
        return (
            <div>
                <div style={{ display: 'flex' }}>
                    <AntdUpload
                        name={uploadName || "image"}
                        action={uploadUrl || ""}
                        beforeUpload={async (file) => {
                            const rs: any = await beforeUpload(file);
                            if (rs?.type === false) message.error(rs?.err || "上传内容不符合，请重新上传")
                            return rs.type
                        }}
                        showUploadList={false}
                        withCredentials={uploadwithCredentials}
                        onChange={async (e) => {
                            const response = e.file.response
                            const rs = getValue && await getValue(e.file.response)
                            if (response?.code === -1 || !rs) {
                                // message.error(response?.msg || '系统异常')
                            }
                            onChange(rs)
                        }}
                        className='ccms-upload'
                        {...{ disabled: disabled || readonly }}
                    >
                        <div className='ccms-upload-image'>{this.uploadButton(value, uploadImagePrefix, props)}</div>
                    </AntdUpload>

                    {
                        imgUrl && <a href={imgUrl} target={"_blank"} rel="noreferrer">
                            <div style={{
                                marginLeft: '10px',
                                height: '35px',
                                width: '35px',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'contain',
                                backgroundImage: `url(${imgUrl})`
                            }} />
                        </a>
                    }
                </div>
            </div>
        );
    }
}
