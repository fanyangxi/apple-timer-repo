import React from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as ReactNativeModals from 'react-native-modals'

declare module 'react-native-modals' {
  export class ModalPortal extends React.Component {
    static show(children: any, props?: any) {}
  }
}
