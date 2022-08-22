import React from 'react'
import { FormStep } from 'ccms-antd-mini'
import { FormConfig } from 'ccms/dist/src/steps/form'
import { PageListItem } from 'ccms/dist/src/main'

interface CCMSFormProps {
  data: { [field: string]: unknown }[]
  config: FormConfig
  onChange: (data: unknown) => void
  loadDomain: (name: string) => Promise<string>
  loadPageList: () => Promise<Array<PageListItem>>
  baseRoute: string
}

interface CCMSFormState {
  formMounted: boolean
}

export default class CCMSForm extends React.Component<CCMSFormProps, CCMSFormState> {
  constructor(props) {
    super(props)

    this.state = {
      formMounted: false
    }
  }

  render() {
    const { data, config, onChange, loadPageList, loadDomain, baseRoute } = this.props
    return (
      <FormStep
        ref={(form) => {
          const { formMounted } = this.state
          if (!formMounted) {
            this.setState({
              formMounted: true
            })
            form?.stepPush()
          }
        }}
        step={data[0]}
        data={data}
        config={config}
        onChange={async (dataChange) => onChange(dataChange)}
        onSubmit={async () => {
          /* TODO */
        }}
        onMount={async () => {
          /* TODO */
        }}
        onUnmount={async () => {
          /* TODO */
        }}
        checkPageAuth={async () => true}
        loadPageURL={async () => ''}
        loadPageFrameURL={async () => ''}
        loadPageConfig={async () => ({})}
        loadPageList={loadPageList}
        loadDomain={loadDomain}
        baseRoute={baseRoute}
      />
    )
  }
}
