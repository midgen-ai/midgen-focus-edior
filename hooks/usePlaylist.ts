
import { useState, useCallback } from 'react';
import { PLAYLISTS } from '../constants/Audio';
import { useAudioEngine } from './useAudioEngine';
import { SOUNDS } from '../constants/Audio';

export const usePlaylist = () => {
    const engine = useAudioEngine();
    const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const applyMix = useCallback(async (mix: Record<string, number>) => {
        // Stop all sounds that are NOT in the mix?
        // Or just adjust everything?
        // Let's do a clean switch: stop everything not in mix, start everything in mix.

        const targetIds = Object.keys(mix);

        for (const sound of SOUNDS) {
            const shouldBePlaying = targetIds.includes(sound.id);
            const isCurrentlyPlaying = engine.isPlaying(sound.id);

            if (shouldBePlaying) {
                const targetVol = mix[sound.id];
                if (!isCurrentlyPlaying) {
                    await engine.toggleSound(sound.id);
                }
                engine.setVolume(sound.id, targetVol);
            } else {
                if (isCurrentlyPlaying) {
                    await engine.toggleSound(sound.id);
                }
            }
        }
    }, [engine]);

    const selectPlaylist = useCallback((id: string) => {
        const playlist = PLAYLISTS.find(p => p.id === id);
        if (!playlist) return;

        setActivePlaylistId(id);
        setIsPlaying(true);
        applyMix(playlist.mix);
    }, [applyMix]);

    const toggleGlobalPlayPause = useCallback(async () => {
        if (isPlaying) {
            // Stop all
            for (const sound of SOUNDS) {
                if (engine.isPlaying(sound.id)) {
                    await engine.toggleSound(sound.id);
                }
            }
            setIsPlaying(false);
        } else {
            // Resume or start random
            if (activePlaylistId) {
                const playlist = PLAYLISTS.find(p => p.id === activePlaylistId);
                if (playlist) applyMix(playlist.mix);
            } else {
                const random = PLAYLISTS[Math.floor(Math.random() * PLAYLISTS.length)];
                selectPlaylist(random.id);
            }
            setIsPlaying(true);
        }
    }, [isPlaying, activePlaylistId, applyMix, selectPlaylist, engine]);

    return {
        activePlaylistId,
        isPlaying,
        selectPlaylist,
        toggleGlobalPlayPause,
        activePlaylistName: PLAYLISTS.find(p => p.id === activePlaylistId)?.name,
        engine
    };
};
