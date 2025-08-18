import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './app/Login';
import TasksScreen from './app/TasksScreen';
import AddTaskScreen from './app/AddTaskScreen';
import { FontSizes, Spacing } from './theme';

export type RootStackParamList = {
  Login: undefined;
  Tasks: { filter?: string } | undefined;
  AddTask: undefined;
};

class AppErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean, error?: Error }
> {
    state = { hasError: false, error: undefined as Error | undefined };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log('Error caught in AppErrorBoundary: ', error, errorInfo);
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.errorText}>
                        Something went wrong.
                    </Text>
                    <Text style={styles.errorText}>{this.state.error?.message}</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <AppErrorBoundary>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen 
                        name="Login" 
                        component={LoginScreen} 
                        options={{ title: 'Login' }}
                    />
                    <Stack.Screen 
                        name="Tasks" 
                        component={TasksScreen}
                        options={{ title: 'Tasks' }}
                    />
                    <Stack.Screen
                        name='AddTask'
                        component={AddTaskScreen}
                        options={{ title: 'Add Task' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AppErrorBoundary>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        padding: Spacing[4],
    },
    errorText: {
        fontSize: FontSizes.lg, 
        marginBottom: Spacing[2],
    },
});
