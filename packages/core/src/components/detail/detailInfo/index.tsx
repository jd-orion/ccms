import React from 'react'
import marked from 'marked'
import { DetailField, DetailFieldConfig, IDetailField } from '../common'
import StatementHelper, { StatementConfig } from '../../../util/statement'

export interface InfoDetailConfig extends DetailFieldConfig {
  type: 'detail_info'
  description?: {
    descType: 'text' | 'tooltip' | 'modal'
    label?: StatementConfig
    mode: 'plain' | 'markdown' | 'html'
    content?: StatementConfig
    showIcon: boolean
  }
}

export interface IInfoProps {
  description?: {
    descType: 'text' | 'tooltip' | 'modal'
    label: string | undefined
    content: React.ReactNode
    showIcon: boolean
  }
}

export default class InfoDetail
  extends DetailField<InfoDetailConfig, IInfoProps, string>
  implements IDetailField<string>
{
  renderComponent: (props: IInfoProps) => JSX.Element = () => {
    return <>您当前使用的UI版本没有实现InfoDetail组件。</>
  }

  render = () => {
    const props: IInfoProps = {}
    const {
      config: { description }
    } = this.props
    if (description) {
      if (description.descType === 'text') {
        props.description = {
          descType: 'text',
          label: StatementHelper(description.label, {
            data: this.props.data,
            step: this.props.step,
            containerPath: this.props.containerPath,
            record: this.props.record
          }),
          content: description.content,
          showIcon: description.showIcon
        }
      } else if (description.descType === 'tooltip') {
        props.description = {
          descType: 'tooltip',
          label: StatementHelper(description.label, {
            data: this.props.data,
            step: this.props.step,
            containerPath: this.props.containerPath,
            record: this.props.record
          }),
          content: description.content,
          showIcon: description.showIcon
        }
      } else {
        props.description = {
          descType: 'modal',
          label: StatementHelper(description.label, {
            data: this.props.data,
            step: this.props.step,
            containerPath: this.props.containerPath,
            record: this.props.record
          }),
          content: description.content,
          showIcon: description.showIcon
        }
      }
      if (description.content !== undefined) {
        const descriptionType = description.mode
        switch (descriptionType) {
          case 'plain':
            props.description &&
              (props.description.content = StatementHelper(description.content, {
                data: this.props.data,
                step: this.props.step,
                containerPath: this.props.containerPath,
                record: this.props.record
              }))
            break
          case 'markdown':
            props.description &&
              (props.description.content = (
                <div
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: marked(
                      StatementHelper(description.content, {
                        data: this.props.data,
                        step: this.props.step,
                        containerPath: this.props.containerPath,
                        record: this.props.record
                      })
                    )
                  }}
                />
              ))
            break
          case 'html':
            props.description &&
              (props.description.content = (
                <div
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: StatementHelper(description.content, {
                      data: this.props.data,
                      step: this.props.step,
                      containerPath: this.props.containerPath,
                      record: this.props.record
                    })
                  }}
                />
              ))
            break
          default:
            props.description && (props.description.content = <div />)
            break
        }
      }
    }

    return <>{this.renderComponent(props)}</>
  }
}
