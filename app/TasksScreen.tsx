import React, { useState, useEffect, useCallback } from 'react';
import type { JSX } from 'react';
import { View, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TaskList from './TaskList';
import DateRangeFilter from './DateRangeFilter';
import { Colors, Radius, Spacing } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import { fetchTasks } from '../services/tasks';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useSnackbar } from '../context/SnackbarContext';

const Tab = createBottomTabNavigator();

export default function TasksScreen() {
    const { showMessage } = useSnackbar();

    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'due-asc' | 'due-desc'>('newest');

    useFocusEffect(
        useCallback(() => {
            const loadTasks = async () => {
                try {
                    const tasksResponse = await fetchTasks();
                    setTasks(tasksResponse.tasks);
                } catch (error) {
                    console.error('Failed to load tasks:', error);
                    showMessage(
                        'Failed to load tasks. Please try again', 
                        'error'
                    );
                } finally {
                    setLoading(false);
                }
            };
            loadTasks();
        }, [])
    );

    const getSortedTasks = () => {
        return [...tasks].sort((a, b) => {
            switch (sortOption) {
                case 'oldest':
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'due-asc':
                    return (a.due_date ? new Date(a.due_date).getTime(): Infinity) - (b.due_date ? new Date(b.due_date).getTime(): Infinity);
                case 'due-desc':
                    return (b.due_date ? new Date(b.due_date).getTime(): -Infinity) - (a.due_date ? new Date(a.due_date).getTime(): -Infinity);
                case 'newest':
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });
    };

    const toggleTask = async (id: string) => {
        try {
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === id ? { ...task, is_completed: !task.is_completed } : task
                )
            );

            const response = await api.patch(`/api/tasks/toggle/${id}`);

            if (response.status !== 200) {
                throw new Error('Failed to toggle task completion');
            }

            const data = await response.data;

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === data.id
                    ? { ...task, is_completed: data.is_completed }
                    : task
                )
            ); 
        } catch (error) {
            console.error("Error marking task as completed:", error);
            
            setTasks(tasks.map(task =>
                task.id === id ? { ...task, is_completed: !task.is_completed } : task
            ));

            showMessage('Failed to update task status', 'error');
        }
    };

    const deleteTask = async (id: string) => {
        try {
            const response = await api.delete(`/api/tasks/${id}`);

            if (!response.data.success) {
                throw new Error('Failed to delete task');
            }

            const data = await response.data;

            setTasks(prevTasks =>
                prevTasks.filter(task => String(task.id) !== String(id))
            );
        } catch (error) {
            console.error('Failed to delete task:', error);
            showMessage('Failed to delete task.', 'error');
        }
    };

    const renderTab = (filter: string, extraUI?: JSX.Element) => (
        <View style={styles.container}>
            {extraUI}
            {loading ? (
                <ActivityIndicator size="large" color={Colors.blue[600]} />
            ) : (
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder='Search tasks...'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Picker
                        selectedValue={sortOption}
                        onValueChange={(value) => setSortOption(value)}
                        style={styles.sortPicker}
                    >
                        <Picker.Item label='Newest first' value='newest' />
                        <Picker.Item label='Oldest first' value='oldest' />
                        <Picker.Item label='Due date ↑' value='due-asc' />
                        <Picker.Item label='Due date ↓' value='due-desc' />
                    </Picker>
                    <TaskList
                        tasks={getSortedTasks()}
                        onToggleTask={toggleTask}
                        onDeleteTask={deleteTask}
                        filter={filter}
                        startDateFilter={startDateFilter}
                        endDateFilter={endDateFilter}
                        onRefreshTasks={async () => { 
                            try {
                                const tasksResponse = await fetchTasks(); 
                                setTasks(tasksResponse.tasks);
                            } catch (error) {
                                console.error('Failed to refresh tasks', error);
                                showMessage('Failed to refresh tasks', 'error');
                            }
                        }}
                        searchQuery={searchQuery}
                    />
                </View>
            )}
        </View>
    );

    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
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
                headerRight: () => (
                    <Ionicons
                        name='add-circle'
                        size={28}
                        color={Colors.blue[600]}
                        style={{ marginRight: 16 }}
                        onPress={() => navigation.navigate('AddTask')}
                    />
                ),
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
    searchBar: {
        height: 40,
        borderColor: Colors.gray[300],
        borderWidth: 1,
        borderRadius: Radius.md,
        padding: Spacing[2],
        paddingHorizontal: 10,
        marginBottom: Spacing[3],
        backgroundColor: Colors.gray[100],
    },
    sortPicker: {
        marginBottom: Spacing[3],
        backgroundColor: Colors.gray[100],
        borderRadius: Radius.md,
    },
});
