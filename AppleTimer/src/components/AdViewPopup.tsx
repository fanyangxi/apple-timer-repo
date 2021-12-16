import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { AdView } from '@/components/ads/AdView'
import { Spacings } from '@/theme/Variables'

export interface AdViewPopupProps {
  popupRef: React.RefObject<Modalize>
  value?: number
  onValueChanged?: (newValue: number) => void
}

export const AdViewPopup: React.FC<AdViewPopupProps> = ({ popupRef, value, onValueChanged }) => {
  const [localValue, setLocalValue] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <Modalize
      ref={popupRef}
      modalHeight={340}
      disableScrollIfPossible={true}
      adjustToContentHeight={false}
      modalStyle={{ backgroundColor: 'rgba( 166, 166, 166, 1 )' }}
      panGestureEnabled={false}
      withHandle={!isLoading}
      closeOnOverlayTap={!isLoading}
      onOpen={() => {
        setLocalValue(value || 0)
      }}
      onClose={() => {
        onValueChanged && onValueChanged(localValue)
      }}
    >
      <View style={[styles.rootContainer]}>
        <AdView
          type="image"
          media={true}
          onAdLoadingStarted={async () => setIsLoading(true)}
          onAdLoadingFinished={async () => setIsLoading(false)}
        />
      </View>
    </Modalize>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingTop: Spacings.s_4,
    // height: DEFAULT_PICKER_HEIGHT,
    // borderTopLeftRadius: RadiusSizes.r12,
    // borderTopRightRadius: RadiusSizes.r12,
    // backgroundColor: '#e2a6a6', // == rgb( 166, 166, 166)
  },
  actionButtonsBar: {
    flexGrow: 1,
    height: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: Spacings.s_8,
    // borderTopLeftRadius: RadiusSizes.r12,
    // borderTopRightRadius: RadiusSizes.r12,
    // backgroundColor: Colors.linenDark,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
