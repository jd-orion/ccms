import React from 'react'
import { TableField } from 'ccms'
import { ITableField, ITableColumn } from 'ccms/dist/src/components/formFields/table'
import { Table } from 'antd'
import { display } from '..'
import CCMS from '../../../main'
import styles from './index.less'
import OperationsHelperComponent from '../../../util/operations'
import OperationHelper from '../../../util/operation'
import TableFieldForm from './common/form'

export default class TableFieldComponent extends TableField {
  CCMS = CCMS

  display = (type: string) => display[type]

  OperationsHelper = OperationsHelperComponent

  OperationHelper = OperationHelper

  TableFieldForm = TableFieldForm

  renderComponent = (props: ITableField) => {
    const { width, primary, tableColumns, tableOperations, data } = props
    return (
      <div className={styles['ccms-antd-table']} style={{ ...(width && { maxWidth: width }) }}>
        <Table
          title={
            tableOperations && (tableOperations.topLeft || tableOperations.topRight)
              ? () => (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{tableOperations.topLeft}</div>
                    <div>{tableOperations.topRight}</div>
                  </div>
                )
              : undefined
          }
          footer={
            tableOperations && (tableOperations.bottomLeft || tableOperations.bottomRight)
              ? () => (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{tableOperations.bottomLeft}</div>
                    <div>{tableOperations.bottomRight}</div>
                  </div>
                )
              : undefined
          }
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
