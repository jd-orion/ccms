import { Button, Form, Modal, Space } from 'antd'
import { TableFieldForm } from 'ccms'
import { Field } from 'ccms/dist/src/components/formFields/common'
import { ITableFieldFormModal } from 'ccms/dist/src/components/formFields/table/common/form'
import React from 'react'
import getALLComponents from '../..'
import FormContainerComponent from '../../container'

export default class TableFieldFormComponent extends TableFieldForm {
  getALLComponents = (type: string): typeof Field => getALLComponents[type]

  FormContainer = FormContainerComponent

  renderModal: (props: ITableFieldFormModal) => JSX.Element = (props) => {
    return (
      <Modal
        visible
        forceRender
        title={props.title}
        footer={null}
        getContainer={() => document.getElementById('ccms-antd') || document.body}
        onCancel={() => props.onClose()}
      >
        {props.content}
        <Form.Item>
          <Space>
            <Button onClick={() => props.onOk()} type="primary">
              确定
            </Button>
            <Button onClick={() => props.onClose()}>取消</Button>
          </Space>
        </Form.Item>
      </Modal>
    )
  }
}
