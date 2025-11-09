// @ts-nocheck
import fetchMatchaStores from '@/services/fetch-matcha-stores';
import coordsToLocReg from '@/services/geofence';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { GEOFENCING } from './geofencing';

export const LOCATION_BG = 'LOCATION_BG';
export const MATCHA_FETCH = 'MATCHA_FETCH';

TaskManager.defineTask(LOCATION_BG,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    if (res.error) return;
    const loc = res.data.locations[0];
    if (!loc) return;
    
    // Store location for foreground to use for volume updates
    await AsyncStorage.setItem('loc', JSON.stringify(loc));
  }
);

TaskManager.defineTask(MATCHA_FETCH,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    console.log('Fetching matcha stores...');
    if (res.error) return;
    const loc = res.data.locations[0];
    if (!loc) return;
    const stores = await fetchMatchaStores(loc);
    await AsyncStorage.setItem('matcha', JSON.stringify(stores));
    if (stores) {
      if (await Location.hasStartedGeofencingAsync(GEOFENCING))
        await Location.stopGeofencingAsync(GEOFENCING);
      await Location.startGeofencingAsync(GEOFENCING, coordsToLocReg(stores));
    }
  }
);
