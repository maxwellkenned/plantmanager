import React, { useCallback } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/core'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import { Button } from '../components/Button'

interface IParams {
  title: string
  subtitle: string
  buttonTitle: string
  icon: 'smile' | 'hug'
  nextScreen: string
  screen?: string
}

const emojis = {
  hug: '🤗',
  smile: '😁',
}

export const Confirmation: React.FC = () => {
  const navigation = useNavigation()
  const routes = useRoute()

  const {
    title,
    subtitle,
    buttonTitle,
    icon,
    nextScreen,
    screen,
  } = routes.params as IParams

  const handleMoveOn = useCallback(() => {
    navigation.navigate(nextScreen, { screen })
  }, [navigation, nextScreen, screen])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{emojis[icon]}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.footer}>
          <Button title={buttonTitle} onPress={handleMoveOn} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 78,
  },
  title: {
    fontSize: 24,
    lineHeight: 38,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 17,
    paddingVertical: 10,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.text,
  },
  footer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 50,
  },
})
