import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeofencingEventType } from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const GEOFENCING = 'GEOFENCING';

TaskManager.defineTask(GEOFENCING,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    if (res.error) {
      console.error('Geofencing error:', res.error);
      return;
    }

    try {
      // Get current list of active geofences
      const activeGeofencesStr = await AsyncStorage.getItem('activeGeofences');
      let activeGeofences: string[] = activeGeofencesStr ? JSON.parse(activeGeofencesStr) : [];
      
      const regionId = res.data.region.identifier;

      if (res.data.eventType === GeofencingEventType.Enter) {
        console.log('🎵 Entered matcha store region:', regionId);
        
        // Add this geofence to active list if not already there
        if (!activeGeofences.includes(regionId)) {
          activeGeofences.push(regionId);
          await AsyncStorage.setItem('activeGeofences', JSON.stringify(activeGeofences));
        }
        
        // Set flags for foreground to pick up
        await AsyncStorage.setItem('shouldPlayMusic', 'true');
        await AsyncStorage.setItem('insideGeofence', 'true');
        
        console.log('Active geofences:', activeGeofences);
      } else {
        console.log('🔇 Exited matcha store region:', regionId);
        
        // Remove this geofence from active list
        activeGeofences = activeGeofences.filter(id => id !== regionId);
        await AsyncStorage.setItem('activeGeofences', JSON.stringify(activeGeofences));
        
        console.log('Active geofences after exit:', activeGeofences);
        
        // Only stop music if we've exited ALL geofences
        if (activeGeofences.length === 0) {
          console.log('🔇 Exited all geofences - stopping music');
          await AsyncStorage.setItem('shouldPlayMusic', 'false');
          await AsyncStorage.setItem('insideGeofence', 'false');
        } else {
          console.log(`Still inside ${activeGeofences.length} geofence(s) - keeping music playing`);
        }
      }
    } catch (error) {
      console.error('Error in geofencing task:', error);
    }
  }
);
