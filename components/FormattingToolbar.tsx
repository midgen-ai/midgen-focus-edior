import React from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard, Text } from 'react-native';
import { Bold, Italic, Heading1 } from 'lucide-react-native';
import { ThemeId, THEMES } from '../constants/Themes';

interface FormattingToolbarProps {
    themeId: ThemeId;
    onCommand: (command: 'heading' | 'bold' | 'italic') => void;
}

export const FormattingToolbar = ({ themeId, onCommand }: FormattingToolbarProps) => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

    return (
        <View style={[styles.container, { backgroundColor: theme.bg, borderColor: theme.text + '10' }]}>
            <TouchableOpacity style={styles.button} onPress={() => onCommand('heading')}>
                <Heading1 size={20} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => onCommand('bold')}>
                <Bold size={20} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => onCommand('italic')}>
                <Italic size={20} color={theme.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => Keyboard.dismiss()}>
                <Text style={{ color: theme.text, fontWeight: 'bold' }}>Done</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
    },
    button: {
        padding: 10,
    }
});
