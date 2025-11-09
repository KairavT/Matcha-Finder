import * as Location from 'expo-location';
 
export default async function fetchMatchaStores(loc: Location.LocationObject | null) {
  console.log(`gfsij ${loc}`);
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
            radius: 50,
          }
        },
        includedType: 'cafe',
        includePureServiceAreaBusinesses: false,
        openNow: true,
        pageSize: 3,
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': `${process.env.EXPO_PUBLIC_GMAPS_API_KEY}`,
        'X-Goog-FieldMask': 'places.id'
      }
    });
  
    const body = await res.json();
    const places: string[] = body.places.map((x: any) => x.id);
    return await getCoords(places);
  }
}

async function getCoords(places: string[] | null) {
  const coords = [];
  if (places) {
    for (let place of places) {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${place}&key=${process.env.EXPO_PUBLIC_GMAPS_API_KEY}`);
      const body = await res.json();
      if (body.status == 'OK') {
        console.log(body.results);
        if (body.results[0].geometry) {
          coords.push(body.results[0].geometry.location);
        }
      }
    }
  }
  console.log(coords);
  return coords;
}