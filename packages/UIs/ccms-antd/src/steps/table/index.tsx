import React from 'react'
import { TableStep } from 'ccms'
import { ITable, ITableColumn, ITableStepOperationColumn, ITableStepOperationColumnButton, ITableStepOperationColumnGroup, ITableStepOperationColumnGroupItem, ITableStepOperationColumnConfirm, ITableStepOperationModal } from 'ccms/dist/src/steps/table'
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
import getALLComponents from '../../components/tableColumns'
import { IAPIConditionFailModal, IAPIConditionSuccessModal } from 'ccms/dist/src/util/request'
import CCMS from '../../main'

export default class TableStepComponent extends TableStep {
  CCMS = CCMS
  getALLComponents = (type: any) => getALLComponents[type]

  renderOperationColumnCheckSuccessModal = (props: IAPIConditionSuccessModal) => {
    Modal.success({
      title: props.message,
      onOk: () => {
        props.onOk()
      }
    })
  }

  renderOperationColumnCheckFailModal = (props: IAPIConditionFailModal) => {
    Modal.error({
      title: props.message,
      onOk: () => {
        props.onOk()
      }
    })
  }

  renderOperationColumnConfirm = (props: ITableStepOperationColumnConfirm) => {
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
      primary,
      columns,
      data
    } = props

    return (
      <Table
        rowKey={primary}
        columns={columns.map((column: ITableColumn, index: number) => ({
          key: index,
          dataIndex: column.field,
          title: column.label,
          render: (value: any, record: { [field: string]: any }, index: number) => column.render(value, record, index)
        }))}
        dataSource={data}
        scroll={{ x: 1000 }}
        style={{marginTop: "10px"}}
      />
    )
  }

  renderOperationColumnComponent = (props: ITableStepOperationColumn) => {
    const {
      children
    } = props
    return (
      <Button.Group>
        {children}
      </Button.Group>
    )
  }

  renderOperationColumnButtonComponent = (props: ITableStepOperationColumnButton) => {
    const {
      label,
      disabled,
      onClick
    } = props
    return <Button disabled={disabled} onClick={() => onClick()}>{label}</Button>
  }

  renderOperationColumnGroupComponent = (props: ITableStepOperationColumnGroup) => {
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
        <Button style={{ marginBottom: "10px" }}>
          {label}
          <DownOutlined />
        </Button>
      </Dropdown>
    )
  }

  renderOperationColumnGroupItemComponent = (props: ITableStepOperationColumnGroupItem) => {
    const {
      label,
      disabled,
      onClick
    } = props
    return (
      <Menu.Item disabled={disabled} onClick={() => onClick()}>{label}</Menu.Item>
    )
  }

  renderOperationModal = (props: ITableStepOperationModal) => {
    const {
      title,
      visible,
      children,
      onClose
    } = props

    return (
      <Modal
        title={title}
        width={'50%'}
        visible={visible}
        forceRender={true}
        getContainer={false}
        footer={false}
        onCancel={onClose}
      >
        {children}
      </Modal>
    )
  }
}
export const PropsType = (props: ITable) => { };
