import React, { useEffect, useState } from 'react'
import { Drawer, Button, Modal, Space } from 'antd'
import 'antd/lib/drawer/style'
import 'antd/lib/button/style'
import 'antd/lib/modal/style'
import 'antd/lib/space/style'
import Editor, { loader } from '@monaco-editor/react'

loader.config({ paths: { vs: 'https://storage.360buyimg.com/swm-plus/monaco-editor-0.28.1/min/vs' } })

interface ConfigJSONProps {
  configStringify: boolean
  defaultValue: string
  onOk: (config: string) => void
  onCancel: () => void
}

export default function ConfigJSON(props: ConfigJSONProps) {
  const { defaultValue, configStringify, onOk, onCancel } = props

  useEffect(() => {
    setConfig(defaultValue)
  }, [defaultValue])

  const [config, setConfig] = useState(defaultValue)

  const handleEditorDidMount = (editor) => {
    const _editor = editor
    _editor.defaultCodeValue = editor.getValue()
  }

  return (
    <Drawer
      width="50%"
      title="编辑配置文件"
      placement="right"
      visible={configStringify}
      getContainer={false}
      closable
      maskClosable
      footer={
        <Space>
          <Button
            onClick={() => {
              try {
                onOk(config)
              } catch (e) {
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
      }
      onClose={() => onCancel()}
    >
      <Editor
        height={document.body.clientHeight}
        theme="vs-dark"
        defaultLanguage="json"
        language="json"
        value={config}
        onMount={handleEditorDidMount}
        onChange={(v) => {
          setConfig(v || '')
        }}
      />
    </Drawer>
  )
}
