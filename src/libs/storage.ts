import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { format } from 'date-fns'

export interface IPlantProps {
  id: string
  name: string
  about: string
  water_tips: string
  photo: string
  environments: string[]
  frequency: {
    times: number
    repeat_every: string
  }
  dateTimeNotification: Date
  hour: string
}

export interface IStoragePlantProps {
  [id: string]: {
    data: IPlantProps
    notificationID: string
  }
}

export async function savePlant(plant: IPlantProps): Promise<void> {
  try {
    const nextTime = new Date(plant.dateTimeNotification)
    const now = new Date()

    const { times, repeat_every } = plant.frequency

    if (repeat_every === 'week') {
      const interval = Math.trunc(7 / times)
      nextTime.setDate(now.getDate() + interval)
    } else {
      nextTime.setDate(nextTime.getDate() + 1)
    }

    const seconds = Math.abs(
      Math.ceil((now.getTime() - nextTime.getTime()) / 1000)
    )

    const notificationID = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Heeey, 🌱',
        body: `Está na hora de cuidar da sua ${plant.name}`,
        sound: true,
        vibrate: [0, 250, 250, 250],
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          plant,
        },
      },
      trigger: {
        seconds: seconds < 60 ? 60 : seconds,
        repeats: true,
      },
    })

    const data = await AsyncStorage.getItem('@plantmanager:plants')
    const oldPlants = data ? (JSON.parse(data) as IStoragePlantProps) : {}

    const newPlant = {
      [plant.id]: {
        data: plant,
        notificationID,
      },
    }

    await AsyncStorage.setItem(
      '@plantmanager:plants',
      JSON.stringify({ ...oldPlants, ...newPlant })
    )
  } catch (error) {
    throw new Error(error)
  }
}

export async function loadPlants(): Promise<IPlantProps[]> {
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants')
    const plants = data ? (JSON.parse(data) as IStoragePlantProps) : {}

    const plantsSorted = Object.keys(plants)
      .map(plant => {
        return {
          ...plants[plant].data,
          hour: format(
            new Date(plants[plant].data.dateTimeNotification),
            'HH:mm'
          ),
        }
      })
      .sort(
        (a, b) =>
          Math.floor(new Date(a.dateTimeNotification).getTime() / 1000) -
          Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
      )

    return plantsSorted
  } catch (error) {
    throw new Error(error)
  }
}

export async function removePlant(id: string): Promise<void> {
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants')
    const plants = data ? (JSON.parse(data) as IStoragePlantProps) : {}

    await Notifications.cancelScheduledNotificationAsync(
      plants[id].notificationID
    )

    delete plants[id]

    await AsyncStorage.setItem('@plantmanager:plants', JSON.stringify(plants))
  } catch (error) {
    throw new Error(error)
  }
}
