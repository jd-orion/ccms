import React from 'react'
import { TableField } from 'ccms'
import { ITableField, ITableColumn } from 'ccms/dist/src/components/formFields/table'
import { Button, Table } from 'antd'
import { display } from '..'
import CCMS from '../../../main'
import styles from './index.less'

export default class TableFieldComponent extends TableField {
  CCMS = CCMS

  display = (type: string) => display[type]

  renderComponent = (props: ITableField) => {
    const { width, primary, tableColumns, data } = props
    return (
      <div className={styles['ccms-antd-table']} style={{ ...(width && { maxWidth: width }) }}>
        <Table
          title={() => <Button>添加记录</Button>}
          footer={() => <Button>添加记录</Button>}
          rowKey={primary}
          columns={tableColumns.map((column: ITableColumn, columnIndex: number) => ({
            key: columnIndex,
            dataIndex: column.field,
            title: column.label,
            align: column.align,
            render: (value: unknown, record: { [field: string]: unknown }, index: number) =>
              column.render(value, record, index)
          }))}
          dataSource={data as { [field: string]: unknown }[]}
          scroll={width ? { x: width } : {}}
          size="middle"
          pagination={false}
        />
      </div>
    )
  }
}
