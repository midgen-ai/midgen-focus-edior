
import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback, useWindowDimensions, Platform } from 'react-native';
import { THEMES, ThemeId } from '../constants/Themes';

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    themeId: ThemeId;
}

export const BottomSheet = ({ visible, onClose, title, children, themeId }: BottomSheetProps) => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const isLight = themeId === 'light' || themeId === 'sepia';
    const bgColor = isLight ? '#fff' : '#1a1a1a';
    const textColor = isLight ? '#000' : '#fff';
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;

    return (
        <Modal
            animationType={isDesktop ? "fade" : "slide"}
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.overlay, isDesktop && styles.desktopOverlay]}>
                    <TouchableWithoutFeedback>
                        <View style={[
                            styles.sheet,
                            { backgroundColor: bgColor },
                            isDesktop && styles.desktopSheet
                        ]}>
                            {!isDesktop && <View style={styles.handle} />}
                            {title && (
                                <Text style={[styles.title, { color: textColor }]}>{title}</Text>
                            )}
                            <View style={styles.content}>
                                {children}
                            </View>
                            {!isDesktop && <SafeAreaView />}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    desktopOverlay: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 20,
        minHeight: 200,
    },
    desktopSheet: {
        width: 400,
        maxWidth: '90%',
        borderRadius: 20, // All corners rounded on desktop
        minHeight: 0, // content based height
        paddingBottom: 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(128,128,128,0.4)',
        alignSelf: 'center',
        borderRadius: 2,
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    content: {
        gap: 10,
    }
});
