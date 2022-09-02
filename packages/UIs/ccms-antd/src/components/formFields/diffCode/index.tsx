import React from 'react'
import { Tooltip, Space } from 'antd'
import 'antd/lib/tooltip/style'
import 'antd/lib/space/style'
import { DiffCodeField } from 'ccms'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import { loader, DiffEditor } from '@monaco-editor/react'
import { IDiffCodeFieldContainer, IDiffCodeField } from 'ccms/dist/components/formFields/diffCode'
import './index.less'

loader.config({ paths: { vs: 'https://storage.360buyimg.com/swm-plus/monaco-editor-0.28.1/min/vs' } })
declare global {
  interface Window {
    define: unknown
    diffCodeEditorDefine: unknown
  }
}

export default class DiffCodeFieldComponent extends DiffCodeField {
  constructor(props) {
    super(props)

    this.state = {
      fullScreenStatus: false
    }
  }

  componentWillUnmount() {
    window.diffCodeEditorDefine = window.define
    window.define = undefined
  }

  handleEditorbeforeMount = () => {
    if (window.diffCodeEditorDefine) window.define = window.diffCodeEditorDefine
  }

  renderContainer = (props: IDiffCodeFieldContainer) => {
    const { fullScreen, fullScreenStatus, theme, children, keydownCallback, enterFull, exitFull } = props

    return (
      <div className="editor-page">
        <div
          id="editor-wrapper"
          className={fullScreenStatus ? 'editor-fullscreen' : undefined}
          tabIndex={-1}
          onKeyDown={(e) => {
            keydownCallback(e)
          }}
        >
          <div className={`header-wrapper header-wrapper-${theme}`}>
            <Space>
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

  renderComponent = (props: IDiffCodeField) => {
    const { codeType, fullScreenStatus, theme, height, originalCode, modifiedCode } = props

    const editorTheme = theme === 'white' ? 'light' : 'vs-dark'

    return (
      <DiffEditor
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
        language={codeType}
        original={originalCode}
        modified={modifiedCode}
        options={{ readOnly: true }}
        beforeMount={this.handleEditorbeforeMount}
      />
    )
  }
}
