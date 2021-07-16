import React from "react";
import { UploadField } from 'ccms';
import { Upload as AntdUpload, message, Button } from 'antd'
import { IUploadField } from "ccms/dist/src/components/formFields/upload";
export const PropsType = (props: IUploadField) => { };
import 'antd/lib/upload/style/index.css'

export default class UploadFieldComponent extends UploadField {
    uploadButton = (value: string, prefix: string) => {
        return value ?
            <div>
                <img src={value} width="200" height="auto" />
                <hr />
                <p>图片链接地址: {`${prefix || ''}${value}`}</p>
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

        return (
            <div>
                <div>
                    <AntdUpload
                        name={uploadName || "image"}
                        action={uploadUrl || ""}
                        beforeUpload={async (file) => {
                            const rs = await beforeUpload(file);
                            if (!rs) message.error("上传内容不符合，请重新上传")
                            return beforeUpload(file)
                        }}
                        showUploadList={false}
                        withCredentials={uploadwithCredentials}
                        onChange={async (e) => {
                            debugger
                            const rs = getValue && await getValue(e.file.response)
                            onChange(rs)
                        }}
                        className='ccms-upload'
                        {...{ disabled: disabled || readonly }}
                    >
                        <div className='ccms-upload-image'>{this.uploadButton(value, uploadImagePrefix)}</div>
                    </AntdUpload>
                </div>
            </div>
        );
    }
}
