import React from 'react'
import { DetailInfoField } from 'ccms'
import { IInfoProps } from 'ccms/dist/components/detail/detailInfo'
import { Modal, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import 'antd/lib/modal/style'
import 'antd/lib/tooltip/style'

export default class InfoDetailComponent extends DetailInfoField {
  renderComponent = (props: IInfoProps) => {
    const { description } = props

    return (
      <div style={{ color: '#abb7c4', fontSize: '14px', marginTop: '2px' }}>
        {description && description.descType === 'text' && description.label !== undefined && description.label !== '' && (
          <span>
            {' '}
            {description.showIcon && <InfoCircleOutlined style={{ marginRight: '5px', marginBottom: '20px' }} />}
            <span style={{ marginBottom: '10px' }}>{description.label}</span>
          </span>
        )}
        {description &&
          description.descType === 'tooltip' &&
          description.label !== undefined &&
          description.label !== '' && (
            <Tooltip
              overlayStyle={{ color: 'white' }}
              placement="topLeft"
              title={description.content}
              getPopupContainer={(ele) => ele.parentElement || document.body}
            >
              {description.showIcon && <InfoCircleOutlined style={{ marginRight: '5px', marginBottom: '20px' }} />}
              <span style={{ marginBottom: '10px' }}>{description.label}</span>
            </Tooltip>
          )}
        {description &&
          description.descType === 'modal' &&
          description.label !== undefined &&
          description.label !== '' && (
            <span
              onClick={() => {
                Modal.info({
                  getContainer: () => document.getElementById('ccms-antd') || document.body,
                  content: <div style={{ overflow: 'hidden' }}>{description.content}</div>,
                  okText: '知道了'
                })
              }}
            >
              {description.showIcon && <InfoCircleOutlined style={{ marginRight: '5px', marginBottom: '20px' }} />}
              <span style={{ marginBottom: '10px' }}>{description.label}</span>
            </span>
          )}
      </div>
    )
  }
}
