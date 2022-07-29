import React from 'react'
import { ParamConfig } from '../interface'
import { CCMSConfig, PageListItem } from '../main'
import ConditionHelper, { ConditionConfig } from './condition'
import { OperationConfig } from './operation'
import { InterfaceConfig } from './interface'

export type OperationsConfig<Operation = OperationConfig> = (
  | OperationConfigGroup<Operation>
  | OperationConfigDropdown<Operation>
  | OperationConfigNode<Operation>
)[]

type OperationConfigRoot = {
  mode: 'button' | 'link'
  condition?: ConditionConfig
}

type OperationConfigLeaf<Operation = OperationConfig> = {
  label: string
  level: 'normal' | 'primary' | 'danger'
  check?: { enable: false } | OperationCheckConfig
  confirm?: { enable: false } | OperationConfirmConfig
  handle: Operation
  condition?: ConditionConfig
}

type OperationConfigGroup<Operation = OperationConfig> = OperationConfigRoot & {
  type: 'group'
  operations: OperationConfigLeaf<Operation>[]
}

type OperationConfigDropdown<Operation = OperationConfig> = OperationConfigRoot & {
  type: 'dropdown'
  operation: OperationConfigLeaf<Operation>
  operations: OperationConfigLeaf<Operation>[]
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

type OperationsHelperProps<Operation = OperationConfig> = {
  config: OperationsConfig<Operation>
  onClick: (
    config: Operation,
    datas: { record?: object; data: object[]; step: { [field: string]: unknown } }
  ) => (children: (onClick: () => void) => JSX.Element) => JSX.Element
  datas: { record?: object; data: object[]; step: { [field: string]: unknown } }
  checkPageAuth: (pageID: unknown) => Promise<boolean>
  loadPageURL: (pageID: unknown) => Promise<string>
  loadPageFrameURL: (pageID: unknown) => Promise<string>
  loadPageConfig: (pageID: unknown) => Promise<CCMSConfig>
  loadPageList: () => Promise<Array<PageListItem>>
  baseRoute: string
  loadDomain: (domain: string) => Promise<string>
  handlePageRedirect?: (path: string, replaceHistory: boolean) => void
}

export default class OperationsHelper<Operation = OperationConfig> extends React.Component<
  OperationsHelperProps<Operation>
> {
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

  render() {
    const { config, datas, onClick } = this.props

    const renderOperationConfigGroup = (operation: OperationConfigGroup<Operation>) => {
      return this.renderOperationGroupComponent({
        mode: operation.mode,
        operations: operation.operations
          .filter(
            (currentOperation) => !(currentOperation.condition && !ConditionHelper(currentOperation.condition, datas))
          )
          .map((currentOperation) => ({
            label: currentOperation.label,
            level: currentOperation.level,
            onClick: onClick(currentOperation.handle, datas)
          }))
      })
    }

    const renderOperationConfigDropdown = (operation: OperationConfigDropdown<Operation>) => {
      return this.renderOperationDropdownComponent({
        mode: operation.mode,
        operation: {
          label: operation.operation.label,
          level: operation.operation.level,
          onClick: onClick(operation.operation.handle, datas)
        },
        operations: operation.operations
          .filter(
            (currentOperation) => !(currentOperation.condition && !ConditionHelper(currentOperation.condition, datas))
          )
          .map((currentOperation) => ({
            label: currentOperation.label,
            level: currentOperation.level,
            onClick: onClick(currentOperation.handle, datas)
          }))
      })
    }

    const renderOperationConfigNode = (operation: OperationConfigNode<Operation>) => {
      return this.renderOperationNodeComponent({
        mode: operation.mode,
        label: operation.label,
        level: operation.level,
        onClick: onClick(operation.handle, datas)
      })
    }

    return this.renderOperationComponent({
      operations: config
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
