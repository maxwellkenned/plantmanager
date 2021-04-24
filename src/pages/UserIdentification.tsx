import React, { useCallback, useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import AsyncStorage from '@react-native-async-storage/async-storage'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import { Button } from '../components/Button'

export const UserIdentification: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const [name, setName] = useState<string>()
  const navigation = useNavigation()

  const handleSubmit = useCallback(async () => {
    if (!name) {
      return Alert.alert('Me diz como chamar você 😢')
    }

    try {
      await AsyncStorage.setItem('@plantmanager:user', name)

      navigation.navigate('Confirmation', {
        title: 'Prontinho',
        subtitle:
          'Agora vamos começar a cuidar das suas plantinhas com muito cuidado.',
        buttonTitle: 'Começar',
        icon: 'smile',
        nextScreen: 'PlantSelect',
      })
    } catch {
      Alert.alert('Não foi possível salvar o seu nome. 😢')
    }
  }, [navigation, name])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!name)
  }, [name])

  const handleInputFocus = useCallback(() => setIsFocused(true), [])

  const handleInputChange = useCallback((value: string) => {
    setIsFilled(!!value)
    setName(value)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text style={styles.emoji}>{isFilled ? '😄' : '😀'}</Text>
              <Text style={styles.title}>
                Como podemos{'\n'}
                chamar você?
              </Text>
            </View>

            <TextInput
              style={[
                styles.input,
                (isFocused || isFilled) && { borderColor: colors.green },
              ]}
              placeholder="Digite um nome"
              onChangeText={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
            />

            <View style={styles.footer}>
              <Button title="Confirmar" onPress={handleSubmit} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  },
  form: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 54,
  },
  header: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 78,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center',
  },
  footer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
})
