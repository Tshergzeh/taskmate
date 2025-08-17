import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSizes, Radius, Spacing } from '../theme';

type Task = {
    id: string;
    title: string;
    description?: string;
    is_completed: boolean;
    due_date?: string;
};

type TaskListProps = {
    tasks: Task[];
    onToggleTask: (id: string) => void;
    onDeleteTask: (id: string) => void;
    filter: string;
    startDateFilter?: string;
    endDateFilter?: string;
    onRefreshTasks: () => Promise<void>;
};

export default function TaskList({ 
    tasks, 
    onToggleTask, 
    onDeleteTask, 
    filter, 
    startDateFilter, 
    endDateFilter,
    onRefreshTasks,
}: TaskListProps) {
    const [refreshing, setRefreshing] = useState(false);

    let filteredTasks = tasks;

    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.is_completed);
    }
    if (filter === 'incomplete') {
        filteredTasks = tasks.filter(task => !task.is_completed);
    }
    if (filter === 'date-range' && startDateFilter && endDateFilter) {
        filteredTasks = tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDueDate = new Date(task.due_date);
            return (
                taskDueDate >= new Date(startDateFilter) &&
                taskDueDate <= new Date(endDateFilter)
            );
        });
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        await onRefreshTasks();
        setRefreshing(false);
    }

    return (
        <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item?.id?.toString() ?? Math.random().toString()}
            renderItem={({ item }) => (
                <View style={styles.taskItem}>
                    <TouchableOpacity 
                        onPress={() => onToggleTask(item.id)}
                        style={{ flex: 1 }}
                    >
                        <Text style={{
                            fontSize: FontSizes.md,
                            textDecorationLine: item.is_completed ? 'line-through' : 'none',
                        }}>
                            {item.title}
                        </Text>

                        {item.description ? (
                            <Text style={styles.description}>
                                {item.description}
                            </Text>
                        ) : null}

                        {item.due_date ? (
                            <Text style={styles.due_date}>
                                Due: {new Date(item.due_date).toLocaleDateString()}
                            </Text>
                        ) : null}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDeleteTask(item.id)}>
                        <Text style={styles.deleteButton}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
            refreshing={refreshing}
            onRefresh={handleRefresh}
        />
    );
}

const styles = StyleSheet.create({
    taskItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.gray[100],
        padding: Spacing[3],
        marginBottom: Spacing[2],
        borderRadius: Radius.lg,
    },
    description: {
        fontSize: FontSizes.sm,
        color: Colors.gray[600],
        marginTop: Spacing[1],
    },
    due_date: {
        fontSize: FontSizes.sm,
        color: Colors.blue[600],
        marginTop: Spacing[1],
    },
    deleteButton: {
        color: Colors.red[500],
    },
});
