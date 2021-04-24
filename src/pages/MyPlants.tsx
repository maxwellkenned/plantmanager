import React, { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Header } from '../components/Header'
import {
  IPlantProps,
  IStoragePlantProps,
  loadPlants,
  removePlant,
} from '../libs/storage'
import { Loading } from '../components/Loading'

import colors from '../../styles/colors'
import waterdrop from '../assets/waterdrop.png'
import fonts from '../../styles/fonts'
import { PlantCardSecondary } from '../components/PlantCardSecondary'

export const MyPlants: React.FC = () => {
  const [plants, setPlants] = useState<IPlantProps[]>([])
  const [loading, setLoading] = useState(true)
  const [nextWaterd, setNextWaterd] = useState<string>()

  const handleRemove = useCallback((plant: IPlantProps) => {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 🙏',
        style: 'cancel',
      },
      {
        text: 'Sim 😢',
        onPress: async () => {
          try {
            await removePlant(plant.id)

            setPlants(oldData => oldData.filter(item => item.id !== plant.id))
          } catch {
            Alert.alert('Não foi possível remover! 😢')
          }
        },
      },
    ])
  }, [])

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlants()
      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: ptBR }
      )

      setNextWaterd(`Regue sua ${plantsStoraged[0].name} daqui à ${nextTime}.`)

      setPlants(plantsStoraged)
      setLoading(false)
    }

    loadStorageData()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>{nextWaterd}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={plants}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              handleRemove={() => handleRemove(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
})
