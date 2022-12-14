import React from 'react'
import { ParamConfig } from '../interface'
import { CCMSConfig, PageListItem } from '../main'
import ConditionHelper, { ConditionConfig } from './condition'
import { OperationConfig } from './operation'
import InterfaceHelper, { InterfaceConfig } from './interface'
import { getParamText } from './value'

export type OperationsConfig<Operation = OperationConfig> = (
  | OperationConfigGroup<Operation>
  | OperationConfigDropdown<Operation>
  | OperationConfigNode<Operation>
)[]

type OperationConfigRoot = {
  mode?: 'button' | 'link'
  condition?: ConditionConfig
}

type OperationConfigLeaf<Operation = OperationConfig> = {
  label?: string
  level?: 'normal' | 'primary' | 'danger'
  check?: { enable: false } | OperationCheckConfig
  confirm?: { enable: false } | OperationConfirmConfig
  handle?: Operation
  condition?: ConditionConfig
}

type OperationConfigGroup<Operation = OperationConfig> = OperationConfigRoot & {
  type: 'group'
  operations?: OperationConfigLeaf<Operation>[]
}

type OperationConfigDropdown<Operation = OperationConfig> = OperationConfigRoot & {
  type: 'dropdown'
  operation?: OperationConfigLeaf<Operation>
  operations?: OperationConfigLeaf<Operation>[]
}

type OperationConfigNode<Operation = OperationConfig> = OperationConfigRoot &
  OperationConfigLeaf<Operation> & {
    type: 'node'
  }

type OperationCheckConfig = {
  enable: true
  interface: InterfaceConfig
}

type OperationConfirmConfig = {
  enable: true
  titleText: string
  titleParams?: Array<{ field: string; data: ParamConfig }>
  okText: string
  cancelText: string
}

export type IOperations = {
  operations: (React.ReactNode | undefined)[]
}

export type IOperationRoot = {
  mode: 'button' | 'link'
}

export type IOperationLeaf = {
  label: string
  level: 'normal' | 'primary' | 'danger'
  onClick: (children: (onClick: () => void) => JSX.Element) => JSX.Element
}

export type IOperationGroup = IOperationRoot & {
  operations: IOperationLeaf[]
}

export type IOperationDropdown = IOperationRoot & {
  operation: IOperationLeaf
  operations: IOperationLeaf[]
}

export type IOperationNode = IOperationRoot & IOperationLeaf

export interface IOperationConfirm {
  title: string
  okText: string
  cancelText: string
  onOk: () => void
  onCancel: () => void
}

type OperationsHelperProps<Operation = OperationConfig> = {
  config: OperationsConfig<Operation>
  onClick: (
    config: Operation | undefined,
    datas: {
      record: { [field: string]: unknown }
      data: object[]
      step: { [field: string]: unknown }
      containerPath: string
    }
  ) => (children: (onClick: () => void) => JSX.Element) => JSX.Element
  datas: {
    record: { [field: string]: unknown }
    data: object[]
    step: { [field: string]: unknown }
    containerPath: string
  }
  checkPageAuth: (pageID: unknown) => Promise<boolean>
  loadPageURL: (pageID: unknown) => Promise<string>
  loadPageFrameURL: (pageID: unknown) => Promise<string>
  loadPageConfig: (pageID: unknown) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  loadCustomSource: (customName: string, version: string) => string
  baseRoute: string
  loadDomain: (domain: string) => Promise<string>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void
}

export default class OperationsHelper<Operation = OperationConfig> extends React.Component<
  OperationsHelperProps<Operation>
