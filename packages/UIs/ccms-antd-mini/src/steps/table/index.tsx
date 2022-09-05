import React from 'react'
import { TableStep } from 'ccms'
import {
  ITable,
  ITableColumn,
  ITableStepOperationConfirm,
  ITableStepOperationModal,
  ITableStepRowOperation,
  ITableStepRowOperationButton,
  ITableStepRowOperationGroup,
  ITableStepRowOperationGroupItem,
  ITableStepTableOperation,
  ITableStepTableOperationButton,
  ITableStepTableOperationGroup,
  ITableStepTableOperationGroupItem
} from 'ccms/dist/steps/table'
import { Table, Button, Dropdown, Menu, Modal, Space, Typography } from 'antd'
import 'antd/lib/table/style'
import 'antd/lib/button/style'
import 'antd/lib/dropdown/style'
import 'antd/lib/menu/style'
import 'antd/lib/modal/style'
import 'antd/lib/space/style'
import 'antd/lib/typography/style'
import { DownOutlined } from '@ant-design/icons'
import { ButtonProps } from 'antd/lib/button'
import getALLComponents from '../../components/tableColumns'
import CCMS from '../../main'
import InterfaceHelper from '../../util/interface'
import './index.less'

export default class TableStepComponent extends TableStep {
  CCMS = CCMS

  getALLComponents = (type) => getALLComponents[type]

  interfaceHelper = new InterfaceHelper()

  renderOperationConfirm = (props: ITableStepOperationConfirm) => {
    Modal.confirm({
      getContainer: () => document.getElementById('ccms-antd') || document.body,
      title: props.title,
      okText: props.okText,
      cancelText: props.cancelText,
      onOk: () => {
        props.onOk()
      },
      onCancel: () => {
        props.onCancel()
      }
    })
  }

  renderComponent = (props: ITable) => {
    const { title, tableOperations, primary, columns, data, pagination } = props

    return (
      <div className="ccms-antd-table">
        {(title || tableOperations) && (
          <div className="ccms-antd-table-header">
            <div className="ccms-antd-table-title">{title}</div>
            <div className="ccms-antd-table-tableOperation">{tableOperations}</div>
          </div>
        )}
        <Table
          rowKey={primary}
          columns={columns.map((column: ITableColumn, index: number) => ({
            key: index,
            dataIndex: column.field,
            title: column.label,
            align: column.align,
            render: (value: unknown, record: { [field: string]: unknown }, recordIndex: number) =>
              column.render(value, record, recordIndex)
          }))}
          dataSource={data}
          scroll={{ x: 1000 }}
          size="middle"
          pagination={
            pagination === undefined
              ? false
              : {
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  onChange: (page, pageSize) => pagination.onChange(page, pageSize || pagination.pageSize),
                  showSizeChanger: true,
                  showTotal: (total, range) => `第 ${range[0]} - ${range[1]} 条 / 共 ${total} 条`,
                  locale: {
                    items_per_page: '条/页'
                  }
                }
          }
        />
      </div>
    )
  }

  renderRowOperationComponent = (props: ITableStepRowOperation) => {
    const { children } = props
    return <Space size="middle">{children}</Space>
  }

  renderRowOperationButtonComponent = (props: ITableStepRowOperationButton) => {
    const { label, onClick } = props

    return <Typography.Link onClick={() => onClick()}>{label}</Typography.Link>
  }

  renderRowOperationGroupComponent = (props: ITableStepRowOperationGroup) => {
    const { label, children } = props
    return (
      <Dropdown getPopupContainer={(ele) => ele.parentElement || document.body} overlay={<Menu>{children}</Menu>}>
        <Typography.Link>{label}</Typography.Link>
      </Dropdown>
    )
  }

  renderRowOperationGroupItemComponent = (props: ITableStepRowOperationGroupItem) => {
    const { label, disabled, onClick } = props
    return (
      <Menu.Item disabled={disabled} onClick={() => onClick()}>
        {label}
      </Menu.Item>
    )
  }

  renderTableOperationComponent = (props: ITableStepTableOperation) => {
    const { children } = props
    return <Button.Group>{children}</Button.Group>
  }

  renderTableOperationButtonComponent = (props: ITableStepTableOperationButton) => {
    const { label, level, disabled, onClick } = props

    const buttonProps: ButtonProps = { disabled }
    if (level === 'primary') {
      buttonProps.type = 'primary'
    } else if (level === 'danger') {
      buttonProps.danger = true
    }
    return (
      <Button {...buttonProps} onClick={() => onClick()}>
        {label}
      </Button>
    )
  }

  renderTableOperationGroupComponent = (props: ITableStepTableOperationGroup) => {
    const { label, children } = props

    return (
      <Dropdown getPopupContainer={(ele) => ele.parentElement || document.body} overlay={<Menu>{children}</Menu>}>
        <Button style={{ marginBottom: '10px' }}>
          {label}
          <DownOutlined />
        </Button>
      </Dropdown>
    )
  }

  renderTableOperationGroupItemComponent = (props: ITableStepTableOperationGroupItem) => {
    const { label, disabled, onClick } = props
    return (
      <Menu.Item disabled={disabled} onClick={() => onClick()}>
        {label}
      </Menu.Item>
    )
  }

  renderOperationModal = (props: ITableStepOperationModal) => {
    const { title, visible, children, onClose } = props

    return (
      <Modal title={title} visible={visible} forceRender getContainer={false} footer={false} onCancel={onClose}>
        {children}
      </Modal>
    )
  }
}
