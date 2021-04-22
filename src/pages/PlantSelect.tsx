import React, { useCallback, useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native'

import api from '../services/api'

import colors from '../../styles/colors'
import fonts from '../../styles/fonts'

import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { EnvironmentButton } from '../components/EnvironmentButton'
import { PlantCardPrimary } from '../components/PlantCardPrimary'

interface IEnvionmentProps {
  key: string
  title: string
}

interface IPlantsProps {
  id: number
  name: string
  about: string
  water_tips: string
  photo: string
  environments: string[]
  frequency: {
    times: number
    repeat_every: string
  }
}

export const PlantSelect: React.FC = () => {
  const [envionments, setEnvionments] = useState<IEnvionmentProps[]>()
  const [plants, setPlants] = useState<IPlantsProps[]>()
  const [filteredPlants, setFilteredPlants] = useState<IPlantsProps[]>()
  const [envionmentSelected, setEnvionmentSelected] = useState('all')
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(true)
  const [loadedAll, setLoadedAll] = useState(false)

  const fetchPlants = useCallback(async () => {
    const { data } = await api.get('plants', {
      params: {
        _sort: 'name',
        _order: 'asc',
        _page: page,
        _limit: 8,
      },
    })

    if (!data) {
      return setLoadedAll(true)
    }

    if (page > 1) {
      setPlants(oldValue => [...oldValue, ...data])
      setFilteredPlants(oldValue => [...oldValue, ...data])
    } else {
      setPlants(data)
      setFilteredPlants(data)
    }

    setLoading(false)
    setLoadingMore(false)
  }, [page])

  const handleEnvionmentSelected = useCallback(
    (envionment: string) => {
      setEnvionmentSelected(envionment)

      if (envionment === 'all') {
        return setFilteredPlants(plants)
      }

      const filtered = plants.filter(plant =>
        plant.environments.includes(envionment)
      )

      setFilteredPlants(filtered)
    },
    [plants]
  )

  const handleFetchMore = useCallback(
    (distance: number) => {
      if (distance < 1) {
        return
      }

      setLoadingMore(true)
      setPage(oldValue => oldValue + 1)
      fetchPlants()
    },
    [fetchPlants]
  )

  useEffect(() => {
    const fetchEnvironment = async () => {
      const { data } = await api.get(`plants_environments`, {
        params: {
          _sort: 'title',
          _order: 'asc',
        },
      })

      setEnvionments([{ key: 'all', title: 'Todos' }, ...data])
    }

    fetchEnvironment()
  }, [])

  useEffect(() => {
    fetchPlants()
  }, [fetchPlants])

  if (loading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual hambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>
      <View style={styles.environmnetList}>
        <FlatList
          data={envionments}
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key === envionmentSelected}
              onPress={() => handleEnvionmentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => <PlantCardPrimary data={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore && <ActivityIndicator color={colors.green} />
          }
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.text,
    lineHeight: 20,
  },
  environmnetList: {
    height: 40,
    justifyContent: 'center',
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
})
