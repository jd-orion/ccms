import React from 'react'
import { DetailIframe } from 'ccms'
import { IIframeDetail } from 'ccms/dist/components/detail/iframe'
import './index.less'

export default class IframeDetailComponent extends DetailIframe {
  renderComponent = (props: IIframeDetail) => {
    const { url, width, height } = props
    return url ? (
      <div
        className="ccms-antd-detail-iframe"
        style={{ ...(width && { width: `${width}px` }), ...(height && { height: `${height}px` }) }}
      >
        <iframe className="ccms-iframe" title={url} src={url} />
      </div>
    ) : (
      <> </>
    )
  }
}
