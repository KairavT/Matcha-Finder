import { LocationRegion } from "expo-location";

export default function coordsToLocReg(stores: any[] | null) {
  const locRegs = [];
  if (stores && Array.isArray(stores)) {
    console.log('Creating geofence regions for stores:', stores);
    for (let store of stores) {
      // Handle both formats: direct {lat, lng} or {geometry: {location: {lat, lng}}}
      const location = store.geometry?.location || store;
      
      if (location.lat && location.lng) {
        let locReg: LocationRegion = {
          latitude: location.lat,
          longitude: location.lng,
          radius: 100,
          notifyOnEnter: true,
          notifyOnExit: true,
        };
        locRegs.push(locReg);
        console.log(`Added geofence at ${location.lat}, ${location.lng}`);
      } else {
        console.warn('Invalid store location:', store);
      }
    }
    console.log(`Created ${locRegs.length} geofence regions`);
    return locRegs;
  }
  return [];
}