
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeId } from '../constants/Themes';
import { GoalSetter } from './GoalSetter';

interface GoalProgressProps {
    currentWords: number;
    goal: number;
    onGoalChange: (goal: number) => void;
    themeId: ThemeId;
    style?: any;
}

export const GoalProgress = ({ currentWords, goal, onGoalChange, themeId, style }: GoalProgressProps) => {
    // Calculate percentage capped at 100
    const percentage = Math.min(100, Math.max(0, (currentWords / goal) * 100));

    // Determine colors based on theme but keeping the "pill" look generally consistent
    const isLight = themeId === 'light' || themeId === 'sepia';
    const textColor = isLight ? '#000' : '#fff';
    const bgColor = isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
    const barColor = 'rgba(168, 85, 247, 0.3)'; // Purple-ish

    return (
        <View style={[styles.container, { backgroundColor: bgColor }, style]}>
            {/* Background Bar */}
            <View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: barColor,
                        width: `${percentage}%`,
                        borderRadius: 15,
                    }
                ]}
            />

            <View style={styles.content}>
                <Text style={[styles.wordCount, { color: textColor }]}>
                    {currentWords}
                </Text>

                <GoalSetter
                    currentGoal={goal}
                    onGoalChange={onGoalChange}
                    themeId={themeId}
                    textColor={textColor}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        height: 36,
        justifyContent: 'center',
        minWidth: 120,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'center',
        zIndex: 1,
    },
    wordCount: {
        fontWeight: '600',
        fontSize: 14,
    }
});
