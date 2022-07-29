import { Button, Form, Modal, Space } from 'antd'
import { TableFieldForm } from 'ccms'
import { Field } from 'ccms/dist/src/components/formFields/common'
import { ITableFieldFormModal } from 'ccms/dist/src/components/formFields/table/common/form'
import { IFormItem } from 'ccms/dist/src/steps/form'
import React from 'react'
import getALLComponents from '../..'
import { formItemLayout, computedItemStyle } from '../../common'
import styles from './form.less'

export default class TableFieldFormComponent extends TableFieldForm {
  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  renderModal: (props: ITableFieldFormModal) => JSX.Element = (props) => {
    return (
      <Modal
        visible
        forceRender
        title={props.title}
        footer={null}
        getContainer={() => document.getElementById('ccms-antd') || document.body}
        onCancel={() => props.onClose()}
      >
        {props.content}
        <Form.Item>
          <Space>
            <Button onClick={() => props.onOk()} type="primary">
              确定
            </Button>
            <Button onClick={() => props.onClose()}>取消</Button>
          </Space>
        </Form.Item>
      </Modal>
    )
  }

  renderItemComponent: (props: IFormItem) => JSX.Element = (props) => {
    const { key, layout, columns, label, subLabel, visitable, status, message, extra, required, fieldType, children } =
      props

    const colStyle = computedItemStyle(columns, layout, visitable)
    const itemStyle = visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }
    if (columns?.type === 'width' && columns?.value && columns.wrap) {
      Object.assign(itemStyle, { width: columns.value })
    }

    let validateStatus: '' | 'error' | 'validating' | 'success' | 'warning' | undefined
    if (status === 'normal') {
      validateStatus = undefined
    } else if (status === 'error') {
      validateStatus = 'error'
    } else {
      validateStatus = 'validating'
    }

    return (
      <div
        style={colStyle}
        key={key}
        className={[styles['form-group-col'], styles[`form-group-col-${fieldType}`]].join(' ')}
      >
        <Form.Item
          extra={extra ? extra.trim() : ''}
          required={required}
          key={key}
          label={label}
          {...formItemLayout(layout, fieldType, label)}
          validateStatus={validateStatus}
          help={fieldType === 'import_subform' || fieldType === 'group' || message === '' ? null : message}
          className={styles[`ccms-antd-mini-form-${fieldType}`]}
          style={itemStyle}
        >
          {subLabel || null}
          {children}
        </Form.Item>
      </div>
    )
  }
}
