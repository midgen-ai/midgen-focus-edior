
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Switch } from 'react-native';
import { Settings, Trash2, Globe, MessageCircle, BookOpen } from 'lucide-react-native';
import { ThemeId, THEMES } from '../constants/Themes';
import { BottomSheet } from './BottomSheet';

interface SettingsDropdownProps {
    themeId: ThemeId;
    onThemeChange: (id: ThemeId) => void;
    onClearAll: () => void;
    textColor: string;
    isReadingMode: boolean;
    onToggleReadingMode: () => void;
}

export const SettingsDropdown = ({ themeId, onThemeChange, onClearAll, textColor, isReadingMode, onToggleReadingMode }: SettingsDropdownProps) => {
    const [visible, setVisible] = useState(false);

    const handleOpenLink = (url: string) => {
        Linking.openURL(url);
        setVisible(false);
    };

    const handleClear = () => {
        setVisible(false);
        Alert.alert(
            "Clear Editor?",
            "This will remove all text. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear", style: "destructive", onPress: onClearAll }
            ]
        );
    };

    return (
        <>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setVisible(true)}
            >
                <Settings size={20} color={textColor} />
            </TouchableOpacity>

            <BottomSheet
                visible={visible}
                onClose={() => setVisible(false)}
                title="Settings"
                themeId={themeId}
            >
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
                    <View style={styles.themeGrid}>
                        {THEMES.map(t => (
                            <TouchableOpacity
                                key={t.id}
                                style={[
                                    styles.themeOption,
                                    { backgroundColor: t.bg, borderColor: themeId === t.id ? t.accent : 'transparent' }
                                ]}
                                onPress={() => onThemeChange(t.id)}
                            >
                                <Text style={{ color: t.text, fontSize: 12 }}>{t.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.separator} />



                <TouchableOpacity style={styles.option} onPress={() => handleOpenLink('https://midgenlabs.com/free-tools')}>
                    <Globe size={18} color={textColor} />
                    <Text style={[styles.optionText, { color: textColor }]}>400+ Free Author Tools</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={() => handleOpenLink('https://www.reddit.com/r/AuthorTechStack/')}>
                    <MessageCircle size={18} color={textColor} />
                    <Text style={[styles.optionText, { color: textColor }]}>Join Community</Text>
                </TouchableOpacity>

                <View style={styles.separator} />

                <TouchableOpacity style={[styles.option, styles.destructive]} onPress={handleClear}>
                    <Trash2 size={18} color="#ef4444" />
                    <Text style={[styles.optionText, { color: '#ef4444' }]}>Clear Editor</Text>
                </TouchableOpacity>

            </BottomSheet>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 8,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        opacity: 0.5,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    themeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    themeOption: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 15,
        gap: 15,
        // borderBottomWidth: StyleSheet.hairlineWidth, // Removing border, using explicit separator now
        // borderBottomColor: 'rgba(128,128,128,0.2)',
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(128,128,128,0.1)',
        marginVertical: 10,
    },
    destructive: {
        borderBottomWidth: 0,
        marginTop: 10,
    },
    optionText: {
        fontSize: 16,
    }
});
