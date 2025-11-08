import * as Location from 'expo-location';
import { Dispatch } from 'react';

export default async function getLocationPerms(setErr: Dispatch<any>) {
  let statusFg = (await Location.requestForegroundPermissionsAsync()).status;
  if (statusFg != 'granted') {
    setErr('Foreground location access denied');
    return;
  }

  let statusBg = (await Location.requestBackgroundPermissionsAsync()).status;
  if (statusBg != 'granted') {
    setErr('Background location access denied');
    return;
  }
}