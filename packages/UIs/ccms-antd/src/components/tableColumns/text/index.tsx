import React from 'react'
import { TextColumn } from 'ccms'
import { ITextColumn } from 'ccms/dist/components/tableColumns/text'
import { Modal, Button } from 'antd'
import 'antd/lib/modal/style'
import 'antd/lib/button/style'
import './index.less'

export default class TextColumnComponent extends TextColumn {
  showMore = (value) => {
    Modal.info({
      getContainer: () => document.getElementById('ccms-antd') || document.body,
      content: <div style={{ overflow: 'auto', maxHeight: '400px' }}>{value}</div>,
      okText: '确定',
      width: '50%',
      maskClosable: true
    })
  }

  renderComponent = (props: ITextColumn) => {
    const { value, linkUrl, showLines, showMore } = props

    return showLines && showLines > 0 ? (
      <>
        {showMore && (
          <Button className="ccms-table-text-button" onClick={() => this.showMore(value)} type="link">
            查看
          </Button>
        )}
        <div
          className="ccms-table-text"
          style={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: showLines || 0, lineClamp: showLines || 0 }}
        >
          {linkUrl ? (
            <a href={value} target="_blank" rel="noreferrer">
              {value}{' '}
            </a>
          ) : (
            value
          )}
        </div>
      </>
    ) : (
      <>
        {linkUrl ? (
          <a href={value} target="_blank" rel="noreferrer">
            {value}{' '}
          </a>
        ) : (
          value
        )}
      </>
    )
  }
}
