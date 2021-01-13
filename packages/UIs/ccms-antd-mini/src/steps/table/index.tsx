import React from 'react'
import { TableStep } from 'ccms-core'
import { ITable, ITableColumn, ITableStepOperation, ITableStepOperationButton, ITableStepOperationGroup, ITableStepOperationGroupItem } from 'ccms-core/dist/src/steps/table'
import { Table, Button, Dropdown, Menu, Modal } from 'antd'
import { DownOutlined } from '@ant-design/icons'
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
import { IAPIConditionFailModal, IAPIConditionSuccessModal } from 'ccms-core/dist/src/util/request'
import { ITableStepOperationConfirm } from 'ccms-core/dist/src/steps/table'

export default class TableStepComponent extends TableStep {
  TextColumn = TextColumnComponent
  DatetimeColumn = DatetimeColumnComponent

  renderOperationCheckSuccessModal = (props: IAPIConditionSuccessModal) => {
    Modal.success({
      title: props.message,
      onOk: () => {
        props.onOk()
      }
    })
  }

  renderOperationCheckFailModal = (props: IAPIConditionFailModal) => {
    Modal.error({
      title: props.message,
      onOk: () => {
        props.onOk()
      }
    })
  }

  renderOperationConfirm = (props: ITableStepOperationConfirm) => {
    Modal.confirm({
      title: props.title,
      okText: props.okText,
      cancelText: props.cancelText,
      onOk: () => { props.onOk() },
      onCancel: () => { props.onCancel() }
    })
  }

  renderComponent = (props: ITable) => {
    const {
      columns,
      data
    } = props

    return (
      <Table
        columns={columns.map((column: ITableColumn, index: number) => ({
          key: index,
          dataIndex: column.field,
          title: column.label,
          render: (value: any, record: { [field: string]: any }, index: number) => column.render(value, record, index)
        }))}
        dataSource={data}
        scroll={{ x: 1000 }}
      />
    )
  }

  renderOperationComponent = (props: ITableStepOperation) => {
    const {
      children
    } = props
    return (
      <Button.Group>
        {children}
      </Button.Group>
    )
  }

  renderOperationButtonComponent = (props: ITableStepOperationButton) => {
    const {
      label,
      disabled,
      onClick
    } = props
    return <Button disabled={disabled} onClick={() => onClick()}>{label}</Button>
  }

  renderOperationGroupComponent = (props: ITableStepOperationGroup) => {
    const {
      label,
      children
    } = props
    return (
      <Dropdown
        overlay={(
          <Menu>
            {children}
          </Menu>
        )}
      >
        <Button>
          {label}
          <DownOutlined />
        </Button>
      </Dropdown>
    )
  }

  renderOperationGroupItemComponent = (props: ITableStepOperationGroupItem) => {
    const {
      label,
      disabled,
      onClick
    } = props
    return (
      <Menu.Item disabled={disabled} onClick={() => onClick()}>{label}</Menu.Item>
    )
  }
}
