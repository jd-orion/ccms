import React from 'react'
import { TextColumn } from 'ccms'
import { ITextColumn, TextColumnConfig } from 'ccms/dist/src/components/tableColumns/text'
export const PropsType = (props: TextColumnConfig) => { }
import styles from './index.less'
import { Modal, Button } from "antd"
export default class TextColumnComponent extends TextColumn {

  showMore = (value) => {
    Modal.info({
      getContainer: () => document.getElementById('ccms-antd') || document.body,
      content: (<div style={{ overflow: 'hidden' }}>{value}</div>),
      okText: '确定',
      width: '50%',
      style: { overflowY: 'scroll', height: '400px' }
    });
  }

  renderComponent = (props: ITextColumn) => {
    const {
      value,
      linkUrl,
      showLines,
      showMore
    } = props

    return (linkUrl ?
      <a href={value} target='_blank' rel="noreferrer">{value} </a>
      : showLines && showLines > 0 ?
        <>
          <div className={styles['ccms-table-text']} style={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: showLines, lineClamp: showLines }}>
            {value}
          </div>
          {showMore && <Button onClick={() => this.showMore(value)} type='link'>查看全部</Button>}
        </>
        : <>
          {value}
        </>
    )
  }
}
