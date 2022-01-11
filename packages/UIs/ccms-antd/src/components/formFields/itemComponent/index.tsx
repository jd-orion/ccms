import React from "react";
import { Form } from 'antd'
import { Field, FieldConfigs, FieldError } from '../../../components/formFields/common';

export default class ItemComponent extends React.Component<props:IGroupField> {
    render(): React.ReactNode {

        const {
            label,
            status,
            message,
            extra,
            required,
            fieldType,
            layout,
            children
        } = this.props

        return (
            <Form.Item
                extra={extra ? extra.trim() : ''}
                required={required}
                label={label}
                validateStatus={status === 'normal' ? undefined : status === 'error' ? 'error' : 'validating'}
                help={message === '' ? null : message}
                {...formItemLayout(layout, fieldType, label)}
            >
                {children}
            </Form.Item>
        )
    }
}