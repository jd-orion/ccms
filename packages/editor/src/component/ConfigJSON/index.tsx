import React, { useEffect, useState } from 'react'
import { Drawer, Button, Modal, Space } from 'antd'
import MonacoEditor from 'react-monaco-editor'

interface ConfigJSONProps {
  configStringify: boolean
  defaultValue: any
  onOk: (config: any) => void
  onCancel: () => void
}

export default function ConfigJSON(props: ConfigJSONProps) {
  let editorInstance: any = ''

  useEffect(() => {
    setConfig(props.defaultValue)
  }, [props.defaultValue])

  const [config, setConfig] = useState(props.defaultValue)

  const handleEditorDidMount = (editor, monaco) => {
    editorInstance = editor
    editorInstance.defaultCodeValue = editor.getValue()
  }

  return (
    <Drawer
      width="700"
      title="编辑配置文件"
      placement="right"
      visible={props.configStringify}
      getContainer={false}
      closable
      maskClosable
      footer={
        <Space>
          <Button
            onClick={() => {
              try {
                props.onOk(JSON.parse(config))
              } catch (e: any) {
                Modal.error({
                  title: '配置文件解析失败',
                  content: e.message
                })
              }
            }}
            type="primary"
          >
            确定
          </Button>
          <Button onClick={() => props.onCancel()}>取消</Button>
        </Space>
      }
      onClose={() => props.onCancel()}
    >
      <div style={{ width: 660 }}>
        <MonacoEditor
          height={document.body.clientHeight}
          theme="vs-dark"
          language="json"
          value={config}
          editorDidMount={handleEditorDidMount}
          onChange={(v) => {
            setConfig(v)
          }}
        />
      </div>
    </Drawer>
  )
}
