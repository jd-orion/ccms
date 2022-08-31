import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Modal, Space, Typography } from 'antd'
import { OperationsHelper } from 'ccms'
import {
  IOperations,
  IOperationGroup,
  IOperationDropdown,
  IOperationNode,
  IOperationLeaf,
  IOperationConfirm
} from 'ccms/dist/util/operations'
import React from 'react'
import InterfaceHelper from './interface'

export default class OperationsHelperComponent extends OperationsHelper {
  interfaceHelper = new InterfaceHelper()

  renderOperationComponent: (props: IOperations) => JSX.Element = (props) => {
    return <Space>{props.operations}</Space>
  }

  renderOperationGroupComponent: (props: IOperationGroup) => JSX.Element = (props) => {
    if (props.mode === 'button') {
      return (
        <Button.Group>
          {props.operations.map((operation) => {
            if (operation.level === 'primary') {
              return operation.onClick((onClick) => (
                <Button type="primary" onClick={onClick}>
                  {operation.label}
                </Button>
              ))
            }
            if (operation.level === 'danger') {
              return operation.onClick((onClick) => (
                <Button danger onClick={onClick}>
                  {operation.label}
                </Button>
              ))
            }
            return operation.onClick((onClick) => <Button onClick={onClick}>{operation.label}</Button>)
          })}
        </Button.Group>
      )
    }
    if (props.mode === 'link') {
      return (
        <Space>
          {props.operations.map((operation) => {
            if (operation.level === 'primary') {
              return operation.onClick((onClick) => (
                <Typography.Link strong onClick={onClick}>
                  {operation.label}
                </Typography.Link>
              ))
            }
            if (operation.level === 'danger') {
              return operation.onClick((onClick) => (
                <Typography.Link type="danger" onClick={onClick}>
                  {operation.label}
                </Typography.Link>
              ))
            }
            return operation.onClick((onClick) => (
              <Typography.Link onClick={onClick}>{operation.label}</Typography.Link>
            ))
          })}
        </Space>
      )
    }
    return <></>
  }

  renderOperationDropdownComponent: (props: IOperationDropdown) => JSX.Element = (props) => {
    const renderHandle = (mode: 'button' | 'link', operation: IOperationLeaf) => {
      if (mode === 'button') {
        if (operation.level === 'primary') {
          return operation.onClick((onClick) => (
            <Button type="primary" onClick={onClick}>
              <Space>
                {operation.label} <DownOutlined />
              </Space>
            </Button>
          ))
        }
        if (operation.level === 'danger') {
          return operation.onClick((onClick) => (
            <Button danger onClick={onClick}>
              <Space>
                {operation.label} <DownOutlined />
              </Space>
            </Button>
          ))
        }
        return operation.onClick((onClick) => (
          <Button onClick={onClick}>
            <Space>
              {operation.label} <DownOutlined />
            </Space>
          </Button>
        ))
      }
      if (mode === 'link') {
        if (operation.level === 'primary') {
          return operation.onClick((onClick) => (
            <Typography.Link strong onClick={onClick}>
              {operation.label} <DownOutlined />
            </Typography.Link>
          ))
        }
        if (operation.level === 'danger') {
          return operation.onClick((onClick) => (
            <Typography.Link type="danger" onClick={onClick}>
              {operation.label} <DownOutlined />
            </Typography.Link>
          ))
        }
        return operation.onClick((onClick) => (
          <Typography.Link onClick={onClick}>
            {operation.label} <DownOutlined />
          </Typography.Link>
        ))
      }
      return <></>
    }

    return (
      <Dropdown
        overlay={
          <Menu>
            {props.operations.map((operation) => {
              if (operation.level === 'primary') {
                return operation.onClick((onClick) => (
                  <Menu.Item onClick={onClick}>
                    <Typography.Text strong>{operation.label}</Typography.Text>
                  </Menu.Item>
                ))
              }
              if (operation.level === 'danger') {
                return operation.onClick((onClick) => (
                  <Menu.Item onClick={onClick}>
                    <Typography.Text type="danger">{operation.label}</Typography.Text>
                  </Menu.Item>
                ))
              }
              return operation.onClick((onClick) => (
                <Menu.Item onClick={onClick}>
                  <Typography.Text>{operation.label}</Typography.Text>
                </Menu.Item>
              ))
            })}
          </Menu>
        }
      >
        {renderHandle(props.mode, props.operation)}
      </Dropdown>
    )
  }

  renderOperationNodeComponent: (props: IOperationNode) => JSX.Element = (props) => {
    if (props.mode === 'button') {
      if (props.level === 'primary') {
        return props.onClick((onClick) => (
          <Button type="primary" onClick={onClick}>
            {props.label}
          </Button>
        ))
      }
      if (props.level === 'danger') {
        return props.onClick((onClick) => (
          <Button danger onClick={onClick}>
            {props.label}
          </Button>
        ))
      }
      return props.onClick((onClick) => <Button onClick={onClick}>{props.label}</Button>)
    }
    if (props.mode === 'link') {
      if (props.level === 'primary') {
        return props.onClick((onClick) => (
          <Typography.Link strong onClick={onClick}>
            {props.label}
          </Typography.Link>
        ))
      }
      if (props.level === 'danger') {
        return props.onClick((onClick) => (
          <Typography.Link type="danger" onClick={onClick}>
            {props.label}
          </Typography.Link>
        ))
      }
      return props.onClick((onClick) => <Typography.Link onClick={onClick}>{props.label}</Typography.Link>)
    }
    return <></>
  }

  renderOperationConfirm = (props: IOperationConfirm) => {
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
}
