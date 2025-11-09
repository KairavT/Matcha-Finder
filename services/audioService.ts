import { Audio } from 'expo-av';
import * as Location from 'expo-location';

class AudioService {
  private sound: Audio.Sound | null = null;
  private isPlaying: boolean = false;
  private index: number = 0;
  
  private tracks = [
    require('../assets/music/Clairo - Juna.mp3'),
    require('../assets/music/Daniel Caesar - Superpowers (Official Audio).mp3'),
    require('../assets/music/Laufey - Lover Girl.mp3'),
    require('../assets/music/Lovers Rock.mp3'),
    require('../assets/music/the way things go.mp3'),
  ];

  private sounds: Audio.Sound[] = [];

  async initialize() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    for (const track of this.tracks) {
      let sound = (await Audio.Sound.createAsync(track,
        { shouldPlay: false, isLooping: true, volume: 0.1 } )).sound;
      if (!sound._loaded && !sound._loading)
        sound.loadAsync(track);
      this.sounds.push(sound);
    }
  }

  async play() {
    if (this.isPlaying) return;

    try {
      if (!this.sound) {
        this.index = Math.floor(Math.random() * this.tracks.length);
        this.sound = this.sounds[this.index]
      }
      if (!this.sound._loaded && !this.sound._loading)
        this.sound.loadAsync(this.tracks[this.index]);
      await this.sound.playAsync();
  
      this.isPlaying = true;
      console.log('Music started playing');
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  async pause() {}

  async stop() {
    if (!this.sound) return;

    try {
      this.sound._loaded = false;
      await this.sound.unloadAsync();
      this.sound = null;
      this.isPlaying = false;
      console.log('Music stopped');
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  async setVolume(volume: number) {
    if (!this.sound) return;

    try {
      // Clamp volume between 0 and 1
      const clampedVolume = Math.max(0, Math.min(1, volume));
      await this.sound.setVolumeAsync(clampedVolume);
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }

  // Calculate volume based on distance to nearest matcha store
  calculateVolumeFromDistance(distance: number): number {
    // Distance in meters
    // At 50m (geofence radius): volume = 0.1 (10%)
    // At 0m: volume = 1.0 (100%)
    const maxDistance = 50; // geofence radius
    const minVolume = 0.1;
    const maxVolume = 1.0;

    if (distance >= maxDistance) return minVolume;
    if (distance <= 0) return maxVolume;

    // Linear interpolation
    const volumeRange = maxVolume - minVolume;
    const distanceRatio = 1 - (distance / maxDistance);
    return minVolume + (volumeRange * distanceRatio);
  }

  // Update volume based on current location and matcha stores
  async updateVolumeBasedOnProximity(
    currentLocation: Location.LocationObject,
    matchaStores: Array<{ geometry: { location: { lat: number; lng: number } } }>
  ) {
    if (!this.isPlaying || matchaStores.length === 0) return;

    // Find nearest store
    let minDistance = Infinity;
    
    for (const store of matchaStores) {
      const distance = this.calculateDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        store.geometry.location.lat,
        store.geometry.location.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    const volume = this.calculateVolumeFromDistance(minDistance);
    await this.setVolume(volume);
    console.log(`Distance to nearest store: ${minDistance.toFixed(2)}m, Volume: ${(volume * 100).toFixed(0)}%`);
  }

  // Haversine formula to calculate distance between two coordinates
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioService = new AudioService();

