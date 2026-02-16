import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions, Text, TouchableOpacity } from 'react-native';
import { ThemeId, THEMES } from '../constants/Themes';

interface RichEditorProps {
    themeId: ThemeId;
    initialContent: string;
    onChange: (content: string) => void;
    onSelectionChange: (hasSelection: boolean) => void;
    isReadingMode: boolean;
}

export interface RichEditorRef {
    toggleBold: () => void;
    toggleItalic: () => void;
    toggleHeading: () => void;
}

export const RichEditor = forwardRef<RichEditorRef, RichEditorProps>(({ themeId, initialContent, onChange, onSelectionChange, isReadingMode }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const internalUpdate = useRef(false);

    // Responsive Width Logic
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    const editorWidth = isDesktop ? '70%' : '95%';

    const [toolbarVisible, setToolbarVisible] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);

    // Floating Tooltip Logic
    const checkSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.toString().length === 0) {
            setToolbarVisible(false);
            onSelectionChange(false);
            return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (isDesktop && !isReadingMode) {
            setToolbarVisible(true);
            setToolbarPosition({
                top: rect.top - 60, // Position above the selection (adjusted for toolbar height)
                left: rect.left + (rect.width / 2) - 100 // Center horizontally (assuming toolbar width ~200)
            });
            onSelectionChange(true);
        } else {
            setToolbarVisible(false);
            onSelectionChange(true);
        }
    };



    // Sync external content changes only if they are not from local input
    useEffect(() => {
        if (editorRef.current && !internalUpdate.current && initialContent !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = initialContent;
        }
        internalUpdate.current = false;
    }, [initialContent]);

    useImperativeHandle(ref, () => ({
        toggleBold: () => {
            document.execCommand('bold', false);
            editorRef.current?.focus();
            checkSelection();
        },
        toggleItalic: () => {
            document.execCommand('italic', false);
            editorRef.current?.focus();
            checkSelection();
        },
        toggleHeading: () => {
            document.execCommand('formatBlock', false, 'H1');
            editorRef.current?.focus();
            checkSelection();
        },
    }));



    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.innerHTML;
        internalUpdate.current = true;
        onChange(newContent);
    };

    useEffect(() => {
        const handleSelectionChange = () => {
            checkSelection();
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    // Update content if initialContent changes drastically (optional, usually handled by internal state)
    // For a simple editor, we might not want to reset content on every prop change to avoid cursor jumps.

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@400;600&display=swap');
                
    // Set default content to H1 if empty
    useEffect(() => {
        if (editorRef.current && (!initialContent || initialContent === '<br>')) {
             // Only set if strictly empty or just a break, and no internal update pending
             if (!internalUpdate.current) {
                editorRef.current.innerHTML = '<h1><br></h1>';
             }
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const anchorNode = selection.anchorNode;
            const parentBlock = anchorNode?.parentElement?.closest('h1, h2, h3, h4, h5, h6, p, div');
            
            if (parentBlock && /^H[1-6]$/.test(parentBlock.tagName)) {
                // If inside a heading, prevents default handling usually duplicating the header
                // and explicitly inserts a paragraph
                e.preventDefault();
                document.execCommand('insertParagraph', false);
                document.execCommand('formatBlock', false, 'P');
            }
        }
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const newContent = e.currentTarget.innerHTML;
        internalUpdate.current = true;
        onChange(newContent);
        // We might want to check if it became empty and restore H1, 
        // but user might intentionally delete everything.
    };

    useEffect(() => {
        const handleSelectionChange = () => {
            checkSelection();
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    const preventBlur = (e: any) => {
        e.preventDefault();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.bg }]}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@400;600&display=swap');

                [contenteditable]:empty:before {
                    content: 'Title...';
                color: ${theme.text}40;
                display: block;
                font-size: 1.6em;
                font-family: 'Bricolage Grotesque', sans-serif;
                font-weight: 600;
                margin-top: 1.25em;
                }

                #web-editor h1, #web-editor h2, #web-editor h3 {
                    font - family: 'Bricolage Grotesque', sans-serif;
                font-weight: 600;
                margin-top: 1.25em;
                margin-bottom: 0.5em;
                line-height: 1.3;
                }
                #web-editor h1 {font - size: 1.6em; }
                `}
            </style>
            <div
                id="web-editor"
                ref={editorRef}
                contentEditable={!isReadingMode}
                suppressContentEditableWarning
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                style={{
                    flex: 1,
                    outline: 'none',
                    width: editorWidth,
                    maxWidth: '800px', // Limit max width for better readability on huge screens
                    height: '100%',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '18px',
                    lineHeight: '1.6',
                    color: theme.text,
                    whiteSpace: 'pre-wrap',
                    overflowY: 'auto',
                    margin: '0 auto', // Center the editor
                    paddingBottom: '100px',
                }}
            />
            {/* Floating Tooltip Toolbar */}
            {toolbarVisible && toolbarPosition && (
                <View style={[
                    styles.floatingToolbar,
                    {
                        top: toolbarPosition.top,
                        left: toolbarPosition.left,
                        backgroundColor: theme.bg,
                        borderColor: theme.text + '20'
                    }
                ]}>
                    <TouchableOpacity
                        onPress={() => document.execCommand('formatBlock', false, 'H1')}
                        style={styles.toolbarBtn}
                        onMouseDown={preventBlur} // Critical for Web
                    >
                        <Text style={{ color: theme.text, fontWeight: 'bold' }}>H1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => document.execCommand('formatBlock', false, 'P')}
                        style={styles.toolbarBtn}
                        onMouseDown={preventBlur}
                    >
                        <Text style={{ color: theme.text }}>P</Text>
                    </TouchableOpacity>
                    <View style={{ width: 1, height: 20, backgroundColor: theme.text + '20' }} />
                    <TouchableOpacity
                        onPress={() => document.execCommand('bold', false)}
                        style={styles.toolbarBtn}
                        onMouseDown={preventBlur}
                    >
                        <Text style={{ color: theme.text, fontWeight: 'bold' }}>B</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => document.execCommand('italic', false)}
                        style={styles.toolbarBtn}
                        onMouseDown={preventBlur}
                    >
                        <Text style={{ color: theme.text, fontStyle: 'italic' }}>I</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%', // Ensure it takes full height
    },
    floatingToolbar: {
        position: 'fixed' as any, // Use fixed positioning on web to match getBoundingClientRect
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        gap: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
        cursor: 'pointer', // Ensure cursor indicates clickable
        userSelect: 'none', // Prevent selection of toolbar text
    },
    toolbarBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        cursor: 'pointer',
    }
});
