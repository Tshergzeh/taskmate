import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TaskList from './TaskList';
import TaskInput from './TaskInput';
import DateRangeFilter from './DateRangeFilter';
import { Colors, Spacing } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { createTask, fetchTasks } from '../services/tasks';

const Tab = createBottomTabNavigator();

export default function TasksScreen() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [due_date, setDueDate] = useState('');
    const [filter, setFilter] = useState('all');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const tasksResponse = await fetchTasks();
                setTasks(tasksResponse.tasks);
            } catch (error) {
                console.error('Failed to load tasks:', error);
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, []);

    const addTask = async () => {
        if (!newTask) return;
        
        try {
            const taskToCreate = {
                title: newTask,
                description: newTaskDescription || undefined,
                completed: false,
                due_date: due_date || undefined,
            };

            const createdTask = await createTask(taskToCreate);
            const savedTask = createdTask.data
            
            setTasks([savedTask, ...tasks]);

            setNewTask('');
            setNewTaskDescription('');
            setDueDate('');
        } catch (error) {
            console.error('Failed to add task:', error);
        }
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const renderTab = (filter: string, extraUI?: JSX.Element) => (
        <View style={styles.container}>
            <TaskInput
                newTask={newTask}
                setNewTask={setNewTask}
                newTaskDescription={newTaskDescription}
                setNewTaskDescription={setNewTaskDescription}
                due_date={due_date}
                setDueDate={setDueDate}
                onAdd={addTask}
            />
            {extraUI}
            {loading ? (
                <ActivityIndicator size="large" color={Colors.blue[600]} />
            ) : (
                <TaskList
                    tasks={tasks}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    filter={filter}
                    startDateFilter={startDateFilter}
                    endDateFilter={endDateFilter}
                />
            )}
        </View>
    );

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'list-outline';

                    if (route.name === 'All') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Completed') {
                        iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
                    } else if (route.name === 'Incomplete') {
                        iconName = focused ? 'close-circle' : 'close-circle-outline';
                    } else if (route.name === 'By Date Range') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Colors.blue[600],
                tabBarInactiveTintColor: Colors.gray[500],
                headerShown: false,
            })}
        >
            <Tab.Screen name='All'>
                {() => renderTab('all')}
            </Tab.Screen>
            <Tab.Screen name='Completed'>
                {() => renderTab('completed')}
            </Tab.Screen>
            <Tab.Screen name='Incomplete'>
                {() => renderTab('incomplete')}
            </Tab.Screen>
            <Tab.Screen name='By Date Range'>
                {() => renderTab(
                    'date-range',
                    <DateRangeFilter
                        startDate={startDateFilter}
                        setStartDate={setStartDateFilter}
                        endDate={endDateFilter}
                        setEndDate={setEndDateFilter}
                    />
                )
                }
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing[4],
        backgroundColor: Colors.gray[50],
    },
});
