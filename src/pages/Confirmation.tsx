import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import { Button } from '../components/Button'

export const Confirmation: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>😁</Text>
        <Text style={styles.title}>Prontinho</Text>
        <Text style={styles.subtitle}>
          Agora vamos começar a cuidar das suas plantinhas com muito cuidado.
        </Text>
        <View style={styles.footer}>
          <Button title="Começar" />
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
