import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import getLocationPerms from '@/services/get-location-perms';
import { LOCATION_BG, MATCHA_FETCH } from '@/tasks/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [err, setErr] = useState<string | null>(null);
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);
  const [mat, setMat] = useState<any | null>(null);

  useEffect(() => {(async () => { getLocationPerms(setErr) })()});

  useEffect(() => {(async () => { 
    await Location.startLocationUpdatesAsync(LOCATION_BG, {
      accuracy: Location.LocationAccuracy.High,
      distanceInterval: 1,
      foregroundService: {
        notificationTitle: "Searching for matcha...",
        notificationBody: "Your location is being used in the background"
      },
      timeInterval: 1000,
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    await Location.startLocationUpdatesAsync(MATCHA_FETCH, {
      accuracy: Location.LocationAccuracy.Balanced,
      distanceInterval: 1,
      deferredUpdatesInterval: 1000,
      deferredUpdatesDistance: 1,
    });

    const isRunning1 = await Location.hasStartedLocationUpdatesAsync(LOCATION_BG);
    const isRunning2 = await Location.hasStartedLocationUpdatesAsync(MATCHA_FETCH);
    console.log('PRECISE_TRACKING running:', isRunning1);
    console.log('COARSE_TRACKING running:', isRunning2);

    return async () => {
      await Location.stopLocationUpdatesAsync(LOCATION_BG);
      await Location.stopLocationUpdatesAsync(MATCHA_FETCH);
    }})()}, []);


  useEffect(() => {( async () => {
    const lastLoc = await AsyncStorage.getItem('loc');
    const lastMat = await AsyncStorage.getItem('matcha');
    if (lastLoc) setLoc(JSON.parse(lastLoc))
    if (lastMat) setMat(JSON.parse(lastMat));
  })()});

  let text = 'Loading...';
  if (err) text = err;
  else if (loc) text = `${loc?.coords.latitude}, ${loc?.coords.longitude}`

  let text2 = 'Loading...';
  if (err) text2 = err;
  if (mat) {
    text2 = mat.map((x: any) => `store: ${x.lat}, ${x.lng}`).join('\n');
  }

  return (
    <ThemedView>
      <ThemedText>{text}</ThemedText>
      <ThemedText>{text2}</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
