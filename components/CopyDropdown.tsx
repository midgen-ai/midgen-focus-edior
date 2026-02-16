
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Copy } from 'lucide-react-native';
import { ThemeId } from '../constants/Themes';
import { BottomSheet } from './BottomSheet';

interface CopyDropdownProps {
    content: string;
    themeId: ThemeId;
    textColor: string;
}

export const CopyDropdown = ({ content, themeId, textColor }: CopyDropdownProps) => {
    const [visible, setVisible] = useState(false);

    const handleCopy = async (type: 'text' | 'markdown' | 'html') => {
        let textToCopy = content;
        // Mobile version simple implementation: 
        // We assume content is currently plain text in TextInput.
        // If we implement markdown support later, we'd convert here.
        // For now, text/markdown are effectively same source.

        if (type === 'html') {
            // Very basic conversion just for example
            textToCopy = `<div>${content.replace(/\n/g, '<br>')}</div>`;
        }

        try {
            await Clipboard.setStringAsync(textToCopy);
            setVisible(false);

            // On Electron/Web, Alert.alert might be blocking or behave oddly. 
            // For now, we rely on it but ensure the state is closed first.
            // We could also consider a Toast if we had one.
            if (Platform.OS === 'web') {
                // setTimeout to allow UI to update before alert blocks
                setTimeout(() => {
                    window.alert(`${type === 'text' ? 'Plain text' : type} copied to clipboard.`);
                }, 100);
            } else {
                Alert.alert("Copied!", `${type === 'text' ? 'Plain text' : type} copied to clipboard.`);
            }
        } catch (e) {
            console.error("Copy failed", e);
            Alert.alert("Error", "Failed to copy to clipboard.");
        }
    };

    return (
        <>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setVisible(true)}
            >
                <Copy size={20} color={textColor} />
            </TouchableOpacity>

            <BottomSheet
                visible={visible}
                onClose={() => setVisible(false)}
                title="Copy Content"
                themeId={themeId}
            >
                <TouchableOpacity style={styles.option} onPress={() => handleCopy('text')}>
                    <Text style={[styles.optionText, { color: textColor }]}>Copy as Text</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => handleCopy('markdown')}>
                    <Text style={[styles.optionText, { color: textColor }]}>Copy as Markdown</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option} onPress={() => handleCopy('html')}>
                    <Text style={[styles.optionText, { color: textColor }]}>Copy as HTML</Text>
                </TouchableOpacity>
            </BottomSheet>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 8,
    },
    option: {
        paddingVertical: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(128,128,128,0.2)',
    },
    optionText: {
        fontSize: 16,
    }
});
