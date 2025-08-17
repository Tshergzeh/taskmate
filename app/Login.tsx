import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import React, { useState, useRef } from 'react';
import { Colors, Spacing, Radius, FontSizes } from '../theme';
import { login } from '../services/auth';
import { saveToken } from '../services/storage';
import api from '../api';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    try {
      const response = await login(username.trim(), password.trim());
      await saveToken(response.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.access_token}`;
      navigation.replace('Tasks');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
        <TextInput 
          style={styles.input}
          placeholder='Username'
          placeholderTextColor={Colors.placeholder}
          textContentType='username'
          value={username}
          onChangeText={setUsername}
          returnKeyType='next'
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextInput 
          ref={passwordRef}
          style={styles.input}
          placeholder='Password'
          placeholderTextColor={Colors.placeholder}
          secureTextEntry
          textContentType='password'
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={handleLogin}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing[4],
  },
  text: {
    color: Colors.text,
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    marginBottom: Spacing[4],
  },
  input: {
    width: '100%',
    borderWidth: 1,
    padding: 12,
    marginBottom: Spacing[3],
    borderRadius: Radius.md,
    borderColor: Colors.gray[300],
    color: Colors.text,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: Radius.lg,
  },
  buttonText: {
    color: Colors.text,
    textAlign: 'center',
  },
});
