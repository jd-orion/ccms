import React from 'react'
import { TextColumn } from 'ccms'
import { ITextColumn, TextColumnConfig } from 'ccms/dist/components/tableColumns/text'
export const PropsType = (props: TextColumnConfig) => { }
import styles from './index.less'
import { Modal, Button } from "antd"
export default class TextColumnComponent extends TextColumn {

  showMore = (value) => {
    Modal.info({
      getContainer: () => document.getElementById('ccms-antd') || document.body,
      content: (<div style={{ overflow: 'auto', maxHeight: '400px' }}>{value}</div>),
      okText: '确定',
      width: '50%',
      maskClosable: true
    });
  }

  renderComponent = (props: ITextColumn) => {
    const {
      value,
      linkUrl,
      showLines,
      showMore
    } = props

    return (showLines && showLines > 0 ?
      <>
        {showMore && <Button className={styles['ccms-table-text-button']} onClick={() => this.showMore(value)} type='link'>查看</Button>}
        <div className={styles['ccms-table-text']} style={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: showLines || 0, lineClamp: showLines || 0 }}>
          {linkUrl ? <a href={value} target='_blank' rel="noreferrer">{value} </a> :  value}
        </div>
      </>
      : <>
        {linkUrl ? <a href={value} target='_blank' rel="noreferrer">{value} </a> :  value } 
      </>
    )
  }
}
