import React from 'react'
import { Tooltip, Space } from 'antd'
import 'antd/lib/tooltip/style'
import 'antd/lib/space/style'
import { CodeField } from 'ccms'
import { FullscreenOutlined, FullscreenExitOutlined, UndoOutlined } from '@ant-design/icons'
import Editor, { loader } from '@monaco-editor/react'
import { ICodeFieldContainer, ICodeField } from 'ccms/dist/components/formFields/code'
import './index.less'

loader.config({ paths: { vs: 'https://storage.360buyimg.com/swm-plus/monaco-editor-0.28.1/min/vs' } })
declare global {
  interface Window {
    define: unknown
    codeEditorDefine: unknown
  }
}
export default class CodeFieldComponent extends CodeField {
  state = {
    fullScreenStatus: false
  }

  editorInstance

  componentWillUnmount() {
    window.codeEditorDefine = window.define
    window.define = undefined
  }

  handleEditorbeforeMount = () => {
    if (window.codeEditorDefine) window.define = window.codeEditorDefine
  }

  handleEditorDidMount = (editor) => {
    this.editorInstance = editor
    this.editorInstance.defaultCodeValue = editor.getValue()
  }

  renderContainer = (props: ICodeFieldContainer) => {
    const { fullScreen, fullScreenStatus, theme, children, onResetValue, keydownCallback, enterFull, exitFull } = props

    return (
      <div className="editor-page">
        <div
          id="editor-wrapper"
          className={fullScreenStatus ? 'editor-fullscreen' : ''}
          tabIndex={-1}
          onKeyDown={(e) => {
            keydownCallback(e)
          }}
        >
          <div className={`header-wrapper header-wrapper-${theme}`}>
            <Space>
              <Tooltip title="重置" placement="bottom" getPopupContainer={(ele) => ele.parentElement || document.body}>
                <UndoOutlined
                  style={{ fontSize: '20px' }}
                  onClick={() => {
                    onResetValue(this.editorInstance.defaultCodeValue)
                  }}
                />
              </Tooltip>
              {fullScreenStatus && fullScreen ? (
                <Tooltip
                  title="退出全屏"
                  placement="bottom"
                  getPopupContainer={(ele) => ele.parentElement || document.body}
                >
                  <FullscreenExitOutlined
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                      exitFull()
                    }}
                  />
                </Tooltip>
              ) : null}
              {!fullScreenStatus && fullScreen ? (
                <Tooltip
                  title="全屏"
                  placement="bottom"
                  getPopupContainer={(ele) => ele.parentElement || document.body}
                >
                  <FullscreenOutlined
                    style={{ fontSize: '20px' }}
                    onClick={() => {
                      enterFull()
                    }}
                  />
                </Tooltip>
              ) : null}
            </Space>
          </div>
          {children}
        </div>
      </div>
    )
  }

  renderComponent = (props: ICodeField) => {
    const { value, codeType, fullScreenStatus, theme, height, onChange } = props

    const editorTheme = theme === 'white' ? 'light' : 'vs-dark'
    const editorExpectValue = Object.prototype.toString.call(value) === '[object Object]' ? '' : value
    return (
      <Editor
        loading={
          <div className="sp-cube-wrapper" title="">
            <div className="sp-cube">
              <div className="sp-sides">
                <div className="sp-top" />
                <div className="sp-right" />
                <div className="sp-bottom" />
                <div className="sp-left" />
                <div className="sp-front" />
                <div className="sp-back" />
              </div>
            </div>
          </div>
        }
        height={fullScreenStatus ? document.body.clientHeight : Number(height)}
        theme={editorTheme}
        defaultLanguage={codeType}
        language={codeType}
        value={editorExpectValue}
        onMount={this.handleEditorDidMount}
        beforeMount={this.handleEditorbeforeMount}
        onChange={(valueChange) => {
          onChange(valueChange === undefined ? '' : valueChange)
        }}
      />
    )
  }
}
