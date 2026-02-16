
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { ThemeId } from '../constants/Themes';

interface GoalSetterProps {
    currentGoal: number;
    onGoalChange: (goal: number) => void;
    themeId: ThemeId;
    textColor: string;
}

export const GoalSetter = ({ currentGoal, onGoalChange, themeId, textColor }: GoalSetterProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [tempGoal, setTempGoal] = useState(currentGoal.toString());

    const handleSave = () => {
        const parsed = parseInt(tempGoal, 10);
        if (!isNaN(parsed) && parsed > 0) {
            onGoalChange(parsed);
        }
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={[styles.goalText, { color: textColor }]}> / {currentGoal} words</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Set Word Goal</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="number-pad"
                            value={tempGoal}
                            onChangeText={setTempGoal}
                            autoFocus
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    goalText: {
        fontSize: 12,
        opacity: 0.5,
        color: '#fff',
        // Color will be overridden by parent styles usually, 
        // but here we keep it simple white/opacity as it's often on dark bg in current design
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#333',
        color: 'white',
        width: '100%',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 15,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#aaa',
    },
    saveButton: {
        backgroundColor: '#a855f7',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
