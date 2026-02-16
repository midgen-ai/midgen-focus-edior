import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';
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
    const webviewRef = useRef<WebView>(null);
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

    useImperativeHandle(ref, () => ({
        toggleBold: () => sendCommand('bold'),
        toggleItalic: () => sendCommand('italic'),
        toggleHeading: () => sendCommand('formatBlock', 'H1'),
    }));

    const sendCommand = (command: string, value: string | null = null) => {
        webviewRef.current?.injectJavaScript(`
            document.execCommand('${command}', false, ${value ? `'${value}'` : null});
            true;
        `);
    };

    const htmlContent = React.useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
        <style>
            body {
                background-color: ${theme.bg};
                color: ${theme.text};
                font-family: 'Inter', sans-serif;
                font-size: 18px;
                line-height: 1.6;
                margin: 0;
                height: 100vh;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                padding: 20px;
            }
            #editor {
                flex: 1;
                outline: none;
                width: 100%;
                white-space: pre-wrap;
            }
            #editor:empty::before {
                content: 'Just write...';
                color: ${theme.text}40;
                pointer-events: none;
                display: block;
            }
            h1, h2, h3, h4, h5, h6 {
                font-family: 'Bricolage Grotesque', sans-serif;
                font-weight: 600;
                margin-top: 1.25em;
                margin-bottom: 0.5em;
                line-height: 1.3;
            }
            h1 { font-size: 1.6em; }
            h2 { font-size: 1.4em; }
            h3 { font-size: 1.25em; }
            h4 { font-size: 1.1em; }
            h5 { font-size: 1em; }
            h6 { font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.05em; }
        </style>
    </head>
    <body>
        <div id="editor" contenteditable="${!isReadingMode}">${initialContent}</div>
        <script>
            const editor = document.getElementById('editor');

            // Forward content changes
            editor.addEventListener('input', () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'CHANGE',
                    content: editor.innerHTML // Use innerText for plain text or innerHTML for rich
                    // The App expects simple text? The web version uses plain text mostly but mentions rich text.
                    // If we want markdown/rich text, innerHTML is better but requires parsing.
                    // Let's use innerHTML to be safe for now, or innerText if we want plain.
                    // Focus Editor usually is plain text with markdown support?
                    // The web version has "WritingEditor".
                    // Let's stick to innerHTML for now as it preserves structure.
                }));
            });

            // Selection change detection
            document.addEventListener('selectionchange', () => {
                const selection = window.getSelection();
                const hasSelection = selection.toString().length > 0;
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'SELECTION',
                    hasSelection: hasSelection
                }));
            });
        </script>
    </body>
    </html>
    `, [theme, isReadingMode]); // initialContent is intentionally excluded to prevent reload on typing

    useEffect(() => {
        webviewRef.current?.injectJavaScript(`
            document.body.style.backgroundColor = '${theme.bg}';
            document.body.style.color = '${theme.text}';
            document.getElementById('editor').contentEditable = ${!isReadingMode};
            true;
        `);
    }, [theme, isReadingMode]);

    return (
        <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{ html: htmlContent, baseUrl: '' }}
            style={{ flex: 1, backgroundColor: theme.bg }}
            onMessage={(event) => {
                try {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === 'CHANGE') {
                        onChange(data.content);
                    } else if (data.type === 'SELECTION') {
                        onSelectionChange(data.hasSelection);
                    }
                } catch (e) {
                    // ignore
                }
            }}
            keyboardDisplayRequiresUserAction={false}
            hideKeyboardAccessoryView={true}
            textInteractionEnabled={true}
        />
    );
});
