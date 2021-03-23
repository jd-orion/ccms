import React, { Component } from 'react'

type Props = {
    style: any
    addfix: boolean
};

export default class ColumnStyleComponent extends Component<Props, {}> {
    render() {
        const { style, addfix = true } = this.props
        const reSetStyle = Object.assign({}, { fontSize: style?.fontSize, color: style?.color }, style?.customStyle);
        return addfix ? <div style={reSetStyle}>
           {style?.prefix || ''}{this.props.children}{style?.postfix || ''}
        </div> : <div style={reSetStyle}>
            {this.props.children}
        </div>
    }
}

