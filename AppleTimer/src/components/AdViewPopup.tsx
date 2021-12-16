import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { AdView } from '@/components/ads/AdView'

export interface AdViewPopupProps {
  popupRef: React.RefObject<Modalize>
  value?: number
  onValueChanged?: (newValue: number) => void
}

export const AdViewPopup: React.FC<AdViewPopupProps> = ({ popupRef, value, onValueChanged }) => {
  const [localValue, setLocalValue] = useState<number>(0)
  const [isScrolling, setIsScrolling] = useState<boolean>(false)

  return (
    <Modalize
      ref={popupRef}
      adjustToContentHeight={false}
      modalStyle={{ backgroundColor: 'rgba( 166, 166, 166, 1 )' }}
      panGestureEnabled={false}
      withHandle={false}
      closeOnOverlayTap={!isScrolling}
      onOpen={() => {
        setLocalValue(value || 0)
      }}
      onClose={() => {
        console.log(`>>> local: ${localValue}`)
        onValueChanged && onValueChanged(localValue)
      }}
    >
      <View style={[styles.rootContainer]}>
        <AdView type="image" media={true} />
      </View>
    </Modalize>
  )
}

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    // height: DEFAULT_PICKER_HEIGHT,
    // borderTopLeftRadius: RadiusSizes.r12,
    // borderTopRightRadius: RadiusSizes.r12,
    backgroundColor: 'red', // == rgb( 166, 166, 166)
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
