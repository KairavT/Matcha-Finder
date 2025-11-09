import * as Location from 'expo-location';
 
export default async function fetchMatchaStores(loc: Location.LocationObject | null) {
  console.log(loc);
  if (loc) {
    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      body: JSON.stringify({
        textQuery: 'matcha',
        locationBias: {
          circle: {
            center: {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            },
            radius: 100,
          }
        },
        includedType: 'cafe',
        includePureServiceAreaBusinesses: false,
        openNow: true,
  
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': `${process.env.GMAPS_API_KEY}`,
        'X-Goog-FieldMask': 'places.id,places.name'
      }
    });
  
    const body = await res.json();
    console.log(body);
    return body;
  }
}