import React from 'react'
import { Tooltip, Space } from 'antd'
import { CodeField } from 'ccms'
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons'
import Editor, { loader } from '@monaco-editor/react'
import { ICodeFieldContainer, ICodeField } from 'ccms/dist/src/components/detail/code'
import styles from './index.less'

loader.config({ paths: { vs: 'https://storage.360buyimg.com/swm-plus/monaco-editor-0.28.1/min/vs' } })
declare global {
  interface Window {
    define: unknown
    codeEditorDefine: unknown
  }
}
export default class CodeDetailComponent extends CodeField {
  state = {
    fullScreenStatus: false
  }

  editorInstance: unknown

  componentWillUnmount() {
    window.codeEditorDefine = window.define
    window.define = undefined
  }

  handleEditorbeforeMount = () => {
    if (window.codeEditorDefine) window.define = window.codeEditorDefine
  }

  renderContainer = (props: ICodeFieldContainer) => {
    const { fullScreen, fullScreenStatus, theme, children, enterFull, exitFull } = props

    return (
      <div className={styles['editor-page']}>
        <div id="editor-wrapper" className={fullScreenStatus ? styles['editor-fullscreen'] : ''} tabIndex={-1}>
          <div className={`${styles['header-wrapper']} ${styles[`header-wrapper-${theme}`]}`}>
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

  renderComponent = (props: ICodeField) => {
    const { value, codeType, fullScreenStatus, theme, height } = props

    const editorTheme = theme === 'white' ? 'light' : 'vs-dark'
    const editorExpectValue = Object.prototype.toString.call(value) === '[object Object]' ? '' : value
    return (
      <Editor
        loading={
          <div className={styles['sp-cube-wrapper']} title="">
            <div className={styles['sp-cube']}>
              <div className={styles['sp-sides']}>
                <div className={styles['sp-top']} />
                <div className={styles['sp-right']} />
                <div className={styles['sp-bottom']} />
                <div className={styles['sp-left']} />
                <div className={styles['sp-front']} />
                <div className={styles['sp-back']} />
              </div>
            </div>
          </div>
        }
        height={fullScreenStatus ? document.body.clientHeight : Number(height)}
        theme={editorTheme}
        defaultLanguage={codeType}
        language={codeType}
        value={editorExpectValue}
        onMount={(editor) => {
          const _editor = editor
          _editor.defaultCodeValue = editor.getValue()
          this.editorInstance = _editor
        }}
        beforeMount={this.handleEditorbeforeMount}
      />
    )
  }
}
