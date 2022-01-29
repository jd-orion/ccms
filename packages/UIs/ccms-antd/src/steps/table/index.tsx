import React from 'react'
import { TableStep } from 'ccms'
import { ITable, ITableColumn, ITableStepOperationConfirm, ITableStepOperationModal, ITableStepRowOperation, ITableStepRowOperationButton, ITableStepRowOperationGroup, ITableStepRowOperationGroupItem, ITableStepTableOperation, ITableStepTableOperationButton, ITableStepTableOperationGroup, ITableStepTableOperationGroupItem } from 'ccms/dist/src/steps/table'
import { Table, Button, Dropdown, Menu, Modal, Space, Tooltip } from 'antd'
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons'
import getALLComponents from '../../components/tableColumns'
import CCMS from '../../main'
import InterfaceHelper from '../../util/interface'
import styles from './index.less'
import { ButtonProps } from 'antd/lib/button'

export default class TableStepComponent extends TableStep {
  CCMS = CCMS
  getALLComponents = (type: any) => getALLComponents[type]
  interfaceHelper = new InterfaceHelper()

  renderOperationConfirm = (props: ITableStepOperationConfirm) => {
    Modal.confirm({
      getContainer: () => document.getElementById('ccms-antd') || document.body,
      title: props.title,
      okText: props.okText,
      cancelText: props.cancelText,
      onOk: () => { props.onOk() },
      onCancel: () => { props.onCancel() }
    })
  }

  renderComponent = (props: ITable) => {
    const {
      title,
      tableOperations,
      primary,
      columns,
      data,
      pagination,
      description
    } = props

    return (
      <div className={styles['ccms-antd-table']}>
        {(title || (description && ((description.label !== undefined && description.label !== '') || description.showIcon)) || tableOperations) && (
          <div className={styles['ccms-antd-table-header']}>
            <div className={styles['ccms-antd-table-title']}>{title}
              <div className={styles['ccms-antd-table-title-explain']}>
                {(description && description.type === 'text' && ((description.label !== undefined && description.label !== "") || description.showIcon)) && 
                  <span> {(description.showIcon) && (<InfoCircleOutlined style={{ marginRight: "5px" }}/>)} 
                  {description.label} </span>
                }
                {(description && description.type === 'tooltip' && ((description.label !== undefined && description.label !== "") || description.showIcon)) &&
                  <Tooltip
                    overlayStyle={{ color: 'white' }}
                    placement="topLeft"
                    title={description.content} 
                    getPopupContainer={(ele) => ele.parentElement || document.body}>
                    {(description.showIcon) && (<InfoCircleOutlined style={{ marginRight: "5px" }}/>)} 
                    {description.label}
                  </Tooltip>
                }
                {(description && description.type === 'modal' && ((description.label !== undefined && description.label !== "") || description.showIcon)) &&
                  <span style={{ cursor: 'pointer' }} onClick={()=>{
                    Modal.info({
                      getContainer: () => document.getElementById('ccms-antd') || document.body,
                      content: (<div style={{ overflow: 'hidden' }}>{description.content}</div>),
                      okText: '知道了'
                    });
                  }}>
                  {(description.showIcon) && (<InfoCircleOutlined style={{ marginRight: "5px" }}/>)} 
                  {description.label}
                  </span>
                }
              </div>
            </div>
            <div className={styles['ccms-antd-table-tableOperation']}>{tableOperations}</div>
          </div>
        )}
        <Table
          rowKey={primary}
          columns={columns.map((column: ITableColumn, index: number) => ({
            key: index,
            dataIndex: column.field,
            title: column.label,
            align: column.align,
            render: (value: any, record: { [field: string]: any }, index: number) => column.render(value, record, index)
          }))}
          dataSource={data}
          scroll={{ x: 1000 }}
          size="middle"
          pagination={ pagination === undefined ? false : {
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => pagination.onChange(page, pageSize || pagination.pageSize),
            showSizeChanger: true,
            showTotal: (total, range) => `第 ${range[0]} - ${range[1]} 条 / 共 ${total} 条`,
            locale: {
              items_per_page: '条/页'
            }
          }}
        />
      </div>
    )
  }

  renderRowOperationComponent = (props: ITableStepRowOperation) => {
    const {
      children
    } = props
    return (
      <Space size="middle">
        {children}
      </Space>
    )
  }

  renderRowOperationButtonComponent = (props: ITableStepRowOperationButton) => {
    const {
      label,
      onClick
    } = props

    return <a onClick={() => onClick()}>{label}</a>
  }

  renderRowOperationGroupComponent = (props: ITableStepRowOperationGroup) => {
    const {
      label,
      children
    } = props
    return (
      <Dropdown
        getPopupContainer={(node) => node.parentElement || document.body}
        overlay={(
          <Menu>
            {children}
          </Menu>
        )}

      >
        <a>{label}</a>
      </Dropdown>
    )
  }

  renderRowOperationGroupItemComponent = (props: ITableStepRowOperationGroupItem) => {
    const {
      label,
      disabled,
      onClick
    } = props
    return (
      <Menu.Item disabled={disabled} onClick={() => onClick()}>{label}</Menu.Item>
    )
  }



  renderTableOperationComponent = (props: ITableStepTableOperation) => {
    const {
      children
    } = props
    return (
      <Button.Group>
        {children}
      </Button.Group>
    )
  }

  renderTableOperationButtonComponent = (props: ITableStepTableOperationButton) => {
    const {
      label,
      level,
      disabled,
      onClick
    } = props

    const button_props: ButtonProps = { disabled }
    if (level === 'primary') {
      button_props.type = 'primary'
    } else if (level === 'danger') {
      button_props.danger = true
    }
    return <Button {...button_props} onClick={() => onClick()}>{label}</Button>
  }

  renderTableOperationGroupComponent = (props: ITableStepTableOperationGroup) => {
    const {
      label,
      children
    } = props

    return (
      <Dropdown
        getPopupContainer={(ele) => ele.parentElement || document.body}
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

  renderTableOperationGroupItemComponent = (props: ITableStepTableOperationGroupItem) => {
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
