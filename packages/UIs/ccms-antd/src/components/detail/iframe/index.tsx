import React from 'react'
import { DetailIframeField } from 'ccms'
import { IIframeDetail, IframeDetailConfig } from 'ccms/dist/src/components/detail/iframe'
import styles from './index.less'

export const PropsType = (props: IframeDetailConfig) => {}

export default class IframeDetailComponent extends DetailIframeField {
  renderComponent = (props: IIframeDetail) => {
    const { value, width, height } = props
    return value ? (
      <div
        className={styles['ccms-antd-detail-iframe']}
        style={{ ...(width && { width: `${width}px` }), ...(height && { height: `${height}px` }) }}
      >
        <iframe className={styles['ccms-iframe']} title={value} src={value} />
      </div>
    ) : (
      <> </>
    )
  }
}
