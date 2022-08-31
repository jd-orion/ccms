import React from 'react'
import { DetailTableField } from 'ccms'
import {
  ITableField,
  TableFieldConfig,
  ITableColumn,
  ITableDetailOperationConfirm,
  ITableDetailOperationModal,
  ITableDetailRowOperation,
  ITableDetailRowOperationButton,
  ITableDetailRowOperationGroup,
  ITableDetailRowOperationGroupItem,
  ITableDetailTableOperation,
  ITableDetailTableOperationButton,
  ITableDetailTableOperationGroup,
  ITableDetailTableOperationGroupItem
} from 'ccms/dist/components/detail/table'
import { Table, Dropdown, Menu, Modal, Space } from 'antd'
import getALLComponents from '../../tableColumns'
import CCMS from '../../../main'
import InterfaceHelper from '../../../util/interface'
import styles from './index.less'

export const PropsType = (props: TableFieldConfig) => { }

export default class TableFieldComponent extends DetailTableField {
  CCMS = CCMS

  getALLComponents = (type: any) => getALLComponents[type]

  interfaceHelper = new InterfaceHelper()

  renderOperationConfirm = (props: ITableDetailOperationConfirm) => {
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

  renderComponent = (props: ITableField) => {
    const { width, primary, tableColumns, data, pagination } = props
    return (
      <div className={styles['ccms-antd-table']} style={{ ...(width && { maxWidth: width }) }}>
        <Table
          rowKey={primary}
          columns={tableColumns.map((column: ITableColumn, index: number) => ({
            key: index,
            dataIndex: column.field,
            title: column.label,
            align: column.align,
            render: (value: any, record: { [field: string]: any }, index: number) => column.render(value, record, index)
          }))}
          dataSource={data}
          scroll={width ? { x: width } : {}}
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

  renderRowOperationComponent = (props: ITableDetailRowOperation) => {
    const { children } = props
    return <Space size="middle">{children}</Space>
  }

  renderRowOperationButtonComponent = (props: ITableDetailRowOperationButton) => {
    const { label, onClick } = props

    return <a onClick={() => onClick()}>{label}</a>
  }

  renderRowOperationDropdownComponent = (props: ITableDetailRowOperationGroup) => {
    const { label, children } = props
    return (
      <Dropdown getPopupContainer={(node) => node.parentElement || document.body} overlay={<Menu>{children}</Menu>}>
        <a>{label}</a>
      </Dropdown>
    )
  }

  renderRowOperationDropdownItemComponent = (props: ITableDetailRowOperationGroupItem) => {
    const { label, disabled, onClick } = props
    return (
      <Menu.Item disabled={disabled} onClick={() => onClick()}>
        {label}
      </Menu.Item>
    )
  }

  renderOperationModal = (props: ITableDetailOperationModal) => {
    const { title, visible, children, onClose } = props

    return (
      <Modal title={title} visible={visible} forceRender getContainer={false} footer={false} onCancel={onClose}>
        {children}
      </Modal>
    )
  }
}
