import React from 'react'
import { TableStep } from 'ccms-core'
import { ITable } from 'ccms-core/dist/src/steps/table'
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
import DatetimeColumnComponent from '../../components/tableColumns/datetime'

export default class TableStepComponent extends TableStep {
  TextColumn = TextColumnComponent
  DatetimeColumn = DatetimeColumnComponent

  renderComponent = (props: ITable) => {
    const {
      columns,
      data
    } = props

    return (
      <Table
        columns={columns.map((column, index) => ({
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
