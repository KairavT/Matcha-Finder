​​import { Event } from 'react-native-track-player';
import TrackPlayer from 'react-native-track-player';


export const PlaybackService = async function() {


   TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());


   TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());


   // ...
};








/*
const track2 = {
   url: require('./coelacanth.ogg'), // Load media from the app bundle
   title: 'Coelacanth I',
   artist: 'deadmau5',
   artwork: require('./cover.jpg'), // Load artwork from the app bundle
   duration: 166
};
*/

