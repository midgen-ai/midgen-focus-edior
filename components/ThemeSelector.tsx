
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { THEMES, ThemeType, ThemeId } from '../constants/Themes';

interface ThemeSelectorProps {
    currentTheme: ThemeId;
    onSelect: (themeId: ThemeId) => void;
}

export const ThemeSelector = ({ currentTheme, onSelect }: ThemeSelectorProps) => {
    return (
        <View style={styles.container}>
            {THEMES.map((theme) => (
                <TouchableOpacity
                    key={theme.id}
                    onPress={() => onSelect(theme.id)}
                    style={[
                        styles.bubble,
                        { backgroundColor: theme.bg, borderColor: theme.accent },
                        currentTheme === theme.id && styles.active
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 12,
        padding: 8,
    },
    bubble: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    active: {
        borderWidth: 2,
        transform: [{ scale: 1.1 }]
    }
});
