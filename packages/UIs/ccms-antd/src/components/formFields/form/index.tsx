import React from 'react'
import { FormField } from 'ccms'
import { Form, Button, Collapse, Space } from 'antd'
import { PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, DeleteOutlined } from '@ant-design/icons'
import { IFormField, IFormFieldItem, IFormFieldItemField } from 'ccms/dist/src/components/formFields/form'
import getALLComponents from '..'
import { FiledErrMsg, formItemLayout } from '../common'

export default class FormFieldComponent extends FormField {
  getALLComponents = (type: string) => getALLComponents[type]

  remove: () => Promise<void> = async () => {
    /* 无逻辑 */
  }

  renderItemFieldComponent = (props: IFormFieldItemField) => {
    const { label, subLabel, status, message, extra, required, fieldType, layout, visitable, children } = props
    const itemStyle = visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }
    let validateStatus: '' | 'error' | 'validating' | 'success' | 'warning' | undefined
    if (status === 'normal') {
      validateStatus = undefined
    } else if (status === 'error') {
      validateStatus = 'error'
    } else {
      validateStatus = 'validating'
    }
    return (
      <Form.Item
        extra={extra ? extra.trim() : ''}
        required={required}
        label={label}
        validateStatus={validateStatus}
        help={FiledErrMsg({ message, fieldType })}
        {...formItemLayout(layout, fieldType, label)}
        // className={ layout === 'horizontal' && subLabel ? commonStyles['ccms-antd-label-vertical-flex-start']: null }
        style={itemStyle}
      >
        {subLabel || null}
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: IFormFieldItem) => {
    const { title, index, isLastIndex, onRemove, onSort, canCollapse, children } = props

    return (
      <Collapse.Panel
        header={<div style={{ display: 'inline-block', width: 'calc(100% - 60px)' }}>{title}</div>}
        key={index}
        forceRender
        showArrow={!!canCollapse}
        extra={
          <Space>
            {onSort ? (
              <>
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
              </>
            ) : null}
            {onRemove ? (
              <DeleteOutlined
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove()
                }}
              />
            ) : null}
          </Space>
        }
      >
        {children}
      </Collapse.Panel>
    )
  }

  renderComponent = (props: IFormField) => {
    const { insertText, onInsert, canCollapse, children } = props

    const collapsePaneldDefaultActiveKeys = Array.from(Array(children.length), (v, k) => k)
    const CollapseProps = canCollapse
      ? {
        accordion: true
      }
      : {
        activeKey: collapsePaneldDefaultActiveKeys
      }

    return (
      <>
        <Space style={{ width: '100%' }} direction="vertical">
          <Collapse bordered={false} style={{ marginBottom: '24px' }} {...CollapseProps}>
            {children}
          </Collapse>
          {onInsert ? (
            <Form.Item wrapperCol={{ span: 24 }}>
              <Button block type="dashed" icon={<PlusOutlined />} onClick={() => onInsert()}>
                {insertText}
              </Button>
            </Form.Item>
          ) : null}
        </Space>
      </>
    )
  }
}
