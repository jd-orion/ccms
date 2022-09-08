import React from 'react'
import { DetailImageField } from 'ccms'
import { IImageDetail, IImageItemDetail } from 'ccms/dist/components/detail/image'
import { EyeOutlined } from '@ant-design/icons'
import { Space, Tooltip } from 'antd'
import 'antd/lib/space/style'
import 'antd/lib/tooltip/style'
import './index.less'

export default class ImageDetailComponent extends DetailImageField {
  renderComponent = (props: IImageDetail) => {
    const { value, width, height, preview } = props
    return value ? (
      <div className="ccms-antd-detail-image">
        <img className="image" height={height} width={width} src={value} alt={value} />
        {preview && (
          <div className="mask">
            <Space>
              <Tooltip getPopupContainer={(ele) => ele.parentElement || document.body} overlay="查看">
                <EyeOutlined
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(value)
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        )}
      </div>
    ) : (
      <> </>
    )
  }

  renderItemComponent = (props: IImageItemDetail) => {
    const { value, width, height, preview } = props
    return value ? (
      <div className="ccms-antd-detail-image-item">
        {value.map((image) => {
          return image ? (
            <div key={Math.random()} className="ccms-antd-detail-image">
              <img className="image" height={height} width={width} src={image} alt={image} />
              {preview && (
                <div className="mask">
                  <Space>
                    <Tooltip getPopupContainer={(ele) => ele.parentElement || document.body} overlay="查看">
                      <EyeOutlined
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(image)
                        }}
                      />
                    </Tooltip>
                  </Space>
                </div>
              )}
            </div>
          ) : null
        })}
      </div>
    ) : (
      <> </>
    )
  }
}
