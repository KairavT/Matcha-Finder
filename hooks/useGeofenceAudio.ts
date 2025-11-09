// @ts-nocheck
import {
    getRandomTrack,
    setGlobalPlayer,
    setIsPlaying,
    updateVolumeBasedOnProximity
} from '@/services/audioService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useRef } from 'react';

export function useGeofenceAudio() {
  const player = useAudioPlayer(getRandomTrack(), {
    loop: true,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set initial volume
    player.volume = 0.1;
    
    // Store player globally
    setGlobalPlayer(player);
    
    console.log('🎵 Audio player initialized:', {
      isLoaded: player.isLoaded,
      playing: player.playing,
      volume: player.volume,
    });

    // Poll AsyncStorage for geofence state changes
    intervalRef.current = setInterval(async () => {
      try {
        const shouldPlay = await AsyncStorage.getItem('shouldPlayMusic');
        const insideGeofence = await AsyncStorage.getItem('insideGeofence');
        const isPlaying = player.playing;

        console.log('🔍 Audio check:', {
          shouldPlay,
          insideGeofence,
          isPlaying,
          playerLoaded: player.isLoaded,
        });

        // Sync playing state
        setIsPlaying(isPlaying);

        // Start music if we should play and not already playing
        if (shouldPlay === 'true' && !isPlaying) {
          console.log('🎵 Attempting to start music...');
          console.log('Player state before play:', {
            isLoaded: player.isLoaded,
            playing: player.playing,
            paused: player.paused,
          });
          
          try {
            player.play();
            console.log('✅ Play command sent');
            console.log('Player state after play:', {
              isLoaded: player.isLoaded,
              playing: player.playing,
              paused: player.paused,
            });
          } catch (err) {
            console.error('❌ Error calling play():', err);
          }
        }

        // Stop music if we shouldn't play and currently playing
        if (shouldPlay === 'false' && isPlaying) {
          console.log('🔇 Stopping music - exited geofence');
          player.pause();
          player.seekTo(0);
        }

        // Update volume based on proximity if playing
        if (isPlaying && insideGeofence === 'true') {
          const locStr = await AsyncStorage.getItem('loc');
          const matchaStr = await AsyncStorage.getItem('matcha');
          
          if (locStr && matchaStr) {
            const loc = JSON.parse(locStr);
            const matcha = JSON.parse(matchaStr);
            
            if (Array.isArray(matcha) && matcha.length > 0) {
              updateVolumeBasedOnProximity(loc, matcha);
            }
          }
        }
      } catch (error) {
        console.error('Error in geofence audio hook:', error);
      }
    }, 1000); // Check every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [player]);

  return player;
}
