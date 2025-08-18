import api from '../api';

export interface Task {
    success: boolean;
    tasks: Array<{
        id: string;
        title: string;
        description?: string;
        is_completed: boolean;
        due_date?: string;
        created_at: string;
        owner: string;
        updated_at: string;
    }>;
};

type CreateTaskInput = {
    title: string;
    description?: string;
    is_completed: boolean;
    due_date?: string;
};

export async function fetchTasks(): Promise<Task> {
    try {
        const response = await api.get<Task>('/api/tasks');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tasks:', error);
        throw new Error('Failed to fetch tasks. Please try again later.');
    }
};

export async function createTask(task: CreateTaskInput) {
    try {
        const response = await api.post('/api/tasks', task);
        return response.data;
    } catch (error) {
        console.error('Failed to create task:', error);
        throw new Error('Failed to create task. Please try again.');
    }
}
