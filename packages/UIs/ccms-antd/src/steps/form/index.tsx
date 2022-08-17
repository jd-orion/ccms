import React from 'react'
import { FormStep } from 'ccms'
import {
  IForm,
  IFormItem,
  IFormStepModal,
  FormConfig,
  IButtonProps
} from 'ccms/dist/src/steps/form'
import { Button, Form, Space, Modal, Collapse, Row } from 'antd'

import { FormProps } from 'antd/lib/form'
import getALLComponents from '../../components/formFields'
import OperationHelper from '../../util/operation'
import styles from './index.less'
import { formItemLayout, computedItemStyle, computedGapStyle } from '../../components/formFields/common'
import newstyles from '../../main.less'

const { Panel } = Collapse

export default class FormStepComponent extends FormStep {
  getALLComponents = (type: any) => getALLComponents[type]

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
    const { layout, columns, actions, rightTopActions, onSubmit, onCancel, submitText, cancelText, children } = props

    const formItemLayout: FormProps | null =
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
        {...formItemLayout}
        // layout={layout}
        // layout="horizontal"
        layout="vertical" // 和drip同步 改为竖排
        className={newstyles.content}
      >
        {Array.isArray(rightTopActions) && rightTopActions.length > 0 && (
          <Row justify="end">
            <Form.Item>
              <Space>{rightTopActions}</Space>
            </Form.Item>
          </Row>
        )}
        <div style={gapStyle} className={styles['ccms-antd-mini-form-row']}>
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

    return (
      <div
        style={colStyle}
        key={key}
        className={[
          styles['form-col'],
          styles[`form-col-${fieldType}`],
          styles[`form-col-${columns?.type || 'span'}`]
        ].join(' ')}
      >
        {fieldType === 'group' ? (
          this.renderGroupUI(label, children, message, 'header')
        ) : (
          <Form.Item
            extra={extra ? extra.trim() : ''}
            required={required}
            key={key}
            label={label}
            {...formItemLayout(layout, fieldType, label)}
            validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
            help={message === '' ? null : <div style={{ color: 'red' }}>{message}</div>}
            style={itemStyle}
            className={styles[`ccms-antd-mini-form-${fieldType}`]}
            // className={ [styles[`ccms-antd-mini-form-${fieldType}`], layout === 'horizontal' && subLabel ? styles['ccms-antd-label-vertical-flex-start']: null].join(' ') } // 预留layout配置项启用时所需label css代码
          >
            {subLabel || null}
            {children}
          </Form.Item>
        )}
      </div>
    )
  }

  // group UI
  renderGroupUI = (label: string, children: any, message, collapsible?: 'header' | 'disabled') => {
    return (
      <>
        <Collapse collapsible="header" defaultActiveKey={['1']}>
          <Panel header={label} key="1" collapsible={collapsible || 'header'}>
            <div className={styles['form-group-content']}>{children}</div>
          </Panel>
        </Collapse>
        <div style={{ color: 'red' }}>{message}</div>
      </>
    )
  }
}
// <FormConfig, IForm>
export const PropsType = (props: IForm) => { }

export const PropsTypeFormConfig = (props: FormConfig) => { }
export const PropsTypeStep = (props: FormStep) => { }
