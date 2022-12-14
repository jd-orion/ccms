import React from 'react'
import { FormStep } from 'ccms-antd-mini'
import { FormConfig } from 'ccms/dist/src/steps/form'
import { PageListItem } from 'ccms/dist/src/main'

interface CCMSFormProps {
  data: any
  config: FormConfig
  onChange: (data: any) => void
  loadDomain: (name: string) => Promise<string>
  loadPageList: () => Promise<Array<PageListItem>>
  loadCustomSource: (customName: string, version: string) => string
  baseRoute: string
}

interface CCMSFormState {
  formMounted: boolean
}

export default class CCMSForm extends React.Component<CCMSFormProps, CCMSFormState> {
  state = {
    formMounted: false
  }

  render() {
    return (
      <FormStep
        ref={(form: any) => {
          if (!this.state.formMounted) {
            this.setState({
              formMounted: true
            })
            form?.stepPush()
          }
        }}
        step={this.props.data[0]}
        data={this.props.data}
        config={this.props.config}
        onChange={async (data) => this.props.onChange(data)}
        onSubmit={async () => { }}
        onMount={async () => { }}
        onUnmount={async () => { }}
        checkPageAuth={async () => true}
        loadPageURL={async () => ''}
        loadPageFrameURL={async () => ''}
        loadPageConfig={async () => ({})}
        loadPageList={this.props.loadPageList}
        loadCustomSource={this.props.loadCustomSource}
        loadDomain={this.props.loadDomain}
        baseRoute={this.props.baseRoute}
      />
    )
  }
}
