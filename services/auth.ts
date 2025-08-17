import api from '../api';

export interface LoginResponse {
    success: boolean;
    access_token: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await api.post<LoginResponse>(
            '/api/auth/login', 
            formData, 
            { headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error('Login failed. Please check your credentials.');
    }
}
