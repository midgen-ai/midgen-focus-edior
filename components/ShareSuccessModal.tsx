
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking, Platform } from 'react-native';
import { X, Check, ExternalLink } from 'lucide-react-native';
import { ThemeId, THEMES } from '../constants/Themes';
import { LinearGradient } from 'expo-linear-gradient';

interface ShareSuccessModalProps {
    visible: boolean;
    onClose: () => void;
    themeId: ThemeId;
}

export const ShareSuccessModal = ({ visible, onClose, themeId }: ShareSuccessModalProps) => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const isLight = themeId === 'light' || themeId === 'sepia';

    const handleVisitReddit = () => {
        Linking.openURL('https://www.reddit.com/r/AuthorTechStack/');
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalcontainer, { backgroundColor: '#1A1A1A', borderColor: '#333', borderWidth: 1 }]}>

                    {/* Header with Gradient */}
                    <LinearGradient
                        colors={['#4F46E5', '#1A1A1A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.headerGradient}
                    >
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={20} color="#fff" style={{ opacity: 0.6 }} />
                        </TouchableOpacity>

                        <View style={styles.successIconContainer}>
                            <View style={styles.successCircle}>
                                <Check size={24} color="#10B981" />
                            </View>
                        </View>
                        <Text style={styles.copiedText}>Link Copied!</Text>
                    </LinearGradient>

                    {/* Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>Share Your Story</Text>
                        <Text style={styles.description}>
                            We'd love to hear about your writing workflow, feedback, or just see what you're working on.
                        </Text>

                        {/* Reddit Button */}
                        <TouchableOpacity style={styles.redditButton} onPress={handleVisitReddit}>
                            <View style={styles.redditIconBg}>
                                {/* Using a simple generic icon or text if logo not available directly from Lucide effectively for branding */}
                                <Text style={{ fontSize: 20 }}>🍊</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.redditButtonTitle}>Join r/AuthorTechStack</Text>
                                <Text style={styles.redditButtonSubtitle}>Submit your story & feedback</Text>
                            </View>
                            <ExternalLink size={20} color="#888" />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} style={styles.laterButton}>
                            <Text style={styles.laterText}>Maybe later</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalcontainer: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 16,
        overflow: 'hidden',
    },
    headerGradient: {
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
    },
    successIconContainer: {
        marginBottom: 10,
    },
    successCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#10B981',
        marginTop: 10,
    },
    copiedText: {
        color: '#10B981',
        fontWeight: '600',
        fontSize: 14,
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    redditButton: {
        flexDirection: 'row',
        backgroundColor: '#262626',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#333',
        marginBottom: 16,
    },
    redditIconBg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF4500', // Reddit orange-ish
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    redditButtonTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
    redditButtonSubtitle: {
        color: '#888',
        fontSize: 12,
        marginTop: 2,
    },
    laterButton: {
        padding: 8,
    },
    laterText: {
        color: '#666',
        fontSize: 13,
    }
});
