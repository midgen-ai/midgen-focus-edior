
import { Sound, Playlist } from './Types';

export const SOUNDS: Sound[] = [
    { id: 'rain', name: 'Rain', icon: 'CloudRain', file: require('../assets/audio/rain.mp3') },
    { id: 'thunder', name: 'Thunder', icon: 'CloudLightning', file: require('../assets/audio/thunder.mp3') },
    { id: 'wind', name: 'Wind', icon: 'Wind', file: require('../assets/audio/wind.mp3') },
    { id: 'forest', name: 'Forest', icon: 'Trees', file: require('../assets/audio/forest.mp3') },
    { id: 'leaves', name: 'Leaves', icon: 'Leaf', file: require('../assets/audio/leaves.mp3') },
    { id: 'water', name: 'Water', icon: 'Droplets', file: require('../assets/audio/water.mp3') },
    { id: 'seaside', name: 'Seaside', icon: 'Waves', file: require('../assets/audio/seaside.mp3') },
    { id: 'bonfire', name: 'Bonfire', icon: 'Flame', file: require('../assets/audio/bonfire.mp3') },
];

export const PLAYLISTS: Playlist[] = [
    {
        id: 'stormy-night',
        name: 'Stormy Night',
        icon: 'CloudLightning',
        mix: { rain: 0.8, thunder: 0.4, wind: 0.3 }
    },
    {
        id: 'forest-rain',
        name: 'Forest Rain',
        icon: 'Trees',
        mix: { rain: 0.5, forest: 0.7, leaves: 0.3 }
    },
    {
        id: 'campfire',
        name: 'Cozy Campfire',
        icon: 'Flame',
        mix: { bonfire: 0.8, forest: 0.3, wind: 0.1 }
    },
    {
        id: 'beach-day',
        name: 'Beach Day',
        icon: 'Waves',
        mix: { seaside: 0.7, wind: 0.3, water: 0.2 }
    },
    {
        id: 'zen-garden',
        name: 'Zen Garden',
        icon: 'Flower2',
        mix: { water: 0.6, leaves: 0.3, forest: 0.2 }
    },
    {
        id: 'windy-cabin',
        name: 'Windy Cabin',
        icon: 'Wind',
        mix: { wind: 0.8, leaves: 0.4, rain: 0.2 }
    },
];
