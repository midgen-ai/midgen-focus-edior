
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Platform, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Share2 } from 'lucide-react-native';
import { ThemeId } from '../constants/Themes';
import { generateShareUrl } from '../utils/urlState';
import { ShareSuccessModal } from './ShareSuccessModal';

interface ShareButtonProps {
    themeId: ThemeId;
    textColor: string;
    content: string;
}

export const ShareButton = ({ themeId, textColor, content }: ShareButtonProps) => {

    const [modalVisible, setModalVisible] = useState(false);

    const handleShare = async () => {
        const url = generateShareUrl(content);
        try {
            // Check if Web Share API is available (for mobile web or supported desktop)
            if (Platform.OS === 'web' && !navigator.share) {
                // Fallback for Desktop/Web without Share API
                await Clipboard.setStringAsync(url);
                setModalVisible(true);
            } else {
                // Native Mobile or Web with Share API
                await Share.share({
                    message: `Check out my writing on Focus Editor: ${url}`,
                    url: url, // iOS
                    title: 'Midgen Focus Editor' // Android
                });
            }
        } catch (error) {
            console.error("Share failed:", error);
            // Fallback if Share.share fails unexpectedly
            try {
                await Clipboard.setStringAsync(url);
                setModalVisible(true);
            } catch (copyError) {
                Alert.alert("Error", "Could not share or copy link.");
            }
        }
    };

    return (
        <>
            <TouchableOpacity
                style={styles.button}
                onPress={handleShare}
            >
                <Share2 size={20} color={textColor} />
            </TouchableOpacity>

            <ShareSuccessModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                themeId={themeId}
            />
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 8,
    }
});
