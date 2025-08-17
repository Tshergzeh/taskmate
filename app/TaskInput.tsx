import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, FontSizes, Radius, Spacing } from '../theme';

type TaskInputProps = {
    newTask: string;
    setNewTask: (task: string) => void;
    newTaskDescription: string;
    setNewTaskDescription: (description: string) => void;
    dueDate: string;
    setDueDate: (text: string) => void;
    onAdd: () => void;
};

export default function TaskInput({ newTask, setNewTask, newTaskDescription, setNewTaskDescription, dueDate, setDueDate, onAdd }: TaskInputProps) {
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const handleDateChange = (_: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDueDate(selectedDate.toISOString().split('T')[0]); // Format to YYYY-MM-DD
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.taskInput}
                placeholder='Task title...'
                value={newTask}
                onChangeText={setNewTask}
            />

            <TextInput
                style={[styles.taskInput, styles.multilineInput]}
                placeholder="Task description (optional)"
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                multiline
            />

            <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.dateText}>
                    {dueDate ? `Due: ${dueDate}` : 'Select due date'}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={dueDate ? new Date(dueDate) : new Date()}
                    mode='date'
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                />
            )}

            <TouchableOpacity onPress={onAdd} style={styles.addTaskButton}>
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing[4],
    },
    taskInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        marginBottom: Spacing[3],
        padding: Spacing[3],
    },
    multilineInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    dateInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        marginBottom: Spacing[3],
        padding: Spacing[3],
        justifyContent: 'center',
        backgroundColor: Colors.gray[100],
    },
    dateText: {
        color: Colors.placeholder,
    },
    addTaskButton: {
        backgroundColor: Colors.green[500],
        paddingHorizontal: Spacing[4],
        borderRadius: Radius.md,
        alignItems: 'center',
        padding: Spacing[2],
    },
    buttonText: {
        color: Colors.buttonText,
        fontWeight: 'bold',
        fontSize: FontSizes.md,
    },
});
