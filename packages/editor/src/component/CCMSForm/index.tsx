import React from "react";
import { FormStep } from "ccms-antd-mini";
import { FormConfig } from "ccms/dist/src/steps/form";

interface CCMSFormProps {
  data: any
  config: FormConfig
  onChange: (data: any) => void
  loadDomain: (name: string) => Promise<string>
}

interface CCMSFormState {
  formMounted: boolean
}

export default class CCMSForm extends React.Component<CCMSFormProps, CCMSFormState> {
  state = {
    formMounted: false
  }

  render () {
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
        step={0}
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
        loadDomain={this.props.loadDomain}
        baseRoute="/"
      />
    )
  }
}