import React, {useState} from 'react';
import { View, StyleSheet, Alert } from 'react-native'
import TaskInput from './TaskInput';
import { createTask } from '../services/tasks';
import { Colors, Spacing } from '../theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

export default function AddTaskScreen({ navigation }: Props) {
    const [newTask, setNewTask] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [due_date, setDueDate] = useState('');

    const handleAddTask = async () => {
        if (!newTask) {
            Alert.alert('Validation', 'Please enter a task title.');
            return;
        }

        try {
            await createTask({
                title: newTask,
                description: newTaskDescription || undefined,
                is_completed: false,
                due_date: due_date || undefined,
            });
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to add task.');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <TaskInput
                newTask={newTask}
                setNewTask={setNewTask}
                newTaskDescription={newTaskDescription}
                setNewTaskDescription={setNewTaskDescription}
                due_date={due_date}
                setDueDate={setDueDate}
                onAdd={handleAddTask}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray[50],
        padding: Spacing[4],
    },
});
