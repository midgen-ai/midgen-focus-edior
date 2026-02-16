
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, InputAccessoryView, useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES, ThemeId } from '../constants/Themes';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormattingToolbar } from './FormattingToolbar';
import { RichEditor, RichEditorRef } from './RichEditor';

export interface EditorProps {
    themeId: ThemeId;
    content: string;
    setContent: (text: string) => void;
    setIsIdle: (isIdle: boolean) => void;
    setLastInputTime: (time: number) => void;
    isReadingMode: boolean;
}

const STORAGE_KEY = 'focus_editor_content';

export const Editor = ({ themeId, content, setContent, setIsIdle, setLastInputTime, isReadingMode }: EditorProps) => {
    // const [isLoaded, setIsLoaded] = useState(false);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const insets = useSafeAreaInsets();
    const timeoutRef = useRef<any>(null);
    const richEditorRef = useRef<RichEditorRef>(null);
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;



    const handleCommand = (command: 'heading' | 'bold' | 'italic') => {
        if (!richEditorRef.current) return;
        switch (command) {
            case 'heading': richEditorRef.current.toggleHeading(); break;
            case 'bold': richEditorRef.current.toggleBold(); break;
            case 'italic': richEditorRef.current.toggleItalic(); break;
        }
    };

    const handleChange = (text: string) => {
        setContent(text);
        setIsIdle(false);
        setLastInputTime(Date.now());

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, text);
            } catch (e) {
                console.error('Failed to save content', e);
            }
        }, 1000);
    };

    // if (!isLoaded) return null;

    const hasSelection = selection.start !== selection.end; // Note: This state is now updated by RichEditor

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View style={[styles.container, { paddingTop: 20, paddingBottom: insets.bottom + 80 }]}>
                <RichEditor
                    ref={richEditorRef}
                    themeId={themeId}
                    initialContent={content}
                    onChange={handleChange}
                    onSelectionChange={(hasSel) => setSelection(hasSel ? { start: 1, end: 2 } : { start: 0, end: 0 })}
                    isReadingMode={isReadingMode}
                />
            </View>

            {!isReadingMode && hasSelection && !isDesktop && (
                <FormattingToolbar themeId={themeId} onCommand={handleCommand} />
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
});
