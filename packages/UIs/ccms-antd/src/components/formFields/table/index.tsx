import React from 'react'
import { TableField } from 'ccms'
import { ITableField, ITableColumn } from 'ccms/dist/components/formFields/table'
import { Table, Tooltip } from 'antd'
import 'antd/lib/table/style'
import 'antd/lib/tooltip/style'
import { ColumnType } from 'antd/lib/table'
import { SortableContainer, SortableContainerProps, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { MenuOutlined } from '@ant-design/icons'
import { display } from '..'
import CCMS from '../../../main'
import './index.less'
import OperationsHelperComponent from '../../../util/operations'
import OperationHelper from '../../../util/operation'
import TableFieldForm from './common/form'
import FormContainerComponent from '../container'

const DragHandle = SortableHandle<{ expanded: boolean }>(({ expanded }) =>
  expanded ? (
    <Tooltip title="表格中有被展开的行时无法拖拽排序">
      <MenuOutlined style={{ cursor: 'not-allowed', color: '#999' }} />
    </Tooltip>
  ) : (
    <MenuOutlined style={{ cursor: 'move', color: '#999' }} />
  )
)

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />)
const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />)

interface TableFieldComponentState {
  expanded: boolean
}

export default class TableFieldComponent extends TableField<TableFieldComponentState> {
  constructor(props) {
    super(props, {
      expanded: false
    })
  }

  CCMS = CCMS

  display = (type: string) => display[type]

  OperationsHelper = OperationsHelperComponent

  OperationHelper = OperationHelper

  FormContainer = FormContainerComponent

  TableFieldForm = TableFieldForm

  renderComponent = (props: ITableField) => {
    const { width, primary, tableColumns, tableSort, tableExpand, tableOperations, data } = props
    const { expanded } = this.state

    const prefixColumns: ColumnType<object>[] = []
    if (tableSort) {
      prefixColumns.push({
        dataIndex: 'sort',
        width: 50,
        render: () => <DragHandle expanded={expanded} />
      })
    }
    function DraggableContainer(draggableContainerProps: SortableContainerProps) {
      return (
        <SortableBody
          useDragHandle
          disableAutoscroll
          helperClass="row-dragging"
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
      <div className="ccms-antd-table" style={{ ...(width && { maxWidth: width }) }}>
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
                  className: typeof tableSort === 'function' ? 'drag-visible' : undefined,
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
            tableSort && !expanded
              ? {
                  body: {
                    wrapper: DraggableContainer,
                    row: DraggableBodyRow
                  }
                }
              : undefined
          }
          expandable={{
            expandedRowRender: (record, index) => (
              <>
                {(tableExpand || [])
                  .filter(({ show }) => show(record as { [key: string]: unknown }))
                  .map(({ render }) => render(record as { [key: string]: unknown }, index))}
              </>
            ),
            rowExpandable: (record) => {
              return !!(tableExpand || []).find(({ show }) => show(record as { [key: string]: unknown }))
            },
            onExpandedRowsChange: (expandedKeys) => {
              this.setState({
                expanded: expandedKeys.length > 0
              })
            }
          }}
        />
      </div>
    )
  }
}
