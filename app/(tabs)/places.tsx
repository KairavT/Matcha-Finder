// @ts-nocheck
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAudio } from '@/hooks/useAudio';
import getLocationPerms from '@/services/get-location-perms';
import { GEOFENCING } from '@/tasks/geofencing';
import { LOCATION_BG, MATCHA_FETCH } from '@/tasks/location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const [err, setErr] = useState<string | null>(null);
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);
  const [mat, setMat] = useState<any | null>(null);
  const { isPlaying, play, pause, stop } = useAudio();

  useEffect(() => {(async () => { getLocationPerms(setErr) })()});

  useEffect(() => {(async () => { 
    await Location.startLocationUpdatesAsync(LOCATION_BG, {
      accuracy: Location.LocationAccuracy.BestForNavigation,
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

    await new Promise(resolve => setTimeout(resolve, 5000));


    const isRunning1 = await Location.hasStartedLocationUpdatesAsync(LOCATION_BG);
    const isRunning2 = await Location.hasStartedLocationUpdatesAsync(MATCHA_FETCH);
    // const isRunning3 = await Location.hasStartedGeofencingAsync(GEOFENCING);
    console.log('LOCATION_BG running:', isRunning1);
    console.log('MATCHA_FETCH running:', isRunning2);
    // console.log('GEOFENCING running:', isRunning3);

    return async () => {
      await Location.stopLocationUpdatesAsync(LOCATION_BG);
      await Location.stopLocationUpdatesAsync(MATCHA_FETCH);
        await Location.stopLocationUpdatesAsync(GEOFENCING);
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
  else if (mat?.places && Array.isArray(mat.places))
    text2 = mat.places.map((x: any) => x.id).join('\n');
  else if (mat)
    text2 = 'No places found';

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>📍 Location</ThemedText>
      <ThemedText>{text}</ThemedText>
      
      <ThemedText style={styles.title}>🍵 Matcha Stores</ThemedText>
      <ThemedText>{text2}</ThemedText>
      
      <View style={styles.audioSection}>
        <ThemedText style={styles.title}>🎵 Audio Status</ThemedText>
        <ThemedText>Status: {isPlaying ? '▶️ Playing' : '⏸️ Stopped'}</ThemedText>
        <ThemedText style={styles.infoText}>
          Music will auto-play when you enter a matcha store geofence and get louder as you get closer!
        </ThemedText>
        <View style={styles.buttonContainer}>
          <Button title="Play" onPress={play} disabled={isPlaying} />
          <Button title="Pause" onPress={pause} disabled={!isPlaying} />
          <Button title="Stop" onPress={stop} disabled={!isPlaying} />
        </View>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  audioSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 10,
  },
  infoText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginVertical: 10,
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10,
  },
});
