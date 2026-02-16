
import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { SOUNDS } from '../constants/Audio';

export const useAudioEngine = () => {
    const soundObjects = useRef<Record<string, Audio.Sound>>({});
    const [playingIds, setPlayingIds] = useState<string[]>([]);
    const [volumes, setVolumes] = useState<Record<string, number>>({});

    useEffect(() => {
        // Initialize audio mode
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });

        // Preload sounds? 
        // Maybe better to load on demand to save memory, but for < 10 sounds, preloading is fine.
        // Let's load on toggle to be safe.

        return () => {
            // Cleanup
            Object.values(soundObjects.current).forEach(sound => {
                sound.unloadAsync();
            });
        };
    }, []);

    const loadSound = async (id: string) => {
        if (soundObjects.current[id]) return soundObjects.current[id];

        const soundDef = SOUNDS.find(s => s.id === id);
        if (!soundDef) return null;

        const { sound } = await Audio.Sound.createAsync(
            soundDef.file,
            { isLooping: true, volume: volumes[id] || 0.5 }
        );
        soundObjects.current[id] = sound;
        return sound;
    };

    const toggleSound = useCallback(async (id: string) => {
        try {
            let sound = soundObjects.current[id];

            if (playingIds.includes(id)) {
                // Stop
                if (sound) {
                    await sound.stopAsync();
                }
                setPlayingIds(prev => prev.filter(p => p !== id));
            } else {
                // Play
                if (!sound) {
                    const loaded = await loadSound(id);
                    if (loaded) sound = loaded;
                }
                if (sound) {
                    // Update volume just in case
                    await sound.setVolumeAsync(volumes[id] || 0.5);
                    await sound.playAsync();
                    setPlayingIds(prev => [...prev, id]);
                }
            }
        } catch (error) {
            console.error("Error toggling sound:", error);
        }
    }, [playingIds, volumes]);

    const setVolume = useCallback(async (id: string, volume: number) => {
        setVolumes(prev => ({ ...prev, [id]: volume }));
        const sound = soundObjects.current[id];
        if (sound) {
            await sound.setVolumeAsync(volume);
        }
    }, []);

    const isPlaying = useCallback((id: string) => playingIds.includes(id), [playingIds]);

    return {
        toggleSound,
        setVolume,
        isPlaying,
        volumes
    };
};
