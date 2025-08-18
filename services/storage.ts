import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'userToken';

export async function saveToken(token: string) {
    try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
        console.error('Failed to save token:', error);
        throw new Error('Failed to save token. Please try again.')
    }
}

export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error('Failed to delete token:', error);
        throw new Error('Failed to delete token.');
    }
}
