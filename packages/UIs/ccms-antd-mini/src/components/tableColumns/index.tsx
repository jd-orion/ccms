import { lazy } from 'react'

export default {
  text: lazy(() => import('./text')),
  datetime: lazy(() => import('./datetime')),
  enum: lazy(() => import('./enum')),
  image: lazy(() => import('./image')),
  formatted_text: lazy(() => import('./formattedText'))
}
