
import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { THEMES, ThemeId } from "../constants/Themes";

interface FocusModeAnimationsProps {
    isWriting: boolean;
    isGoalReached: boolean;
    isIdle: boolean;
    themeId: ThemeId;
    style?: any;
}

const IDLE_MESSAGES = ["Rent is due.", "My bowl is empty.", "Block is for dogs.", "Zzz... typos...", "I judge in silence.", "Netflix isn't writing.", "Are we giving up?"];
const WRITING_MESSAGES = ["Keyboard go brrr.", "Make me famous.", "Is that a typo?", "Work harder, human.", "Feed me words.", "Main character energy.", "Keep cooking."];
const GOAL_MESSAGES = ["Kibble secured.", "We rich?", "Nap achieved.", "Finally.", "Human did good.", "Treat time."];

export const FocusModeAnimations = ({ isWriting, isGoalReached, isIdle, themeId, style }: FocusModeAnimationsProps) => {
    const animationRef = useRef<LottieView>(null);
    const [message, setMessage] = useState("");
    const [opacity, setOpacity] = useState(0);
    const [source, setSource] = useState<any>(null);

    // Dynamic text color based on theme
    const getTextColor = () => {
        switch (themeId) {
            case 'light': // Paper
                return '#6b7280'; // gray-500
            case 'sepia': // Coffee
                return '#5c4b37'; // brown
            case 'dark': // Midnight
            case 'navy': // Deep Sea
            default:
                return 'rgba(255, 255, 255, 0.4)';
        }
    };

    useEffect(() => {
        let newSource;
        let newMessage = "";
        const showMessage = Math.random() < 0.3; // 30% chance to show a message

        if (isGoalReached) {
            newSource = require('../assets/lottie/laugh-cat.json');
            newMessage = GOAL_MESSAGES[Math.floor(Math.random() * GOAL_MESSAGES.length)];
        } else if (isIdle) {
            newSource = require('../assets/lottie/sleep-cat.json');
            if (showMessage) {
                newMessage = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
            }
        } else {
            newSource = require('../assets/lottie/happy-cat.json');
            // Check if source changed from sleep to writing to trigger message
            if (showMessage) {
                newMessage = WRITING_MESSAGES[Math.floor(Math.random() * WRITING_MESSAGES.length)];
            }
        }

        setSource(newSource);

        // Simple message update logic 
        if (newMessage && newMessage !== message) {
            // In RN simple state update is enough for opacity transition if we use Reanimated, 
            // but here we just swap text.
            setMessage(newMessage);
            setOpacity(1);

            // Auto hide message after 3 seconds
            setTimeout(() => setOpacity(0), 4000);
        } else if (!newMessage) {
            setOpacity(0);
        }

        if (animationRef.current) {
            animationRef.current.play();
        }

    }, [isWriting, isGoalReached, isIdle]);

    if (!source) return null;

    return (
        <View style={[styles.container, style]}>
            <Text
                style={[
                    styles.message,
                    { color: getTextColor(), opacity }
                ]}
            >
                {message}
            </Text>
            <LottieView
                ref={animationRef}
                source={source}
                autoPlay
                loop
                style={styles.lottie}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    message: {
        position: 'absolute',
        top: -10,
        fontSize: 10,
        fontFamily: 'Inter_500Medium',
        textAlign: 'center',
        width: 150,
    }
});
