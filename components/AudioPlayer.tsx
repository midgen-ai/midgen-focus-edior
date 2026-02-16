import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { X, Play, Pause, Music2, Volume2, CloudRain, CloudLightning, Wind, Trees, Leaf, Droplets, Waves, Flame, Flower2 } from 'lucide-react-native';
import { usePlaylist } from '../hooks/usePlaylist';
import { SOUNDS, PLAYLISTS } from '../constants/Audio';
import { ThemeType } from '../constants/Themes';

interface AudioPlayerProps {
    visible: boolean;
    onClose: () => void;
    playlistHook: ReturnType<typeof usePlaylist>;
    theme: ThemeType;
}

const ICON_MAP: Record<string, React.ElementType> = {
    CloudRain,
    CloudLightning,
    Wind,
    Trees,
    Leaf,
    Droplets,
    Waves,
    Flame,
    Flower2,
};

export const AudioPlayer = ({ visible, onClose, playlistHook, theme }: AudioPlayerProps) => {
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    const {
        activePlaylistId,
        selectPlaylist,
        engine,
        isPlaying,
        toggleGlobalPlayPause
    } = playlistHook;

    return (
        <Modal
            animationType={isDesktop ? "fade" : "slide"}
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[
                styles.centeredView,
                isDesktop ? { justifyContent: 'center' } : { justifyContent: 'flex-end' }
            ]}>
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={[
                    styles.modalView,
                    { backgroundColor: '#1a1a1a', borderColor: '#333', borderWidth: 1 },
                    isDesktop ? styles.modalViewDesktop : styles.modalViewMobile
                ]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Music2 size={24} color={theme.accent} />
                            <View>
                                <Text style={styles.title}>Soundscapes</Text>
                                <Text style={{ color: '#888', fontSize: 12 }}>
                                    {playlistHook.activePlaylistName || "Select a sound"}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                            <TouchableOpacity onPress={toggleGlobalPlayPause} style={{ padding: 5 }}>
                                {isPlaying ? <Pause size={20} color={theme.text} /> : <Play size={20} color={theme.text} />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose}>
                                <X size={24} color="#888" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Playlists */}
                        <Text style={styles.sectionTitle}>Playlists</Text>
                        <View style={styles.grid}>
                            {PLAYLISTS.map(playlist => {
                                const Icon = ICON_MAP[playlist.icon] || Music2;
                                return (
                                    <TouchableOpacity
                                        key={playlist.id}
                                        style={[
                                            styles.card,
                                            activePlaylistId === playlist.id && { borderColor: theme.accent, borderWidth: 1, backgroundColor: theme.accent + '20' }
                                        ]}
                                        onPress={() => selectPlaylist(playlist.id)}
                                    >
                                        <Icon size={24} color={activePlaylistId === playlist.id ? theme.accent : '#888'} />
                                        <Text style={[styles.cardTitle, activePlaylistId === playlist.id && { color: theme.accent }]}>
                                            {playlist.name}
                                        </Text>
                                        {activePlaylistId === playlist.id && isPlaying && (
                                            <View style={styles.playingIndicator} />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Individual Sounds */}
                        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Individual Sounds</Text>
                        {SOUNDS.map(sound => {
                            const Icon = ICON_MAP[sound.icon] || Music2;
                            return (
                                <View key={sound.id} style={styles.soundRow}>
                                    <TouchableOpacity
                                        style={styles.soundInfo}
                                        onPress={() => engine.toggleSound(sound.id)}
                                    >
                                        <Icon size={20} color={engine.isPlaying(sound.id) ? theme.accent : '#666'} />
                                        <View>
                                            <Text style={[
                                                styles.soundName,
                                                engine.isPlaying(sound.id) && { color: theme.accent }
                                            ]}>
                                                {sound.name}
                                            </Text>
                                            <Text style={{ color: '#555', fontSize: 10 }}>Ambience</Text>
                                        </View>
                                    </TouchableOpacity>

                                    {engine.isPlaying(sound.id) && (
                                        <View style={styles.sliderContainer}>
                                            <Volume2 size={16} color="#666" />
                                            <Slider
                                                style={{ width: 120, height: 40 }}
                                                minimumValue={0}
                                                maximumValue={1}
                                                value={engine.volumes[sound.id] || 0.5}
                                                onValueChange={(val) => engine.setVolume(sound.id, val)}
                                                minimumTrackTintColor={theme.accent}
                                                maximumTrackTintColor="#333"
                                                thumbTintColor={theme.accent}
                                            />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </ScrollView>

                    {/* Footer Controls */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.playButton, { backgroundColor: theme.accent }]}
                            onPress={toggleGlobalPlayPause}
                        >
                            {isPlaying ? (
                                <Pause size={24} color="#fff" fill="#fff" />
                            ) : (
                                <Play size={24} color="#fff" fill="#fff" />
                            )}
                            <Text style={styles.playText}>
                                {isPlaying ? "Pause All" : "Resume"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    modalViewMobile: {
        height: '70%',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalViewDesktop: {
        width: 700,
        maxHeight: '80%',
        borderRadius: 20,
        alignSelf: 'center',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    card: {
        width: '48%',
        padding: 15,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        alignItems: 'center',
    },
    cardTitle: {
        color: '#ddd',
        fontWeight: '500',
        marginTop: 5,
    },
    soundRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    soundInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    soundName: {
        color: '#ccc',
        fontSize: 16,
        fontWeight: '500',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 30,
    },
    playText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    playingIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4ade80',
        position: 'absolute',
        top: 10,
        right: 10,
    }
});