> {
  interfaceHelper = new InterfaceHelper()

  renderOperationComponent: (props: IOperations) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现OperationsHelper组件的Operation部分。</>
  }

  renderOperationGroupComponent: (props: IOperationGroup) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现OperationsHelper组件的OperationGroup部分。</>
  }

  renderOperationDropdownComponent: (props: IOperationDropdown) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现OperationsHelper组件的OperationDropdown部分。</>
  }

  renderOperationNodeComponent: (props: IOperationNode) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现OperationsHelper组件的OperationNode部分。</>
  }

  renderOperationConfirm = (props: IOperationConfirm) => {
    const mask = document.createElement('DIV')
    mask.style.position = 'fixed'
    mask.style.left = '0px'
    mask.style.top = '0px'
    mask.style.width = '100%'
    mask.style.height = '100%'
    mask.style.backgroundColor = 'white'
    mask.innerText = '您当前使用的UI版本没有实现Table的OperationConfirm组件。'
    mask.onclick = () => {
      mask.remove()
      props.onOk()
    }

    document.body.appendChild(mask)
  }

  beforeClick: (
    config: OperationConfigLeaf<Operation>,
    datas: {
      record: { [field: string]: unknown }
      data: object[]
      step: { [field: string]: unknown }
      containerPath: string
    }
  ) => Promise<boolean> = async (config, datas) => {
    const { loadDomain } = this.props

    if (config.check && config.check.enable) {
      const checkResult = await this.interfaceHelper.request(config.check.interface, {}, datas, {
        loadDomain
      })
      if (!checkResult) {
        return false
      }
    }

    if (config.confirm && config.confirm.enable) {
      const title = config.confirm.titleParams
        ? await getParamText(config.confirm.titleText, config.confirm.titleParams, datas)
        : config.confirm.titleText
      const showConfirm = () => {
        return new Promise((resolve, reject) => {
          if (config.confirm && config.confirm.enable) {
            this.renderOperationConfirm({
              title,
              okText: config.confirm.okText,
              cancelText: config.confirm.cancelText,
              onOk: () => {
                resolve(true)
              },
              onCancel: () => {
                reject(new Error('用户取消'))
              }
            })
          }
        })
      }
      try {
        await showConfirm()
      } catch (e) {
        return false
      }
    }

    return true
  }

  render() {
    const { config, datas, onClick } = this.props

    const renderOperationConfigGroup = (operation: OperationConfigGroup<Operation>) => {
      return this.renderOperationGroupComponent({
        mode: operation.mode || 'button',
        operations: (operation.operations || [])
          .filter(
            (currentOperation) => !(currentOperation.condition && !ConditionHelper(currentOperation.condition, datas))
          )
          .map((currentOperation) => ({
            label: currentOperation.label || '',
            level: currentOperation.level || 'normal',
            onClick: (children) =>
              onClick(
                currentOperation.handle,
                datas
              )((onClickFunction) => {
                return children(async () => {
                  if (!(await this.beforeClick(currentOperation, datas))) return
                  await onClickFunction()
                })
              })
          }))
      })
    }

    const renderOperationConfigDropdown = (operation: OperationConfigDropdown<Operation>) => {
      return this.renderOperationDropdownComponent({
        mode: operation.mode || 'button',
        operation: {
          label: operation.operation?.label || '',
          level: operation.operation?.level || 'normal',
          onClick: (children) =>
            onClick(
              operation.operation?.handle,
              datas
            )((onClickFunction) => {
              return children(async () => {
                if (!(await this.beforeClick(operation, datas))) return
                await onClickFunction()
              })
            })
        },
        operations: (operation.operations || [])
          .filter(
            (currentOperation) => !(currentOperation.condition && !ConditionHelper(currentOperation.condition, datas))
          )
          .map((currentOperation) => ({
            label: currentOperation.label || '',
            level: currentOperation.level || 'normal',
            onClick: (children) =>
              onClick(
                currentOperation.handle,
                datas
              )((onClickFunction) => {
                return children(async () => {
                  if (!(await this.beforeClick(currentOperation, datas))) return
                  await onClickFunction()
                })
              })
          }))
      })
    }

    const renderOperationConfigNode = (operation: OperationConfigNode<Operation>) => {
      return this.renderOperationNodeComponent({
        mode: operation.mode || 'button',
        label: operation.label || '',
        level: operation.level || 'normal',
        onClick: (children) =>
          onClick(
            operation.handle,
            datas
          )((onClickFunction) => {
            return children(async () => {
              if (!(await this.beforeClick(operation, datas))) return
              await onClickFunction()
            })
          })
      })
    }

    return this.renderOperationComponent({
      operations: (config || [])
        .filter((operation) => !(operation.condition && !ConditionHelper(operation.condition, datas)))
        .map((operation) => {
          if (operation.type === 'group') {
            return renderOperationConfigGroup(operation)
          }
          if (operation.type === 'dropdown') {
            return renderOperationConfigDropdown(operation)
          }
          if (operation.type === 'node') {
            return renderOperationConfigNode(operation)
          }
          return <></>
        })
    })
  }
}
