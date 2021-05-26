import * as React from 'react'
import Svg, {
  SvgProps,
  Defs,
  ClipPath,
  Path,
  RadialGradient,
  Stop,
  Pattern,
  G,
} from 'react-native-svg'

const SvgDarkAnd = (props: SvgProps) => (
  <Svg
    height="100%"
    preserveAspectRatio="xMinYMin slice"
    width="100%"
    viewBox="49 49 51 51"
    {...props}
  >
    <Defs>
      <ClipPath clipPathUnits="userSpaceOnUse" id="DarkAnd_svg__b">
        <Path d="M0 800h800V0H0z" />
      </ClipPath>
      <ClipPath clipPathUnits="userSpaceOnUse" id="DarkAnd_svg__c">
        <Path d="M0 800h800V-.326H0z" />
      </ClipPath>
      <RadialGradient
        fx={0}
        fy={0}
        cx={0}
        cy={0}
        r={1}
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(561.3584 0 0 -561.3584 400 399.837)"
        spreadMethod="pad"
        id="DarkAnd_svg__a"
      >
        <Stop offset={0} stopColor="#474747" />
        <Stop offset={0.386} stopColor="#474747" />
        <Stop offset={1} stopColor="#080808" />
      </RadialGradient>
      <Pattern
        patternTransform="matrix(0 .85333 -.85333 0 -1106.08 14991.3)"
        patternUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={48}
        height={48}
        id="DarkAnd_svg__d"
      >
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(0 -3.6)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(24 -3.6)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(48 -3.6)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(0 20.4)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(24 20.4)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(48 20.4)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(0 44.4)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(24 44.4)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(48 44.4)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(36 8.4)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(12 8.4)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(36 32.4)"
        />
        <Path
          d="M0 0a3.6 3.6 0 110 7.2A3.6 3.6 0 010 0"
          transform="translate(12 32.4)"
        />
      </Pattern>
    </Defs>
    <Path
      d="M0 0h800v800H0z"
      fill="url(#DarkAnd_svg__a)"
      transform="matrix(1.33333 0 0 -1.33333 0 1066.667)"
    />
    <G
      clipPath="url(#DarkAnd_svg__b)"
      transform="matrix(1.33333 0 0 -1.33333 0 1066.667)"
    >
      <G clipPath="url(#DarkAnd_svg__c)" opacity={0.5}>
        <Path d="M800-.326H0V800h800z" fill="url(#DarkAnd_svg__d)" />
      </G>
    </G>
  </Svg>
)

export default SvgDarkAnd
