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
  ITableStepTableOperationGroupItem,
  DescriptionConfig
} from 'ccms/dist/steps/table'
import { Table, Button, Dropdown, Menu, Modal, Space, Tooltip, Typography } from 'antd'
import 'antd/lib/table/style'
import 'antd/lib/button/style'
import 'antd/lib/dropdown/style'
import 'antd/lib/menu/style'
import 'antd/lib/modal/style'
import 'antd/lib/space/style'
import 'antd/lib/tooltip/style'
import 'antd/lib/typography/style'
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons'
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
    const { title, width, tableOperations, leftTableOperations, primary, columns, data, pagination, description } =
      props

    return (
      <div className="ccms-antd-table">
        {(title ||
          (description && ((description.label !== undefined && description.label !== '') || description.showIcon)) ||
          tableOperations ||
          leftTableOperations) && (
          <div className="ccms-antd-table-header">
            <div className="ccms-antd-table-left">
              <div className="ccms-antd-table-title">{title}</div>
              <div className="ccms-antd-table-title-explain">
                {description && this.renderExplainComponent(description)}
              </div>
              <div>{leftTableOperations}</div>
            </div>
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
          scroll={{ x: width || 1000 }}
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

  renderExplainComponent = (description: DescriptionConfig) => {
    return (
      <>
        {description &&
          description.type === 'text' &&
          ((description.label !== undefined && description.label !== '') || description.showIcon) && (
            <span>
              {' '}
              {description.showIcon && <InfoCircleOutlined style={{ marginRight: '5px' }} />}
              {description.label}{' '}
            </span>
          )}
        {description &&
          description.type === 'tooltip' &&
          ((description.label !== undefined && description.label !== '') || description.showIcon) && (
            <Tooltip
              overlayStyle={{ color: 'white' }}
              placement="topLeft"
              title={description.content}
              getPopupContainer={(ele) => ele.parentElement || document.body}
            >
              {description.showIcon && <InfoCircleOutlined style={{ marginRight: '5px' }} />}
              {description.label}
            </Tooltip>
          )}
        {description &&
          description.type === 'modal' &&
          ((description.label !== undefined && description.label !== '') || description.showIcon) && (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                Modal.info({
                  getContainer: () => document.getElementById('ccms-antd') || document.body,
                  content: <div style={{ overflow: 'hidden' }}>{description.content}</div>,
                  okText: '知道了'
                })
              }}
            >
              {description.showIcon && <InfoCircleOutlined style={{ marginRight: '5px' }} />}
              {description.label}
            </span>
          )}
      </>
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

  renderRowOperationDropdownComponent = (props: ITableStepRowOperationGroup) => {
    const { label, children } = props
    return (
      <Dropdown getPopupContainer={(node) => node.parentElement || document.body} overlay={<Menu>{children}</Menu>}>
        <Typography.Link>{label}</Typography.Link>
      </Dropdown>
    )
  }

  renderRowOperationDropdownItemComponent = (props: ITableStepRowOperationGroupItem) => {
    const { label, disabled, onClick } = props
    return (
      <Menu.Item disabled={disabled} onClick={() => onClick()}>
        {label}
      </Menu.Item>
    )
  }

  renderRowOperationGroupComponent = (props: ITableStepTableOperation) => {
    const { children } = props
    return <Button.Group>{children}</Button.Group>
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
    return <div>{children}</div>
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

  renderTableOperationDropdownComponent = (props: ITableStepTableOperationGroup) => {
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

  renderTableOperationDropdownItemComponent = (props: ITableStepTableOperationGroupItem) => {
    const { label, disabled, onClick } = props
    return (
      <Menu.Item disabled={disabled} onClick={() => onClick()}>
        {label}
      </Menu.Item>
    )
  }

  renderTableOperationGroupComponent = (props: ITableStepTableOperationGroup) => {
    const { children } = props

    return <Button.Group>{children}</Button.Group>
  }

  renderTableOperationGroupItemComponent = (props: ITableStepTableOperationGroupItem) => {
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

  renderOperationModal = (props: ITableStepOperationModal) => {
    const { title, visible, children, onClose, modalWidthMode, modalWidthValue } = props

    let modelWitdh: string | undefined
    if (modalWidthMode === 'none') {
      modelWitdh = undefined
    } else if (modalWidthMode === 'percentage') {
      modelWitdh = `${modalWidthValue}%`
    } else if (modalWidthMode === 'pixel') {
      modelWitdh = `${modalWidthValue}px`
    }

    return (
      <Modal
        width={modelWitdh}
        title={title}
        visible={visible}
        forceRender
        getContainer={false}
        footer={false}
        onCancel={onClose}
      >
        {children}
      </Modal>
    )
  }
}
