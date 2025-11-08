import { ThemedText } from '@/components/themed-text';
import getLocationPerms from '@/services/get-location';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

const LOCATION_BG = 'location';

TaskManager.defineTask(LOCATION_BG,
  async (res: TaskManager.TaskManagerTaskBody<any>) => {
    if (res.error) return;
    if (res.data) console.log("Received new locations", res.data.locations);
  });

export default function HomeScreen() {
  const [loc, setLoc] = useState<Location.LocationObject | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => { (async () => { getLocationPerms(setErr) })() });
  Location.startLocationUpdatesAsync(LOCATION_BG,
    {
      accuracy: Location.LocationAccuracy.Balanced,
      distanceInterval: 1,
      foregroundService: {
        notificationTitle: "Searching for matcha...",
        notificationBody: "Searching..."
      }
    }
  );

  let text = '...';
  if (err) text = err;
  else if (text != null) text = `${loc?.coords.latitude}, ${loc?.coords.longitude}`
  else text = 'Loading...';

  return (
    <ThemedText>{text}</ThemedText>
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
