import React from 'react'
import { DetailGroupField } from 'ccms'
import { IGroupField } from 'ccms/dist/components/detail/group'
import { IDetailItem } from 'ccms/dist/steps/detail'
import getALLComponents from '..'
import { computedItemStyle, computedGapStyle } from '../common'
import './index.less'

export default class GroupFieldComponent extends DetailGroupField {
  getALLComponents = (type) => getALLComponents[type]

  renderComponent = (props: IGroupField) => {
    const { children, columns } = props
    const gap = computedGapStyle(columns, 'row')
    return (
      <div
        style={{
          ...gap
        }}
        className="ccms-antd-mini-detail-group-row"
      >
        {children}
      </div>
    )
  }

  renderItemComponent = (props: IDetailItem) => {
    const { layout, label, styles: itemstyle, columns, children } = props
    const colStyle = computedItemStyle(columns, layout)

    return (
      <div style={colStyle} className="detail-group-col ccms-antd-mini-detail-gruop">
        <div className="detail-group-content">
          <div className="ccms-antd-mini-detail-gruop-title">{label}</div>
          <div className="detail-group-children" style={itemstyle}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}
