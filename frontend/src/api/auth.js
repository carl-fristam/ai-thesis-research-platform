import client from './client';

export const login = async (username, password) => {
    const response = await client.post('/auth/login', { username, password });
    return response.data;
};

export const register = async (username, password) => {
    const response = await client.post('/auth/register', { username, password });
    return response.data;
};
