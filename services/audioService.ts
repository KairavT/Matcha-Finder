import * as Location from 'expo-location';

// Simple state management for audio
let isPlaying = false;
let currentVolume = 0.1;

const tracks = [
  require('../assets/music/Clairo - Juna.mp3'),
  require('../assets/music/Daniel Caesar - Superpowers (Official Audio).mp3'),
  require('../assets/music/Laufey - Lover Girl.mp3'),
  require('../assets/music/Lovers Rock.mp3'),
  require('../assets/music/the way things go.mp3'),
];

// Store player reference globally (will be set by the hook)
let globalPlayerRef: any = null;

export function setGlobalPlayer(player: any) {
  globalPlayerRef = player;
}

export function getGlobalPlayer() {
  return globalPlayerRef;
}

export function playBackgroundAudio() {
  if (globalPlayerRef && !isPlaying) {
    globalPlayerRef.play();
    isPlaying = true;
    console.log('Music started');
  }
}

export function pauseBackgroundAudio() {
  if (globalPlayerRef && isPlaying) {
    globalPlayerRef.pause();
    isPlaying = false;
    console.log('Music paused');
  }
}

export function stopBackgroundAudio() {
  if (globalPlayerRef) {
    globalPlayerRef.pause();
    globalPlayerRef.seekTo(0);
    isPlaying = false;
    console.log('Music stopped');
  }
}

export function setBackgroundVolume(volume: number) {
  const clampedVolume = Math.max(0, Math.min(1, volume));
  if (globalPlayerRef) {
    globalPlayerRef.volume = clampedVolume;
    currentVolume = clampedVolume;
  }
}

export function getIsPlaying() {
  return isPlaying;
}

export function setIsPlaying(playing: boolean) {
  isPlaying = playing;
}

// Calculate volume based on distance to nearest matcha store
export function calculateVolumeFromDistance(distance: number): number {
  const maxDistance = 50;
  const minVolume = 0.1;
  const maxVolume = 1.0;

  if (distance >= maxDistance) return minVolume;
  if (distance <= 0) return maxVolume;

  const volumeRange = maxVolume - minVolume;
  const distanceRatio = 1 - (distance / maxDistance);
  return minVolume + (volumeRange * distanceRatio);
}

// Haversine formula to calculate distance between two coordinates
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Update volume based on current location and matcha stores
export function updateVolumeBasedOnProximity(
  currentLocation: Location.LocationObject,
  matchaStores: Array<{ geometry: { location: { lat: number; lng: number } } }>
) {
  if (!isPlaying || matchaStores.length === 0) return;

  let minDistance = Infinity;
  
  for (const store of matchaStores) {
    const distance = calculateDistance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      store.geometry.location.lat,
      store.geometry.location.lng
    );
    
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  const volume = calculateVolumeFromDistance(minDistance);
  setBackgroundVolume(volume);
  console.log(`Distance: ${minDistance.toFixed(2)}m, Volume: ${(volume * 100).toFixed(0)}%`);
}

export function getRandomTrack() {
  const index = Math.floor(Math.random() * tracks.length);
  return tracks[index];
}
