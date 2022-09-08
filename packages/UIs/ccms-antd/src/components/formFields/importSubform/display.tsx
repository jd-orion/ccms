import React from 'react'
import { ImportSubformDisplay } from 'ccms'
import { IImportSubformField } from 'ccms/dist/components/detail/importSubform'
import { Display } from 'ccms/dist/components/formFields/common'
import { IDetailItem } from 'ccms/dist/steps/detail'
import { Form } from 'antd'
import 'antd/lib/form/style'
import { display as getALLComponents } from '..'
import InterfaceHelper from '../../../util/interface'
import './index.less'
import { computedItemStyle, computedGapStyle } from '../common'

export default class ImportSubformDisplayComponent extends ImportSubformDisplay {
  getALLComponents = (type): typeof Display => getALLComponents[type]

  interfaceHelper = new InterfaceHelper()

  renderComponent = (props: IImportSubformField) => {
    const { columns, children } = props
    const gap = computedGapStyle(columns, 'row')

    return (
      <div
        style={{
          ...gap
        }}
        className="ccms-antd-mini-form-group-row"
      >
        {children}
      </div>
    )
  }

  /**
   * 表单项组件 - UI渲染方法
   * 各UI库需重写该方法
   * @param props
   */
  renderItemComponent = (props: IDetailItem) => {
    const { key, label, columns, layout, visitable, fieldType, children } = props

    const colStyle = computedItemStyle(columns, layout, visitable)
    const itemStyle = visitable ? {} : { overflow: 'hidden', width: 0, height: 0, margin: 0, padding: 0 }
    if (columns?.type === 'width' && columns?.value && columns.wrap) {
      Object.assign(itemStyle, { width: columns.value })
    }

    return (
      <div style={colStyle} key={key} className={`form-group-col form-group-col-${fieldType}`}>
        <Form.Item key={key} label={label} className={`ccms-antd-mini-form-${fieldType}`} style={itemStyle}>
          {children}
        </Form.Item>
      </div>
    )
  }
}
