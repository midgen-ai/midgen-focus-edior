
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Image, Linking, Keyboard, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { BricolageGrotesque_400Regular, BricolageGrotesque_600SemiBold } from '@expo-google-fonts/bricolage-grotesque';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Editor } from './components/Editor';
import { ThemeSelector } from './components/ThemeSelector';
import { AudioPlayer } from './components/AudioPlayer';
import { CopyDropdown } from './components/CopyDropdown';
import { ShareButton } from './components/ShareButton';
import { SettingsDropdown } from './components/SettingsDropdown';
import { FocusModeAnimations } from './components/FocusModeAnimations';
import { GoalProgress } from './components/GoalProgress';
import { usePlaylist } from './hooks/usePlaylist';
import { THEMES, ThemeId } from './constants/Themes';
import { Music2, Disc } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

function AppContent() {
    const [themeId, setThemeId] = useState<ThemeId>('dark');
    const [audioVisible, setAudioVisible] = useState(false);
    const [content, setContent] = useState('');
    const [isReadingMode, setIsReadingMode] = useState(false);

    // Focus Mode State
    const [goal, setGoal] = useState(700);
    const [isIdle, setIsIdle] = useState(false);
    const [lastInputTime, setLastInputTime] = useState(Date.now());
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const playlistHook = usePlaylist();
    const insets = useSafeAreaInsets();

    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const isLight = themeId === 'light' || themeId === 'sepia';
    const textColor = isLight ? '#000' : '#fff';

    // Keyboard Listeners
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved settings
    useEffect(() => {
        Promise.all([
            AsyncStorage.getItem('theme').then(t => {
                if (t) setThemeId(t as ThemeId);
            }),
            AsyncStorage.getItem('goal').then(g => {
                if (g) setGoal(parseInt(g, 10));
            }),
            AsyncStorage.getItem('focus_editor_content').then(c => {
                if (c) setContent(c);
            })
        ]).finally(() => {
            setIsLoaded(true);
        });
    }, []);

    // Idle Timer
    useEffect(() => {
        const checkIdle = setInterval(() => {
            if (!isReadingMode && Date.now() - lastInputTime > 60000) { // 1 minute
                setIsIdle(true);
            }
        }, 5000);
        return () => clearInterval(checkIdle);
    }, [lastInputTime, isReadingMode]);

    const handleThemeChange = (id: ThemeId) => {
        setThemeId(id);
        AsyncStorage.setItem('theme', id);
    };

    const handleGoalChange = (newGoal: number) => {
        setGoal(newGoal);
        AsyncStorage.setItem('goal', newGoal.toString());
    };

    const handleClearAll = async () => {
        setContent('');
        await AsyncStorage.removeItem('focus_editor_content');
    };

    const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const isGoalReached = wordCount >= goal;

    if (!isLoaded) return null;

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <StatusBar
                barStyle={isLight ? 'dark-content' : 'light-content'}
                backgroundColor="transparent"
                translucent
            />

            {/* Top Bar */}
            <View style={[styles.header, { paddingTop: insets.top + 20, paddingHorizontal: 30, paddingBottom: 20 }]}>
                <View style={styles.leftControls}>
                    <TouchableOpacity
                        style={[styles.audioButton, { borderColor: theme.accent + '40', backgroundColor: theme.accent + '10' }]}
                        onPress={() => setAudioVisible(true)}
                    >
                        {playlistHook.isPlaying ? (
                            <Disc size={20} color={theme.accent} style={{ opacity: 0.8 }} />
                        ) : (
                            <Music2 size={20} color={theme.text} style={{ opacity: 0.6 }} />
                        )}
                    </TouchableOpacity>
                    {playlistHook.activePlaylistName && (
                        <Text style={{ marginLeft: 10, color: theme.text, fontSize: 12, opacity: 0.7 }}>
                            {playlistHook.activePlaylistName}
                        </Text>
                    )}
                </View>

                <View style={styles.rightControls}>
                    <CopyDropdown content={content} themeId={themeId} textColor={textColor} />
                    <ShareButton content={content} themeId={themeId} textColor={textColor} />
                    <SettingsDropdown
                        themeId={themeId}
                        onThemeChange={handleThemeChange}
                        onClearAll={handleClearAll}
                        textColor={textColor}
                        isReadingMode={isReadingMode}
                        onToggleReadingMode={() => setIsReadingMode(!isReadingMode)}
                    />
                </View>
            </View>

            <Editor
                themeId={themeId}
                content={content}
                setContent={setContent}
                setIsIdle={setIsIdle}
                setLastInputTime={setLastInputTime}
                isReadingMode={isReadingMode}
            />

            {/* Bottom Bar - Hide when keyboard is open */}
            {!keyboardVisible && (
                <View style={[styles.footer, { paddingBottom: insets.bottom + 10, paddingHorizontal: 20 }]}>
                    {/* Left: Midgen Logo */}
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://midgenlabs.com')}
                        style={styles.logoContainer}
                    >
                        <Image
                            source={require('./assets/midgen-logo.png')}
                            style={{ width: 24, height: 24, resizeMode: 'contain', opacity: 0.6 }}
                        />
                    </TouchableOpacity>

                    {/* Right: Cat & Goals */}
                    <View style={styles.focusWidget}>
                        <FocusModeAnimations
                            isWriting={!isIdle && !isReadingMode}
                            isGoalReached={isGoalReached}
                            isIdle={isIdle}
                            themeId={themeId}
                            style={styles.catAnimation}
                        />
                        <GoalProgress
                            currentWords={wordCount}
                            goal={goal}
                            onGoalChange={handleGoalChange}
                            themeId={themeId}
                        />
                    </View>
                </View>
            )}

            <AudioPlayer
                visible={audioVisible}
                onClose={() => setAudioVisible(false)}
                playlistHook={playlistHook}
                theme={theme}
            />
        </View>
    );
}

export default function App() {
    let [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        BricolageGrotesque_400Regular,
        BricolageGrotesque_600SemiBold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <AppContent />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        zIndex: 10,
    },
    leftControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(128,128,128,0.1)',
        padding: 5,
        borderRadius: 20,
    },
    audioButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'box-none',
    },
    logoContainer: {
        marginBottom: 10,
    },
    focusWidget: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    catAnimation: {
        marginBottom: -15,
        marginRight: -10,
    }
});
