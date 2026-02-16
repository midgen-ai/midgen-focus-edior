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

    // Initial Content Logic: Set H1 if empty
    useEffect(() => {
        if (editorRef.current) {
            const hasContent = initialContent && initialContent !== '<br>' && initialContent.trim() !== '';

            if (!hasContent && !internalUpdate.current) {
                // If strictly empty, initialize with H1
                editorRef.current.innerHTML = '<h1><br></h1>';
            } else if (!internalUpdate.current && initialContent !== editorRef.current.innerHTML) {
                editorRef.current.innerHTML = initialContent;
            }
        }
        internalUpdate.current = false;
    }, [initialContent]);

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
                top: rect.top - 60, // Position above the selection
                left: rect.left + (rect.width / 2) - 100 // Center horizontally
            });
            onSelectionChange(true);
        } else {
            setToolbarVisible(false);
            onSelectionChange(true);
        }
    };

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const anchorNode = selection.anchorNode;
            // Check if we are inside a Heading
            const parentBlock = anchorNode?.nodeType === Node.TEXT_NODE
                ? anchorNode.parentElement
                : anchorNode as HTMLElement;

            const closestBlock = parentBlock?.closest('h1, h2, h3, h4, h5, h6, p, div');

            if (closestBlock && /^H[1-6]$/.test(closestBlock.tagName)) {
                // If inside a heading, prevents default handling (which usually duplicates the header)
                // and explicitly inserts a paragraph for the new line
                e.preventDefault();
                // Inserting a paragraph
                document.execCommand('insertParagraph', false);
                // Ensuring the new block is a Paragraph, not a Heading
                document.execCommand('formatBlock', false, 'P');
            }
        }
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
        e.stopPropagation();
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
                    font-family: 'Bricolage Grotesque', sans-serif;
                    font-weight: 600;
                    margin-top: 1.25em;
                    margin-bottom: 0.5em;
                    line-height: 1.3;
                }
                #web-editor h1 { font-size: 1.6em; }
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
                <div style={{
                    position: 'fixed' as any,
                    top: toolbarPosition.top,
                    left: toolbarPosition.left,
                    backgroundColor: theme.bg,
                    borderColor: theme.text + '20',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 5,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    gap: 5,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    cursor: 'pointer',
                    userSelect: 'none',
                }}
                    onMouseDown={preventBlur}
                >
                    <div
                        onClick={() => document.execCommand('formatBlock', false, 'H1')}
                        style={{ ...styles.webToolbarBtn, color: theme.text, fontWeight: 'bold' }}
                    >
                        H1
                    </div>
                    <div
                        onClick={() => document.execCommand('formatBlock', false, 'P')}
                        style={{ ...styles.webToolbarBtn, color: theme.text }}
                    >
                        P
                    </div>
                    <div style={{ width: 1, height: 20, backgroundColor: theme.text + '20' }} />
                    <div
                        onClick={() => document.execCommand('bold', false)}
                        style={{ ...styles.webToolbarBtn, color: theme.text, fontWeight: 'bold' }}
                    >
                        B
                    </div>
                    <div
                        onClick={() => document.execCommand('italic', false)}
                        style={{ ...styles.webToolbarBtn, color: theme.text, fontStyle: 'italic' }}
                    >
                        I
                    </div>
                </div>
            )}

        </View>
    );
});

const styles: any = {
    container: {
        flex: 1,
        height: '100%',
    },
    // CSS-in-JS style object for web div usage
    webToolbarBtn: {
        padding: '5px 10px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};
