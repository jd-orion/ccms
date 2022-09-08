import { lazy } from 'react'

export default {
  text: lazy(() => import('./text')),
  datetime: lazy(() => import('./datetime')),
  datetimeRange: lazy(() => import('./datetimeRange')),
  number: lazy(() => import('./number')),
  numberRange: lazy(() => import('./numberRange')),
  multirowText: lazy(() => import('./multirowText')),
  Aenum: lazy(() => import('./enum')),
  image: lazy(() => import('./image')),
  custom: lazy(() => import('./custom')),
  operation: lazy(() => import('./operation')),
  formatted_text: lazy(() => import('./formattedText'))
}
