import React, { useState } from 'react'
import { Dimensions, Text, TouchableOpacity } from 'react-native'
import { NativeMediaView } from 'react-native-admob-native-ads'
import { Logger } from './utils'

export const MediaView = ({ aspectRatio = 1.5 }) => {
  const [pause, setPause] = useState(false)

  const onVideoPlay = () => {
    Logger('VIDEO', 'PLAY', 'Video is now playing')
  }

  const onVideoPause = () => {
    Logger('VIDEO', 'PAUSED', 'Video is now paused')
  }

  const onVideoProgress = (event: any) => {
    Logger('VIDEO', 'PROGRESS UPDATE', event)
    return {}
  }

  const onVideoEnd = () => {
    Logger('VIDEO', 'ENDED', 'Video end reached')
  }

  const onVideoMute = (muted: boolean) => {
    Logger('VIDEO', 'MUTE', muted)
    return {}
  }

  return (
    <>
      <NativeMediaView
        style={{
          width: '100%', // Dimensions.get('window').width - 20,
          height: Dimensions.get('window').width / aspectRatio,
          backgroundColor: 'rgba( 166, 166, 166, 1 )',
        }}
        onVideoPause={onVideoPause}
        onVideoPlay={onVideoPlay}
        onVideoEnd={onVideoEnd}
        onVideoProgress={onVideoProgress}
        onVideoMute={onVideoMute}
      />
      {/*<TouchableOpacity*/}
      {/*  onPress={() => {*/}
      {/*    setPause(!pause)*/}
      {/*  }}*/}
      {/*  style={{*/}
      {/*    width: 50,*/}
      {/*    height: 50,*/}
      {/*    justifyContent: 'center',*/}
      {/*    alignItems: 'center',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Text>Pause/Play</Text>*/}
      {/*</TouchableOpacity>*/}
    </>
  )
}
