import React from 'react'
import { FormStep } from 'ccms'
import { IForm, IFormItem, IFormStepModal, IButtonProps } from 'ccms/dist/steps/form'
import { Button, Form, Space, Modal, Collapse, Row } from 'antd'
import 'antd/lib/button/style'
import 'antd/lib/form/style'
import 'antd/lib/space/style'
import 'antd/lib/modal/style'
import 'antd/lib/collapse/style'
import 'antd/lib/row/style'
import { FormProps } from 'antd/lib/form'
import getALLComponents from '../../components/formFields'
import OperationHelper from '../../util/operation'
import './index.less'
import { formItemLayout, computedItemStyle, computedGapStyle } from '../../components/formFields/common'
import '../../main.less'

const { Panel } = Collapse

export default class FormStepComponent extends FormStep {
  getALLComponents = (type) => getALLComponents[type]

  OperationHelper = OperationHelper

  renderModalComponent = (props: IFormStepModal) => {
    return new Promise<void>((resolve) => {
      Modal.error({
        getContainer: () => {
          return document.getElementById('ccms-antd') || document.body
        },
        centered: true,
        title: props.message,
        onOk: () => {
          resolve()
        }
      })
    })
  }

  renderComponent = (props: IForm) => {
    const { layout, columns, actions, rightTopActions, children } = props

    const currentFormItemLayout: FormProps | null =
      layout === 'horizontal'
        ? {
            labelAlign: 'left',
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
          }
        : null

    const gapStyle = computedGapStyle(columns, 'row')

    return (
      <Form
        {...currentFormItemLayout}
        // layout={layout}
        // layout="horizontal"
        layout="vertical" // 和drip同步 改为竖排
        className="content"
      >
        {Array.isArray(rightTopActions) && rightTopActions.length > 0 && (
          <Row justify="end">
            <Form.Item>
              <Space>{rightTopActions}</Space>
            </Form.Item>
          </Row>
        )}
        <div style={gapStyle} className="ccms-antd-mini-form-row">
          {children}
        </div>
        {Array.isArray(actions) && actions.length > 0 && (
          <Form.Item>
            <Space>{actions}</Space>
          </Form.Item>
        )}
      </Form>
    )
  }

  renderButtonComponent = (props: IButtonProps) => {
    const { mode, label, onClick } = props
    return (
      <Button type={mode === 'normal' ? 'default' : mode} onClick={() => onClick()}>
        {label}
      </Button>
    )
  }

  renderItemComponent = (props: IFormItem) => {
    const { key, visitable, layout, columns, label, subLabel, status, message, extra, required, fieldType, children } =
      props
    const colStyle = computedItemStyle(columns, layout, visitable)
    const itemStyle = visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }
    if (columns?.type === 'width' && columns?.value && columns.wrap) {
      Object.assign(itemStyle, { width: columns.value })
    }

    let validateStatus: '' | 'error' | 'success' | 'warning' | 'validating' | undefined
    if (status === 'normal') {
      validateStatus = undefined
    } else if (status === 'error') {
      validateStatus = 'error'
    } else {
      validateStatus = 'validating'
    }

    return (
      <div style={colStyle} key={key} className={`form-col form-col-${fieldType} form-col-${columns?.type || 'span'}`}>
        {fieldType === 'group' ? (
          this.renderGroupUI(label, children, message, 'header')
        ) : (
          <Form.Item
            extra={extra ? extra.trim() : ''}
            required={required}
            key={key}
            label={label}
            {...formItemLayout(layout, fieldType, label)}
            validateStatus={validateStatus}
            help={message === '' ? null : <div style={{ color: 'red' }}>{message}</div>}
            style={itemStyle}
            className={`ccms-antd-mini-form-${fieldType}`}
          >
            {subLabel || null}
            {children}
          </Form.Item>
        )}
      </div>
    )
  }

  // group UI
  renderGroupUI = (label, children, message, collapsible?: 'header' | 'disabled') => {
    return (
      <>
        <Collapse collapsible="header" defaultActiveKey={['1']}>
          <Panel header={label} key="1" collapsible={collapsible || 'header'}>
            <div className="form-group-content">{children}</div>
          </Panel>
        </Collapse>
        <div style={{ color: 'red' }}>{message}</div>
      </>
    )
  }
}
