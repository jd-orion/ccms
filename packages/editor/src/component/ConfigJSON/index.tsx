import React, { useEffect } from 'react'
import { Button, ConfigProvider, Form, Input, Modal, Space } from 'antd'
import 'antd/lib/button/style'
import 'antd/lib/form/style'
import 'antd/lib/input/style'
import 'antd/lib/modal/style'
import 'antd/lib/space/style'
import { PageConfig } from '../../app'

interface ConfigJSONProps {
  defaultValue: PageConfig
  onOk: (config: PageConfig) => void
  onCancel: () => void
}

export default function ConfigJSON(props: ConfigJSONProps) {
  const { defaultValue, onOk, onCancel } = props

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({ config: JSON.stringify(defaultValue, undefined, 2) })
  }, [defaultValue])

  return (
    <Form form={form}>
      <Form.Item name="config" noStyle>
        <Input.TextArea rows={20} />
      </Form.Item>
      <Form.Item noStyle>
        <Space>
          <Button
            onClick={() => {
              const config = form.getFieldValue('config')
              try {
                onOk(JSON.parse(config))
              } catch (e) {
                ConfigProvider.config({
                  prefixCls: 'ccms-editor-ant'
                })

                Modal.error({
                  title: '配置文件解析失败',
                  content: (e as Error).message
                })
              }
            }}
            type="primary"
          >
            确定
          </Button>
          <Button onClick={() => onCancel()}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
