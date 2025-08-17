import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './app/Login';
import TasksScreen from './app/TasksScreen';

export type RootStackParamList = {
  Login: undefined;
  Tasks: { filter?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}
