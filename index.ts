import { registerRootComponent } from 'expo';
import App from './app/_layout';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from './services/audioService';


await TrackPlayer.setupPlayer()


registerRootComponent(App);


//TrackPlayer.registerPlaybackService(() => require('./service'));
TrackPlayer.registerPlaybackService(() => PlaybackService);







