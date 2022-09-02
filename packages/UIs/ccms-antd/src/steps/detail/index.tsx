import React from 'react'
import { Button, Col, Space, Typography, Collapse } from 'antd'
import 'antd/lib/button/style'
import 'antd/lib/col/style'
import 'antd/lib/space/style'
import 'antd/lib/typography/style'
import 'antd/lib/collapse/style'
import { DetailStep } from 'ccms'
import { IDetail, IDetailItem } from 'ccms/dist/steps/detail'
import getALLComponents from '../../components/detail'
import './index.less'
import { computedItemStyle } from '../../components/detail/common'

const { Title } = Typography
const { Panel } = Collapse

export default class DetailStepComponent extends DetailStep {
  getALLComponents = (type) => getALLComponents[type]

  renderComponent = (props: IDetail) => {
    const { columns, onBack, backText, children } = props
    const gap = Number(columns?.gap || 0)
    return (
      <div
        style={{
          rowGap: `${gap * 2}px`
        }}
        className="ccms-antd-mini-detail-row"
      >
        {children}
        {onBack && (
          <Col span={24}>
            <Space>
              <Button onClick={() => onBack()}>{backText || '返回'}</Button>
            </Space>
          </Col>
        )}
      </div>
    )
  }

  renderItemComponent = (props: IDetailItem) => {
    const { key, layout, styles, label, columns, fieldType, children } = props

    const colStyle = computedItemStyle(columns, layout)

    return (
      <div
        style={Object.assign(colStyle, styles)}
        key={key}
        className={`detail-col detail-col-${fieldType} detail-col-${columns?.type || 'span'}`}
      >
        {fieldType === 'group' ? (
          this.renderGroupUI(label, children)
        ) : (
          <div className="detail-group-content">
            <div className={`detail-${fieldType}-title`}>{label}</div>
            {children}
          </div>
        )}
      </div>
    )
  }

  // group UI
  renderGroupUI = (label: string, children: React.ReactNode, collapsible?: 'header' | 'disabled') => {
    return (
      <Collapse collapsible="header" defaultActiveKey={['1']}>
        <Panel header={label} key="1" collapsible={collapsible || 'header'}>
          <div className="detail-group-content">{children}</div>
        </Panel>
      </Collapse>
    )
  }

  // title UI
  renderTitleUI = (label: string, level: 5 | 1 | 2 | 3 | 4 | undefined) => {
    return <Title level={level}>{label}</Title>
  }
}
