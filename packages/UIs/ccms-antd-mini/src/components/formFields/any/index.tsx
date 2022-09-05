import React from 'react'
import { Row, Col, Select } from 'antd'
import 'antd/lib/row/style'
import 'antd/lib/col/style'
import 'antd/lib/select/style'
import { AnyField } from 'ccms'
import { IAnyField, IAnyTypeField } from 'ccms/dist/components/formFields/any'
import TextField from '../text'
import NumberField from '../number'
import BooleanField from '../switch'

export default class AnyFieldComponent extends AnyField {
  TextField = TextField

  NumberField = NumberField

  BooleanField = BooleanField

  renderTypeComponent = (props: IAnyTypeField) => {
    return (
      <Select
        getPopupContainer={(ele) => ele.parentElement || document.body}
        value={props.type}
        onChange={(type) => props.onChange(type)}
      >
        <Select.Option value="null">空</Select.Option>
        <Select.Option value="string">字符串</Select.Option>
        <Select.Option value="number">数值</Select.Option>
        <Select.Option value="boolean">布尔值</Select.Option>
      </Select>
    )
  }

  renderComponent = (props: IAnyField) => {
    const { typeContent, valueContent } = props

    return (
      <Row gutter={4}>
        <Col span={10}>{typeContent}</Col>
        <Col span={14}>{valueContent}</Col>
      </Row>
    )
  }
}
