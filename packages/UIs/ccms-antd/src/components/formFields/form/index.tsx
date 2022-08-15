import React, { useState } from 'react'
import { FormField } from 'ccms'
import { Form, Button, Divider, Collapse, Space, Row, Col } from 'antd'
import { PlusOutlined, MinusCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from '@ant-design/icons'
import { IFormField, IFormFieldItem, IFormFieldItemField } from 'ccms/dist/src/components/formFields/form'
import getALLComponents from '../'
import { formItemLayout } from '../common'
import commonStyles from '../common.less'

export default class FormFieldComponent extends FormField {
  getALLComponents = (type: any) => getALLComponents[type]

  remove: () => Promise<void> = async () => { }

  renderItemFieldComponent = (props: IFormFieldItemField) => {
    const {
      label,
      subLabel,
      status,
      message,
      extra,
      required,
      fieldType,
      layout,
      children
    } = props
    return (
      <Form.Item
        extra={extra ? extra.trim() : ''}
        required={required}
        label={label}
        validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
        help={message === '' ? null : message}
        {...formItemLayout(layout, fieldType, label)}
      // className={ layout === 'horizontal' && subLabel ? commonStyles['ccms-antd-label-vertical-flex-start']: null }
      >
        {subLabel || null}
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: IFormFieldItem) => {
    const {
      title,
      index,
      isLastIndex,
      removeText,
      onRemove,
      onSort,
      canCollapse,
      children
    } = props

    return (
      <Collapse.Panel
        header={<div style={{ display: 'inline-block', width: 'calc(100% - 60px)' }}>{title}</div>}
        key={index}
        forceRender={true}
        showArrow={!!canCollapse}
        extra={(
          <Space>
            {onSort
              ? <React.Fragment>
                <ArrowUpOutlined
                  onClick={(e) => {
                    e.stopPropagation()
                    index > 0 && onSort('up')
                  }}
                  style={{
                    opacity: index === 0 ? 0.5 : 1,
                    cursor: index === 0 ? 'not-allowed' : 'pointer'
                  }}
                />
                <ArrowDownOutlined
                  onClick={(e) => {
                    e.stopPropagation()
                    !isLastIndex && onSort('down')
                  }}
                  style={{
                    opacity: isLastIndex ? 0.5 : 1,
                    cursor: isLastIndex ? 'not-allowed' : 'pointer'
                  }}
                />
              </React.Fragment>
              : null}
            {onRemove
              ? <DeleteOutlined onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }} />
              : null}
          </Space>)}
      >
        {children}
      </Collapse.Panel>
    )
  }

  renderComponent = (props: IFormField) => {
    const {
      insertText,
      onInsert,
      canCollapse,
      children
    } = props

    const collapsePaneldDefaultActiveKeys = Array.from(Array(children.length), (v, k) => k)
    const CollapseProps = canCollapse ? {
      accordion: true
    } : {
      activeKey: collapsePaneldDefaultActiveKeys
    }

    return (
      <React.Fragment>
        <Space
          style={{ width: '100%' }}
          direction="vertical"
        >
          <Collapse bordered={false} style={{ marginBottom: '24px' }} {...CollapseProps} >{children}</Collapse>
          {onInsert ? <Form.Item wrapperCol={{ span: 24 }}>
            <Button block type='dashed' icon={<PlusOutlined />} onClick={() => onInsert()}>{insertText}</Button>
          </Form.Item> : null}
        </Space>
      </React.Fragment>
    )
  }
}
