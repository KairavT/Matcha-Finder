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

    return async () => {
      await Location.stopLocationUpdatesAsync(LOCATION_BG);
    }})()});


  useEffect(() => {(async () => {
    await Location.startLocationUpdatesAsync(MATCHA_FETCH, {
      accuracy: Location.LocationAccuracy.Balanced,
      distanceInterval: 100,
    });

    return async () => {
      await Location.stopLocationUpdatesAsync(MATCHA_FETCH);
  }})()});

  useEffect(() => {( async () => {
    const lastLoc = await AsyncStorage.getItem('loc');
    const lastMat = await AsyncStorage.getItem('matcha');
    if (lastLoc) setLoc(JSON.parse(lastLoc))
    if (lastMat) setMat(JSON.parse(lastMat));
  })()});


  let text = '...';
  if (err) text = err;
  else if (text != null) text = `${loc?.coords.latitude}, ${loc?.coords.longitude}`
  else text = 'Loading...';

  let text2 = '...';
  if (err) text2 = err;
  else if (text2 != null) text2 = JSON.stringify(mat);
  else text2 = 'Loading...';

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
