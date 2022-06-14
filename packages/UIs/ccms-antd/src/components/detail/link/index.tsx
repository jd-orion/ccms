import React from 'react'
import { DetailLinkField } from 'ccms'
import { ILinkDetail } from 'ccms/dist/src/components/detail/link'

export default class LinkFieldComponent extends DetailLinkField {
  renderComponent = (props: ILinkDetail) => {
    const { url, name } = props
    return url && name ? (
      <a href={url} target="_blank" rel="noreferrer">
        {name}
      </a>
    ) : (
      <>{name}</>
    )
  }
}
