import React from 'react'
import { TextColumn } from 'ccms'
import { ITextColumn, TextColumnConfig } from 'ccms/dist/src/components/tableColumns/text'
import { Modal, Button } from 'antd'
import styles from './index.less'

export const PropsType = (props: TextColumnConfig) => { }

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

  link = (value) => {
    window.open(value, '_blank')
  }

  renderComponent = (props: ITextColumn) => {
    const { value, linkUrl, showLines, showMore } = props

    return showLines && showLines > 0 ? (
      <>
        {showMore && (
          <Button className={styles['ccms-table-text-button']} onClick={() => this.showMore(value)} type="link">
            查看
          </Button>
        )}
        <div
          className={styles['ccms-table-text']}
          style={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: showLines || 0, lineClamp: showLines || 0 }}
        >
          {linkUrl ? (
            <div className={styles['ccms-table-text-link']} onClick={() => this.link(value)} aria-hidden="true">
              {value}{' '}
            </div>
          ) : (
            value
          )}
        </div>
      </>
    ) : (
      <>
        {linkUrl ? (
          <div className={styles['ccms-table-text-link']} onClick={() => this.link(value)} aria-hidden="true">
            {value}{' '}
          </div>
        ) : (
          value
        )}
      </>
    )
  }
}
