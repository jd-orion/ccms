
import React from 'react';
import ReactDOM from 'react-dom';
import App, { AppProps } from './app'
import DefaultConfig from './DefaultConfig'
import appInfo from '../package.json'
import 'antd/dist/antd.css'

// export default class CCMSEditor extends React.Component {
//   constructor (props: AppProps) {
//     super(props);
//   }
//   render () {
//     return (
//       <App
//         applicationName="example"
//         type="application"
//         version="1.0.0"
//         subversion="0"
//         config={DefaultConfig}
//         onChange={(v)=>{console.log('ccms-editor', v)}}
//         baseRoute={'/'}
//         checkPageAuth={async (_) => true}
//         loadPageURL={async (_) => '#'}
//         loadPageFrameURL={async (_) => '#'}
//         loadPageConfig={async (_) => ({
//           steps: [
//             {
//               type: 'form',
//               fields: [
//                 {
//                   field: 'text',
//                   label: 'text',
//                   type: 'text'
//                 }
//               ],
//               "actions": []
//             }
//           ]
//         })}
//         loadDomain={async () => ''}
//         onSubmit={(config) => console.log(JSON.stringify(config, undefined, 2))}
//         onCancel={() => {}}
//       />
//     )
//   }
// }
 function CCMSEditor () {
  console.log('ccms-editor0')
    return (
      <App
        applicationName="example"
        type="application"
        version="1.0.0"
        subversion="0"
        config={DefaultConfig}
        onChange={(v)=>{console.log('ccms-editor', v)}}
        baseRoute={'/'}
        checkPageAuth={async (_) => true}
        loadPageURL={async (_) => '#'}
        loadPageFrameURL={async (_) => '#'}
        loadPageConfig={async (_) => ({
          steps: [
            {
              type: 'form',
              fields: [
                {
                  field: 'text',
                  label: 'text',
                  type: 'text'
                }
              ],
              "actions": []
            }
          ]
        })}
        loadDomain={async () => ''}
        onSubmit={(config) => console.log(JSON.stringify(config, undefined, 2))}
        onCancel={() => {}}
      />
    )
}

export default CCMSEditor