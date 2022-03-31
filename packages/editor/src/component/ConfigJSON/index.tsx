import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Space } from "antd";

interface ConfigJSONProps {
  defaultValue: any
  onOk: (config: any) => void
  onCancel: () => void
}

export default function ConfigJSON (props: ConfigJSONProps) {
  const [ form ] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ config: JSON.stringify(props.defaultValue, undefined, 2) })
  }, [ props.defaultValue ])

  return (
    <Form form={form}>
      <Form.Item name="config" noStyle>
        <Input.TextArea rows={20}></Input.TextArea>
      </Form.Item>
      <Form.Item noStyle>
        <Space>
          <Button onClick={() => {
            const config = form.getFieldValue('config')
            try {
              props.onOk(JSON.parse(config))
            } catch (e: any) {
              Modal.error({
                title: '配置文件解析失败',
                content: e.message
              })
            }
          }} type="primary">确定</Button>
          <Button onClick={() => props.onCancel()}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}