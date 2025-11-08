// @ts-nocheck - React 19 type compatibility issues with React Native
import { useMatchaStores } from '@/hooks/useMatchaStores';
import { Place } from '@/services/placesService';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
 const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
 const [locationLoading, setLocationLoading] = useState(true);


 const { stores, loading, error, refetch } = useMatchaStores({
   latitude: location?.latitude,
   longitude: location?.longitude,
   radius: 5000,
   autoFetch: true,
 });


 useEffect(() => {
   (async () => {
     try {
       const { status } = await Location.requestForegroundPermissionsAsync();
       if (status !== 'granted') {
         Alert.alert('Permission denied', 'Location permission is required to find matcha stores');
         setLocationLoading(false);
         return;
       }


       const currentLocation = await Location.getCurrentPositionAsync({});
       setLocation({
         latitude: currentLocation.coords.latitude,
         longitude: currentLocation.coords.longitude,
       });
     } catch (err) {
       Alert.alert('Error', 'Failed to get location');
       console.error(err);
     } finally {
       setLocationLoading(false);
     }
   })();
 }, []);


 const renderStore = ({ item }: { item: Place }) => (
   <View style={styles.storeCard}>
     <Text style={styles.storeName}>{item.name}</Text>
     <Text style={styles.storeAddress}>{item.vicinity}</Text>
     {item.rating && (
       <Text style={styles.storeRating}>
         ⭐ {item.rating} ({item.user_ratings_total} reviews)
       </Text>
     )}
     {item.opening_hours && (
       <Text style={styles.storeStatus}>
         {item.opening_hours.open_now ? '🟢 Open now' : '🔴 Closed'}
       </Text>
     )}
   </View>
 );


 if (locationLoading) {
   return (
     <View style={styles.centered}>
       <ActivityIndicator size="large" color="#4CAF50" />
       <Text style={styles.loadingText}>Getting your location...</Text>
     </View>
   );
 }


 if (!location) {
   return (
     <View style={styles.centered}>
       <Text style={styles.errorText}>Location not available</Text>
       <Text style={styles.infoText}>Please enable location permissions</Text>
     </View>
   );
 }


 return (
   <View style={styles.container}>
     <View style={styles.header}>
       <Text style={styles.title}>🍵 Nearby Matcha Stores</Text>
       <Text style={styles.subtitle}>
         📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
       </Text>
       <Button title="Refresh" onPress={() => refetch(location.latitude, location.longitude)} />
     </View>


     {loading ? (
       <View style={styles.centered}>
         <ActivityIndicator size="large" color="#4CAF50" />
         <Text style={styles.loadingText}>Finding matcha stores...</Text>
       </View>
     ) : error ? (
       <View style={styles.centered}>
         <Text style={styles.errorText}>Error: {error.message}</Text>
       </View>
     ) : stores.length === 0 ? (
       <View style={styles.centered}>
         <Text style={styles.emptyText}>No matcha stores found nearby</Text>
         <Text style={styles.infoText}>Try increasing the search radius</Text>
       </View>
     ) : (
       <FlatList
         data={stores}
         renderItem={renderStore}
         keyExtractor={(item) => item.place_id}
         contentContainerStyle={styles.list}
       />
     )}
   </View>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#f5f5f5',
 },
 header: {
   backgroundColor: 'white',
   padding: 16,
   paddingTop: 60,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 3,
 },
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   marginBottom: 4,
 },
 subtitle: {
   fontSize: 14,
   color: '#666',
   marginBottom: 12,
 },
 centered: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20,
 },
 loadingText: {
   marginTop: 10,
   fontSize: 16,
   color: '#666',
 },
 errorText: {
   color: 'red',
   fontSize: 16,
   textAlign: 'center',
   marginBottom: 8,
 },
 emptyText: {
   fontSize: 18,
   color: '#666',
   marginBottom: 8,
 },
 infoText: {
   fontSize: 14,
   color: '#999',
 },
 list: {
   padding: 16,
 },
 storeCard: {
   backgroundColor: 'white',
   padding: 16,
   marginBottom: 12,
   borderRadius: 8,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
   elevation: 3,
 },
 storeName: {
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 4,
 },
 storeAddress: {
   fontSize: 14,
   color: '#666',
   marginBottom: 8,
 },
 storeRating: {
   fontSize: 14,
   marginBottom: 4,
 },
 storeStatus: {
   fontSize: 14,
   fontWeight: '500',
 },
});



