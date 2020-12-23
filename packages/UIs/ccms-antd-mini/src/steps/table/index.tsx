import React, { ReactNode } from 'react'
import { TableStep } from 'ccms-core'
import { ITable, IColumn } from 'ccms-core/dist/src/steps/table'
import { Table } from 'antd'
import 'antd/lib/style/index.css'
import 'antd/lib/table/style/index.css'
import 'antd/lib/button/style/index.css'
import 'antd/lib/empty/style/index.css'
import 'antd/lib/radio/style/index.css'
import 'antd/lib/checkbox/style/index.css'
import 'antd/lib/dropdown/style/index.css'
import 'antd/lib/spin/style/index.css'
import 'antd/lib/pagination/style/index.css'
import 'antd/lib/tooltip/style/index.css'
import TextColumnComponent from '../../components/tableColumns/text'
import { ColumnType } from 'antd/lib/table'

export default class TableStepComponent extends TableStep {
  ColumnType = {
    text: TextColumnComponent
  }
  renderComponent = (props: ITable) => {
    const {
      columns,
      data
    } = props
    return (
      <Table
        columns={columns.map((column: IColumn, index:number) => ({
          key: index,
          dataIndex: column.field,
          title: column.label,
          render: (value: any, record: { [field: string]: any }, index: number) => column.render(value, record, index)
        }))}
        dataSource={data}
      />
    )
  }
}