import * as React from 'react'
import { ReactElement } from 'react'
// import AwesomeButton from 'react-native-really-awesome-button'
// import AwesomeButtonBlue from 'react-native-really-awesome-button/src/themes/blue'
// import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'
import AwesomeButton, { AwesomeButtonProps } from 'react-native-really-awesome-button'
// @ts-ignore
import SocialTypes from 'react-native-really-awesome-button/src/themes/social'

const COMMON = {
  borderRadius: 8,
  height: 55,
  activityColor: '#FFFFFF',
  raiseLevel: 6,
}

const SOCIAL_TYPES = SocialTypes(COMMON)

const BUTTONS = {
  primary: {
    ...COMMON,
    backgroundColor: '#aad3ea',
    backgroundDarker: '#57a9d4',
    backgroundPlaceholder: '#8dbdd9',
    textColor: '#2e84b1',
    backgroundProgress: '#57a9d4',
  },
  secondary: {
    ...COMMON,
    backgroundColor: '#FAFAFA',
    backgroundDarker: '#67cbc3',
    backgroundActive: '#e7fcfb',
    backgroundPlaceholder: '#b3e5e1',
    textColor: '#349890',
    backgroundProgress: '#c5ece8',
    borderWidth: 2,
    borderColor: '#b3e5e1',
    activityColor: '#349890',
  },
  anchor: {
    ...COMMON,
    backgroundColor: '#95d44a',
    backgroundDarker: '#489d2b',
    textColor: '#34711f',
    backgroundProgress: '#489d2b',
    borderWidth: 2,
    borderColor: '#5bbd3a',
  },
  disabled: {
    ...COMMON,
    backgroundColor: '#e8fcda',
    backgroundDarker: '#bde1a2',
    textColor: '#c7f2a9',
    borderWidth: 2,
    borderColor: '#c7e8ae',
  },
  primaryFlat: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backgroundDarker: 'rgba(0, 0, 0, 0)',
    backgroundShadow: 'rgba(0, 0, 0, 0)',
    raiseLevel: 0,
    borderRadius: 0,
  },
  ...SOCIAL_TYPES,
}

const SIZE = {
  small: {
    width: 120,
    height: 42,
    textSize: 12,
  },
  medium: {
    width: 200,
    height: 55,
  },
  large: {
    width: 250,
    height: 60,
    textSize: 16,
  },
}

interface AwesomeButtonMyProps extends AwesomeButtonProps {
  type: string
  disabled?: boolean
  size?: string
}

const AwesomeButtonMy: React.FC<AwesomeButtonMyProps> = (props: any): ReactElement => {
  const defaultProps = {
    type: 'primary',
    disabled: false,
    size: null,
  }
  const { disabled, type, size } = props || defaultProps
  const defaultTextSize = { textSize: 18 }
  // @ts-ignore
  const styles = disabled ? BUTTONS.disabled : BUTTONS[type]
  // @ts-ignore
  const sizeObj = size ? SIZE[size] : {}
  return <AwesomeButton {...styles} {...defaultTextSize} {...sizeObj} {...props} />
}

export default AwesomeButtonMy
