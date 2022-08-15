import React from 'react'
import { FormField } from 'ccms'
import { Form, Button, Collapse, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { FormItemProps } from 'antd/lib/form'
import { IFormField, IFormFieldItem, IFormFieldItemField } from 'ccms/dist/src/components/formFields/form'
import getALLComponents from '..'
import styles from './index.less'

export default class FormFieldComponent extends FormField {
  getALLComponents = (type: string) => getALLComponents[type]

  remove: () => Promise<void> = async () => {
    /* 无逻辑 */
  }

  renderItemFieldComponent = (props: IFormFieldItemField) => {
    const { label, visitable, status, message, extra, required, fieldType, children, layout = 'horizontal' } = props

    const formItemLayout: FormItemProps = {}
    if (layout === 'horizontal') {
      formItemLayout.labelAlign = 'left'
      formItemLayout.labelCol = { span: 6 }
      formItemLayout.wrapperCol = { span: 18 }
    }
    if (fieldType === 'form' || fieldType === 'group' || fieldType === 'object' || fieldType === 'import_subform') {
      formItemLayout.labelCol = { span: 24 }
      formItemLayout.wrapperCol = { span: 24 }
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
      <Form.Item
        extra={extra ? extra.trim() : ''}
        required={required}
        label={label}
        validateStatus={validateStatus}
        help={fieldType === 'group' || fieldType === 'import_subform' ? null : message}
        {...formItemLayout}
        className={styles[`ccms-antd-mini-form-${fieldType}`]}
        style={visitable ? {} : { overflow: 'hidden', width: 0, height: 0 }}
      >
        {children}
      </Form.Item>
    )
  }

  renderItemComponent = (props: IFormFieldItem) => {
    const { index, isLastIndex, title, onRemove, onSort, children } = props

    return (
      <Collapse.Panel
        header={title}
        key={index}
        forceRender={false}
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
    const { insertText, onInsert, children } = props

    return (
      <>
        {onInsert ? (
          <div className={styles['ccms-antd-mini-formField-form-before-button']}>
            <Button type="link" icon={<PlusOutlined />} onClick={() => onInsert()}>
              {insertText}
            </Button>
          </div>
        ) : null}
        <Collapse accordion bordered={false} className={styles['ccms-antd-mini-formField-form']}>
          {children}
        </Collapse>
        {children?.length > 0 && onInsert ? (
          <div className={styles['ccms-antd-mini-formField-form-after-button']}>
            <Button type="link" icon={<PlusOutlined />} onClick={() => onInsert()}>
              {insertText}
            </Button>
          </div>
        ) : null}
      </>
    )
  }
}
