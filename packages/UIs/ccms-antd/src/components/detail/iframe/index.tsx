import React from 'react'
import { DetailIframe } from 'ccms'
import { IIframeDetail, IframeDetailConfig } from 'ccms/dist/src/components/detail/iframe'
import styles from './index.less'

export const PropsType = (props: IframeDetailConfig) => { }

export default class IframeDetailComponent extends DetailIframe {
  renderComponent = (props: IIframeDetail) => {
    const { url, width, height } = props
    return url ? (
      <div
        className={styles['ccms-antd-detail-iframe']}
        style={{ ...(width && { width: `${width}px` }), ...(height && { height: `${height}px` }) }}
      >
        <iframe className={styles['ccms-iframe']} title={url} src={url} />
      </div>
    ) : (
      <> </>
    )
  }
}
