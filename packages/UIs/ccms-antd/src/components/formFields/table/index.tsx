import React from 'react'
import { TableField } from 'ccms'
import { ITableField, ITableColumn } from 'ccms/dist/src/components/formFields/table'
import { Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { SortableContainer, SortableContainerProps, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { MenuOutlined } from '@ant-design/icons'
import { display } from '..'
import CCMS from '../../../main'
import styles from './index.less'
import OperationsHelperComponent from '../../../util/operations'
import OperationHelper from '../../../util/operation'
import TableFieldForm from './common/form'

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />)

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />)
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />)

export default class TableFieldComponent extends TableField {
  CCMS = CCMS

  display = (type: string) => display[type]

  OperationsHelper = OperationsHelperComponent

  OperationHelper = OperationHelper

  TableFieldForm = TableFieldForm

  renderComponent = (props: ITableField) => {
    const { width, primary, tableColumns, tableSort, tableOperations, data } = props

    const prefixColumns: ColumnType<object>[] = []
    if (tableSort) {
      prefixColumns.push({
        dataIndex: 'sort',
        width: 50,
        render: () => <DragHandle />
      })
    }
    function DraggableContainer(draggableContainerProps: SortableContainerProps) {
      return (
        <SortableBody
          useDragHandle
          disableAutoscroll
          helperClass={styles['row-dragging']}
          onSortEnd={({ oldIndex, newIndex }) => {
            if (typeof tableSort === 'function' && oldIndex !== newIndex) {
              tableSort(oldIndex, newIndex)
            }
          }}
          {...draggableContainerProps}
        />
      )
    }
    function DraggableBodyRow(draggableBodyRowProps: { 'data-row-key': unknown }) {
      const { 'data-row-key': dataRowKey } = draggableBodyRowProps
      const index = ((data as { [field: string]: unknown }[]) || []).findIndex(
        // eslint-disable-next-line eqeqeq
        (x) => x[primary] == dataRowKey
      )
      return <SortableItem index={index} {...draggableBodyRowProps} className={undefined} style={undefined} />
    }

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
          columns={[
            ...prefixColumns,
            ...tableColumns.map(
              (column: ITableColumn, columnIndex: number) =>
                ({
                  key: columnIndex,
                  dataIndex: column.field,
                  title: column.label,
                  className: typeof tableSort === 'function' ? styles['drag-visible'] : undefined,
                  align: column.align,
                  render: (value: unknown, record: { [field: string]: unknown }, index: number) =>
                    column.render(value, record, index)
                } as ColumnType<object>)
            )
          ]}
          dataSource={data as { [field: string]: unknown }[]}
          scroll={width ? { x: width } : {}}
          size="middle"
          pagination={false}
          components={
            tableSort
              ? {
                  body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow
                  }
                }
              : undefined
          }
        />
      </div>
    )
  }
}
