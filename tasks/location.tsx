import fetchMatchaStores from '@/services/fetch-matcha-stores';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';

export const LOCATION_BG = 'LOCATION_BG';
export const MATCHA_FETCH = 'MATCHA_FETCH';

TaskManager.defineTask(LOCATION_BG,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    if (res.error) return;
    const loc = res.data.locations[0];
    if (!loc) return;
    await AsyncStorage.setItem('loc', JSON.stringify(loc));
    console.log(loc);
  }
);

TaskManager.defineTask(MATCHA_FETCH,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    if (res.error) return;
    const loc = res.data.locations[0];
    if (!loc) return;
    const stores = await fetchMatchaStores(loc);
    await AsyncStorage.setItem('matcha', JSON.stringify(stores));
    console.log(loc);
  }
);