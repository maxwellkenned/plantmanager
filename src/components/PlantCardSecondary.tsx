import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { RectButton, RectButtonProps } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { SvgFromUri } from 'react-native-svg'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

interface IPlantCardSecondary extends RectButtonProps {
  data: {
    name: string
    photo: string
    hour: string
  }
  handleRemove(): void
}

export const PlantCardSecondary: React.FC<IPlantCardSecondary> = ({
  data,
  handleRemove,
  ...rest
}: IPlantCardSecondary) => {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Animated.View>
          <View>
            <RectButton style={styles.buttonRemove} onPress={handleRemove}>
              <Feather name="trash" size={32} color={colors.white} />
            </RectButton>
          </View>
        </Animated.View>
      )}
    >
      <RectButton style={styles.container} {...rest}>
        <SvgFromUri uri={data.photo} width={50} height={50} />
        <Text style={styles.title}>{data.name}</Text>
        <View style={styles.datails}>
          <Text style={styles.timeLabel}>Regar às</Text>
          <Text style={styles.time}>{data.hour}</Text>
        </View>
      </RectButton>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.shape,
    paddingHorizontal: 10,
    paddingVertical: 25,
    borderRadius: 20,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginLeft: 10,
    color: colors.heading,
    fontSize: 17,
    fontFamily: fonts.heading,
  },
  datails: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: fonts.text,
    color: colors.body_light,
  },
  time: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.body_dark,
  },
  buttonRemove: {
    width: 100,
    height: 85,
    backgroundColor: colors.red,
    marginTop: 15,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    right: 20,
    paddingLeft: 10,
    marginRight: -20,
  },
})
