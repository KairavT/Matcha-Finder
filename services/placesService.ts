
// const GOOGLE_PLACES_API_KEY = process.env.GMAPS_API;
// const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';


// export interface Place {
//   place_id: string;
//   name: string;
//   vicinity: string;
//   geometry: {
//     location: {
//       lat: number;
//       lng: number;
//     };
//   };
//   rating?: number;
//   user_ratings_total?: number;
//   opening_hours?: {
//     open_now: boolean;
//   };
//   photos?: Array<{
//     photo_reference: string;
//     height: number;
//     width: number;
//   }>;
// }


// export interface NearbySearchResponse {
//   results: Place[];
//   status: string;
//   next_page_token?: string;
// }


// /**
// * Search for nearby matcha stores using Google Places API
// * @param latitude - User's current latitude
// * @param longitude - User's current longitude
// * @param radius - Search radius in meters (default: 5000)
// * @param keyword - Search keyword (default: 'matcha')
// */
// export async function findNearbyMatchaStores(
//   latitude: number,
//   longitude: number,
//   radius: number = 5000,
//   keyword: string = 'matcha'
//   ): Promise<Place[]> {
//   try {
//     const url = `${PLACES_API_URL}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${keyword}&type=cafe|restaurant&key=${GOOGLE_PLACES_API_KEY}`;


//     const response = await fetch(url);
//     const data: NearbySearchResponse = await response.json();


//     if (data.status === 'OK') {
//       return data.results;
//     } else if (data.status === 'ZERO_RESULTS') {
//       return [];
//     } else {
//       throw new Error(`Places API error: ${data.status}`);
//     }
//   } catch (error) {
//     console.error('Error fetching nearby matcha stores:', error);
//     throw error;
//   }
//   }


//   /**
//   * Get photo URL from photo reference
//   * @param photoReference - Photo reference from Places API
//   * @param maxWidth - Maximum width of the photo (default: 400)
//   */
//   export function getPlacePhotoUrl(photoReference: string, maxWidth: number = 400): string {
//   return `${PLACES_API_URL}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
//   }


//   /**
//   * Get detailed information about a place
//   * @param placeId - Place ID from Places API
//   */
//   export async function getPlaceDetails(placeId: string) {
//   try {
//     const url = `${PLACES_API_URL}/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,opening_hours,website,reviews&key=${GOOGLE_PLACES_API_KEY}`;


//     const response = await fetch(url);
//     const data = await response.json();


//     if (data.status === 'OK') {
//       return data.result;
//     } else {
//       throw new Error(`Place Details API error: ${data.status}`);
//     }
//   } catch (error) {
//     console.error('Error fetching place details:', error);
//     throw error;
//   }
// }



